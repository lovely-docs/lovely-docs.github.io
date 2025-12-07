## Setup Drizzle ORM with Supabase in an existing project

This guide walks through integrating Drizzle ORM into an existing project that uses Supabase (PostgreSQL).

**Prerequisites:**
- dotenv package for environment variables
- tsx package for running TypeScript files
- Supabase account with a PostgreSQL database

**Steps:**

1. **Install postgres package** - Add the postgres driver for Node.js connections

2. **Setup connection variables** - Create a `.env` file with `DATABASE_URL` pointing to your Supabase PostgreSQL connection string

3. **Setup Drizzle config file** - Create `drizzle.config.ts` with dialect set to `postgresql` and reference the `DATABASE_URL` environment variable

4. **Introspect your database** - Run Drizzle introspection to automatically generate schema definitions from your existing Supabase database tables

5. **Transfer code to schema file** - Move the generated introspection output to your actual schema file (typically `src/schema.ts`)

6. **Connect Drizzle ORM to database** - Create a database connection using the postgres driver and DATABASE_URL

7. **Query the database** - Write and execute queries using Drizzle's query builder with the postgres-js driver

8. **Run index.ts file** - Execute your TypeScript file using tsx to test the connection and queries

9. **Update table schema (optional)** - Modify your schema definitions to add new fields or change existing ones

10. **Apply changes to database (optional)** - Run migrations to sync schema changes to your Supabase database

11. **Query with new fields (optional)** - Test queries that use the newly added schema fields