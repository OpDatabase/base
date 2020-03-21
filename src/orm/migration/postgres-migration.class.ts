import { postgresDataTypeToSql } from '../data-types/postgres.data-types';
import { DataTypes } from '../interfaces/data-types.enum';
import {
  AddColumnNumericOptions,
  AddColumnOptions,
  CreateTableConfigBlock,
  CreateTableOptions,
  MigrationOperationsInternal,
} from '../interfaces/migration-operations.interface';
import { MigrationHandler } from './migration-handler.class';

export class PostgresMigration extends MigrationHandler implements MigrationOperationsInternal {
  public async createTable(name: string, options: CreateTableOptions, configBlock: CreateTableConfigBlock): Promise<void> {
    const columnDefinitions: string[] = [];
    let placeholders: { [key: string]: unknown } = {};
    const addColumn = (columnName: string, type: DataTypes, opts: AddColumnNumericOptions | AddColumnOptions) => {
      const { statement, defaultPlaceholders } = this.columnDefinition(columnName, type, opts);
      columnDefinitions.push(statement);
      placeholders = { ...placeholders, ...defaultPlaceholders };
    };

    // Create primary key
    if (options.id === true || options.id === undefined) {
      addColumn(options.primaryKey || 'id', DataTypes.primaryKey, {});
      // await this.execute(`ALTER TABLE "${name}" ADD COLUMN "${primaryColumnName}" INTEGER`);
      // await this.execute(`ALTER TABLE "${name}" ADD PRIMARY KEY ("${primaryColumnName}")`);
    }

    // Run config block
    await configBlock({
      column: (columnName: string, type: DataTypes, opts?: AddColumnNumericOptions | AddColumnOptions) => addColumn(columnName, type, opts || {}),
      timestamps: () => {
        addColumn('created_at', DataTypes.datetime, {});
        addColumn('updated_at', DataTypes.datetime, {});
      },
      string: (columnName, opts) => addColumn(columnName, DataTypes.string, opts || {}),
      text: (columnName, opts) => addColumn(columnName, DataTypes.text, opts || {}),
      integer: (columnName, opts) => addColumn(columnName, DataTypes.integer, opts || {}),
      float: (columnName, opts) => addColumn(columnName, DataTypes.float, opts || {}),
      decimal: (columnName, opts) => addColumn(columnName, DataTypes.decimal, opts || {}),
      datetime: (columnName, opts) => addColumn(columnName, DataTypes.datetime, opts || {}),
      timestamp: (columnName, opts) => addColumn(columnName, DataTypes.timestamp, opts || {}),
      time: (columnName, opts) => addColumn(columnName, DataTypes.time, opts || {}),
      date: (columnName, opts) => addColumn(columnName, DataTypes.date, opts || {}),
      boolean: columnName => addColumn(columnName, DataTypes.boolean, {}),
    });

    // Run SQL statement
    await this.execute(`CREATE TABLE "${name}" (${columnDefinitions.join(', ')})`, placeholders);
  }

  public async addColumn(
    tableName: string,
    columnName: string,
    type: DataTypes,
    options: AddColumnNumericOptions | AddColumnOptions,
  ): Promise<void> {
    const { statement, defaultPlaceholders } = this.columnDefinition(columnName, type, options);
    await this.execute(`ALTER TABLE "${tableName}" ADD COLUMN ${statement}`, { ...defaultPlaceholders });
  }

  private columnDefinition(
    columnName: string,
    type: DataTypes,
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
