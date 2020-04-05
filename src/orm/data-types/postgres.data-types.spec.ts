import { MigrationException } from '../exceptions/migration.exception';
import { DataType } from '../interfaces/data-type.enum';
import { postgresDataTypeDefaultValueInformationSchema, postgresDataTypeSelector, postgresDataTypeToSql } from './postgres.data-types';

describe('postgresDataTypeToSql', () => {
  it('should return the correct SQL data type definitions', async () => {
    expect(postgresDataTypeToSql(DataType.boolean, {})).toStrictEqual('BOOLEAN');
    expect(postgresDataTypeToSql(DataType.date, {})).toStrictEqual('DATE');
    expect(postgresDataTypeToSql(DataType.datetime, {})).toStrictEqual('TIMESTAMP');
    expect(postgresDataTypeToSql(DataType.timestamp, {})).toStrictEqual('TIMESTAMP');
    expect(postgresDataTypeToSql(DataType.decimal, {})).toStrictEqual('NUMERIC');
    expect(postgresDataTypeToSql(DataType.decimal, { precision: 1 })).toStrictEqual('NUMERIC(1)');
    expect(postgresDataTypeToSql(DataType.decimal, { precision: 1, scale: 2 })).toStrictEqual('NUMERIC(1, 2)');
    expect(() => {
      postgresDataTypeToSql(DataType.decimal, { scale: 2 });
    }).toThrowError(MigrationException);
    expect(postgresDataTypeToSql(DataType.float, {})).toStrictEqual('REAL');
    expect(postgresDataTypeToSql(DataType.float, { limit: 4 })).toStrictEqual('REAL');
    expect(postgresDataTypeToSql(DataType.float, { limit: 8 })).toStrictEqual('DOUBLE PRECISION');
    expect(() => {
      postgresDataTypeToSql(DataType.float, { limit: 10 });
    }).toThrowError(MigrationException);
    expect(postgresDataTypeToSql(DataType.integer, {})).toStrictEqual('INTEGER');
    expect(postgresDataTypeToSql(DataType.integer, { limit: 2 })).toStrictEqual('SMALLINT');
    expect(postgresDataTypeToSql(DataType.integer, { limit: 4 })).toStrictEqual('INTEGER');
    expect(postgresDataTypeToSql(DataType.integer, { limit: 8 })).toStrictEqual('BIGINT');
    expect(() => {
      postgresDataTypeToSql(DataType.integer, { limit: 10 });
    }).toThrowError(MigrationException);
    expect(postgresDataTypeToSql(DataType.primaryKey, {})).toStrictEqual('SERIAL PRIMARY KEY');
    expect(postgresDataTypeToSql(DataType.string, {})).toStrictEqual('VARCHAR(255)');
    expect(postgresDataTypeToSql(DataType.string, { limit: 10 })).toStrictEqual('VARCHAR(10)');
    expect(postgresDataTypeToSql(DataType.text, {})).toStrictEqual('TEXT');
    expect(postgresDataTypeToSql(DataType.time, {})).toStrictEqual('TIME');
  });
});

describe('postgresDataTypeSelector', () => {
  it('should return the correct SQL data type selectors', async () => {
    expect(postgresDataTypeSelector(DataType.boolean, {})).toStrictEqual({
      subQuery: 'data_type = $dataType',
      placeholders: { dataType: 'boolean' },
    });
    expect(postgresDataTypeSelector(DataType.date, {})).toStrictEqual({
      subQuery: 'data_type = $dataType',
      placeholders: { dataType: 'date' },
    });
    expect(postgresDataTypeSelector(DataType.datetime, {})).toStrictEqual({
      subQuery: 'data_type = $dataType',
      placeholders: { dataType: 'timestamp without time zone' },
    });
    expect(postgresDataTypeSelector(DataType.timestamp, {})).toStrictEqual({
      subQuery: 'data_type = $dataType',
      placeholders: { dataType: 'timestamp without time zone' },
    });
    expect(postgresDataTypeSelector(DataType.decimal, {})).toStrictEqual({
      subQuery: 'data_type = $dataType',
      placeholders: { dataType: 'numeric' },
    });
    expect(postgresDataTypeSelector(DataType.decimal, { precision: 8 })).toStrictEqual({
      subQuery: 'data_type = $dataType AND numeric_precision = $precision',
      placeholders: { dataType: 'numeric', precision: 8 },
    });
    expect(postgresDataTypeSelector(DataType.decimal, { precision: 8, scale: 4 })).toStrictEqual({
      subQuery: 'data_type = $dataType AND numeric_precision = $precision AND numeric_scale = $scale',
      placeholders: { dataType: 'numeric', precision: 8, scale: 4 },
    });
    expect(() => postgresDataTypeSelector(DataType.decimal, { scale: 4 })).toThrowError();
    expect(postgresDataTypeSelector(DataType.float, {})).toStrictEqual({
      subQuery: 'data_type = $dataType',
      placeholders: { dataType: 'real' },
    });
    expect(postgresDataTypeSelector(DataType.float, { limit: 4 })).toStrictEqual({
      subQuery: 'data_type = $dataType',
      placeholders: { dataType: 'real' },
    });
    expect(postgresDataTypeSelector(DataType.float, { limit: 8 })).toStrictEqual({
      subQuery: 'data_type = $dataType',
      placeholders: { dataType: 'double precision' },
    });
    expect(() => postgresDataTypeSelector(DataType.float, { limit: 9 })).toThrowError();
    expect(postgresDataTypeSelector(DataType.integer, {})).toStrictEqual({
      subQuery: 'data_type = $dataType',
      placeholders: { dataType: 'integer' },
    });
    expect(postgresDataTypeSelector(DataType.integer, { limit: 2 })).toStrictEqual({
      subQuery: 'data_type = $dataType',
      placeholders: { dataType: 'smallint' },
    });
    expect(postgresDataTypeSelector(DataType.integer, { limit: 4 })).toStrictEqual({
      subQuery: 'data_type = $dataType',
      placeholders: { dataType: 'integer' },
    });
    expect(postgresDataTypeSelector(DataType.integer, { limit: 8 })).toStrictEqual({
      subQuery: 'data_type = $dataType',
      placeholders: { dataType: 'bigint' },
    });
    expect(() => postgresDataTypeSelector(DataType.integer, { limit: 9 })).toThrowError();
    expect(postgresDataTypeSelector(DataType.primaryKey, { limit: 8 })).toStrictEqual({
      subQuery: 'data_type = $dataType',
      placeholders: { dataType: 'integer' },
    });
    expect(postgresDataTypeSelector(DataType.string, {})).toStrictEqual({
      subQuery: 'data_type = $dataType',
      placeholders: { dataType: 'character varying' },
    });
    expect(postgresDataTypeSelector(DataType.string, { limit: 10 })).toStrictEqual({
      subQuery: 'data_type = $dataType AND character_maximum_length = $limit',
      placeholders: { dataType: 'character varying', limit: 10 },
    });
    expect(postgresDataTypeSelector(DataType.text, {})).toStrictEqual({
      subQuery: 'data_type = $dataType',
      placeholders: { dataType: 'text' },
    });
    expect(postgresDataTypeSelector(DataType.time, {})).toStrictEqual({
      subQuery: 'data_type = $dataType',
      placeholders: { dataType: 'time without time zone' },
    });
  });
});

describe('postgresDataTypeDefaultValueInformationSchema', () => {
  expect(postgresDataTypeDefaultValueInformationSchema(true, DataType.boolean, {})).toBe('true');
  expect(postgresDataTypeDefaultValueInformationSchema('VALUE', DataType.date, {})).toBe('\'VALUE\'::date');
  expect(postgresDataTypeDefaultValueInformationSchema('VALUE', DataType.datetime, {})).toBe('\'VALUE\'::timestamp without time zone');
  expect(postgresDataTypeDefaultValueInformationSchema('VALUE', DataType.decimal, {})).toBe('\'VALUE\'::numeric');
  expect(postgresDataTypeDefaultValueInformationSchema('VALUE', DataType.float, {})).toBe('\'VALUE\'::real');
  expect(postgresDataTypeDefaultValueInformationSchema(1, DataType.integer, {})).toBe('1');
  expect(postgresDataTypeDefaultValueInformationSchema('VALUE', DataType.string, {})).toBe('\'VALUE\'::character varying');
  expect(postgresDataTypeDefaultValueInformationSchema('VALUE', DataType.text, {})).toBe('\'VALUE\'::text');
  expect(postgresDataTypeDefaultValueInformationSchema('VALUE', DataType.time, {})).toBe('\'VALUE\'::time without time zone');
  expect(postgresDataTypeDefaultValueInformationSchema('VALUE', DataType.timestamp, {})).toBe('\'VALUE\'::timestamp without time zone');
  expect(postgresDataTypeDefaultValueInformationSchema('VALUE', DataType.primaryKey, {})).toBe('\'VALUE\'::integer');
});

