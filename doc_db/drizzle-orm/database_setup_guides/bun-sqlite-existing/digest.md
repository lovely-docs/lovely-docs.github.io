## Setup Drizzle ORM with Bun:SQLite in an existing project

**Prerequisites:**
- dotenv - for environment variables
- tsx - for running TypeScript files
- bun - JavaScript all-in-one toolkit
- bun:sqlite - native SQLite3 driver

**Step 1: Install packages**
```bash
npm install drizzle-orm dotenv
npm install -D drizzle-kit tsx @types/bun
```

**Step 2: Setup environment variables**
Create a `.env` file with:
```plaintext
DB_FILE_NAME=mydb.sqlite
```

**Step 3: Setup Drizzle config file**
Create `drizzle.config.ts` with SQLite dialect and reference the `DB_FILE_NAME` environment variable.

**Step 4: Introspect your database**
Run introspection to generate schema from existing SQLite database.

**Step 5: Transfer introspected code to schema file**
Move the generated schema code to your actual schema file.

**Step 6: Connect Drizzle ORM to the database**
Use bun:sqlite to establish connection in your application.

**Step 7: Query the database**
Write queries using the generated schema with bun-sqlite dialect.

**Step 8: Run the script**
```bash
bun src/index.ts
```

**Step 9 (optional): Update table schema**
Modify your schema definitions as needed.

**Step 10 (optional): Apply changes to database**
Run migrations to apply schema changes to the database.

**Step 11 (optional): Query with new fields**
Test queries with newly added schema fields.