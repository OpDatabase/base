# @opdb/base

This is an abstraction layer for database connections, connection and transaction handling.

The package contains two major things:

1. Base classes to coordinate database connections
2. Interfaces to implement database drivers

## Base Classes

### Base

Main class. Maintains a connection to a database connection pool. 

To execute an SQL query run this:

```typescript
import { Base } from '@opdb/base';

// Returns Promise<any[]>, representing any line that shall be returned.
Base.execute(`SELECT * FROM users`);

// You can supply an interface to have a type-safe response.
Base.execute<{id: string, username: string}>(`SELECT * FROM users`);

// You can use placeholders to escape your SQL query. The placeholders will be replaced correctly
// for each database adapter automatically.
// This will run the SQL query `SELECT * FROM users WHERE id = 1`
Base.execute<{id: string, username: string}>(`SELECT * FROM users WHERE id = $id`, {id: 1});
```

To start a new transaction run this:

```typescript
import { Base } from '@opdb/base';

// Method `transaction` accepts a block. Any statement within the block is run inside the transaction
// This example will run the following SQL statements:
// - BEGIN;
// - UPDATE users SET username = `marc` WHERE id = 1;
// - COMMIT;
Base.transaction(async () => {
  await Base.execute(`UPDATE users SET username = $username WHERE id = $id`, {
    id: 1,
    username: 'marc',
  });
});

// If any exception occurs during the transaction, the transaction will be rolled back.
// This example will run the following SQL statements:
// - BEGIN
// - UPDATE users SET username = `marc` WHERE id = 1;
// - ROLLBACK;
Base.transaction(async () => {
  await Base.execute(`UPDATE users SET username = $username WHERE id = $id`, {
    id: 1,
    username: 'marc',
  });
  throw new Error();
});
```

### ConnectionPool

This class manages a pool of database connections. The connections themselves are managed by the database adapters.

To register a new adapter run this:

```typescript
import { ConnectionPool, DatabaseAdapter } from '@opdb/base';

class FancyDatabaseAdapter implements DatabaseAdapter {
  // Custom Implementation here
}

ConnectionPool.registerAdapter(FancyDatabaseAdapter);
```

To connect a given database adapter run this:

```typescript
import { Base } from '@opdb/base';

Base.connectionPool.connect({
  adapter: 'fancy-adapter',
  // Adapter specific config
});
```

To get a database connection from the connection pool, use this method:

```typescript
import { Base } from '@opdb/base';

// This will return a Promise<DatabaseClient> which will handle the database connection.
Base.connectionPool.getConnection();
```

## Important Notes
@opdb/base uses [zone.js](https://github.com/angular/angular/tree/master/packages/zone.js) for handling transactions.

At the moment, zone.js is unable to use native node async/await.

Therefore, you should use TypeScript or Babel to compile your code in ES2015.
