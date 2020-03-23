import { MigrationException } from '../exceptions/migration.exception';
import { DataType } from '../interfaces/data-type.enum';
import { postgresDataTypeToSql } from './postgres.data-types';

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
