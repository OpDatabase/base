import { MigrationException } from '../exceptions/migration.exception';
import { NativeMigrationOperations } from '../interfaces/migration-operations.interface';
import { PostgresMigration } from './postgres-migration.class';

export const thirdPartyMigrationHandlers: { [identifier: string]: () => NativeMigrationOperations } = {};

export function getNativeMigrationHandler(identifier: string | undefined): NativeMigrationOperations {
  if (identifier === undefined) {
    throw new MigrationException(`Cannot resolve migration adapter since not database connection has been established. Please establish database connection first using Base.connectionPool.connect().`);
  }

  switch (identifier) {
    case 'postgres':
      return new PostgresMigration();
  }

  if (thirdPartyMigrationHandlers[identifier] != null) {
    return thirdPartyMigrationHandlers[identifier]();
  }

  throw new MigrationException(`Cannot resolve migration adapter for "${identifier}". If you are refering to a third-party migration handler, please make sure that it is added to thirdPartyMigrationHandlers.`);
}
