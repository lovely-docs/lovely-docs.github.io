Delete rows with optional `.where()`, `.limit()` (MySQL/SQLite/SingleStore), `.orderBy()`, `.returning()` (PostgreSQL/SQLite), and `.with()` for CTEs.

Examples:
```typescript
await db.delete(users);
await db.delete(users).where(eq(users.name, 'Dan')).limit(2);
await db.delete(users).where(eq(users.name, 'Dan')).orderBy(desc(users.name));
const deleted = await db.delete(users).where(eq(users.name, 'Dan')).returning();
```