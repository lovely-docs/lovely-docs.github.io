## Vercel Postgres Setup

Install `drizzle-orm @vercel/postgres` and `-D drizzle-kit`.

Initialize with `drizzle()` or `drizzle({ client: sql })` from `@vercel/postgres`.

Works in serverless environments via websockets; serverful environments can use direct `postgresql://` connections with `postgres` or `pg` drivers.