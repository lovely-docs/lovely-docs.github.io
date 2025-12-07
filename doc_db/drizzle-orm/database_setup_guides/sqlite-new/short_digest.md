## SQLite Setup with libsql

1. Install `@libsql/client`
2. Set `DB_FILE_NAME=file:local.db` in `.env`
3. Connect Drizzle to database using libsql client
4. Define tables in schema
5. Create `drizzle.config.ts` with `dialect: 'sqlite'`
6. Run migrations with Drizzle CLI
7. Query database with TypeScript
8. Execute with tsx

Supports both libsql and better-sqlite3 drivers.