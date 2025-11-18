## Rest Parameters
`[...file]` matches variable segments: `/[org]/[repo]/tree/[branch]/[...file]` → `file: 'documentation/docs/04-advanced-routing.md'`

## Optional Parameters
`[[lang]]/home` matches both `home` and `en/home`

## Matchers
Validate parameters with `src/params/fruit.js` containing `match(param)` function, use as `[page=fruit]`

## Route Sorting
Specificity > matchers > optional/rest > alphabetical. `/foo-abc` matches `foo-abc/+page.svelte` before `foo-[c]/+page.svelte`

## Encoding
`[x+3a]` for `:`, `[x+2f]` for `/`. Example: `/smileys/:-)` → `src/routes/smileys/[x+3a]-[x+29]/+page.svelte`

## Layout Groups
`(app)` and `(marketing)` groups organize routes without affecting URLs, each with separate layouts

## Breaking Out of Layouts
`+page@(app).svelte` resets hierarchy to `(app)` layout, `+page@.svelte` to root layout