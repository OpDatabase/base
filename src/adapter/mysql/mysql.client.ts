import { DatabaseClient, SqlQueryWithTransposedPlaceholders } from '@opdb/base';
import { PoolConnection } from 'mysql';

export class MysqlClient implements DatabaseClient {
  constructor(
    private nativeConnection: PoolConnection,
  ) {
  }

  public async execute<T>(input: SqlQueryWithTransposedPlaceholders): Promise<T[]> {
    return await new Promise((resolve, reject) => {
      this.nativeConnection.query(input.statement, input.transposedPlaceholders, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  public placeholderReplacementHandler(): string {
    return '?';
  }

  public release(): void {
    this.nativeConnection.release();
  }
}
