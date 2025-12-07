## Basic insert
```typescript
await db.insert(users).values({ name: 'Andrew' });
await db.insert(users).values([{ name: 'Andrew' }, { name: 'Dan' }]);
type NewUser = typeof users.$inferInsert;
```

## Returning
PostgreSQL/SQLite: `.returning()` or `.returning({ insertedId: users.id })`
MySQL/SingleStore: `.$returningId()` for autoincrement/custom primary keys

## Conflict handling
PostgreSQL/SQLite: `.onConflictDoNothing()`, `.onConflictDoNothing({ target: users.id })`, `.onConflictDoUpdate({ target: users.id, set: { name: 'John' } })`
- With `targetWhere` (partial indexes) and `setWhere` (update conditions)
- Composite targets: `target: [users.firstName, users.lastName]`

MySQL/SingleStore: `.onDuplicateKeyUpdate({ set: { name: 'John' } })`

## WITH clause
```typescript
const userCount = db.$with('user_count').as(db.select(...).from(users));
await db.with(userCount).insert(users).values([...]).returning(...);
```

## Insert from SELECT
```typescript
await db.insert(employees).select(
  db.select({ name: users.name }).from(users).where(eq(users.role, 'employee'))
);
// or with callback: .select(() => db.select(...))
// or with SQL: .select(sql`select ...`)
```