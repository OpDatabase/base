import pluralize from 'pluralize';
import { postgresDataTypeDefaultValueInformationSchema, postgresDataTypeSelector, postgresDataTypeToSql } from '../data-types/postgres.data-types';
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

  public async changeColumnDefault(tableName: string, columnName: string, defaultValue: unknown | null): Promise<void> {
    if (defaultValue === null) {
      await this.execute(`ALTER TABLE "${tableName}" ALTER COLUMN "${columnName}" DROP DEFAULT`);
    } else {
      await this.execute(`ALTER TABLE "${tableName}" ALTER COLUMN "${columnName}" SET DEFAULT '${prepareValueNative(defaultValue)}'`);
    }
  }

  public async changeColumnNull(tableName: string, columnName: string, allowNull: boolean, replaceNullValuesWith?: unknown): Promise<void> {
    // Replace null values if requested
    if (replaceNullValuesWith !== undefined) {
      await this.execute(`UPDATE "${tableName}" SET "${columnName}" = $value WHERE "${columnName}" IS NULL`, {
        value: replaceNullValuesWith,
      });
    }

    if (allowNull) {
      await this.execute(`ALTER TABLE "${tableName}" ALTER COLUMN "${columnName}" DROP NOT NULL`);
    } else {
      await this.execute(`ALTER TABLE "${tableName}" ALTER COLUMN "${columnName}" SET NOT NULL`);
    }
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
      const blockResponse = configBlock(table);
      if (blockResponse instanceof Promise) {
        await blockResponse;
      }
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
    const blockResponse = configBlock({
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
      string: (columnName, opts) => {
        addColumn(columnName, DataType.string, opts || {});
      },
      text: (columnName, opts) => {
        addColumn(columnName, DataType.text, opts || {});
      },
      integer: (columnName, opts) => {
        addColumn(columnName, DataType.integer, opts || {});
      },
      float: (columnName, opts) => {
        addColumn(columnName, DataType.float, opts || {});
      },
      decimal: (columnName, opts) => {
        addColumn(columnName, DataType.decimal, opts || {});
      },
      datetime: (columnName, opts) => {
        addColumn(columnName, DataType.datetime, opts || {});
      },
      timestamp: (columnName, opts) => {
        addColumn(columnName, DataType.timestamp, opts || {});
      },
      time: (columnName, opts) => {
        addColumn(columnName, DataType.time, opts || {});
      },
      date: (columnName, opts) => {
        addColumn(columnName, DataType.date, opts || {});
      },
      boolean: (columnName, opts) => {
        addColumn(columnName, DataType.boolean, opts || {});
      },
    });
    if (blockResponse instanceof Promise) {
      await blockResponse;
    }

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

  public async renameColumn(tableName: string, columnName: string, newColumnName: string): Promise<void> {
    // todo: rename column index as well if given
    await this.execute(`ALTER TABLE "${tableName}" RENAME COLUMN "${columnName}" TO "${newColumnName}"`);
  }

  public async renameIndex(tableName: string, indexName: string, newIndexName: string): Promise<void> {
    tableName = `${tableName}`; // tableName is not required for PostgreSQL. To avoid Typescript error, use this syntax.
    await this.execute(`ALTER INDEX "${indexName}" RENAME TO "${newIndexName}"`);
  }

  public async renameTable(tableName: string, newTableName: string): Promise<void> {
    // todo: rename all column indices
    await this.execute(`ALTER TABLE "${tableName}" RENAME TO "${newTableName}"`);
  }

  public async columnExists(
    tableName: string,
    columnName: string,
    type: DataType | undefined,
    options: AddColumnNumericOptions | AddColumnOptions | undefined,
  ): Promise<boolean> {
    let query = `SELECT DISTINCT 1 FROM information_schema.columns WHERE table_schema = $schema AND table_name = $tableName AND column_name = $columnName`;
    let params: { [key: string]: unknown } = { schema: 'public', tableName, columnName };

    if (type !== undefined) {
      const { subQuery, placeholders } = postgresDataTypeSelector(type, options || {});
      query = `${query} AND ${subQuery}`;
      params = { ...params, ...placeholders };

      if (options !== undefined) {
        if (options.null !== undefined) {
          query = `${query} AND is_nullable = $isNullable`;
          params = { ...params, isNullable: options.null ? 'YES' : 'NO' };
        }
        if (options.default !== undefined) {
          query = `${query} AND column_default = $columnDefault`;
          params = {
            ...params,
            columnDefault: postgresDataTypeDefaultValueInformationSchema(
              prepareValueNative(options.default),
              type,
              options,
            ),
          };
        }
      }
    }

    return (await this.execute(query, params)).length === 1;
  }

  public async columns(tableName: string): Promise<string[]> {
    const records = await this.execute<{ column_name: string }>(
      `SELECT column_name FROM information_schema.columns WHERE table_schema = $schema AND table_name = $tableName`,
      { schema: 'public', tableName },
    );

    return records.map(r => r.column_name);
  }

  public async indexExists(tableName: string, columnNames: string[], options: IndexOptions): Promise<boolean> {
    const indexName = options.name || generateIndexName(tableName, columnNames);
    const records = await this.execute(
      `SELECT DISTINCT 1 FROM pg_indexes WHERE schemaname = $schema AND tablename = $tableName AND indexname = $indexName`,
      { schema: 'public', tableName, indexName },
    );

    return records.length === 1;
  }

  public async indexes(tableName: string): Promise<string[]> {
    const records = await this.execute<{ indexname: string }>(
      `SELECT indexname FROM pg_indexes WHERE schemaname = $schema AND tablename = $tableName`,
      { schema: 'public', tableName },
    );

    return records.map(r => r.indexname);
  }

  public async tableExists(tableName: string): Promise<boolean> {
    const records = await this.execute(
      `SELECT DISTINCT 1 FROM information_schema.tables WHERE table_schema = $schema AND table_name = $tableName`,
      { schema: 'public', tableName },
    );

    return records.length === 1;
  }

  public async tables(): Promise<string[]> {
    const records = await this.execute<{ table_name: string }>(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = $schema`,
      { schema: 'public' },
    );

    return records.map(r => r.table_name);
  }

}

function prepareValueNative(value: unknown): string {
  // tslint:disable-next-line:no-implicit-dependencies
  const pgUtils = require('pg/lib/utils') as { prepareValue(param: unknown): unknown };

  return `${pgUtils.prepareValue(value)}`;
}

function generateJoinTableName(columnNames: string[]): string {
  const tableNames = columnNames.sort((a, b) => a > b ? 1 : -1);

  return `${tableNames[0]}_${tableNames[1]}`;
}

function generateIndexName(tableName: string, columnNames: string[]): string {
  columnNames = columnNames.sort((a, b) => a > b ? 1 : -1);

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
    statement = `${statement} DEFAULT '${prepareValueNative(options.default)}'`;
  }

  return statement;
}
