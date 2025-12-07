## New Features

### `.if()` function for WHERE expressions

Conditional WHERE clauses using `.if()` method:

```ts
await db
  .select()
  .from(posts)
  .where(gt(posts.views, views).if(views > 100));
```

The `.if()` function is available on all WHERE expressions and allows conditional filtering based on runtime values.

## Bug Fixes

- Fixed internal mappings for sessions `.all()`, `.values()`, `.execute()` functions in AWS DataAPI