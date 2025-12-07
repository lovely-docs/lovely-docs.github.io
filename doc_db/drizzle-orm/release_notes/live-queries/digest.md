## Live Queries for Expo SQLite

Drizzle ORM v0.31.1 introduces native support for Expo SQLite Live Queries via the `useLiveQuery` React Hook. This hook automatically observes database changes and re-runs queries when data changes.

**Setup:**
```tsx
import { useLiveQuery, drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';

const expo = openDatabaseSync('db.db', { enableChangeListener: true });
const db = drizzle(expo);
```

**Usage:**
The hook works with both SQL-like and Drizzle queries:
```tsx
const { data, error, updatedAt } = useLiveQuery(db.select().from(users));
// or
const { data, error, updatedAt } = useLiveQuery(db.query.users.findFirst());
const { data, error, updatedAt } = useLiveQuery(db.query.users.findMany());
```

The hook returns an object with `data`, `error`, and `updatedAt` fields for explicit error handling. Components automatically re-render when the observed data changes.

**Design decisions:**
- The ORM API itself remains unchanged; the hook follows conventional React Hook patterns rather than adding methods like `.useLive()` to queries
- Result structure follows practices from React Query and Electric SQL