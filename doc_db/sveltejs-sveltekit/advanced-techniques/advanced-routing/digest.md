## Rest Parameters
Use `[...file]` syntax to match variable number of segments. Example: `/[org]/[repo]/tree/[branch]/[...file]` matches `/sveltejs/kit/tree/main/documentation/docs/04-advanced-routing.md` with `file: 'documentation/docs/04-advanced-routing.md'`. Rest parameters match zero or more segments, so `[...rest]` matches both `/a/z` and `/a/b/c/z`.

## 404 Pages
Create a catch-all route with rest parameters to render custom 404s. Create `src/routes/marx-brothers/[...path]/+page.js` that calls `error(404, 'Not Found')` to handle unmatched paths within a directory.

## Optional Parameters
Wrap parameters in double brackets to make them optional: `[[lang]]/home` matches both `home` and `en/home`. Optional parameters cannot follow rest parameters.

## Matching
Use matchers to validate route parameters. Create `src/params/fruit.js` with a `match(param)` function returning boolean, then use `[page=fruit]` in routes. Matchers run on both server and browser.

## Sorting
When multiple routes match a path, SvelteKit prioritizes by: (1) specificity (no parameters > dynamic parameters), (2) matchers (`[name=type]` > `[name]`), (3) optional/rest parameters lowest priority unless final, (4) alphabetical ties. Example: `/foo-abc` matches `foo-abc/+page.svelte` before `foo-[c]/+page.svelte`.

## Encoding
Use hexadecimal escape sequences `[x+nn]` for special characters: `[x+3a]` for `:`, `[x+2f]` for `/`, `[x+23]` for `#`, etc. Use Unicode sequences `[u+nnnn]` for emoji: `[u+d83e][u+dd2a]` or just `🤪`. Example: `/smileys/:-)` becomes `src/routes/smileys/[x+3a]-[x+29]/+page.svelte`.

## Layout Groups
Use `(group)` directories to organize routes without affecting URLs. Routes in `(app)` and `(marketing)` groups have separate layouts. Break out of layout hierarchy with `+page@segment` or `+layout@segment` syntax. `+page@.svelte` inherits only root layout, `+page@(app).svelte` inherits from `(app)` layout.