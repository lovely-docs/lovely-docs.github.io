## Form Actions

Export `actions` from `+page.server.js` to handle `POST` requests from `<form>` elements without requiring client-side JavaScript.

### Default and Named Actions

A page can export a `default` action or multiple named actions:

```js
export const actions = {
  login: async ({ cookies, request }) => {
    const data = await request.formData();
    const email = data.get('email');
    const password = data.get('password');
    
    const user = await db.getUser(email);
    cookies.set('sessionid', await db.createSession(user), { path: '/' });
    return { success: true };
  },
  register: async (event) => {
    // handle registration
  }
};
```

Invoke named actions with query parameters: `<form method="POST" action="?/login">` or use `formaction` on buttons: `<button formaction="?/register">`.

### Validation and Errors

Return validation errors using the `fail` function with an HTTP status code:

```js
import { fail } from '@sveltejs/kit';

export const actions = {
  login: async ({ cookies, request }) => {
    const data = await request.formData();
    const email = data.get('email');
    
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

The returned data is available in the page as the `form` prop and `page.form` app-wide.

### Redirects

Use the `redirect` function to redirect after an action completes:

```js
import { redirect } from '@sveltejs/kit';

export const actions = {
  login: async ({ cookies, request, url }) => {
    // ... authentication logic
    
    if (url.searchParams.has('redirectTo')) {
      redirect(303, url.searchParams.get('redirectTo'));
    }
    
    return { success: true };
  }
};
```

### Progressive Enhancement

Use `use:enhance` to progressively enhance forms with JavaScript, preventing full-page reloads while maintaining server-side functionality:

```svelte
<script>
  import { enhance } from '$app/forms';
</script>

<form method="POST" use:enhance>
  <!-- form content -->
</form>
```

Customize behavior with a `SubmitFunction`:

```svelte
<form
  method="POST"
  use:enhance={({ formElement, formData, action, cancel, submitter }) => {
    return async ({ result, update }) => {
      if (result.type === 'redirect') {
        goto(result.location);
      } else {
        await applyAction(result);
      }
    };
  }}
>
```

Implement custom progressive enhancement with a form event listener and `deserialize`:

```svelte
<script>
  import { applyAction, deserialize } from '$app/forms';
  
  async function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget, event.submitter);
    
    const response = await fetch(event.currentTarget.action, {
      method: 'POST',
      body: data
    });
    
    const result = deserialize(await response.text());
    applyAction(result);
  }
</script>

<form method="POST" onsubmit={handleSubmit}>
```

### GET vs POST

Use `method="GET"` for forms that don't modify server state (like search). These use client-side routing instead of full-page navigation and invoke `load` functions but not actions.