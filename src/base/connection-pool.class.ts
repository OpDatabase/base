import { ConnectionPoolConnectionFailedException } from './exceptions/connection-pool/connection-failed.exception';
import { ConnectionPoolInitializeUnknownAdapterException } from './exceptions/connection-pool/initialize-unknown-adapter.exception';
import { ConnectionPoolNoConfigGivenException } from './exceptions/connection-pool/no-config-given.exception';
import {
  DatabaseAdapter,
  DatabaseAdapterConfigPayload,
  DatabaseAdapterConstructor,
  DatabaseAdapterDeclaration,
  DatabaseClient,
} from './interfaces/adapter.interfaces';
import { Logger } from './logger.class';

/**
 * Manages the connections between OpDB and the database.
 */
export class ConnectionPool {
  // tslint:disable-next-line:no-any
  private static adapters: { [identifier: string]: DatabaseAdapterConstructor<any> } = {};
  private adapter: DatabaseAdapter | null = null;

  /**
   * Registers a new database adapter.
   */
  public static registerAdapter<T extends DatabaseAdapter>(type: DatabaseAdapterConstructor<T>): void {
    const instance = new type();
    this.adapters[instance.getIdentifier()] = type;
    Logger.debug(`(Connection Pool) Registered adapter "${instance.getIdentifier()}"`);
  }

  /**
   * Resets all adapters
   * @internal
   */
  public reset(): void {
    ConnectionPool.adapters = {};
    if (this.adapter != null) {
      this.adapter.stop();
      this.adapter = null;
    }
  }

  /**
   * Connects using the given database adapter config.
   */
  public connect<T extends DatabaseAdapter>(config: DatabaseAdapterConfigPayload & DatabaseAdapterDeclaration): void {
    // Find adapter
    const adapterConstructor = ConnectionPool.adapters[config.adapter] as DatabaseAdapterConstructor<T>;
    if (adapterConstructor == null) {
      throw new ConnectionPoolInitializeUnknownAdapterException(config.adapter);
    }

    // Initialize adapter
    this.adapter = new adapterConstructor();
    this.adapter!.loadConfig(config);
  }

  /**
   * Returns the currently connected database client.
   * If there is no connection, a new database client will be initialized.
   */
  public async getConnection(): Promise<DatabaseClient> {
    if (this.adapter == null) {
      throw new ConnectionPoolNoConfigGivenException();
    }

    let connection;
    try {
      connection = await this.adapter.getConnection();
    } catch (e) {
      Logger.error(e);
      throw new ConnectionPoolConnectionFailedException();
    }

    return connection;
  }
}
