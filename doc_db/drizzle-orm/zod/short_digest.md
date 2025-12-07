Generate Zod validation schemas from Drizzle ORM table definitions.

**Three main functions:**
- `createSelectSchema(table)` - validates query results
- `createInsertSchema(table)` - validates insert data
- `createUpdateSchema(table)` - validates update data (all fields optional, generated columns excluded)

**Refinements:** Pass optional second parameter to extend/modify/overwrite field schemas:
```ts
createSelectSchema(users, {
  name: (schema) => schema.max(20),
  preferences: z.object({ theme: z.string() })
})
```

**Factory:** `createSchemaFactory({ zodInstance: z, coerce: { date: true } })` for extended Zod instances or type coercion.

**Type mapping:** Comprehensive reference for all Drizzle column types (boolean, date, string, UUID, char, varchar, text variants, enum, bit, integers, floats, bigint, year, geometry, vectors, lines, JSON, buffer, arrays) to corresponding Zod schemas with proper constraints.