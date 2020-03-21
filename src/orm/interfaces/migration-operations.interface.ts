import { DataTypes } from './data-types.enum';

export interface MigrationOperationsInternal {
  createTable(name: string, options: CreateTableOptions, config: CreateTableConfigBlock): Promise<void>;

  addColumn(tableName: string, columnName: string, type: DataTypes, options: AddColumnNumericOptions | AddColumnOptions): Promise<void>;
}

export interface MigrationOperations extends MigrationOperationsInternal {
  createTable(name: string, configBlock: CreateTableConfigBlock): Promise<void>;

  createTable(name: string, options: CreateTableOptions, configBlock: CreateTableConfigBlock): Promise<void>;

  addColumn(tableName: string, columnName: string, type: DataTypes, options: AddColumnOptions): Promise<void>;

  addColumn(tableName: string, columnName: string, type: DataTypes.decimal, options: AddColumnNumericOptions): Promise<void>;

  addColumn(tableName: string, columnName: string, type: DataTypes): Promise<void>;
}

export interface CreateTableOptions {
  /**
   * Whether to automatically add a primary key column.
   * @default true
   */
  id?: boolean;

  /**
   * The name of the primary key, if one is to be added automatically.
   * If id is false, then this option is ignored.
   * @default "id"
   */
  primaryKey?: string;
}

export interface CreateTableConfigBlockParameter {
  column(columnName: string, type: DataTypes, options: AddColumnOptions): void;

  column(columnName: string, type: DataTypes.decimal, options: AddColumnNumericOptions): void;

  column(columnName: string, type: DataTypes): void;

  // todo: index();
  timestamps(): void;

  // todo:  t.change # changes the column definition. Ex: t.change(:name, :string, :limit => 80)
  //        t.change_default # changes the column default value.
  //        t.rename # changes the name of the column.
  //        t.references
  //        t.belongs_to
  //        t.remove
  //        t.remove_references
  //        t.remove_belongs_to
  //        t.remove_index
  //        t.remove_timestamps

  string(columnName: string, options?: AddColumnOptions): void;

  text(columnName: string, options?: AddColumnOptions): void;

  integer(columnName: string, options?: AddColumnOptions): void;

  float(columnName: string, options?: AddColumnOptions): void;

  decimal(columnName: string, options?: AddColumnNumericOptions): void;

  datetime(columnName: string, options?: AddColumnOptions): void;

  timestamp(columnName: string, options?: AddColumnOptions): void;

  time(columnName: string, options?: AddColumnOptions): void;

  date(columnName: string, options?: AddColumnOptions): void;

  boolean(columnName: string): void;
}

export type CreateTableConfigBlock = (table: CreateTableConfigBlockParameter) => Promise<unknown> | unknown;

export interface AddColumnOptions {
  /**
   * Requests a maximum column length. This is the number of characters for a string column and
   * number of bytes for text, binary and integer columns.
   * This option is ignored by some backends.
   */
  limit?: number;

  /**
   * The column’s default value. Use null for NULL.
   * @default null
   */
  default?: unknown | null;

  /**
   * Allows or disallows NULL values in the column.
   * @default true
   */
  null?: boolean;
}

export interface AddColumnNumericOptions extends AddColumnOptions {
  /**
   * Specifies the precision for the decimal and numeric columns.
   */
  precision?: number;

  /**
   * Specifies the scale for the decimal and numeric columns.
   */
  scale?: number;
}
