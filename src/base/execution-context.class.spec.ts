import 'zone.js';
import { MockDatabaseClient, provideMockAdapter } from '../../tests/mock.adapter';
import { Base } from './base.class';
import { ZoneNames } from './const/zone-names.enum';
import { ExecutionContext } from './execution-context.class';

describe('ExecutionContext', () => {
  provideMockAdapter();

  beforeEach(() => Base.connectionPool.connect({ adapter: 'mock', simulate: 'success' }));

  describe('create', () => {
    it('should create a new execution context when called at root level', async () => {
      expect(Zone.current.name).toBe('<root>');
      await ExecutionContext.create(async () => {
        expect(Zone.current.name).not.toBe('<root>');
        expect(Zone.current.get(ZoneNames.DatabaseClient)).toBeInstanceOf(MockDatabaseClient);
        expect(Zone.current.get(ZoneNames.DatabaseClientId)).not.toBe(undefined);
        expect(Zone.current.get(ZoneNames.TransactionId)).toBe(undefined);
      });
    });

    it('should create a new execution context when called within another execution context', async () => {
      await ExecutionContext.create(async () => {
        const parentZoneName = Zone.current.name;
        const parentZoneDatabaseClient = Zone.current.get(ZoneNames.DatabaseClient);
        const parentZoneDatabaseClientId = Zone.current.get(ZoneNames.DatabaseClientId);

        await ExecutionContext.create(async () => {
          expect(Zone.current.name).not.toBe(parentZoneName);
          expect(Zone.current.get(ZoneNames.DatabaseClient)).toBe(parentZoneDatabaseClient);
          expect(Zone.current.get(ZoneNames.DatabaseClientId)).toBe(parentZoneDatabaseClientId);
          expect(Zone.current.get(ZoneNames.TransactionId)).toBe(undefined);
        });
      });
    });
  });

  describe('createTransaction', () => {
    it('should create a new execution context with transaction id property', async () => {
      expect(Zone.current.name).toBe('<root>');
      await ExecutionContext.createTransaction(async () => {
        expect(Zone.current.name).not.toBe('<root>');
        expect(Zone.current.get(ZoneNames.DatabaseClient)).toBeInstanceOf(MockDatabaseClient);
        expect(Zone.current.get(ZoneNames.DatabaseClientId)).not.toBe(undefined);
        expect(Zone.current.get(ZoneNames.TransactionId)).not.toBe(undefined);
      });
    });

    it('should create a new execution context with transaction id property within another transaction', async () => {
      await ExecutionContext.createTransaction(async () => {
        const parentZoneName = Zone.current.name;
        const parentZoneDatabaseClient = Zone.current.get(ZoneNames.DatabaseClient);
        const parentZoneDatabaseClientId = Zone.current.get(ZoneNames.DatabaseClientId);
        const parentZoneTransactionId = Zone.current.get(ZoneNames.TransactionId);

        await ExecutionContext.createTransaction(async () => {
          expect(Zone.current.name).not.toBe(parentZoneName);
          expect(Zone.current.get(ZoneNames.DatabaseClient)).toBe(parentZoneDatabaseClient);
          expect(Zone.current.get(ZoneNames.DatabaseClientId)).toBe(parentZoneDatabaseClientId);
          expect(Zone.current.get(ZoneNames.TransactionId)).not.toBe(parentZoneTransactionId);
        });
      });
    });

    it('should emit a ROLLBACK statement if an exception is thrown during transaction', async () => {
      class FancyError extends Error {
      }

      await ExecutionContext.create(async () => {
        try {
          await ExecutionContext.createTransaction(async () => {
            throw new FancyError();
          });
        } catch (e) {
          expect(e).toBeInstanceOf(FancyError);
          const executedSqlStatement = (Base.connection! as MockDatabaseClient).executedSqlStatement;
          expect(executedSqlStatement[executedSqlStatement.length - 1]).toEqual('ROLLBACK');
        }
      });
    });
  });
});
