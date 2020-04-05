import { Logger } from '@opdb/base';
import chalk from 'chalk';
import commandLineArgs from 'command-line-args';
import { closeSync, openSync, readFileSync, writeFileSync } from 'fs';
import mkdirp from 'mkdirp';
import { resolve } from 'path';
import { CliException } from '../../exceptions/cli.exception';
import { getPath, logFileCreated } from '../helper/cli-helper.func';

async function handler(argv: string[]) {
  const options = commandLineArgs([
    { name: 'adapter', alias: 'a', type: String },
    { name: 'srcDirectory', alias: 'd', type: String, defaultValue: './' },
  ], { argv });

  // Create database folder
  const srcDirectoryPath = getPath(options.srcDirectory as string);
  await mkdirp(`${srcDirectoryPath}/db`);
  logFileCreated(`${srcDirectoryPath}/db`);
  await mkdirp(`${srcDirectoryPath}/db/migrate`);
  logFileCreated(`${srcDirectoryPath}/db/migrate`);
  closeSync(openSync(`${srcDirectoryPath}/db/migrate/.keep`, 'w'));
  logFileCreated(`${srcDirectoryPath}/db/migrate/.keep`);

  const requiredPackages: string[] = [];

  // Create config file for adapter
  switch (options.adapter) {
    case 'postgres':
      writeFileSync(
        `${srcDirectoryPath}/db/init.ts`,
        readFileSync(resolve(__dirname, './init/postgres.template._ts'), { encoding: 'utf-8' }),
      );
      logFileCreated(`${srcDirectoryPath}/db/init.ts`);
      requiredPackages.push('@opdb/postgres');
      break;

    default:
      throw new CliException(`Supplied --adapter "${options.adapter}" is not supported. Use one of the following adapters: postgres`);
  }

  // Final statements
  /* istanbul ignore else */
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
