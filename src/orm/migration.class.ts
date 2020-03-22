import { Base } from '@opdb/base';
import { DataType } from './interfaces/data-type.enum';
import {
  AddColumnNumericOptions,
  AddColumnOptions,
  AddIndexOptions,
  CreateTableConfigBlock,
  CreateTableOptions,
  DropTableOptions,
  IndexOptions,
  JoinTableOptions,
  MigrationOperations,
} from './interfaces/migration-operations.interface';
import { MigrationHandler } from './migration/migration-handler.class';
import { getNativeMigrationHandler } from './migration/native-migration-handler.func';

export abstract class Migration extends MigrationHandler implements MigrationOperations {
  private internalHandler = getNativeMigrationHandler(Base.connectionPool.adapterIdentifier);

  // -----------------------------------
  // Abstract methods
  // -----------------------------------

  /**
   * Migrates the database from the current state to a new state.
   */
  public abstract async up(): Promise<unknown>;

  /**
   * Reverts the database's current state to its former state.
   */
  public abstract async down(): Promise<unknown>;

  // -----------------------------------
  // Migration operations
  // -----------------------------------

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

  public async addIndex(tableName: string, columnNames: string[]): Promise<void>;
  public async addIndex(tableName: string, columnNames: string): Promise<void>;
  public async addIndex(tableName: string, columnNames: string[], options: AddIndexOptions): Promise<void>;
  public async addIndex(tableName: string, columnNames: string, options: AddIndexOptions): Promise<void>;
  public async addIndex(tableName: string, columnNames: string[] | string, options?: AddIndexOptions): Promise<void> {
    return await this.internalHandler.addIndex(
      tableName,
      typeof columnNames === 'string' ? [columnNames] : columnNames,
      options || {},
    );
  }

  public async addTimestamps(tableName: string): Promise<void> {
    await Promise.all([
      this.addColumn(tableName, 'created_at', DataType.datetime),
      this.addColumn(tableName, 'updated_at', DataType.datetime),
    ]);
  }

  public async changeColumnDefault(tableName: string, columnName: string, defaultValue: unknown | null): Promise<void> {
    return await this.internalHandler.changeColumnDefault(tableName, columnName, defaultValue);
  }

  public async changeColumnNull(tableName: string, columnName: string, allowNull: boolean, replaceNullValuesWith?: unknown): Promise<void> {
    return await this.internalHandler.changeColumnNull(tableName, columnName, allowNull, replaceNullValuesWith);
  }

  public async createJoinTable(tableName1: string, tableName2: string): Promise<void>;
  public async createJoinTable(tableName1: string, tableName2: string, configBlock: CreateTableConfigBlock): Promise<void>;
  public async createJoinTable(tableName1: string, tableName2: string, options: JoinTableOptions): Promise<void>;
  public async createJoinTable(
    tableName1: string,
    tableName2: string,
    options: JoinTableOptions,
    configBlock: CreateTableConfigBlock,
  ): Promise<void>;
  public async createJoinTable(
    tableName1: string,
    tableName2: string,
    optionsOrConfigBlock?: CreateTableConfigBlock | JoinTableOptions,
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

  public async dropJoinTable(tableName1: string, tableName2: string): Promise<void>;
  public async dropJoinTable(tableName1: string, tableName2: string, options: JoinTableOptions): Promise<void>;
  public async dropJoinTable(tableName1: string, tableName2: string, options?: JoinTableOptions): Promise<void> {
    return await this.internalHandler.dropJoinTable(tableName1, tableName2, options || {});
  }

  public async dropTable(name: string): Promise<void>;
  public async dropTable(name: string, options: DropTableOptions): Promise<void>;
  public async dropTable(name: string, options?: DropTableOptions): Promise<void> {
    return await this.internalHandler.dropTable(name, options || {});
  }

  public async removeColumn(tableName: string, columnName: string): Promise<void> {
    return await this.removeColumns(tableName, columnName);
  }

  public async removeColumns(tableName: string, ...columnNames: string[]): Promise<void> {
    return await this.internalHandler.removeColumns(tableName, ...columnNames);
  }

  public async removeIndex(tableName: string, columnNames: string[]): Promise<void>;
  public async removeIndex(tableName: string, columnName: string): Promise<void>;
  public async removeIndex(tableName: string, columnNames: string[], options: IndexOptions): Promise<void>;
  public async removeIndex(tableName: string, columnName: string, options: IndexOptions): Promise<void>;
  public async removeIndex(tableName: string, columnNames: string[] | string, options?: IndexOptions): Promise<void> {
    return await this.internalHandler.removeIndex(
      tableName,
      typeof columnNames === 'string' ? [columnNames] : columnNames,
      options || {},
    );
  }

  public async removeTimestamps(tableName: string): Promise<void> {
    return await this.removeColumns(tableName, 'created_at', 'updated_at');
  }

  public async renameColumn(tableName: string, columnName: string, newColumnName: string): Promise<void> {
    return await this.internalHandler.renameColumn(tableName, columnName, newColumnName);
  }

  public async renameIndex(tableName: string, indexName: string, newIndexName: string): Promise<void> {
    return await this.internalHandler.renameIndex(tableName, indexName, newIndexName);
  }

  public async renameTable(tableName: string, newTableName: string): Promise<void> {
    return await this.internalHandler.renameTable(tableName, newTableName);
  }
}
