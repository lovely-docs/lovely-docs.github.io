## Xata Integration Steps

1. Install postgres package
2. Set `DATABASE_URL` in `.env` from Xata connection string
3. Create `drizzle.config.ts` with PostgreSQL dialect
4. Introspect existing database to generate schema
5. Move introspected schema to schema file
6. Connect using postgres-js driver with DATABASE_URL
7. Write and run queries
8. Optionally: update schema, apply migrations, test new fields