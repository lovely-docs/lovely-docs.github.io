## Setup Drizzle ORM with Neon in an existing project

This guide walks through integrating Drizzle ORM with Neon (serverless Postgres) into an existing project.

**Prerequisites:**
- dotenv - for managing environment variables
- tsx - for running TypeScript files
- Neon account - serverless Postgres platform

**Steps:**

1. **Install @neondatabase/serverless package** - the Neon driver for Drizzle

2. **Setup connection variables** - Add `DATABASE_URL` environment variable pointing to your Neon database

3. **Setup Drizzle config file** - Create drizzle.config.ts with PostgreSQL dialect and DATABASE_URL reference

4. **Introspect your database** - Use Drizzle's introspection to generate schema from existing database tables

5. **Transfer code to schema file** - Move the introspected schema to your actual schema file

6. **Connect Drizzle ORM to database** - Initialize Drizzle client with Neon HTTP driver:
```typescript
import { drizzle } from 'drizzle-orm/neon-http';
import { Client } from '@neondatabase/serverless';

const client = new Client(process.env.DATABASE_URL);
const db = drizzle(client);
```

7. **Query the database** - Execute queries using the initialized db instance

8. **Run index.ts file** - Execute your TypeScript file with tsx

9. **Update table schema (optional)** - Modify schema definitions as needed

10. **Apply changes to database (optional)** - Use migrations to update the database

11. **Query with new fields (optional)** - Test queries against updated schema