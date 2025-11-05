## Default Actions

Export an `actions` object with a `default` action from `+page.server.js` to handle form submissions:

```js
export const actions = {
	default: async (event) => {
		// handle POST
	}
};
```

Use a `<form method="POST">` to invoke it. The action receives a `RequestEvent` and can read form data via `request.formData()`.

## Named Actions

Define multiple named actions instead of a default:

```js
export const actions = {
	login: async (event) => {},
	register: async (event) => {}
};
```

Invoke with query parameters: `<form method="POST" action="?/login">` or use `formaction` on buttons: `<button formaction="?/register">`.

Cannot mix default and named actions on the same page.

## Returning Data

Actions return data available as the `form` prop on the page:

```js
export const actions = {
	login: async ({ cookies, request }) => {
		const data = await request.formData();
		const email = data.get('email');
		cookies.set('sessionid', await db.createSession(user), { path: '/' });
		return { success: true };
	}
};
```

```svelte
{#if form?.success}
	<p>Successfully logged in!</p>
{/if}
```

## Validation Errors

Use the `fail` function to return HTTP status codes with validation errors:

```js
import { fail } from '@sveltejs/kit';

export const actions = {
	login: async ({ request }) => {
		const data = await request.formData();
		const email = data.get('email');
		if (!email) {
			return fail(400, { email, missing: true });
		}
	}
};
```

```svelte
{#if form?.missing}<p class="error">Email required</p>{/if}
<input value={form?.email ?? ''}>
```

## Redirects

Use the `redirect` function to redirect after successful action:

```js
import { redirect } from '@sveltejs/kit';

export const actions = {
	login: async ({ cookies, request, url }) => {
		// ... login logic
		if (url.searchParams.has('redirectTo')) {
			redirect(303, url.searchParams.get('redirectTo'));
		}
		return { success: true };
	}
};
```

## Progressive Enhancement

Add `use:enhance` to progressively enhance forms without full-page reloads:

```svelte
<script>
	import { enhance } from '$app/forms';
</script>

<form method="POST" use:enhance>
```

Customize behavior with a `SubmitFunction`:

```svelte
<form method="POST" use:enhance={({ formData, cancel }) => {
	return async ({ result }) => {
		if (result.type === 'redirect') {
			goto(result.location);
		} else {
			await applyAction(result);
		}
	};
}>
```

Use `applyAction` to manually handle results. Use `deserialize` when implementing custom event listeners with `fetch`.

## Loading Data

Page `load` functions run after actions complete. If using `handle` to populate `event.locals` from cookies, manually update `event.locals` when setting/deleting cookies in actions.

## GET vs POST

Use `method="POST"` for actions. Use `method="GET"` for search/filter forms—these invoke `load` functions but not actions, and use client-side routing.