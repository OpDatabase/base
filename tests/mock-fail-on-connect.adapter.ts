import { MockAdapter, MockAdapterException, MockDatabaseClient } from './mock.adapter';

export class MockFailOnConnectAdapter extends MockAdapter {
  /**
   * Returns the MockFailOnConnectAdapter's identifier.
   */
  public getIdentifier(): string {
    return 'mock-fail-on-connect';
  }

  /**
   * Returns a new mock database client.
   */
  public async getConnection(): Promise<MockDatabaseClient> {
    throw new MockAdapterException();
  }
}
