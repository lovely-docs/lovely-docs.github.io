## Headless TypeScript ORM with SQL-like and Relational APIs

Drizzle is a lightweight, zero-dependency ORM that embraces SQL rather than abstracting it. Define schemas in TypeScript, query with familiar SQL syntax or use the Relational API for nested data fetching (always 1 SQL query). Supports PostgreSQL, MySQL, SQLite, SingleStore with automatic migrations.

**Example**:
```typescript
// Schema
export const countries = pgTable('countries', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }),
});

// SQL-like query
await db.select().from(countries).where(eq(countries.id, 10))

// Relational query
await db.query.users.findMany({ with: { posts: true } })
```