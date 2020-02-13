import { Base, ConnectionPool } from '@opdb/base';
import { PoolConnection } from 'mysql';
import { MysqlAdapter } from './mysql.adapter';

describe('MysqlClient', () => {
  describe('execute', () => {
    it('should execute the given SQL statement', async () => {
      // Create connection + client
      const adapter = new MysqlAdapter();
      adapter.loadConfig({ url: process.env.TEST_MYSQL_DB_URL });
      const client = await adapter.getConnection();

      // Execute test
      await client.execute({
        statement: 'CREATE TABLE `test` (`id` INTEGER, `text` VARCHAR(50))',
        inputPlaceholders: {},
        usedPlaceholders: [],
        transposedPlaceholders: [],
      });

      await client.execute({
        statement: 'INSERT INTO `test` (`id`, `text`) VALUES (?, ?)',
        inputPlaceholders: {
          id: 1,
          text: 'Test',
        },
        usedPlaceholders: ['id', 'text'],
        transposedPlaceholders: [1, 'Test'],
      });

      const response = await client.execute({
        statement: 'SELECT * FROM `test` WHERE `id` = ?',
        inputPlaceholders: {
          id: 1,
        },
        usedPlaceholders: ['id'],
        transposedPlaceholders: [1],
      });

      expect(response).toEqual([{ id: 1, text: 'Test' }]);
      client.release();
      await adapter.stop();
    });

    it('should reject if MySQL throws an error', async () => {
      // Create connection + client
      const adapter = new MysqlAdapter();
      adapter.loadConfig({ url: process.env.TEST_MYSQL_DB_URL });
      const client = await adapter.getConnection();

      // Run test
      await expect(client.execute({
        statement: 'INSERT INTO `test_should_fail` (`id`, `text`) VALUES (?, ?)',
        inputPlaceholders: {
          id: 1,
          text: 'Test',
        },
        usedPlaceholders: ['id', 'text'],
        transposedPlaceholders: [1, 'Test'],
      })).rejects.toThrow();

      // Cleanup
      client.release();
      await adapter.stop();
    });
  });

  describe('release', () => {
    it('should stop the client', async () => {
      const adapter = new MysqlAdapter();
      adapter.loadConfig({ url: process.env.TEST_MYSQL_DB_URL });
      const client = await adapter.getConnection();

      // tslint:disable-next-line:no-any
      const nativeReleaseFunction = jest.spyOn(((client as any).nativeConnection as PoolConnection), 'release');
      client.release();
      await adapter.stop();
      expect(nativeReleaseFunction).toBeCalled();
      nativeReleaseFunction.mockRestore();
    });
  });

  describe('placeholderReplacementHandler', () => {
    it('should return the correct replacement', async () => {
      // Initialize test
      const adapter = new MysqlAdapter();
      adapter.loadConfig({ url: process.env.TEST_MYSQL_DB_URL });
      const client = await adapter.getConnection();

      expect(client.placeholderReplacementHandler()).toEqual('?');

      // Cleanup
      client.release();
      await adapter.stop();
    });
  });

  describe('integration with @opdb/base', () => {
    it('should work together with @opdb/base', async () => {
      // Setup adapter
      ConnectionPool.registerAdapter(MysqlAdapter);
      Base.connectionPool.connect({
        adapter: 'mysql',
        url: process.env.TEST_MYSQL_DB_URL,
      });

      await Base.execute('CREATE TABLE `test_integration`(`id` INTEGER, `text` VARCHAR(50))');
      await Base.execute('INSERT INTO `test_integration` (`id`, `text`) VALUES ($id, $text)', { id: 1, text: 'Hello world!' });
      const response = await Base.execute('SELECT * FROM `test_integration` WHERE `id` = $id', { id: 1 });
      expect(response).toEqual([{ id: 1, text: 'Hello world!' }]);

      // Cleanup
      Base.connectionPool.reset();
    });

    it('should handle transactions properly', async () => {
      // Setup adapter
      ConnectionPool.registerAdapter(MysqlAdapter);
      Base.connectionPool.connect({
        adapter: 'mysql',
        url: process.env.TEST_MYSQL_DB_URL,
      });

      await Base.transaction(async () => {
        await Base.execute('CREATE TABLE `test_transaction`(`id` INTEGER, `text` VARCHAR(50))');
        await Base.execute('INSERT INTO `test_transaction` (`id`, `text`) VALUES ($id, $text)', { id: 1, text: 'Hello world!' });
        const response = await Base.execute('SELECT * FROM `test_transaction` WHERE `id` = $id', { id: 1 });
        expect(response).toEqual([{ id: 1, text: 'Hello world!' }]);
      });

      // Cleanup
      Base.connectionPool.reset();
    });
  });
});
