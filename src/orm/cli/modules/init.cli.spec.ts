import { mkdirSync, readFileSync } from 'fs';
import mockArgv from 'mock-argv';
import { mockCwd, MockedCurrentWorkingDirectory } from 'mock-cwd';
import { resolve } from 'path';
import { expectFileContents, expectFileToExist } from '../../../../tests/expect-files';
import { CliException } from '../../exceptions/cli.exception';
import { cli } from '../cli-handler.func';

describe('cli/init', () => {
  let mock: MockedCurrentWorkingDirectory;

  const relativePath = (path: string) => resolve(process.cwd(), path);

  beforeEach(() => {
    mock = mockCwd();
  });

  afterEach(() => {
    mock.restore();
  });

  it('should create a new init file for postgres', async () => {
    await mockArgv(['init', '--adapter', 'postgres'], async () => {
      await expect(cli()).resolves.toBeUndefined();

      expectFileToExist(relativePath('db/init.ts'));
      expectFileContents(
        relativePath('db/init.ts'),
        readFileSync(resolve(__dirname, './init/postgres.template._ts'), { encoding: 'utf-8' }),
      );
      expectFileToExist(relativePath('db/migrate/.keep'));
    });
  });

  it('should create a new init file for postgres with a custom src directory', async () => {
    // Create custom folder
    mkdirSync(relativePath('custom-src'));

    await mockArgv(['init', '--adapter', 'postgres', '--srcDirectory', './custom-src'], async () => {
      await expect(cli()).resolves.toBeUndefined();

      expectFileToExist(relativePath('custom-src/db/init.ts'));
      expectFileContents(
        relativePath('custom-src/db/init.ts'),
        readFileSync(resolve(__dirname, './init/postgres.template._ts'), { encoding: 'utf-8' }),
      );
      expectFileToExist(relativePath('custom-src/db/migrate/.keep'));
    });
  });

  it('should throw when trying to initialize for a non-existing or blank adapter', async () => {
    await mockArgv(['init', '--adapter', 'unknown-adapter'], async () => {
      await expect(cli()).rejects.toThrowError(CliException);
    });
  });
});
