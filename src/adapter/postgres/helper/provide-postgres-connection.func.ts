import { Base, ConnectionPool } from '@opdb/base';
import { PoolConfig } from 'pg';
import { PostgresAdapter } from '../postgres.adapter';

/**
 * Provides a connection to a PostgreSQL server.
 * See https://node-postgres.com/api/client and https://node-postgres.com/api/pool
 * for config option.
 */
export function providePostgresConnection(config: PoolConfig): void {
  ConnectionPool.registerAdapter(PostgresAdapter);
  Base.connectionPool.connect({ adapter: 'postgres', ...config });
}
