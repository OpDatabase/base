# @opdb/postgres

This is an adapter for `@opdb/base` for connecting to PostgreSQL servers.

Run this to register and setup your PostgreSQL connection:

```typescript
import { Base } from '@opdb/base';
import { providePostgresConnection } from '@opdb/postgres';

providePostgresConnection({
  // your PostgreSQL config here
  // Config options: https://node-postgres.com/api/client, https://node-postgres.com/api/pool
});

// Will be executed using your PostgreSQL connection, see @opdb/base for more details
Base.execute('SELECT * FROM users');
```

## More Information

- [@opdb/base](https://www.npmjs.com/package/@opdb/base)
- [pg.Client](https://node-postgres.com/api/client)
- [pg.Pool](https://node-postgres.com/api/pool)
