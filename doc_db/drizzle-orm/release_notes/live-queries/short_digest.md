## Live Queries for Expo SQLite

Drizzle ORM v0.31.1 adds `useLiveQuery` React Hook for Expo SQLite that automatically re-runs queries and re-renders components when data changes.

```tsx
import { useLiveQuery, drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';

const db = drizzle(openDatabaseSync('db.db', { enableChangeListener: true }));

const { data, error, updatedAt } = useLiveQuery(db.select().from(users));
// or with Drizzle queries
const { data } = useLiveQuery(db.query.users.findFirst());
```

Returns `data`, `error`, and `updatedAt` for explicit error handling.