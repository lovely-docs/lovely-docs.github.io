## Setup Drizzle with Bun and PostgreSQL

Install `drizzle-orm`, `drizzle-kit`, `@types/bun`. Set `DATABASE_URL` env var. Connect via Bun SQL bindings, define schema, configure drizzle.config.ts with dialect 'postgresql', apply migrations, write queries with 'bun-sql' dialect, run with `bun src/index.ts`. Note: Bun v1.2.0 has concurrent statement issues.