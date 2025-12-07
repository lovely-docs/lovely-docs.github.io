## Seeding with `with` Option

Use `with` to generate related child records for one-to-many relationships:

```ts
users: {
    count: 2,
    with: {
        posts: 3,  // 2 users, each with 3 posts
    },
}
```

**Requirements:** Establish the relationship via foreign key or explicit relations:
```ts
// Option 1: Foreign key
authorId: integer('author_id').notNull().references(() => users.id)

// Option 2: Explicit relations
export const postsRelations = relations(posts, ({ one }) => ({
    author: one(users, { fields: [posts.authorId], references: [users.id] }),
}));
// Include in seed: seed(db, { users, posts, postsRelations })
```

**Common errors:**
- Missing relationship definition → add foreign key or relations
- Reversed relationship (many parents for one child) → flip the structure
- Self-referencing tables → cannot use `with`