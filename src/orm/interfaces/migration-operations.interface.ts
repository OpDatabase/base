import { DataType } from './data-type.enum';

/**
 * Interface for native migration operation handlers
 */
export interface NativeMigrationOperations {
  /**
   * Creates a new table.
   * @param name Name of the new table
   * @param options Advanced configuration options for the new table
   * @param configBlock block to supply tables and indices for the new table
   */
  createTable(name: string, options: CreateTableOptions, configBlock: CreateTableConfigBlock): Promise<void>;

  /**
   * Adds a new column to an existing table.
   * @param tableName Name of the target table
   * @param columnName Name of the new table column to be added
   * @param type Data type for the new table column
   * @param options Advanced config options for the new table column
   */
  addColumn(tableName: string, columnName: string, type: DataType, options: AddColumnNumericOptions | AddColumnOptions): Promise<void>;
}

export interface MigrationOperations extends NativeMigrationOperations {
  /**
   * Creates a new table.
   * @param name Name of the new table
   * @param configBlock block to supply tables and indices for the new table
   */
  createTable(name: string, configBlock: CreateTableConfigBlock): Promise<void>;

  /**
   * Creates a new table.
   * @param name Name of the new table
   * @param options Advanced configuration options for the new table
   * @param configBlock block to supply tables and indices for the new table
   */
  createTable(name: string, options: CreateTableOptions, configBlock: CreateTableConfigBlock): Promise<void>;

  /**
   * Adds a new column to an existing table.
   * @param tableName Name of the target table
   * @param columnName Name of the new table column to be added
   * @param type Data type for the new table column
   * @param options Advanced config options for the new table column
   */
  addColumn(tableName: string, columnName: string, type: DataType, options: AddColumnOptions): Promise<void>;

  /**
   * Adds a new column to an existing table.
   * @param tableName Name of the target table
   * @param columnName Name of the new table column to be added
   * @param type Data type for the new table column
   * @param options Advanced config options for the new table column
   */
  addColumn(tableName: string, columnName: string, type: DataType.decimal, options: AddColumnNumericOptions): Promise<void>;

  /**
   * Adds a new column to an existing table.
   * @param tableName Name of the target table
   * @param columnName Name of the new table column to be added
   * @param type Data type for the new table column
   */
  addColumn(tableName: string, columnName: string, type: DataType): Promise<void>;
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
  /**
   * Adds a new column to the table.
   * @param columnName Name of the new table column to be added
   * @param type Data type for the new table column
   * @param options Advanced config options for the new table column
   */
  column(columnName: string, type: DataType, options: AddColumnOptions): void;

  /**
   * Adds a new column to the table.
   * @param columnName Name of the new table column to be added
   * @param type Data type for the new table column
   * @param options Advanced config options for the new table column
   */
  column(columnName: string, type: DataType.decimal, options: AddColumnNumericOptions): void;

  /**
   * Adds a new column to the table.
   * @param columnName Name of the new table column to be added
   * @param type Data type for the new table column
   */
  column(columnName: string, type: DataType): void;

  /**
   * Adds the columns "created_at" and "updated_at" to the table.
   */
  timestamps(): void;

  /**
   * Adds a new column of type string to the table.
   * @param columnName Name of the new table column to be added
   * @param options Advanced config options for the new table column
   */
  string(columnName: string, options?: AddColumnOptions): void;

  /**
   * Adds a new column of type text to the table.
   * @param columnName Name of the new table column to be added
   * @param options Advanced config options for the new table column
   */
  text(columnName: string, options?: AddColumnOptions): void;

  /**
   * Adds a new column of type integer to the table.
   * @param columnName Name of the new table column to be added
   * @param options Advanced config options for the new table column
   */
  integer(columnName: string, options?: AddColumnOptions): void;

  /**
   * Adds a new column of type float to the table.
   * @param columnName Name of the new table column to be added
   * @param options Advanced config options for the new table column
   */
  float(columnName: string, options?: AddColumnOptions): void;

  /**
   * Adds a new column of type decimal to the table.
   * @param columnName Name of the new table column to be added
   * @param options Advanced config options for the new table column
   */
  decimal(columnName: string, options?: AddColumnNumericOptions): void;

  /**
   * Adds a new column of type datetime to the table.
   * @param columnName Name of the new table column to be added
   * @param options Advanced config options for the new table column
   */
  datetime(columnName: string, options?: AddColumnOptions): void;

  /**
   * Adds a new column of type timestamp to the table.
   * @param columnName Name of the new table column to be added
   * @param options Advanced config options for the new table column
   */
  timestamp(columnName: string, options?: AddColumnOptions): void;

  /**
   * Adds a new column of type time to the table.
   * @param columnName Name of the new table column to be added
   * @param options Advanced config options for the new table column
   */
  time(columnName: string, options?: AddColumnOptions): void;

  /**
   * Adds a new column of type date to the table.
   * @param columnName Name of the new table column to be added
   * @param options Advanced config options for the new table column
   */
  date(columnName: string, options?: AddColumnOptions): void;

  /**
   * Adds a new column of type boolean to the table.
   * @param columnName Name of the new table column to be added
   */
  boolean(columnName: string): void;

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
  //        t.index
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
