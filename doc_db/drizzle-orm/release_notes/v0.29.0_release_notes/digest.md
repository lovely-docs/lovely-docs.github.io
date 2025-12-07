## MySQL unsigned bigint
```ts
const table = mysqlTable('table', {
  id: bigint('id', { mode: 'number', unsigned: true }),
});
```

## Improved query builder types
By default, query builder methods can only be invoked once (e.g., `.where()` once per query) to match SQL semantics. Use `.$dynamic()` to enable multiple invocations for dynamic query building:

```ts
function withPagination<T extends PgSelect>(qb: T, page: number, pageSize: number = 10) {
  return qb.limit(pageSize).offset(page * pageSize);
}

const query = db.select().from(users).where(eq(users.id, 1)).$dynamic();
withPagination(query, 1); // ✅ OK

function withFriends<T extends PgSelect>(qb: T) {
  return qb.leftJoin(friends, eq(friends.userId, users.id));
}
query = withFriends(query);
```

## Custom names for primary and foreign keys
```ts
const table = pgTable('table', {
  id: integer('id'),
  name: text('name'),
}, (table) => ({
  cpk: primaryKey({ name: 'composite_key', columns: [table.id, table.name] }),
  cfk: foreignKey({
    name: 'fkName',
    columns: [table.id],
    foreignColumns: [table.name],
  }),
}));
```

## Read replicas support
```ts
const primaryDb = drizzle({ client });
const read1 = drizzle({ client });
const read2 = drizzle({ client });
const db = withReplicas(primaryDb, [read1, read2]);

db.$primary.select().from(usersTable); // read from primary
db.select().from(usersTable); // read from replica
db.delete(usersTable).where(eq(usersTable.id, 1)); // write to primary
```

Custom replica selection with weighted probability:
```ts
const db = withReplicas(primaryDb, [read1, read2], (replicas) => {
  const weight = [0.7, 0.3];
  let cumulativeProbability = 0;
  const rand = Math.random();
  for (const [i, replica] of replicas.entries()) {
    cumulativeProbability += weight[i]!;
    if (rand < cumulativeProbability) return replica;
  }
  return replicas[0]!
});
```

## Set operators (UNION, UNION ALL, INTERSECT, INTERSECT ALL, EXCEPT, EXCEPT ALL)
```ts
// Import approach
import { union } from 'drizzle-orm/pg-core'
const result = await union(
  db.select().from(users),
  db.select().from(customers)
);

// Builder approach
const result = await db.select().from(users).union(db.select().from(customers));
```

## MySQL proxy driver
Implement HTTP endpoints for queries and migrations. Driver example:
```ts
import { drizzle } from 'drizzle-orm/mysql-proxy';
import { migrate } from 'drizzle-orm/mysql-proxy/migrator';

const db = drizzle(async (sql, params, method) => {
  const rows = await axios.post(`${process.env.REMOTE_DRIVER}/query`, { sql, params, method });
  return { rows: rows.data };
});

await migrate(db, async (queries) => {
  await axios.post(`${process.env.REMOTE_DRIVER}/migrate`, { queries });
}, { migrationsFolder: 'drizzle' });

await db.insert(cities).values({ id: 1, name: 'name' });
```

## PostgreSQL proxy driver
Same as MySQL proxy driver:
```ts
import { drizzle } from 'drizzle-orm/pg-proxy';
import { migrate } from 'drizzle-orm/pg-proxy/migrator';

const db = drizzle(async (sql, params, method) => {
  const rows = await axios.post(`${process.env.REMOTE_DRIVER}/query`, { sql, params, method });
  return { rows: rows.data };
});

await migrate(db, async (queries) => {
  await axios.post(`${process.env.REMOTE_DRIVER}/query`, { queries });
}, { migrationsFolder: 'drizzle' });
```

## D1 Batch API support
```ts
const batchResponse = await db.batch([
  db.insert(usersTable).values({ id: 1, name: 'John' }).returning({ id: usersTable.id }),
  db.update(usersTable).set({ name: 'Dan' }).where(eq(usersTable.id, 1)),
  db.query.usersTable.findMany({}),
  db.select().from(usersTable).where(eq(usersTable.id, 1)),
  db.select({ id: usersTable.id, invitedBy: usersTable.invitedBy }).from(usersTable),
]);

type BatchResponse = [
  { id: number }[],
  D1Result,
  { id: number; name: string; verified: number; invitedBy: number | null }[],
  { id: number; name: string; verified: number; invitedBy: number | null }[],
  { id: number; invitedBy: number | null }[],
];
```

Supported builders: `db.all()`, `db.get()`, `db.values()`, `db.run()`, `db.query.<table>.findMany()`, `db.query.<table>.findFirst()`, `db.select()...`, `db.update()...`, `db.delete()...`, `db.insert()...`

## Drizzle Kit 0.20.0
- `defineConfig` function for config definition
- Cloudflare D1 access in Drizzle Studio via wrangler.toml
- Drizzle Studio migrated to https://local.drizzle.studio/
- `bigint unsigned` support
- Custom names for `primaryKeys` and `foreignKeys`
- Automatic environment variable fetching
- Bug fixes and improvements

**Note:** v0.29.0 requires minimum Drizzle Kit v0.20.0 and vice versa.