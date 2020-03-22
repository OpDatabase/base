// tslint:disable
/*
import { MigrationException } from '../exceptions/migration.exception';
import { DataType } from '../interfaces/data-type.enum';
import { AddColumnNumericOptions, AddColumnOptions } from '../interfaces/migration-operations.interface';

// tslint:disable:no-magic-numbers
// todo: needs refactoring
export function mysqlDataTypeToSql(type: DataType, options: AddColumnNumericOptions | AddColumnOptions): string {
  switch (type) {
    case DataType.boolean:
      return integerToSql(1);

    case DataType.date:
      return 'DATE';

    case DataType.datetime:
    case DataType.timestamp:
      return 'TIMESTAMP';

    case DataType.decimal:
      const numericOptions = options as AddColumnNumericOptions;
      if (numericOptions.precision === undefined && numericOptions.scale === undefined) {
        return 'DECIMAL';
      }
      if (numericOptions.precision === undefined) {
        throw new MigrationException(`Error adding decimal column: precision cannot be empty if scale is specified`);
      }

      return numericOptions.scale === undefined ? `DECIMAL(${numericOptions.precision})` : `DECIMAL(${numericOptions.precision},${numericOptions.scale})`;

    case DataType.float:
      return 'FLOAT';

    case DataType.integer:
      return integerToSql(options.limit || 4);

    case DataType.primaryKey:
      return 'SERIAL PRIMARY KEY';

    case DataType.string:
      return `VARCHAR(${options.limit || 255})`;

    case DataType.text:
      return textToSql(options.limit || 65535);

    case DataType.time:
      return 'TIME';
  }
}

function integerToSql(limit: number): string {
  if (limit === 1) {
    return 'TINYINT';
  } else if (limit === 2) {
    return 'SMALLINT';
  } else if (limit === 3) {
    return 'MEDIUMINT';
  } else if (limit === 4) {
    return 'INT';
  } else if (limit >= 5 && limit <= 8) {
    return 'BIGINT';
  } else {
    throw new MigrationException(`No integer type has byte size ${limit}`);
  }
}

function textToSql(limit: number | null): string {
  if (limit === null) {
    return 'TEXT';
  } else if (limit >= 0 && limit < 0xFF) {
    return 'TINYTEXT';
  } else if (limit >= 0x100 && limit < 0xFFFF) {
    return 'TEXT';
  } else if (limit >= 0x10000 && limit < 0xFFFFFF) {
    return 'MEDIUMTEXT';
  } else if (limit >= 0x1000000 && limit < 0xFFFFFFFF) {
    return 'LONGTEXT';
  } else {
    throw new MigrationException(`No text type has byte length ${limit}`);
  }
}
*/
