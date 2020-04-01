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
        return 'NUMERIC';
      }
      if (numericOptions.precision === undefined) {
        throw new MigrationException(`Error adding decimal column: precision cannot be empty if scale is specified`);
      }

      return numericOptions.scale === undefined ? `NUMERIC(${numericOptions.precision})` : `NUMERIC(${numericOptions.precision}, ${numericOptions.scale})`;

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

export function postgresDataTypeSelector(
  type: DataType,
  options: AddColumnNumericOptions | AddColumnOptions,
): { subQuery: string, placeholders: { dataType: string, [key: string]: unknown } } {
  switch (type) {
    case DataType.boolean:
      return { subQuery: 'data_type = $dataType', placeholders: { dataType: 'boolean' } };

    case DataType.date:
      return { subQuery: 'data_type = $dataType', placeholders: { dataType: 'date' } };

    case DataType.datetime:
    case DataType.timestamp:
      return { subQuery: 'data_type = $dataType', placeholders: { dataType: 'timestamp without time zone' } };

    case DataType.decimal:
      const numericOptions = options as AddColumnNumericOptions;
      if (numericOptions.precision === undefined && numericOptions.scale === undefined) {
        return { subQuery: 'data_type = $dataType', placeholders: { dataType: 'numeric' } };
      }
      if (numericOptions.precision === undefined) {
        throw new MigrationException(`Error adding decimal column: precision cannot be empty if scale is specified`);
      }

      return numericOptions.scale === undefined ?
        {
          subQuery: 'data_type = $dataType AND numeric_precision = $precision',
          placeholders: { dataType: 'numeric', precision: numericOptions.precision },
        } :
        {
          subQuery: 'data_type = $dataType AND numeric_precision = $precision AND numeric_scale = $scale',
          placeholders: { dataType: 'numeric', precision: numericOptions.precision, scale: numericOptions.scale },
        };

    case DataType.float:
      const floatLimit = options.limit || 4;
      if (floatLimit <= 4) {
        return { subQuery: 'data_type = $dataType', placeholders: { dataType: 'real' } };
      } else if (floatLimit > 4 && floatLimit <= 8) {
        return { subQuery: 'data_type = $dataType', placeholders: { dataType: 'double precision' } };
      } else {
        throw new MigrationException(`No float type has byte size ${floatLimit}`);
      }

    case DataType.integer:
      return { subQuery: 'data_type = $dataType', placeholders: { dataType: postgresDataTypeToSql(type, options).toLocaleLowerCase() } };

    case DataType.primaryKey:
      return { subQuery: 'data_type = $dataType', placeholders: { dataType: 'integer' } };

    case DataType.string:
      if (options.limit === undefined) {
        return { subQuery: 'data_type = $dataType', placeholders: { dataType: 'character varying' } };
      }

      return {
        subQuery: 'data_type = $dataType AND character_maximum_length = $limit',
        placeholders: { dataType: 'character varying', limit: options.limit },
      };

    case DataType.text:
      return { subQuery: 'data_type = $dataType', placeholders: { dataType: 'text' } };

    case DataType.time:
      return { subQuery: 'data_type = $dataType', placeholders: { dataType: 'time without time zone' } };
  }
}

export function postgresDataTypeDefaultValueInformationSchema(
  value: unknown,
  type: DataType,
  options: AddColumnNumericOptions | AddColumnOptions,
): string {
  const { placeholders } = postgresDataTypeSelector(type, options);

  switch (type) {
    case DataType.boolean:
    case DataType.integer:
      return `${value}`;

    default:
      return `'${value}'::${placeholders.dataType}`;
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
