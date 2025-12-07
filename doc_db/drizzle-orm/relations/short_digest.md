## Relation Types

**One-to-One** with `one()`:
```ts
export const usersRelations = relations(users, ({ one }) => ({
  profileInfo: one(profileInfo),
}));
export const profileInfoRelations = relations(profileInfo, ({ one }) => ({
  user: one(users, { fields: [profileInfo.userId], references: [users.id] }),
}));
```

**One-to-Many** with `many()` on parent, `one()` on child:
```ts
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));
export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, { fields: [posts.authorId], references: [users.id] }),
}));
```

**Many-to-Many** via junction table:
```ts
export const usersRelations = relations(users, ({ many }) => ({
  usersToGroups: many(usersToGroups),
}));
export const usersToGroupsRelations = relations(usersToGroups, ({ one }) => ({
  user: one(users, { fields: [usersToGroups.userId], references: [users.id] }),
  group: one(groups, { fields: [usersToGroups.groupId], references: [groups.id] }),
}));
```

## Key Concepts
- **Relations vs Foreign Keys**: Relations are application-level abstractions; foreign keys are database constraints. Both optional, can be used independently.
- **Foreign Key Actions**: `CASCADE | RESTRICT | NO ACTION | SET NULL | SET DEFAULT` on delete/update via `references()` second argument
- **Disambiguate**: Use `relationName` option for multiple relations between same tables