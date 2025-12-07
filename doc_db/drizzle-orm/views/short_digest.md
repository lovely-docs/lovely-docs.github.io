## Declaring Views

Three methods: inline query builder, standalone query builder, or raw SQL with explicit schema.

```ts
// Inline
export const userView = pgView("user_view").as((qb) => qb.select().from(user));
export const customersView = pgView("customers_view").as((qb) => 
  qb.select().from(user).where(eq(user.role, "customer"))
);

// Standalone
const qb = new QueryBuilder();
export const userView = pgView("user_view").as(qb.select().from(user));

// Raw SQL with explicit schema
const newYorkers = pgView('new_yorkers', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  cityId: integer('city_id').notNull(),
}).as(sql`select * from ${users} where ${eq(users.cityId, 1)}`);
```

## Existing Views

Use `.existing()` to mark read-only views that already exist in the database:

```ts
export const trimmedUser = pgView("trimmed_user", {
  id: serial("id"),
  name: text("name"),
  email: text("email"),
}).existing();
```

## Materialized Views (PostgreSQL Only)

```ts
const newYorkers = pgMaterializedView('new_yorkers').as((qb) => 
  qb.select().from(users).where(eq(users.cityId, 1))
);

// Refresh at runtime
await db.refreshMaterializedView(newYorkers);
await db.refreshMaterializedView(newYorkers).concurrently();
await db.refreshMaterializedView(newYorkers).withNoData();
```

## Extended Configuration

```ts
pgView('name')
  .with({ checkOption: 'cascaded', securityBarrier: true })
  .as((qb) => { /* query */ });

pgMaterializedView('name')
  .using('btree')
  .with({ fillfactor: 90 })
  .tablespace('custom_tablespace')
  .withNoData()
  .as((qb) => { /* query */ });
```