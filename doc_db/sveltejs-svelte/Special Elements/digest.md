## Special Elements

Built-in components for accessing browser APIs and modifying the document.

### `<svelte:boundary>`
Error boundary that catches rendering, update, and effect errors. Displays optional `failed` snippet or calls `onerror` callback with error and reset function. Does not catch event handler or async errors.

```svelte
<svelte:boundary>
	<Component />
	{#snippet failed(error, reset)}
		<button onclick={reset}>Retry</button>
	{/snippet}
</svelte:boundary>
```

### `<svelte:window>`
Attaches event listeners to window with automatic cleanup. Bindable properties: `innerWidth`, `innerHeight`, `outerWidth`, `outerHeight`, `scrollX`, `scrollY`, `online`, `devicePixelRatio`. Must be at component top level.

```svelte
<svelte:window onkeydown={handleKeydown} bind:scrollY={y} />
```

### `<svelte:document>`
Attach event listeners and actions to `document`. Bindable readonly properties: `activeElement`, `fullscreenElement`, `pointerLockElement`, `visibilityState`. Must be at component top level.

```svelte
<svelte:document onvisibilitychange={handler} bind:activeElement={el} />
```

### `<svelte:body>`
Attaches event listeners and actions to `document.body`. Use for events like `mouseenter` and `mouseleave` that don't fire on `window`. Must be at component top level.

```svelte
<svelte:body onmouseenter={handler} onmouseleave={handler} />
```

### `<svelte:head>`
Inserts elements into `document.head`. Must appear only at component top level.

```svelte
<svelte:head>
	<title>Hello world!</title>
	<meta name="description" content="SEO" />
</svelte:head>
```

### `<svelte:element>`
Renders a DOM element with runtime-determined tag name via `this` prop. If `this` is nullish, nothing renders. Use `xmlns` attribute for SVG/XML namespaces.

```svelte
<svelte:element this={tag} />
```

### `<svelte:options>`
Specifies per-component compiler options: `runes={true|false}`, `namespace="html|svg|mathml"`, `customElement="name"`, `css="injected"`.

```svelte
<svelte:options customElement="my-element" />
```