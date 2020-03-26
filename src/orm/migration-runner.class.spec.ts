import { Base } from '@opdb/base';
import { providePostgresConnection } from '@opdb/postgres';
import { MigrationRunner } from './migration-runner.class';
import { Migration } from './migration.class';

class TestMigration extends Migration {
  public async down(): Promise<void> {
    // Intentionally blank
  }

  public async up(): Promise<void> {
    // Intentionally blank
  }
}

describe('MigrationRunner', () => {
  beforeAll(async () => {
    providePostgresConnection({
      connectionString: process.env.TEST_PG_DB_URL,
    });
  });

  afterAll(async () => {
    Base.connectionPool.reset();
  });

  describe('apply', () => {
    it('should run the up() method of the given migration', async () => {
      const migration = new TestMigration();
      const spy = jest.spyOn(migration, 'up');

      const runner = new MigrationRunner();
      await runner.apply(migration);
      expect(spy).toBeCalledTimes(1);
    });
  });

  describe('revert', () => {
    it('should run the down() method of the given migration', async () => {
      const migration = new TestMigration();
      const spy = jest.spyOn(migration, 'down');

      const runner = new MigrationRunner();
      await runner.revert(migration);
      expect(spy).toBeCalledTimes(1);
    });
  });
});
