## Basic Select
Select all rows with all columns - result type is automatically inferred from table definition:
```ts
const result = await db.select().from(users);
// {id: number; name: string; age: number | null}[]
```
Drizzle explicitly lists columns instead of using `select *` to guarantee field order.

## Partial Select
Select specific columns or use arbitrary expressions:
```ts
const result = await db.select({
  field1: users.id,
  field2: users.name,
}).from(users);

const result = await db.select({
  id: users.id,
  lowerName: sql<string>`lower(${users.name})`,
}).from(users);
```
When using `sql<Type>`, you specify the expected type - Drizzle cannot perform runtime type casts. Use `.mapWith()` for runtime transformations.

## Conditional Select
Build dynamic selection objects:
```ts
async function selectUsers(withName: boolean) {
  return db.select({
    id: users.id,
    ...(withName ? { name: users.name } : {}),
  }).from(users);
}
```

## Distinct Select
```ts
await db.selectDistinct().from(users).orderBy(users.id, users.name);
await db.selectDistinct({ id: users.id }).from(users).orderBy(users.id);
```
PostgreSQL supports `distinct on` clause:
```ts
await db.selectDistinctOn([users.id]).from(users).orderBy(users.id);
await db.selectDistinctOn([users.name], { name: users.name }).from(users).orderBy(users.name);
```

## Advanced Select
Use `getTableColumns()` to include/exclude columns:
```ts
import { getTableColumns, sql } from 'drizzle-orm';

await db.select({
  ...getTableColumns(posts),
  titleLength: sql<number>`length(${posts.title})`,
}).from(posts);

const { content, ...rest } = getTableColumns(posts);
await db.select({ ...rest }).from(posts);
```
Or use relational query API:
```ts
await db.query.posts.findMany({ columns: { title: true } });
await db.query.posts.findMany({ columns: { content: false } });
```

## Filters
Use filter operators in `.where()`:
```ts
import { eq, lt, gte, ne } from 'drizzle-orm';

await db.select().from(users).where(eq(users.id, 42));
await db.select().from(users).where(lt(users.id, 42));
await db.select().from(users).where(gte(users.id, 42));
await db.select().from(users).where(ne(users.id, 42));
```
All operators use the `sql` function internally. Write custom filters:
```ts
import { sql } from 'drizzle-orm';

function equals42(col: Column) {
  return sql`${col} = 42`;
}

await db.select().from(users).where(sql`${users.id} < 42`);
await db.select().from(users).where(equals42(users.id));
await db.select().from(users).where(sql`lower(${users.name}) = 'aaron'`);
```
All values are parameterized automatically: `eq(users.id, 42)` becomes `where "id" = $1; -- params: [42]`

Invert conditions with `not`:
```ts
import { eq, not } from 'drizzle-orm';

await db.select().from(users).where(not(eq(users.id, 42)));
```

## Combining Filters
Use `and()` and `or()`:
```ts
import { eq, and, or } from 'drizzle-orm';

await db.select().from(users).where(
  and(eq(users.id, 42), eq(users.name, 'Dan'))
);

await db.select().from(users).where(
  or(eq(users.id, 42), eq(users.name, 'Dan'))
);
```

## Advanced Filters
Conditional filtering:
```ts
const searchPosts = async (term?: string) => {
  await db.select().from(posts)
    .where(term ? ilike(posts.title, term) : undefined);
};

const searchPosts = async (filters: SQL[]) => {
  await db.select().from(posts).where(and(...filters));
};
const filters: SQL[] = [];
filters.push(ilike(posts.title, 'AI'));
filters.push(inArray(posts.category, ['Tech', 'Art', 'Science']));
filters.push(gt(posts.views, 200));
await searchPosts(filters);
```

## Limit & Offset
```ts
await db.select().from(users).limit(10);
await db.select().from(users).limit(10).offset(10);
```

## Order By
```ts
import { asc, desc } from 'drizzle-orm';

await db.select().from(users).orderBy(users.name);
await db.select().from(users).orderBy(desc(users.name));
await db.select().from(users).orderBy(users.name, users.name2);
await db.select().from(users).orderBy(asc(users.name), desc(users.name2));
```

## Advanced Pagination
Limit-offset pagination:
```ts
await db.select().from(users)
  .orderBy(asc(users.id))
  .limit(4)
  .offset(4);

const getUsers = async (page = 1, pageSize = 3) => {
  await db.query.users.findMany({
    orderBy: (users, { asc }) => asc(users.id),
    limit: pageSize,
    offset: (page - 1) * pageSize,
  });
};
```
Cursor-based pagination:
```ts
const nextUserPage = async (cursor?: number, pageSize = 3) => {
  await db.select().from(users)
    .where(cursor ? gt(users.id, cursor) : undefined)
    .limit(pageSize)
    .orderBy(asc(users.id));
};
await nextUserPage(3);
```

## WITH Clause (CTEs)
Common table expressions simplify complex queries:
```ts
const sq = db.$with('sq').as(
  db.select().from(users).where(eq(users.id, 42))
);
const result = await db.with(sq).select().from(sq);
```
Use insert/update/delete in WITH:
```ts
const sq = db.$with('sq').as(
  db.insert(users).values({ name: 'John' }).returning()
);
const result = await db.with(sq).select().from(sq);

const sq = db.$with('sq').as(
  db.update(users).set({ age: 25 }).where(eq(users.name, 'John')).returning()
);
const result = await db.with(sq).select().from(sq);

const sq = db.$with('sq').as(
  db.delete(users).where(eq(users.name, 'John')).returning()
);
const result = await db.with(sq).select().from(sq);
```
Add aliases to arbitrary SQL values in CTEs:
```ts
const sq = db.$with('sq').as(
  db.select({ 
    name: sql<string>`upper(${users.name})`.as('name'),
  }).from(users)
);
const result = await db.with(sq).select({ name: sq.name }).from(sq);
```
Without an alias, the field becomes `DrizzleTypeError` and cannot be referenced.

## Select from Subquery
```ts
const sq = db.select().from(users).where(eq(users.id, 42)).as('sq');
const result = await db.select().from(sq);

const sq = db.select().from(users).where(eq(users.id, 42)).as('sq');
const result = await db.select().from(users).leftJoin(sq, eq(users.id, sq.id));
```

## Aggregations
Use aggregation functions with `.groupBy()` and `.having()`:
```ts
import { gt } from 'drizzle-orm';

await db.select({
  age: users.age,
  count: sql<number>`cast(count(${users.id}) as int)`,
}).from(users).groupBy(users.age);

await db.select({
  age: users.age,
  count: sql<number>`cast(count(${users.id}) as int)`,
}).from(users).groupBy(users.age)
  .having(({ count }) => gt(count, 1));
```
Note: `cast(... as int)` is necessary because `count()` returns `bigint` in PostgreSQL and `decimal` in MySQL. Alternatively use `.mapWith(Number)`.

## Aggregation Helpers
Wrapped `sql` functions for common aggregations. Remember to use `.groupBy()` when selecting aggregating functions with other columns.

**count** - Returns number of values:
```ts
import { count } from 'drizzle-orm'

await db.select({ value: count() }).from(users);
await db.select({ value: count(users.id) }).from(users);
// Equivalent to: sql`count('*')`.mapWith(Number) and sql`count(${users.id})`.mapWith(Number)
```

**countDistinct** - Returns number of non-duplicate values:
```ts
import { countDistinct } from 'drizzle-orm'

await db.select({ value: countDistinct(users.id) }).from(users);
// Equivalent to: sql`count(distinct ${users.id})`.mapWith(Number)
```

**avg** - Returns average of non-null values:
```ts
import { avg } from 'drizzle-orm'

await db.select({ value: avg(users.id) }).from(users);
// Equivalent to: sql`avg(${users.id})`.mapWith(String)
```

**avgDistinct** - Returns average of non-null distinct values:
```ts
import { avgDistinct } from 'drizzle-orm'

await db.select({ value: avgDistinct(users.id) }).from(users);
// Equivalent to: sql`avg(distinct ${users.id})`.mapWith(String)
```

**sum** - Returns sum of non-null values:
```ts
import { sum } from 'drizzle-orm'

await db.select({ value: sum(users.id) }).from(users);
// Equivalent to: sql`sum(${users.id})`.mapWith(String)
```

**sumDistinct** - Returns sum of non-null distinct values:
```ts
import { sumDistinct } from 'drizzle-orm'

await db.select({ value: sumDistinct(users.id) }).from(users);
// Equivalent to: sql`sum(distinct ${users.id})`.mapWith(String)
```

**max** - Returns maximum value:
```ts
import { max } from 'drizzle-orm'

await db.select({ value: max(users.id) }).from(users);
// Equivalent to: sql`max(${users.id})`.mapWith(users.id)
```

**min** - Returns minimum value:
```ts
import { min } from 'drizzle-orm'

await db.select({ value: min(users.id) }).from(users);
// Equivalent to: sql`min(${users.id})`.mapWith(users.id)
```

Advanced aggregation example:
```ts
const orders = sqliteTable('order', {
  id: integer('id').primaryKey(),
  orderDate: integer('order_date', { mode: 'timestamp' }).notNull(),
  requiredDate: integer('required_date', { mode: 'timestamp' }).notNull(),
  shippedDate: integer('shipped_date', { mode: 'timestamp' }),
  shipVia: integer('ship_via').notNull(),
  freight: numeric('freight').notNull(),
  shipName: text('ship_name').notNull(),
  shipCity: text('ship_city').notNull(),
  shipRegion: text('ship_region'),
  shipPostalCode: text('ship_postal_code'),
  shipCountry: text('ship_country').notNull(),
  customerId: text('customer_id').notNull(),
  employeeId: integer('employee_id').notNull(),
});

const details = sqliteTable('order_detail', {
  unitPrice: numeric('unit_price').notNull(),
  quantity: integer('quantity').notNull(),
  discount: numeric('discount').notNull(),
  orderId: integer('order_id').notNull(),
  productId: integer('product_id').notNull(),
});

db.select({
  id: orders.id,
  shippedDate: orders.shippedDate,
  shipName: orders.shipName,
  shipCity: orders.shipCity,
  shipCountry: orders.shipCountry,
  productsCount: sql<number>`cast(count(${details.productId}) as int)`,
  quantitySum: sql<number>`sum(${details.quantity})`,
  totalPrice: sql<number>`sum(${details.quantity} * ${details.unitPrice})`,
})
  .from(orders)
  .leftJoin(details, eq(orders.id, details.orderId))
  .groupBy(orders.id)
  .orderBy(asc(orders.id))
  .all();
```

## $count
See dedicated documentation for count API.

## Iterator
MySQL only. Convert large result sets to async iterators to avoid loading all rows into memory:
```ts
const iterator = await db.select().from(users).iterator();

for await (const row of iterator) {
  console.log(row);
}
```
Works with prepared statements:
```ts
const query = await db.select().from(users).prepare();
const iterator = await query.iterator();

for await (const row of iterator) {
  console.log(row);
}
```

## Use Index (MySQL only)
Suggest indexes to the optimizer:
```ts
export const users = mysqlTable('users', {
  id: int('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
}, () => [usersTableNameIndex]);

const usersTableNameIndex = index('users_name_index').on(users.name);

await db.select()
  .from(users, { useIndex: usersTableNameIndex })
  .where(eq(users.name, 'David'));

await db.select()
  .from(users)
  .leftJoin(posts, eq(posts.userId, users.id), { useIndex: usersTableNameIndex })
  .where(eq(users.name, 'David'));
```

## Ignore Index (MySQL only)
Tell optimizer to avoid specific indexes:
```ts
await db.select()
  .from(users, { ignoreIndex: usersTableNameIndex })
  .where(eq(users.name, 'David'));

await db.select()
  .from(users)
  .leftJoin(posts, eq(posts.userId, users.id), { ignoreIndex: usersTableNameIndex })
  .where(eq(users.name, 'David'));
```

## Force Index (MySQL only)
Force optimizer to use specific indexes:
```ts
await db.select()
  .from(users, { forceIndex: usersTableNameIndex })
  .where(eq(users.name, 'David'));

await db.select()
  .from(users)
  .leftJoin(posts, eq(posts.userId, users.id), { forceIndex: usersTableNameIndex })
  .where(eq(users.name, 'David'));
```