## Rest Parameters
`[...file]` matches variable segments: `/[org]/[repo]/tree/[branch]/[...file]` with `/sveltejs/kit/tree/main/docs/file.md` gives `file: 'docs/file.md'`.

## Optional Parameters
`[[lang]]/home` matches both `home` and `en/home`.

## Matching
Create `src/params/fruit.js` with `match(param)` function, use `[page=fruit]` in routes.

## Sorting
Specificity > matchers > optional/rest > alphabetical. `/foo-abc` matches `foo-abc/+page.svelte` before `foo-[c]/+page.svelte`.

## Encoding
`[x+3a]` for `:`, `[x+2f]` for `/`. `/smileys/:-)` becomes `src/routes/smileys/[x+3a]-[x+29]/+page.svelte`.

## Layout Groups
`(app)` and `(marketing)` organize routes without URL changes. Use `+page@(app).svelte` to inherit from `(app)` layout only.