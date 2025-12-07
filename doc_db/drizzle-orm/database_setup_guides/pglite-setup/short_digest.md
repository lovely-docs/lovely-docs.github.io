## PGlite Setup

Install `@electric-sql/pglite`, set `DATABASE_URL` env var, connect with `drizzle(new PGlite())`, define schema, configure `drizzle.config.ts` with PostgreSQL dialect, run migrations with `drizzle-kit push:pg`, then seed/query using the client.