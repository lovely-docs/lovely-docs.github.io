## Setup Drizzle with PGLite in Existing Project

1. Install `drizzle-orm`, `@electric-sql/pglite`, and `drizzle-kit`
2. Set `DATABASE_URL` in `.env`
3. Create `drizzle.config.ts` with PostgreSQL dialect
4. Run `npx drizzle-kit introspect` to generate schema from existing database
5. Connect: `const db = drizzle(new PGLite(process.env.DATABASE_URL))`
6. Query: `await db.select().from(table)`
7. Optionally update schema and apply migrations with `drizzle-kit generate` and `migrate`