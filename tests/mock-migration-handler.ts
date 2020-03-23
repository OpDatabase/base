import { NativeMigrationOperations } from '../src/orm/interfaces/migration-operations.interface';
import { MigrationHandler } from '../src/orm/migration/migration-handler.class';

export class MockMigrationHandler extends MigrationHandler implements NativeMigrationOperations {
  public async addColumn(): Promise<void> {
  }

  public async addIndex(): Promise<void> {
  }

  public async changeColumnDefault(): Promise<void> {
  }

  public async changeColumnNull(): Promise<void> {
  }

  public async createJoinTable(): Promise<void> {
  }

  public async createTable(): Promise<void> {
  }

  public async dropJoinTable(): Promise<void> {
  }

  public async dropTable(): Promise<void> {
  }

  public async removeColumns(): Promise<void> {
  }

  public async removeIndex(): Promise<void> {
  }

  public async renameColumn(): Promise<void> {
  }

  public async renameIndex(): Promise<void> {
  }

  public async renameTable(): Promise<void> {
  }

  public async columnExists(): Promise<boolean> {
    return false;
  }

  public async columns(): Promise<string[]> {
    return [];
  }

  public async indexExists(): Promise<boolean> {
    return false;
  }

  public async indexes(): Promise<string[]> {
    return [];
  }

  public async tableExists(): Promise<boolean> {
    return false;
  }

  public async tables(): Promise<string[]> {
    return [];
  }
}
