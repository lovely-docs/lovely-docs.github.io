## Overview
Plugin generating Typebox schemas from Drizzle ORM schemas for validation.

## Core Functions
- `createSelectSchema()` - validates queried data
- `createInsertSchema()` - validates data for insertion
- `createUpdateSchema()` - validates data for updates (excludes generated columns)
- `createSchemaFactory()` - for extended Typebox instances

## Refinements
Pass optional parameter to extend/modify/overwrite field schemas:
```ts
createSelectSchema(users, {
  name: (schema) => Type.String({ ...schema, maxLength: 20 }),
  preferences: Type.Object({ theme: Type.String() })
});
```

## Type Mappings
Boolean, Date, String, UUID, Enum, Integer (8/16/24/32/64-bit signed/unsigned), Number, BigInt, Tuple, Object, Array, JSON, and array types all map to corresponding Typebox types with appropriate constraints.
