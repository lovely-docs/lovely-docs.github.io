## Form Actions

Export `actions` from `+page.server.js` to handle `POST` requests. Use `default` or named actions:

```js
export const actions = {
  login: async ({ cookies, request }) => {
    const data = await request.formData();
    // process and return { success: true } or fail(400, { error: true })
  }
};
```

Invoke with `<form method="POST" action="?/login">` or `<button formaction="?/register">`.

Return validation errors with `fail(status, data)`. Data is available as `form` prop in the page.

Use `redirect(status, location)` to redirect after action completion.

Progressively enhance with `use:enhance`:

```svelte
<script>
  import { enhance } from '$app/forms';
</script>

<form method="POST" use:enhance>
```

Customize with a `SubmitFunction` callback or implement custom handling with `deserialize` and `applyAction`.