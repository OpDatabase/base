import { DatabaseAdapter, Logger } from '@opdb/base';
import { Pool, PoolConfig } from 'pg';
import { PostgresAdapterException } from './exceptions/postgres-adapter.exception';
import { PostgresClient } from './postgres.client';

export class PostgresAdapter implements DatabaseAdapter {
  private nativeConnectionPool: Pool | null = null;

  public getIdentifier(): string {
    return 'postgres';
  }

  public loadConfig(config: PoolConfig): void {
    if (this.nativeConnectionPool != null) {
      throw new PostgresAdapterException('Configuration for PostgresAdapter has already been loaded.');
    }
    this.nativeConnectionPool = new Pool(config);
  }

  public async getConnection(): Promise<PostgresClient> {
    if (this.nativeConnectionPool == null) {
      throw new PostgresAdapterException('Configuration for PostgresAdapter has not been loaded yet. Please specify configuration of PostgresAdapter before executing the first query.');
    }

    try {
      return new PostgresClient(await this.nativeConnectionPool.connect());
    } catch (e) {
      Logger.error(e);
      throw new PostgresAdapterException('Cannot establish connection to database. Please ensure that your credentials are supplied correctly');
    }
  }

  public async stop(): Promise<void> {
    if (this.nativeConnectionPool == null) {
      return;
    }

    return this.nativeConnectionPool.end();
  }
}
