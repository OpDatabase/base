import { Base } from '@opdb/base';
import { providePostgresConnection } from './provide-postgres-connection.func';

describe('providePostgresConnection', () => {
  it('should properly provide a postgres connection to @opdb/base', async () => {
    providePostgresConnection({
      connectionString: process.env.TEST_PG_DB_URL,
    });

    await Base.transaction(async () => {
      await Base.execute('CREATE TABLE "test_provide_connection"("id" INTEGER, "text" VARCHAR(50))');
      await Base.execute('INSERT INTO "test_provide_connection" ("id", "text") VALUES ($id, $text)', { id: 1, text: 'Hello world!' });
      const response = await Base.execute('SELECT * FROM "test_provide_connection" WHERE "id" = $id', { id: 1 });
      expect(response.rows).toEqual([{ id: 1, text: 'Hello world!' }]);
    });

    // Cleanup
    Base.connectionPool.reset();
  });
});
