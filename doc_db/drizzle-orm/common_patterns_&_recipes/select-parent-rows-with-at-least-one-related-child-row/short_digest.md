## Select Parent Rows with At Least One Related Child

**With child data using inner join:**
```ts
await db
  .select({ user: users, post: posts })
  .from(users)
  .innerJoin(posts, eq(users.id, posts.userId));
```

**Parent rows only using exists subquery:**
```ts
const sq = db.select({ id: sql`1` }).from(posts).where(eq(posts.userId, users.id));
await db.select().from(users).where(exists(sq));
```