## Insert one row
```typescript
await db.insert(users).values({ name: 'Andrew' });
```
Type inference: `type NewUser = typeof users.$inferInsert;`

## Insert returning
Supported in PostgreSQL and SQLite:
```typescript
await db.insert(users).values({ name: "Dan" }).returning();
await db.insert(users).values({ name: "Partial Dan" }).returning({ insertedId: users.id });
```

## Insert $returningId
MySQL and SingleStore alternative (no native RETURNING support). Returns inserted IDs for autoincrement primary keys:
```typescript
const result = await db.insert(usersTable).values([{ name: 'John' }, { name: 'John1' }]).$returningId();
// ^? { id: number }[]
```
Also works with custom primary keys using `$defaultFn`:
```typescript
const usersTableDefFn = mysqlTable('users_default_fn', {
  customId: varchar('id', { length: 256 }).primaryKey().$defaultFn(createId),
  name: text('name').notNull(),
});
const result = await db.insert(usersTableDefFn).values([{ name: 'John' }, { name: 'John1' }]).$returningId();
// ^? { customId: string }[]
```
If no primary keys exist, type is `{}[]`.

## Insert multiple rows
```typescript
await db.insert(users).values([{ name: 'Andrew' }, { name: 'Dan' }]);
```

## On conflict do nothing
PostgreSQL and SQLite:
```typescript
await db.insert(users).values({ id: 1, name: 'John' }).onConflictDoNothing();
await db.insert(users).values({ id: 1, name: 'John' }).onConflictDoNothing({ target: users.id });
```

## On conflict do update
PostgreSQL and SQLite:
```typescript
await db.insert(users).values({ id: 1, name: 'Dan' }).onConflictDoUpdate({ target: users.id, set: { name: 'John' } });
```

With `where` clauses using `targetWhere` (partial indexes) and `setWhere` (update conditions):
```typescript
await db.insert(employees).values({ employeeId: 123, name: 'John Doe' }).onConflictDoUpdate({
  target: employees.employeeId,
  targetWhere: sql`name <> 'John Doe'`,
  set: { name: sql`excluded.name` }
});

await db.insert(employees).values({ employeeId: 123, name: 'John Doe' }).onConflictDoUpdate({
  target: employees.employeeId,
  set: { name: 'John Doe' },
  setWhere: sql`name <> 'John Doe'`
});
```

Composite indexes/primary keys:
```typescript
await db.insert(users).values({ firstName: 'John', lastName: 'Doe' }).onConflictDoUpdate({
  target: [users.firstName, users.lastName],
  set: { firstName: 'John1' }
});
```

## On duplicate key update
MySQL and SingleStore (automatically determines conflict target from primary key and unique indexes):
```typescript
await db.insert(users).values({ id: 1, name: 'John' }).onDuplicateKeyUpdate({ set: { name: 'John' } });
```

No-op on conflict by setting a column to itself:
```typescript
await db.insert(users).values({ id: 1, name: 'John' }).onDuplicateKeyUpdate({ set: { id: sql`id` } });
```

## WITH clause
```typescript
const userCount = db.$with('user_count').as(
  db.select({ value: sql`count(*)`.as('value') }).from(users)
);

const result = await db.with(userCount).insert(users).values([
  { username: 'user1', admin: sql`((select * from ${userCount}) = 0)` }
]).returning({ admin: users.admin });
```

## Insert into ... select
Three approaches:

Query builder:
```typescript
const insertedEmployees = await db.insert(employees).select(
  db.select({ name: users.name }).from(users).where(eq(users.role, 'employee'))
).returning({ id: employees.id, name: employees.name });
```

Callback:
```typescript
await db.insert(employees).select(
  () => db.select({ name: users.name }).from(users).where(eq(users.role, 'employee'))
);
```

SQL template tag:
```typescript
await db.insert(employees).select(
  sql`select "users"."name" as "name" from "users" where "users"."role" = 'employee'`
);
```

Note: For upsert clauses, SELECT must include WHERE clause (even `WHERE true`) to avoid parsing ambiguity.