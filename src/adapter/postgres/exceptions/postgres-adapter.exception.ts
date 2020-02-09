import { BaseException } from '@opdb/base';

export class PostgresAdapterException extends BaseException {
  constructor(message: string) {
    super(message);
  }
}
