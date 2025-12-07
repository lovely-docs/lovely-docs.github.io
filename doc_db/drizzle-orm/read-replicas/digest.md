## Read Replicas

The `withReplicas()` function enables automatic routing of SELECT queries to read replica instances while directing CREATE, UPDATE, and DELETE operations to the primary database instance.

### Setup

Create separate database connections for primary and replicas, then combine them:

```ts
// PostgreSQL
import { drizzle } from 'drizzle-orm/node-postgres';
import { pgTable, serial, text, boolean, timestamp, jsonb, withReplicas } from 'drizzle-orm/pg-core';

const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  verified: boolean('verified').notNull().default(false),
  jsonb: jsonb('jsonb').$type<string[]>(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

const primaryDb = drizzle("postgres://user:password@host:port/primary_db");
const read1 = drizzle("postgres://user:password@host:port/read_replica_1");
const read2 = drizzle("postgres://user:password@host:port/read_replica_2");

const db = withReplicas(primaryDb, [read1, read2]);
```

MySQL/SingleStore setup is similar, using `mysql2/promise` connections and `mysqlTable` or `singlestoreTable`. SQLite uses `libsql` client with `sqliteTable`.

### Usage

Drizzle automatically routes queries:

```ts
// SELECT queries automatically use a replica
await db.select().from(usersTable);

// Write operations use primary
await db.delete(usersTable).where(eq(usersTable.id, 1));

// Force primary for reads
await db.$primary.select().from(usersTable);
```

### Custom Replica Selection

Pass a function as the third argument to implement custom selection logic (e.g., weighted random selection):

```ts
const db = withReplicas(primaryDb, [read1, read2], (replicas) => {
  const weight = [0.7, 0.3];
  let cumulativeProbability = 0;
  const rand = Math.random();

  for (const [i, replica] of replicas.entries()) {
    cumulativeProbability += weight[i]!;
    if (rand < cumulativeProbability) return replica;
  }
  return replicas[0]!;
});

await db.select().from(usersTable);
```

Any random selection method can be implemented in the custom function.