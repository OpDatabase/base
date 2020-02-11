import { DatabaseAdapter, Logger } from '@opdb/base';
import * as mysql from 'mysql';
import { Pool, PoolConfig } from 'mysql';
import { MysqlAdapterException } from './exceptions/mysql-adapter.exception';
import { MysqlClient } from './mysql.client';

export class MysqlAdapter implements DatabaseAdapter {
  private nativePool: Pool | null = null;

  public getIdentifier(): string {
    return 'mysql';
  }

  public loadConfig(config: PoolConfig & { url?: string }): void {
    if (this.nativePool != null) {
      throw new MysqlAdapterException('Configuration for MysqlAdapter has already been loaded.');
    }

    // If url is given, use url instead
    this.nativePool = mysql.createPool(config.url != null ? config.url : config);
  }

  public async getConnection(): Promise<MysqlClient> {
    if (this.nativePool == null) {
      throw new MysqlAdapterException('Configuration for MysqlAdapter has not been loaded yet. Please specify configuration of MysqlAdapter before executing the first query.');
    }

    return await new Promise((resolve, reject) => {
      this.nativePool!.getConnection(((err, connection) => {
        if (err) {
          Logger.error(err);

          return reject(new MysqlAdapterException('Cannot establish connection to database. Please ensure that your credentials are supplied correctly'));
        }

        resolve(new MysqlClient(connection));
      }));
    });
  }

  public async stop(): Promise<void> {
    return await new Promise(((resolve, reject) => {
      if (this.nativePool == null) {
        return resolve();
      }

      this.nativePool.end(err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    }));
  }
}
