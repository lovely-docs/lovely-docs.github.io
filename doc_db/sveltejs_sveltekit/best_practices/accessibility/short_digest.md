**Route announcements**: Set unique `<title>` in `<svelte:head>` on each page so screen readers announce navigation.

**Focus management**: SvelteKit focuses `<body>` after navigation; customize with `afterNavigate()` hook or `goto({ keepFocus: true })`.

**Language**: Set `lang` attribute on `<html>` in `src/app.html`, or dynamically via server hook's `transformPageChunk`.