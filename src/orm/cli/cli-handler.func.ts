import { Logger } from '@opdb/base';
import commandLineArgs from 'command-line-args';
import { CliModule } from './interfaces/cli-module.interface';

export async function cli(): Promise<void> {
  const mainCmd = commandLineArgs([
    { name: 'module', defaultOption: true },
  ], { stopAtFirstUnknown: true });
  const argv = mainCmd._unknown || [];

  // Use first argument as module name
  let importedModule: CliModule;
  try {
    importedModule = require(`./modules/${mainCmd.module}.cli`);
  } catch (e) {
    Logger.error(`Cannot import CLI module "${mainCmd.module}": Module does not exist.`);
    process.exit(1);

    return;
  }

  // Use module to handle CLI command
  const moduleResponse = importedModule.handler(argv);
  if (moduleResponse instanceof Promise) {
    await moduleResponse;
  }
}
