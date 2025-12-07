## Purpose
Drizzle relations enable querying relational data with a simple API, abstracting away manual joins. They define relationships between tables at the application level without creating database constraints.

## Relational Queries vs Manual Joins
Relational queries automatically fetch related data:
```ts
const db = drizzle(client, { schema });
const result = await db.query.users.findMany({
  with: { posts: true }
});
// Returns: [{ id: 10, name: "Dan", posts: [...] }]
```

Manual joins require explicit join syntax and result mapping.

## One-to-One Relations
Define with `one()` operator. Two patterns:

**Foreign key in related table (nullable relation):**
```ts
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name'),
});

export const usersRelations = relations(users, ({ one }) => ({
  profileInfo: one(profileInfo),
}));

export const profileInfo = pgTable('profile_info', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  metadata: jsonb('metadata'),
});

export const profileInfoRelations = relations(profileInfo, ({ one }) => ({
  user: one(users, { 
    fields: [profileInfo.userId], 
    references: [users.id] 
  }),
}));
// user.profileInfo is { ... } | null
```

**Self-referencing (foreign key in same table):**
```ts
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name'),
  invitedBy: integer('invited_by'),
});

export const usersRelations = relations(users, ({ one }) => ({
  invitee: one(users, {
    fields: [users.invitedBy],
    references: [users.id],
  }),
}));
```

## One-to-Many Relations
Define with `many()` operator on parent, `one()` on child:
```ts
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name'),
});

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  content: text('content'),
  authorId: integer('author_id'),
});

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
  comments: many(comments),
}));

export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  text: text('text'),
  authorId: integer('author_id'),
  postId: integer('post_id'),
});

export const commentsRelations = relations(comments, ({ one }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
}));
```

## Many-to-Many Relations
Requires explicit junction/join table:
```ts
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name'),
});

export const usersRelations = relations(users, ({ many }) => ({
  usersToGroups: many(usersToGroups),
}));

export const groups = pgTable('groups', {
  id: serial('id').primaryKey(),
  name: text('name'),
});

export const groupsRelations = relations(groups, ({ many }) => ({
  usersToGroups: many(usersToGroups),
}));

export const usersToGroups = pgTable(
  'users_to_groups',
  {
    userId: integer('user_id').notNull().references(() => users.id),
    groupId: integer('group_id').notNull().references(() => groups.id),
  },
  (t) => [primaryKey({ columns: [t.userId, t.groupId] })],
);

export const usersToGroupsRelations = relations(usersToGroups, ({ one }) => ({
  group: one(groups, {
    fields: [usersToGroups.groupId],
    references: [groups.id],
  }),
  user: one(users, {
    fields: [usersToGroups.userId],
    references: [users.id],
  }),
}));
```

## Relations vs Foreign Keys
- **Relations**: Application-level abstraction, don't affect database schema, don't create constraints
- **Foreign Keys**: Database-level constraints, enforced on insert/update/delete, throw errors on violation
- Can be used independently or together; relations work with databases that don't support foreign keys

## Foreign Key Actions
Specify behavior when referenced data is modified using `references()` second argument:
```ts
type UpdateDeleteAction = 'cascade' | 'restrict' | 'no action' | 'set null' | 'set default';

// In column definition:
author: integer('author').references(() => users.id, { onDelete: 'cascade' }).notNull()

// In foreignKey constraint:
foreignKey({
  name: "author_fk",
  columns: [table.author],
  foreignColumns: [users.id],
})
  .onDelete('cascade')
  .onUpdate('cascade')
```

**Actions:**
- `CASCADE`: Delete/update child rows when parent is deleted/updated
- `NO ACTION`: Prevent parent deletion if child rows exist (default)
- `RESTRICT`: Same as NO ACTION
- `SET NULL`: Set foreign key column to NULL when parent is deleted
- `SET DEFAULT`: Set foreign key column to default value when parent is deleted

## Disambiguating Relations
Use `relationName` option when defining multiple relations between same tables:
```ts
export const usersRelations = relations(users, ({ many }) => ({
  author: many(posts, { relationName: 'author' }),
  reviewer: many(posts, { relationName: 'reviewer' }),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
    relationName: 'author',
  }),
  reviewer: one(users, {
    fields: [posts.reviewerId],
    references: [users.id],
    relationName: 'reviewer',
  }),
}));
```