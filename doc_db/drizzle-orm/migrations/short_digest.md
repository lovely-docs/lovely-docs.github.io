## Migration Approaches

**Database First**: Use `drizzle-kit pull` to extract database schema as TypeScript code.

**Codebase First** (5 options):
1. **Push**: `drizzle-kit push` applies schema directly to database
2. **Generate + CLI Migrate**: `drizzle-kit generate` creates SQL files, `drizzle-kit migrate` applies them
3. **Generate + Runtime**: `drizzle-kit generate` creates SQL, apply via `migrate()` during app startup
4. **Generate Only**: `drizzle-kit generate` creates SQL files, apply manually or via external tools
5. **Export**: `drizzle-kit export` outputs SQL to console for use with Atlas or other tools

Example schema:
```typescript
import * as p from "drizzle-orm/pg-core";
export const users = p.pgTable("users", {
  id: p.serial().primaryKey(),
  name: p.text(),
  email: p.text().unique(),
});
```