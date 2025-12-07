## Setup Drizzle with Netlify Edge Functions and Neon

**Prerequisites**: Netlify CLI, `drizzle-orm`, `drizzle-kit`, `dotenv`

**Key Files**:
- `netlify/edge-functions/user.ts` - Edge function
- `import_map.json` - Deno imports for ESM packages
- `netlify.toml` - Route configuration
- `netlify/edge-functions/common/schema.ts` - Database schema
- `drizzle.config.ts` - Drizzle configuration

**Schema Example**:
```typescript
import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
export const usersTable = pgTable('users_table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  age: integer('age').notNull(),
  email: text('email').notNull().unique(),
})
```

**Edge Function with Database Query**:
```typescript
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

export default async (request: Request, context: Context) => {
  const sql = neon(Netlify.env.get("DATABASE_URL")!);
  const db = drizzle({ client: sql });
  const users = await db.select().from(usersTable);
  return new Response(JSON.stringify(users));
};
```

**Workflow**: Define schema → `drizzle-kit push` → Connect via `neon()` and `drizzle()` in edge function → Test with `netlify dev` → Deploy with `netlify deploy --prod`