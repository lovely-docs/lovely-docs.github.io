## PostgreSQL Setup with node-postgres

Step-by-step guide to set up Drizzle ORM with PostgreSQL using the node-postgres driver.

**Prerequisites:**
- dotenv - for managing environment variables
- tsx - for running TypeScript files
- node-postgres - for querying PostgreSQL database

**Setup Steps:**

1. **Install node-postgres package**
   ```bash
   npm install pg
   npm install -D @types/pg
   ```

2. **Setup connection variables**
   Create a `.env` file with:
   ```
   DATABASE_URL=your_postgresql_connection_string
   ```

3. **Connect Drizzle ORM to the database**
   Create a connection file that initializes the Drizzle client with node-postgres driver.

4. **Create a table**
   Define your database schema using Drizzle's table definition API.

5. **Setup Drizzle config file**
   Create a `drizzle.config.ts` file with:
   - dialect: 'postgresql'
   - database URL from environment variable

6. **Apply changes to the database**
   Run migrations to apply schema changes to your PostgreSQL database.

7. **Seed and Query the database**
   Write TypeScript code to insert data and query the database using Drizzle ORM.

8. **Run the TypeScript file**
   Execute your index.ts file using tsx to test the setup.

**Note:** Drizzle supports both node-postgres and postgres.js drivers for PostgreSQL connections. If you don't have a PostgreSQL database yet, you can set one up in Docker using the provided guide.