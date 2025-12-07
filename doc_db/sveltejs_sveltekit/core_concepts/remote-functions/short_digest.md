## Remote Functions

Type-safe client-server communication. Functions exported from `.remote.js`/`.remote.ts` are called from client but execute on server, accessing server-only modules safely. Requires `kit.experimental.remoteFunctions: true`.

Four types:

**query**: Read dynamic data. Returns Promise. Accepts validated argument. Cacheable, refreshable via `.refresh()`. `query.batch` batches simultaneous calls.

```js
export const getPost = query(v.string(), async (slug) => {
	return await db.sql`SELECT * FROM post WHERE slug = ${slug}`;
});
```

```svelte
{#each await getPosts() as post}...{/each}
```

**form**: Write data via form submission. Progressive enhancement. Validates fields, supports nested objects/arrays, files. Programmatic validation via `invalid()`. Single-flight mutations refresh specific queries.

```js
export const createPost = form(v.object({title: v.string(), content: v.string()}), async (data) => {
	await db.insert(data);
	redirect(303, `/blog/${slug}`);
});
```

```svelte
<form {...createPost}>
	<input {...createPost.fields.title.as('text')} />
	<textarea {...createPost.fields.content.as('text')}></textarea>
</form>
```

**command**: Write data without form. Called from anywhere (not render). Updates queries via `.updates()` with optional optimistic override.

```js
export const addLike = command(v.string(), async (id) => {
	await db.sql`UPDATE item SET likes = likes + 1 WHERE id = ${id}`;
});

await addLike(id).updates(getLikes(id).withOverride(n => n + 1));
```

**prerender**: Build-time data fetching. Cached in browser via Cache API. Supports `inputs` option and `dynamic: true` for runtime calls.

Validation errors return 400 Bad Request. Use `getRequestEvent()` for cookies/auth. Redirects work in query/form/prerender, not command.