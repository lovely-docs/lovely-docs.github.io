## MySQL Integration into Existing Project

Install mysql2, set DATABASE_URL env variable, create drizzle.config.ts with mysql dialect, introspect existing database to auto-generate schema, transfer generated code to schema file, connect via mysql2 driver, query database, optionally update schema and apply migrations.