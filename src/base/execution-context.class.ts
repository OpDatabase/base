import uuid from 'uuid';
import { Base } from './base.class';
import { ExecutionContextProperties, ZoneNames } from './const/zone-names.enum';
import { Logger } from './logger.class';

/**
 * Handles the execution context for each database call.
 */
export abstract class ExecutionContext {
  /**
   * If set to true, more debug information will be logged.
   */
  public static showDebugInfo = false;

  /**
   * Creates a new execution context that wraps all calls inside context.
   * Additional parameters can be supplied that will be passed inside the context.
   */
  // tslint:disable-next-line:no-any
  public static async create(context: () => Promise<any>, properties: Partial<ExecutionContextProperties> = {}): Promise<void> {
    let closeConnectionOnComplete = false;

    // Check if new database client is enforced or given in the current Zone
    if (properties.__opdb_database_client == null && Base.connection == null) {
      properties.__opdb_database_client = await Base.connectionPool.getConnection();
      properties.__opdb_database_client_id = this.random();
      closeConnectionOnComplete = true;
    }

    const name = this.random();
    const zone = Zone.current.fork({
      name,
      properties,
    });

    return new Promise(async (resolve, reject) => {
      zone.runGuarded(async () => {
        try {
          if (this.showDebugInfo) {
            Logger.debug(`[EXECUTION CONTEXT ${Zone.current.name}: ENTER] ${JSON.stringify(this.executionContextInfo())}`);
          }

          // cb.call(zone);
          await context();

        } catch (e) {
          reject(e);
          throw e;
        }

        if (this.showDebugInfo) {
          Logger.debug(`[EXECUTION CONTEXT ${Zone.current.name}: EXIT] ${JSON.stringify(this.executionContextInfo())}`);
        }

        if (closeConnectionOnComplete) {
          if (this.showDebugInfo) {
            Logger.debug(`[EXECUTION CONTEXT ${Zone.current.name}: RELEASE DB CLIENT]`);
          }

          // The current Zone initialized the database connection
          // Now: Close the database connection
          // At this instance, there has to be a database client (bang operator).
          Base.connection!.release();
        }

        resolve();
      });
    });
  }

  /**
   * Wraps the contents of context in a transaction. The transaction will be committed,
   * once the context is left. On any exception emitted by the context, the transaction
   * will be aborted.
   */
  // tslint:disable-next-line:no-any
  public static async createTransaction(context: () => Promise<any>) {
    return this.create(async () => {
      // Initialize Transaction
      await Base.execute('BEGIN');

      try {
        // Run callback function
        await context();

        // Close transaction
        await Base.execute('COMMIT');

      } catch (e) {
        await Base.execute('ROLLBACK');
        throw e;
      }
    }, { __opdb_transaction_id: this.random() });
  }

  private static executionContextInfo() {
    return {
      clientId: Zone.current.get(ZoneNames.DatabaseClientId),
      client: Zone.current.get(ZoneNames.DatabaseClient),
      transactionId: Zone.current.get(ZoneNames.TransactionId),
    };
  }

  private static random() {
    return uuid.v4();
  }
}
