import { Migration } from '../migration.class';

export enum MigrationStatusCode {
  /**
   * The migration is only present on this computer.
   * It has not been applied to the database, yet
   */
  local = 'local',

  /**
   * The migration is only present on the database.
   * The corresponding migration file is not available.
   */
  database = 'database',

  /**
   * The migration has been applied.
   */
  inSync = 'in-sync',
}

export interface DefaultMigrationStatus {
  id: string;
  migration: Migration;
  status: MigrationStatusCode.local | MigrationStatusCode.inSync;
}

export interface FileMissingMigrationStatus {
  id: string;
  migration: null;
  status: MigrationStatusCode.database;
}

export type MigrationStatus = DefaultMigrationStatus | FileMissingMigrationStatus;
