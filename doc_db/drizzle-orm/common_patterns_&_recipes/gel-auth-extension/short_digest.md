**Setup Gel auth with Drizzle:**

1. Define User type with `ext::auth::Identity` in `dbschema/default.esdl`
2. Run `gel migration create` and `gel migration apply`
3. Create `drizzle.config.ts` with `dialect: 'gel'` and `schemaFilter: ['ext::auth', 'public']`
4. Run `drizzle-kit pull` to generate TypeScript schema with Identity and User tables from `ext::auth`