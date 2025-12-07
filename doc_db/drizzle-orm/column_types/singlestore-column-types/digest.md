## SingleStore Column Types Reference

All SingleStore column types are natively supported. Custom types can be created if needed.

**Important**: Column names are generated from TypeScript keys unless database aliases are used. Use the `casing` parameter to define mapping strategy.

### Numeric Types

**Integer types**: `int()`, `tinyint()`, `smallint()`, `mediumint()`, `bigint()`

```typescript
import { int, bigint, singlestoreTable } from "drizzle-orm/singlestore-core";

const table = singlestoreTable('table', {
  int: int(),
  bigint: bigint({ mode: 'number' }),
  bigintUnsigned: bigint({ mode: 'number', unsigned: true })
});
```

**Floating point types**: `real()`, `decimal()`, `double()`, `float()`

```typescript
import { real, decimal, double, float, singlestoreTable } from "drizzle-orm/singlestore-core";

const table = singlestoreTable('table', {
  real: real(),
  realPrecision: real({ precision: 1 }),
  realPrecisionScale: real({ precision: 1, scale: 1 }),
  decimal: decimal(),
  decimalNum: decimal({ scale: 30, mode: 'number' }),
  decimalBig: decimal({ scale: 30, mode: 'bigint' }),
  decimalPrecision: decimal({ precision: 1 }),
  decimalPrecisionScale: decimal({ precision: 1, scale: 1 }),
  double: double(),
  doublePrecision: double({ precision: 1 }),
  doublePrecisionScale: double({ precision: 1, scale: 1 }),
  float: float()
});
```

**Serial**: `serial()` is an alias for `BIGINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE`

```typescript
import { serial, singlestoreTable } from "drizzle-orm/singlestore-core";

const table = singlestoreTable('table', {
  serial: serial()
});
```

### Binary Types

```typescript
import { binary, varbinary, singlestoreTable } from "drizzle-orm/singlestore-core";

const table = singlestoreTable('table', {
  binary: binary(),
  varbinary: varbinary({ length: 2 })
});
```

### String Types

```typescript
import { char, varchar, text, singlestoreTable } from "drizzle-orm/singlestore-core";

const table = singlestoreTable('table', {
  char: char(),
  varchar: varchar({ length: 2 }),
  varcharEnum: varchar({ length: 6, enum: ["value1", "value2"] }),
  text: text(),
  textEnum: text({ enum: ["value1", "value2"] })
});
```

`varchar` and `text` support `{ enum: [...] }` config to infer insert/select types (no runtime validation).

### Boolean & Date/Time Types

```typescript
import { boolean, date, datetime, time, year, timestamp, singlestoreTable } from "drizzle-orm/singlestore-core";

const table = singlestoreTable('table', {
  boolean: boolean(),
  date: date(),
  datetime: datetime({ mode: 'date' | 'string' }),
  time: time(),
  year: year(),
  timestamp: timestamp({ mode: 'date' | 'string' }),
  timestampDefault: timestamp().defaultNow()
});
```

### JSON Type

```typescript
import { json, singlestoreTable } from "drizzle-orm/singlestore-core";

const table = singlestoreTable('table', {
  json: json(),
  jsonTyped: json().$type<{ foo: string }>(),
  jsonArray: json().$type<string[]>()
});
```

Use `.$type<T>()` for compile-time type inference (no runtime validation). Provides protection for defaults, insert and select schemas.

### Enum Type

```typescript
import { singlestoreEnum, singlestoreTable } from "drizzle-orm/singlestore-core";

const table = singlestoreTable('table', {
  popularity: singlestoreEnum(['unknown', 'known', 'popular'])
});
```

### Column Modifiers

**Custom type inference**:
```typescript
type UserId = number & { __brand: 'user_id' };
type Data = { foo: string; bar: number };

const users = singlestoreTable('users', {
  id: int().$type<UserId>().primaryKey(),
  jsonField: json().$type<Data>()
});
```

**Not null**:
```typescript
int().notNull()
```

**Default value**:
```typescript
int().default(3)
```

**Runtime defaults** (not affecting drizzle-kit, only drizzle-orm):
```typescript
import { varchar, singlestoreTable } from "drizzle-orm/singlestore-core";
import { createId } from '@paralleldrive/cuid2';

const table = singlestoreTable('table', {
  id: varchar({ length: 128 }).$defaultFn(() => createId())
});
```

**Runtime update values**:
```typescript
import { text, singlestoreTable } from "drizzle-orm/singlestore-core";

const table = singlestoreTable('table', {
  alwaysNull: text().$type<string | null>().$onUpdate(() => null)
});
```

Called on insert (if no default) and on every update. Does not affect drizzle-kit.

**Primary key**:
```typescript
int().primaryKey()
```

**Auto increment**:
```typescript
int().autoincrement()
```