import { DatabaseClient, SqlQueryWithTransposedPlaceholders } from '@opdb/base';
import { PoolClient } from 'pg';

export class PostgresClient implements DatabaseClient {
  constructor(
    private readonly nativeClient: PoolClient,
  ) {
  }

  public execute(input: SqlQueryWithTransposedPlaceholders): Promise<any> {
    return this.nativeClient.query(input.statement, input.transposedPlaceholders);
  }

  public release(): void {
    this.nativeClient.release();
  }

  public placeholderReplacementHandler(mark: number): string {
    return `$${mark}`;
  }
}
