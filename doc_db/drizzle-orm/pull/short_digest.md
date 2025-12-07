## Overview
`drizzle-kit pull` introspects an existing database and generates a TypeScript Drizzle schema file for database-first approaches.

## Basic Usage
```ts
// drizzle.config.ts
export default defineConfig({
  dialect: "postgresql",
  dbCredentials: { url: "postgresql://user:password@host:port/dbname" },
});
```
```shell
npx drizzle-kit pull
```

Or via CLI:
```shell
npx drizzle-kit pull --dialect=postgresql --url=postgresql://user:password@host:port/dbname
```

## Multiple Configs & Drivers
```shell
npx drizzle-kit pull --config=drizzle-dev.config.ts
npx drizzle-kit pull --config=drizzle-prod.config.ts
```

For special drivers (AWS Data API, PGLite, D1 HTTP), specify explicitly:
```ts
export default defineConfig({
  dialect: "postgresql",
  driver: "pglite",
  dbCredentials: { url: ":memory:" },
});
```

## Filtering
```ts
export default defineConfig({
  dialect: "postgresql",
  dbCredentials: { url: "..." },
  tablesFilter: ["*"],
  schemaFilter: ["public"],
  extensionsFilters: ["postgis"],
});
```

## Key Options
- `dialect` (required): Database type
- `driver`: For aws-data-api, pglite, d1-http
- `out`: Output folder (default: `./drizzle`)
- `introspect-casing`: `preserve` or `camel` for JS key naming
- `tablesFilter`, `schemaFilter`, `extensionsFilters`: Control what gets introspected