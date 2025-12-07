## Basic Select
```ts
const result = await db.select().from(users);
```
Result type inferred from table definition. Drizzle explicitly lists columns instead of `select *`.

## Partial Select & Expressions
```ts
const result = await db.select({
  field1: users.id,
  lowerName: sql<string>`lower(${users.name})`,
}).from(users);
```

## Distinct
```ts
await db.selectDistinct().from(users).orderBy(users.id);
// PostgreSQL only: await db.selectDistinctOn([users.id]).from(users);
```

## Advanced Select
```ts
import { getTableColumns } from 'drizzle-orm';
await db.select({ ...getTableColumns(posts), titleLength: sql<number>`length(${posts.title})` }).from(posts);
// Or: await db.query.posts.findMany({ columns: { title: true } });
```

## Filters
```ts
import { eq, lt, gte, ne, not, and, or } from 'drizzle-orm';
await db.select().from(users).where(eq(users.id, 42));
await db.select().from(users).where(and(eq(users.id, 42), eq(users.name, 'Dan')));
// Custom: await db.select().from(users).where(sql`${users.id} < 42`);
```
All values parameterized automatically.

## Limit, Offset, Order By
```ts
import { asc, desc } from 'drizzle-orm';
await db.select().from(users).limit(10).offset(10);
await db.select().from(users).orderBy(asc(users.name), desc(users.age));
```

## Pagination
```ts
// Limit-offset: .orderBy(asc(users.id)).limit(pageSize).offset((page - 1) * pageSize)
// Cursor-based: .where(cursor ? gt(users.id, cursor) : undefined).limit(pageSize).orderBy(asc(users.id))
```

## WITH Clause (CTEs)
```ts
const sq = db.$with('sq').as(db.select().from(users).where(eq(users.id, 42)));
const result = await db.with(sq).select().from(sq);
// Also supports insert/update/delete in WITH
```

## Subqueries
```ts
const sq = db.select().from(users).where(eq(users.id, 42)).as('sq');
const result = await db.select().from(sq);
// Use in joins: .leftJoin(sq, eq(users.id, sq.id))
```

## Aggregations
```ts
import { count, countDistinct, avg, sum, max, min } from 'drizzle-orm';
await db.select({ age: users.age, count: count() }).from(users).groupBy(users.age);
await db.select({ age: users.age, count: count() }).from(users).groupBy(users.age).having(({ count }) => gt(count, 1));
```

## Iterator (MySQL only)
```ts
const iterator = await db.select().from(users).iterator();
for await (const row of iterator) { console.log(row); }
```

## Index Hints (MySQL only)
```ts
// useIndex, ignoreIndex, forceIndex options on .from() and .leftJoin()
await db.select().from(users, { useIndex: indexName }).where(eq(users.name, 'David'));
```