import { DataType } from './interfaces/data-type.enum';
import {
  AddColumnNumericOptions,
  AddColumnOptions,
  CreateJoinTableOptions,
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

  public async createJoinTable(tableName1: string, tableName2: string): Promise<void>;
  public async createJoinTable(tableName1: string, tableName2: string, configBlock: CreateTableConfigBlock): Promise<void>;
  public async createJoinTable(tableName1: string, tableName2: string, options: CreateJoinTableOptions): Promise<void>;
  public async createJoinTable(
    tableName1: string,
    tableName2: string,
    options: CreateJoinTableOptions,
    configBlock: CreateTableConfigBlock,
  ): Promise<void>;
  public async createJoinTable(
    tableName1: string,
    tableName2: string,
    optionsOrConfigBlock?: CreateTableConfigBlock | CreateJoinTableOptions,
    configBlock?: CreateTableConfigBlock,
  ): Promise<void> {
    const placeholderCallback = () => void 0;
    if (optionsOrConfigBlock === undefined) {
      return await this.internalHandler.createJoinTable(tableName1, tableName2, {}, placeholderCallback);
    } else if (typeof optionsOrConfigBlock === 'function') {
      return await this.internalHandler.createJoinTable(tableName1, tableName2, {}, optionsOrConfigBlock);
    } else {
      return await this.internalHandler.createJoinTable(tableName1, tableName2, optionsOrConfigBlock, configBlock || placeholderCallback);
    }
  }

  public async createTable(name: string): Promise<void>;
  public async createTable(name: string, configBlock: CreateTableConfigBlock): Promise<void>;
  public async createTable(name: string, options: CreateTableOptions, configBlock: CreateTableConfigBlock): Promise<void>;
  public async createTable(
    name: string,
    optionsOrConfigBlock?: CreateTableConfigBlock | CreateTableOptions,
    configBlock?: CreateTableConfigBlock,
  ): Promise<void> {
    const placeholderCallback = () => void 0;
    if (optionsOrConfigBlock === undefined) {
      return await this.internalHandler.createTable(name, {}, placeholderCallback);
    } else if (typeof optionsOrConfigBlock === 'function') {
      return await this.internalHandler.createTable(name, {}, optionsOrConfigBlock);
    } else {
      return await this.internalHandler.createTable(name, optionsOrConfigBlock, configBlock || placeholderCallback);
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
