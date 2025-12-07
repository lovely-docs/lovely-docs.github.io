## Get Started with MySQL in Existing Project

Step-by-step guide to integrate Drizzle ORM into an existing MySQL project.

**Prerequisites:**
- dotenv - for managing environment variables
- tsx - for running TypeScript files
- mysql2 - for querying MySQL database

**Setup Steps:**

1. **Install mysql2 package** - Required driver for MySQL connections

2. **Setup connection variables** - Create DATABASE_URL environment variable with your MySQL connection string

3. **Setup Drizzle config file** - Create drizzle.config.ts with dialect set to 'mysql' and reference DATABASE_URL

4. **Introspect your database** - Run introspection to automatically generate schema from existing database tables

5. **Transfer code to schema file** - Move the generated introspection code to your actual schema file

6. **Connect Drizzle ORM to database** - Initialize database connection in your application code using mysql2 driver

7. **Query the database** - Execute queries using the connected Drizzle instance with mysql2 dialect

8. **Run index.ts file** - Execute your TypeScript file using tsx

9. **Update table schema (optional)** - Modify your schema definitions as needed

10. **Apply changes to database (optional)** - Run migrations to update your database with schema changes

11. **Query with new fields (optional)** - Test queries against updated schema with new fields