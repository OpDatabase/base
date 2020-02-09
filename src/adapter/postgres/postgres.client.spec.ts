import { Base, ConnectionPool } from '@opdb/base';
import { PoolClient } from 'pg';
import { PostgresAdapter } from './postgres.adapter';

describe('PostgresClient', () => {
  describe('execute', () => {
    it('should execute the given SQL statement', async () => {
      // Create connection + client
      const adapter = new PostgresAdapter();
      adapter.loadConfig({
        connectionString: process.env.TEST_PG_DB_URL,
      });
      const client = await adapter.getConnection();

      // Execute test
      await client.execute({
        statement: 'CREATE TABLE "test"("id" INTEGER, "text" VARCHAR(50))',
        inputPlaceholders: {},
        usedPlaceholders: [],
        transposedPlaceholders: [],
      });

      await client.execute({
        statement: 'INSERT INTO "test" ("id", "text") VALUES ($1, $2)',
        inputPlaceholders: {
          id: 1,
          text: 'Test',
        },
        usedPlaceholders: ['id', 'text'],
        transposedPlaceholders: [1, 'Test'],
      });

      const response = await client.execute({
        statement: 'SELECT * FROM "test" WHERE "id" = $1',
        inputPlaceholders: {
          id: 1,
        },
        usedPlaceholders: ['id'],
        transposedPlaceholders: [1],
      });

      expect(response.rows).toEqual([{ id: 1, text: 'Test' }]);
      client.release();
      await adapter.stop();
    });
  });

  describe('release', () => {
    it('should stop the client', async () => {
      const adapter = new PostgresAdapter();
      adapter.loadConfig({
        connectionString: process.env.TEST_PG_DB_URL,
      });
      const client = await adapter.getConnection();
      // tslint:disable-next-line:no-any
      const nativeReleaseFunction = jest.spyOn(((client as any).nativeClient as PoolClient), 'release');
      client.release();
      await adapter.stop();
      expect(nativeReleaseFunction).toBeCalled();
      nativeReleaseFunction.mockRestore();
    });
  });

  describe('placeholderReplacementHandler', () => {
    it('should return the correct replacement', async () => {
      // Initialize test
      const adapter = new PostgresAdapter();
      adapter.loadConfig({
        connectionString: process.env.TEST_PG_DB_URL,
      });
      const client = await adapter.getConnection();

      expect(client.placeholderReplacementHandler(1)).toEqual('$1');

      // Cleanup
      client.release();
      await adapter.stop();
    });
  });

  describe('integration with @opdb/base', () => {
    it('should work together with @opdb/base', async () => {
      // Setup adapter
      ConnectionPool.registerAdapter(PostgresAdapter);
      Base.connectionPool.connect({
        adapter: 'postgres',
        connectionString: process.env.TEST_PG_DB_URL,
      });

      await Base.execute('CREATE TABLE "test_integration"("id" INTEGER, "text" VARCHAR(50))');
      await Base.execute('INSERT INTO "test_integration" ("id", "text") VALUES ($id, $text)', { id: 1, text: 'Hello world!' });
      const response = await Base.execute('SELECT * FROM "test_integration" WHERE "id" = $id', { id: 1 });
      expect(response.rows).toEqual([{ id: 1, text: 'Hello world!' }]);

      // Cleanup
      Base.connectionPool.reset();
    });

    it('should handle transactions properly', async () => {
      // Setup adapter
      ConnectionPool.registerAdapter(PostgresAdapter);
      Base.connectionPool.connect({
        adapter: 'postgres',
        connectionString: process.env.TEST_PG_DB_URL,
      });

      await Base.transaction(async () => {
        await Base.execute('CREATE TABLE "test_transaction"("id" INTEGER, "text" VARCHAR(50))');
        await Base.execute('INSERT INTO "test_transaction" ("id", "text") VALUES ($id, $text)', { id: 1, text: 'Hello world!' });
        const response = await Base.execute('SELECT * FROM "test_transaction" WHERE "id" = $id', { id: 1 });
        expect(response.rows).toEqual([{ id: 1, text: 'Hello world!' }]);
      });

      // Cleanup
      Base.connectionPool.reset();
    });
  });
});
