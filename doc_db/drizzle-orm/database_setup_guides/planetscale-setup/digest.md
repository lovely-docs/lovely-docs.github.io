## Getting Started with PlanetScale

This guide walks through setting up Drizzle ORM with PlanetScale MySQL database using the HTTP-based `database-js` driver.

### Prerequisites
- **dotenv** - environment variable management
- **tsx** - TypeScript file execution
- **PlanetScale** - MySQL database platform
- **@planetscale/database** - PlanetScale serverless driver for HTTP connections

### Setup Steps

**Step 1: Install Package**
```bash
npm install @planetscale/database
```

**Step 2: Environment Variables**
Create `.env` file with:
```plaintext
DATABASE_HOST=
DATABASE_USERNAME=
DATABASE_PASSWORD=
```
(Get these from PlanetScale docs for serverless driver setup)

**Step 3: Connect Drizzle to Database**
Use the `@planetscale/database` driver to establish connection (details in ConnectPlanetScale component)

**Step 4: Create Table**
Define your schema (details in CreateTable component)

**Step 5: Setup Drizzle Config**
Create drizzle config file with `dialect: 'mysql'` and `env_variable: 'DATABASE_URL'`

**Step 6: Apply Changes**
Run migrations to apply schema changes to database

**Step 7: Seed and Query**
Populate and query the database (details in QueryPlanetScale component)

**Step 8: Run Application**
Execute the index.ts file

### Important Note
This tutorial uses HTTP calls via `database-js` driver. For TCP connections to PlanetScale, refer to the MySQL setup guide instead.