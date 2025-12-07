## Breaking Changes

**Dialect prefix removal**: Remove `:dialect` from drizzle-kit commands. Change `drizzle-kit push:mysql` to `drizzle-kit push`.

**drizzle.config.ts updates**:
- `dialect` is now mandatory: `"postgresql"`, `"mysql"`, or `"sqlite"`
- `driver` is optional, only use if: `aws-data-api`, `turso`, `d1-http` (WIP), or `expo`
- Replace `connectionString` or `uri` with `url` in `dbCredentials`
- New `migrations` object for custom table/schema:
  ```ts
  import { defineConfig } from "drizzle-kit"
  export default defineConfig({
    dialect: "sqlite",
    driver: "turso",
    dbCredentials: { url: "" },
    migrations: { table: "migrations", schema: "public" }
  })
  ```

**Snapshot upgrade**: PostgreSQL and SQLite snapshots upgrade to version 6. Run `drizzle-kit up` to upgrade.

**Driver auto-selection** (when no driver specified):
- PostgreSQL: tries `pg` → `postgres` → `@vercel/postgres` → `@neondatabase/serverless`
- MySQL: tries `mysql2` → `@planetscale/database`
- SQLite: tries `@libsql/client` → `better-sqlite3`

**MySQL schemas removed**: Drizzle Kit no longer handles schema changes for additional schemas/databases.

## New Features

**Pull relations**: Drizzle extracts foreign key information and generates `relations.ts` during introspection.

**Custom migration names**: Use `drizzle-kit generate --name init_db`

**New migrate command**: `drizzle-kit migrate` applies generated migrations directly. By default stores in `__drizzle_migrations` table (PostgreSQL: `drizzle` schema). Customize via `drizzle.config.ts`:
```ts
export default defineConfig({
  migrations: { table: "migrations", schema: "public" }
})
```