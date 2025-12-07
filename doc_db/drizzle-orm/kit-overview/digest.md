## Drizzle Kit Overview

Drizzle Kit is a CLI tool for managing SQL database migrations with Drizzle ORM.

### Installation
```
npm install -D drizzle-kit
```

### Core Commands

- **drizzle-kit generate** - Generate SQL migration files based on your Drizzle schema (initial or subsequent changes)
- **drizzle-kit migrate** - Apply generated SQL migration files to your database
- **drizzle-kit push** - Push your Drizzle schema directly to database (without generating migration files)
- **drizzle-kit pull** - Introspect database schema, convert to Drizzle schema, save to codebase
- **drizzle-kit studio** - Connect to database and spin up proxy server for Drizzle Studio for database browsing
- **drizzle-kit check** - Walk through all generated migrations and check for race conditions/collisions
- **drizzle-kit up** - Upgrade snapshots of previously generated migrations

### Configuration

Drizzle Kit is configured via `drizzle.config.ts` file. Minimum required: `dialect` and `schema` path.

Simple config:
```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
});
```

Extended config with all options:
```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  dialect: "postgresql",
  schema: "./src/schema.ts",
  driver: "pglite",
  dbCredentials: {
    url: "./database/",
  },
  extensionsFilters: ["postgis"],
  schemaFilter: "public",
  tablesFilter: "*",
  introspect: {
    casing: "camel",
  },
  migrations: {
    prefix: "timestamp",
    table: "__drizzle_migrations__",
    schema: "public",
  },
  breakpoints: true,
  strict: true,
  verbose: true,
});
```

### Multiple Configurations

Provide config path via CLI for different database stages:
```
drizzle-kit push --config=drizzle-dev.config.ts
drizzle-kit push --config=drizzle-prod.config.ts
```

Project structure example:
```
📦 <project root>
 ├ 📂 drizzle
 ├ 📂 src
 ├ 📜 .env
 ├ 📜 drizzle-dev.config.ts
 ├ 📜 drizzle-prod.config.ts
 ├ 📜 package.json
 └ 📜 tsconfig.json
```