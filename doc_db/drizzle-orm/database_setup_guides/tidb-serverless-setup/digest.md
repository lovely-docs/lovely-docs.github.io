## Getting Started with TiDB Serverless

This guide walks through setting up Drizzle ORM with TiDB using the serverless HTTP driver.

### Prerequisites
- **dotenv** - environment variable management
- **tsx** - TypeScript file execution
- **TiDB** - PingCAP's distributed SQL database
- **@tidbcloud/serverless** - HTTP-based serverless driver for TiDB

### Setup Steps

1. **Install the serverless driver**
   ```bash
   npm install @tidbcloud/serverless
   ```

2. **Configure environment variables**
   - Set `DATABASE_URL` with your TiDB connection string

3. **Connect Drizzle to TiDB**
   - Import and initialize the serverless driver
   - Create a Drizzle instance with the driver

4. **Define database schema**
   - Create tables using Drizzle's schema definition

5. **Setup Drizzle config file**
   - Configure with `dialect: 'mysql'` and `DATABASE_URL` environment variable

6. **Apply migrations**
   - Run migrations to sync schema with database

7. **Seed and query the database**
   - Use the Drizzle instance to insert and query data with `tidb-serverless` dialect

8. **Execute the application**
   - Run the index.ts file using tsx

### Important Note
This tutorial uses HTTP calls via `@tidbcloud/serverless`. For TCP connections to TiDB, refer to the MySQL setup guide instead.