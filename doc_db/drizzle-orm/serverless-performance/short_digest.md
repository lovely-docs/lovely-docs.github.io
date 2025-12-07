Serverless functions (Lambda, Vercel) can reuse database connections and prepared statements across invocations by declaring them outside the handler scope. Edge functions don't provide this benefit.

```ts
const db = drizzle({ client: databaseConnection });
const prepared = db.select().from(...).prepare();

export const handler = async (event) => prepared.execute();
```