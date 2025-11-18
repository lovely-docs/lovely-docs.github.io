## Key patterns

**Avoid shared state on server** - Don't store data in shared variables; use cookies and databases instead.

**No side-effects in load** - Return data instead of writing to stores:
```js
export async function load({ fetch }) {
	return { user: await fetch('/api/user').then(r => r.json()) };
}
```

**Use context API** - Pass state through component tree with `setContext`/`getContext` instead of globals.

**Preserve component state** - Use `$derived` for reactive values that depend on props; use `{#key}` to force remounting.

**URL for persistent state** - Use search parameters for filters/sorting that should survive reloads.

**Snapshots for ephemeral state** - Persist UI state across navigation without URL/database.