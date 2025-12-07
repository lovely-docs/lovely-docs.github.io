## Expected vs Unexpected Errors

Expected errors use `error(status, message)` helper, caught by SvelteKit to render `+error.svelte` with `page.error`. Unexpected errors are generic `{ message: "Internal Error" }` for security, passed to `handleError` hook.

## Error Responses

Errors in `handle`/`+server.js` use fallback page or JSON. Customize with `src/error.html` using `%sveltekit.status%` and `%sveltekit.error.message%` placeholders. Errors in `load` render nearest `+error.svelte`; root layout errors use fallback.

## Type Safety

Define `App.Error` interface in `src/app.d.ts` to add custom properties (always includes `message: string`):
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