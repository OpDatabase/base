import { ConnectionPoolException } from '../connection-pool.exception';

export class ConnectionPoolInitializeUnknownAdapterException extends ConnectionPoolException {
  constructor(adapterName: string) {
    super(`The connection pool was unable to initialize. The given adapter "${adapterName}" was not found. Please make sure to import it before initializing the connection pool.`);
  }
}
