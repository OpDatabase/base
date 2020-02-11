import { Base, ConnectionPool } from '@opdb/base';
import { PoolConfig } from 'mysql';
import { MysqlAdapter } from '../mysql.adapter';

/**
 * Provides a connection to a MySQL server.
 * See https://github.com/mysqljs/mysql#pool-options for config option.
 */
export function provideMysqlConnection(config: PoolConfig & { url?: string }): void {
  ConnectionPool.registerAdapter(MysqlAdapter);
  Base.connectionPool.connect({ adapter: 'mysql', ...config });
}
