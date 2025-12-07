## Overview
`drizzle-kit push` applies schema changes directly to the database without generating SQL files. It implements a code-first migration approach by reading your Drizzle schema, comparing it to the database schema, generating SQL migrations, and applying them automatically.

## How It Works
1. Read Drizzle schema file(s) and create a JSON snapshot
2. Introspect current database schema
3. Generate SQL migrations based on differences
4. Apply migrations to the database

## Configuration
Configure via `drizzle.config.ts` or CLI options. Required: `dialect`, `schema` path, and database connection (`url` or `user:password@host:port/db`).

```ts
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  dbCredentials: {
    url: "postgresql://user:password@host:port/dbname",
  },
});
```

```shell
npx drizzle-kit push
```

Or via CLI:
```shell
npx drizzle-kit push --dialect=postgresql --schema=./src/schema.ts --url=postgresql://user:password@host:port/dbname
```

## Schema Files
Use glob patterns for single or multiple schema files:
```ts
schema: "./src/schema.ts"           // single file
schema: "./src/**/*.schema.ts"       // multiple files
```

## Multiple Config Files
Support different database stages or databases:
```shell
npx drizzle-kit push --config=drizzle-dev.config.ts
npx drizzle-kit push --config=drizzle-prod.config.ts
```

## Database Drivers
Drizzle Kit automatically picks the driver based on `dialect`. For exceptions like `aws-data-api`, `pglight`, and `d1-http`, explicitly specify the `driver` parameter.

Note: Expo SQLite and OP SQLite (on-device databases) don't support `push`; use embedded migrations instead.

## Filtering Tables, Schemas, and Extensions
```ts
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  dbCredentials: { url: "..." },
  tablesFilter: ["*"],              // glob-based table filter, default "*"
  schemaFilter: ["public"],          // schema names, default ["public"]
  extensionsFilters: ["postgis"],    // installed extensions to ignore
});
```

## CLI-Only Options
- `--verbose`: Print all SQL statements before execution
- `--strict`: Ask for approval before executing SQL
- `--force`: Auto-accept data-loss statements

```shell
npx drizzle-kit push --strict --verbose --force
```

## All Configuration Options
| Option | Required | Description |
|--------|----------|-------------|
| `dialect` | yes | Database dialect (postgresql, mysql, sqlite, etc.) |
| `schema` | yes | Path to schema file(s) or folder |
| `driver` | | Driver exception (aws-data-api, pglight, d1-http) |
| `tablesFilter` | | Table name filter |
| `schemaFilter` | | Schema names, default `["public"]` |
| `extensionsFilters` | | Database extensions to ignore |
| `url` | | Database connection string |
| `user` | | Database user |
| `password` | | Database password |
| `host` | | Host |
| `port` | | Port |
| `database` | | Database name |
| `config` | | Config file path, default `drizzle.config.ts` |

## Example
```ts
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  dbCredentials: {
    url: "postgresql://user:password@host:port/dbname"
  },
});
```

```ts
// src/schema.ts
import * as p from "drizzle-orm/pg-core";

export const users = p.pgTable("users", {
  id: p.serial().primaryKey(),
  name: p.text(),
})
```

```shell
npx drizzle-kit push
```

Generates and applies:
```sql
CREATE TABLE "users"(
  id serial primary key,
  name text
)
```

## Use Cases
Best for rapid prototyping and production applications. Pairs well with blue/green deployments and serverless databases (Planetscale, Neon, Turso).