## SQL-like Syntax

Drizzle provides SQL-like query syntax that mirrors standard SQL, minimizing learning curve. You write queries that look like SQL and know exactly what SQL will be generated.

**Select with joins:**
```typescript
await db
  .select()
  .from(posts)
  .leftJoin(comments, eq(posts.id, comments.post_id))
  .where(eq(posts.id, 10))
```

**Insert:**
```typescript
await db.insert(users).values({ email: 'user@gmail.com' })
```

**Update:**
```typescript
await db.update(users)
  .set({ email: 'user@gmail.com' })
  .where(eq(users.id, 1))
```

**Delete:**
```typescript
await db.delete(users).where(eq(users.id, 1))
```

Supports select, insert, update, delete, aliases, WITH clauses, subqueries, and prepared statements.

## Relational Queries API

For common scenarios with nested/relational data, use the Queries API for more convenient and performant fetching without manual joins or data mapping. Always outputs exactly one SQL query, safe for serverless databases.

```typescript
const result = await db.query.users.findMany({
  with: {
    posts: true
  },
});
```

## Advanced Composition

Queries can be composed and partitioned flexibly:

**Compose WHERE filters independently:**
```typescript
async function getProductsBy({ name, category, maxPrice }) {
  const filters: SQL[] = [];
  if (name) filters.push(ilike(products.name, name));
  if (category) filters.push(eq(products.category, category));
  if (maxPrice) filters.push(lte(products.price, maxPrice));
  return db.select().from(products).where(and(...filters));
}
```

**Separate subqueries into variables:**
```typescript
const subquery = db
  .select()
  .from(internalStaff)
  .leftJoin(customUser, eq(internalStaff.userId, customUser.id))
  .as('internal_staff');

const mainQuery = await db
  .select()
  .from(ticket)
  .leftJoin(subquery, eq(subquery.internal_staff.userId, ticket.staffId));
```