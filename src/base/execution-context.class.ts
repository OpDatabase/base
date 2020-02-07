import uuid from 'uuid';
import { BaseClass } from './base.class';
import { ZoneNames } from './const/zone-names.enum';
import { DatabaseClient } from './interfaces/adapter.interfaces';
import { Logger } from './logger.class';

export abstract class ExecutionContext {
  public static showDebugInfo = false;

  public static async create(context: () => Promise<any>, properties: Partial<ExecutionContextProperties> = {}) {
    let closeConnectionOnComplete = false;

    // Check if new database client is enforced or given in the current Zone
    if (properties.__opdb_database_client == null && BaseClass.connection == null) {
      properties.__opdb_database_client = await BaseClass.connectionPool.getConnection();
      properties.__opdb_database_client_id = this.random();
      closeConnectionOnComplete = true;
    }

    const name = this.random();
    const zone = Zone.current.fork({
      name,
      properties,
    });

    return await new Promise(async (resolve, reject) => {
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
          BaseClass.connection?.release();
        }

        resolve();
      });
    });
  }

  public static async createTransaction(context: () => Promise<any>) {
    return await this.create(async () => {
      // Initialize Transaction
      await BaseClass.execute('BEGIN');

      try {
        // Run callback function
        await context();

        // Close transaction
        await BaseClass.execute('COMMIT');

      } catch (e) {
        await BaseClass.execute('ROLLBACK');
        throw e;
      }

      return;

    }, { __opdb_transaction_id: this.random() });
  }

  private static executionContextInfo() {
    return {
      clientId: Zone.current.get(ZoneNames.DatabaseClientId),
      client: Zone.current.get(ZoneNames.DatabaseClient) == null ? 'null' : 'not null',
      transactionId: Zone.current.get(ZoneNames.TransactionId),
    };
  }

  private static random() {
    return uuid.v4();
  }
}

export interface ExecutionContextProperties {
  __opdb_database_client: DatabaseClient;
  __opdb_database_client_id: string;
  __opdb_transaction_id: string;
}
