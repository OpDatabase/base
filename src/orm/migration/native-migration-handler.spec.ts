import { Base } from '@opdb/base';
import { MockMigrationHandler } from '../../../tests/mock-migration-handler';
import { MigrationException } from '../exceptions/migration.exception';
import { getNativeMigrationHandler, thirdPartyMigrationHandlers } from './native-migration-handler';
import { PostgresMigration } from './postgres-migration.class';

describe('getNativeMigrationHandler', () => {
  afterEach(() => Base.connectionPool.reset());

  it('should throw an exception if the requested identifier is undefined', async () => {
    expect(() => {
      getNativeMigrationHandler(undefined);
    }).toThrowError(MigrationException);
  });

  it('should return the correct adapter for a built-in native migration handler', async () => {
    expect(getNativeMigrationHandler('postgres')).toBeInstanceOf(PostgresMigration);
  });

  it('should return the correct third-party native migration handler', async () => {
    // Register adapter
    thirdPartyMigrationHandlers.mock = () => new MockMigrationHandler();

    // Retrieve adapter
    expect(getNativeMigrationHandler('mock')).toBeInstanceOf(MockMigrationHandler);
  });

  it('should throw an exception if the requested identifier was not found', async () => {
    expect(() => {
      getNativeMigrationHandler('non-existing-adapter');
    }).toThrowError(MigrationException);
  });
});
