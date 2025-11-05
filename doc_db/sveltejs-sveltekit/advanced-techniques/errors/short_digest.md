## Expected vs Unexpected Errors

**Expected errors** use the `error()` helper to throw exceptions that SvelteKit catches and renders with `+error.svelte`:

```js
import { error } from '@sveltejs/kit';
error(404, 'Not found');
// or with custom properties:
error(404, { message: 'Not found', code: 'NOT_FOUND' });
```

**Unexpected errors** are other exceptions. They show a generic message to users and pass through the `handleError` hook for custom handling.

## Type Safety

Declare custom error properties in `src/app.d.ts`:

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

Customize the fallback error page with `src/error.html` using `%sveltekit.status%` and `%sveltekit.error.message%` placeholders. Errors in `load` functions render the nearest `+error.svelte`, except in root layouts which use the fallback page.