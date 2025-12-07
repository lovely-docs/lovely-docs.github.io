## Overview
`drizzle-valibot` is a plugin for Drizzle ORM that generates Valibot schemas from Drizzle ORM table definitions. Requires `drizzle-valibot@0.3.0+`, Drizzle ORM v0.36.0+, and Valibot v1.0.0-beta.7+.

## Select Schema
Validates data queried from the database (useful for API responses).

```ts
import { pgTable, text, integer } from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-valibot';
import { parse } from 'valibot';

const users = pgTable('users', {
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  name: text().notNull(),
  age: integer().notNull()
});

const userSelectSchema = createSelectSchema(users);
const rows = await db.select().from(users).limit(1);
const parsed = parse(userSelectSchema, rows[0]); // { id: number; name: string; age: number }
```

Works with views and enums:
```ts
const roles = pgEnum('roles', ['admin', 'basic']);
const rolesSchema = createSelectSchema(roles);
const parsed = parse(rolesSchema, ...); // 'admin' | 'basic'

const usersView = pgView('users_view').as((qb) => qb.select().from(users).where(gt(users.age, 18)));
const usersViewSchema = createSelectSchema(usersView);
```

## Insert Schema
Validates data before inserting into the database (useful for API requests). Auto-generated columns are excluded.

```ts
const userInsertSchema = createInsertSchema(users);
const user = { name: 'Jane', age: 30 };
const parsed = parse(userInsertSchema, user); // { name: string, age: number }
await db.insert(users).values(parsed);
```

## Update Schema
Validates data before updating in the database. All fields become optional, and generated columns cannot be updated.

```ts
const userUpdateSchema = createUpdateSchema(users);
const user = { age: 35 };
const parsed = parse(userUpdateSchema, user); // { name?: string | undefined, age?: number | undefined }
await db.update(users).set(parsed).where(eq(users.name, 'Jane'));
```

## Refinements
All `createSelectSchema`, `createInsertSchema`, and `createUpdateSchema` functions accept an optional second parameter to extend, modify, or overwrite field schemas. Pass a callback function to extend/modify, or a Valibot schema to overwrite.

```ts
const userSelectSchema = createSelectSchema(users, {
  name: (schema) => pipe(schema, maxLength(20)), // Extends schema
  bio: (schema) => pipe(schema, maxLength(1000)), // Extends before nullability
  preferences: object({ theme: string() }) // Overwrites field including nullability
});
```

## Data Type Reference
Maps Drizzle ORM column types to Valibot schemas:

**Boolean**: `pg.boolean()` → `boolean()`

**Date**: `pg.date({ mode: 'date' })`, `pg.timestamp({ mode: 'date' })` → `date()`

**String**: `pg.text()`, `pg.varchar()`, `mysql.binary()`, etc. → `string()`

**Bit**: `pg.bit({ dimensions: ... })` → `pipe(string(), regex(/^[01]+$/), maxLength(dimensions))`

**UUID**: `pg.uuid()` → `pipe(string(), uuid())`

**Char**: `pg.char({ length: ... })` → `pipe(string(), length(length))`

**Varchar**: `pg.varchar({ length: ... })` → `pipe(string(), maxLength(length))`

**MySQL text variants**: `mysql.tinytext()` → `pipe(string(), maxLength(255))`, `mysql.text()` → `maxLength(65_535)`, `mysql.mediumtext()` → `maxLength(16_777_215)`, `mysql.longtext()` → `maxLength(4_294_967_295)`

**Enum**: `pg.text({ enum: [...] })` → `enum([...])`

**Integer types with range validation**:
- `mysql.tinyint()` → `pipe(number(), minValue(-128), maxValue(127), integer())`
- `mysql.tinyint({ unsigned: true })` → `pipe(number(), minValue(0), maxValue(255), integer())`
- `pg.smallint()` → `pipe(number(), minValue(-32_768), maxValue(32_767), integer())`
- `mysql.smallint({ unsigned: true })` → `pipe(number(), minValue(0), maxValue(65_535), integer())`
- `pg.real()`, `mysql.float()` → `pipe(number(), minValue(-8_388_608), maxValue(8_388_607))`
- `mysql.mediumint()` → `pipe(number(), minValue(-8_388_608), maxValue(8_388_607), integer())`
- `mysql.float({ unsigned: true })` → `pipe(number(), minValue(0), maxValue(16_777_215))`
- `mysql.mediumint({ unsigned: true })` → `pipe(number(), minValue(0), maxValue(16_777_215), integer())`
- `pg.integer()`, `mysql.int()` → `pipe(number(), minValue(-2_147_483_648), maxValue(2_147_483_647), integer())`
- `mysql.int({ unsigned: true })` → `pipe(number(), minValue(0), maxValue(4_294_967_295), integer())`
- `pg.doublePrecision()`, `mysql.double()` → `pipe(number(), minValue(-140_737_488_355_328), maxValue(140_737_488_355_327))`
- `mysql.double({ unsigned: true })` → `pipe(number(), minValue(0), maxValue(281_474_976_710_655))`
- `pg.bigint({ mode: 'number' })` → `pipe(number(), minValue(-9_007_199_254_740_991), maxValue(9_007_199_254_740_991), integer())`
- `mysql.serial()` → `pipe(number(), minValue(0), maxValue(9_007_199_254_740_991), integer())`
- `pg.bigint({ mode: 'bigint' })` → `pipe(bigint(), minValue(-9_223_372_036_854_775_808n), maxValue(9_223_372_036_854_775_807n))`
- `mysql.bigint({ mode: 'bigint', unsigned: true })` → `pipe(bigint(), minValue(0n), maxValue(18_446_744_073_709_551_615n))`

**Year**: `mysql.year()` → `pipe(number(), minValue(1_901), maxValue(2_155), integer())`

**Geometry**: `pg.point({ mode: 'tuple' })` → `tuple([number(), number()])`, `pg.point({ mode: 'xy' })` → `object({ x: number(), y: number() })`

**Vectors**: `pg.vector({ dimensions: ... })` → `pipe(array(number()), length(dimensions))`

**Line**: `pg.line({ mode: 'abc' })` → `object({ a: number(), b: number(), c: number() })`, `pg.line({ mode: 'tuple' })` → `tuple([number(), number(), number()])`

**JSON**: `pg.json()`, `pg.jsonb()`, `mysql.json()` → `union([union([string(), number(), boolean(), null_()]), array(any()), record(string(), any())])`

**Buffer**: `sqlite.blob({ mode: 'buffer' })` → `custom<Buffer>((v) => v instanceof Buffer)`

**Arrays**: `pg.dataType().array(...)` → `pipe(array(baseDataTypeSchema), length(size))`