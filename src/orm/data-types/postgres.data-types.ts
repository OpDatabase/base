import { MigrationException } from '../exceptions/migration.exception';
import { DataTypes } from '../interfaces/data-types.enum';
import { AddColumnNumericOptions, AddColumnOptions } from '../interfaces/migration-operations.interface';

// tslint:disable:no-magic-numbers

export function postgresDataTypeToSql(type: DataTypes, options: AddColumnNumericOptions | AddColumnOptions): string {
  switch (type) {
    case DataTypes.boolean:
      return integerToSql(1);

    case DataTypes.date:
      return 'DATE';

    case DataTypes.datetime:
    case DataTypes.timestamp:
      return 'TIMESTAMP';

    case DataTypes.decimal:
      const numericOptions = options as AddColumnNumericOptions;
      if (numericOptions.precision === undefined && numericOptions.scale === undefined) {
        return 'DECIMAL';
      }
      if (numericOptions.precision === undefined) {
        throw new MigrationException(`Error adding decimal column: precision cannot be empty if scale is specified`);
      }

      return numericOptions.scale === undefined ? `DECIMAL(${numericOptions.precision})` : `DECIMAL(${numericOptions.precision},${numericOptions.scale})`;

    case DataTypes.float:
      return 'FLOAT';

    case DataTypes.integer:
      return integerToSql(options.limit || 4);

    case DataTypes.primaryKey:
      return 'SERIAL PRIMARY KEY';

    case DataTypes.string:
      return `VARCHAR(${options.limit || 255})`;

    case DataTypes.text:
      return textToSql(options.limit || 65535);

    case DataTypes.time:
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
