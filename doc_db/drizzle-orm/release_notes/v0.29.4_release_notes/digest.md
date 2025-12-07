## Neon HTTP Batch Support

Added support for batching multiple queries in a single request using Neon's HTTP driver:

```ts
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { usersTable } from './schema';

const sql = neon(process.env.DRIZZLE_DATABASE_URL!);
const db = drizzle(sql);

const batchResponse = await db.batch([
	db.insert(usersTable).values({ id: 1, name: 'John' }).returning({ id: usersTable.id }),
	db.insert(usersTable).values({ id: 2, name: 'Dan' }),
	db.query.usersTable.findMany({}),
	db.query.usersTable.findFirst({}),
]);
```

The batch method returns a tuple with typed results for each query in the batch.

## PlanetScale Client Instance Update

Updated PlanetScale integration to use `Client` instance instead of `connect()` function:

```ts
import { Client } from '@planetscale/database';
import { drizzle } from 'drizzle-orm/planetscale-serverless';

const client = new Client({
	host: process.env['DATABASE_HOST'],
	username: process.env['DATABASE_USERNAME'],
	password: process.env['DATABASE_PASSWORD'],
});

const db = drizzle(client);
```

**Breaking change warning**: Version 0.30.0 will require `Client` instances and reject `connect()` results. A deprecation warning is shown in v0.29.4 when using `connect()`. Migrate now to avoid runtime errors.