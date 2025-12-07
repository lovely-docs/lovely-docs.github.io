## Get Started with SQLite

This guide walks through setting up Drizzle ORM with SQLite using the libsql driver.

**Prerequisites:**
- dotenv - for managing environment variables
- tsx - for running TypeScript files
- libsql - a SQLite fork optimized for low query latency

**Setup Steps:**

1. **Install packages**: Install `@libsql/client`

2. **Setup connection variables**: Create a `.env` file with `DB_FILE_NAME`. For local SQLite files, use the format `file:local.db` (the `file:` prefix is required by LibSQL)

3. **Connect to database**: Import libsql client and create a connection instance

4. **Create a table**: Define your schema using Drizzle's table definition API

5. **Setup Drizzle config file**: Create `drizzle.config.ts` with dialect set to `sqlite` and reference the `DB_FILE_NAME` environment variable

6. **Apply migrations**: Run Drizzle migrations to create tables in the database

7. **Seed and query**: Write TypeScript code to insert and query data from the database

8. **Run the file**: Execute your TypeScript file using tsx

Drizzle supports both `libsql` and `better-sqlite3` drivers for SQLite connections. This guide uses libsql, but other connection methods are available in the SQLite Connection documentation.