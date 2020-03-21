import { MigrationException } from '../exceptions/migration.exception';
import { DataType } from '../interfaces/data-type.enum';
import { AddColumnNumericOptions, AddColumnOptions } from '../interfaces/migration-operations.interface';

// tslint:disable:no-magic-numbers

export function postgresDataTypeToSql(type: DataType, options: AddColumnNumericOptions | AddColumnOptions): string {
  switch (type) {
    case DataType.boolean:
      return 'BOOLEAN';

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
      return floatToSql(options.limit || 4);

    case DataType.integer:
      return integerToSql(options.limit || 4);

    case DataType.primaryKey:
      return 'SERIAL PRIMARY KEY';

    case DataType.string:
      return `VARCHAR(${options.limit || 255})`;

    case DataType.text:
      return 'TEXT';

    case DataType.time:
      return 'TIME';
  }
}

function integerToSql(limit: number): string {
  if (limit <= 2) {
    return 'SMALLINT';
  } else if (limit <= 4) {
    return 'INTEGER';
  } else if (limit >= 5 && limit <= 8) {
    return 'BIGINT';
  } else {
    throw new MigrationException(`No integer type has byte size ${limit}`);
  }
}

function floatToSql(limit: number): string {
  if (limit <= 4) {
    return 'REAL';
  } else if (limit > 4 && limit <= 8) {
    return 'DOUBLE PRECISION';
  } else {
    throw new MigrationException(`No float type has byte size ${limit}`);
  }
}
