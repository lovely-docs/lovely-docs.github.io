## Purpose
`drizzle-kit export` generates and outputs SQL DDL representation of a Drizzle schema to the console. It's designed for the codebase-first approach to migrations and allows external tools like Atlas to handle migrations.

## How it works
1. Reads Drizzle schema file(s) and creates a JSON snapshot
2. Generates SQL DDL statements based on the schema
3. Outputs SQL DDL to console

## Configuration
Requires `dialect` and `schema` options via config file or CLI:

**Config file approach:**
```ts
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
});
```
```shell
npx drizzle-kit export
```

**CLI approach:**
```shell
npx drizzle-kit export --dialect=postgresql --schema=./src/schema.ts
```

## Schema paths
- Can use single or multiple schema files
- Specify paths using glob patterns via `schema` option
- Example: `"./src/schema/**/*.ts"` matches all TypeScript files in schema directory

## Multiple config files
Support for multiple config files in one project for different database stages:
```shell
npx drizzle-kit export --config=drizzle-dev.config.ts
npx drizzle-kit export --config=drizzle-prod.config.ts
```

## CLI options
- `--sql`: Generate SQL representation (default output format)
- `--config`: Path to config file (default: `drizzle.config.ts`)

## Required parameters
| Option | Type | Description |
|--------|------|-------------|
| `dialect` | required | Database dialect (postgresql, mysql, sqlite, etc.) |
| `schema` | required | Path to schema file(s) or folder with glob patterns |
| `config` | optional | Config file path |

## Example
Schema file at `./src/schema.ts`:
```ts
import { pgTable, serial, text } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	email: text('email').notNull(),
	name: text('name')
});
```

Config at `./configs/drizzle.config.ts`:
```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
});
```

Run:
```shell
npx drizzle-kit export --config=./configs/drizzle.config.ts
```

Output:
```sql
CREATE TABLE "users" (
        "id" serial PRIMARY KEY NOT NULL,
        "email" text NOT NULL,
        "name" text
);
```