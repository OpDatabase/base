import { Base } from '@opdb/base';
import { Migration } from './migration.class';

export class MigrationRunner extends Base {
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
}
