## Routing

Filesystem-based routing in `src/routes` with `+` prefixed files:
- `+page.svelte` - page component receiving `data` prop
- `+page.js` / `+page.server.js` - export `load()` function for data fetching
- `+layout.svelte` / `+layout.js` / `+layout.server.js` - wrap pages with `{@render children()}`
- `+error.svelte` - error boundary
- `+server.js` - API routes exporting HTTP handlers (`GET`, `POST`, etc.)

All files run on server; all run on client except `+server` files. Layouts and error boundaries apply to subdirectories.

## Load Functions

Define in `+page.js`/`+page.server.js` or `+layout.js`/`+layout.server.js` to fetch data before rendering.

**Server load** (`+page.server.js`, `+layout.server.js`):
- Always runs on server
- Access to `cookies`, `locals`, `request`, `platform`, `clientAddress`
- Must return serializable data

**Universal load** (`+page.js`, `+layout.js`):
- Runs on server during SSR, then in browser on navigation
- Can return non-serializable data

Load functions receive `url`, `route`, `params`, and a `fetch` function that inherits cookies and caches responses. Use `setHeaders()` for caching, `await parent()` for parent data, `error()` to throw errors, `redirect()` to redirect. Server loads can return unresolved promises for streaming.

Rerun when referenced `params` or `url` properties change, or when dependencies declared via `fetch(url)` or `depends(url)` are invalidated with `invalidate(url)` or `invalidateAll()`.

## Form Actions

Export `actions` from `+page.server.js` to handle form submissions server-side:

```js
export const actions = {
  login: async ({ cookies, request }) => {
    const data = await request.formData();
    if (!data.get('email')) return fail(400, { missing: true });
    cookies.set('sessionid', token, { path: '/' });
    return { success: true };
  }
};
```

Invoke with `<form method="POST" action="?/login">` or `<button formaction="?/register">`. Return validation errors with `fail(status, data)`. Use `redirect()` to redirect after action. Use `use:enhance` directive for progressive enhancement without full-page reload.

## Page Options

Export from `+page.js`, `+page.server.js`, `+layout.js`, or `+layout.server.js`:
- `prerender` - generate static HTML at build time; export `entries()` for dynamic routes
- `ssr` - disable server-side rendering
- `csr` - disable client-side rendering (HTML/CSS only)
- `trailingSlash` - `'never'` (default), `'always'`, or `'ignore'`
- `config` - adapter-specific configuration

## State Management

**Server**: Don't store shared state in variables; use cookies and databases. Load functions should be pure without side effects.

**Client**: Use Svelte's context API to pass state through component tree. Component state persists across navigation; use `$derived` for reactive values or `{#key}` to force remounting.

**URL**: Store state affecting SSR or surviving reloads in URL search parameters via `goto('?sort=price')`.

## Remote Functions

Type-safe client-server communication via `.remote.js`/`.remote.ts` files (enable in `svelte.config.js`):

```js
export const getPost = query(v.string(), async (slug) => {
  const post = await db.sql`SELECT * FROM post WHERE slug = ${slug}`;
  if (!post) error(404);
  return post;
});

export const createPost = form(
  v.object({ title: v.string(), content: v.string() }),
  async ({ title, content }) => {
    await db.sql`INSERT INTO post VALUES (${title}, ${content})`;
    redirect(303, '/blog');
  }
);

export const addLike = command(v.string(), async (id) => {
  await db.sql`UPDATE item SET likes = likes + 1 WHERE id = ${id}`;
});
```

- `query()` - reads data, caches per page, supports `.refresh()` and `.batch()` for n+1 solutions
- `form()` - writes via HTML forms with progressive enhancement, validates with schema
- `command()` - callable from event handlers, not tied to elements
- `prerender()` - invokes at build time for static data

All accept Standard Schema (Zod, Valibot) for validation.