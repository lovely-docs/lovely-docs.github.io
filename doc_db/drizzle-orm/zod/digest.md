## Overview
`drizzle-zod` is a plugin that generates Zod schemas from Drizzle ORM schemas for validation.

**Requirements:** drizzle-zod@0.6.0+, Drizzle ORM v0.36.0+, Zod v3.25.1+

## Select Schema
Validates data queried from the database (API responses).

```ts
import { pgTable, text, integer } from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-zod';

const users = pgTable('users', {
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  name: text().notNull(),
  age: integer().notNull()
});

const userSelectSchema = createSelectSchema(users);
const rows = await db.select().from(users).limit(1);
const parsed = userSelectSchema.parse(rows[0]); // { id: number; name: string; age: number }
```

Supports views and enums:
```ts
const roles = pgEnum('roles', ['admin', 'basic']);
const rolesSchema = createSelectSchema(roles);

const usersView = pgView('users_view').as((qb) => qb.select().from(users).where(gt(users.age, 18)));
const usersViewSchema = createSelectSchema(usersView);
```

## Insert Schema
Validates data to be inserted (API requests).

```ts
import { createInsertSchema } from 'drizzle-zod';

const userInsertSchema = createInsertSchema(users);
const user = { name: 'Jane', age: 30 };
const parsed = userInsertSchema.parse(user); // { name: string, age: number }
await db.insert(users).values(parsed);
```

## Update Schema
Validates data to be updated. Generated columns cannot be updated.

```ts
import { createUpdateSchema } from 'drizzle-zod';

const userUpdateSchema = createUpdateSchema(users);
const user = { age: 35 };
const parsed = userUpdateSchema.parse(user); // { name?: string | undefined, age?: number | undefined }
await db.update(users).set(parsed).where(eq(users.name, 'Jane'));
```

## Refinements
Extend, modify, or overwrite field schemas via optional parameter:

```ts
const userSelectSchema = createSelectSchema(users, {
  name: (schema) => schema.max(20), // Extends schema
  bio: (schema) => schema.max(1000), // Extends before nullability
  preferences: z.object({ theme: z.string() }) // Overwrites field
});
```

## Factory Functions
`createSchemaFactory` for advanced use cases.

**Extended Zod instance:**
```ts
import { createSchemaFactory } from 'drizzle-zod';
import { z } from '@hono/zod-openapi';

const { createInsertSchema } = createSchemaFactory({ zodInstance: z });
const userInsertSchema = createInsertSchema(users, {
  name: (schema) => schema.openapi({ example: 'John' })
});
```

**Type coercion:**
```ts
const { createInsertSchema } = createSchemaFactory({
  coerce: { date: true } // or coerce: true for all types
});
const userInsertSchema = createInsertSchema(users);
// createdAt: z.coerce.date()
```

## Data Type Reference
Comprehensive mapping of Drizzle column types to Zod schemas:

- **Boolean:** `pg.boolean()` → `z.boolean()`
- **Date:** `pg.date({ mode: 'date' })`, `pg.timestamp({ mode: 'date' })` → `z.date()`
- **String:** `pg.text()`, `pg.varchar()`, `mysql.binary()` → `z.string()`
- **UUID:** `pg.uuid()` → `z.string().uuid()`
- **Char:** `pg.char({ length: 10 })` → `z.string().length(10)`
- **Varchar:** `pg.varchar({ length: 100 })` → `z.string().max(100)`
- **MySQL text variants:** `tinytext` → `z.string().max(255)`, `text` → `z.string().max(65_535)`, `mediumtext` → `z.string().max(16_777_215)`, `longtext` → `z.string().max(4_294_967_295)`
- **Enum:** `pg.text({ enum: ['a', 'b'] })` → `z.enum(['a', 'b'])`
- **Bit:** `pg.bit({ dimensions: 8 })` → `z.string().regex(/^[01]+$/).max(8)`
- **Integer types:** `pg.smallint()` → `z.number().min(-32_768).max(32_767).int()`, `pg.integer()` → `z.number().min(-2_147_483_648).max(2_147_483_647).int()`, `mysql.tinyint()` → `z.number().min(-128).max(127).int()`, unsigned variants adjust min to 0
- **Float/Double:** `pg.real()`, `mysql.float()` → `z.number()` with appropriate bit limits
- **BigInt:** `pg.bigint({ mode: 'bigint' })` → `z.bigint().min(-9_223_372_036_854_775_808n).max(9_223_372_036_854_775_807n)`, unsigned → `z.bigint().min(0).max(18_446_744_073_709_551_615n)`
- **BigInt (number mode):** `pg.bigint({ mode: 'number' })` → `z.number().min(-9_007_199_254_740_991).max(9_007_199_254_740_991).int()`
- **Year:** `mysql.year()` → `z.number().min(1_901).max(2_155).int()`
- **Geometry:** `pg.point({ mode: 'tuple' })` → `z.tuple([z.number(), z.number()])`, `pg.point({ mode: 'xy' })` → `z.object({ x: z.number(), y: z.number() })`
- **Vector:** `pg.vector({ dimensions: 3 })` → `z.array(z.number()).length(3)`
- **Line:** `pg.line({ mode: 'abc' })` → `z.object({ a: z.number(), b: z.number(), c: z.number() })`, `pg.line({ mode: 'tuple' })` → `z.tuple([z.number(), z.number(), z.number()])`
- **JSON:** `pg.json()`, `pg.jsonb()` → `z.union([z.union([z.string(), z.number(), z.boolean(), z.null()]), z.record(z.any()), z.array(z.any())])`
- **Buffer:** `sqlite.blob({ mode: 'buffer' })` → `z.custom<Buffer>((v) => v instanceof Buffer)`
- **Array:** `pg.dataType().array(size)` → `z.array(baseDataTypeSchema).length(size)`