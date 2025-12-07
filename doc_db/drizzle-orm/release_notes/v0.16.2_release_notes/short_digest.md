## PostgreSQL & MySQL Schemas
```ts
import { pgSchema } from "drizzle-orm-pg";
const mySchema = pgSchema("my_schema");
const users = mySchema("users", { id: serial("id").primaryKey(), name: text("name") });
```

## PostgreSQL Introspection
Auto-generate schema from existing database: `drizzle-kit introspect:pg --connectionString=postgresql://...`

## Postgres.js Driver
```ts
import { drizzle } from "drizzle-orm-pg/postgres.js";
import postgres from "postgres";
const db = drizzle(postgres(connectionString));
```

## Custom Types
```ts
const customText = customType<{ data: string }>({ dataType() { return "text"; } });
pgTable("users", { name: customText("name").notNull() });
```