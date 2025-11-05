## Route announcements
Every page needs a unique `<title>` in `<svelte:head>` so screen readers announce page changes during client-side navigation.

## Focus management
SvelteKit focuses `<body>` after navigation (or an `autofocus` element if present). Customize with `afterNavigate` hook. The `goto` function has a `keepFocus` option to preserve focus.

## Language attribute
Set `lang` attribute on `<html>` in `src/app.html`. Use the `handle` hook to set it dynamically for multi-language apps.