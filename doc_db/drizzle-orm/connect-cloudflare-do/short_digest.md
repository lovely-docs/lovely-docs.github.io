## Cloudflare Durable Objects SQLite

Install `drizzle-orm` and `drizzle-kit`. Configure `wrangler.toml` with Durable Object bindings and migrations. Initialize with `drizzle(storage)` in DurableObject constructor, run migrations in `blockConcurrencyWhile()`. Bundle database operations in single DO calls for performance.