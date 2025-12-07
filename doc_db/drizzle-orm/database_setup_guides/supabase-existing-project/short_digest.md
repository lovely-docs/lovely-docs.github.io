## Setup Drizzle with Supabase in existing project

1. Install postgres package
2. Set `DATABASE_URL` environment variable with Supabase connection string
3. Create `drizzle.config.ts` with `dialect: 'postgresql'`
4. Run introspection to generate schema from existing database
5. Move generated schema to your schema file
6. Connect using postgres driver and DATABASE_URL
7. Write and execute queries with Drizzle
8. Run with tsx
9-11. Optionally update schema, apply migrations, and test new fields