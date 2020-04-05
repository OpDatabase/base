import { Base } from '@opdb/base';
import { provideMysqlConnection } from '@opdb/mysql';
import { providePostgresConnection } from '@opdb/postgres';
import { MigrationException } from './exceptions/migration.exception';
import { MigrationStatusCode } from './interfaces/migration-status.interface';
import { MigrationRunner } from './migration-runner.class';
import { Migration } from './migration.class';

class TestMigration extends Migration {
  public async up(): Promise<void> {
    // Intentionally blank
  }

  public async down(): Promise<void> {
    // Intentionally blank
  }
}

function buildExampleMigration(tableName: string): typeof TestMigration {
  class ExampleMigration extends Migration {
    public async up(): Promise<void> {
      this.createTable(tableName);
    }

    public async down(): Promise<void> {
      this.dropTable(tableName);
    }
  }

  return ExampleMigration;
}

function migrationRunnerTest(name: string, databaseConnectionProvider: () => void) {
  describe(`MigrationRunner (${name})`, () => {
    let runner: MigrationRunner;

    beforeEach(async () => {
      runner = new MigrationRunner();

      // Remove all tables from the database
      const migration = new TestMigration();
      const tables = await migration.tables();
      await Promise.all(
        tables.map(tableName => migration.dropTable(tableName)),
      );
    });

    beforeAll(async () => {
      databaseConnectionProvider();
    });

    afterAll(async () => {
      Base.connectionPool.reset();
    });

    describe('apply', () => {
      it('should run the up() method of the given migration', async () => {
        const migration = new TestMigration();
        const spy = jest.spyOn(migration, 'up');

        await runner.apply(migration);
        expect(spy).toBeCalledTimes(1);
      });
    });

    describe('revert', () => {
      it('should run the down() method of the given migration', async () => {
        const migration = new TestMigration();
        const spy = jest.spyOn(migration, 'down');

        await runner.revert(migration);
        expect(spy).toBeCalledTimes(1);
      });
    });

    describe('applyAll', () => {
      it('should apply a given ', async () => {
        const ExampleMigration = buildExampleMigration('example_table');
        // Run migrations
        await runner.applyAll([
          { migration: new ExampleMigration(), version: '1' },
        ]);

        // Check for migration result
        const handler = new ExampleMigration();
        const tables = await handler.tables();
        expect(tables).toContainEqual('schema_migrations');
        expect(tables).toContainEqual('example_table');
        const versions = await handler.execute<{ version: string }>('SELECT version FROM schema_migrations ORDER BY version DESC');
        expect(versions.length).toBe(1);
        expect(versions[0].version).toBe('1');
      });
    });

    describe('revertUntil', () => {
      it('should revert the migrations until a given version', async () => {
        const ExampleMigration1 = buildExampleMigration('example_table1');
        const ExampleMigration2 = buildExampleMigration('example_table2');
        const migrationFiles = [
          { migration: new ExampleMigration1(), version: '1' },
          { migration: new ExampleMigration2(), version: '2' },
        ];

        // Run migrations
        await runner.applyAll(migrationFiles);

        // Check for migration result
        const handler = new ExampleMigration1();
        const tables = await handler.tables();
        expect(tables.length).toBe(3);
        expect(tables).toContainEqual('schema_migrations');
        expect(tables).toContainEqual('example_table1');
        expect(tables).toContainEqual('example_table2');

        // Revert migrations until 1
        await runner.revertUntil(migrationFiles, '1');

        // Check for migration result
        const tablesAfter = await handler.tables();
        expect(tablesAfter.length).toBe(1);
        expect(tablesAfter).toContainEqual('schema_migrations');
        const versions = await handler.execute<{ version: string }>('SELECT version FROM schema_migrations ORDER BY version DESC');
        expect(versions.length).toBe(0);
      });

      it('should revert the last migration if nothing has been explicitly specified', async () => {
        const ExampleMigration1 = buildExampleMigration('example_table1');
        const ExampleMigration2 = buildExampleMigration('example_table2');
        const migrationFiles = [
          { migration: new ExampleMigration1(), version: '1' },
          { migration: new ExampleMigration2(), version: '2' },
        ];

        // Run migrations
        await runner.applyAll(migrationFiles);

        // Check for migration result
        const handler = new ExampleMigration1();
        const tables = await handler.tables();
        expect(tables.length).toBe(3);
        expect(tables).toContainEqual('schema_migrations');
        expect(tables).toContainEqual('example_table1');
        expect(tables).toContainEqual('example_table2');

        // Revert previous migration
        await runner.revertUntil(migrationFiles);

        // Check for migration result
        const tablesAfter = await handler.tables();
        expect(tablesAfter.length).toBe(2);
        expect(tablesAfter).toContainEqual('schema_migrations');
        expect(tablesAfter).toContainEqual('example_table1');
        const versions = await handler.execute<{ version: string }>('SELECT version FROM schema_migrations ORDER BY version DESC');
        expect(versions.length).toBe(1);
        expect(versions[0].version).toBe('1');
      });

      it('should not fail if there are no migrations given', async () => {
        // Revert previous migration
        await expect(runner.revertUntil([])).resolves.toBeUndefined();
      });

      it('should fail if there are database-only migrations present', async () => {
        const ExampleMigration1 = buildExampleMigration('example_table1');
        const ExampleMigration2 = buildExampleMigration('example_table2');
        const migrationFiles = [
          { migration: new ExampleMigration1(), version: '1' },
          { migration: new ExampleMigration2(), version: '2' },
        ];

        // Run migrations
        await runner.applyAll(migrationFiles);

        // Check for migration result
        const handler = new ExampleMigration1();
        const tables = await handler.tables();
        expect(tables.length).toBe(3);
        expect(tables).toContainEqual('schema_migrations');
        expect(tables).toContainEqual('example_table1');
        expect(tables).toContainEqual('example_table2');

        // Insert fake version into schema_migrations
        await handler.execute('INSERT INTO schema_migrations (version) VALUES ($version)', { version: '3' });

        // Revert migrations until 2
        await expect(runner.revertUntil(migrationFiles, '2')).rejects.toThrowError(MigrationException);
      });
    });

    describe('migrationStatus', () => {
      it('should return migrations in their numeric order', async () => {
        const ExampleMigration1 = buildExampleMigration('example_table1');
        const ExampleMigration2 = buildExampleMigration('example_table2');
        const migrationFiles = [
          { migration: new ExampleMigration1(), version: '1' },
          { migration: new ExampleMigration2(), version: '2' },
        ];

        // Run migrations
        await runner.applyAll([{ migration: new ExampleMigration1(), version: '1' }]);

        // Insert fake version into schema_migrations
        const handler = new ExampleMigration1();
        await handler.execute('INSERT INTO schema_migrations (version) VALUES ($version)', { version: '0' });

        // Get migration status
        const result = await runner.migrationStatus(migrationFiles);
        expect(result.length).toBe(3);
        expect(result[0]).toStrictEqual({ version: '0', status: MigrationStatusCode.database });
        expect(result[1]).toStrictEqual({ version: '1', migration: new ExampleMigration1(), status: MigrationStatusCode.inSync });
        expect(result[2]).toStrictEqual({ version: '2', migration: new ExampleMigration2(), status: MigrationStatusCode.local });
      });
    });
  });
}

migrationRunnerTest('Postgres', () => {
  providePostgresConnection({
    connectionString: process.env.TEST_PG_DB_URL,
  });
});

migrationRunnerTest('MySQL', () => {
  provideMysqlConnection({
    url: process.env.TEST_MYSQL_DB_URL,
  });
});
