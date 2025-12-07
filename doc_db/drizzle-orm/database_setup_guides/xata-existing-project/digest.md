## Get Started with Xata in Existing Project

This guide walks through integrating Drizzle ORM with an existing Xata PostgreSQL database.

**Prerequisites:**
- dotenv package for environment variables
- tsx package for running TypeScript files
- Xata Postgres database

**Setup Steps:**

1. **Install postgres package** - Add the postgres driver package to your project

2. **Setup connection variables** - Create a `.env` file with `DATABASE_URL` containing your Xata connection string (obtainable from Xata documentation)

3. **Setup Drizzle config file** - Create `drizzle.config.ts` with PostgreSQL dialect and DATABASE_URL environment variable reference

4. **Introspect your database** - Run introspection to generate schema from existing database tables

5. **Transfer code to schema file** - Move the introspected schema code to your actual schema file

6. **Connect Drizzle ORM to database** - Set up database connection using postgres-js driver with DATABASE_URL

7. **Query the database** - Write and execute queries against your database using the connected Drizzle instance

8. **Run index.ts file** - Execute your TypeScript file with tsx

9. **Update table schema (optional)** - Modify your schema definitions as needed

10. **Apply changes to database (optional)** - Run migrations to sync schema changes to the database

11. **Query with new fields (optional)** - Test queries using newly added schema fields