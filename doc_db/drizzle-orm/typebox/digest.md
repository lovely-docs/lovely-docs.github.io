## Overview
`drizzle-typebox` is a plugin that generates Typebox schemas from Drizzle ORM schemas. Requires `drizzle-typebox@0.2.0+`, Drizzle ORM v0.36.0+, and Typebox v0.34.8+.

## Select Schema
Validates data queried from the database (API responses).

```ts
import { pgTable, text, integer } from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-typebox';
import { Value } from '@sinclair/typebox/value';

const users = pgTable('users', {
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  name: text().notNull(),
  age: integer().notNull()
});

const userSelectSchema = createSelectSchema(users);
const rows = await db.select().from(users).limit(1);
const parsed = Value.Parse(userSelectSchema, rows[0]);
```

Works with views and enums:
```ts
const roles = pgEnum('roles', ['admin', 'basic']);
const rolesSchema = createSelectSchema(roles);

const usersView = pgView('users_view').as((qb) => qb.select().from(users).where(gt(users.age, 18)));
const usersViewSchema = createSelectSchema(usersView);
```

## Insert Schema
Validates data to be inserted into the database (API requests).

```ts
const userInsertSchema = createInsertSchema(users);
const user = { name: 'Jane', age: 30 };
const parsed = Value.Parse(userInsertSchema, user);
await db.insert(users).values(parsed);
```

## Update Schema
Validates data to be updated in the database. Generated columns cannot be updated.

```ts
const userUpdateSchema = createUpdateSchema(users);
const user = { age: 35 };
const parsed = Value.Parse(userUpdateSchema, user);
await db.update(users).set(parsed).where(eq(users.name, 'Jane'));
```

## Refinements
Each create schema function accepts an optional parameter to extend, modify, or overwrite field schemas. Callback functions extend/modify; Typebox schemas overwrite.

```ts
const userSelectSchema = createSelectSchema(users, {
  name: (schema) => Type.String({ ...schema, maxLength: 20 }),
  bio: (schema) => Type.String({ ...schema, maxLength: 1000 }),
  preferences: Type.Object({ theme: Type.String() })
});
```

## Factory Functions
Use `createSchemaFactory` for advanced cases like extended Typebox instances:

```ts
import { createSchemaFactory } from 'drizzle-typebox';
import { t } from 'elysia';

const { createInsertSchema } = createSchemaFactory({ typeboxInstance: t });
const userInsertSchema = createInsertSchema(users, {
  name: (schema) => t.Number({ ...schema }, { error: '`name` must be a string' })
});
```

## Data Type Reference
Maps Drizzle column types to Typebox schemas:

- `boolean()` → `Type.Boolean()`
- `date({ mode: 'date' })`, `timestamp({ mode: 'date' })` → `Type.Date()`
- `text()`, `varchar()`, `numeric()`, `time()`, etc. → `Type.String()`
- `uuid()` → `Type.String({ format: 'uuid' })`
- `char({ length })` → `Type.String({ minLength: length, maxLength: length })`
- `varchar({ length })` → `Type.String({ maxLength: length })`
- `text({ enum })`, `char({ enum })`, `varchar({ enum })` → `Type.Enum(enum)`
- `tinyint()` → `Type.Integer({ minimum: -128, maximum: 127 })`
- `tinyint({ unsigned: true })` → `Type.Integer({ minimum: 0, maximum: 255 })`
- `smallint()` → `Type.Integer({ minimum: -32_768, maximum: 32_767 })`
- `smallint({ unsigned: true })` → `Type.Integer({ minimum: 0, maximum: 65_535 })`
- `real()`, `float()` → `Type.Number().min(-8_388_608).max(8_388_607)`
- `mediumint()` → `Type.Integer({ minimum: -8_388_608, maximum: 8_388_607 })`
- `float({ unsigned: true })` → `Type.Number({ minimum: 0, maximum: 16_777_215 })`
- `mediumint({ unsigned: true })` → `Type.Integer({ minimum: 0, maximum: 16_777_215 })`
- `integer()`, `serial()`, `int()` → `Type.Integer({ minimum: -2_147_483_648, maximum: 2_147_483_647 })`
- `int({ unsigned: true })` → `Type.Integer({ minimum: 0, maximum: 4_294_967_295 })`
- `doublePrecision()`, `double()`, `real()` → `Type.Number({ minimum: -140_737_488_355_328, maximum: 140_737_488_355_327 })`
- `double({ unsigned: true })` → `Type.Number({ minimum: 0, maximum: 281_474_976_710_655 })`
- `bigint({ mode: 'number' })` → `Type.Integer({ minimum: -9_007_199_254_740_991, maximum: 9_007_199_254_740_991 })`
- `serial()` → `Type.Integer({ minimum: 0, maximum: 9_007_199_254_740_991 })`
- `bigint({ mode: 'bigint' })` → `Type.BigInt({ minimum: -9_223_372_036_854_775_808n, maximum: 9_223_372_036_854_775_807n })`
- `bigint({ mode: 'bigint', unsigned: true })` → `Type.BigInt({ minimum: 0, maximum: 18_446_744_073_709_551_615n })`
- `year()` → `Type.Integer({ minimum: 1_901, maximum: 2_155 })`
- `point({ mode: 'tuple' })` → `Type.Tuple([Type.Number(), Type.Number()])`
- `point({ mode: 'xy' })` → `Type.Object({ x: Type.Number(), y: Type.Number() })`
- `vector({ dimensions })`, `halfvec({ dimensions })` → `Type.Array(Type.Number(), { minItems: dimensions, maxItems: dimensions })`
- `line({ mode: 'abc' })` → `Type.Object({ a: Type.Number(), b: Type.Number(), c: Type.Number() })`
- `line({ mode: 'tuple' })` → `Type.Tuple([Type.Number(), Type.Number(), Type.Number()])`
- `json()`, `jsonb()` → `Type.Recursive((self) => Type.Union([Type.Union([Type.String(), Type.Number(), Type.Boolean(), Type.Null()]), Type.Array(self), Type.Record(Type.String(), self)]))`
- `blob({ mode: 'buffer' })` → `t.Union([t.Union([t.String(), t.Number(), t.Boolean(), t.Null()]), t.Array(t.Any()), t.Record(t.String(), t.Any())])`
- `dataType().array(size)` → `Type.Array(baseDataTypeSchema, { minItems: size, maxItems: size })`
