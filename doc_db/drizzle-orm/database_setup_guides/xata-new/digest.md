## Get Started with Drizzle and Xata

Complete setup guide for using Drizzle ORM with Xata PostgreSQL database.

**Prerequisites:**
- dotenv package for environment variables
- tsx package for running TypeScript files
- Xata Postgres database account

**Setup Steps:**

1. **Install postgres package** - Add the postgres driver package to your project

2. **Setup connection variables** - Create a `.env` file with `DATABASE_URL` containing your Xata connection string (obtainable from Xata documentation)

3. **Connect Drizzle ORM to database** - Initialize Drizzle connection using the postgres driver and DATABASE_URL

4. **Create a table** - Define your database schema using Drizzle table definitions

5. **Setup Drizzle config file** - Create `drizzle.config.ts` with:
   - dialect: 'postgresql'
   - database URL from environment variable

6. **Apply changes to database** - Run migrations to create tables in your Xata database

7. **Seed and Query database** - Write TypeScript code to insert and query data using Drizzle ORM with postgres-js driver

8. **Run index.ts file** - Execute your TypeScript file using tsx to test the setup

The guide follows a linear progression from installation through basic database operations, with each step building on the previous one.