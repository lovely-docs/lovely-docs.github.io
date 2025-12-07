## Get Started with PGLite in Existing Project

Setup guide for integrating Drizzle ORM with PGLite in an existing project.

### Prerequisites
- **dotenv** - environment variable management
- **tsx** - TypeScript file runner
- **ElectricSQL** - PGLite provider
- **pglite driver** - PostgreSQL in-process database

### Setup Steps

1. **Install packages**
   ```bash
   npm install drizzle-orm @electric-sql/pglite
   npm install -D drizzle-kit
   ```

2. **Setup environment variables**
   - Create `.env` file with `DATABASE_URL` pointing to your PGLite database

3. **Create Drizzle config** (`drizzle.config.ts`)
   ```typescript
   import { defineConfig } from 'drizzle-kit';
   
   export default defineConfig({
     schema: './src/schema.ts',
     dialect: 'postgresql',
     dbCredentials: {
       url: process.env.DATABASE_URL!,
     },
   });
   ```

4. **Introspect existing database**
   ```bash
   npx drizzle-kit introspect
   ```
   This generates schema from existing PGLite database

5. **Transfer introspected schema** to your actual schema file (`src/schema.ts`)

6. **Connect to database** in your application
   ```typescript
   import { drizzle } from 'drizzle-orm/pglite';
   import { PGLite } from '@electric-sql/pglite';
   
   const client = new PGLite(process.env.DATABASE_URL);
   const db = drizzle(client);
   ```

7. **Query the database**
   ```typescript
   const users = await db.select().from(usersTable);
   ```

8. **Run your application** with `tsx index.ts`

9. **Update schema** (optional) - modify table definitions in schema file

10. **Apply changes** (optional) - generate and run migrations
    ```bash
    npx drizzle-kit generate
    npx drizzle-kit migrate
    ```

11. **Query with new fields** (optional) - use updated schema in queries