import { Base, Logger } from '@opdb/base';
import { MigrationException } from './exceptions/migration.exception';
import { MigrationFile, MigrationFileWithStatus, MigrationStatusCode } from './interfaces/migration-status.interface';
import { Migration } from './migration.class';
import { getNativeMigrationHandler } from './migration/native-migration-handler';

export class MigrationRunner extends Base {
  private readonly internalHandler = getNativeMigrationHandler(Base.connectionPool.adapterIdentifier);

  /**
   * Applies the given migration to the database.
   * @param migration
   */
  public async apply(migration: Migration): Promise<void> {
    await this.transaction(async () => {
      await migration.up();
    });
  }

  /**
   * Reverts the given migration from the database.
   * @param migration
   */
  public async revert(migration: Migration): Promise<void> {
    await this.transaction(async () => {
      await migration.down();
    });
  }

  /**
   * Applies the given migration files to the database after checking their status.
   * Only migration files which correspond to non-applied migrations will be applied.
   * @internal Use with caution, since this will modify the internally saved database version.
   * @param migrationFiles
   */
  public async applyAll(migrationFiles: MigrationFile[]): Promise<void> {
    const notAppliedMigrations = (await this.migrationStatus(migrationFiles)).filter(m => m.status === MigrationStatusCode.local);

    // Apply all not applied migrations
    await this.transaction(async () => {
      for (const migration of notAppliedMigrations) {
        if (migration.status === MigrationStatusCode.database) {
          continue;
        }
        Logger.debug(`Applying migration ${migration.version} ("${migration.migration.constructor.name}")...`);
        await this.apply(migration.migration);
        await this.addToAppliedMigrations(migration.version);
      }
    });
  }

  /**
   * Reverts the given migration files up to the given version, or the latest version
   * if no version has been specified.
   * @internal Use with caution, since this will modify the internally saved database version.
   * @param migrationFiles
   * @param untilVersion
   */
  public async revertUntil(migrationFiles: MigrationFile[], untilVersion?: string) {
    const migrationsWithStatus = (await this.migrationStatus(migrationFiles)).reverse();
    let targetedMigrations: MigrationFileWithStatus[] = [];
    if (untilVersion === undefined) {
      // Use only the latest migration
      if (migrationsWithStatus.length >= 1) {
        targetedMigrations = [migrationsWithStatus[0]];
      }
    } else {
      // Find all migrations greater or equal to unitlId
      targetedMigrations = migrationsWithStatus.filter(m => m.version >= untilVersion);
    }

    // Check if targetedMigrations contain a migration that has status code "Database Only"
    const databaseOnlyMigrations = targetedMigrations.filter(m => m.status === MigrationStatusCode.database);
    if (databaseOnlyMigrations.length > 0) {
      throw new MigrationException(
        `Cannot revert database state. One or more migrations don't have a corresponding migration file: ${databaseOnlyMigrations.join(', ')}. Revert these migrations manually and remove the corresponding version from the "schema_migrations" table.`,
      );
    }

    // Revert all database migrations
    await this.transaction(async () => {
      for (const migration of targetedMigrations.filter(m => m.status === MigrationStatusCode.inSync)) {
        if (migration.status === MigrationStatusCode.database) {
          continue;
        }
        Logger.debug(`Reverting migration ${migration.version} ("${migration.migration.constructor.name}")...`);
        await this.revert(migration.migration);
        await this.removeFromAppliedMigrations(migration.version);
      }
    });
  }

  /**
   * Returns the current database status associated with the provided database migration
   * files. Will return for each file the current status as well as migrations
   * which don't have a corresponding local database migration file.
   * @param migrationFiles
   */
  public async migrationStatus(
    migrationFiles: MigrationFile[],
  ): Promise<MigrationFileWithStatus[]> {
    await this.prepareSchemaMigrationsTable();

    // Fetch all migrations
    const appliedMigrations = await this.getAppliedMigrations();

    // Compare migrations
    // Find all migrations based on local files
    const results: MigrationFileWithStatus[] = [];
    for (const migration of migrationFiles) {
      if (appliedMigrations.indexOf(migration.version) === -1) {
        // Migration has not been applied, yet
        results.push({
          ...migration,
          status: MigrationStatusCode.local,
        });
      } else {
        // Migration has been applied
        results.push({
          ...migration,
          status: MigrationStatusCode.inSync,
        });
      }
    }

    // Find all migrations without any corresponding local file
    const missingMigrations = appliedMigrations.filter(id => migrationFiles.map(m => m.version).indexOf(id) === -1);
    missingMigrations.forEach(m => results.push({
      version: m,
      status: MigrationStatusCode.database,
    }));

    // Return in sorted order
    return results.sort(((a, b) => a.version > b.version ? 1 : -1));
  }

  private async prepareSchemaMigrationsTable(): Promise<void> {
    // Check if 'schema_migrations' table
    if (await this.internalHandler.tableExists('schema_migrations')) {
      return;
    }

    // Create table 'schema_migrations'
    await this.internalHandler.createTable('schema_migrations', { id: false }, table => {
      table.string('version');
    });
  }

  private async getAppliedMigrations(): Promise<string[]> {
    const data = await this.execute<{ version: string }>('SELECT version FROM schema_migrations ORDER BY version ASC');

    return data.map(d => d.version);
  }

  private async addToAppliedMigrations(version: string): Promise<void> {
    await this.execute('INSERT INTO schema_migrations (version) VALUES ($version)', { version });
  }

  private async removeFromAppliedMigrations(version: string): Promise<void> {
    await this.execute('DELETE FROM schema_migrations WHERE version = $version', { version });
  }
}
