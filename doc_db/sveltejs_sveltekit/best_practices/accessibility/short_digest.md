## Route announcements
Set unique page titles in `<svelte:head>` so screen readers announce page changes during client-side navigation.

## Focus management
SvelteKit focuses `<body>` after navigation (or an `autofocus` element if present). Customize with `afterNavigate` hook or use `goto` with `keepFocus` option.

## Lang attribute
Set `lang` attribute on `<html>` in `src/app.html`. For multi-language apps, use the server handle hook to replace `%lang%` placeholder based on current page language.