Plugin to generate Valibot validation schemas from Drizzle ORM table definitions.

**Three schema types**:
- `createSelectSchema()` - validates queried data
- `createInsertSchema()` - validates data for insertion (excludes auto-generated columns)
- `createUpdateSchema()` - validates data for updates (all fields optional, no generated columns)

All accept optional refinements parameter to extend/modify/overwrite field schemas via callback or Valibot schema.

**Data type mapping**: Boolean, Date, String, UUID, Char/Varchar with length constraints, Enum, Integer types with range validation (tinyint to bigint with signed/unsigned variants), Float/Double, Year, Geometry (point/line), Vectors, JSON, Buffer, and Arrays.