Remote functions enable type-safe client-server communication via `.remote.js`/`.remote.ts` files. Four types: **query** (read data, caches per page, supports `.refresh()`), **query.batch** (batches simultaneous calls), **form** (progressive enhancement with validation and field management), **command** (imperative mutations), **prerender** (build-time static data).

```js
// query
export const getPost = query(v.string(), async (slug) => {
  return await db.sql`SELECT * FROM post WHERE slug = ${slug}`;
});

// form
export const createPost = form(v.object({title: v.string()}), async ({title}) => {
  await db.sql`INSERT INTO post (title) VALUES (${title})`;
});

// command
export const addLike = command(v.string(), async (id) => {
  await db.sql`UPDATE item SET likes = likes + 1 WHERE id = ${id}`;
});
```

Enable with `kit.experimental.remoteFunctions: true` in config. Validate arguments with Standard Schema. Use `getRequestEvent()` for cookies/auth inside handlers.