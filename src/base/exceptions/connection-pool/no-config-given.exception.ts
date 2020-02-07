import { ConnectionPoolException } from '../connection-pool.exception';

export class ConnectionPoolNoConfigGivenException extends ConnectionPoolException {
  constructor() {
    super(`The connection pool could not provide a connection. No configuration has been supplied. Please ensure that the credentials are provided correctly.`);
  }
}
