import { Base } from '@opdb/base';
import { providePostgresConnection } from '@opdb/postgres';
import { MockMigrationHandler } from '../../tests/mock-migration-handler';
import { DataType } from './interfaces/data-type.enum';
import { Migration } from './migration.class';

class TestMigration extends Migration {
  public async down(): Promise<void> {
    // Intentionally blank
  }

  public async up(): Promise<void> {
    // Intentionally blank
  }
}

describe('Migration', () => {
  let instance: Migration;

  const expectParamsPassed = (methodName: keyof TestMigration, ...params: unknown[]) => {
    expect(MockMigrationHandler.lastCalledMethod[MockMigrationHandler.lastCalledMethod.length - 1]).toBe(methodName);
    expect(MockMigrationHandler.lastCalledArgs[MockMigrationHandler.lastCalledArgs.length - 1]).toMatchObject(params);
  };

  beforeAll(async () => {
    providePostgresConnection({
      connectionString: process.env.TEST_PG_DB_URL,
    });
  });

  afterAll(async () => {
    Base.connectionPool.reset();
  });

  beforeEach(async () => {
    instance = new TestMigration();

    // Overwrite built-in adapter
    ((instance as unknown) as { internalHandler: MockMigrationHandler }).internalHandler = new MockMigrationHandler();
  });

  describe('pass arguments to internalHandler', () => {
    it('should pass arguments of addColumn', async () => {
      await instance.addColumn('tableName', 'columnName', DataType.string, { limit: 1 });
      expectParamsPassed('addColumn', 'tableName', 'columnName', DataType.string, { limit: 1 });

      await instance.addColumn('tableName', 'columnName', DataType.decimal, { limit: 1, precision: 1 });
      expectParamsPassed('addColumn', 'tableName', 'columnName', DataType.decimal, { limit: 1, precision: 1 });

      await instance.addColumn('tableName', 'columnName', DataType.string);
      expectParamsPassed('addColumn', 'tableName', 'columnName', DataType.string, {});
    });

    it('should pass arguments of addIndex', async () => {
      await instance.addIndex('tableName', ['columnName'], { name: 'optionalName' });
      expectParamsPassed('addIndex', 'tableName', ['columnName'], { name: 'optionalName' });

      await instance.addIndex('tableName', 'columnName', { name: 'optionalName' });
      expectParamsPassed('addIndex', 'tableName', ['columnName'], { name: 'optionalName' });

      await instance.addIndex('tableName', ['columnName']);
      expectParamsPassed('addIndex', 'tableName', ['columnName'], {});

      await instance.addIndex('tableName', 'columnName');
      expectParamsPassed('addIndex', 'tableName', ['columnName'], {});
    });

    it('should pass arguments of addTimestamps', async () => {
      await instance.addTimestamps('tableName');
      expect(MockMigrationHandler.lastCalledMethod[MockMigrationHandler.lastCalledMethod.length - 2]).toBe('addColumn');
      expect(MockMigrationHandler.lastCalledArgs[MockMigrationHandler.lastCalledArgs.length - 2]).toMatchObject(['tableName', 'created_at', DataType.datetime, {}]);
      expect(MockMigrationHandler.lastCalledMethod[MockMigrationHandler.lastCalledMethod.length - 1]).toBe('addColumn');
      expect(MockMigrationHandler.lastCalledArgs[MockMigrationHandler.lastCalledArgs.length - 1]).toMatchObject(['tableName', 'updated_at', DataType.datetime, {}]);
    });

    it('should pass arguments of changeColumnDefault', async () => {
      await instance.changeColumnDefault('tableName', 'columnName', 1);
      expectParamsPassed('changeColumnDefault', 'tableName', 'columnName', 1);

      await instance.changeColumnDefault('tableName', 'columnName', null);
      expectParamsPassed('changeColumnDefault', 'tableName', 'columnName', null);
    });

    it('should pass arguments of changeColumnNull', async () => {
      await instance.changeColumnNull('tableName', 'columnName', true);
      expectParamsPassed('changeColumnNull', 'tableName', 'columnName', true, undefined);

      await instance.changeColumnNull('tableName', 'columnName', false, 1);
      expectParamsPassed('changeColumnNull', 'tableName', 'columnName', false, 1);
    });

    it('should pass arguments of createJoinTable', async () => {
      const cb = () => 'Hello World';

      await instance.createJoinTable('table1', 'table2', { tableName: 'joinTableName' }, cb);
      expectParamsPassed('createJoinTable', 'table1', 'table2', { tableName: 'joinTableName' }, cb);

      await instance.createJoinTable('table1', 'table2', { tableName: 'joinTableName' });
      expectParamsPassed('createJoinTable', 'table1', 'table2', { tableName: 'joinTableName' }, expect.any(Function));

      await instance.createJoinTable('table1', 'table2', cb);
      expectParamsPassed('createJoinTable', 'table1', 'table2', {}, cb);

      await instance.createJoinTable('table1', 'table2');
      expectParamsPassed('createJoinTable', 'table1', 'table2', {}, expect.any(Function));
    });

    it('should pass arguments of createTable', async () => {
      const cb = () => 'Hello World';

      await instance.createTable('tableName', { id: false }, cb);
      expectParamsPassed('createTable', 'tableName', { id: false }, cb);

      await instance.createTable('tableName', { id: false });
      expectParamsPassed('createTable', 'tableName', { id: false }, expect.any(Function));

      await instance.createTable('tableName', cb);
      expectParamsPassed('createTable', 'tableName', {}, cb);

      await instance.createTable('tableName');
      expectParamsPassed('createTable', 'tableName', {}, expect.any(Function));
    });

    it('should pass arguments of dropJoinTable', async () => {
      await instance.dropJoinTable('table1', 'table2', { tableName: 'joinTableName' });
      expectParamsPassed('dropJoinTable', 'table1', 'table2', { tableName: 'joinTableName' });

      await instance.dropJoinTable('table1', 'table2');
      expectParamsPassed('dropJoinTable', 'table1', 'table2', {});
    });

    it('should pass arguments of dropJoinTable', async () => {
      await instance.dropTable('table1', { ifExists: true });
      expectParamsPassed('dropTable', 'table1', { ifExists: true });

      await instance.dropTable('table1');
      expectParamsPassed('dropTable', 'table1', {});
    });

    it('should pass arguments of removeColumn', async () => {
      await instance.removeColumn('tableName', 'columnName');
      expectParamsPassed('removeColumns', 'tableName', 'columnName');
    });

    it('should pass arguments of removeColumns', async () => {
      await instance.removeColumns('tableName', 'columnName', 'columnName2');
      expectParamsPassed('removeColumns', 'tableName', 'columnName', 'columnName2');
    });

    it('should pass arguments of removeIndex', async () => {
      await instance.removeIndex('tableName', ['columnName'], { name: 'indexName' });
      expectParamsPassed('removeIndex', 'tableName', ['columnName'], { name: 'indexName' });

      await instance.removeIndex('tableName', 'columnName', { name: 'indexName' });
      expectParamsPassed('removeIndex', 'tableName', ['columnName'], { name: 'indexName' });

      await instance.removeIndex('tableName', ['columnName']);
      expectParamsPassed('removeIndex', 'tableName', ['columnName'], {});

      await instance.removeIndex('tableName', 'columnName');
      expectParamsPassed('removeIndex', 'tableName', ['columnName'], {});
    });

    it('should pass arguments of removeTimestamps', async () => {
      await instance.removeTimestamps('tableName');
      expectParamsPassed('removeColumns', 'tableName', 'created_at', 'updated_at');
    });

    it('should pass arguments of renameColumn', async () => {
      await instance.renameColumn('tableName', 'columnName', 'newColumnName');
      expectParamsPassed('renameColumn', 'tableName', 'columnName', 'newColumnName');
    });

    it('should pass arguments of renameIndex', async () => {
      await instance.renameIndex('tableName', 'indexName', 'newIndexName');
      expectParamsPassed('renameIndex', 'tableName', 'indexName', 'newIndexName');
    });

    it('should pass arguments of renameTable', async () => {
      await instance.renameTable('tableName', 'newTableName');
      expectParamsPassed('renameTable', 'tableName', 'newTableName');
    });

    it('should pass arguments of tables', async () => {
      await instance.tables();
      expectParamsPassed('tables');
    });

    it('should pass arguments of columnExists', async () => {
      await instance.columnExists('tableName', 'columnName', DataType.string, { limit: 1 });
      expectParamsPassed('columnExists', 'tableName', 'columnName', DataType.string, { limit: 1 });

      await instance.columnExists('tableName', 'columnName', DataType.decimal, { limit: 1, precision: 1 });
      expectParamsPassed('columnExists', 'tableName', 'columnName', DataType.decimal, { limit: 1, precision: 1 });

      await instance.columnExists('tableName', 'columnName', DataType.string);
      expectParamsPassed('columnExists', 'tableName', 'columnName', DataType.string, undefined);

      await instance.columnExists('tableName', 'columnName');
      expectParamsPassed('columnExists', 'tableName', 'columnName', undefined, undefined);
    });

    it('should pass arguments of columns', async () => {
      await instance.columns('tableName');
      expectParamsPassed('columns', 'tableName');
    });

    it('should pass arguments of indexExists', async () => {
      await instance.indexExists('tableName', ['columnName'], { name: 'indexName' });
      expectParamsPassed('indexExists', 'tableName', ['columnName'], { name: 'indexName' });

      await instance.indexExists('tableName', 'columnName', { name: 'indexName' });
      expectParamsPassed('indexExists', 'tableName', ['columnName'], { name: 'indexName' });

      await instance.indexExists('tableName', ['columnName']);
      expectParamsPassed('indexExists', 'tableName', ['columnName'], {});

      await instance.indexExists('tableName', 'columnName');
      expectParamsPassed('indexExists', 'tableName', ['columnName'], {});
    });

    it('should pass arguments of indexes', async () => {
      await instance.indexes('tableName');
      expectParamsPassed('indexes', 'tableName');
    });

    it('should pass arguments of tableExists', async () => {
      await instance.tableExists('tableName');
      expectParamsPassed('tableExists', 'tableName');
    });
  });
});
