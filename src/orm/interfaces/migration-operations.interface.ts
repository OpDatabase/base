import { DataType } from './data-type.enum';

/**
 * Interface for native migration operation handlers
 */
export interface NativeMigrationOperations {
  /**
   * Adds a new column to an existing table.
   * @param tableName Name of the target table
   * @param columnName Name of the new table column to be added
   * @param type Data type for the new table column
   * @param options Advanced config options for the new table column
   */
  addColumn(tableName: string, columnName: string, type: DataType, options: AddColumnNumericOptions | AddColumnOptions): Promise<void>;

  /**
   * Adds a new index to an existing table.
   * @param tableName Name of the target table
   * @param columnNames Name of the columns to index
   * @param options Advanced config options for the new index
   */
  addIndex(tableName: string, columnNames: string[], options: AddIndexOptions): Promise<void>;

  /**
   * Creates a new join table with the name created using the lexical order of the first two arguments.
   * @param tableName1 name of the first table
   * @param tableName2 name of the second table
   * @param options advanced options for the join table
   * @param configBlock configBlock block to supply columns and indices for the new join table
   */
  createJoinTable(tableName1: string, tableName2: string, options: JoinTableOptions, configBlock: CreateTableConfigBlock): Promise<void>;

  /**
   * Creates a new table.
   * @param name Name of the new table
   * @param options Advanced configuration options for the new table
   * @param configBlock block to supply columns and indices for the new table
   */
  createTable(name: string, options: CreateTableOptions, configBlock: CreateTableConfigBlock): Promise<void>;

  dropJoinTable(tableName1: string, tableName2: string, options: JoinTableOptions): Promise<void>;

  dropTable(name: string, options: DropTableOptions): Promise<void>;
}

export interface MigrationOperations extends NativeMigrationOperations {
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

  /**
   * Adds a new index to an existing table.
   * @param tableName Name of the target table
   * @param columnNames Name of the columns to index
   */
  addIndex(tableName: string, columnNames: string[]): Promise<void>;

  /**
   * Adds a new index to an existing table.
   * @param tableName Name of the target table
   * @param columnName Name of the column to index
   */
  addIndex(tableName: string, columnName: string): Promise<void>;

  /**
   * Adds a new index to an existing table.
   * @param tableName Name of the target table
   * @param columnNames Name of the columns to index
   * @param options Advanced config options for the new index
   */
  addIndex(tableName: string, columnNames: string[], options: AddIndexOptions): Promise<void>;

  /**
   * Adds a new index to an existing table.
   * @param tableName Name of the target table
   * @param columnName Name of the column to index
   * @param options Advanced config options for the new index
   */
  addIndex(tableName: string, columnName: string, options: AddIndexOptions): Promise<void>;

  /**
   * Creates a new join table with the name created using the lexical order of the first two arguments.
   * @param tableName1 name of the first table
   * @param tableName2 name of the second table
   */
  createJoinTable(tableName1: string, tableName2: string): Promise<void>;

  /**
   * Creates a new join table with the name created using the lexical order of the first two arguments.
   * @param tableName1 name of the first table
   * @param tableName2 name of the second table
   * @param configBlock configBlock block to supply columns and indices for the new join table
   */
  createJoinTable(tableName1: string, tableName2: string, configBlock: CreateTableConfigBlock): Promise<void>;

  /**
   * Creates a new join table with the name created using the lexical order of the first two arguments.
   * @param tableName1 name of the first table
   * @param tableName2 name of the second table
   * @param options advanced options for the join table
   */
  createJoinTable(tableName1: string, tableName2: string, options: JoinTableOptions): Promise<void>;

  /**
   * Creates a new join table with the name created using the lexical order of the first two arguments.
   * @param tableName1 name of the first table
   * @param tableName2 name of the second table
   * @param options advanced options for the join table
   * @param configBlock configBlock block to supply columns and indices for the new join table
   */
  createJoinTable(tableName1: string, tableName2: string, options: JoinTableOptions, configBlock: CreateTableConfigBlock): Promise<void>;

  /**
   * Creates a new table.
   * @param name Name of the new table
   */
  createTable(name: string): Promise<void>;

  /**
   * Creates a new table.
   * @param name Name of the new table
   * @param configBlock block to supply columns and indices for the new table
   */
  createTable(name: string, configBlock: CreateTableConfigBlock): Promise<void>;

  /**
   * Creates a new table.
   * @param name Name of the new table
   * @param options Advanced configuration options for the new table
   * @param configBlock block to supply columns and indices for the new table
   */
  createTable(name: string, options: CreateTableOptions, configBlock: CreateTableConfigBlock): Promise<void>;

  dropJoinTable(tableName1: string, tableName2: string): Promise<void>;

  dropJoinTable(tableName1: string, tableName2: string, options: JoinTableOptions): Promise<void>;

  dropTable(name: string): Promise<void>;

  dropTable(name: string, options: DropTableOptions): Promise<void>;
}

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

export interface AddIndexOptions {
  /**
   * Sets if the index should be unique
   */
  unique?: boolean;

  /**
   * Sets the index name, overriding the default.
   */
  name?: string;
}

export interface JoinTableOptions {
  /**
   * Sets the table name, overriding the default.
   */
  tableName?: string;
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

export interface DropTableOptions {
  ifExists?: boolean;
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

  index(columnNames: string[]): void;

  index(columnNames: string): void;

  index(columnNames: string[], options: AddIndexOptions): void;

  index(columnNames: string, options: AddIndexOptions): void;

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
