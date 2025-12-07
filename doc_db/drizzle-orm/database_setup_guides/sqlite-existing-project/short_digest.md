## Setup Drizzle ORM with SQLite in existing project

1. Install `@libsql/client`
2. Set `DB_FILE_NAME=file:local.db` in `.env`
3. Create `drizzle.config.ts` with SQLite dialect
4. Introspect existing database to generate schema
5. Move schema to your schema file
6. Connect LibSQL client to Drizzle ORM
7. Write and execute queries
8. Run with tsx
9. (Optional) Update schema and apply migrations