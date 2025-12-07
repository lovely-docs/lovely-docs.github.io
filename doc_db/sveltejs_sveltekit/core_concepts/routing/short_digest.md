## Filesystem routing

Routes defined by `src/routes` directory structure: `src/routes/about` → `/about`, `src/routes/blog/[slug]` → `/blog/:slug`.

## Route files

Files with `+` prefix: `+page.svelte` (page component), `+page.js`/`+page.server.js` (load functions), `+layout.svelte`/`+layout.js`/`+layout.server.js` (persistent wrappers), `+server.js` (API endpoints), `+error.svelte` (error pages).

## Pages

```svelte
<!--- +page.svelte --->
<script>
	let { data } = $props();
</script>
<h1>{data.title}</h1>
```

```js
// +page.js or +page.server.js
export function load({ params }) {
	return { title: 'Hello' };
}
```

## Layouts

```svelte
<!--- +layout.svelte --->
<script>
	let { children } = $props();
</script>
<nav><a href="/">Home</a></nav>
{@render children()}
```

```js
// +layout.js or +layout.server.js
export function load() {
	return { sections: [...] };
}
```

Data from parent layout available to child pages.

## API routes

```js
// +server.js
export function GET({ url }) {
	return new Response(String(Math.random()));
}

export async function POST({ request }) {
	const { a, b } = await request.json();
	return json(a + b);
}

export async function fallback({ request }) {
	return text(`Caught ${request.method}`);
}
```

GET/POST/HEAD: page request if `accept: text/html`, else API. PUT/PATCH/DELETE/OPTIONS: always API.

## Error handling

```svelte
<!--- +error.svelte --->
<script>
	import { page } from '$app/state';
</script>
<h1>{page.status}: {page.error.message}</h1>
```

Walks up tree to find closest error boundary.

## Types

Use `PageProps`, `LayoutProps`, `PageLoad`, `PageServerLoad`, `LayoutLoad`, `LayoutServerLoad` from `$types.d.ts` for type safety. IDE can auto-insert.