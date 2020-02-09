import { DatabaseClient, SqlQueryWithTransposedPlaceholders } from '@opdb/base';
import { PoolClient, QueryResult, QueryResultRow } from 'pg';

export class PostgresClient implements DatabaseClient {
  constructor(
    private readonly nativeClient: PoolClient,
  ) {
  }

  // tslint:disable-next-line:no-any
  public async execute<R extends QueryResultRow = any>(input: SqlQueryWithTransposedPlaceholders): Promise<QueryResult<R>> {
    return this.nativeClient.query<R>(input.statement, input.transposedPlaceholders);
  }

  public release(): void {
    this.nativeClient.release();
  }

  public placeholderReplacementHandler(mark: number): string {
    return `$${mark}`;
  }
}
