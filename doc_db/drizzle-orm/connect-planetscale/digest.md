## PlanetScale Integration

PlanetScale is a serverless MySQL platform. Drizzle ORM provides HTTP access to PlanetScale via the `drizzle-orm/planetscale-serverless` package (using PlanetScale's `database-js` driver), suitable for both serverless and traditional environments. TCP access via `mysql2` driver is also available.

### Installation
```
npm install drizzle-orm @planetscale/database
npm install -D drizzle-kit
```

### Basic Usage
Initialize with connection credentials:
```typescript
import { drizzle } from "drizzle-orm/planetscale-serverless";

const db = drizzle({ connection: {
  host: process.env["DATABASE_HOST"],
  username: process.env["DATABASE_USERNAME"],
  password: process.env["DATABASE_PASSWORD"],
}});

const response = await db.select().from(...)
```

Or provide an existing PlanetScale client:
```typescript
import { drizzle } from "drizzle-orm/planetscale-serverless";
import { Client } from "@planetscale/database";

const client = new Client({
  host: process.env["DATABASE_HOST"],
  username: process.env["DATABASE_USERNAME"],
  password: process.env["DATABASE_PASSWORD"],
});

const db = drizzle({ client });
```