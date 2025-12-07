## Xata Setup

Install `drizzle-orm postgres` and `-D drizzle-kit`.

Initialize with `drizzle(process.env.DATABASE_URL)` using `drizzle-orm/postgres-js`, or pass an existing postgres client to `drizzle({ client })`.