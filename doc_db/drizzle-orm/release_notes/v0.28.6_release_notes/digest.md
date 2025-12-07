## Changes
MySQL `datetime` with `mode: 'date'` now stores and retrieves dates in UTC strings. Use `mode: 'string'` or custom types for different behavior.

## New Features

**LibSQL batch API support**
Execute multiple queries in a single batch call:
```ts
const batchResponse = await db.batch([
  db.insert(usersTable).values({ id: 1, name: 'John' }).returning({ id: usersTable.id }),
  db.update(usersTable).set({ name: 'Dan' }).where(eq(usersTable.id, 1)),
  db.query.usersTable.findMany({}),
  db.select().from(usersTable).where(eq(usersTable.id, 1)),
]);
// Returns: [{ id: number }[], ResultSet, User[], User[]]
```
Supported builders: `db.all()`, `db.get()`, `db.values()`, `db.run()`, `db.query.<table>.findMany()`, `db.query.<table>.findFirst()`, `db.select()...`, `db.update()...`, `db.delete()...`, `db.insert()...`

**JSON mode for SQLite text columns**
```ts
const test = sqliteTable('test', {
  dataTyped: text('data_typed', { mode: 'json' }).$type<{ a: 1 }>().notNull(),
});
```

**`.toSQL()` on Relational Query API**
```ts
const query = db.query.usersTable.findFirst().toSQL();
```

**PostgreSQL array operators**
```ts
const contains = await db.select({ id: posts.id }).from(posts)
  .where(arrayContains(posts.tags, ['Typescript', 'ORM']));
const contained = await db.select({ id: posts.id }).from(posts)
  .where(arrayContained(posts.tags, ['Typescript', 'ORM']));
const overlaps = await db.select({ id: posts.id }).from(posts)
  .where(arrayOverlaps(posts.tags, ['Typescript', 'ORM']));
const withSubQuery = await db.select({ id: posts.id }).from(posts)
  .where(arrayContains(posts.tags, db.select({ tags: posts.tags }).from(posts).where(eq(posts.id, 1))));
```

**More SQL operators in Relational Query where filters**
```ts
// Before: import { inArray } from "drizzle-orm/pg-core"; await db.users.findFirst({ where: (table, _) => inArray(table.id, [...]) })
// After: await db.users.findFirst({ where: (table, { inArray }) => inArray(table.id, [...]) })
```

## Fixes
- Correct where in on conflict in SQLite
- Fix libsql/client type import
- Fix raw SQL query mapping on RDS
- Fix datetime mapping for MySQL
- Fix smallserial generating as serial