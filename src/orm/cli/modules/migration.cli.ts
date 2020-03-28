import { Logger } from '@opdb/base';
import CliTable from 'cli-table';
import commandLineArgs from 'command-line-args';
import * as fs from 'fs';
import path from 'path';
import dasherize from 'string-dasherize';
import { MigrationRunner } from '../../migration-runner.class';
import { Migration } from '../../migration.class';

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

    default:
      throw new Error(`opdb migration: Unsupported command "${firstOption.command}". Supported commands: generate`);
  }
}

async function generateMigration(argv: string[]) {
  const options = commandLineArgs([
    { name: 'migrationName', defaultOption: true },
    { name: 'srcDirectory', alias: 'd', type: String, defaultValue: './' },
  ], { argv });

  if (options.migrationName == null) {
    throw new Error(`opdb migration generate: Please specify your migration name like this: opdb migration generate YourMigrationName`);
  }

  // Read migration template, replace '__MIGRRATION_NAME__' with option.migrationName
  const srcDirectoryPath = path.resolve(path.relative(process.cwd(), options.srcDirectory));
  const templateDirectoryPath = path.resolve(path.relative(process.cwd(), './node_modules/@opdb/orm/cli/modules/migration'));
  const templateContents = fs.readFileSync(`${templateDirectoryPath}/migration.template._ts`).toString();

  // Create migration file
  // tslint:disable-next-line:no-magic-numbers
  const timestampPrefix = Math.floor(Date.now() / 1000);
  const fileName = `${srcDirectoryPath}/db/migrate/${timestampPrefix}-${dasherize(options.migrationName)}.ts`.replace('--', '-');
  fs.writeFileSync(
    fileName,
    templateContents.replace('__MIGRATION_NAME__', options.migrationName),
  );
  Logger.debug(`Create ${fileName}`);
}

async function runMigrations(argv: string[]) {
  const options = commandLineArgs([
    { name: 'srcDirectory', alias: 'd', type: String, defaultValue: './' },
  ], { argv });

  const srcDirectoryPath = path.resolve(path.relative(process.cwd(), options.srcDirectory));

  // Import database configuration
  Logger.debug(`Initializing database connection using "${srcDirectoryPath}/db/init.ts"...`);
  require(`${srcDirectoryPath}/db/init.ts`);
  const runner = new MigrationRunner();

  // Find + apply all migrations
  const migrations = loadMigrationFiles(srcDirectoryPath);
  await runner.applyAll(migrations);
}

async function getMigrationStatus(argv: string[]) {
  const options = commandLineArgs([
    { name: 'srcDirectory', alias: 'd', type: String, defaultValue: './' },
  ], { argv });

  const srcDirectoryPath = path.resolve(path.relative(process.cwd(), options.srcDirectory));

  // Import database configuration
  Logger.debug(`Initializing database connection using "${srcDirectoryPath}/db/init.ts"...`);
  require(`${srcDirectoryPath}/db/init.ts`);
  const runner = new MigrationRunner();

  // Find all migrations
  const migrations = loadMigrationFiles(srcDirectoryPath);

  // Get migration status
  const data = await runner.migrationStatus(migrations);
  const table = new CliTable({
    head: ['ID', 'Migration Class', 'Status'],
  });
  table.push(...data.map(d => [
    d.id,
    d.migration == null ? 'n/a' : d.migration.constructor.name,
    d.status,
  ]));

  // Print out migration status
  // tslint:disable-next-line:no-console
  console.log(table.toString());
}

function loadMigrationFiles(srcDirectoryPath: string) {
  const files = fs.readdirSync(`${srcDirectoryPath}/db/migrate`);
  const migrations: Array<{ id: string, migration: Migration }> = [];
  Logger.debug(`Loading migrations from "${srcDirectoryPath}/db/migrate"...`);
  for (const file of files.filter(f => f.endsWith('.ts'))) {
    let imported: { [name: string]: unknown };
    try {
      imported = require(`${srcDirectoryPath}/db/migrate/${file}`);
    } catch (e) {
      Logger.error(`Cannot import "${srcDirectoryPath}/db/migrate/${file}"`);
      throw e;
    }

    // Iterate over imported object, check for functions and if instanceof Migration
    for (const key in imported) {
      if (typeof imported[key] === 'function') {
        const migration = new (imported[key] as new () => unknown)();
        if (migration instanceof Migration) {
          const id = file.split('-')[0];
          if (id == null) {
            continue;
          }
          migrations.push({ id, migration });
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
