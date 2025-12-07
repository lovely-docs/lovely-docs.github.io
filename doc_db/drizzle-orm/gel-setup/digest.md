## Gel Integration Setup

Drizzle has native support for Gel connections via the `gel-js` client.

**Installation:**
```
npm install drizzle-orm gel
npm install -D drizzle-kit
```

**Basic initialization with connection string:**
```typescript
import { drizzle } from 'drizzle-orm/gel';
const db = drizzle(process.env.DATABASE_URL);
const result = await db.execute('select 1');
```

**With connection options:**
```typescript
import { drizzle } from "drizzle-orm/gel";
const db = drizzle({
  connection: {
    dsn: process.env.DATABASE_URL,
    tlsSecurity: "default",
  },
});
const result = await db.execute("select 1");
```

**With existing Gel client:**
```typescript
import { drizzle } from "drizzle-orm/gel";
import { createClient } from "gel";
const gelClient = createClient();
const db = drizzle({ client: gelClient });
const result = await db.execute('select 1');
```