import { ConnectionPoolConnectionFailedException } from './exceptions/connection-pool/connection-failed.exception';
import { ConnectionPoolInitializeUnknownAdapterException } from './exceptions/connection-pool/initialize-unknown-adapter.exception';
import { ConnectionPoolNoConfigGivenException } from './exceptions/connection-pool/no-config-given.exception';
import { DatabaseAdapter, DatabaseAdapterConfigPayload, DatabaseAdapterConstructor, DatabaseClient } from './interfaces/adapter.interfaces';
import { Logger } from './logger.class';

export class ConnectionPoolClass {
  private static adapters: { [identifier: string]: DatabaseAdapterConstructor<any> } = {};
  private adapter: DatabaseAdapter | null = null;

  public static registerAdapter(type: DatabaseAdapterConstructor<any>) {
    const instance = new type();
    this.adapters[instance.getIdentifier()] = type;
    Logger.debug(`(Connection Pool) Registered adapter "${instance.getIdentifier()}"`);
  }

  connect(config: DatabaseAdapterConfigPayload & { adapter: string }) {
    // Find adapter
    const adapterConstructor = ConnectionPoolClass.adapters[config.adapter];
    if (adapterConstructor == null) {
      throw new ConnectionPoolInitializeUnknownAdapterException(config.adapter);
    }

    // Initialize adapter
    this.adapter = new adapterConstructor();
    this.adapter!.loadConfig(config);
  }

  async getConnection(): Promise<DatabaseClient> {
    if (this.adapter == null) {
      throw new ConnectionPoolNoConfigGivenException();
    }

    try {
      return await this.adapter.getConnection();
    } catch (e) {
      Logger.error(e);
      throw new ConnectionPoolConnectionFailedException();
    }
  }
}
