## Rest Parameters
Use `[...file]` syntax to match variable number of segments. Example: `/[org]/[repo]/tree/[branch]/[...file]` matches `/sveltejs/kit/tree/main/documentation/docs/04-advanced-routing.md` with `file: 'documentation/docs/04-advanced-routing.md'`. Rest parameters match zero or more segments, so `[...rest]` matches both `/a/z` and `/a/b/c/z`.

## Custom 404 Pages
Create a catch-all route with rest parameters to render nested error pages. Use `[...path]` in `src/routes/marx-brothers/[...path]/+page.js` and return `error(404, 'Not Found')` to handle unmatched paths within a section.

## Optional Parameters
Wrap parameters in double brackets to make them optional: `[[lang]]/home` matches both `home` and `en/home`. Optional parameters cannot follow rest parameters due to greedy matching.

## Matchers
Validate route parameters using matchers in the `params` directory. Create `src/params/fruit.js` with a `match(param)` function returning boolean. Use in routes as `[page=fruit]`. Matchers run on both server and browser.

## Route Sorting
When multiple routes match a path, SvelteKit prioritizes by:
1. Specificity (no parameters > dynamic parameters)
2. Matchers (`[name=type]` > `[name]`)
3. Optional/rest parameters have lowest priority unless final
4. Alphabetical tiebreaker

Example: `/foo-abc` matches `src/routes/foo-abc/+page.svelte` before `src/routes/foo-[c]/+page.svelte`.

## Encoding Special Characters
Use hexadecimal escape sequences `[x+nn]` for filesystem-incompatible characters: `[x+3a]` for `:`, `[x+2f]` for `/`, `[x+23]` for `#`. Example: `/smileys/:-)` becomes `src/routes/smileys/[x+3a]-[x+29]/+page.svelte`. Unicode sequences `[u+nnnn]` also work: `[u+d83e][u+dd2a]` or `🤪` are equivalent.

## Layout Groups
Use `(group)` directories to organize routes without affecting URLs. Routes in `(app)` and `(marketing)` groups can have separate layouts while sharing the same URL structure. Groups don't appear in the pathname.

## Breaking Out of Layouts
Use `+page@segment` or `+layout@segment` to reset the layout hierarchy. `+page@.svelte` inherits only the root layout, `+page@(app).svelte` inherits up to the `(app)` group layout. Layouts can also break out using `+layout@.svelte`.