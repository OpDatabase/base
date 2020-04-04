import { Logger } from '@opdb/base';
import CliTable from 'cli-table';
import commandLineArgs from 'command-line-args';
import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import dasherize from 'string-dasherize';
import { CliException } from '../../exceptions/cli.exception';
import { MigrationFile, MigrationStatusCode } from '../../interfaces/migration-status.interface';
import { MigrationRunner } from '../../migration-runner.class';
import { Migration } from '../../migration.class';
import { getPath, logFileCreated } from '../helper/cli-helper.func';

/**
 * Handle calls for migration functions
 * @param argv
 */
async function handler(argv: string[]) {
  const firstOption = commandLineArgs([
    { name: 'command', defaultOption: true },
  ], { argv, stopAtFirstUnknown: true });
  const remainingArgv = firstOption._unknown || [];

  switch (firstOption.command) {
    case 'generate':
      await generateMigration(remainingArgv);
      break;

    case 'run':
      await runMigrations(remainingArgv);
      break;

    case 'status':
      await getMigrationStatus(remainingArgv);
      break;

    case 'revert':
      await revertMigration(remainingArgv);
      break;

    default:
      throw new CliException(`opdb migration: Unsupported command "${firstOption.command}". Supported commands: generate`);
  }
}

/**
 * Generates a new migration file within the user's db/migrate folder.
 * @param argv
 */
async function generateMigration(argv: string[]) {
  const options = commandLineArgs([
    { name: 'migrationName', defaultOption: true },
    { name: 'srcDirectory', alias: 'd', type: String, defaultValue: './' },
  ], { argv });

  if (options.migrationName == null) {
    throw new CliException(`opdb migration generate: Please specify your migration name like this: opdb migration generate YourMigrationName`);
  }

  // Read migration template, replace '__MIGRRATION_NAME__' with option.migrationName
  const srcDirectoryPath = getPath(options.srcDirectory);
  const templateContents = readFileSync(resolve(__dirname, './init/postgres.template._ts'), { encoding: 'utf-8' });

  // Create migration file
  // tslint:disable-next-line:no-magic-numbers
  const timestampPrefix = Math.floor(Date.now() / 1000);
  const fileName = `${srcDirectoryPath}/db/migrate/${timestampPrefix}-${dasherize(options.migrationName)}.ts`.replace('--', '-');
  writeFileSync(
    fileName,
    templateContents.replace('__MIGRATION_NAME__', options.migrationName),
  );
  logFileCreated(fileName);
}

/**
 * Runs all pending migrations
 * @param argv
 */
async function runMigrations(argv: string[]) {
  const options = commandLineArgs([
    { name: 'srcDirectory', alias: 'd', type: String, defaultValue: './' },
  ], { argv });

  const srcDirectoryPath = getPath(options.srcDirectory);
  const runner = initializeMigrationRunner(srcDirectoryPath);

  // Find + apply all migrations
  const migrations = loadMigrationFiles(srcDirectoryPath);
  await runner.applyAll(migrations);
}

async function revertMigration(argv: string[]) {
  const options = commandLineArgs([
    { name: 'srcDirectory', alias: 'd', type: String, defaultValue: './' },
    { name: 'until', alias: 'u', type: String },
  ], { argv });

  const srcDirectoryPath = getPath(options.srcDirectory);
  const runner = initializeMigrationRunner(srcDirectoryPath);

  // Find + apply all migrations
  const migrations = loadMigrationFiles(srcDirectoryPath);
  await runner.revertUntil(migrations, options.until || undefined);
}

/**
 * Outputs the current migration status
 * @param argv
 */
async function getMigrationStatus(argv: string[]) {
  const options = commandLineArgs([
    { name: 'srcDirectory', alias: 'd', type: String, defaultValue: './' },
  ], { argv });

  const srcDirectoryPath = getPath(options.srcDirectory);
  const runner = initializeMigrationRunner(srcDirectoryPath);

  // Find all migrations
  const migrations = loadMigrationFiles(srcDirectoryPath);

  // Get migration status
  const data = await runner.migrationStatus(migrations);
  const table = new CliTable({
    head: ['Version', 'Migration Class', 'Status'],
  });
  table.push(...data.map(d => [
    d.version,
    d.status === MigrationStatusCode.database ? 'n/a' : d.migration.constructor.name,
    d.status,
  ]));

  // Print out migration status
  // tslint:disable-next-line:no-console
  console.log(table.toString());
}

/**
 * Initializes the database migration runner using the user-provided db/init.ts file.
 * @param srcDirectoryPath
 */
function initializeMigrationRunner(srcDirectoryPath: string): MigrationRunner {
  // Import database configuration
  Logger.debug(`Initializing database connection using "${srcDirectoryPath}/db/init.ts"...`);
  require(`${srcDirectoryPath}/db/init.ts`);

  return new MigrationRunner();
}

/**
 * Loads all migration files for the user's db/migrate folder
 * @param srcDirectoryPath
 */
function loadMigrationFiles(srcDirectoryPath: string) {
  const files = readdirSync(`${srcDirectoryPath}/db/migrate`);
  const migrations: MigrationFile[] = [];
  Logger.debug(`Loading migrations from "${srcDirectoryPath}/db/migrate"...`);
  for (const file of files.filter(f => f.endsWith('.ts'))) {
    let imported: { [name: string]: unknown };
    try {
      imported = require(`${srcDirectoryPath}/db/migrate/${file}`);
    } catch (e) {
      throw new CliException(`Cannot import "${srcDirectoryPath}/db/migrate/${file}"`);
    }

    // Iterate over imported object, check for functions and if instanceof Migration
    for (const key in imported) {
      if (typeof imported[key] === 'function') {
        const migration = new (imported[key] as new () => unknown)();
        if (migration instanceof Migration) {
          const version = file.split('-')[0];
          if (isNaN(parseInt(version))) {
            continue;
          }
          migrations.push({ version, migration });
          break;
        }
      }
    }
  }

  return migrations;
}

export = {
  handler,
};
