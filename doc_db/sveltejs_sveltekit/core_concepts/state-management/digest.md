## Avoid shared state on the server

Servers are stateless and shared by multiple users. Never store data in shared variables:

```js
// ❌ WRONG - shared across all users
let user;
export function load() {
	return { user };
}
export const actions = {
	default: async ({ request }) => {
		user = { name: data.get('name'), secret: data.get('secret') };
	}
}
```

Instead, authenticate users with cookies and persist data to a database.

## No side-effects in load functions

Load functions must be pure. Don't write to stores or global state:

```js
// ❌ WRONG - shared state
import { user } from '$lib/user';
export async function load({ fetch }) {
	const response = await fetch('/api/user');
	user.set(await response.json()); // Never do this
}

// ✅ CORRECT - return data
export async function load({ fetch }) {
	const response = await fetch('/api/user');
	return { user: await response.json() };
}
```

Pass data to components or use `page.data`.

## Using state and stores with context

Use Svelte's context API to avoid global state. Server-side app state uses `setContext`/`getContext`:

```svelte
<!-- +layout.svelte -->
<script>
	import { setContext } from 'svelte';
	let { data } = $props();
	setContext('user', () => data.user);
</script>

<!-- user/+page.svelte -->
<script>
	import { getContext } from 'svelte';
	const user = getContext('user');
</script>
<p>Welcome {user().name}</p>
```

Pass functions into context to maintain reactivity. On the server, context-based state updates in child components won't affect parent components (already rendered), but on the client they will. Pass state down rather than up to avoid flashing during hydration.

If not using SSR, you can safely keep state in a shared module.

## Component and page state is preserved

When navigating, SvelteKit reuses layout and page components. The `data` prop updates but lifecycle methods don't rerun:

```svelte
// ❌ WRONG - estimatedReadingTime won't recalculate on navigation
const wordCount = data.content.split(' ').length;
const estimatedReadingTime = wordCount / 250;

// ✅ CORRECT - use $derived
let wordCount = $derived(data.content.split(' ').length);
let estimatedReadingTime = $derived(wordCount / 250);
```

Use `afterNavigate` and `beforeNavigate` if lifecycle code must rerun. To destroy/remount on navigation:

```svelte
<script>
	import { page } from '$app/state';
</script>
{#key page.url.pathname}
	<BlogPost title={data.title} content={data.content} />
{/key}
```

## Storing state in the URL

For state that should survive reload or affect SSR (filters, sorting), use URL search parameters:

```
?sort=price&order=ascending
```

Set via `<a href="...">`, `<form action="...">`, or `goto('?key=value')`. Access in load functions via `url` parameter, in components via `page.url.searchParams`.

## Storing ephemeral state in snapshots

For disposable UI state (accordion open/closed) that should persist across navigation but not reload, use snapshots to associate component state with history entries.