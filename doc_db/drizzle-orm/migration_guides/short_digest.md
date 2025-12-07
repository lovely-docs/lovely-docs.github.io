**Migration from Prisma, Sequelize, TypeORM to Drizzle ORM**

Setup: Install packages → Create `drizzle.config.ts` → Run `npx drizzle-kit introspect` → Create `src/drizzle/db.ts` with `drizzle()` client → Add relations to schema → Run migrations on startup.

Query replacements (all with examples):
- **Insert**: `db.insert(table).values([...])`
- **Select single with join**: Core query with `.leftJoin()` or relational query with `.findFirst({ with: { relation: true } })`
- **Select multiple with filtering/pagination**: Use `ilike()` for case-insensitive search, `.offset()/.limit()` for pagination, count in separate query
- **Aggregations**: Core query with `sql<type>\`...\`` for SUM/COUNT/etc, `.groupBy()`, `.leftJoin()` - not supported in relational queries
- **Update**: `db.update(table).set({...}).where(eq(...))`
- **Delete with transaction**: `db.transaction(async (tx) => { await tx.delete(...) })`

Key differences: Numeric fields are strings (more precision), relational queries similar to Prisma/TypeORM, core queries more flexible, all type-safe.