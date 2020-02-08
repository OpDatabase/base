import 'zone.js';
import { provideIntrospectPlaceholdersAdapter } from '../../tests/mock-introspect-placeholders.adapter';
import { MockAdapterException, provideMockAdapter } from '../../tests/mock.adapter';
import { Base } from './base.class';
import { ConnectionPool } from './connection-pool.class';
import { ZoneNames } from './const/zone-names.enum';
import { ConnectionPoolNoConfigGivenException } from './exceptions/connection-pool/no-config-given.exception';
import { ExecutionContext } from './execution-context.class';
import { DatabaseClient } from './interfaces/adapter.interfaces';

ExecutionContext.showDebugInfo = true;

describe('Base', () => {
  provideMockAdapter();

  describe('connectionPool', () => {
    it('should return a ConnectionPool instance', () => {
      expect(Base.connectionPool).toBeInstanceOf(ConnectionPool);
    });
  });

  describe('connection', () => {
    it('should return null when called outside any context', () => {
      expect(Base.connection).toBe(null);
    });
    it('should return a connection when called within a context', async () => {
      Base.connectionPool.connect({ adapter: 'mock', simulate: 'success' });
      await ExecutionContext.create(async () => {
        expect(Base.connection).not.toBe(null);
      });
    });
    it('should throw an exception when no database configuration has been provided', async () => {
      try {
        await ExecutionContext.create(async () => {
          const throwInTheVoid = (x: DatabaseClient) => `${x}`;
          throwInTheVoid(Base.connection!);
        });
      } catch (e) {
        expect(e).toBeInstanceOf(ConnectionPoolNoConfigGivenException);
      }
    });
  });

  describe('execute', () => {
    it('should implicitly create a new execution context when run on root level', async () => {
      Base.connectionPool.connect({ adapter: 'mock', simulate: 'success' });
      expect(await Base.execute('SELECT * FROM mock')).toBe(void 0);
    });

    it('should work within an explicitly started execution context', async () => {
      Base.connectionPool.connect({ adapter: 'mock', simulate: 'success' });
      await ExecutionContext.create(async () => {
        expect(await Base.execute('SELECT * FROM mock')).toBe(void 0);
      });
    });

    it('should throw if the connection has not been established', async () => {
      try {
        await Base.execute('SELECT * FROM mock');
      } catch (e) {
        expect(e).toBeInstanceOf(ConnectionPoolNoConfigGivenException);
      }
    });

    it('should throw if the query fails', async () => {
      Base.connectionPool.connect({ adapter: 'mock', simulate: 'failure' });
      try {
        await Base.execute('SELECT * FROM mock');
      } catch (e) {
        expect(e).toBeInstanceOf(MockAdapterException);
      }
    });

    it('should pass placeholders properly to client class', async () => {
      const client = await provideIntrospectPlaceholdersAdapter(passedPlaceholders => {
        const realPlaceholders = client.resolvePlaceholders('SELECT * FROM test WHERE a = $1', { a: 1 });
        expect(passedPlaceholders).toEqual(realPlaceholders);
      });

      await Base.execute('SELECT * FROM test WHERE a = $1', { a: 1 });
    });
  });

  describe('transaction', () => {
    it('should start a new transaction', async () => {
      Base.connectionPool.connect({ adapter: 'mock', simulate: 'success' });
      await Base.transaction(async () => {
        expect(Zone.current.get(ZoneNames.TransactionId)).not.toBe(null);
      });
    });
  });
});
