import { Base } from '@opdb/base';
import { provideMysqlConnection } from './provide-mysql-connection.func';

describe('provideMysqlConnection', () => {
  it('should properly provide a MySQL connection to @opdb/base', async () => {
    provideMysqlConnection({
      url: process.env.TEST_MYSQL_DB_URL,
    });

    await Base.transaction(async () => {
      await Base.execute('CREATE TABLE `test_provide_connection`(`id` INTEGER, `text` VARCHAR(50))');
      await Base.execute('INSERT INTO `test_provide_connection` (`id`, `text`) VALUES ($id, $text)', { id: 1, text: 'Hello world!' });
      const response = await Base.execute('SELECT * FROM `test_provide_connection` WHERE `id` = $id', { id: 1 });
      expect(response).toEqual([{ id: 1, text: 'Hello world!' }]);
    });

    // Cleanup
    Base.connectionPool.reset();
  });
});
