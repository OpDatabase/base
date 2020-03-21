import { postgresDataTypeToSql } from '../data-types/postgres.data-types';
import { DataType } from '../interfaces/data-type.enum';
import {
  AddColumnNumericOptions,
  AddColumnOptions,
  CreateTableConfigBlock,
  CreateTableOptions,
  NativeMigrationOperations,
} from '../interfaces/migration-operations.interface';
import { MigrationHandler } from './migration-handler.class';

export class PostgresMigration extends MigrationHandler implements NativeMigrationOperations {
  public async createTable(name: string, options: CreateTableOptions, configBlock: CreateTableConfigBlock): Promise<void> {
    const columnDefinitions: string[] = [];
    let placeholders: { [key: string]: unknown } = {};
    const addColumn = (columnName: string, type: DataType, opts: AddColumnNumericOptions | AddColumnOptions) => {
      const { statement, defaultPlaceholders } = this.columnDefinition(columnName, type, opts);
      columnDefinitions.push(statement);
      placeholders = { ...placeholders, ...defaultPlaceholders };
    };

    // Create primary key
    if (options.id === true || options.id === undefined) {
      addColumn(options.primaryKey || 'id', DataType.primaryKey, {});
      // await this.execute(`ALTER TABLE "${name}" ADD COLUMN "${primaryColumnName}" INTEGER`);
      // await this.execute(`ALTER TABLE "${name}" ADD PRIMARY KEY ("${primaryColumnName}")`);
    }

    // Run config block
    await configBlock({
      column: (columnName: string, type: DataType, opts?: AddColumnNumericOptions | AddColumnOptions) => addColumn(columnName, type, opts || {}),
      timestamps: () => {
        addColumn('created_at', DataType.datetime, {});
        addColumn('updated_at', DataType.datetime, {});
      },
      string: (columnName, opts) => addColumn(columnName, DataType.string, opts || {}),
      text: (columnName, opts) => addColumn(columnName, DataType.text, opts || {}),
      integer: (columnName, opts) => addColumn(columnName, DataType.integer, opts || {}),
      float: (columnName, opts) => addColumn(columnName, DataType.float, opts || {}),
      decimal: (columnName, opts) => addColumn(columnName, DataType.decimal, opts || {}),
      datetime: (columnName, opts) => addColumn(columnName, DataType.datetime, opts || {}),
      timestamp: (columnName, opts) => addColumn(columnName, DataType.timestamp, opts || {}),
      time: (columnName, opts) => addColumn(columnName, DataType.time, opts || {}),
      date: (columnName, opts) => addColumn(columnName, DataType.date, opts || {}),
      boolean: columnName => addColumn(columnName, DataType.boolean, {}),
    });

    // Run SQL statement
    await this.execute(`CREATE TABLE "${name}" (${columnDefinitions.join(', ')})`, placeholders);
  }

  public async addColumn(
    tableName: string,
    columnName: string,
    type: DataType,
    options: AddColumnNumericOptions | AddColumnOptions,
  ): Promise<void> {
    const { statement, defaultPlaceholders } = this.columnDefinition(columnName, type, options);
    await this.execute(`ALTER TABLE "${tableName}" ADD COLUMN ${statement}`, { ...defaultPlaceholders });
  }

  private columnDefinition(
    columnName: string,
    type: DataType,
    options: AddColumnNumericOptions | AddColumnOptions,
  ): { statement: string, defaultPlaceholders: { [key: string]: unknown } } {
    let statement = `"${columnName}" ${postgresDataTypeToSql(type, options)}`;
    const defaultPlaceholders: { [key: string]: unknown } = {};
    if (options.null === null || options.null === true) {
      statement = `${statement} NOT NULL`;
    }
    if (options.default !== undefined) {
      const placeholderName = `${columnName.replace(/\W/, '')}Default`;
      statement = `${statement} DEFAULT $${placeholderName}`;
      defaultPlaceholders[placeholderName] = options.default;
    }

    return { statement, defaultPlaceholders };
  }
}
