import 'zone.js';
import { MockFailOnConnectAdapter } from '../../tests/mock-fail-on-connect.adapter';
import { MockAdapter } from '../../tests/mock.adapter';
import { ConnectionPool } from './connection-pool.class';
import { ConnectionPoolConnectionFailedException } from './exceptions/connection-pool/connection-failed.exception';
import { ConnectionPoolInitializeUnknownAdapterException } from './exceptions/connection-pool/initialize-unknown-adapter.exception';
import { ConnectionPoolNoConfigGivenException } from './exceptions/connection-pool/no-config-given.exception';

describe('ConnectionPool', () => {
  // Reset connection pool after each test
  afterEach(() => (new ConnectionPool()).reset());

  describe('registerAdapter', () => {
    it('should register a new adapter', () => {
      ConnectionPool.registerAdapter(MockAdapter);
      // tslint:disable-next-line:no-any
      expect((ConnectionPool as any).adapters.mock).toBe(MockAdapter);
      expect(() => {
        const pool = new ConnectionPool();
        pool.connect({ adapter: 'mock', simulate: 'success' });
      }).not.toThrow();
    });
  });

  describe('connect', () => {
    it('should throw if the requested adapter has not been found', () => {
      expect(() => {
        const pool = new ConnectionPool();
        pool.connect({ adapter: 'not-existing-adapter' });
      }).toThrow(ConnectionPoolInitializeUnknownAdapterException);
    });
    it('should not throw if the requested adapter is available', async () => {
      ConnectionPool.registerAdapter(MockAdapter);
      expect(() => {
        const pool = new ConnectionPool();
        pool.connect({ adapter: 'mock', simulate: 'success' });
      }).not.toThrow();
    });
  });

  describe('getConnection', () => {
    it('should throw if the connection has not been established yet', async () => {
      try {
        const pool = new ConnectionPool();
        await pool.getConnection();
      } catch (e) {
        expect(e).toBeInstanceOf(ConnectionPoolNoConfigGivenException);
      }
    });
    it('should throw if the adapter is not able to establish a connection', async () => {
      ConnectionPool.registerAdapter(MockFailOnConnectAdapter);
      try {
        const pool = new ConnectionPool();
        pool.connect({ adapter: 'mock-fail-on-connect', simulate: 'success' });
        await pool.getConnection();
      } catch (e) {
        expect(e).toBeInstanceOf(ConnectionPoolConnectionFailedException);
      }
    });
  });
});
