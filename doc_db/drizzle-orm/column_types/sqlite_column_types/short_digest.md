## SQLite Column Types

**Native types**: integer, real, text, blob (plus numeric).

**Integer modes**: 'number', 'boolean', 'timestamp_ms', 'timestamp'. With autoincrement: `integer({ mode: 'number' }).primaryKey({ autoIncrement: true })`

**Text**: Supports `enum` for type inference and `{ mode: 'json' }` with `.$type<T>()`

**Blob modes**: 'buffer', 'bigint', 'json'. Use `text({ mode: 'json' })` instead for JSON function support.

**Boolean**: `integer({ mode: 'boolean' })` stores as 0/1

**Bigint**: `blob({ mode: 'bigint' })` for BigInt instances

**Customization**: `.$type<T>()` for branded/unknown types

**Constraints**: `.notNull()`

**Defaults**: 
- Static: `.default(value)` or `.default(sql\`...\`)`
- Keywords: `CURRENT_TIME`, `CURRENT_DATE`, `CURRENT_TIMESTAMP`
- Runtime: `.$defaultFn(() => ...)` (insert & update)
- Update-only: `.$onUpdateFn(() => ...)` (update, or insert if no default)