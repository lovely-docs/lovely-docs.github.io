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