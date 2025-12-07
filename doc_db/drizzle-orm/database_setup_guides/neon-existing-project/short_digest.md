## Setup Drizzle with Neon in existing project

1. Install `@neondatabase/serverless`
2. Set `DATABASE_URL` environment variable
3. Create drizzle.config.ts with PostgreSQL dialect
4. Introspect existing database to generate schema
5. Connect with: `drizzle(new Client(process.env.DATABASE_URL))`
6. Query database, optionally update schema and apply migrations