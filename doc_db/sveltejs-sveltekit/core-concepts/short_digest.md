## Routing
`src/routes` directory with `+` prefixed files: `+page.svelte`, `+page.server.js`, `+layout.svelte`, `+server.js`, `+error.svelte`.

## Load Functions
```js
export async function load({ params, fetch, cookies }) {
	return { data: await fetch('/api/data') };
}
```
Universal and server-only variants. Access params, url, cookies, set headers, stream promises.

## Form Actions
```js
export const actions = {
	login: async ({ request }) => {
		const data = await request.formData();
		return fail(400, { missing: true });
	}
};
```
Use `use:enhance` for client-side handling.

## Page Options
`prerender`, `ssr`, `csr`, `trailingSlash`, `config` exports control rendering and behavior.

## State Management
Avoid shared server state. Return data from load functions. Use context API, URL parameters, and snapshots for state.

## Remote Functions
Type-safe `query`, `form`, `command`, `prerender` functions. Enable with `kit: { experimental: { remoteFunctions: true } }`