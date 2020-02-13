import { ConnectionPool } from './connection-pool.class';
import { ZoneNames } from './const/zone-names.enum';
import { ExecutionContext } from './execution-context.class';
import { resolvePlaceholders } from './helper/resolve-placeholders.func';
import { DatabaseClient, SqlQueryPlaceholders } from './interfaces/adapter.interfaces';
import { Logger } from './logger.class';

/**
 * Base class that handles the database connection as well as query execution.
 */
export class Base {
  /**
   * Returns the connection pool that has been instantiated.
   */
  public static readonly connectionPool = new ConnectionPool();

  /**
   * Returns the database client that is available in the current execution context.
   */
  public static get connection(): DatabaseClient | null {
    return Zone.current.get(ZoneNames.DatabaseClient) as DatabaseClient | undefined || null;
  }

  /**
   * Executes an sql statement with given placeholders.
   */
  public static async execute<T>(sql: string, placeholders: SqlQueryPlaceholders = {}): Promise<T[]> {
    const connection = Base.connection;
    if (connection == null) {
      // The SQL statement is not part of any ExecutionContext
      // Therefore: Create new execution context
      let executionContextResult: T[] = [];
      await ExecutionContext.create(async () => {
        executionContextResult = await Base.execute<T>(sql, placeholders);
      });

      return executionContextResult;
    }

    const start = Date.now();
    const payload = resolvePlaceholders(
      sql,
      placeholders,
      connection.placeholderReplacementHandler == null ? undefined : connection.placeholderReplacementHandler,
    );
    const placeholdersWithName = payload.usedPlaceholders.map((name, i) => ({
      name,
      value: payload.transposedPlaceholders[i],
    }));

    // todo: maybe throw QueryFailedException here instead of native exception
    const result = await connection.execute<T>(payload);
    Logger.logQuery(`SQL (${Date.now() - start}ms)`, payload.statement, placeholdersWithName);

    return result;
  }

  /**
   * Wraps the contents of context in a transaction. The transaction will be committed,
   * once the context is left. On any exception emitted by the context, the transaction
   * will be aborted.
   */
  // tslint:disable-next-line:no-any
  public static async transaction(context: () => Promise<any>) {
    return ExecutionContext.createTransaction(context);
  }
}
