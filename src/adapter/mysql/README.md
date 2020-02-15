# @opdb/mysql

This is an adapter for `@opdb/base` for connecting to MySQL servers.

Run this to register and setup your MySQL connection:

```typescript
import { Base } from '@opdb/base';
import { provideMysqlConnection } from '@opdb/mysql';

provideMysqlConnection({
  // your MySQL config here
  // You can supply your connection url using field `url`.
  // Config options: https://github.com/mysqljs/mysql#connection-options
});

// Will be executed using your MySQL connection, see @opdb/base for more details
Base.execute('SELECT * FROM users');
```

## More Information

- [@opdb/base](https://www.npmjs.com/package/@opdb/base)
- [MySQL connection options](https://github.com/mysqljs/mysql#connection-options)
