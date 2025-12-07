## SingleStore Setup Guide

**Prerequisites:**
- dotenv - environment variable management
- tsx - TypeScript file runner
- mysql2 - MySQL client for Node.js

**Overview:**
Drizzle ORM supports SingleStore database via the `mysql2` driver through the `drizzle-orm/singlestore` package.

**Setup Steps:**

1. **Install mysql2 package**
   ```bash
   npm install mysql2
   ```

2. **Setup connection variables**
   Create `.env` file with `DATABASE_URL` variable containing your SingleStore connection string.

3. **Connect Drizzle ORM to the database**
   Import and configure the connection using the `singlestore` driver from `drizzle-orm/singlestore`.

4. **Create a table**
   Define your database schema using Drizzle's table definition API for SingleStore.

5. **Setup Drizzle config file**
   Create `drizzle.config.ts` with dialect set to `'singlestore'` and reference your `DATABASE_URL` environment variable.

6. **Apply changes to the database**
   Run migrations to apply your schema changes to the SingleStore database.

7. **Seed and Query the database**
   Write TypeScript code to insert data and query your SingleStore database using Drizzle ORM.

8. **Run index.ts file**
   Execute your TypeScript file using tsx to test the setup.