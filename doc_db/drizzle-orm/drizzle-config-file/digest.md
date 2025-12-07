## Configuration File Setup

Drizzle Kit uses TypeScript or JavaScript configuration files (`drizzle.config.ts` or `drizzle.config.js`) to declare options. Use `defineConfig()` from `drizzle-kit`.

```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  out: "./drizzle",
});
```

## Core Configuration Options

### `dialect`
Database type: `postgresql`, `mysql`, `sqlite`, `turso`, `singlestore`
```ts
export default defineConfig({
  dialect: "mysql",
});
```

### `schema`
Glob-based path to schema file(s) or folder(s). Type: `string | string[]`
```ts
export default defineConfig({
  schema: "./src/schema.ts",
  // or
  schema: "./src/schema/*",
});
```

### `out`
Output folder for SQL migrations, JSON snapshots, and generated schema. Default: `drizzle`. Type: `string | string[]`
```ts
export default defineConfig({
  out: "./drizzle",
});
```

### `driver`
Explicitly pick database driver for vendor-specific databases. Drizzle Kit auto-detects from `dialect` by default. Type: varies by database (e.g., `pglite`, `d1-http`, `aws-data-api`)

### `dbCredentials`
Database connection credentials. Format varies by driver:

**PostgreSQL:**
```ts
export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    url: "postgres://user:password@host:port/db",
    // or
    host: "host", port: 5432, user: "user", password: "password", 
    database: "dbname", ssl: true,
  }
});
```

**MySQL:**
```ts
export default defineConfig({
  dialect: "mysql",
  dbCredentials: {
    url: "mysql://user:password@host:port/db",
    // or
    host: "host", port: 5432, user: "user", password: "password", 
    database: "dbname", ssl: "...",
  }
});
```

**SQLite:**
```ts
export default defineConfig({
  dialect: "sqlite",
  dbCredentials: {
    url: ":memory:", // or "sqlite.db" or "file:sqlite.db"
  }
});
```

**Turso:**
```ts
export default defineConfig({
  dialect: "turso",
  dbCredentials: {
    url: "libsql://acme.turso.io",
    authToken: "...",
  }
});
```

**Cloudflare D1:**
```ts
export default defineConfig({
  dialect: "sqlite",
  driver: "d1-http",
  dbCredentials: { accountId: "", databaseId: "", token: "" }
});
```

**AWS Data API:**
```ts
export default defineConfig({
  dialect: "postgresql",
  driver: "aws-data-api",
  dbCredentials: { database: "database", resourceArn: "resourceArn", secretArn: "secretArn" }
});
```

**PGLite:**
```ts
export default defineConfig({
  dialect: "postgresql",
  driver: "pglite",
  dbCredentials: { url: "./database/" }
});
```

### `migrations`
Configure migrations log table and schema (PostgreSQL only). Default: `{ table: "__drizzle_migrations", schema: "drizzle" }`
```ts
export default defineConfig({
  migrations: {
    table: 'my-migrations-table',
    schema: 'public',
  },
});
```

### `introspect`
Configuration for `drizzle-kit pull` command. `casing` controls column key casing: `"preserve"` or `"camel"` (default).
```ts
export default defineConfig({
  introspect: {
    casing: "camel",
  },
});
```

With `camel`: `first-name` column becomes `firstName` key. With `preserve`: keeps original casing.

### `tablesFilter`
Glob-based filter for table names. Type: `string | string[]`. Used by `push` and `pull` commands.
```ts
export default defineConfig({
  tablesFilter: ["users", "posts", "project1_*"],
});
```

### `schemaFilter`
List of schemas to manage. Default: `["public"]`. PostgreSQL only.
```ts
export default defineConfig({
  schemaFilter: ["public", "schema1", "schema2"],
});
```

### `extensionsFilters`
List of database extensions to ignore (e.g., `postgis` creates its own tables). Default: `[]`
```ts
export default defineConfig({
  extensionsFilters: ["postgis"],
});
```

### `entities.roles`
Manage database roles. Type: `boolean | { provider: "neon" | "supabase", include: string[], exclude: string[] }`. Default: `false`

Enable role management:
```ts
export default defineConfig({
  entities: { roles: true }
});
```

Exclude specific roles:
```ts
export default defineConfig({
  entities: { roles: { exclude: ['admin'] } }
});
```

Include specific roles:
```ts
export default defineConfig({
  entities: { roles: { include: ['admin'] } }
});
```

Use provider presets (excludes provider-managed roles):
```ts
export default defineConfig({
  entities: { roles: { provider: 'neon' } }
});
```

Combine options:
```ts
export default defineConfig({
  entities: { roles: { provider: 'supabase', exclude: ['new_supabase_role'] } }
});
```

### `strict`
Prompt confirmation before running SQL statements in `push` command. Default: `false`. Type: `boolean`
```ts
export default defineConfig({
  strict: true,
});
```

### `verbose`
Print all SQL statements during `push` and `pull` commands. Default: `true`. Type: `boolean`
```ts
export default defineConfig({
  verbose: false,
});
```

### `breakpoints`
Embed `--> statement-breakpoint` in generated migrations (required for MySQL and SQLite which don't support multiple DDL statements in one transaction). Default: `true`. Type: `boolean`
```ts
export default defineConfig({
  breakpoints: false,
});
```

## Multiple Configuration Files

Use `--config` flag to specify different config files for different database stages:
```
drizzle-kit generate --config=drizzle-dev.config.ts
drizzle-kit generate --config=drizzle-prod.config.ts
```

## Migration Folder Structure

The `out` folder contains `.sql` migration files and `_meta` folder (used by drizzle-kit):
```
📦 project
 ├ 📂 drizzle
 │ ├ 📂 _meta
 │ ├ 📜 migration1.sql
 │ └ 📜 migration2.sql
 ├ 📂 src
 ├ 📜 drizzle.config.ts
 └ 📜 package.json
```