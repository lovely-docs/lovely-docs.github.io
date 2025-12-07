## Purpose
`drizzle-kit check` validates consistency of generated SQL migrations history. Essential for teams with multiple developers working on different branches altering the database schema.

## Configuration
Requires `dialect` and database connection credentials via `drizzle.config.ts` or CLI options.

**With config file:**
```ts
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "postgresql",
});
```
```shell
npx drizzle-kit check
```

**As CLI options:**
```shell
npx drizzle-kit check --dialect=postgresql
```

## Multiple Configuration Files
Support for multiple config files in one project for different database stages:
```plaintext
📦 <project root>
 ├ 📂 drizzle
 ├ 📂 src
 ├ 📜 .env
 ├ 📜 drizzle-dev.config.ts
 ├ 📜 drizzle-prod.config.ts
 ├ 📜 package.json
 └ 📜 tsconfig.json
```
```shell
npx drizzle-kit check --config=drizzle-dev.config.ts
npx drizzle-kit check --config=drizzle-prod.config.ts
```

## CLI Options
| Option | Required | Description |
|--------|----------|-------------|
| `dialect` | yes | Database dialect: `postgresql`, `mysql`, or `sqlite` |
| `out` | no | Migrations folder, default: `./drizzle` |
| `config` | no | Config file path, default: `drizzle.config.ts` |

**Examples:**
```shell
npx drizzle-kit check --dialect=postgresql
npx drizzle-kit check --dialect=postgresql --out=./migrations-folder
```