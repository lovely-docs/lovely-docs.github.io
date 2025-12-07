## Fixes
- Fixed withReplica argument forwarding
- Fixed selectDistinctOn with multiple columns

## Aggregate Helpers
New SQL functions: `count()`, `countDistinct()`, `avg()`, `avgDistinct()`, `sum()`, `sumDistinct()`, `max()`, `min()`

```ts
await db.select({ value: count(users.id) }).from(users);
await db.select({ value: sum(users.id) }).from(users);
```

## ESLint Plugin
New `eslint-plugin-drizzle` package with rules:
- `enforce-delete-with-where`: Require WHERE clause in delete statements
- `enforce-update-with-where`: Require WHERE clause in update statements

Configure with optional `drizzleObjectName` to target specific objects.