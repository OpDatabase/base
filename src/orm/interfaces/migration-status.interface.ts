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

export interface MigrationFile {
  /**
   * Version of the migration. When generated, this is typically the timestamp
   * when the migration file has been created.
   */
  version: string;

  /**
   * An instance of the class associated to the migration version.
   */
  migration: Migration;
}

export interface MigrationFileWithDefaultStatus extends MigrationFile {
  /**
   * Status of the migration.
   */
  status: MigrationStatusCode.local | MigrationStatusCode.inSync;
}

export interface MigrationFileWithMissingStatus {
  /**
   * Version of the migration. When generated, this is typically the timestamp
   * when the migration file has been created.
   */
  version: string;

  /**
   * Status of the migration.
   */
  status: MigrationStatusCode.database;
}

export type MigrationFileWithStatus = MigrationFileWithDefaultStatus | MigrationFileWithMissingStatus;
