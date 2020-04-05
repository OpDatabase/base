import { Logger } from '@opdb/base';
import pluralize from 'pluralize';
import { MigrationException } from '..';
import { mysqlDataTypeSelector, mysqlDataTypeToSql } from '../data-types/mysql.data-types';
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

export class MysqlMigration extends MigrationHandler implements NativeMigrationOperations {
  private latestTableSchemaName: string | null = null;

  public async addColumn(
    tableName: string,
    columnName: string,
    type: DataType,
    options: AddColumnNumericOptions | AddColumnOptions,
  ): Promise<void> {
    const statement = columnDefinition(columnName, type, options);
    await this.execute(`ALTER TABLE \`${tableName}\` ADD COLUMN ${statement}`);
  }

  public async addIndex(tableName: string, columnNames: string[], options: AddIndexOptions): Promise<void> {
    const indexName = options.name || generateIndexName(tableName, columnNames);
    const statement = options.unique ? `CREATE UNIQUE INDEX \`${indexName}\`` : `CREATE INDEX \`${indexName}\``;
    const escapedColumnNames = columnNames.map(name => `\`${name}\``);
    await this.execute(`${statement} ON \`${tableName}\`(${escapedColumnNames.join(', ')})`);
  }

  public async changeColumnDefault(tableName: string, columnName: string, defaultValue: unknown | null): Promise<void> {
    if (defaultValue === null) {
      await this.execute(`ALTER TABLE \`${tableName}\` ALTER COLUMN \`${columnName}\` DROP DEFAULT`);
    } else {
      await this.execute(`ALTER TABLE \`${tableName}\` ALTER COLUMN \`${columnName}\` SET DEFAULT ${prepareValueNative(defaultValue)}`);
    }
  }

  public async changeColumnNull(tableName: string, columnName: string, allowNull: boolean, replaceNullValuesWith?: unknown): Promise<void> {
    // Replace null values if requested
    if (replaceNullValuesWith !== undefined) {
      await this.execute(`UPDATE \`${tableName}\` SET \`${columnName}\` = $value WHERE \`${columnName}\` IS NULL`, {
        value: replaceNullValuesWith,
      });
    }

    // Since MySQL requires to re-define the column, we select the table create definition and extract the column definition
    const createTableStatement = await this.execute<{ 'Create Table': string }>(`SHOW CREATE TABLE \`${tableName}\``);
    /* istanbul ignore next */
    if (createTableStatement[0] == null) {
      throw new MigrationException(`Cannot get CREATE TABLE statement to modify column null constraint for "${columnName}". Please make sure that "SHOW CREATE TABLE \`${tableName}\`" succeeds before continuing.`);
    }
    const declarations = createTableStatement[0]['Create Table'].split(/\r?\n/).map(line => line.trim());
    const matchingDeclarations = declarations.filter(statement => statement.startsWith(`\`${columnName}\``));
    /* istanbul ignore next */
    if (matchingDeclarations.length !== 1) {
      throw new MigrationException(`Cannot find definition of "${columnName}" inside response of CREATE TABLE statement for "${tableName}".`);
    }

    let columnDefinitionString = matchingDeclarations[0].replace(`\`${columnName}\``, '');
    if (columnDefinitionString.endsWith(',')) {
      columnDefinitionString = columnDefinitionString.substr(0, columnDefinitionString.length - 1);
    }

    // Append or remove "NOT NULL" statement
    if (allowNull) {
      columnDefinitionString = columnDefinitionString.replace('NOT NULL', '');
    } else if (!allowNull && columnDefinitionString.indexOf('NOT NULL') === -1) {
      // Split by "DEFAULT", append to first segment
      const splitColumnDefinitions = columnDefinitionString.split(' DEFAULT ');
      splitColumnDefinitions[0] = `${splitColumnDefinitions[0]} NOT NULL`;
      columnDefinitionString = splitColumnDefinitions.join(' DEFAULT ');
      columnDefinitionString = columnDefinitionString.replace('DEFAULT NULL', '');
    }

    await this.execute(`ALTER TABLE \`${tableName}\` MODIFY COLUMN \`${columnName}\` ${columnDefinitionString}`);
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

    if (columnDefinitions.length === 0) {
      throw new MigrationException(`Cannot create table "${name}": MySQL does not support creating tables without any columns.`);
    }

    // Run SQL statement
    await this.execute(`CREATE TABLE \`${name}\` (${columnDefinitions.join(', ')})`);

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
      await this.execute(`DROP TABLE IF EXISTS \`${name}\``);
    } else {
      await this.execute(`DROP TABLE \`${name}\``);
    }
  }

  public async removeColumns(tableName: string, ...columnNames: string[]): Promise<void> {
    const dropStatements = columnNames.map(c => `DROP COLUMN \`${c}\``);
    await this.execute(`ALTER TABLE \`${tableName}\` ${dropStatements.join(', ')}`);
  }

  public async removeIndex(tableName: string, columnNames: string[], options: IndexOptions): Promise<void> {
    const indexName = options.name || generateIndexName(tableName, columnNames);
    await this.execute(`ALTER TABLE \`${tableName}\` DROP INDEX \`${indexName}\``);
  }

  public async renameColumn(tableName: string, columnName: string, newColumnName: string): Promise<void> {
    // todo: rename column index as well if given
    await this.execute(`ALTER TABLE \`${tableName}\` RENAME COLUMN \`${columnName}\` TO \`${newColumnName}\``);
  }

  public async renameIndex(tableName: string, indexName: string, newIndexName: string): Promise<void> {
    await this.execute(`ALTER TABLE \`${tableName}\` RENAME INDEX \`${indexName}\` TO \`${newIndexName}\``);
  }

  public async renameTable(tableName: string, newTableName: string): Promise<void> {
    // todo: rename all column indices
    await this.execute(`ALTER TABLE \`${tableName}\` RENAME TO \`${newTableName}\``);
  }

  public async columnExists(
    tableName: string,
    columnName: string,
    type: DataType | undefined,
    options: AddColumnNumericOptions | AddColumnOptions | undefined,
  ): Promise<boolean> {
    const schema = await this.getCurrentTableSchema();
    let query = `SELECT DISTINCT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = $schema AND TABLE_NAME = $tableName AND COLUMN_NAME = $columnName`;
    let params: { [key: string]: unknown } = { schema, tableName, columnName };

    if (type !== undefined) {
      // todo
      const { subQuery, placeholders } = mysqlDataTypeSelector(type, options || {});
      query = `${query} AND ${subQuery}`;
      params = { ...params, ...placeholders };

      if (options !== undefined) {
        if (options.null !== undefined) {
          query = `${query} AND IS_NULLABLE = $isNullable`;
          params = { ...params, isNullable: options.null ? 'YES' : 'NO' };
        }
        if (options.default !== undefined && type === DataType.text) {
          options.default = undefined;
          Logger.warn(
            '(MysqlMigration)',
            `MySQL does not support default value on data type text. Default selector will be ignored. Affected column = "${columnName}"`,
          );
        }
        if (options.default !== undefined) {
          const columnDefault = typeof options.default === 'boolean' ?
            options.default ? '1' : '0' :
            prepareValueNative(options.default).replace(/'/g, '');
          query = `${query} AND COLUMN_DEFAULT = $columnDefault`;
          params = {
            ...params,
            columnDefault,
          };
        }
      }
    }

    return (await this.execute(query, params)).length === 1;
  }

  public async columns(tableName: string): Promise<string[]> {
    const schema = await this.getCurrentTableSchema();
    const records = await this.execute<{ COLUMN_NAME: string }>(
      `SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = $schema AND TABLE_NAME = $tableName`,
      { schema, tableName },
    );

    return records.map(r => r.COLUMN_NAME);
  }

  public async indexExists(tableName: string, columnNames: string[], options: IndexOptions): Promise<boolean> {
    const schema = await this.getCurrentTableSchema();
    const indexName = options.name || generateIndexName(tableName, columnNames);
    const records = await this.execute(
      `SELECT DISTINCT 1 FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = $schema AND TABLE_NAME = $tableName AND INDEX_NAME = $indexName`,
      { schema, tableName, indexName },
    );

    return records.length === 1;
  }

  public async indexes(tableName: string): Promise<string[]> {
    const schema = await this.getCurrentTableSchema();
    const records = await this.execute<{ INDEX_NAME: string }>(
      `SELECT INDEX_NAME FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = $schema AND TABLE_NAME = $tableName`,
      { schema, tableName },
    );

    return records.map(r => r.INDEX_NAME);
  }

  public async tableExists(tableName: string): Promise<boolean> {
    const schema = await this.getCurrentTableSchema();
    const records = await this.execute(
      `SELECT DISTINCT 1 FROM information_schema.TABLES WHERE TABLE_SCHEMA = $schema AND TABLE_NAME = $tableName`,
      { schema, tableName },
    );

    return records.length === 1;
  }

  public async tables(): Promise<string[]> {
    const schema = await this.getCurrentTableSchema();
    const records = await this.execute<{ TABLE_NAME: string }>(
      `SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = $schema`,
      { schema },
    );

    return records.map(r => r.TABLE_NAME);
  }

  private async getCurrentTableSchema(): Promise<string> {
    if (this.latestTableSchemaName == null) {
      const records = await this.execute<{ databaseName: string }>(
        `SELECT DATABASE() AS \`databaseName\``,
      );
      /* istanbul ignore next */
      if (records.length === 0) {
        throw new MigrationException(`Cannot determine current MySQL database name. Make sure, your system supports "SELECT DATABASE()" before continuing.`);
      }
      this.latestTableSchemaName = records[0].databaseName;
    }

    return this.latestTableSchemaName;
  }
}

function prepareValueNative(value: unknown): string {
  // tslint:disable-next-line:no-implicit-dependencies
  const sqlString = require('sqlstring') as { escape(value: unknown): string; };

  return `${sqlString.escape(value)}`;
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
  let statement = `\`${columnName}\` ${mysqlDataTypeToSql(type, options)}`;
  if (options.null === false) {
    statement = `${statement} NOT NULL`;
  }
  if (options.default !== undefined && type === DataType.text) {
    options.default = undefined;
    Logger.warn(
      '(MysqlMigration)',
      `Cannot add default value to columns of type text. Default value has been removed. Affected column = "${columnName}"`,
    );
  }
  if (options.default !== undefined) {
    statement = `${statement} DEFAULT ${prepareValueNative(options.default)}`;
  }

  return statement;
}
