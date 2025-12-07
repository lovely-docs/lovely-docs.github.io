## Purpose
`drizzle-kit generate` creates SQL migrations from Drizzle schema by comparing current schema against previous snapshots.

## Basic usage
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

Or via CLI: `npx drizzle-kit generate --dialect=postgresql --schema=./src/schema.ts`

## Key options
- `schema`: Path(s) to schema files (supports glob patterns)
- `out`: Output folder for migrations (default: `./drizzle`)
- `name`: Custom migration name
- `custom`: Generate empty migration for manual SQL
- `config`: Config file path (default: `drizzle.config.ts`)
- `dialect`: Database type (required)

## Examples
Custom migration name:
```shell
npx drizzle-kit generate --name=init
```

Custom migration for data seeding:
```shell
npx drizzle-kit generate --custom --name=seed-users
```

Multiple config files for different databases:
```shell
npx drizzle-kit generate --config=drizzle-dev.config.ts
npx drizzle-kit generate --config=drizzle-prod.config.ts
```

Generated migrations can be applied via `drizzle-kit migrate`, drizzle-orm's `migrate()`, or external tools.