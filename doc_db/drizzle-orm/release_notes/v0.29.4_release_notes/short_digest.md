## Neon HTTP Batch

Execute multiple queries in one request:
```ts
const batchResponse = await db.batch([
	db.insert(usersTable).values({ id: 1, name: 'John' }).returning({ id: usersTable.id }),
	db.insert(usersTable).values({ id: 2, name: 'Dan' }),
	db.query.usersTable.findMany({}),
	db.query.usersTable.findFirst({}),
]);
```

## PlanetScale: Use Client Instead of connect()

```ts
import { Client } from '@planetscale/database';
const client = new Client({ host, username, password });
const db = drizzle(client);
```

v0.30.0 will require `Client` instances; deprecation warning in v0.29.4.