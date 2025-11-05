Remote functions enable type-safe client-server communication, always running on server. Four types: `query` (read), `query.batch` (batch reads), `form` (write with progressive enhancement), `command` (write from anywhere), `prerender` (build-time static data).

**query**:
```js
export const getPost = query(v.string(), async (slug) => {
  const [post] = await db.sql`SELECT * FROM post WHERE slug = ${slug}`;
  return post;
});
```
Use with `await getPost(slug)` or access `.loading`, `.error`, `.current`. Call `.refresh()` to re-fetch.

**form**:
```js
export const createPost = form(v.object({title: v.string(), content: v.string()}), async (data) => {
  await db.insert(data);
  redirect(303, '/blog');
});
```
Spread onto `<form>`, access fields via `createPost.fields.title.as('text')`. Validate with `validate()`, get issues via `field.issues()`. Single-flight mutations: `submit().updates(query())`.

**command**: Like form but callable from anywhere, no progressive enhancement. Update queries via `.updates(query())`.

**prerender**: Build-time execution for static data. Specify `inputs: () => [...]`.

Enable in config: `kit: { experimental: { remoteFunctions: true } }`