/**
 * Variable names for Zone.js properties.
 * See {@link ExecutionContext} for more details.
 */
import { DatabaseClient } from '..';

export enum ZoneNames {
  DatabaseClient = '__opdb_database_client',
  DatabaseClientId = '__opdb_database_client_id',
  TransactionId = '__opdb_transaction_id',
}

/**
 * Interfaces of {@link ExecutionContext}'s Zone.js properties.
 */
export interface ExecutionContextProperties {
  /**
   * Database client used in this execution context.
   */
  __opdb_database_client: DatabaseClient;

  /**
   * Database client id used in this execution context.
   */
  __opdb_database_client_id: string;

  /**
   * Database transaction id for the currently running database transaction.
   */
  __opdb_transaction_id: string;
}
