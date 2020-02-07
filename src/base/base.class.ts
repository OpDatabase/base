import { ConnectionPoolClass } from './connection-pool.class';
import { ZoneNames } from './const/zone-names.enum';
import { ExecutionContext } from './execution-context.class';
import { DatabaseClient, SqlQueryPlaceholders } from './interfaces/adapter.interfaces';
import { Logger } from './logger.class';

export class BaseClass {
  public static connectionPool = new ConnectionPoolClass();

  public static get connection(): DatabaseClient | null {
    return Zone.current.get(ZoneNames.DatabaseClient);
  }

  public static async execute(sql: string, placeholders: SqlQueryPlaceholders = {}): Promise<any> {
    const connection = BaseClass.connection;
    if (connection == null) {
      // The SQL statement is not part of any ExecutionContext
      // Therefore: Create new execution context
      return new Promise((resolve, reject) => {
        ExecutionContext.create(async () => {
          try {
            resolve(await BaseClass.execute(sql));
          } catch (e) {
            reject(e);
          }
        });
      });
    }

    let result;
    const start = Date.now();
    const payload = connection.resolvePlaceholders(sql, placeholders);
    const placeholdersWithName = payload.usedPlaceholders.map((name, i) => ({
      name,
      value: payload.transposedPlaceholders[i],
    }));

    try {
      result = await connection.execute(payload);
    } catch (e) {
      throw e;
    } finally {
      Logger.logQuery(`SQL (${Date.now() - start}ms)`, payload.statement, placeholdersWithName);
    }

    return result;
  }

  public static async transaction(context: () => Promise<any>) {
    return ExecutionContext.createTransaction(context);
  }
}
