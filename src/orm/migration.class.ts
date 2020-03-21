import { DataType } from './interfaces/data-type.enum';
import {
  AddColumnNumericOptions,
  AddColumnOptions,
  CreateTableConfigBlock,
  CreateTableOptions,
  MigrationOperations,
  NativeMigrationOperations,
} from './interfaces/migration-operations.interface';
import { MigrationHandler } from './migration/migration-handler.class';
import { PostgresMigration } from './migration/postgres-migration.class';

export abstract class Migration extends MigrationHandler implements MigrationOperations {
  // todo: make dynamic based on config
  private internalHandler: NativeMigrationOperations = new PostgresMigration();

  public async createTable(name: string, configBlock: CreateTableConfigBlock): Promise<void>;
  public async createTable(name: string, options: CreateTableOptions, configBlock: CreateTableConfigBlock): Promise<void>;
  public async createTable(
    name: string,
    optionsOrConfigBlock: CreateTableConfigBlock | CreateTableOptions,
    configBlock?: CreateTableConfigBlock,
  ): Promise<void> {
    if (typeof optionsOrConfigBlock === 'function') {
      return await this.internalHandler.createTable(name, {}, optionsOrConfigBlock);
    } else {
      return await this.internalHandler.createTable(name, optionsOrConfigBlock, configBlock!);
    }
  }

  public async addColumn(tableName: string, columnName: string, type: DataType, options: AddColumnOptions): Promise<void>;
  public async addColumn(tableName: string, columnName: string, type: DataType.decimal, options: AddColumnNumericOptions): Promise<void>;
  public async addColumn(tableName: string, columnName: string, type: DataType): Promise<void>;
  public async addColumn(
    tableName: string,
    columnName: string,
    type: DataType,
    options?: AddColumnOptions | AddColumnNumericOptions,
  ): Promise<void> {
    return await this.internalHandler.addColumn(tableName, columnName, type, options || {});
  }
}
