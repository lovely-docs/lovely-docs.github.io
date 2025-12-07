## Setup Drizzle ORM with PostgreSQL in an existing project

This guide walks through integrating Drizzle ORM into an existing PostgreSQL project.

### Prerequisites
- **dotenv** - for managing environment variables
- **tsx** - for running TypeScript files
- **node-postgres** - for querying PostgreSQL

### Steps

1. **Install node-postgres package**
   ```bash
   npm install pg
   npm install -D @types/pg
   ```

2. **Setup connection variables**
   - Create `.env` file with `DATABASE_URL` variable containing your PostgreSQL connection string
   - If you don't have a PostgreSQL database yet, set one up in Docker (guide available in docs)

3. **Setup Drizzle config file**
   - Create `drizzle.config.ts` with dialect set to `postgresql` and reference the `DATABASE_URL` environment variable

4. **Introspect your database**
   - Run introspection command to automatically generate schema definitions from your existing database structure

5. **Transfer code to schema file**
   - Move the generated introspection code to your actual schema file

6. **Connect Drizzle ORM to the database**
   ```typescript
   import { drizzle } from 'drizzle-orm/node-postgres';
   import { Client } from 'pg';
   
   const client = new Client({
     connectionString: process.env.DATABASE_URL,
   });
   
   await client.connect();
   const db = drizzle(client);
   ```

7. **Query the database**
   - Use the `db` instance to execute queries against your PostgreSQL database

8. **Run index.ts file**
   - Execute your TypeScript file using tsx

9. **Update table schema (optional)**
   - Modify your schema definitions as needed

10. **Apply changes to database (optional)**
    - Run migrations to apply schema changes to your database

11. **Query with new fields (optional)**
    - Update queries to use newly added schema fields