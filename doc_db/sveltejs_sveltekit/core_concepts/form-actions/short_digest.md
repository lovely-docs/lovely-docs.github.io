## Form Actions

Server-side form handling via `+page.server.js` exporting `actions` object. Forms use `POST` (never `GET` for side-effects), work without JavaScript, support progressive enhancement.

**Default action:**
```js
export const actions = {
  default: async (event) => { /* ... */ }
};
```

**Named actions with query parameters:**
```js
export const actions = {
  login: async (event) => { /* ... */ },
  register: async (event) => { /* ... */ }
};
```
```svelte
<form method="POST" action="?/login">
  <button formaction="?/register">Register</button>
</form>
```

**Action receives RequestEvent, reads form data, returns data as `form` prop:**
```js
export const actions = {
  login: async ({ cookies, request }) => {
    const data = await request.formData();
    const email = data.get('email');
    // ... process ...
    return { success: true };
  }
};
```

**Validation errors with `fail(statusCode, data)`:**
```js
if (!email) return fail(400, { email, missing: true });
```

**Redirects with `redirect(statusCode, location)`:**
```js
if (url.searchParams.has('redirectTo')) {
  redirect(303, url.searchParams.get('redirectTo'));
}
```

**Progressive enhancement with `use:enhance`:**
```svelte
<script>
  import { enhance } from '$app/forms';
</script>
<form method="POST" use:enhance>
```

Customize with `SubmitFunction` callback. Use `applyAction` to manually handle results. Manual implementation with `deserialize` from `$app/forms` also supported.

**GET forms** (no action invoked, client-side navigation):
```html
<form action="/search">
  <input name="q">
</form>
```