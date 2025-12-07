## New Features

**Enhanced `.onConflictDoUpdate()` in SQLite**: Added `setWhere` and `targetWhere` fields to replace the single `where` field, enabling more granular control over conflict resolution:

```ts
// Using targetWhere to filter which conflicts to handle
await db.insert(employees)
  .values({ employeeId: 123, name: 'John Doe' })
  .onConflictDoUpdate({
    target: employees.employeeId,
    targetWhere: sql`name <> 'John Doe'`,
    set: { name: sql`excluded.name` }
  });

// Using setWhere to conditionally apply updates
await db.insert(employees)
  .values({ employeeId: 123, name: 'John Doe' })
  .onConflictDoUpdate({
    target: employees.employeeId,
    set: { name: 'John Doe' },
    setWhere: sql`name <> 'John Doe'`
  });
```

**Schema introspection**: Added `db._.fullSchema` to access schema information from Drizzle instances.

## Fixes

- Fixed migrator in AWS Data API