## Rest parameters

Use `[...file]` syntax to match variable number of segments. Example: `/[org]/[repo]/tree/[branch]/[...file]` matches `/sveltejs/kit/tree/main/documentation/docs/04-advanced-routing.md` and provides `{org: 'sveltejs', repo: 'kit', branch: 'main', file: 'documentation/docs/04-advanced-routing.md'}`.

Routes like `src/routes/a/[...rest]/z/+page.svelte` match `/a/z` (empty rest), `/a/b/z`, `/a/b/c/z`, etc. Validate rest parameter values using matchers.

### 404 pages

Rest parameters enable custom 404 handling. If route `/marx-brothers/karl` doesn't match any route, the nested `marx-brothers/+error.svelte` won't render. Create a catch-all route with rest parameter that returns 404:

```
src/routes/marx-brothers/[...path]/+page.js
```

```js
import { error } from '@sveltejs/kit';
export function load(event) {
	error(404, 'Not Found');
}
```

Unhandled 404s appear in `handleError` hook.

## Optional parameters

Wrap parameter in double brackets to make optional: `[[lang]]/home` matches both `home` and `en/home`. Optional parameters cannot follow rest parameters (`[...rest]/[[optional]]` is invalid) since rest matches greedily.

## Matching

Matchers validate route parameters. Create `src/params/fruit.js`:

```js
export function match(param) {
	return param === 'apple' || param === 'orange';
}
```

Use in route: `src/routes/fruits/[page=fruit]`. If pathname doesn't match, SvelteKit tries other routes before returning 404. Matchers run on server and browser. Test files `*.test.js` and `*.spec.js` in params directory are excluded.

## Sorting

When multiple routes match a path, SvelteKit sorts by:
1. Specificity (no parameters > one parameter > more parameters)
2. Matchers (`[name=type]` > `[name]`)
3. `[[optional]]` and `[...rest]` lowest priority unless final segment
4. Alphabetical ties

Example: `/foo-abc` matches these routes in priority order:
```
src/routes/foo-abc/+page.svelte
src/routes/foo-[c]/+page.svelte
src/routes/[[a=x]]/+page.svelte
src/routes/[b]/+page.svelte
src/routes/[...catchall]/+page.svelte
```

## Encoding

Characters with special meaning in URLs or SvelteKit use hexadecimal escape sequences `[x+nn]`:
- `\` → `[x+5c]`, `/` → `[x+2f]`, `:` → `[x+3a]`, `*` → `[x+2a]`, `?` → `[x+3f]`, `"` → `[x+22]`, `<` → `[x+3c]`, `>` → `[x+3e]`, `|` → `[x+7c]`, `#` → `[x+23]`, `%` → `[x+25]`, `[` → `[x+5b]`, `]` → `[x+5d]`, `(` → `[x+28]`, `)` → `[x+29]`

Example: `/smileys/:-)` → `src/routes/smileys/[x+3a]-[x+29]/+page.svelte`

Get hex code: `':'.charCodeAt(0).toString(16)` → `'3a'`

Unicode escapes `[u+nnnn]` (0000-10ffff) also work: `src/routes/[u+d83e][u+dd2a]/+page.svelte` equals `src/routes/🤪/+page.svelte`. Useful for `.well-known` routes: `src/routes/[x+2e]well-known/...`

## Advanced layouts

### (group)

Group routes with parentheses `(app)`, `(marketing)` — they don't affect URL pathname. Routes in different groups inherit different layouts:

```
src/routes/
├ (app)/
│ ├ dashboard/
│ ├ item/
│ └ +layout.svelte
├ (marketing)/
│ ├ about/
│ ├ testimonials/
│ └ +layout.svelte
├ admin/
└ +layout.svelte
```

`/admin` doesn't inherit `(app)` or `(marketing)` layouts. Can put `+page` directly in `(group)`.

### Breaking out of layouts

Root layout applies to all pages (defaults to `{@render children()}`). Put app inside groups except routes that shouldn't inherit common layouts.

### +page@

Pages break out of layout hierarchy per-route using `@segment`:

```
src/routes/
├ (app)/
│ ├ item/
│ │ ├ [id]/
│ │ │ ├ embed/
│ │ │ │ └ +page@(app).svelte
│ │ │ └ +layout.svelte
│ │ └ +layout.svelte
│ └ +layout.svelte
└ +layout.svelte
```

Options for `/item/[id]/embed`:
- `+page@[id].svelte` - inherits from `[id]/+layout.svelte`
- `+page@item.svelte` - inherits from `item/+layout.svelte`
- `+page@(app).svelte` - inherits from `(app)/+layout.svelte`
- `+page@.svelte` - inherits from root `+layout.svelte`

### +layout@

Layouts break out similarly: `+layout@.svelte` resets hierarchy for child routes.

```
src/routes/
├ (app)/
│ ├ item/
│ │ ├ [id]/
│ │ │ ├ embed/
│ │ │ │ └ +page.svelte
│ │ │ ├ +layout.svelte
│ │ │ └ +page.svelte
│ │ └ +layout@.svelte
│ └ +layout.svelte
└ +layout.svelte
```

### When to use layout groups

Not all cases need layout groups. Consider composition (reusable load functions, Svelte components) or conditionals:

```svelte
<!--- file: src/routes/nested/route/+layout@.svelte --->
<script>
	import ReusableLayout from '$lib/ReusableLayout.svelte';
	let { data, children } = $props();
</script>

<ReusableLayout {data}>
	{@render children()}
</ReusableLayout>
```

```js
import { reusableLoad } from '$lib/reusable-load-function';
export function load(event) {
	return reusableLoad(event);
}
```