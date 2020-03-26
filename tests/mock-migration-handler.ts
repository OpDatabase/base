import { NativeMigrationOperations } from '../src/orm/interfaces/migration-operations.interface';
import { MigrationHandler } from '../src/orm/migration/migration-handler.class';

export class MockMigrationHandler extends MigrationHandler implements NativeMigrationOperations {
  public static lastCalledMethod: string[] = [];
  public static lastCalledArgs: unknown[][] = [];

  public async addColumn(...args: unknown[]): Promise<void> {
    MockMigrationHandler.lastCalledMethod.push('addColumn');
    MockMigrationHandler.lastCalledArgs.push(args);
  }

  public async addIndex(...args: unknown[]): Promise<void> {
    MockMigrationHandler.lastCalledMethod.push('addIndex');
    MockMigrationHandler.lastCalledArgs.push(args);
  }

  public async changeColumnDefault(...args: unknown[]): Promise<void> {
    MockMigrationHandler.lastCalledMethod.push('changeColumnDefault');
    MockMigrationHandler.lastCalledArgs.push(args);
  }

  public async changeColumnNull(...args: unknown[]): Promise<void> {
    MockMigrationHandler.lastCalledMethod.push('changeColumnNull');
    MockMigrationHandler.lastCalledArgs.push(args);
  }

  public async createJoinTable(...args: unknown[]): Promise<void> {
    MockMigrationHandler.lastCalledMethod.push('createJoinTable');
    MockMigrationHandler.lastCalledArgs.push(args);
  }

  public async createTable(...args: unknown[]): Promise<void> {
    MockMigrationHandler.lastCalledMethod.push('createTable');
    MockMigrationHandler.lastCalledArgs.push(args);
  }

  public async dropJoinTable(...args: unknown[]): Promise<void> {
    MockMigrationHandler.lastCalledMethod.push('dropJoinTable');
    MockMigrationHandler.lastCalledArgs.push(args);
  }

  public async dropTable(...args: unknown[]): Promise<void> {
    MockMigrationHandler.lastCalledMethod.push('dropTable');
    MockMigrationHandler.lastCalledArgs.push(args);
  }

  public async removeColumns(...args: unknown[]): Promise<void> {
    MockMigrationHandler.lastCalledMethod.push('removeColumns');
    MockMigrationHandler.lastCalledArgs.push(args);
  }

  public async removeIndex(...args: unknown[]): Promise<void> {
    MockMigrationHandler.lastCalledMethod.push('removeIndex');
    MockMigrationHandler.lastCalledArgs.push(args);
  }

  public async renameColumn(...args: unknown[]): Promise<void> {
    MockMigrationHandler.lastCalledMethod.push('renameColumn');
    MockMigrationHandler.lastCalledArgs.push(args);
  }

  public async renameIndex(...args: unknown[]): Promise<void> {
    MockMigrationHandler.lastCalledMethod.push('renameIndex');
    MockMigrationHandler.lastCalledArgs.push(args);
  }

  public async renameTable(...args: unknown[]): Promise<void> {
    MockMigrationHandler.lastCalledMethod.push('renameTable');
    MockMigrationHandler.lastCalledArgs.push(args);
  }

  public async columnExists(...args: unknown[]): Promise<boolean> {
    MockMigrationHandler.lastCalledMethod.push('columnExists');
    MockMigrationHandler.lastCalledArgs.push(args);
    return false;
  }

  public async columns(...args: unknown[]): Promise<string[]> {
    MockMigrationHandler.lastCalledMethod.push('columns');
    MockMigrationHandler.lastCalledArgs.push(args);
    return [];
  }

  public async indexExists(...args: unknown[]): Promise<boolean> {
    MockMigrationHandler.lastCalledMethod.push('indexExists');
    MockMigrationHandler.lastCalledArgs.push(args);
    return false;
  }

  public async indexes(...args: unknown[]): Promise<string[]> {
    MockMigrationHandler.lastCalledMethod.push('indexes');
    MockMigrationHandler.lastCalledArgs.push(args);
    return [];
  }

  public async tableExists(...args: unknown[]): Promise<boolean> {
    MockMigrationHandler.lastCalledMethod.push('tableExists');
    MockMigrationHandler.lastCalledArgs.push(args);
    return false;
  }

  public async tables(...args: unknown[]): Promise<string[]> {
    MockMigrationHandler.lastCalledMethod.push('tables');
    MockMigrationHandler.lastCalledArgs.push(args);
    return [];
  }
}
