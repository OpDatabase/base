import pluralize from 'pluralize';
import { postgresDataTypeToSql } from '../data-types/postgres.data-types';
import { DataType } from '../interfaces/data-type.enum';
import {
  AddColumnNumericOptions,
  AddColumnOptions,
  AddIndexOptions,
  CreateTableConfigBlock,
  CreateTableOptions,
  DropTableOptions,
  IndexOptions,
  JoinTableOptions,
  NativeMigrationOperations,
} from '../interfaces/migration-operations.interface';
import { MigrationHandler } from './migration-handler.class';

export class PostgresMigration extends MigrationHandler implements NativeMigrationOperations {
  public async addColumn(
    tableName: string,
    columnName: string,
    type: DataType,
    options: AddColumnNumericOptions | AddColumnOptions,
  ): Promise<void> {
    const statement = columnDefinition(columnName, type, options);
    await this.execute(`ALTER TABLE "${tableName}" ADD COLUMN ${statement}`);
  }

  public async addIndex(tableName: string, columnNames: string[], options: AddIndexOptions): Promise<void> {
    const indexName = options.name || generateIndexName(tableName, columnNames);
    const statement = options.unique ? `CREATE UNIQUE INDEX "${indexName}"` : `CREATE INDEX "${indexName}"`;
    const escapedColumnNames = columnNames.map(name => `"${name}"`);
    await this.execute(`${statement} ON "${tableName}"(${escapedColumnNames.join(', ')})`);
  }

  public async createJoinTable(
    tableName1: string,
    tableName2: string,
    options: JoinTableOptions,
    configBlock: CreateTableConfigBlock,
  ): Promise<void> {
    const joinTableName = options.tableName || generateJoinTableName([tableName1, tableName2]);
    await this.createTable(joinTableName, { id: false }, async table => {
      // Add join columns
      table.integer(`${pluralize.singular(tableName1)}_id`);
      table.integer(`${pluralize.singular(tableName2)}_id`);

      // Run config block
      await configBlock(table);
    });
  }

  public async createTable(name: string, options: CreateTableOptions, configBlock: CreateTableConfigBlock): Promise<void> {
    const columnDefinitions: string[] = [];
    const indices: Array<{ columnNames: string[], options: AddIndexOptions }> = [];
    const addColumn = (columnName: string, type: DataType, opts: AddColumnNumericOptions | AddColumnOptions) => {
      columnDefinitions.push(columnDefinition(columnName, type, opts));
    };

    // Create primary key
    if (options.id === true || options.id === undefined) {
      addColumn(options.primaryKey || 'id', DataType.primaryKey, {});
    }

    // Run config block
    await configBlock({
      column: (columnName: string, type: DataType, opts?: AddColumnNumericOptions | AddColumnOptions) => {
        addColumn(columnName, type, opts || {});
      },
      index: (columnNames: string | string[], opts?: AddIndexOptions) => {
        indices.push({
          columnNames: typeof columnNames === 'string' ? [columnNames] : columnNames,
          options: opts || {},
        });
      },
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
      boolean: (columnName, opts) => addColumn(columnName, DataType.boolean, opts || {}),
    });

    // Run SQL statement
    await this.execute(`CREATE TABLE "${name}" (${columnDefinitions.join(', ')})`);

    // Add indices
    await Promise.all(indices.map(i => this.addIndex(name, i.columnNames, i.options)));
  }

  public async dropJoinTable(tableName1: string, tableName2: string, options: JoinTableOptions): Promise<void> {
    await this.dropTable(
      options.tableName || generateJoinTableName([tableName1, tableName2]),
      {},
    );
  }

  public async dropTable(name: string, options: DropTableOptions): Promise<void> {
    if (options.ifExists) {
      await this.execute(`DROP TABLE IF EXISTS "${name}"`);
    } else {
      await this.execute(`DROP TABLE "${name}"`);
    }
  }

  public async removeColumns(tableName: string, ...columnNames: string[]): Promise<void> {
    const dropStatements = columnNames.map(c => `DROP COLUMN "${c}"`);
    await this.execute(`ALTER TABLE "${tableName}" ${dropStatements.join(', ')}`);
  }

  public async removeIndex(tableName: string, columnNames: string[], options: IndexOptions): Promise<void> {
    const indexName = options.name || generateIndexName(tableName, columnNames);
    await this.execute(`DROP INDEX "${indexName}"`);
  }
}

function generateJoinTableName(columnNames: string[]): string {
  const tableNames = columnNames.sort((a, b) => a > b ? 1 : -1);

  return `${tableNames[0]}_${tableNames[1]}`;
}

function generateIndexName(tableName: string, columnNames: string[]): string {
  return `${tableName}_${columnNames.join('_')}_index`;
}

function columnDefinition(
  columnName: string,
  type: DataType,
  options: AddColumnNumericOptions | AddColumnOptions,
): string {
  let statement = `"${columnName}" ${postgresDataTypeToSql(type, options)}`;
  if (options.null === false) {
    statement = `${statement} NOT NULL`;
  }
  if (options.default !== undefined) {
    statement = `${statement} DEFAULT ${options.default}`;
  }

  return statement;
}
