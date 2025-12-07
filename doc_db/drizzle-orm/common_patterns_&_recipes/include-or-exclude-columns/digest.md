## Including/Excluding Columns in Queries

### Basic Selection
- `.select()` with no arguments returns all columns
- `.select({ title: posts.title })` returns only specific columns

### Using getTableColumns() Utility
- `getTableColumns(table)` returns all table columns as an object
- Spread to include all: `.select({ ...getTableColumns(posts) })`
- Exclude by destructuring: `const { content, ...rest } = getTableColumns(posts); .select({ ...rest })`
- Add computed columns: `.select({ ...getTableColumns(posts), titleLength: sql<number>\`length(${posts.title})\` })`

### With Joins
```ts
const { userId, postId, ...rest } = getTableColumns(comments);
await db
  .select({
    postId: posts.id,
    comment: { ...rest },
    user: users, // equivalent to getTableColumns(users)
  })
  .from(posts)
  .leftJoin(comments, eq(posts.id, comments.postId))
  .leftJoin(users, eq(users.id, posts.userId));
```

### Relational Queries API
- Include all: `db.query.posts.findMany()`
- Include specific: `db.query.posts.findMany({ columns: { title: true } })`
- Exclude specific: `db.query.posts.findMany({ columns: { content: false } })`
- Add extras: `db.query.posts.findMany({ extras: { titleLength: sql<number>\`length(${posts.title})\`.as('title_length') } })`
- With relations:
```ts
db.query.posts.findMany({
  columns: { id: true },
  with: {
    comments: { columns: { userId: false, postId: false } },
    user: true,
  },
});
```

### Conditional Selection
```ts
const searchPosts = async (withTitle = false) => {
  await db.select({
    id: posts.id,
    ...(withTitle && { title: posts.title }),
  }).from(posts);
};
```