## Purpose
`drizzle-kit pull` introspects an existing database schema and generates a TypeScript Drizzle schema file (`schema.ts`). It's designed for database-first migration approaches where the database schema is managed outside the TypeScript project.

## How It Works
1. Pulls database schema (DDL) from an existing database
2. Generates `schema.ts` file with Drizzle schema definitions
3. Saves output to the `out` folder (default: `./drizzle`)

Example flow:
```
Database: CREATE TABLE "users" ("id" SERIAL PRIMARY KEY, "name" TEXT, "email" TEXT UNIQUE);
↓
Generated schema.ts:
import * as p from "drizzle-orm/pg-core";
export const users = p.pgTable("users", {
  id: p.serial().primaryKey(),
  name: p.text(),
  email: p.text().unique(),
});
```

## Configuration
Requires `dialect` and database connection info via config file or CLI:

**Config file approach:**
```ts
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://user:password@host:port/dbname",
  },
});
```
```shell
npx drizzle-kit pull
```

**CLI approach:**
```shell
npx drizzle-kit pull --dialect=postgresql --url=postgresql://user:password@host:port/dbname
```

## Multiple Config Files
Support for multiple configuration files in one project for different database stages:
```shell
npx drizzle-kit pull --config=drizzle-dev.config.ts
npx drizzle-kit pull --config=drizzle-prod.config.ts
```

## Database Driver Specification
Drizzle Kit automatically picks the database driver based on `dialect`. For exceptions like AWS Data API, PGLite, and Cloudflare D1 HTTP, explicitly specify the `driver` param:

```ts
// AWS Data API
export default defineConfig({
  dialect: "postgresql",
  driver: "aws-data-api",
  dbCredentials: {
    database: "database",
    resourceArn: "resourceArn",
    secretArn: "secretArn",
  },
});

// PGLite
export default defineConfig({
  dialect: "postgresql",
  driver: "pglite",
  dbCredentials: {
    url: ":memory:" // or "./database/"
  },
});

// Cloudflare D1 HTTP
export default defineConfig({
  dialect: "sqlite",
  driver: "d1-http",
  dbCredentials: {
    accountId: "accountId",
    databaseId: "databaseId",
    token: "token",
  },
});
```

Note: Expo SQLite and OP SQLite cannot be used with `pull` as they are on-device databases.

## Filtering Tables, Schemas, and Extensions
Configure which tables, schemas, and extensions to manage:

```ts
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  dbCredentials: {
    url: "postgresql://user:password@host:port/dbname",
  },
  extensionsFilters: ["postgis"],
  schemaFilter: ["public"],
  tablesFilter: ["*"],
});
```

| Option | Description |
|--------|-------------|
| `tablesFilter` | Glob-based table names filter, e.g. `["users", "user_info"]` or `"user*"`. Default: `"*"` |
| `schemaFilter` | Schema names filter, e.g. `["public", "drizzle"]`. Default: `["public"]` |
| `extensionsFilters` | List of installed database extensions, e.g. `["postgis"]`. Default: `[]` |

## CLI Options
```shell
npx drizzle-kit pull --dialect=postgresql --url=postgresql://user:password@host:port/dbname
npx drizzle-kit pull --dialect=postgresql --driver=pglite --url=database/
npx drizzle-kit pull --dialect=postgresql --tablesFilter='user*' --extensionsFilters=postgis --url=postgresql://user:password@host:port/dbname
```

| Option | Required | Description |
|--------|----------|-------------|
| `dialect` | Yes | Database dialect (postgresql, mysql, sqlite, etc.) |
| `driver` | No | Driver exceptions (aws-data-api, pglite, d1-http) |
| `out` | No | Migrations output folder path, default: `./drizzle` |
| `url` | No | Database connection string |
| `user` | No | Database user |
| `password` | No | Database password |
| `host` | No | Host |
| `port` | No | Port |
| `database` | No | Database name |
| `config` | No | Configuration file path, default: `drizzle.config.ts` |
| `introspect-casing` | No | Strategy for JS keys creation: `preserve` or `camel` |
| `tablesFilter` | No | Table name filter |
| `schemaFilter` | No | Schema name filter, default: `["public"]` |
| `extensionsFilters` | No | Database extensions internal database filters |