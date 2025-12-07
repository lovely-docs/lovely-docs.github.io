

## Pages

### bun-sql-existing
Integrate Drizzle ORM with Bun SQL in existing PostgreSQL project: install packages, set DATABASE_URL env var, introspect schema, configure drizzle.config.ts, connect with drizzle(sql), query with db.query, run with bun CLI

## Setup Drizzle ORM with Bun SQL in an existing project

**Prerequisites:**
- dotenv for environment variables
- Bun JavaScript toolkit
- Bun SQL native bindings for PostgreSQL

**Known Issue:** Bun v1.2.0 has concurrent statement execution issues that may cause errors when running multiple queries simultaneously.

**Installation:**
```bash
npm install drizzle-orm dotenv
npm install -D drizzle-kit @types/bun
```

**Setup Steps:**

1. Create `.env` file with `DATABASE_URL` variable pointing to your PostgreSQL database

2. Create `drizzle.config.ts`:
```typescript
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

3. Introspect existing database to generate schema:
```bash
drizzle-kit introspect:pg
```

4. Transfer generated schema to your actual schema file

5. Connect to database in `src/index.ts`:
```typescript
import { drizzle } from 'drizzle-orm/bun';
import { sql } from 'bun:sql';

const db = drizzle(sql);
```

6. Query the database:
```typescript
const result = await db.query.users.findMany();
```

7. Run with Bun:
```bash
bun src/index.ts
```

8. (Optional) Update table schema and apply migrations with `drizzle-kit push:pg`

9. (Optional) Query with new fields after schema updates

### get-started-bun-sql
Step-by-step guide to integrate Drizzle ORM with Bun and PostgreSQL using Bun:SQL native bindings; includes installation, environment setup, schema definition, migrations, and query execution with `bun src/index.ts`.

## Setup Drizzle ORM with Bun and PostgreSQL via Bun:SQL

**Prerequisites:**
- Bun JavaScript toolkit
- Bun SQL native bindings for PostgreSQL

**⚠️ Known Issue:** Bun v1.2.0 has concurrent statement execution issues; track the fix on GitHub issue oven-sh/bun#16774

**Installation:**
```bash
npm install drizzle-orm
npm install -D drizzle-kit @types/bun
```

**Setup Steps:**

1. **Environment variables:** Set `DATABASE_URL` with your PostgreSQL connection string

2. **Connect to database:** Use Bun's SQL bindings with Drizzle ORM (details in ConnectBun component)

3. **Create table:** Define schema using Drizzle (details in CreateTable component)

4. **Configure Drizzle:** Create drizzle.config.ts with dialect set to 'postgresql' and DATABASE_URL environment variable

5. **Apply migrations:** Run migrations to sync schema with database

6. **Seed and query:** Write queries using Drizzle ORM with 'bun-sql' dialect

7. **Execute:** Run TypeScript file with `bun src/index.ts`

### bun-sqlite-existing
Setup Drizzle ORM with Bun:SQLite for existing project: install packages, configure env/drizzle.config.ts, introspect database, connect via bun:sqlite, query with generated schema, run via bun CLI.

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

### bun-sqlite-new
Step-by-step setup for Drizzle ORM with Bun and SQLite: install packages, configure DB_FILE_NAME env var, connect to database, define schema, setup drizzle.config.ts, apply migrations, seed/query data, run with bun.

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

### d1-new
8-step setup for Drizzle with Cloudflare D1: configure wrangler.toml with D1 binding, connect via drizzle(env.DB), define schema, setup drizzle.config.ts with d1-http driver and Cloudflare credentials, apply migrations, query with db.select().from(table).all().

## Getting Started with Cloudflare D1

Setup guide for using Drizzle ORM with Cloudflare D1 serverless SQL database.

**Prerequisites:**
- dotenv - environment variable management
- tsx - TypeScript file runner
- Cloudflare D1 - serverless SQL database
- wrangler - Cloudflare CLI

**Step 1: Install packages**
Install drizzle-orm and required dependencies.

**Step 2: Configure wrangler.toml**
```toml
name = "YOUR PROJECT NAME"
main = "src/index.ts"
compatibility_date = "2022-11-07"
node_compat = true

[[ d1_databases ]]
binding = "DB"
database_name = "YOUR DB NAME"
database_id = "YOUR DB ID"
migrations_dir = "drizzle"
```

**Step 3: Connect to database**
```typescript
import { drizzle } from 'drizzle-orm/d1';

export interface Env {
  <BINDING_NAME>: D1Database;
}
export default {
  async fetch(request: Request, env: Env) {
    const db = drizzle(env.<BINDING_NAME>);
  },
};
```

**Step 4: Create a table**
Define your schema (referenced from separate component).

**Step 5: Setup drizzle.config.ts**
```typescript
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
    databaseId: process.env.CLOUDFLARE_DATABASE_ID!,
    token: process.env.CLOUDFLARE_D1_TOKEN!,
  },
});
```

**Step 6: Apply migrations**
Run migrations to update database schema.

**Step 7: Query the database**
```typescript
const db = drizzle(env.<BINDING_NAME>);
const result = await db.select().from(users).all()
return Response.json(result);
```

**Step 8: Run the application**
Execute the index.ts file.

### sqlite-durable-objects-setup
Setup Drizzle ORM with SQLite Durable Objects on Cloudflare Workers: install packages, configure wrangler.toml with DO binding and migrations, create MyDurableObject extending DurableObject with drizzle instance, setup drizzle.config.ts with durable-sqlite driver, generate migrations with drizzle-kit, apply migrations in DO constructor using ctx.blockConcurrencyWhile(), expose insert/select methods, call from Worker fetch handler via DO stub.

## Setup Drizzle ORM with SQLite Durable Objects on Cloudflare Workers

**Prerequisites:**
- dotenv - environment variable management
- tsx - TypeScript file runner
- Cloudflare SQLite Durable Objects - embedded SQLite in Durable Objects
- wrangler - Cloudflare CLI

**Step 1: Install packages**
```bash
npm install drizzle-orm dotenv
npm install -D drizzle-kit wrangler @cloudflare/workers-types
```

**Step 2: Configure wrangler.toml**
```toml
name = "sqlite-durable-objects"
main = "src/index.ts"
compatibility_date = "2024-11-12"
compatibility_flags = [ "nodejs_compat" ]

[[durable_objects.bindings]]
name = "MY_DURABLE_OBJECT"
class_name = "MyDurableObject"

[[migrations]]
tag = "v1"
new_sqlite_classes = ["MyDurableObject"]

[[rules]] 
type = "Text"
globs = ["**/*.sql"]
fallthrough = true
```

**Step 3: Connect Drizzle to database**
```ts
import { drizzle, type DrizzleSqliteDODatabase } from 'drizzle-orm/durable-sqlite';
import { DurableObject } from 'cloudflare:workers'

export class MyDurableObject extends DurableObject {
	storage: DurableObjectStorage;
	db: DrizzleSqliteDODatabase;

	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);
		this.storage = ctx.storage;
		this.db = drizzle(this.storage, { logger: false });
	}
}
```

**Step 4: Generate wrangler types**
```bash
npx wrangler types
```
Outputs `worker-configuration.d.ts`.

**Step 5: Create table schema** (referenced from separate component)

**Step 6: Setup drizzle.config.ts**
```ts
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'sqlite',
  driver: 'durable-sqlite',
});
```

**Step 7: Generate and apply migrations**
```bash
npx drizzle-kit generate
```

Add migration support to MyDurableObject:
```ts
import { migrate } from 'drizzle-orm/durable-sqlite/migrator';
import migrations from '../drizzle/migrations';

export class MyDurableObject extends DurableObject {
	// ... previous code ...
	
	async migrate() {
		migrate(this.db, migrations);
	}
}
```

**Step 8: Complete example with queries**
```ts
import { drizzle, DrizzleSqliteDODatabase } from 'drizzle-orm/durable-sqlite';
import { DurableObject } from 'cloudflare:workers'
import { migrate } from 'drizzle-orm/durable-sqlite/migrator';
import migrations from '../drizzle/migrations';
import { usersTable } from './db/schema';

export class MyDurableObject extends DurableObject {
	storage: DurableObjectStorage;
	db: DrizzleSqliteDODatabase<any>;

	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);
		this.storage = ctx.storage;
		this.db = drizzle(this.storage, { logger: false });
		ctx.blockConcurrencyWhile(async () => {
			await this._migrate();
		});
	}

	async insertAndList(user: typeof usersTable.$inferInsert) {
		await this.insert(user);
		return this.select();
	}

	async insert(user: typeof usersTable.$inferInsert) {
		await this.db.insert(usersTable).values(user);
	}

	async select() {
		return this.db.select().from(usersTable);
	}

	async _migrate() {
		migrate(this.db, migrations);
	}
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const id: DurableObjectId = env.MY_DURABLE_OBJECT.idFromName('durable-object');
		const stub = env.MY_DURABLE_OBJECT.get(id);

		// Option A: Bundle all DB interactions in single DO call for performance
		const usersAll = await stub.insertAndList({
			name: 'John',
			age: 30,
			email: 'john@example.com',
		});
		console.log('New user created. All users: ', usersAll);

		// Option B: Individual queries (slower, each is a round-trip)
		await stub.insert({
			name: 'Jane',
			age: 28,
			email: 'jane@example.com',
		});
		const users = await stub.select();
		console.log('All users: ', users);

		return Response.json(users);
	}
}
```

**Key points:**
- Migrations must be applied from within Cloudflare Workers, not locally
- Use `ctx.blockConcurrencyWhile()` to ensure migrations complete before accepting queries
- Bundle multiple DB operations in single Durable Object call for performance (Option A)
- Individual query calls create round-trips to the DO instance (Option B)

### expo-sqlite-setup
Setup Drizzle ORM with Expo SQLite: install packages, define schema, configure metro/babel, initialize db connection, apply migrations, perform CRUD operations.

## Getting Started with Expo SQLite

Setup Drizzle ORM with Expo SQLite for React Native applications.

### Prerequisites
- Expo SQLite library for database access via SQLite API

### Project Setup

1. Create Expo project with TypeScript template:
```bash
npx create-expo-app --template blank-typescript
```

2. Install Expo SQLite:
```bash
npx expo install expo-sqlite
```

3. Install Drizzle packages:
```bash
npm install drizzle-orm
npm install -D drizzle-kit
```

### Database Configuration

Create `db/schema.ts` with table definitions:
```typescript
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users_table", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  age: int().notNull(),
  email: text().notNull().unique(),
});
```

Create `drizzle.config.ts`:
```typescript
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'sqlite',
  driver: 'expo',
  schema: './db/schema.ts',
  out: './drizzle',
});
```

### Metro and Babel Configuration

Create `metro.config.js`:
```javascript
const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);
config.resolver.sourceExts.push('sql');
module.exports = config;
```

Update `babel.config.js`:
```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [["inline-import", { "extensions": [".sql"] }]]
  };
};
```

### Database Connection and Migrations

Initialize database in `App.tsx`:
```typescript
import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';

const expo = SQLite.openDatabaseSync('db.db');
const db = drizzle(expo);
```

Generate migrations:
```bash
npx drizzle-kit generate
```

### Complete Example with CRUD Operations

```typescript
import { Text, View } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { usersTable } from './db/schema';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from './drizzle/migrations';

const expo = SQLite.openDatabaseSync('db.db');
const db = drizzle(expo);

export default function App() {
  const { success, error } = useMigrations(db, migrations);
  const [items, setItems] = useState<typeof usersTable.$inferSelect[] | null>(null);

  useEffect(() => {
    if (!success) return;

    (async () => {
      // Delete all users
      await db.delete(usersTable);

      // Insert user
      await db.insert(usersTable).values([
        {
          name: 'John',
          age: 30,
          email: 'john@example.com',
        },
      ]);

      // Query users
      const users = await db.select().from(usersTable);
      setItems(users);
    })();
  }, [success]);

  if (error) {
    return <View><Text>Migration error: {error.message}</Text></View>;
  }

  if (!success) {
    return <View><Text>Migration in progress...</Text></View>;
  }

  if (items === null || items.length === 0) {
    return <View><Text>Empty</Text></View>;
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {items.map((item) => (
        <Text key={item.id}>{item.email}</Text>
      ))}
    </View>
  );
}
```

### Running the App

```bash
npx expo run:ios
# or: yarn expo run:ios, pnpm expo run:ios, bun expo run:ios
```

### Project Structure
```
📦 project root
 ├ 📂 drizzle (migrations and snapshots)
 ├ 📂 db
 │  └ 📜 schema.ts
 ├ 📜 drizzle.config.ts
 ├ 📜 metro.config.js
 ├ 📜 babel.config.js
 ├ 📜 App.tsx
 └ 📜 package.json
```

### gel-existing-project
Setup Drizzle ORM with Gel database: install packages, configure dialect, pull schema, initialize client with createClient(), perform CRUD operations.

## Getting Started with Gel in an Existing Project

Drizzle ORM has native support for Gel database connections via the `gel` client.

### Installation
Install required packages:
```bash
npm install drizzle-orm gel
npm install -D drizzle-kit tsx
```

### Configuration
Create `drizzle.config.ts`:
```typescript
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'gel',
});
```

### Schema Setup
Pull your Gel database schema into Drizzle:
```bash
npx drizzle-kit pull
```

This generates a schema file like:
```typescript
import { gelTable, uniqueIndex, uuid, smallint, text } from "drizzle-orm/gel-core"
import { sql } from "drizzle-orm"

export const users = gelTable("users", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	age: smallint(),
	email: text().notNull(),
	name: text(),
}, (table) => [
	uniqueIndex("a8c6061c-f37f-11ef-9249-0d78f6c1807b;schemaconstr").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
]);
```

### Database Connection
Create `src/index.ts` and initialize the Gel client:
```typescript
import { drizzle } from "drizzle-orm/gel";
import { createClient } from "gel";

const gelClient = createClient();
const db = drizzle({ client: gelClient });
```

### Database Operations
```typescript
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/gel";
import { createClient } from "gel";
import { users } from "../drizzle/schema";

const gelClient = createClient();
const db = drizzle({ client: gelClient });

async function main() {
  // Insert
  const user = { name: "John", age: 30, email: "john@example.com" };
  await db.insert(users).values(user);

  // Select
  const usersResponse = await db.select().from(users);

  // Update
  await db.update(users).set({ age: 31 }).where(eq(users.email, user.email));

  // Delete
  await db.delete(users).where(eq(users.email, user.email));
}

main();
```

Run with `tsx src/index.ts`.

### getting_started_with_gel
Step-by-step setup for Drizzle ORM with Gel database: initialize project, define schema, apply migrations, install packages, configure drizzle-kit, pull types, and execute CRUD operations via drizzle client.

## Setup and Installation

Initialize a Gel project and define a basic schema in `dbschema/default.esdl`:
```esdl
module default {
    type user {
        name: str;
        required email: str;
        age: int16;
    }
}
```

Create and apply migrations:
```bash
gel migration create
gel migration apply
```

Install packages:
```bash
npm install drizzle-orm gel
npm install -D drizzle-kit tsx
```

## Configuration

Create `drizzle.config.ts`:
```typescript
import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  dialect: 'gel',
});
```

Pull the database schema to generate Drizzle types:
```bash
npx drizzle-kit pull
```

This generates `drizzle/schema.ts` with table definitions like:
```typescript
import { gelTable, uuid, smallint, text } from "drizzle-orm/gel-core"
import { sql } from "drizzle-orm"

export const users = gelTable("users", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	age: smallint(),
	email: text().notNull(),
	name: text(),
});
```

## Database Connection and Queries

Create `src/index.ts`:
```typescript
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/gel";
import { createClient } from "gel";
import { users } from "../drizzle/schema";

const gelClient = createClient();
const db = drizzle({ client: gelClient });

async function main() {
  // Insert
  const user = { name: "John", age: 30, email: "john@example.com" };
  await db.insert(users).values(user);

  // Select
  const allUsers = await db.select().from(users);
  console.log(allUsers);

  // Update
  await db.update(users).set({ age: 31 }).where(eq(users.email, user.email));

  // Delete
  await db.delete(users).where(eq(users.email, user.email));
}

main();
```

Run with `tsx src/index.ts`.

### mysql-existing-project
11-step guide to integrate Drizzle ORM with existing MySQL database: install mysql2, configure DATABASE_URL and drizzle.config.ts, introspect schema, connect, query, and optionally update schema with migrations.

## Get Started with MySQL in Existing Project

Step-by-step guide to integrate Drizzle ORM into an existing MySQL project.

**Prerequisites:**
- dotenv - for managing environment variables
- tsx - for running TypeScript files
- mysql2 - for querying MySQL database

**Setup Steps:**

1. **Install mysql2 package** - Required driver for MySQL connections

2. **Setup connection variables** - Create DATABASE_URL environment variable with your MySQL connection string

3. **Setup Drizzle config file** - Create drizzle.config.ts with dialect set to 'mysql' and reference DATABASE_URL

4. **Introspect your database** - Run introspection to automatically generate schema from existing database tables

5. **Transfer code to schema file** - Move the generated introspection code to your actual schema file

6. **Connect Drizzle ORM to database** - Initialize database connection in your application code using mysql2 driver

7. **Query the database** - Execute queries using the connected Drizzle instance with mysql2 dialect

8. **Run index.ts file** - Execute your TypeScript file using tsx

9. **Update table schema (optional)** - Modify your schema definitions as needed

10. **Apply changes to database (optional)** - Run migrations to update your database with schema changes

11. **Query with new fields (optional)** - Test queries against updated schema with new fields

### mysql-setup
Step-by-step guide to set up Drizzle ORM with MySQL using mysql2 driver: install mysql2, configure DATABASE_URL env var, connect via drizzle-orm/mysql2, define schema, create drizzle.config.ts with mysql dialect, apply migrations, seed/query database with TypeScript.

## Getting Started with MySQL

This is a step-by-step guide to set up Drizzle ORM with a MySQL database using the `mysql2` driver.

### Prerequisites
- **dotenv** - for managing environment variables
- **tsx** - for running TypeScript files
- **mysql2** - MySQL client for Node.js focused on performance

### Setup Steps

**Step 1: Install mysql2 package**
```bash
npm install mysql2
```

**Step 2: Setup connection variables**
Create a `.env` file with your database connection URL:
```
DATABASE_URL=mysql://user:password@localhost:3306/database_name
```

**Step 3: Connect Drizzle ORM to the database**
Use the `drizzle-orm/mysql2` package to establish a connection. Drizzle ORM natively supports `mysql2`.

**Step 4: Create a table**
Define your database schema using Drizzle's table definition API.

**Step 5: Setup Drizzle config file**
Create a `drizzle.config.ts` file with dialect set to `mysql` and reference your `DATABASE_URL` environment variable.

**Step 6: Apply changes to the database**
Run migrations to apply your schema changes to the database.

**Step 7: Seed and Query the database**
Write TypeScript code to insert data and query your MySQL database using Drizzle ORM.

**Step 8: Run index.ts file**
Execute your TypeScript file using tsx to test your setup.

### Additional Notes
- If you don't have a MySQL database yet, you can set one up using Docker (guide available in documentation)
- The `mysql2` driver is the recommended driver for MySQL with Drizzle ORM

### neon-existing-project
11-step guide to integrate Drizzle ORM with Neon serverless Postgres into existing project: install @neondatabase/serverless, configure DATABASE_URL env var, setup drizzle.config.ts, introspect existing schema, connect via drizzle(new Client(url)), query database, optionally update schema and apply migrations.

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

### neon-setup
Setup Drizzle with Neon serverless Postgres: install @neondatabase/serverless, configure DATABASE_URL, choose neon-http (single queries) or neon-websockets (sessions), define schema, apply migrations, query with tsx.

## Getting Started with Neon

Drizzle ORM provides native support for Neon (serverless Postgres platform) through two drivers:

- **neon-http**: HTTP-based driver, faster for single non-interactive transactions
- **neon-websockets**: WebSocket-based driver with session and interactive transaction support

### Prerequisites
- dotenv package for environment variables
- tsx package for running TypeScript files
- Neon account and serverless Postgres platform access

### Setup Steps

1. **Install the Neon serverless package**
   ```bash
   npm install @neondatabase/serverless
   ```

2. **Configure environment variables**
   - Set `DATABASE_URL` with your Neon connection string

3. **Connect Drizzle to Neon**
   - Use the neon-http or neon-websockets driver to establish connection

4. **Create tables**
   - Define your schema using Drizzle ORM table definitions

5. **Setup Drizzle config file**
   - Configure with `postgresql` dialect and `DATABASE_URL` environment variable

6. **Apply migrations**
   - Run migrations to apply schema changes to the database

7. **Seed and query the database**
   - Use neon-http driver for database operations

8. **Execute your code**
   - Run the index.ts file with tsx

### Key Advantages
- Access Neon database from serverless environments over HTTP/WebSockets instead of TCP
- HTTP queries are faster for single, non-interactive transactions
- WebSocket driver provides full session and interactive transaction support
- Drop-in replacement for pg driver available via neon-serverless

### nile-existing-project
Setup Drizzle with Nile PostgreSQL: install pg, set NILEDB_URL env var, create config, run `drizzle-kit pull` to introspect and generate schema/migrations, connect and query; update schema by modifying schema.ts and running `drizzle-kit generate`.

## Setup Drizzle ORM with Nile in an existing project

Prerequisites: dotenv, tsx, Nile (PostgreSQL re-engineered for multi-tenant apps)

**Step 1-3: Installation and Configuration**
- Install `pg` package and `@types/pg` dev dependency
- Set `NILEDB_URL` environment variable
- Create drizzle config file with `postgresql` dialect pointing to `NILEDB_URL`

**Step 4: Introspect Database**
Run `npx drizzle-kit pull` to generate schema from existing database. This creates:
- `schema.ts` file with table definitions
- `meta` folder with schema snapshots
- SQL migration file
- `relations.ts` file for relational queries

Example database table:
```sql
CREATE TABLE IF NOT EXISTS "todos" (
  "id" uuid DEFAULT gen_random_uuid(),
  "tenant_id" uuid,
  "title" varchar(256),
  "estimate" varchar(256),
  "embedding" vector(3),
  "complete" boolean
);
```

Generated schema includes Nile's built-in tables (e.g., `tenants`):
```typescript
import { pgTable, uuid, text, timestamp, varchar, vector, boolean } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const tenants = pgTable("tenants", {
	id: uuid().default(sql`public.uuid_generate_v7()`).primaryKey().notNull(),
	name: text(),
	created: timestamp({ mode: 'string' }).default(sql`LOCALTIMESTAMP`).notNull(),
	updated: timestamp({ mode: 'string' }).default(sql`LOCALTIMESTAMP`).notNull(),
	deleted: timestamp({ mode: 'string' }),
});

export const todos = pgTable("todos", {
	id: uuid().defaultRandom(),
	tenantId: uuid("tenant_id"),
	title: varchar({ length: 256 }),
	estimate: varchar({ length: 256 }),
	embedding: vector({ dimensions: 3 }),
	complete: boolean(),
});
```

**Step 5-7: Connect and Query**
- Transfer generated schema to actual schema file
- Connect Drizzle ORM to database using Nile connection
- Write and execute queries

**Step 9-11: Schema Updates (Optional)**
Add new columns to schema file:
```typescript
export const todos = pgTable("todos", {
	// ... existing fields
  deadline: timestamp({ mode: 'string' })
});
```

Run `npx drizzle-kit generate` to create migration, then apply changes to database. Re-run queries to see new fields (populated as null for existing records).

### nile-setup
Step-by-step setup for Drizzle with Nile (multi-tenant PostgreSQL): install pg, configure NILEDB_URL, define tenant-aware schema with tenants and tenant_id-keyed tables, configure drizzle.config.ts, run migrations, seed/query data.

## Getting Started with Nile (PostgreSQL for Multi-Tenant Apps)

This guide walks through setting up Drizzle ORM with Nile, a PostgreSQL database re-engineered for multi-tenant applications.

### Prerequisites
- **dotenv** - for managing environment variables
- **tsx** - for running TypeScript files
- **Nile** - PostgreSQL re-engineered for multi-tenant apps

### Installation & Setup

**Step 1: Install postgres package**
```bash
npm install pg
npm install -D @types/pg
```

**Step 2: Setup connection variables**
Create a `.env` file with `NILEDB_URL` environment variable containing your Nile database connection string.

**Step 3: Connect Drizzle ORM to the database**
Create a database connection using the postgres driver with the Nile connection URL.

**Step 4: Create schema with tenant-aware tables**
```typescript
import { pgTable, uuid, text, timestamp, varchar, vector, boolean } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const tenantsTable = pgTable("tenants", {
	id: uuid().default(sql`public.uuid_generate_v7()`).primaryKey().notNull(),
	name: text(),
	created: timestamp({ mode: 'string' }).default(sql`LOCALTIMESTAMP`).notNull(),
	updated: timestamp({ mode: 'string' }).default(sql`LOCALTIMESTAMP`).notNull(),
	deleted: timestamp({ mode: 'string' }),
});

export const todos = pgTable("todos", {
	id: uuid().defaultRandom(),
	tenantId: uuid("tenant_id"),
	title: varchar({ length: 256 }),
	estimate: varchar({ length: 256 }),
	embedding: vector({ dimensions: 3 }),
	complete: boolean(),
});
```

Key pattern: Nile schemas include a tenants table and tenant-aware tables with `tenant_id` columns for multi-tenant isolation.

**Step 5: Setup Drizzle config file**
Create `drizzle.config.ts` with PostgreSQL dialect and `NILEDB_URL` environment variable reference.

**Step 6: Apply changes to database**
Run migrations to create tables in Nile.

**Step 7: Seed and query the database**
Insert and retrieve data using Drizzle ORM queries.

**Step 8: Run the application**
Execute the TypeScript file using tsx.

### op-sqlite_setup_guide
Step-by-step setup for Drizzle ORM with OP-SQLite in Expo: create project, install packages, initialize db connection, define schema, configure drizzle/metro/babel, generate migrations, apply migrations with useMigrations hook, run queries, and execute app.

## Getting Started with OP-SQLite

OP-SQLite is a SQLite library for React Native. This guide covers setting up Drizzle ORM with OP-SQLite in an Expo project.

### Prerequisites
- OP-SQLite library installed

### Setup Steps

**1. Create Expo project:**
```bash
npx create-expo-app --template blank-typescript
```

**2. Install packages:**
```bash
npm install drizzle-orm @op-engineering/op-sqlite
npm install -D drizzle-kit
```

**3. Initialize database connection in App.tsx:**
```ts
import { open } from '@op-engineering/op-sqlite';
import { drizzle } from 'drizzle-orm/op-sqlite';

const opsqliteDb = open({ name: 'db' });
const db = drizzle(opsqliteDb);
```

**4. Define schema in db/schema.ts:**
```typescript
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users_table", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  age: int().notNull(),
  email: text().notNull().unique(),
});
```

**5. Create drizzle.config.ts:**
```ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'sqlite',
  driver: 'expo',
  schema: './db/schema.ts',
  out: './drizzle',
});
```

**6. Configure metro.config.js:**
```js
const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);
config.resolver.sourceExts.push('sql');
module.exports = config;
```

**7. Update babel.config.js:**
```js
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [["inline-import", { "extensions": [".sql"] }]]
  };
};
```

**8. Generate migrations:**
```bash
npx drizzle-kit generate
```

**9. Apply migrations and query database in App.tsx:**
```ts
import { Text, View } from 'react-native';
import { open } from '@op-engineering/op-sqlite';
import { useEffect, useState } from 'react';
import { drizzle } from 'drizzle-orm/op-sqlite';
import { usersTable } from './db/schema';
import { useMigrations } from 'drizzle-orm/op-sqlite/migrator';
import migrations from './drizzle/migrations';

const opsqliteDb = open({ name: 'db' });
const db = drizzle(opsqliteDb);

export default function App() {
  const { success, error } = useMigrations(db, migrations);
  const [items, setItems] = useState<typeof usersTable.$inferSelect[] | null>(null);

  useEffect(() => {
    if (!success) return;
    (async () => {
      await db.delete(usersTable);
      await db.insert(usersTable).values([
        { name: 'John', age: 30, email: 'john@example.com' }
      ]);
      const users = await db.select().from(usersTable);
      setItems(users);
    })();
  }, [success]);

  if (error) return <View><Text>Migration error: {error.message}</Text></View>;
  if (!success) return <View><Text>Migration in progress...</Text></View>;
  if (!items?.length) return <View><Text>Empty</Text></View>;

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {items.map((item) => <Text key={item.id}>{item.email}</Text>)}
    </View>
  );
}
```

**10. Run the app:**
```bash
npx expo run:ios  # or yarn/pnpm/bun
```

### Project Structure
```
📦 project
 ├ 📂 drizzle (migrations)
 ├ 📂 db
 │  └ 📜 schema.ts
 ├ 📜 App.tsx
 ├ 📜 drizzle.config.ts
 ├ 📜 metro.config.js
 ├ 📜 babel.config.js
 └ 📜 package.json
```

### pglite-existing-project
Setup Drizzle ORM with PGLite in existing project: install packages, configure with PostgreSQL dialect, introspect existing database, connect via PGLite client, query with Drizzle API.

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

### pglite-setup
8-step setup guide for Drizzle ORM with PGlite: install packages, set DATABASE_URL, initialize PGlite client with drizzle(), define schema, configure drizzle.config.ts (PostgreSQL), apply migrations, seed/query database.

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

### planetscale-existing-project
Integrate Drizzle with PlanetScale MySQL via HTTP driver: install @planetscale/database, configure with host/username/password, introspect existing schema, perform CRUD with drizzle-orm/planetscale-serverless.

## Setup Drizzle ORM with PlanetScale in an existing project

This guide covers integrating Drizzle ORM with PlanetScale (MySQL database platform) using the `database-js` HTTP driver for serverless connections.

### Prerequisites
- dotenv for environment variables
- tsx for running TypeScript files
- PlanetScale account and database
- @planetscale/database driver (HTTP-based, not TCP)

### Setup Steps

1. **Install package**: `npm install @planetscale/database`

2. **Environment variables**: Set `DATABASE_URL` in `.env` file

3. **Drizzle config**: Create `drizzle.config.ts` with MySQL dialect and DATABASE_URL reference

4. **Introspect database**: Run `drizzle-kit introspect:mysql` to generate schema from existing database

5. **Transfer schema**: Move generated schema to your actual schema file

6. **Connect to database**:
```typescript
import { drizzle } from 'drizzle-orm/planetscale-serverless';

const db = drizzle({ 
  connection: {
    host: process.env.DATABASE_HOST!,
    username: process.env.DATABASE_USERNAME!,
    password: process.env.DATABASE_PASSWORD!,
  }
});
```

7. **Query database**: Execute SELECT, INSERT, UPDATE, DELETE operations

### Example: Full CRUD Operations
```typescript
import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/planetscale-serverless';
import { usersTable } from './db/schema';

const db = drizzle({ 
  connection: {
    host: process.env.DATABASE_HOST!,
    username: process.env.DATABASE_USERNAME!,
    password: process.env.DATABASE_PASSWORD!,
  }
});

// INSERT
const user = { name: 'John', age: 30, email: 'john@example.com', phone: '123-456-7890' };
await db.insert(usersTable).values(user);

// SELECT
const users = await db.select().from(usersTable);

// UPDATE
await db.update(usersTable).set({ age: 31 }).where(eq(usersTable.email, user.email));

// DELETE
await db.delete(usersTable).where(eq(usersTable.email, user.email));
```

### Optional Steps
- Update table schema with new fields
- Apply schema changes to database
- Query with new fields

### planetscale-setup
Setup Drizzle with PlanetScale MySQL via HTTP driver: install @planetscale/database, configure credentials in .env, connect, define schema, setup mysql config, apply migrations, seed/query database.

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

### postgresql-existing-project
11-step guide to integrate Drizzle ORM into existing PostgreSQL project: install pg, configure DATABASE_URL, introspect existing schema, connect via node-postgres Client, query database, optionally update schema and apply migrations.

## Setup Drizzle ORM with PostgreSQL in an existing project

This guide walks through integrating Drizzle ORM into an existing PostgreSQL project.

### Prerequisites
- **dotenv** - for managing environment variables
- **tsx** - for running TypeScript files
- **node-postgres** - for querying PostgreSQL

### Steps

1. **Install node-postgres package**
   ```bash
   npm install pg
   npm install -D @types/pg
   ```

2. **Setup connection variables**
   - Create `.env` file with `DATABASE_URL` variable containing your PostgreSQL connection string
   - If you don't have a PostgreSQL database yet, set one up in Docker (guide available in docs)

3. **Setup Drizzle config file**
   - Create `drizzle.config.ts` with dialect set to `postgresql` and reference the `DATABASE_URL` environment variable

4. **Introspect your database**
   - Run introspection command to automatically generate schema definitions from your existing database structure

5. **Transfer code to schema file**
   - Move the generated introspection code to your actual schema file

6. **Connect Drizzle ORM to the database**
   ```typescript
   import { drizzle } from 'drizzle-orm/node-postgres';
   import { Client } from 'pg';
   
   const client = new Client({
     connectionString: process.env.DATABASE_URL,
   });
   
   await client.connect();
   const db = drizzle(client);
   ```

7. **Query the database**
   - Use the `db` instance to execute queries against your PostgreSQL database

8. **Run index.ts file**
   - Execute your TypeScript file using tsx

9. **Update table schema (optional)**
   - Modify your schema definitions as needed

10. **Apply changes to database (optional)**
    - Run migrations to apply schema changes to your database

11. **Query with new fields (optional)**
    - Update queries to use newly added schema fields

### postgresql-setup
Step-by-step PostgreSQL setup with node-postgres: install pg, set DATABASE_URL env var, connect Drizzle client, define schema, configure drizzle.config.ts, apply migrations, seed/query, run with tsx.

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

### singlestore-existing-project
Integrate Drizzle ORM with existing SingleStore database: install mysql2, configure DATABASE_URL and drizzle.config, introspect to generate schema, connect and query.

## Setup Drizzle ORM with SingleStore in an existing project

**Prerequisites:**
- dotenv - for managing environment variables
- tsx - for running TypeScript files
- mysql2 - for querying SingleStore database

**Step-by-step setup:**

1. Install the `mysql2` package
2. Setup connection variables in `.env` file with `DATABASE_URL`
3. Setup Drizzle config file with dialect set to 'singlestore' and reference to `DATABASE_URL`
4. Introspect your existing SingleStore database to auto-generate schema
5. Transfer the introspected code to your actual schema file
6. Connect Drizzle ORM to the database using the mysql2 driver
7. Query the database using Drizzle ORM
8. Run your TypeScript file with tsx
9. (Optional) Update your table schema
10. (Optional) Apply schema changes to the database
11. (Optional) Query the database with new fields

The workflow focuses on connecting to an existing database, introspecting it to generate schema definitions, and then using those schemas to query the database.

### singlestore-setup
Step-by-step setup for Drizzle ORM with SingleStore: install mysql2, configure DATABASE_URL, connect via drizzle-orm/singlestore driver, define schema, setup drizzle.config.ts with singlestore dialect, apply migrations, seed/query data.

## SingleStore Setup Guide

**Prerequisites:**
- dotenv - environment variable management
- tsx - TypeScript file runner
- mysql2 - MySQL client for Node.js

**Overview:**
Drizzle ORM supports SingleStore database via the `mysql2` driver through the `drizzle-orm/singlestore` package.

**Setup Steps:**

1. **Install mysql2 package**
   ```bash
   npm install mysql2
   ```

2. **Setup connection variables**
   Create `.env` file with `DATABASE_URL` variable containing your SingleStore connection string.

3. **Connect Drizzle ORM to the database**
   Import and configure the connection using the `singlestore` driver from `drizzle-orm/singlestore`.

4. **Create a table**
   Define your database schema using Drizzle's table definition API for SingleStore.

5. **Setup Drizzle config file**
   Create `drizzle.config.ts` with dialect set to `'singlestore'` and reference your `DATABASE_URL` environment variable.

6. **Apply changes to the database**
   Run migrations to apply your schema changes to the SingleStore database.

7. **Seed and Query the database**
   Write TypeScript code to insert data and query your SingleStore database using Drizzle ORM.

8. **Run index.ts file**
   Execute your TypeScript file using tsx to test the setup.

### sqlite-cloud-existing-project
Setup Drizzle ORM with SQLite Cloud: install packages, configure connection string, introspect schema, use drizzle() to connect and perform CRUD operations.

## Setup Drizzle ORM with SQLite Cloud in an existing project

**Prerequisites:**
- dotenv package for environment variables
- tsx package for running TypeScript files
- SQLite Cloud database and driver

**Installation:**
```bash
npm install drizzle-orm@beta @sqlitecloud/drivers dotenv
npm install -D drizzle-kit@beta tsx
```

**Configuration:**
1. Set `SQLITE_CLOUD_CONNECTION_STRING` environment variable
2. Create drizzle config file with `dialect: 'sqlite'` and the connection string env variable
3. Introspect existing database to generate schema
4. Transfer introspected code to schema file

**Connection:**
```typescript
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/sqlite-cloud';

const db = drizzle();
```

**Database Operations:**
```typescript
import { eq } from 'drizzle-orm';
import { usersTable } from './db/schema';

// Insert
const user = { name: 'John', age: 30, email: 'john@example.com' };
await db.insert(usersTable).values(user);

// Select
const users = await db.select().from(usersTable);

// Update
await db.update(usersTable).set({ age: 31 }).where(eq(usersTable.email, user.email));

// Delete
await db.delete(usersTable).where(eq(usersTable.email, user.email));
```

**Schema Updates:**
After modifying schema, apply changes to database and query with new fields. Example with added phone field:
```typescript
const user = { name: 'John', age: 30, email: 'john@example.com', phone: '123-456-7890' };
await db.insert(usersTable).values(user);
```

### sqlite-cloud-setup
Step-by-step guide to set up Drizzle ORM with SQLite Cloud: install packages, configure connection string, initialize drizzle(), define schema, create config, and perform CRUD operations.

## SQLite Cloud Setup Guide

Prerequisites: dotenv, tsx, SQLite Cloud database, SQLite Cloud driver

**Installation:**
```bash
npm install drizzle-orm@beta @sqlitecloud/drivers dotenv
npm install -D drizzle-kit@beta tsx
```

**Environment Setup:**
Set `SQLITE_CLOUD_CONNECTION_STRING` environment variable

**Connection:**
```typescript
import { drizzle } from 'drizzle-orm/sqlite-cloud';
const db = drizzle();
```

**Schema Definition:**
Create tables using Drizzle schema definitions

**Configuration:**
Create drizzle.config.ts with dialect 'sqlite' and SQLITE_CLOUD_CONNECTION_STRING

**Database Operations:**
```typescript
import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/sqlite-cloud';
import { usersTable } from './db/schema';

async function main() {
  const db = drizzle();

  // Insert
  const user = { name: 'John', age: 30, email: 'john@example.com' };
  await db.insert(usersTable).values(user);

  // Select
  const users = await db.select().from(usersTable);

  // Update
  await db.update(usersTable).set({ age: 31 }).where(eq(usersTable.email, user.email));

  // Delete
  await db.delete(usersTable).where(eq(usersTable.email, user.email));
}

main();
```

Run with: `npx tsx src/index.ts`

### sqlite-existing-project
Step-by-step guide to integrate Drizzle ORM with an existing SQLite database using LibSQL client, from installation through introspection, schema setup, and querying.

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

### sqlite-new
Step-by-step setup for SQLite with libsql driver: install @libsql/client, configure DB_FILE_NAME env var with file: prefix, connect via libsql client, define schema, create drizzle.config.ts, apply migrations, seed/query with TypeScript, run via tsx.

## Get Started with SQLite

This guide walks through setting up Drizzle ORM with SQLite using the libsql driver.

**Prerequisites:**
- dotenv - for managing environment variables
- tsx - for running TypeScript files
- libsql - a SQLite fork optimized for low query latency

**Setup Steps:**

1. **Install packages**: Install `@libsql/client`

2. **Setup connection variables**: Create a `.env` file with `DB_FILE_NAME`. For local SQLite files, use the format `file:local.db` (the `file:` prefix is required by LibSQL)

3. **Connect to database**: Import libsql client and create a connection instance

4. **Create a table**: Define your schema using Drizzle's table definition API

5. **Setup Drizzle config file**: Create `drizzle.config.ts` with dialect set to `sqlite` and reference the `DB_FILE_NAME` environment variable

6. **Apply migrations**: Run Drizzle migrations to create tables in the database

7. **Seed and query**: Write TypeScript code to insert and query data from the database

8. **Run the file**: Execute your TypeScript file using tsx

Drizzle supports both `libsql` and `better-sqlite3` drivers for SQLite connections. This guide uses libsql, but other connection methods are available in the SQLite Connection documentation.

### supabase-existing-project
11-step guide to integrate Drizzle ORM into existing Supabase PostgreSQL project: install postgres driver, configure DATABASE_URL and drizzle.config.ts, introspect existing schema, connect and query database, optionally update schema and apply migrations.

## Setup Drizzle ORM with Supabase in an existing project

This guide walks through integrating Drizzle ORM into an existing project that uses Supabase (PostgreSQL).

**Prerequisites:**
- dotenv package for environment variables
- tsx package for running TypeScript files
- Supabase account with a PostgreSQL database

**Steps:**

1. **Install postgres package** - Add the postgres driver for Node.js connections

2. **Setup connection variables** - Create a `.env` file with `DATABASE_URL` pointing to your Supabase PostgreSQL connection string

3. **Setup Drizzle config file** - Create `drizzle.config.ts` with dialect set to `postgresql` and reference the `DATABASE_URL` environment variable

4. **Introspect your database** - Run Drizzle introspection to automatically generate schema definitions from your existing Supabase database tables

5. **Transfer code to schema file** - Move the generated introspection output to your actual schema file (typically `src/schema.ts`)

6. **Connect Drizzle ORM to database** - Create a database connection using the postgres driver and DATABASE_URL

7. **Query the database** - Write and execute queries using Drizzle's query builder with the postgres-js driver

8. **Run index.ts file** - Execute your TypeScript file using tsx to test the connection and queries

9. **Update table schema (optional)** - Modify your schema definitions to add new fields or change existing ones

10. **Apply changes to database (optional)** - Run migrations to sync schema changes to your Supabase database

11. **Query with new fields (optional)** - Test queries that use the newly added schema fields

### tidb-existing-project
Integrate Drizzle ORM with TiDB in existing project: install @tidbcloud/serverless, set DATABASE_URL, configure mysql dialect, introspect database, connect with tidb-serverless dialect, query and optionally update schema.

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

### tidb-serverless-setup
Step-by-step guide to set up Drizzle ORM with TiDB serverless using HTTP driver: install @tidbcloud/serverless, configure DATABASE_URL, connect Drizzle, define schema, setup config with mysql dialect, apply migrations, seed/query, and run.

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

### turso-database-existing
Setup Drizzle with Turso SQLite: install packages, set DB_FILE_NAME env var, introspect existing database, connect with drizzle(), perform CRUD operations (insert/select/update/delete with eq conditions).

## Setup Drizzle ORM with Turso Database in an existing project

**Prerequisites:**
- dotenv package for environment variables
- tsx package for running TypeScript files
- Turso Database account and driver

**Installation:**
```bash
npm install drizzle-orm@beta @tursodatabase/database dotenv
npm install -D drizzle-kit@beta tsx
```

**Configuration:**
1. Set environment variable `DB_FILE_NAME` in `.env` file (e.g., `DB_FILE_NAME=mydb.sqlite`)
2. Create `drizzle.config.ts` with SQLite dialect and reference the env variable
3. Introspect existing database to generate schema
4. Transfer introspected code to `src/db/schema.ts`

**Connection:**
```typescript
import { drizzle } from 'drizzle-orm/tursodatabase/database';
const db = drizzle();
```

**Database Operations:**
```typescript
import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/tursodatabase/database';
import { usersTable } from './db/schema';

async function main() {
  const db = drizzle();

  // Insert
  const user = { name: 'John', age: 30, email: 'john@example.com' };
  await db.insert(usersTable).values(user);

  // Select
  const users = await db.select().from(usersTable);

  // Update
  await db.update(usersTable).set({ age: 31 }).where(eq(usersTable.email, user.email));

  // Delete
  await db.delete(usersTable).where(eq(usersTable.email, user.email));
}

main();
```

**Schema Updates:**
After modifying schema, apply changes to database and query with new fields. Example with added `phone` field:
```typescript
const user = { name: 'John', age: 30, email: 'john@example.com', phone: '123-456-7890' };
await db.insert(usersTable).values(user);
```

**Execution:**
Run with `tsx src/index.ts`

### turso-database-setup
Step-by-step setup for Drizzle ORM with Turso Database: install packages, configure environment, connect database, define schema, apply migrations, perform insert/select/update/delete operations.

## Getting Started with Drizzle ORM and Turso Database

Complete setup guide for integrating Drizzle ORM with Turso Database (SQLite).

### Prerequisites
- dotenv package for environment variables
- tsx package for running TypeScript
- Turso Database account and JavaScript driver

### Installation
```
npm install drizzle-orm@beta @tursodatabase/database dotenv
npm install -D drizzle-kit@beta tsx
```

### Environment Setup
Create `.env` file with database connection variable:
```
DB_FILE_NAME=mydb.sqlite
```

### Database Connection
Connect to Turso Database using Drizzle ORM driver.

### Schema Definition
Create table schema using Drizzle ORM table definitions.

### Configuration
Setup `drizzle.config.ts` with SQLite dialect and environment variable reference.

### Database Operations
Apply migrations, then perform CRUD operations:

```typescript
import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/tursodatabase/database';
import { usersTable } from './db/schema';

async function main() {
  const db = drizzle();

  // Insert
  const user = { name: 'John', age: 30, email: 'john@example.com' };
  await db.insert(usersTable).values(user);

  // Select
  const users = await db.select().from(usersTable);

  // Update
  await db.update(usersTable).set({ age: 31 }).where(eq(usersTable.email, user.email));

  // Delete
  await db.delete(usersTable).where(eq(usersTable.email, user.email));
}

main();
```

Run with `tsx src/index.ts`

### turso-existing
Integrate Drizzle ORM with Turso Cloud in existing project: install @libsql/client, set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN env vars, configure drizzle.config.ts with turso dialect, introspect existing database, connect via drizzle({ connection: { url, authToken } }) or drizzle({ client }), query with db instance.

## Setup Drizzle ORM with Turso Cloud in an existing project

**Prerequisites:**
- dotenv - environment variable management
- tsx - TypeScript file runner
- turso - SQLite for Production
- libsql - SQLite fork optimized for low query latency

**Step 1: Install packages**
```bash
npm install @libsql/client
```

**Step 2: Setup environment variables**
Create `.env` file:
```plaintext
TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=
```
Get these values from the LibSQL Driver SDK tutorial at docs.turso.tech/sdk/ts/quickstart

**Step 3: Create drizzle.config.ts**
```typescript
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
});
```

**Step 4: Introspect your database** - generates schema from existing database

**Step 5: Transfer introspected code to schema file** - move generated schema to `src/db/schema.ts`

**Step 6: Connect Drizzle ORM to database**
Create `src/index.ts`:
```typescript
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';

const db = drizzle({ 
  connection: { 
    url: process.env.TURSO_DATABASE_URL!, 
    authToken: process.env.TURSO_AUTH_TOKEN!
  }
});
```

Or with existing driver:
```typescript
import { createClient } from '@libsql/client';
const client = createClient({ 
  url: process.env.TURSO_DATABASE_URL!, 
  authToken: process.env.TURSO_AUTH_TOKEN!
});
const db = drizzle({ client });
```

**Step 7: Query the database** - use the db instance to run queries

**Step 8: Run index.ts file** - execute with tsx

**Step 9 (optional): Update table schema** - modify schema.ts and run migrations

**Step 10 (optional): Apply changes to database** - run Drizzle Kit migrations

**Step 11 (optional): Query with new fields** - use updated schema in queries

### turso-new
Setup Drizzle with Turso Cloud: install @libsql/client, configure env vars (TURSO_DATABASE_URL, TURSO_AUTH_TOKEN), initialize drizzle with connection or client, setup drizzle.config.ts with turso dialect, apply migrations.

## Getting Started with Turso Cloud

This guide walks through setting up Drizzle ORM with Turso Cloud (SQLite for production) and libsql driver.

### Prerequisites
- dotenv - environment variable management
- tsx - TypeScript file runner
- turso - SQLite for production
- libsql - SQLite fork optimized for low query latency

### Setup Steps

**Step 1: Install packages**
```bash
npm install @libsql/client
```

**Step 2: Environment variables**
Create `.env` file:
```plaintext
TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=
```
Get these values from Turso dashboard or LibSQL Driver SDK tutorial.

**Step 3: Connect to database**
Create `src/index.ts`:
```typescript
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';

const db = drizzle({ 
  connection: { 
    url: process.env.TURSO_DATABASE_URL!, 
    authToken: process.env.TURSO_AUTH_TOKEN!
  }
});
```

Or with existing driver:
```typescript
import { createClient } from '@libsql/client';

const client = createClient({ 
  url: process.env.TURSO_DATABASE_URL!, 
  authToken: process.env.TURSO_AUTH_TOKEN!
});
const db = drizzle({ client });
```

**Step 4: Create a table**
Define schema in `src/db/schema.ts` (details in referenced component).

**Step 5: Setup Drizzle config**
Create `drizzle.config.ts`:
```typescript
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
});
```

**Step 6: Apply migrations**
Run Drizzle Kit migrations (details in referenced component).

**Step 7: Seed and query database**
Execute queries using initialized db instance (details in referenced component).

**Step 8: Run the file**
Execute with tsx runner (details in referenced component).

### vercel-postgres-existing-project
Setup Drizzle ORM with Vercel Postgres in existing project: install @vercel/postgres, configure POSTGRES_URL and drizzle.config.ts, introspect schema, connect with drizzle(), perform CRUD operations.

## Setup Drizzle ORM with Vercel Postgres in an existing project

**Prerequisites:**
- dotenv package for environment variables
- tsx package for running TypeScript files
- Vercel Postgres database and driver

**Steps:**

1. Install `@vercel/postgres` package

2. Set up `POSTGRES_URL` environment variable in `.env.local` (copy from Vercel Postgres storage tab)

3. Create `drizzle.config.ts`:
```typescript
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
  schema: './src/db/schema.ts',
  out: './drizzle',
});
```

4. Introspect existing database to generate schema

5. Transfer introspected code to `src/db/schema.ts`

6. Connect to database in `src/db/index.ts`:
```typescript
import { drizzle } from 'drizzle-orm/vercel-postgres';
const db = drizzle();
```

7. Query database with CRUD operations:
```typescript
import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { usersTable } from './db/schema';

async function main() {
  const db = drizzle();

  // Insert
  const user = { name: 'John', age: 30, email: 'john@example.com' };
  await db.insert(usersTable).values(user);

  // Select
  const users = await db.select().from(usersTable);

  // Update
  await db.update(usersTable).set({ age: 31 }).where(eq(usersTable.email, user.email));

  // Delete
  await db.delete(usersTable).where(eq(usersTable.email, user.email));
}

main();
```

8. Run with `tsx src/index.ts`

9. (Optional) Update schema by modifying `src/db/schema.ts`

10. (Optional) Apply migrations to database

11. (Optional) Query with new fields - same pattern as step 7 but with updated schema including new fields like `phone: string | null`

### vercel-postgres-setup
Step-by-step setup for Drizzle ORM with Vercel Postgres including installation, environment configuration, schema creation, migrations, and CRUD operations.

## Getting Started with Vercel Postgres

Complete setup guide for using Drizzle ORM with Vercel Postgres.

**Prerequisites:**
- dotenv package for environment variables
- tsx package for running TypeScript
- Vercel Postgres database and driver

**Setup Steps:**

1. Install `@vercel/postgres` package
2. Set `POSTGRES_URL` environment variable (copy from Vercel Postgres storage tab)
3. Connect to database:
```typescript
import { drizzle } from 'drizzle-orm/vercel-postgres';
const db = drizzle();
```

4. Create a table schema
5. Setup `drizzle.config.ts` with `dialect: 'postgresql'` and `POSTGRES_URL` env variable
6. Run migrations with Drizzle CLI
7. Seed and query the database:
```typescript
import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { usersTable } from './db/schema';

const db = drizzle();

// Insert
const user = { name: 'John', age: 30, email: 'john@example.com' };
await db.insert(usersTable).values(user);

// Select
const users = await db.select().from(usersTable);

// Update
await db.update(usersTable).set({ age: 31 }).where(eq(usersTable.email, user.email));

// Delete
await db.delete(usersTable).where(eq(usersTable.email, user.email));
```

8. Run the file with tsx

### xata-existing-project
11-step guide to integrate Drizzle ORM with existing Xata PostgreSQL database: install postgres driver, configure DATABASE_URL, introspect schema, connect, and query.

## Get Started with Xata in Existing Project

This guide walks through integrating Drizzle ORM with an existing Xata PostgreSQL database.

**Prerequisites:**
- dotenv package for environment variables
- tsx package for running TypeScript files
- Xata Postgres database

**Setup Steps:**

1. **Install postgres package** - Add the postgres driver package to your project

2. **Setup connection variables** - Create a `.env` file with `DATABASE_URL` containing your Xata connection string (obtainable from Xata documentation)

3. **Setup Drizzle config file** - Create `drizzle.config.ts` with PostgreSQL dialect and DATABASE_URL environment variable reference

4. **Introspect your database** - Run introspection to generate schema from existing database tables

5. **Transfer code to schema file** - Move the introspected schema code to your actual schema file

6. **Connect Drizzle ORM to database** - Set up database connection using postgres-js driver with DATABASE_URL

7. **Query the database** - Write and execute queries against your database using the connected Drizzle instance

8. **Run index.ts file** - Execute your TypeScript file with tsx

9. **Update table schema (optional)** - Modify your schema definitions as needed

10. **Apply changes to database (optional)** - Run migrations to sync schema changes to the database

11. **Query with new fields (optional)** - Test queries using newly added schema fields

### xata-new
Step-by-step setup for Drizzle ORM with Xata PostgreSQL: install postgres driver, configure DATABASE_URL, initialize Drizzle connection, define schema, create drizzle.config.ts with postgresql dialect, apply migrations, seed/query with TypeScript, run via tsx.

## Get Started with Drizzle and Xata

Complete setup guide for using Drizzle ORM with Xata PostgreSQL database.

**Prerequisites:**
- dotenv package for environment variables
- tsx package for running TypeScript files
- Xata Postgres database account

**Setup Steps:**

1. **Install postgres package** - Add the postgres driver package to your project

2. **Setup connection variables** - Create a `.env` file with `DATABASE_URL` containing your Xata connection string (obtainable from Xata documentation)

3. **Connect Drizzle ORM to database** - Initialize Drizzle connection using the postgres driver and DATABASE_URL

4. **Create a table** - Define your database schema using Drizzle table definitions

5. **Setup Drizzle config file** - Create `drizzle.config.ts` with:
   - dialect: 'postgresql'
   - database URL from environment variable

6. **Apply changes to database** - Run migrations to create tables in your Xata database

7. **Seed and Query database** - Write TypeScript code to insert and query data using Drizzle ORM with postgres-js driver

8. **Run index.ts file** - Execute your TypeScript file using tsx to test the setup

The guide follows a linear progression from installation through basic database operations, with each step building on the previous one.

