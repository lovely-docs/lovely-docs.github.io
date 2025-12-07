## Setup Drizzle ORM with SingleStore in an existing project

**Prerequisites:**
- dotenv - for managing environment variables
- tsx - for running TypeScript files
- mysql2 - for querying SingleStore database

**Step-by-step setup:**

1. Install the `mysql2` package
2. Setup connection variables in `.env` file with `DATABASE_URL`
3. Setup Drizzle config file with dialect set to 'singlestore' and reference to `DATABASE_URL`
4. Introspect your existing SingleStore database to auto-generate schema
5. Transfer the introspected code to your actual schema file
6. Connect Drizzle ORM to the database using the mysql2 driver
7. Query the database using Drizzle ORM
8. Run your TypeScript file with tsx
9. (Optional) Update your table schema
10. (Optional) Apply schema changes to the database
11. (Optional) Query the database with new fields

The workflow focuses on connecting to an existing database, introspecting it to generate schema definitions, and then using those schemas to query the database.