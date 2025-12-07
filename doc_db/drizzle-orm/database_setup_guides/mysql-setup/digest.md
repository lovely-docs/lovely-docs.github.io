## Getting Started with MySQL

This is a step-by-step guide to set up Drizzle ORM with a MySQL database using the `mysql2` driver.

### Prerequisites
- **dotenv** - for managing environment variables
- **tsx** - for running TypeScript files
- **mysql2** - MySQL client for Node.js focused on performance

### Setup Steps

**Step 1: Install mysql2 package**
```bash
npm install mysql2
```

**Step 2: Setup connection variables**
Create a `.env` file with your database connection URL:
```
DATABASE_URL=mysql://user:password@localhost:3306/database_name
```

**Step 3: Connect Drizzle ORM to the database**
Use the `drizzle-orm/mysql2` package to establish a connection. Drizzle ORM natively supports `mysql2`.

**Step 4: Create a table**
Define your database schema using Drizzle's table definition API.

**Step 5: Setup Drizzle config file**
Create a `drizzle.config.ts` file with dialect set to `mysql` and reference your `DATABASE_URL` environment variable.

**Step 6: Apply changes to the database**
Run migrations to apply your schema changes to the database.

**Step 7: Seed and Query the database**
Write TypeScript code to insert data and query your MySQL database using Drizzle ORM.

**Step 8: Run index.ts file**
Execute your TypeScript file using tsx to test your setup.

### Additional Notes
- If you don't have a MySQL database yet, you can set one up using Docker (guide available in documentation)
- The `mysql2` driver is the recommended driver for MySQL with Drizzle ORM