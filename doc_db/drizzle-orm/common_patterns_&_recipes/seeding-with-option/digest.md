## Seeding with the `with` Option

The `with` option in Drizzle Seed allows you to generate related data for one-to-many relationships. When seeding, you can specify that for each parent record, multiple child records should be created.

### Basic Concept

The `with` option requires a one-to-many relationship between tables. For example, if one user has many posts:

```ts
users: {
    count: 2,
    with: {
        posts: 3,
    },
}
```

This generates 2 users, each with 3 posts.

### Requirements

To use `with`, you must establish the relationship in your schema. There are two approaches:

**Option 1: Add a foreign key reference**
```ts
export const posts = pgTable('posts', {
    id: serial('id').primaryKey(),
    content: text('content'),
    authorId: integer('author_id').notNull().references(() => users.id),
});
```

**Option 2: Define explicit relations**
```ts
export const postsRelations = relations(posts, ({ one }) => ({
    author: one(users, {
        fields: [posts.authorId],
        references: [users.id],
    }),
}));
```

Then include the relations in the seed function:
```ts
await seed(db, { users, posts, postsRelations }).refine(() => ({
    users: {
        count: 2,
        with: {
            posts: 3,
        },
    },
}));
```

### Common Errors

**Error: "posts" table doesn't have a reference to "users" table**
- Occurs when trying to use `with` without establishing a relationship
- Solution: Add foreign key or explicit relations as shown above

**Error: Attempting to generate many parents for one child**
- Example: Trying to generate 3 users for 2 posts when the relationship is one user → many posts
- This violates the one-to-many constraint
- Solution: Reverse the structure to match the actual relationship direction

**Error: "users" table has self reference**
- Occurs when a table references itself (e.g., `reportsTo` field in users table)
- Cannot use `with` for self-referencing tables because you cannot generate multiple parents for a single record
- Solution: Do not use `with` for self-referential relationships