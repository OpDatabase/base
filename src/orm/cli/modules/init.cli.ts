import { Logger } from '@opdb/base';
import chalk from 'chalk';
import commandLineArgs from 'command-line-args';
import fs from 'fs';
import mkdirp from 'mkdirp';
import path from 'path';

async function handler(argv: string[]) {
  const options = commandLineArgs([
    { name: 'adapter', alias: 'a', type: String },
    { name: 'srcDirectory', alias: 'd', type: String, defaultValue: './' },
  ], { argv });

  // Create database folder
  const srcDirectoryPath = path.resolve(path.relative(process.cwd(), options.srcDirectory));
  const templateDirectoryPath = path.resolve(path.relative(process.cwd(), './node_modules/@opdb/orm/cli/modules/init'));
  Logger.debug(`Create ${srcDirectoryPath}/db`);
  await mkdirp(`${srcDirectoryPath}/db`);
  Logger.debug(`Create ${srcDirectoryPath}/db/migrate`);
  await mkdirp(`${srcDirectoryPath}/db/migrate`);
  Logger.debug(`Create ${srcDirectoryPath}/db/migrate/.keep`);
  fs.closeSync(fs.openSync(`${srcDirectoryPath}/db/migrate/.keep`, 'w'));

  const requiredPackages: string[] = [];

  // Create config file for adapter
  switch (options.adapter) {
    case 'postgres':
      Logger.debug(`Create ${srcDirectoryPath}/db/init.ts`);
      fs.copyFileSync(`${templateDirectoryPath}/postgres.template._ts`, `${srcDirectoryPath}/db/init.ts`);
      requiredPackages.push('@opdb/postgres');
      break;

    default:
      throw new Error(`Supplied --adapter "${options.adapter}" is not supported. Use one of the following adapters: postgres`);
  }

  // Final statements
  if (requiredPackages.length > 0) {
    Logger.info(
      `IMPORTANT: Install the following packages before continuing:`,
      ...requiredPackages.map(p => chalk.bold(p)),
    );
  }
}

export = {
  handler,
};
