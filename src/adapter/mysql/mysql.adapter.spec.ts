import { MysqlAdapterException } from './exceptions/mysql-adapter.exception';
import { MysqlAdapter } from './mysql.adapter';
import { MysqlClient } from './mysql.client';

describe('MysqlAdapter', () => {
  describe('getIdentifier', () => {
    it('should return the correct identifier', async () => {
      const adapter = new MysqlAdapter();
      expect(adapter.getIdentifier()).toBe('mysql');
    });
  });

  describe('loadConfig', () => {
    it('should initialize the adapter correctly', async () => {
      const adapter = new MysqlAdapter();
      expect(() => {
        adapter.loadConfig({ url: process.env.TEST_MYSQL_DB_URL });
      }).not.toThrow();
      expect((adapter as any).nativePool).not.toBeNull();
      await adapter.stop();
    });

    it('should not initialize the adapter twice', async () => {
      const adapter = new MysqlAdapter();
      adapter.loadConfig({ url: process.env.TEST_MYSQL_DB_URL });
      expect(() => {
        adapter.loadConfig({ url: process.env.TEST_MYSQL_DB_URL });
      }).toThrow(MysqlAdapterException);
      await adapter.stop();
    });
  });

  describe('getConnection', () => {
    it('should initialize a connection', async () => {
      const adapter = new MysqlAdapter();
      adapter.loadConfig({ url: process.env.TEST_MYSQL_DB_URL });
      const client = await adapter.getConnection();
      expect(client).toBeInstanceOf(MysqlClient);
      client.release();
      await adapter.stop();
    });
    it('should throw if the config has not been loaded yet', async () => {
      const adapter = new MysqlAdapter();
      await expect(adapter.getConnection()).rejects.toThrow(MysqlAdapterException);
      await adapter.stop();
    });
    it('should throw an exception if the client credentials are wrong', async () => {
      const adapter = new MysqlAdapter();
      adapter.loadConfig({ url: 'mysql://wrong:password@127.0.0.1:1234/wrong' });
      await expect(adapter.getConnection()).rejects.toThrow(MysqlAdapterException);
      await adapter.stop();
    });
  });
});
