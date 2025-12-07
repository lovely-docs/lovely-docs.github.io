SvelteKit uses standard `<a>` elements for navigation. Customize link behavior with `data-sveltekit-*` attributes applied to the link or parent element. These attributes also work on `<form method="GET">`.

**data-sveltekit-preload-data**: Preload page data on user interaction to improve perceived performance.
- `"hover"` (default): Start preloading on mouse hover (desktop) or `touchstart` (mobile)
- `"tap"`: Start preloading only on `touchstart` or `mousedown`
- Respects `navigator.connection.saveData` (won't preload if user has reduced data usage enabled)
- Can be programmatically invoked via `preloadData` from `$app/navigation`

Example:
```html
<body data-sveltekit-preload-data="hover">
	<div style="display: contents">%sveltekit.body%</div>
</body>

<a data-sveltekit-preload-data="tap" href="/stonks">
	Get current stonk values
</a>
```

**data-sveltekit-preload-code**: Preload page code with four eagerness levels (only affects code, not data).
- `"eager"`: Preload immediately
- `"viewport"`: Preload when link enters viewport
- `"hover"`: Preload on hover (code only)
- `"tap"`: Preload on tap/click (code only)
- Only applies to links in DOM immediately after navigation; dynamically added links use `hover`/`tap`
- Ignored if user has reduced data usage enabled
- Only has effect if more eager than any `data-sveltekit-preload-data` attribute

**data-sveltekit-reload**: Force full-page browser navigation instead of SvelteKit client-side navigation.
```html
<a data-sveltekit-reload href="/path">Path</a>
```
Also applied automatically to links with `rel="external"` (which are also ignored during prerendering).

**data-sveltekit-replacestate**: Replace current history entry instead of creating new one with `pushState`.
```html
<a data-sveltekit-replacestate href="/path">Path</a>
```

**data-sveltekit-keepfocus**: Retain focus on currently focused element after navigation (useful for search forms that submit while typing).
```html
<form data-sveltekit-keepfocus>
	<input type="text" name="query">
</form>
```
Avoid on links since focus would be on the `<a>` tag itself. Only use on elements that persist after navigation.

**data-sveltekit-noscroll**: Prevent automatic scroll to top (or to `#hash` target) after navigation.
```html
<a href="path" data-sveltekit-noscroll>Path</a>
```

**Disabling options**: Use `"false"` value to disable inherited attributes:
```html
<div data-sveltekit-preload-data>
	<a href="/a">a</a>
	<div data-sveltekit-preload-data="false">
		<a href="/d">d</a>
	</div>
</div>
```

Conditional application:
```svelte
<div data-sveltekit-preload-data={condition ? 'hover' : false}>
```