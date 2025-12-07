## SingleStore Setup

Install `mysql2`, set `DATABASE_URL` env var, connect via `drizzle-orm/singlestore`, define schema, create `drizzle.config.ts` with `dialect: 'singlestore'`, apply migrations, seed/query database, run with tsx.