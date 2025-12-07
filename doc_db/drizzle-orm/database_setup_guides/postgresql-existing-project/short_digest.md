## PostgreSQL Integration in Existing Project

1. Install `pg` and `@types/pg`
2. Set `DATABASE_URL` in `.env`
3. Create `drizzle.config.ts` with `dialect: 'postgresql'`
4. Run introspection to generate schema from existing database
5. Connect: `const db = drizzle(new Client({ connectionString: process.env.DATABASE_URL }))`
6. Query using the `db` instance
7. Optionally update schema and apply migrations