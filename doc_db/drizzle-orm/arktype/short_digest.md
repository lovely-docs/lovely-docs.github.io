Plugin generating Arktype schemas from Drizzle ORM schemas for validation.

**Select Schema** (query validation): `createSelectSchema(table)` validates all queried fields present.

**Insert Schema** (request validation): `createInsertSchema(table)` validates required fields for insertion.

**Update Schema** (request validation): `createUpdateSchema(table)` makes all fields optional, rejects generated columns.

**Refinements**: Pass object with field names mapping to functions `(schema) => pipe(schema, ...)` to extend/modify, or Arktype schemas to overwrite.

**Type Mappings**: Boolean → `type.boolean`, Date → `type.Date`, String → `type.string`, UUID → regex, Char/Varchar → `type.string.exactlyLength/atMostLength(n)`, Enum → `type.enumerated(...)`, Integer types → `type.keywords.number.integer.atLeast(min).atMost(max)`, BigInt → `type.bigint.narrow(...)`, JSON → union of primitives/arrays/objects, Point → tuple or object, Vector → number array, Buffer → `type.instanceOf(Buffer)`, Arrays → `baseSchema.array().exactlyLength(size)`.