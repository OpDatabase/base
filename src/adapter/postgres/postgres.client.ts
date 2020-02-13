import { DatabaseClient, SqlQueryWithTransposedPlaceholders } from '@opdb/base';
import { PoolClient } from 'pg';

export class PostgresClient implements DatabaseClient {
  constructor(private readonly nativeClient: PoolClient) {
  }

  public async execute<T>(input: SqlQueryWithTransposedPlaceholders): Promise<T[]> {
    return (await this.nativeClient.query<T>(input.statement, input.transposedPlaceholders)).rows;
  }

  public release(): void {
    this.nativeClient.release();
  }

  public placeholderReplacementHandler(mark: number): string {
    return `$${mark}`;
  }
}
