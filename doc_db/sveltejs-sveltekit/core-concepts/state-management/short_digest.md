**Avoid shared state on server** — don't store data in shared variables; use cookies and databases instead.

**No side-effects in load** — return data instead of writing to stores:
```js
export async function load({ fetch }) {
	return { user: await fetch('/api/user').then(r => r.json()) };
}
```

**Use context API for safe state sharing** — pass functions into context to maintain reactivity across SSR boundaries.

**Component state is preserved** — make dependent values reactive with `$derived` when data changes.

**URL search parameters** — store state that needs to survive reloads: `?sort=price&order=ascending`.

**Snapshots** — preserve ephemeral UI state across navigation.