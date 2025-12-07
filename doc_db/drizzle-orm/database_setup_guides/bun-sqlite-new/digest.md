## Setup Drizzle ORM with Bun and SQLite

**Prerequisites:**
- bun - JavaScript all-in-one toolkit
- bun:sqlite - native high-performance SQLite3 driver

**Step 1 - Install packages:**
```bash
npm install drizzle-orm
npm install -D drizzle-kit @types/bun
```

**Step 2 - Setup connection variables:**
Create environment variable `DB_FILE_NAME` with value like `mydb.sqlite`

**Step 3 - Connect to database:**
Use bun:sqlite to establish connection to the database file

**Step 4 - Create a table:**
Define schema using Drizzle ORM table definitions

**Step 5 - Setup Drizzle config file:**
Configure drizzle.config.ts with dialect set to 'sqlite' and reference the DB_FILE_NAME environment variable

**Step 6 - Apply changes:**
Run migrations to apply schema changes to the database

**Step 7 - Seed and Query:**
Write queries using Drizzle ORM to insert and retrieve data from the database

**Step 8 - Run the script:**
```bash
bun src/index.ts
```