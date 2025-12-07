## Drizzle Kit CLI Tool

CLI for managing SQL migrations. Install with `npm install -D drizzle-kit`.

**Commands:** generate (create migrations), migrate (apply migrations), push (sync schema to DB), pull (introspect DB), studio (browse DB), check (validate migrations), up (upgrade snapshots).

**Configuration** via `drizzle.config.ts`:
```ts
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  out: "./drizzle",
  // optional: driver, dbCredentials, introspect, migrations, etc.
});
```

Support multiple configs: `drizzle-kit push --config=drizzle-prod.config.ts`