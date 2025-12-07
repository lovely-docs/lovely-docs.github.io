## Get Started with Drizzle and TiDB in Existing Project

This guide walks through integrating Drizzle ORM with TiDB in an existing project.

**Prerequisites:**
- dotenv - for managing environment variables
- tsx - for running TypeScript files
- TiDB - The Distributed SQL Database by PingCAP
- serverless-js - for serverless and edge compute platforms with HTTP external connections

**Setup Steps:**

1. Install `@tidbcloud/serverless` package
2. Setup connection variables in `.env` file with `DATABASE_URL`
3. Setup Drizzle config file with `mysql` dialect and `DATABASE_URL` environment variable
4. Introspect your existing TiDB database to generate schema
5. Transfer introspected code to your actual schema file
6. Connect Drizzle ORM to the database using the serverless connection
7. Query the database using Drizzle with `tidb-serverless` dialect and `DATABASE_URL`
8. Run the index.ts file to execute queries
9. (Optional) Update your table schema
10. (Optional) Apply schema changes to the database
11. (Optional) Query the database with new fields

The guide covers both initial setup and optional schema modifications for existing TiDB databases.