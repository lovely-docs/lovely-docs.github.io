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