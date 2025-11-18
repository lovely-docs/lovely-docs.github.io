## Routing

Filesystem-based with `+` prefixed files: `+page.svelte`, `+page.js`/`+page.server.js` (load functions), `+layout.svelte`, `+error.svelte`, `+server.js` (API routes).

## Load Functions

Fetch data before rendering in `+page.js`/`+page.server.js` or `+layout.js`/`+layout.server.js`. Server loads access cookies/database; universal loads run on client. Receive `url`, `params`, `fetch`, `cookies`. Return serializable data from server loads. Rerun when dependencies invalidate.

## Form Actions

Export `actions` from `+page.server.js`:
```js
export const actions = {
  login: async ({ cookies, request }) => {
    const data = await request.formData();
    if (!data.get('email')) return fail(400, { missing: true });
    cookies.set('sessionid', token);
    return { success: true };
  }
};
```
Invoke with `<form method="POST" action="?/login">`. Use `use:enhance` for progressive enhancement.

## Page Options

Export `prerender`, `ssr`, `csr`, `trailingSlash`, `config` to control rendering behavior per route.

## State Management

Server: use cookies/databases, not shared variables. Client: use context API, URL parameters for persistent state. Component state persists across navigation.

## Remote Functions

Type-safe client-server via `.remote.js` with `query()`, `form()`, `command()`, `prerender()` accepting Standard Schema validation.