import { DataTypes } from './interfaces/data-types.enum';
import {
  AddColumnNumericOptions,
  AddColumnOptions,
  CreateTableConfigBlock,
  CreateTableOptions,
  MigrationOperations,
  MigrationOperationsInternal,
} from './interfaces/migration-operations.interface';
import { MigrationHandler } from './migration/migration-handler.class';
import { PostgresMigration } from './migration/postgres-migration.class';

export abstract class Migration extends MigrationHandler implements MigrationOperations {
  // todo: make dynamic based on config
  private internalHandler: MigrationOperationsInternal = new PostgresMigration();

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

  public async addColumn(tableName: string, columnName: string, type: DataTypes, options: AddColumnOptions): Promise<void>;
  public async addColumn(tableName: string, columnName: string, type: DataTypes.decimal, options: AddColumnNumericOptions): Promise<void>;
  public async addColumn(tableName: string, columnName: string, type: DataTypes): Promise<void>;
  public async addColumn(
    tableName: string,
    columnName: string,
    type: DataTypes,
    options?: AddColumnOptions | AddColumnNumericOptions,
  ): Promise<void> {
    return await this.internalHandler.addColumn(tableName, columnName, type, options || {});
  }
}
