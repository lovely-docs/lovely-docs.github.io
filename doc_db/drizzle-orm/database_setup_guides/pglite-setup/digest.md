## Getting Started with PGlite

Step-by-step guide to set up Drizzle ORM with PGlite (ElectricSQL's PostgreSQL implementation).

### Prerequisites
- dotenv - for environment variables
- tsx - for running TypeScript files
- ElectricSQL PGlite driver

### Setup Steps

1. **Install packages**: `npm install drizzle-orm @electric-sql/pglite`

2. **Setup environment variables**: Create `.env` file with `DATABASE_URL` pointing to your PGlite database

3. **Connect to database**: Initialize Drizzle client with PGlite driver
   ```typescript
   import { drizzle } from 'drizzle-orm/pglite';
   import { PGlite } from '@electric-sql/pglite';
   
   const client = new PGlite();
   const db = drizzle(client);
   ```

4. **Create tables**: Define schema using Drizzle table definitions

5. **Setup Drizzle config**: Create `drizzle.config.ts` with PostgreSQL dialect and DATABASE_URL reference

6. **Apply migrations**: Run `drizzle-kit push:pg` to apply schema changes to database

7. **Seed and query**: Write seed scripts and query operations using the Drizzle client

8. **Execute**: Run TypeScript files using tsx runner