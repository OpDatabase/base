import { PostgresAdapterException } from './exceptions/postgres-adapter.exception';
import { PostgresAdapter } from './postgres.adapter';
import { PostgresClient } from './postgres.client';

describe('PostgresAdapter', () => {
  describe('getIdentifier', () => {
    it('should respond the correct identifier', async () => {
      const adapter = new PostgresAdapter();
      expect(adapter.getIdentifier()).toBe('postgres');
    });
  });

  describe('loadConfig', () => {
    it('should initialize the adapter correctly', async () => {
      const adapter = new PostgresAdapter();
      expect(() => {
        adapter.loadConfig({
          connectionString: process.env.TEST_PG_DB_URL,
        });
      }).not.toThrow();
      // tslint:disable-next-line:no-any
      expect((adapter as any).nativeConnectionPool).not.toBeNull();
      await adapter.stop();
    });
    it('should not initialize the adapter twice', async () => {
      const adapter = new PostgresAdapter();
      adapter.loadConfig({
        connectionString: process.env.TEST_PG_DB_URL,
      });

      // Second time should fail
      expect(() => {
        adapter.loadConfig({
          connectionString: process.env.TEST_PG_DB_URL,
        });
      }).toThrow(PostgresAdapterException);

      await adapter.stop();
    });
  });

  describe('getConnection', () => {
    it('should initialize a connection', async () => {
      const adapter = new PostgresAdapter();
      adapter.loadConfig({
        connectionString: process.env.TEST_PG_DB_URL,
      });
      const client = await adapter.getConnection();
      expect(client).toBeInstanceOf(PostgresClient);
      client.release();
      await adapter.stop();
    });

    it('should throw an exception if config has not been loaded yet', async () => {
      const adapter = new PostgresAdapter();
      // try {
      //   await adapter.getConnection();
      // } catch (e) {
      //   expect(e).toBeInstanceOf(PostgresAdapterException);
      // }
      await expect(adapter.getConnection()).rejects.toThrow(PostgresAdapterException);
      await adapter.stop();
    });

    it('should throw an exception if the client credentials are wrong', async () => {
      const adapter = new PostgresAdapter();
      adapter.loadConfig({
        connectionString: 'postgres://wrong:password@127.0.0.1:1234/wrong',
      });
      await expect(adapter.getConnection()).rejects.toThrow(PostgresAdapterException);
      await adapter.stop();
    });
  });
});
