import mockArgv from 'mock-argv';
import { CliException } from '../exceptions/cli.exception';
import { cli } from './cli-handler.func';

describe('cli', () => {
  it('should import a built-in module', async () => {
    await mockArgv(['void'], async () => {
      await expect(cli()).resolves.toBeUndefined();
    });
  });

  it('should throw when trying to import a non-existing module', async () => {
    await mockArgv(['nonExistingModule'], async () => {
      await expect(cli()).rejects.toThrowError(CliException);
    });
  });
});
