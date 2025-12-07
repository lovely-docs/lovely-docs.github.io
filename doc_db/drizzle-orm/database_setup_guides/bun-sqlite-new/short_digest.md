## Setup Drizzle with Bun SQLite

Install `drizzle-orm`, `drizzle-kit`, and `@types/bun`. Set `DB_FILE_NAME` env variable. Connect via bun:sqlite, define tables, configure drizzle.config.ts with sqlite dialect, apply migrations, then query with `bun src/index.ts`.