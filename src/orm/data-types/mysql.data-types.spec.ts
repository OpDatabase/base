import { DataType, MigrationException } from '..';
import { mysqlDataTypeSelector, mysqlDataTypeToSql } from './mysql.data-types';

describe('mysqlDataTypeToSql', () => {
  it('should return the correct SQL data type definitions', async () => {
    expect(mysqlDataTypeToSql(DataType.boolean, {})).toBe('TINYINT');
    expect(mysqlDataTypeToSql(DataType.date, {})).toBe('DATE');
    expect(mysqlDataTypeToSql(DataType.datetime, {})).toBe('TIMESTAMP');
    expect(mysqlDataTypeToSql(DataType.timestamp, {})).toBe('TIMESTAMP');
    expect(mysqlDataTypeToSql(DataType.decimal, {})).toStrictEqual('DECIMAL');
    expect(mysqlDataTypeToSql(DataType.decimal, { precision: 1 })).toStrictEqual('DECIMAL(1)');
    expect(mysqlDataTypeToSql(DataType.decimal, { precision: 1, scale: 2 })).toStrictEqual('DECIMAL(1,2)');
    expect(() => {
      mysqlDataTypeToSql(DataType.decimal, { scale: 2 });
    }).toThrowError(MigrationException);
    expect(mysqlDataTypeToSql(DataType.float, {})).toBe('FLOAT');
    expect(mysqlDataTypeToSql(DataType.integer, {})).toStrictEqual('INT');
    expect(mysqlDataTypeToSql(DataType.integer, { limit: 1 })).toStrictEqual('TINYINT');
    expect(mysqlDataTypeToSql(DataType.integer, { limit: 2 })).toStrictEqual('SMALLINT');
    expect(mysqlDataTypeToSql(DataType.integer, { limit: 3 })).toStrictEqual('MEDIUMINT');
    expect(mysqlDataTypeToSql(DataType.integer, { limit: 4 })).toStrictEqual('INT');
    expect(mysqlDataTypeToSql(DataType.integer, { limit: 8 })).toStrictEqual('BIGINT');
    expect(() => {
      mysqlDataTypeToSql(DataType.integer, { limit: 10 });
    }).toThrowError(MigrationException);
    expect(mysqlDataTypeToSql(DataType.primaryKey, {})).toBe('BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY');
    expect(mysqlDataTypeToSql(DataType.string, {})).toStrictEqual('VARCHAR(255)');
    expect(mysqlDataTypeToSql(DataType.string, { limit: 10 })).toStrictEqual('VARCHAR(10)');
    expect(mysqlDataTypeToSql(DataType.text, {})).toStrictEqual('TEXT');
    expect(mysqlDataTypeToSql(DataType.text, { limit: 255 })).toStrictEqual('TINYTEXT');
    expect(mysqlDataTypeToSql(DataType.text, { limit: 65535 })).toStrictEqual('TEXT');
    expect(mysqlDataTypeToSql(DataType.text, { limit: 16777215 })).toStrictEqual('MEDIUMTEXT');
    expect(mysqlDataTypeToSql(DataType.text, { limit: 4294967295 })).toStrictEqual('LONGTEXT');
    expect(() => {
      mysqlDataTypeToSql(DataType.text, { limit: 4294967296 });
    }).toThrowError(MigrationException);
    expect(mysqlDataTypeToSql(DataType.time, {})).toBe('TIME');
  });
});

describe('mysqlDataTypeSelector', () => {
  it('should return the correct SQL data type selectors', async () => {
    expect(mysqlDataTypeSelector(DataType.decimal, {})).toStrictEqual({
      subQuery: 'DATA_TYPE = $dataType',
      placeholders: { dataType: 'decimal' },
    });
    expect(mysqlDataTypeSelector(DataType.decimal, { precision: 8 })).toStrictEqual({
      subQuery: 'DATA_TYPE = $dataType AND NUMERIC_PRECISION = $precision',
      placeholders: { dataType: 'decimal', precision: 8 },
    });
    expect(mysqlDataTypeSelector(DataType.decimal, { precision: 8, scale: 4 })).toStrictEqual({
      subQuery: 'DATA_TYPE = $dataType AND NUMERIC_PRECISION = $precision AND NUMERIC_SCALE = $scale',
      placeholders: { dataType: 'decimal', precision: 8, scale: 4 },
    });
    expect(() => mysqlDataTypeSelector(DataType.decimal, { scale: 4 })).toThrowError();
    expect(mysqlDataTypeSelector(DataType.primaryKey, { limit: 8 })).toStrictEqual({
      subQuery: 'DATA_TYPE = $dataType AND COLUMN_KEY = $columnKey',
      placeholders: { dataType: 'bigint', columnKey: 'PRI' },
    });
    expect(mysqlDataTypeSelector(DataType.string, { limit: 10 })).toStrictEqual({
      subQuery: 'DATA_TYPE = $dataType AND CHARACTER_MAXIMUM_LENGTH = $limit',
      placeholders: { dataType: 'varchar', limit: 10 },
    });
    expect(mysqlDataTypeSelector(DataType.string, {})).toStrictEqual({
      subQuery: 'DATA_TYPE = $dataType AND CHARACTER_MAXIMUM_LENGTH = $limit',
      placeholders: { dataType: 'varchar', limit: 255 },
    });
    expect(mysqlDataTypeSelector(DataType.boolean, {})).toStrictEqual({
      subQuery: 'DATA_TYPE = $dataType',
      placeholders: { dataType: 'tinyint' },
    });
    expect(mysqlDataTypeSelector(DataType.date, {})).toStrictEqual({
      subQuery: 'DATA_TYPE = $dataType',
      placeholders: { dataType: 'date' },
    });
    expect(mysqlDataTypeSelector(DataType.datetime, {})).toStrictEqual({
      subQuery: 'DATA_TYPE = $dataType',
      placeholders: { dataType: 'timestamp' },
    });
    expect(mysqlDataTypeSelector(DataType.timestamp, {})).toStrictEqual({
      subQuery: 'DATA_TYPE = $dataType',
      placeholders: { dataType: 'timestamp' },
    });
    expect(mysqlDataTypeSelector(DataType.float, {})).toStrictEqual({
      subQuery: 'DATA_TYPE = $dataType',
      placeholders: { dataType: 'float' },
    });
    expect(mysqlDataTypeSelector(DataType.integer, {})).toStrictEqual({
      subQuery: 'DATA_TYPE = $dataType',
      placeholders: { dataType: 'int' },
    });
    expect(mysqlDataTypeSelector(DataType.text, {})).toStrictEqual({
      subQuery: 'DATA_TYPE = $dataType',
      placeholders: { dataType: 'text' },
    });
    expect(mysqlDataTypeSelector(DataType.time, {})).toStrictEqual({
      subQuery: 'DATA_TYPE = $dataType',
      placeholders: { dataType: 'time' },
    });
  });
});
