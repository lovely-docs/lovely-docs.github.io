## Declaring Views

Views can be declared in three ways:
1. **Inline query builder** - passed directly to `.as()`
2. **Standalone query builder** - created separately and passed to `.as()`
3. **Raw SQL** - using `sql` operator with explicit column schema

### Basic Declaration (Inline Query Builder)

PostgreSQL:
```ts
import { pgTable, pgView, serial, text, timestamp } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: serial(),
  name: text(),
  email: text(),
  password: text(),
  role: text().$type<"admin" | "customer">(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const userView = pgView("user_view").as((qb) => qb.select().from(user));
export const customersView = pgView("customers_view").as((qb) => 
  qb.select().from(user).where(eq(user.role, "customer"))
);
```

MySQL and SQLite use `mysqlView` and `sqliteView` respectively with identical syntax.

### Selecting Specific Columns

```ts
export const customersView = pgView("customers_view").as((qb) => {
  return qb
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
    })
    .from(user);
});
```

### Standalone Query Builder

```ts
import { pgTable, pgView, serial, text, timestamp, QueryBuilder } from "drizzle-orm/pg-core";

const qb = new QueryBuilder();

export const userView = pgView("user_view").as(qb.select().from(user));
export const customersView = pgView("customers_view").as(
  qb.select().from(user).where(eq(user.role, "customer"))
);
```

### Raw SQL Declaration

When query builder syntax is insufficient, use `sql` operator with explicit column schema:

```ts
const newYorkers = pgView('new_yorkers', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  cityId: integer('city_id').notNull(),
}).as(sql`select * from ${users} where ${eq(users.cityId, 1)}`);
```

## Existing Views

For read-only access to existing database views, use `.existing()` to prevent migration generation:

```ts
export const trimmedUser = pgView("trimmed_user", {
  id: serial("id"),
  name: text("name"),
  email: text("email"),
}).existing();
```

## Materialized Views (PostgreSQL Only)

PostgreSQL supports materialized views that persist results in table-like form.

```ts
const newYorkers = pgMaterializedView('new_yorkers').as((qb) => 
  qb.select().from(users).where(eq(users.cityId, 1))
);
```

Refresh at runtime:
```ts
await db.refreshMaterializedView(newYorkers);
await db.refreshMaterializedView(newYorkers).concurrently();
await db.refreshMaterializedView(newYorkers).withNoData();
```

## Extended Configuration

Views support additional options via `.with()`, `.using()`, `.tablespace()`, and `.withNoData()`:

```ts
const newYorkers = pgView('new_yorkers')
  .with({
    checkOption: 'cascaded',
    securityBarrier: true,
    securityInvoker: true,
  })
  .as((qb) => {
    const sq = qb
      .$with('sq')
      .as(
        qb.select({ userId: users.id, cityId: cities.id })
          .from(users)
          .leftJoin(cities, eq(cities.id, users.homeCity))
          .where(sql`${users.age1} > 18`),
      );
    return qb.with(sq).select().from(sq).where(sql`${users.homeCity} = 1`);
  });

const newYorkers2 = pgMaterializedView('new_yorkers')
  .using('btree')
  .with({
    fillfactor: 90,
    toast_tuple_target: 0.5,
    autovacuum_enabled: true,
  })
  .tablespace('custom_tablespace')
  .withNoData()
  .as((qb) => { /* ... */ });
```

**Supported databases**: PostgreSQL, SQLite, MySQL (not SingleStore)