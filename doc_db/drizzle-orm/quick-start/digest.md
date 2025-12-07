## Installation

Install drizzle-orm and drizzle-kit:
```
npm install drizzle-orm postgres
npm install -D drizzle-kit
```

## Schema Definition

Create `src/schema.ts` with table definitions using drizzle-orm/pg-core:
```ts
import { serial, text, timestamp, pgTable } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: serial("id"),
  name: text("name"),
  email: text("email"),
  password: text("password"),
  role: text("role").$type<"admin" | "customer">(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});
```

## Configuration

Create `drizzle.config.ts`:
```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  out: "./drizzle",
});
```

## Migration Setup

Add scripts to `package.json`:
```json
{
  "scripts": {
    "generate": "drizzle-kit generate",
    "migrate": "drizzle-kit migrate"
  }
}
```

## Running Migrations

Generate migration files:
```shell
npm run generate
```

This creates SQL migration files in the `drizzle/` directory (e.g., `drizzle/0000_pale_mister_fear.sql`).

Apply migrations to database:
```shell
npm run migrate
```