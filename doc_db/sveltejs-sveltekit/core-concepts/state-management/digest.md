## Avoid shared state on the server

Servers are stateless and shared by multiple users. Don't store data in shared variables — this exposes one user's data to others and causes data loss on server restart. Instead, authenticate users with cookies and persist data to a database.

## No side-effects in load functions

Load functions should be pure. Don't write to stores or global state inside load functions:

```js
// WRONG
import { user } from '$lib/user';
export async function load({ fetch }) {
	const response = await fetch('/api/user');
	user.set(await response.json()); // Shared by all users!
}

// RIGHT
export async function load({ fetch }) {
	const response = await fetch('/api/user');
	return { user: await response.json() };
}
```

Return data and pass it to components that need it, or use `page.data`.

## Using state and stores with context

Use Svelte's context API to safely share state on the server:

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

Pass functions into context to maintain reactivity. During SSR, state updates in child components don't affect parent components (already rendered), but on the client they do. Pass state down rather than up to avoid flashing during hydration.

## Component and page state is preserved

When navigating between routes with the same layout/page component, the component isn't destroyed — it's reused. This means `onMount`/`onDestroy` don't rerun and local state persists. Make dependent values reactive:

```svelte
<script>
	let { data } = $props();
	let wordCount = $derived(data.content.split(' ').length);
	let estimatedReadingTime = $derived(wordCount / 250);
</script>
```

To destroy and remount on navigation, use `{#key page.url.pathname}`.

## Storing state in the URL

For state that should survive reloads or affect SSR (filters, sorting), use URL search parameters: `?sort=price&order=ascending`. Access them in load functions via `url` parameter or in components via `page.url.searchParams`.

## Storing ephemeral state in snapshots

For disposable UI state like 'is accordion open?', use snapshots to associate component state with history entries.