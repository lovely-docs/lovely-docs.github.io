## Link Navigation Attributes

SvelteKit uses standard `<a>` elements for navigation. Customize behavior with `data-sveltekit-*` attributes applied to links or parent elements. These also apply to `<form method="GET">`.

### data-sveltekit-preload-data
Controls when page data is preloaded:
- `"hover"` (default): preload on mouse hover or touchstart
- `"tap"`: preload only on click/tap

Respects `navigator.connection.saveData` for reduced data usage.

```html
<a data-sveltekit-preload-data="tap" href="/stonks">Get values</a>
```

### data-sveltekit-preload-code
Controls when page code is preloaded (prerequisite for data preloading):
- `"eager"`: preload immediately
- `"viewport"`: preload when link enters viewport
- `"hover"`: preload code on hover
- `"tap"`: preload code on tap

Only applies to links in DOM immediately after navigation. Ignored if user has reduced data usage enabled.

### data-sveltekit-reload
Forces full-page browser navigation instead of SvelteKit handling:
```html
<a data-sveltekit-reload href="/path">Path</a>
```

Links with `rel="external"` behave the same way and are ignored during prerendering.

### data-sveltekit-replacestate
Replaces current history entry instead of creating new one:
```html
<a data-sveltekit-replacestate href="/path">Path</a>
```

### data-sveltekit-keepfocus
Retains focus on currently focused element after navigation:
```html
<form data-sveltekit-keepfocus>
	<input type="text" name="query">
</form>
```

Avoid on links; use only on elements that persist after navigation.

### data-sveltekit-noscroll
Prevents automatic scroll to top (or hash target) after navigation:
```html
<a href="path" data-sveltekit-noscroll>Path</a>
```

### Disabling Options
Set attribute to `"false"` to disable within a scoped element:
```html
<div data-sveltekit-preload-data>
	<a href="/a">preloaded</a>
	<div data-sveltekit-preload-data="false">
		<a href="/b">not preloaded</a>
	</div>
</div>
```

Use conditional syntax: `data-sveltekit-preload-data={condition ? 'hover' : false}`