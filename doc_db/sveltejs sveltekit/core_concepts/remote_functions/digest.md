Remote functions enable type-safe client-server communication. They're exported from `.remote.js` or `.remote.ts` files and always execute on the server, allowing safe access to server-only modules like databases and environment variables.

**Setup**: Enable in `svelte.config.js`:
```js
kit: { experimental: { remoteFunctions: true } },
compilerOptions: { experimental: { async: true } }
```

**query**: Reads dynamic data from server. Accepts optional validation schema and returns a Promise:
```js
export const getPost = query(v.string(), async (slug) => {
  const [post] = await db.sql`SELECT * FROM post WHERE slug = ${slug}`;
  if (!post) error(404, 'Not found');
  return post;
});
```
Used in components with `await getPost(slug)` or via `.loading`, `.error`, `.current` properties. Supports `.refresh()` to re-fetch and caches results per page.

**query.batch**: Batches multiple simultaneous calls into one server request, solving n+1 problems:
```js
export const getWeather = query.batch(v.string(), async (cities) => {
  const weather = await db.sql`SELECT * FROM weather WHERE city = ANY(${cities})`;
  const lookup = new Map(weather.map(w => [w.city, w]));
  return (city) => lookup.get(city);
});
```

**form**: Writes data via HTML forms with progressive enhancement. Spreads onto `<form>` element:
```js
export const createPost = form(
  v.object({ title: v.pipe(v.string(), v.nonEmpty()), content: v.pipe(v.string(), v.nonEmpty()) }),
  async ({ title, content }) => {
    const user = await auth.getUser();
    if (!user) error(401, 'Unauthorized');
    await db.sql`INSERT INTO post (slug, title, content) VALUES (${slug}, ${title}, ${content})`;
    redirect(303, `/blog/${slug}`);
  }
);
```
Access fields via `form.fields.title.as('text')` for input attributes. Supports nested objects/arrays, files, validation with `issues()`, and `value()`/`set()` for getting/setting. Use `_fieldName` prefix to prevent sensitive data from being sent back on validation failure. Supports `enhance()` for custom submission handling and `submit().updates(query)` for single-flight mutations.

**command**: Like form but not tied to an element, callable from anywhere (e.g., event handlers):
```js
export const addLike = command(v.string(), async (id) => {
  await db.sql`UPDATE item SET likes = likes + 1 WHERE id = ${id}`;
  getLikes(id).refresh();
});
```
Called with `await addLike(item.id)` or `await addLike(item.id).updates(getLikes(item.id))` for query updates. Cannot be called during render.

**prerender**: Invokes at build time for static data, caches in browser via Cache API:
```js
export const getPost = prerender(v.string(), async (slug) => { /* ... */ }, {
  inputs: () => ['first-post', 'second-post'],
  dynamic: true
});
```

**Validation**: Pass Standard Schema (Zod, Valibot) as first argument. Use `invalid()` function for programmatic validation errors. Implement `handleValidationError` hook to customize error responses.

**getRequestEvent**: Access current request context inside remote functions for cookies and user data. Note: `route`, `params`, `url` relate to the calling page, not the endpoint.

**Redirects**: Supported in query, form, prerender but not command.