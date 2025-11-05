## Form Actions Basics

Export `actions` from `+page.server.js` to handle POST requests:

```js
export const actions = {
	default: async (event) => {},
	login: async (event) => {},
	register: async (event) => {}
};
```

Invoke with `<form method="POST" action="?/login">` or `<button formaction="?/register">`.

## Handling Data & Errors

Read form data and return results:

```js
export const actions = {
	login: async ({ request }) => {
		const data = await request.formData();
		if (!data.get('email')) {
			return fail(400, { missing: true });
		}
		return { success: true };
	}
};
```

Access in component via `form` prop. Use `redirect()` for redirects.

## Progressive Enhancement

Add `use:enhance` for client-side form handling without full-page reloads:

```svelte
<script>
	import { enhance, applyAction } from '$app/forms';
</script>

<form method="POST" use:enhance={({ formData }) => {
	return async ({ result }) => {
		await applyAction(result);
	};
}>
```

Use `deserialize` when implementing custom fetch-based handlers.