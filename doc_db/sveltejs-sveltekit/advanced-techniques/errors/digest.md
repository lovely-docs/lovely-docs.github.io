## Expected vs Unexpected Errors

SvelteKit distinguishes between two error types:

**Expected errors** are created with the `error()` helper from `@sveltejs/kit`. They throw an exception that SvelteKit catches, setting the response status code and rendering the nearest `+error.svelte` component with `page.error` containing the error object.

```js
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const post = await db.getPost(params.slug);
	if (!post) {
		error(404, 'Not found');
	}
	return { post };
}
```

You can pass a string as the second argument or an object with custom properties:

```js
error(404, { message: 'Not found', code: 'NOT_FOUND' });
```

**Unexpected errors** are any other exceptions. They're not exposed to users (to avoid leaking sensitive info) and instead show a generic `{ message: "Internal Error" }`. They pass through the `handleError` hook where you can add custom handling like error reporting.

## Error Objects & Type Safety

Error objects are `{ message: string }` by default. Add custom properties by declaring an `App.Error` interface in `src/app.d.ts`:

```ts
declare global {
	namespace App {
		interface Error {
			code: string;
			id: string;
		}
	}
}
```

## Error Responses

If an error occurs in `handle` or `+server.js`, SvelteKit responds with either a fallback error page or JSON based on `Accept` headers.

Customize the fallback error page with `src/error.html`:

```html
<html>
	<title>%sveltekit.error.message%</title>
	<body>
		<p>Status: %sveltekit.status%</p>
		<p>Message: %sveltekit.error.message%</p>
	</body>
</html>
```

For errors in `load` functions during page rendering, SvelteKit renders the nearest `+error.svelte` component. Exception: errors in root `+layout.js/+layout.server.js` use the fallback error page since the root layout contains the error component.