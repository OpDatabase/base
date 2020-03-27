import { Logger } from '@opdb/base';
import commandLineArgs from 'command-line-args';
import * as fs from 'fs';
import path from 'path';
import dasherize from 'string-dasherize';

async function handler(argv: string[]) {
  const firstOption = commandLineArgs([
    { name: 'command', defaultOption: true },
  ], { argv, stopAtFirstUnknown: true });
  const remainingArgv = firstOption._unknown || [];

  switch (firstOption.command) {
    case 'generate':
      await generateMigration(remainingArgv);
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

export = {
  handler,
};
