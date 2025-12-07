## Headless ORM
Drizzle is a library that lets you build projects with it, not around it - doesn't force structure like traditional data frameworks.

## SQL-Like + Relational APIs
Embraces SQL at core with minimal learning curve. Provides SQL schema, queries, and migrations. Also includes a Queries API for convenient nested relational data fetching that always outputs exactly 1 SQL query.

Example:
```typescript
// Schema
export const countries = pgTable('countries', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }),
});

// SQL-like query
await db.select().from(countries).where(eq(countries.id, 10))

// Relational query
const result = await db.query.users.findMany({
  with: { posts: true }
});
```

## Serverless-Ready
Zero dependencies, dialect-specific (PostgreSQL, MySQL, SQLite), slim and performant by design.