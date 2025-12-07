## Setup Drizzle ORM with SQLite in an existing project

This guide covers integrating Drizzle ORM into an existing SQLite database project using LibSQL (a SQLite fork optimized for low latency).

### Prerequisites
- **dotenv** - for managing environment variables
- **tsx** - for running TypeScript files
- **libsql** - SQLite fork optimized for global applications

### Step-by-step setup

1. **Install packages**: Install `@libsql/client`

2. **Setup environment variables**: Create a `.env` file with database connection details
   ```
   DB_FILE_NAME=file:local.db
   ```
   Note: LibSQL requires the `file:` prefix for local SQLite databases

3. **Setup Drizzle config**: Create `drizzle.config.ts` with SQLite dialect and environment variable reference

4. **Introspect existing database**: Run introspection to generate schema from existing SQLite database

5. **Transfer introspected schema**: Move generated schema code to your actual schema file

6. **Connect to database**: Setup LibSQL client connection in your application code

7. **Query the database**: Write and execute queries using the connected Drizzle ORM instance

8. **Run your code**: Execute the TypeScript file using tsx

9. **Update schema (optional)**: Modify table definitions as needed

10. **Apply changes (optional)**: Run migrations to update the database with schema changes

11. **Query with new fields (optional)**: Test queries against updated schema