## Purpose
`drizzle-kit generate` creates SQL migrations from your Drizzle schema definitions. It compares your current schema against previous migration snapshots and generates the necessary SQL to transform the database.

## How it works
1. Reads Drizzle schema file(s) and creates a JSON snapshot
2. Compares snapshot against the most recent migration snapshot
3. Generates SQL migration file based on differences
4. Saves `migration.sql` and `snapshot.json` with a timestamp

Example schema:
```typescript
import * as p from "./drizzle-orm/pg-core";

export const users = p.pgTable("users", {
  id: p.serial().primaryKey(),
  name: p.text(),
  email: p.text().unique(), 
});
```

Generates:
```sql
CREATE TABLE "users" (
 "id" SERIAL PRIMARY KEY,
 "name" TEXT,
 "email" TEXT UNIQUE
);
```

## Configuration
Requires `dialect` and `schema` path options via config file or CLI:

```ts
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
});
```

```shell
npx drizzle-kit generate
```

Or via CLI:
```shell
npx drizzle-kit generate --dialect=postgresql --schema=./src/schema.ts
```

## Schema files
Can use single or multiple schema files with glob patterns:
```ts
schema: "./src/schema.ts"
schema: "./src/**/*.ts"
```

## Custom migration names
```shell
npx drizzle-kit generate --name=init
```
Creates: `0000_init.sql`

## Multiple config files
For different database stages or databases:
```shell
npx drizzle-kit generate --config=drizzle-dev.config.ts
npx drizzle-kit generate --config=drizzle-prod.config.ts
```

## Custom migrations
Generate empty migration files for unsupported DDL or data seeding:
```shell
drizzle-kit generate --custom --name=seed-users
```

Creates empty `0001_seed-users.sql` for manual SQL:
```sql
INSERT INTO "users" ("name") VALUES('Dan');
INSERT INTO "users" ("name") VALUES('Andrew');
```

## CLI options
| Option | Type | Description |
|--------|------|-------------|
| `dialect` | required | Database dialect (postgresql, mysql, sqlite, etc.) |
| `schema` | required | Path to schema file(s) or folder with glob patterns |
| `out` | optional | Migrations output folder, default `./drizzle` |
| `config` | optional | Config file path, default `drizzle.config.ts` |
| `breakpoints` | optional | SQL statement breakpoints, default `true` |
| `custom` | optional | Generate empty SQL for custom migration |
| `name` | optional | Custom migration file name |

## Complete example
Config at `./configs/drizzle.config.ts`:
```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  out: "./migrations",
});
```

Command:
```shell
npx drizzle-kit generate --config=./configs/drizzle.config.ts --name=seed-users --custom
```

Creates: `./migrations/0001_seed-users.sql`

## Integration
Generated migrations can be applied via:
- `drizzle-kit migrate`
- drizzle-orm's `migrate()` function
- External tools like bytebase
- Direct database execution