## SQLite Column Types

SQLite has 5 native storage classes: NULL, INTEGER, REAL, TEXT, BLOB. Drizzle supports all of them with additional modes and customization options.

### Integer
Signed integer stored in 0-8 bytes depending on magnitude.
```typescript
import { integer, sqliteTable } from "drizzle-orm/sqlite-core";

const table = sqliteTable('table', {
  id: integer(),
  // modes: 'number' (default), 'boolean', 'timestamp_ms', 'timestamp' (Date)
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true })
});
```

### Real
8-byte IEEE floating point number.
```typescript
import { real, sqliteTable } from "drizzle-orm/sqlite-core";
const table = sqliteTable('table', { real: real() });
```

### Text
UTF-8/UTF-16 encoded string. Supports enum inference and JSON mode:
```typescript
import { text, sqliteTable } from "drizzle-orm/sqlite-core";
const table = sqliteTable('table', {
  text: text(),
  enumText: text({ enum: ["value1", "value2"] }), // infers union type
  jsonText: text({ mode: 'json' }).$type<{ foo: string }>()
});
```

### Blob
Raw binary data. Supports multiple modes:
```typescript
import { blob, sqliteTable } from "drizzle-orm/sqlite-core";
const table = sqliteTable('table', {
  blob: blob(),
  buffer: blob({ mode: 'buffer' }),
  bigint: blob({ mode: 'bigint' }),
  json: blob({ mode: 'json' }).$type<{ foo: string }>()
});
```
Note: Use `text({ mode: 'json' })` instead of `blob({ mode: 'json' })` for JSON functions support.

### Boolean
SQLite has no native boolean type. Use `integer({ mode: 'boolean' })` to store as 0/1:
```typescript
const table = sqliteTable('table', {
  id: integer({ mode: 'boolean' })
});
```

### Bigint
No native bigint in SQLite. Use `blob({ mode: 'bigint' })` to work with BigInt instances:
```typescript
const table = sqliteTable('table', {
  id: blob({ mode: 'bigint' })
});
```

### Numeric
```typescript
import { numeric, sqliteTable } from "drizzle-orm/sqlite-core";
const table = sqliteTable('table', {
  numeric: numeric(),
  numericNum: numeric({ mode: 'number' }),
  numericBig: numeric({ mode: 'bigint' })
});
```

### Customizing Data Type
Use `.$type<T>()` to customize column type for branded or unknown types:
```typescript
type UserId = number & { __brand: 'user_id' };
type Data = { foo: string; bar: number };

const users = sqliteTable('users', {
  id: integer().$type<UserId>().primaryKey(),
  jsonField: blob().$type<Data>()
});
```

### Not Null
```typescript
const table = sqliteTable('table', { numInt: integer().notNull() });
```

### Default Values
Static defaults:
```typescript
import { sql } from "drizzle-orm";
import { integer, sqliteTable } from "drizzle-orm/sqlite-core";

const table = sqliteTable('table', {
  int1: integer().default(42),
  int2: integer().default(sql`(abs(42))`)
});
```

Special keywords:
```typescript
import { sql } from "drizzle-orm";
import { text, sqliteTable } from "drizzle-orm/sqlite-core";

const table = sqliteTable("table", {
  time: text().default(sql`(CURRENT_TIME)`),
  date: text().default(sql`(CURRENT_DATE)`),
  timestamp: text().default(sql`(CURRENT_TIMESTAMP)`)
});
```

Runtime defaults with `$defaultFn()` (runtime only, doesn't affect drizzle-kit):
```typescript
import { text, sqliteTable } from "drizzle-orm/sqlite-core";
import { createId } from '@paralleldrive/cuid2';

const table = sqliteTable('table', {
  id: text().$defaultFn(() => createId())
});
```

Runtime update values with `$onUpdateFn()` (called on update, or on insert if no default provided):
```typescript
const table = sqliteTable('table', {
  alwaysNull: text().$type<string | null>().$onUpdate(() => null)
});
```

Note: Column names are generated from TypeScript keys. Use database aliases or the `casing` parameter for custom mapping.