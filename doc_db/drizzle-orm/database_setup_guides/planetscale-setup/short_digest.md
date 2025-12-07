## PlanetScale Setup

Install `@planetscale/database`, configure `.env` with `DATABASE_HOST`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`, connect Drizzle, create schema, setup config with `dialect: 'mysql'`, apply migrations, seed/query, and run. Uses HTTP-based serverless driver; use MySQL guide for TCP connections.