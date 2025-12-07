## Serverless Performance Benefits

Serverless functions (AWS Lambda, Vercel Server Functions) can live up to 15 minutes and reuse database connections and prepared statements across invocations, providing significant performance benefits.

Edge functions, by contrast, clean up immediately after invocation and offer little to no performance benefits.

### Reusing Connections and Prepared Statements

Declare database connections and prepared statements outside the handler scope to reuse them across multiple invocations:

```ts
const databaseConnection = ...;
const db = drizzle({ client: databaseConnection });
const prepared = db.select().from(...).prepare();

export const handler = async (event: APIGatewayProxyEvent) => {
  return prepared.execute();
}
```

This pattern allows the same connection and prepared statement to be reused for every Lambda invocation within the 15-minute lifetime.