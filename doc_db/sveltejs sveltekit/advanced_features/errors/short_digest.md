## Expected Errors

```js
import { error } from '@sveltejs/kit';
error(404, { message: 'Not found' });
```

Throws an exception caught by SvelteKit, sets status code, and renders nearest `+error.svelte` with `page.error`.

Customize error shape with `App.Error` interface in TypeScript.

## Unexpected Errors

Any other exception is logged but not exposed to users (sends generic `{ message: "Internal Error" }`). Process in `handleError` hook.

## Error Responses

Customize fallback error page with `src/error.html` using `%sveltekit.status%` and `%sveltekit.error.message%` placeholders. Errors in `load` render nearest `+error.svelte`; errors in root layout use fallback page.