## Error Objects

SvelteKit distinguishes between expected and unexpected errors, both represented as `{ message: string }` objects by default. Additional properties like `code` or `id` can be added (requires TypeScript `Error` interface redefinition).

## Expected Errors

Created with the `error()` helper from `@sveltejs/kit`. Throws an exception caught by SvelteKit, setting the response status code and rendering the nearest `+error.svelte` component where `page.error` contains the error object.

```js
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const post = await db.getPost(params.slug);
	if (!post) {
		error(404, { message: 'Not found' });
		// or with custom properties:
		error(404, { message: 'Not found', code: 'NOT_FOUND' });
		// or shorthand:
		error(404, 'Not found');
	}
	return { post };
}
```

Access in `+error.svelte`:
```svelte
<script>
	import { page } from '$app/state'; // or $app/stores in SvelteKit < 2.12
</script>
<h1>{page.error.message}</h1>
```

## Unexpected Errors

Any other exception during request handling. Not exposed to users for security; generic `{ message: "Internal Error" }` is shown instead. Printed to console/server logs and passed through the `handleError` hook for custom handling (e.g., error reporting services).

## Responses

Errors in `handle` or `+server.js` respond with fallback error page or JSON based on `Accept` headers.

Customize fallback with `src/error.html`:
```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<title>%sveltekit.error.message%</title>
	</head>
	<body>
		<h1>My custom error page</h1>
		<p>Status: %sveltekit.status%</p>
		<p>Message: %sveltekit.error.message%</p>
	</body>
</html>
```

SvelteKit replaces `%sveltekit.status%` and `%sveltekit.error.message%` with values.

Errors in `load` functions render nearest `+error.svelte`. If error in root `+layout.js/+layout.server.js`, fallback error page is used (since root layout contains `+error.svelte`).

## Type Safety

Customize error shape with TypeScript by declaring `App.Error` interface (typically in `src/app.d.ts`):

```ts
declare global {
	namespace App {
		interface Error {
			code: string;
			id: string;
		}
	}
}
export {};
```

Always includes `message: string` property.