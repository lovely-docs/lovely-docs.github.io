## Column Types Reference

Complete reference for defining columns across all supported databases (MySQL, PostgreSQL, SingleStore, SQLite).

### MySQL Column Types
- **Numeric**: `int()`, `tinyint()`, `smallint()`, `mediumint()`, `bigint({ mode: 'number' | 'bigint', unsigned: true })`, `real()`, `decimal()`, `double()`, `float()`, `serial()`
- **Binary**: `binary()`, `varbinary({ length: 2 })`
- **String**: `char()`, `varchar({ length: 2, enum: ["v1", "v2"] })`, `text({ enum: [...] })`
- **Boolean/DateTime**: `boolean()`, `date()`, `datetime({ mode: 'date' | 'string', fsp: 0..6 })`, `time({ fsp: 0..6 })`, `year()`, `timestamp({ mode: 'date' | 'string', fsp: 0..6 })`
- **JSON/Enum**: `json().$type<T>()`, `mysqlEnum(['val1', 'val2'])`

### PostgreSQL Column Types
- **Integer**: `integer()`, `smallint()`, `bigint({ mode: 'number' | 'bigint' })`
- **Auto-increment**: `serial()`, `smallserial()`, `bigserial({ mode: 'number' })`
- **Text**: `text({ enum: [...] })`, `varchar({ length: 256, enum: [...] })`, `char({ length: 256, enum: [...] })`
- **Numeric**: `numeric({ precision: 100, scale: 20, mode: 'number' | 'bigint' })`, `real()`, `doublePrecision()`
- **JSON**: `json().$type<T>()`, `jsonb().$type<T>()`
- **DateTime**: `time({ withTimezone: true, precision: 6 })`, `timestamp({ precision: 6, withTimezone: true, mode: 'date' | 'string' }).defaultNow()`, `date({ mode: 'date' | 'string' })`, `interval({ fields: 'day', precision: 6 })`
- **Geometric**: `point({ mode: 'tuple' | 'xy' })`, `line({ mode: 'tuple' | 'abc' })`
- **Enum**: `pgEnum('mood', ['sad', 'ok', 'happy'])`
- **Identity**: `integer().primaryKey().generatedAlwaysAsIdentity({ startWith: 1000 })` or `.generatedByDefaultAsIdentity()`

### SingleStore Column Types
- **Numeric**: `int()`, `tinyint()`, `smallint()`, `mediumint()`, `bigint({ mode: 'number', unsigned: true })`, `real({ precision: 1, scale: 1 })`, `decimal({ precision: 1, scale: 1, mode: 'number' | 'bigint' })`, `double({ precision: 1, scale: 1 })`, `float()`, `serial()`
- **Binary**: `binary()`, `varbinary({ length: 2 })`
- **String**: `char()`, `varchar({ length: 2, enum: [...] })`, `text({ enum: [...] })`
- **Boolean/DateTime**: `boolean()`, `date()`, `datetime({ mode: 'date' | 'string' })`, `time()`, `year()`, `timestamp({ mode: 'date' | 'string' }).defaultNow()`
- **JSON/Enum**: `json().$type<T>()`, `singlestoreEnum(['val1', 'val2'])`

### SQLite Column Types
- **Integer**: `integer({ mode: 'number' | 'boolean' | 'timestamp_ms' | 'timestamp' }).primaryKey({ autoIncrement: true })`
- **Real**: `real()`
- **Text**: `text()`, `text({ enum: [...] })`, `text({ mode: 'json' }).$type<T>()`
- **Blob**: `blob()`, `blob({ mode: 'buffer' | 'bigint' | 'json' }).$type<T>()`
- **Numeric**: `numeric({ mode: 'number' | 'bigint' })`

### Column Modifiers (All Databases)

**Type customization**:
```typescript
type UserId = number & { __brand: 'user_id' };
int().$type<UserId>()  // branded types
json().$type<{ foo: string }>()  // type inference
```

**Constraints**:
- `.notNull()` - NOT NULL constraint
- `.primaryKey()` - PRIMARY KEY constraint (SQLite: `.primaryKey({ autoIncrement: true })`)
- `.autoincrement()` - AUTO_INCREMENT (MySQL/SingleStore)

**Defaults**:
- `.default(value)` - static default value
- `.default(sql`expression`)` - SQL expression default
- `.defaultNow()` - current timestamp (PostgreSQL/MySQL/SingleStore)
- `.$defaultFn(() => createId())` - runtime default function (insert only, doesn't affect drizzle-kit)
- `.$onUpdate(() => value)` / `.$onUpdateFn()` - runtime update function (called on update, or insert if no default)

**Example**:
```typescript
const table = pgTable('users', {
  id: serial().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).unique(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().$onUpdate(() => new Date()),
  data: json().$type<{ foo: string }>(),
  status: text({ enum: ['active', 'inactive'] })
});
```

**Notes**:
- Column names generated from TypeScript keys; use database aliases or `casing` parameter for custom mapping
- Enum in `varchar`/`text` provides type inference only, no runtime validation
- PostgreSQL `timestamp with timezone` stored in UTC, converted based on instance timezone
- SQLite has no native boolean/bigint; use `integer({ mode: 'boolean' })` or `blob({ mode: 'bigint' })`
- Use `text({ mode: 'json' })` instead of `blob({ mode: 'json' })` for JSON function support in SQLite