## applyAction

Updates the `form` property of the current page with given data and updates `page.status`. Redirects to the nearest error page on error.

```js
import { applyAction } from '$app/forms';
await applyAction(result);
```

## deserialize

Deserializes the response text from a form submission into an ActionResult object.

```js
import { deserialize } from '$app/forms';

const response = await fetch('/form?/action', {
	method: 'POST',
	body: new FormData(event.target)
});
const result = deserialize(await response.text());
```

## enhance

Enhances a `<form>` element to work without JavaScript by intercepting submission.

The `submit` callback receives FormData and the action to trigger. Call `cancel()` to prevent submission. Use the `controller` to abort if another submission starts. If a function is returned, it's called with the server response.

Default behavior (if no callback or callback returns nothing):
- Updates `form` prop with returned data if action is on same page
- Updates `page.status`
- Resets form and invalidates all data on successful submission without redirect
- Redirects on redirect response
- Redirects to error page on unexpected error

Custom callback can invoke `update(options)` to use default behavior with options:
- `reset: false` - don't reset form values after successful submission
- `invalidateAll: false` - don't call invalidateAll after submission

```js
import { enhance } from '$app/forms';

<form use:enhance={(submit) => {
	return async (result) => {
		// custom handling
		await update({ reset: false });
	};
}}>
```