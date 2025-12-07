## Overview
`drizzle-kit push` applies schema changes directly to the database without generating SQL files using a code-first approach.

## Configuration
```ts
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  dbCredentials: { url: "postgresql://user:password@host:port/dbname" },
});
```

```shell
npx drizzle-kit push
```

Or CLI: `npx drizzle-kit push --dialect=postgresql --schema=./src/schema.ts --url=...`

## Key Options
- `schema`: Path/glob to schema file(s) (required)
- `dialect`: Database type (required)
- `driver`: For exceptions like aws-data-api, pglight, d1-http
- `tablesFilter`, `schemaFilter`, `extensionsFilters`: Filter what to manage
- `--verbose`, `--strict`, `--force`: CLI-only options

## Multiple Configs
```shell
npx drizzle-kit push --config=drizzle-dev.config.ts
npx drizzle-kit push --config=drizzle-prod.config.ts
```

## Example
```ts
// src/schema.ts
import * as p from "drizzle-orm/pg-core";
export const users = p.pgTable("users", {
  id: p.serial().primaryKey(),
  name: p.text(),
})
```

Generates and applies: `CREATE TABLE "users"(id serial primary key, name text)`

Note: Expo SQLite and OP SQLite don't support push; use embedded migrations instead.