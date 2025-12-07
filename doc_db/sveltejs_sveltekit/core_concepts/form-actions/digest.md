## Form Actions

Server-side form handling in SvelteKit via `+page.server.js` exporting `actions` object. Forms use `POST` requests (never `GET` for side-effects) and work without JavaScript, with optional progressive enhancement.

### Default Actions

```js
// src/routes/login/+page.server.js
export const actions = {
  default: async (event) => {
    // handle form submission
  }
};
```

```svelte
<form method="POST">
  <input name="email" type="email">
  <input name="password" type="password">
  <button>Log in</button>
</form>
```

Invoke from other pages with `<form method="POST" action="/login">`.

### Named Actions

Multiple actions per page using query parameters:

```js
export const actions = {
  login: async (event) => { /* ... */ },
  register: async (event) => { /* ... */ }
};
```

```svelte
<form method="POST" action="?/login">
  <!-- form fields -->
  <button>Log in</button>
  <button formaction="?/register">Register</button>
</form>
```

Cannot mix default and named actions (query parameter would persist in URL).

### Action Anatomy

Actions receive `RequestEvent`, read form data with `request.formData()`, return data available as `form` prop on page and `page.form` app-wide:

```js
import * as db from '$lib/server/db';

export async function load({ cookies }) {
  const user = await db.getUserFromSession(cookies.get('sessionid'));
  return { user };
}

export const actions = {
  login: async ({ cookies, request }) => {
    const data = await request.formData();
    const email = data.get('email');
    const password = data.get('password');
    
    const user = await db.getUser(email);
    cookies.set('sessionid', await db.createSession(user), { path: '/' });
    return { success: true };
  }
};
```

```svelte
<script>
  let { data, form } = $props();
</script>

{#if form?.success}
  <p>Successfully logged in! Welcome back, {data.user.name}</p>
{/if}
```

### Validation Errors

Use `fail(statusCode, data)` to return validation errors with form values:

```js
import { fail } from '@sveltejs/kit';

export const actions = {
  login: async ({ cookies, request }) => {
    const data = await request.formData();
    const email = data.get('email');
    const password = data.get('password');
    
    if (!email) {
      return fail(400, { email, missing: true });
    }
    
    const user = await db.getUser(email);
    if (!user || user.password !== db.hash(password)) {
      return fail(400, { email, incorrect: true });
    }
    
    cookies.set('sessionid', await db.createSession(user), { path: '/' });
    return { success: true };
  }
};
```

```svelte
<form method="POST" action="?/login">
  {#if form?.missing}<p class="error">Email required</p>{/if}
  {#if form?.incorrect}<p class="error">Invalid credentials</p>{/if}
  <input name="email" type="email" value={form?.email ?? ''}>
  <input name="password" type="password">
  <button>Log in</button>
</form>
```

Returned data must be JSON-serializable. Use `id` property or similar to distinguish multiple forms.

### Redirects

Use `redirect(statusCode, location)` after successful action:

```js
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
  login: async ({ cookies, request, url }) => {
    // ... validation and login logic ...
    
    if (url.searchParams.has('redirectTo')) {
      redirect(303, url.searchParams.get('redirectTo'));
    }
    return { success: true };
  }
};
```

### Loading Data

Page's `load` functions run after action completes. `handle` runs before action and doesn't rerun before `load`, so manually update `event.locals` when setting/deleting cookies:

```js
// src/hooks.server.js
export async function handle({ event, resolve }) {
  event.locals.user = await getUser(event.cookies.get('sessionid'));
  return resolve(event);
}
```

```js
// src/routes/account/+page.server.js
export function load(event) {
  return { user: event.locals.user };
}

export const actions = {
  logout: async (event) => {
    event.cookies.delete('sessionid', { path: '/' });
    event.locals.user = null;
  }
};
```

### Progressive Enhancement with use:enhance

Add `use:enhance` directive for client-side form handling without full-page reload:

```svelte
<script>
  import { enhance } from '$app/forms';
  let { form } = $props();
</script>

<form method="POST" use:enhance>
  <!-- form fields -->
</form>
```

Without arguments, `use:enhance` emulates browser behavior: updates `form`/`page.form`/`page.status`, resets form, invalidates all data on success, calls `goto` on redirect, renders error boundary on error, resets focus.

Customize with `SubmitFunction`:

```svelte
<form
  method="POST"
  use:enhance={({ formElement, formData, action, cancel, submitter }) => {
    // runs before submission
    return async ({ result, update }) => {
      // runs after submission
      // result is ActionResult object
      // call update() for default behavior
    };
  }}
>
```

Use `applyAction` to manually handle results:

```svelte
<script>
  import { enhance, applyAction } from '$app/forms';
  let { form } = $props();
</script>

<form
  method="POST"
  use:enhance={({ formElement, formData, action, cancel }) => {
    return async ({ result }) => {
      if (result.type === 'redirect') {
        goto(result.location);
      } else {
        await applyAction(result);
      }
    };
  }}
>
```

`applyAction(result)` behavior:
- `success`, `failure`: sets `page.status` to `result.status`, updates `form` and `page.form` to `result.data`
- `redirect`: calls `goto(result.location, { invalidateAll: true })`
- `error`: renders nearest error boundary with `result.error`

### Custom Event Listener

Implement progressive enhancement manually:

```svelte
<script>
  import { invalidateAll, goto } from '$app/navigation';
  import { applyAction, deserialize } from '$app/forms';
  let { form } = $props();

  async function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget, event.submitter);
    
    const response = await fetch(event.currentTarget.action, {
      method: 'POST',
      body: data
    });
    
    const result = deserialize(await response.text());
    
    if (result.type === 'success') {
      await invalidateAll();
    }
    
    applyAction(result);
  }
</script>

<form method="POST" onsubmit={handleSubmit}>
  <!-- form fields -->
</form>
```

Must use `deserialize` from `$app/forms` (not `JSON.parse`) to handle `Date` and `BigInt` objects.

To POST to `+page.server.js` action when `+server.js` exists, use header:

```js
const response = await fetch(this.action, {
  method: 'POST',
  body: data,
  headers: { 'x-sveltekit-action': 'true' }
});
```

### Alternatives

Use `+server.js` files for JSON APIs instead of form actions:

```svelte
<script>
  function rerun() {
    fetch('/api/ci', { method: 'POST' });
  }
</script>

<button onclick={rerun}>Rerun CI</button>
```

```js
// src/routes/api/ci/+server.js
export function POST() {
  // do something
}
```

### GET vs POST

Use `method="GET"` (or no method) for forms that don't POST data (e.g., search). SvelteKit treats them like `<a>` elements, using client-side router without full-page navigation. Invokes `load` function but not actions. Supports `data-sveltekit-reload`, `data-sveltekit-replacestate`, `data-sveltekit-keepfocus`, `data-sveltekit-noscroll` attributes.

```html
<form action="/search">
  <input name="q">
</form>
```

Navigates to `/search?q=...` without invoking action.