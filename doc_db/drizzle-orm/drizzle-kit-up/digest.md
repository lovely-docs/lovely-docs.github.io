## Purpose
`drizzle-kit up` upgrades drizzle schema snapshots to a newer version when breaking changes are introduced to JSON snapshots and internal versions change.

## Configuration
The command requires `dialect` and database connection credentials, provided via `drizzle.config.ts` or CLI options.

**With config file:**
```ts
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
});
```
```shell
npx drizzle-kit up
```

**As CLI options:**
```shell
npx drizzle-kit up --dialect=postgresql
```

## Multiple Configuration Files
Support for multiple config files in one project for different database stages:
```shell
npx drizzle-kit up --config=drizzle-dev.config.ts
npx drizzle-kit up --config=drizzle-prod.config.ts
```

## CLI Options
| Option | Required | Description |
|--------|----------|-------------|
| `dialect` | yes | Database dialect: `postgresql`, `mysql`, or `sqlite` |
| `out` | no | Migrations folder, default: `./drizzle` |
| `config` | no | Config file path, default: `drizzle.config.ts` |

**Examples:**
```shell
npx drizzle-kit up --dialect=postgresql
npx drizzle-kit up --dialect=postgresql --out=./migrations-folder
```