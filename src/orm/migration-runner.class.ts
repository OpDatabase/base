import { Base, Logger } from '@opdb/base';
import { MigrationStatus, MigrationStatusCode } from './interfaces/migration-status.interface';
import { Migration } from './migration.class';
import { getNativeMigrationHandler } from './migration/native-migration-handler';

export class MigrationRunner extends Base {
  private readonly internalHandler = getNativeMigrationHandler(Base.connectionPool.adapterIdentifier);

  public async apply(migration: Migration): Promise<void> {
    await this.transaction(async () => {
      await migration.up();
    });
  }

  public async revert(migration: Migration): Promise<void> {
    await this.transaction(async () => {
      await migration.down();
    });
  }

  public async applyAll(migrations: Array<{ id: string, migration: Migration }>): Promise<void> {
    const notAppliedMigrations = (await this.migrationStatus(migrations)).filter(m => m.status === MigrationStatusCode.local);

    // Apply all not applied migrations
    await this.transaction(async () => {
      for (const migration of notAppliedMigrations) {
        Logger.debug(`Applying migration ${migration.id} ("${migration.migration!.constructor.name}")...`);
        await this.apply(migration.migration!);
        await this.addToAppliedMigrations(migration.id);
      }
    });
  }

  public async migrationStatus(
    migrations: Array<{ id: string, migration: Migration }>,
  ): Promise<MigrationStatus[]> {
    await this.prepareSchemaMigrationsTable();

    // Fetch all migrations
    const appliedMigrations = await this.getAppliedMigrations();

    // Compare migrations
    // Find all migrations based on local files
    const results: MigrationStatus[] = [];
    for (const migration of migrations) {
      if (appliedMigrations.indexOf(migration.id) === -1) {
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
    const missingMigrations = appliedMigrations.filter(id => migrations.map(m => m.id).indexOf(id) === -1);
    missingMigrations.forEach(m => results.push({
      id: m,
      status: MigrationStatusCode.database,
      migration: null,
    }));

    // Return in sorted order
    return results.sort(((a, b) => a.id > b.id ? 1 : -1));
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

  private async addToAppliedMigrations(id: string): Promise<void> {
    await this.execute('INSERT INTO schema_migrations (version) VALUES ($id)', { id });
  }
}
