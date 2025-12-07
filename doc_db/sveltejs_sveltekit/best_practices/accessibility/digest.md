## Route announcements

SvelteKit uses client-side routing, so page navigations don't trigger full reloads. To compensate, SvelteKit injects a live region that announces the new page title to screen readers after navigation. Every page must have a unique, descriptive `<title>` in a `<svelte:head>` block:

```svelte
<svelte:head>
	<title>Todo List</title>
</svelte:head>
```

## Focus management

SvelteKit automatically focuses the `<body>` element after navigation and form submission to simulate traditional server-rendered behavior. If an element has the `autofocus` attribute, that element is focused instead.

Customize focus management with the `afterNavigate` hook:

```js
import { afterNavigate } from '$app/navigation';

afterNavigate(() => {
	const to_focus = document.querySelector('.focus-me');
	to_focus?.focus();
});
```

The `goto()` function accepts a `keepFocus` option to preserve the currently-focused element instead of resetting focus. Ensure the focused element still exists after navigation.

## The "lang" attribute

Set the `lang` attribute on the `<html>` element in `src/app.html` to the document's language for correct assistive technology pronunciation:

```html
<html lang="de">
```

For multi-language content, set `lang` dynamically using the server hook:

```html
<!-- src/app.html -->
<html lang="%lang%">
```

```js
// src/hooks.server.js
export function handle({ event, resolve }) {
	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', get_lang(event))
	});
}
```

SvelteKit provides accessible defaults but you remain responsible for accessible application code. Svelte's compile-time accessibility checks apply to SvelteKit apps.