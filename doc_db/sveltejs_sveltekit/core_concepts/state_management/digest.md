## Avoid shared state on the server

Servers are stateless and shared by multiple users. Don't store data in shared variables as it will be visible to all users:

```js
// ❌ WRONG - shared across all users
let user;
export function load() {
	return { user };
}
export const actions = {
	default: async ({ request }) => {
		user = { name: data.get('name') };
	}
}
```

Instead, authenticate users with cookies and persist data to a database.

## No side-effects in load functions

Load functions should be pure. Don't write to stores or global state:

```js
// ❌ WRONG
import { user } from '$lib/user';
export async function load({ fetch }) {
	const response = await fetch('/api/user');
	user.set(await response.json()); // Side effect!
}

// ✅ RIGHT
export async function load({ fetch }) {
	const response = await fetch('/api/user');
	return { user: await response.json() };
}
```

Pass data to components that need it or use `page.data`.

## Using state and stores with context

Use Svelte's context API to avoid global state. Pass state through the component tree:

```svelte
<!-- +layout.svelte -->
<script>
	import { setContext } from 'svelte';
	let { data } = $props();
	setContext('user', () => data.user);
</script>

<!-- +page.svelte -->
<script>
	import { getContext } from 'svelte';
	const user = getContext('user');
</script>
<p>Welcome {user().name}</p>
```

Pass functions into context to maintain reactivity. On the server, state updates during SSR won't affect parent components (already rendered), but on the client they will. Pass state down rather than up to avoid flashing during hydration.

## Component and page state is preserved

When navigating between routes, components are reused and not destroyed. This means `onMount`/`onDestroy` won't rerun and reactive values won't recalculate. Use `$derived` to make values reactive:

```svelte
let { data } = $props();
let wordCount = $derived(data.content.split(' ').length);
let estimatedReadingTime = $derived(wordCount / 250);
```

Use `{#key page.url.pathname}` to force component remounting on navigation if needed.

## Storing state in the URL

For state that should survive reloads or affect SSR (filters, sorting), use URL search parameters:

```js
goto('?sort=price&order=ascending');
// Access in load: url.searchParams
// Access in components: page.url.searchParams
```

## Storing ephemeral state in snapshots

For disposable UI state like 'is accordion open?', use snapshots to persist state across navigation without URL or database storage.