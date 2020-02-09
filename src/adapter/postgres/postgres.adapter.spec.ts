import { PostgresAdapter } from './postgres.adapter';

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
      expect((adapter as any).nativeConnectionPool).not.toBeNull();
    });
  });
});
