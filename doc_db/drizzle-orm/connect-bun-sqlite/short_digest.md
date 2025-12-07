## Bun SQLite Setup

Install `drizzle-orm` and `drizzle-kit`. Initialize with `drizzle()` from `'drizzle-orm/bun-sqlite'`, optionally passing a `Database` client. Use async queries with `await db.select().from(...)` or sync methods: `.all()`, `.get()`, `.values()`, `.run()`.