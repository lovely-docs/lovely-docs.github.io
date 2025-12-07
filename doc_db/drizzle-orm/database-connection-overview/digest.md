## Database Connection with Drizzle

Drizzle ORM executes SQL queries through database drivers. The ORM creates a database instance that translates high-level queries into SQL and communicates with the database via the driver.

### Basic Connection

```ts
import { drizzle } from "drizzle-orm/node-postgres"
import { users } from "./schema"

const db = drizzle(process.env.DATABASE_URL);
const usersCount = await db.$count(users);
```

The query `db.$count(users)` translates to `select count(*) from users` and is executed through the node-postgres driver, returning `[{ count: 0 }]`.

### Accessing the Driver Client

Drizzle creates a driver instance internally, accessible via `db.$client`:

```ts
const db = drizzle(process.env.DATABASE_URL);
const pool = db.$client;

// Equivalent to manually creating:
import { Pool } from "pg";
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool });
```

### Edge and Serverless Runtimes

Drizzle supports multiple serverless database drivers:

```ts
// Neon HTTP
import { drizzle } from "drizzle-orm/neon-http";
const db = drizzle(process.env.DATABASE_URL);

// Neon with websockets
import { drizzle } from "drizzle-orm/neon-serverless";
const db = drizzle(process.env.DATABASE_URL);

// Vercel Postgres
import { drizzle } from "drizzle-orm/vercel-postgres";
const db = drizzle();

// PlanetScale HTTP
import { drizzle } from "drizzle-orm/planetscale";
const db = drizzle(process.env.DATABASE_URL);

// Cloudflare D1
import { drizzle } from "drizzle-orm/d1";
const db = drizzle({ connection: env.DB });
```

### Runtime-Specific Drivers

```ts
// Bun SQLite
import { drizzle } from "drizzle-orm/bun-sqlite"
const db = drizzle(); // in-memory
const db = drizzle("./sqlite.db");

// Expo SQLite
import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
const expo = openDatabaseSync("db.db");
const db = drizzle(expo);
```

### Database Connection URL Format

```
postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname
             └──┘ └───────┘ └─────────────────────────────────────────────┘ └────┘
              ʌ    ʌ          ʌ                                              ʌ
        role -│    │          │- hostname                                    │- database
                   │
                   │- password
```

### Available Drivers

PostgreSQL: PostgreSQL, Neon, Vercel Postgres, Supabase, Xata, PGLite
MySQL: MySQL, PlanetScale, TiDB
SQLite: SQLite, Turso Cloud, Turso Database, Cloudflare D1, Bun SQLite, SQLite Cloud
Native SQLite: Expo SQLite, OP SQLite, React Native SQLite
Others: Drizzle Proxy