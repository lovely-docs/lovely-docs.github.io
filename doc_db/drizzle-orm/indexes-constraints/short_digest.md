## Constraints

- **DEFAULT**: `.default(value)` or `.defaultRandom()`
- **NOT NULL**: `.notNull()`
- **UNIQUE**: `.unique()` or `.unique('name')`, supports composite and NULLS NOT DISTINCT
- **CHECK**: `check('name', sql`condition`)` in table constraints
- **PRIMARY KEY**: `.primaryKey()` or composite via `primaryKey({ columns: [...] })`
- **FOREIGN KEY**: `.references(() => table.id)` inline or `foreignKey({ columns, foreignColumns })` standalone

## Indexes

```typescript
index('name').on(table.column)
uniqueIndex('name').on(table.column)

// PostgreSQL: .on(...).concurrently().where(sql``).with({...})
// MySQL: .algorythm().using().lock()
// SQLite: .where(sql``)
```