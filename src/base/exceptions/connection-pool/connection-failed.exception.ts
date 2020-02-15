import { ConnectionPoolException } from '../connection-pool.exception';

export class ConnectionPoolConnectionFailedException extends ConnectionPoolException {
  constructor() {
    super(`The connection pool was unable to establish a connection to the database. Please ensure that the credentials are provided correctly.`);
  }
}
