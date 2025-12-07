

## Pages

### mysql-column-types
MySQL column type definitions with precision/scale options, constraints (.notNull, .primaryKey, .autoincrement), and runtime defaults ($defaultFn, $onUpdate, $type for type inference).

## MySQL Column Types Reference

All MySQL column types are natively supported. Custom types can be created if needed.

**Note:** Examples use TypeScript keys as column names; database aliases and casing strategies are available via the `casing` parameter.

### Numeric Types

**Integer types:**
- `int()` - signed integer
- `tinyint()` - tiny signed integer
- `smallint()` - small signed integer
- `mediumint()` - medium signed integer
- `bigint({ mode: 'number' | 'bigint', unsigned: true })` - large integer with optional unsigned flag

**Floating point types:**
- `real()`, `real({ precision: 1, scale: 1 })` - real number with optional precision/scale
- `decimal()`, `decimal({ precision: 1, scale: 1, mode: 'number' | 'bigint' })` - decimal with precision/scale and mode
- `double()`, `double({ precision: 1, scale: 1 })` - double precision float
- `float()` - single precision float

**Special:**
- `serial()` - alias for `BIGINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE`

### Binary Types

- `binary()` - fixed-length byte string, right-padded with `0x00` on insert
- `varbinary({ length: 2 })` - variable-length byte string

### String Types

- `char()` - fixed-length character string
- `varchar({ length: 2, enum: ["value1", "value2"] })` - variable-length string with optional enum for type inference (no runtime validation)
- `text({ enum: ["value1", "value2"] })` - text with optional enum for type inference

### Boolean & Date/Time Types

- `boolean()` - boolean value
- `date()` - date only
- `datetime()`, `datetime({ mode: 'date' | 'string', fsp: 0..6 })` - date and time with optional fractional seconds precision
- `time()`, `time({ fsp: 0..6 })` - time only with optional fractional seconds
- `year()` - year value
- `timestamp()`, `timestamp({ mode: 'date' | 'string', fsp: 0..6 })` - timestamp with optional `defaultNow()`

### JSON & Enum

- `json()`, `json().$type<{ foo: string }>()` - JSON with optional type inference
- `mysqlEnum(['unknown', 'known', 'popular'])` - enum type

### Column Modifiers

**Type customization:**
```typescript
int().$type<UserId>()  // branded types
json().$type<Data>()   // type inference
```

**Constraints:**
- `.notNull()` - NOT NULL constraint
- `.primaryKey()` - PRIMARY KEY constraint
- `.autoincrement()` - AUTO_INCREMENT

**Defaults:**
- `.default(3)` - static default value
- `.$defaultFn(() => createId())` - runtime default function (insert only)
- `.$onUpdate(() => null)` - runtime update function (called on update, or insert if no default)

Example combining modifiers:
```typescript
const table = mysqlTable('table', {
  id: int().primaryKey().autoincrement(),
  name: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().defaultNow(),
  data: json().$type<{ foo: string }>(),
});
```

### postgresql_column_types
PostgreSQL column type definitions with integer (integer, smallint, bigint, serial, smallserial, bigserial), text (text, varchar, char), numeric (numeric, real, doublePrecision), JSON (json, jsonb), date/time (time, timestamp, date, interval), geometric (point, line), enum types; identity columns with GENERATED ALWAYS/BY DEFAULT; default values via .default(), .$defaultFn(), .$onUpdateFn(); constraints (.notNull(), .primaryKey()); type customization via .$type<T>()

## Integer Types

**integer** (int, int4): Signed 4-byte integer
```ts
import { integer, pgTable } from "drizzle-orm/pg-core";
export const table = pgTable('table', {
  int: integer(),
  int1: integer().default(10),
  int2: integer().default(sql`'10'::int`)
});
```

**smallint** (int2): Signed 2-byte integer
```ts
import { smallint, pgTable } from "drizzle-orm/pg-core";
export const table = pgTable('table', {
  smallint: smallint(),
  smallint1: smallint().default(10)
});
```

**bigint** (int8): Signed 8-byte integer. Use `mode: 'number'` for values between 2^31 and 2^53, otherwise defaults to `bigint` type.
```ts
import { bigint, pgTable } from "drizzle-orm/pg-core";
export const table = pgTable('table', {
  bigint: bigint({ mode: 'number' }), // inferred as number
  bigint2: bigint({ mode: 'bigint' }), // inferred as bigint
  bigint3: bigint().default(10)
});
```

## Auto-Increment Integer Types

**serial** (serial4): Auto-incrementing 4-byte integer
```ts
import { serial, pgTable } from "drizzle-orm/pg-core";
export const table = pgTable('table', {
  serial: serial()
});
```

**smallserial** (serial2): Auto-incrementing 2-byte integer
```ts
import { smallserial, pgTable } from "drizzle-orm/pg-core";
export const table = pgTable('table', {
  smallserial: smallserial()
});
```

**bigserial** (serial8): Auto-incrementing 8-byte integer. Use `mode: 'number'` for values between 2^31 and 2^53.
```ts
import { bigserial, pgTable } from "drizzle-orm/pg-core";
export const table = pgTable('table', {
  bigserial: bigserial({ mode: 'number' })
});
```

## Boolean

**boolean**: Standard SQL boolean type
```ts
import { boolean, pgTable } from "drizzle-orm/pg-core";
export const table = pgTable('table', {
  boolean: boolean()
});
```

## Text Types

**text**: Variable-length unlimited character string. Can define `enum` config for type inference (doesn't check runtime values).
```ts
import { text, pgTable } from "drizzle-orm/pg-core";
export const table = pgTable('table', {
  text: text(),
  text2: text({ enum: ["value1", "value2"] }) // inferred as "value1" | "value2" | null
});
```

**varchar** (character varying(n)): Variable-length string up to n characters. Length parameter is optional. Supports enum config.
```ts
import { varchar, pgTable } from "drizzle-orm/pg-core";
export const table = pgTable('table', {
  varchar1: varchar(),
  varchar2: varchar({ length: 256 }),
  varchar3: varchar({ enum: ["value1", "value2"] })
});
```

**char** (character(n)): Fixed-length, blank-padded string up to n characters. Length parameter is optional. Supports enum config.
```ts
import { char, pgTable } from "drizzle-orm/pg-core";
export const table = pgTable('table', {
  char1: char(),
  char2: char({ length: 256 }),
  char3: char({ enum: ["value1", "value2"] })
});
```

## Numeric Types

**numeric** (decimal): Exact numeric with selectable precision. Can store up to 131072 digits before decimal and 16383 after. Supports `mode: 'number'` or `mode: 'bigint'`.
```ts
import { numeric, pgTable } from "drizzle-orm/pg-core";
export const table = pgTable('table', {
  numeric1: numeric(),
  numeric2: numeric({ precision: 100 }),
  numeric3: numeric({ precision: 100, scale: 20 }),
  numericNum: numeric({ mode: 'number' }),
  numericBig: numeric({ mode: 'bigint' })
});
```

**real** (float4): Single precision floating-point (4 bytes)
```ts
import { real, pgTable } from "drizzle-orm/pg-core";
export const table = pgTable('table', {
  real1: real(),
  real2: real().default(10.10),
  real3: real().default(sql`'10.10'::real`)
});
```

**doublePrecision** (double precision, float8): Double precision floating-point (8 bytes)
```ts
import { doublePrecision, pgTable } from "drizzle-orm/pg-core";
export const table = pgTable('table', {
  double1: doublePrecision(),
  double2: doublePrecision().default(10.10),
  double3: doublePrecision().default(sql`'10.10'::double precision`)
});
```

## JSON Types

**json**: Textual JSON data (RFC 7159). Use `.$type<T>()` for compile-time type inference without runtime checks.
```ts
import { json, pgTable } from "drizzle-orm/pg-core";
export const table = pgTable('table', {
  json1: json(),
  json2: json().default({ foo: "bar" }),
  json3: json().$type<{ foo: string }>(),
  json4: json().$type<string[]>()
});
```

**jsonb**: Binary JSON data (decomposed). Same `.$type<T>()` support as json.
```ts
import { jsonb, pgTable } from "drizzle-orm/pg-core";
export const table = pgTable('table', {
  jsonb1: jsonb(),
  jsonb2: jsonb().default({ foo: "bar" }),
  jsonb3: jsonb().$type<{ foo: string }>()
});
```

## Date/Time Types

**time**: Time of day with or without timezone. Options: `withTimezone`, `precision`.
```ts
import { time, pgTable } from "drizzle-orm/pg-core";
export const table = pgTable('table', {
  time1: time(),
  time2: time({ withTimezone: true }),
  time3: time({ precision: 6 }),
  time4: time({ precision: 6, withTimezone: true })
});
```

**timestamp**: Date and time with or without timezone. Options: `precision`, `withTimezone`, `mode: 'date' | 'string'`. Default mode is 'date' which maps to JS Date. String mode passes raw dates without mapping.
```ts
import { timestamp, pgTable } from "drizzle-orm/pg-core";
export const table = pgTable('table', {
  timestamp1: timestamp(),
  timestamp2: timestamp({ precision: 6, withTimezone: true }),
  timestamp3: timestamp().defaultNow(),
  timestamp4: timestamp({ mode: "date" }),
  timestamp5: timestamp({ mode: "string" })
});
```

**date**: Calendar date (year, month, day). Supports `mode: 'date' | 'string'`.
```ts
import { date, pgTable } from "drizzle-orm/pg-core";
export const table = pgTable('table', {
  date: date(),
  date2: date({ mode: "date" }),
  date3: date({ mode: "string" })
});
```

**interval**: Time span. Options: `fields`, `precision`.
```ts
import { interval, pgTable } from "drizzle-orm/pg-core";
export const table = pgTable('table', {
  interval1: interval(),
  interval2: interval({ fields: 'day' }),
  interval3: interval({ fields: 'month', precision: 6 })
});
```

## Geometric Types

**point**: Geometric point. Two modes: `tuple` (default, maps to [x, y]) or `xy` (maps to { x, y }).
```ts
import { point, pgTable } from "drizzle-orm/pg-core";
export const table = pgTable('table', {
  point: point(),
  pointObj: point({ mode: 'xy' })
});
```

**line**: Geometric line. Two modes: `tuple` (default, maps to [a, b, c]) or `abc` (maps to { a, b, c } from equation Ax + By + C = 0).
```ts
import { line, pgTable } from "drizzle-orm/pg-core";
export const table = pgTable('table', {
  line: line(),
  lineObj: line({ mode: 'abc' })
});
```

## Enum Type

**pgEnum**: Enumerated types - static ordered set of values.
```ts
import { pgEnum, pgTable } from "drizzle-orm/pg-core";
export const moodEnum = pgEnum('mood', ['sad', 'ok', 'happy']);
export const table = pgTable('table', {
  mood: moodEnum()
});
```

## Column Customization

**.$type<T>()**: Customize column data type for unknown or branded types.
```ts
type UserId = number & { __brand: 'user_id' };
const users = pgTable('users', {
  id: serial().$type<UserId>().primaryKey(),
  jsonField: json().$type<Data>()
});
```

## Identity Columns

PostgreSQL identity columns auto-generate unique integer values using sequences. Requires drizzle-orm@0.32.0+ and drizzle-kit@0.23.0+.

**GENERATED ALWAYS AS IDENTITY**: Database always generates value, manual insertion/updates not allowed without OVERRIDING SYSTEM VALUE.

**GENERATED BY DEFAULT AS IDENTITY**: Database generates by default, but manual values can be inserted/updated.

```ts
import { pgTable, integer, text } from 'drizzle-orm/pg-core';
export const ingredients = pgTable("ingredients", {
  id: integer().primaryKey().generatedAlwaysAsIdentity({ startWith: 1000 }),
  name: text().notNull()
});
```

## Default Values

**DEFAULT clause**: Specifies default value for INSERT if not explicitly provided. Can be constant, expression, or NULL.

```ts
import { integer, pgTable, uuid } from "drizzle-orm/pg-core";
export const table = pgTable('table', {
  integer1: integer().default(42),
  integer2: integer().default(sql`'42'::integer`),
  uuid1: uuid().defaultRandom(),
  uuid2: uuid().default(sql`gen_random_uuid()`)
});
```

**$defaultFn() / $default()**: Generate defaults at runtime (uuid, cuid, cuid2, etc). Only affects runtime, not drizzle-kit.
```ts
import { text, pgTable } from "drizzle-orm/pg-core";
import { createId } from '@paralleldrive/cuid2';
export const table = pgTable('table', {
  id: text().$defaultFn(() => createId())
});
```

**$onUpdateFn() / $onUpdate()**: Generate values at runtime on update. Called on insert if no default provided.
```ts
import { integer, timestamp, text, pgTable } from "drizzle-orm/pg-core";
export const table = pgTable('table', {
  updateCounter: integer().default(sql`1`).$onUpdateFn((): SQL => sql`${table.update_counter} + 1`),
  updatedAt: timestamp({ mode: 'date', precision: 3 }).$onUpdate(() => new Date()),
  alwaysNull: text().$type<string | null>().$onUpdate(() => null)
});
```

## Constraints

**NOT NULL**: Column cannot contain NULL value.
```ts
import { integer, pgTable } from "drizzle-orm/pg-core";
export const table = pgTable('table', {
  integer: integer().notNull()
});
```

**PRIMARY KEY**: Column(s) used as unique identifier for rows. Values must be unique and not null.
```ts
import { serial, pgTable } from "drizzle-orm/pg-core";
export const table = pgTable('table', {
  id: serial().primaryKey()
});
```

## Notes

- Column names are generated from TypeScript keys by default. Use database aliases or `casing` parameter for custom mapping.
- Custom types can be created if native support is insufficient.
- For `timestamp with timezone`, values are stored in UTC and converted based on the Postgres instance timezone setting.

### singlestore-column-types
SingleStore column types: numeric (int, bigint, decimal, float, real, double), binary (binary, varbinary), string (char, varchar, text with optional enum), boolean, temporal (date, datetime, time, year, timestamp), json with .$type<T>(), enum; modifiers: .notNull(), .default(), .$defaultFn(), .$onUpdate(), .primaryKey(), .autoincrement(), .$type<T>() for branded types.

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

### sqlite_column_types
SQLite column types: integer (modes: number/boolean/timestamp_ms/timestamp, autoincrement), real, text (enum, json), blob (buffer/bigint/json), numeric; customization via .$type<T>(); constraints: notNull(); defaults: static values, SQL expressions, CURRENT_TIME/DATE/TIMESTAMP, $defaultFn() for runtime, $onUpdateFn() for updates.

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

