import { Base } from '@opdb/base';
import { providePostgresConnection } from '@opdb/postgres';
import { readFileSync, symlinkSync, writeFileSync } from 'fs';
import mkdirp from 'mkdirp';
import mockArgv from 'mock-argv';
import { mockCwd, MockedCurrentWorkingDirectory } from 'mock-cwd';
import { resolve } from 'path';
import { expectFileContents, fileExists } from '../../../../tests/expect-files';
import { CliException } from '../../exceptions/cli.exception';
import { cli } from '../cli-handler.func';

describe('cli/migration', () => {
  let mock: MockedCurrentWorkingDirectory;

  const relativePath = (path: string) => resolve(process.cwd(), path);

  const generateBaseFiles = async (srcDirectory: string = './') => {
    // Add @opdb/orm as symlink
    await mkdirp(relativePath(`node_modules/@opdb`));
    symlinkSync(resolve(__dirname, '../../'), relativePath('node_modules/@opdb/orm'));

    // Create base files (stub)
    await mkdirp(relativePath(`${srcDirectory}db`));
    await mkdirp(relativePath(`${srcDirectory}db/migrate`));
    writeFileSync(
      relativePath(`${srcDirectory}db/init.ts`),
      'console.log(\'Imported stub file, using providePostgresConnection of test suite\');',
    );
  };

  const generateMigrationFile = (migrationFileName: string, contents: string, srcDirectory: string = './') => {
    writeFileSync(
      relativePath(`${srcDirectory}db/migrate/${migrationFileName}.ts`),
      contents,
    );
  };

  const getMigrationVersion = async () => {
    const result = await Base.execute<{ version: string }>(`SELECT version FROM schema_migrations ORDER BY version DESC`);
    return result[0] == undefined ? undefined : result[0].version;
  };

  beforeEach(async () => {
    mock = mockCwd();
    providePostgresConnection({
      connectionString: process.env.TEST_PG_DB_URL,
    });

    // Remove existing records
    const records = await Base.execute<{ table_name: string }>(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = $schema`,
      { schema: 'public' },
    );
    await Promise.all(
      records.map(record => Base.execute(`DROP TABLE "${record.table_name}"`)),
    );
  });

  afterEach(() => {
    mock.restore();
    Base.connectionPool.reset();
  });

  describe('generate', () => {
    it('should generate a new migration file', async () => {
      await generateBaseFiles();
      await mockArgv(['migration', 'generate', 'ExampleMigration'], async () => {
        let timestampPrefix = Math.floor(Date.now() / 1000);
        await expect(cli()).resolves.toBeUndefined();

        // Check if migration file has been created
        if (!fileExists(relativePath(`db/migrate/${timestampPrefix}-example-migration.ts`))) {
          timestampPrefix++;
          if (!fileExists(relativePath(`db/migrate/${timestampPrefix}-example-migration.ts`))) {
            throw new Error(`Expected generated file does not exist or was not created within the last 1 second.`);
          }
        }
        expectFileContents(
          relativePath(`db/migrate/${timestampPrefix}-example-migration.ts`),
          readFileSync(resolve(__dirname, './init/postgres.template._ts'), { encoding: 'utf-8' })
            .replace('__MIGRATION_NAME__', 'ExampleMigration'),
        );
      });
    });

    it('should generate a new migration file with custom source folder', async () => {
      await generateBaseFiles('./custom-source/');
      await mockArgv(['migration', 'generate', 'ExampleMigration', '--srcDirectory', './custom-source'], async () => {
        let timestampPrefix = Math.floor(Date.now() / 1000);
        await expect(cli()).resolves.toBeUndefined();

        // Check if migration file has been created
        if (!fileExists(relativePath(`custom-source/db/migrate/${timestampPrefix}-example-migration.ts`))) {
          timestampPrefix++;
          if (!fileExists(relativePath(`custom-source/db/migrate/${timestampPrefix}-example-migration.ts`))) {
            throw new Error(`Expected generated file does not exist or was not created within the last 1 second.`);
          }
        }
        expectFileContents(
          relativePath(`custom-source/db/migrate/${timestampPrefix}-example-migration.ts`),
          readFileSync(resolve(__dirname, './init/postgres.template._ts'), { encoding: 'utf-8' })
            .replace('__MIGRATION_NAME__', 'ExampleMigration'),
        );
      });
    });

    it('should throw when avoiding the migration name', async () => {
      await generateBaseFiles('./custom-source/');
      await mockArgv(['migration', 'generate'], async () => {
        await expect(cli()).rejects.toThrowError(CliException);
      });
    });
  });

  describe('runMigrations', () => {
    it('should run all migrations inside the db/migrate directory', async () => {
      await generateBaseFiles();
      generateMigrationFile('1-example-migration', migrationContent('ExampleMigration'));

      await mockArgv(['migration', 'run'], async () => {
        await expect(cli()).resolves.toBeUndefined();
        expect(await getMigrationVersion()).toBe('1');
      });
    });

    it('should run all migrations inside the db/migrate directory with custom source folder', async () => {
      await generateBaseFiles('./custom-source/');
      generateMigrationFile('1-example-migration', migrationContent('ExampleMigration'), './custom-source/');

      await mockArgv(['migration', 'run', '--srcDirectory', './custom-source'], async () => {
        await expect(cli()).resolves.toBeUndefined();
        expect(await getMigrationVersion()).toBe('1');
      });
    });
  });

  describe('revert', () => {
    it('should revert the latest migration file inside the db/migrate directory', async () => {
      await generateBaseFiles();
      generateMigrationFile('1-example-migration', migrationContent('ExampleMigration1'));
      generateMigrationFile('2-example-migration', migrationContent('ExampleMigration2'));
      generateMigrationFile('3-example-migration', migrationContent('ExampleMigration3'));

      // Run migrations first
      await mockArgv(['migration', 'run'], async () => {
        await expect(cli()).resolves.toBeUndefined();
        expect(await getMigrationVersion()).toBe('3');
      });

      // Revert latest migration
      await mockArgv(['migration', 'revert'], async () => {
        await expect(cli()).resolves.toBeUndefined();
        expect(await getMigrationVersion()).toBe('2');
      });
    });

    it('should revert until the specified migration file inside the db/migrate directory', async () => {
      await generateBaseFiles();
      generateMigrationFile('1-example-migration', migrationContent('ExampleMigration1'));
      generateMigrationFile('2-example-migration', migrationContent('ExampleMigration2'));
      generateMigrationFile('3-example-migration', migrationContent('ExampleMigration3'));

      // Run migrations first
      await mockArgv(['migration', 'run'], async () => {
        await expect(cli()).resolves.toBeUndefined();
        expect(await getMigrationVersion()).toBe('3');
      });

      // Revert latest migration
      await mockArgv(['migration', 'revert', '--until', '2'], async () => {
        await expect(cli()).resolves.toBeUndefined();
        expect(await getMigrationVersion()).toBe('1');
      });
    });

    it('should revert the latest migration file inside the db/migrate directory with custom source folder', async () => {
      await generateBaseFiles('./custom-source/');
      generateMigrationFile('1-example-migration', migrationContent('ExampleMigration1'), './custom-source/');
      generateMigrationFile('2-example-migration', migrationContent('ExampleMigration2'), './custom-source/');
      generateMigrationFile('3-example-migration', migrationContent('ExampleMigration3'), './custom-source/');

      // Run migrations first
      await mockArgv(['migration', 'run', '--srcDirectory', './custom-source'], async () => {
        await expect(cli()).resolves.toBeUndefined();
        expect(await getMigrationVersion()).toBe('3');
      });

      // Revert latest migration
      await mockArgv(['migration', 'revert', '--srcDirectory', './custom-source'], async () => {
        await expect(cli()).resolves.toBeUndefined();
        expect(await getMigrationVersion()).toBe('2');
      });
    });

    it('should revert until the specified migration file inside the db/migrate directory with custom source folder', async () => {
      await generateBaseFiles('./custom-source/');
      generateMigrationFile('1-example-migration', migrationContent('ExampleMigration1'), './custom-source/');
      generateMigrationFile('2-example-migration', migrationContent('ExampleMigration2'), './custom-source/');
      generateMigrationFile('3-example-migration', migrationContent('ExampleMigration3'), './custom-source/');

      // Run migrations first
      await mockArgv(['migration', 'run', '--srcDirectory', './custom-source'], async () => {
        await expect(cli()).resolves.toBeUndefined();
        expect(await getMigrationVersion()).toBe('3');
      });

      // Revert latest migration
      await mockArgv(['migration', 'revert', '--until', '2', '--srcDirectory', './custom-source'], async () => {
        await expect(cli()).resolves.toBeUndefined();
        expect(await getMigrationVersion()).toBe('1');
      });
    });
  });

  describe('status', () => {
    it('should not throw when trying to print the status', async () => {
      await generateBaseFiles();
      generateMigrationFile('1-example-migration', migrationContent('ExampleMigration1'));
      generateMigrationFile('2-example-migration', migrationContent('ExampleMigration2'));
      generateMigrationFile('3-example-migration', migrationContent('ExampleMigration3'));

      // Run migrations first
      await mockArgv(['migration', 'run'], async () => {
        await expect(cli()).resolves.toBeUndefined();
        expect(await getMigrationVersion()).toBe('3');
      });

      // Create one version only present in database
      await Base.execute('INSERT INTO schema_migrations (version) VALUES ($version)', { version: '4' });

      await mockArgv(['migration', 'status'], async () => {
        await expect(cli()).resolves.toBeUndefined();
      });
    });

    it('should not throw when trying to print the status with custom source folder', async () => {
      await generateBaseFiles('./custom-source/');
      generateMigrationFile('1-example-migration', migrationContent('ExampleMigration1'), './custom-source/');

      // Run migrations first
      await mockArgv(['migration', 'run', '--srcDirectory', './custom-source'], async () => {
        await expect(cli()).resolves.toBeUndefined();
        expect(await getMigrationVersion()).toBe('1');
      });

      await mockArgv(['migration', 'status', '--srcDirectory', './custom-source'], async () => {
        await expect(cli()).resolves.toBeUndefined();
      });
    });
  });

  describe('loadMigrationFiles', () => {
    it('should throw if a ts file cannot be imported', async () => {
      await generateBaseFiles();
      generateMigrationFile('1-invalid-migration', `
        import { Pkg } from 'unknown-package';
        export class Test extends Pkg {}
      `);
      await mockArgv(['migration', 'run'], async () => {
        await expect(cli()).rejects.toThrowError(CliException);
      });
    });

    it('should not throw if the imported ts file includes constant', async () => {
      await generateBaseFiles();
      generateMigrationFile('1-invalid-migration', `
        export const temp = 'This is a temp variable';
      `);
      await mockArgv(['migration', 'run'], async () => {
        await expect(cli()).resolves.toBeUndefined();
      });
    });

    it('should not throw if the imported ts file includes classes that are not extending Migration base class', async () => {
      await generateBaseFiles();
      generateMigrationFile('1-invalid-migration', `
        export class InvalidMigration {
          public async up(): Promise<void> {
            // Add your operations here for applying a new database state.
            // Example: this.addTable(...);
          }
        
          public async down(): Promise<void> {
            // Add your operations here for restoring the previous database state.
            // Example: this.dropTable(...);
          }
        }
      `);
      await mockArgv(['migration', 'run'], async () => {
        await expect(cli()).resolves.toBeUndefined();
      });
    });

    it('should not throw if the imported ts file\'s name does not contain an version', async () => {
      await generateBaseFiles();
      generateMigrationFile('invalid-migration', migrationContent('InvalidMigration'));
      await mockArgv(['migration', 'run'], async () => {
        await expect(cli()).resolves.toBeUndefined();
      });
    });
  });

  describe('wrong operations', () => {
    it('should throw when trying to access a wrong operation', async () => {
      await mockArgv(['migration', 'wrong-operation'], async () => {
        await expect(cli()).rejects.toThrowError(CliException);
      });
    });
  });
});

const migrationContent = (migrationName: string) => `
  import { Migration } from '@opdb/orm';

  export class ${migrationName} extends Migration {
    public async up(): Promise<void> {
      // Add your operations here for applying a new database state.
      // Example: this.addTable(...);
    }
  
    public async down(): Promise<void> {
      // Add your operations here for restoring the previous database state.
      // Example: this.dropTable(...);
    }
  }
`;
