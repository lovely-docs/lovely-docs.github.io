## Fixes

- **withReplica**: Fixed argument forwarding when using the withReplica feature
- **selectDistinctOn**: Fixed issue where selectDistinctOn was not working with multiple columns

## New Features

### Detailed JSDoc for Query Builders
JSDoc documentation is now available for all query builders across all dialects, providing hints and documentation links directly in IDEs.

### Aggregate Function Helpers
New SQL helper functions for aggregation operations (typically used with GROUP BY):

```ts
// count
await db.select({ value: count() }).from(users);
await db.select({ value: count(users.id) }).from(users);

// countDistinct
await db.select({ value: countDistinct(users.id) }).from(users);

// avg / avgDistinct
await db.select({ value: avg(users.id) }).from(users);
await db.select({ value: avgDistinct(users.id) }).from(users);

// sum / sumDistinct
await db.select({ value: sum(users.id) }).from(users);
await db.select({ value: sumDistinct(users.id) }).from(users);

// max / min
await db.select({ value: max(users.id) }).from(users);
await db.select({ value: min(users.id) }).from(users);
```

These are equivalent to using `sql` template with `.mapWith()` for type mapping.

### ESLint Drizzle Plugin
New package `eslint-plugin-drizzle` for enforcing best practices where type checking is insufficient.

**Installation**:
```
npm install eslint eslint-plugin-drizzle
npm install @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

**Configuration** (`.eslintrc.yml`):
```yaml
root: true
parser: '@typescript-eslint/parser'
parserOptions:
  project: './tsconfig.json'
plugins:
  - drizzle
rules:
  'drizzle/enforce-delete-with-where': "error"
  'drizzle/enforce-update-with-where': "error"
```

Or use the `all`/`recommended` config:
```yaml
extends:
  - "plugin:drizzle/all"
```

**Rules**:

1. **enforce-delete-with-where**: Requires `.where()` clause in `.delete()` statements to prevent accidental deletion of all rows. Optionally configure `drizzleObjectName` to target specific objects:
```json
"drizzle/enforce-delete-with-where": ["error", { "drizzleObjectName": ["db"] }]
```

2. **enforce-update-with-where**: Requires `.where()` clause in `.update()` statements to prevent accidental updates of all rows. Same `drizzleObjectName` option available.