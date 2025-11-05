## Routing
Routes defined by `src/routes` directory structure with `+` prefixed files: `+page.svelte` for pages, `+page.js`/`+page.server.js` for load functions, `+layout.svelte` for shared markup, `+server.js` for API endpoints, `+error.svelte` for error pages.

## Load Functions
Define in `+page.js`/`+page.server.js` or `+layout.js`/`+layout.server.js`. Universal load functions run on server and browser; server-only load functions run only on server and must return serializable data. Access `params`, `url`, `route`, `cookies`, set headers, access parent data, stream promises, and trigger reruns on param/url changes or `invalidate()`.

```js
export async function load({ params, fetch, cookies }) {
	const data = await fetch('/api/data');
	cookies.set('key', 'value');
	return { data };
}
```

## Form Actions
Export `actions` from `+page.server.js` to handle POST requests. Read form data, return results or errors with `fail()`, redirect with `redirect()`. Add `use:enhance` directive for client-side handling without full-page reloads.

```js
export const actions = {
	login: async ({ request }) => {
		const data = await request.formData();
		if (!data.get('email')) return fail(400, { missing: true });
		return { success: true };
	}
};
```

## Page Options
Export configuration from layout and page files:
- `prerender = true/'auto'` — generates static HTML at build time
- `ssr = false` — skips server rendering, sends empty shell
- `csr = false` — disables client-side rendering, HTML/CSS only
- `trailingSlash = 'never' | 'always' | 'ignore'` — controls URL trailing slash behavior
- `config = {...}` — adapter-specific configuration

## State Management
Avoid shared state on server; use cookies and databases instead. Don't write to stores in load functions—return data instead. Use context API for safe state sharing. Store persistent state in URL search parameters. Preserve ephemeral UI state with snapshots.

## Remote Functions
Type-safe client-server communication with `query` (read), `form` (write with progressive enhancement), `command` (write from anywhere), and `prerender` (build-time data).

```js
export const getPost = query(v.string(), async (slug) => {
	const [post] = await db.sql`SELECT * FROM post WHERE slug = ${slug}`;
	return post;
});

export const createPost = form(v.object({title: v.string()}), async (data) => {
	await db.insert(data);
	redirect(303, '/blog');
});
```

Enable with `kit: { experimental: { remoteFunctions: true } }`