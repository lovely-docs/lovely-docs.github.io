**Bun SQL Integration**

Install `drizzle-orm` and `drizzle-kit`. Initialize with `drizzle(process.env.DATABASE_URL)` or pass an existing `new SQL()` client to `drizzle({ client })`. Supports PostgreSQL via Bun's native bindings.