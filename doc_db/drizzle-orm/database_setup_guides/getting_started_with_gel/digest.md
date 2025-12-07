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