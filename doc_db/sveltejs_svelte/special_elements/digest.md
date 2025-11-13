## Special Elements

Svelte provides special elements for managing errors, accessing global objects, and rendering dynamic content.

### `<svelte:boundary>`
Error boundary and async state management. Catches rendering and effect errors, shows fallback UI, and handles pending states during async operations.

```svelte
<svelte:boundary onerror={(error, reset) => report(error)}>
	<FlakyComponent />
	{#snippet pending()}
		<p>loading...</p>
	{/snippet}
	{#snippet failed(error, reset)}
		<button onclick={reset}>retry</button>
	{/snippet}
</svelte:boundary>
```

Only catches errors during rendering and effects, not in event handlers or async callbacks. Available since Svelte 5.3.0.

### `<svelte:window>`
Attaches event listeners to `window` with automatic cleanup. Bindable properties: `innerWidth`, `innerHeight`, `outerWidth`, `outerHeight`, `scrollX`, `scrollY`, `online`, `devicePixelRatio`.

```svelte
<svelte:window onkeydown={handleKeydown} bind:scrollY={y} />
```

### `<svelte:document>`
Attaches event listeners and actions to `document`. Bindable readonly properties: `activeElement`, `fullscreenElement`, `pointerLockElement`, `visibilityState`.

```svelte
<svelte:document onvisibilitychange={handler} use:someAction />
```

### `<svelte:body>`
Attaches event listeners and actions to `document.body`.

```svelte
<svelte:body onmouseenter={handleMouseenter} use:someAction />
```

### `<svelte:head>`
Inserts content into `document.head`. During SSR, head content is exposed separately.

```svelte
<svelte:head>
	<title>Hello world!</title>
	<meta name="description" content="..." />
</svelte:head>
```

### `<svelte:element>`
Renders a DOM element with runtime-determined tag name via the `this` prop. If `this` is nullish, nothing renders. Only `bind:this` binding is supported.

```svelte
<svelte:element this={tag} xmlns="http://www.w3.org/2000/svg">
	Content
</svelte:element>
```

### `<svelte:options>`
Configures per-component compiler options: `runes`, `namespace`, `customElement`, `css`.

```svelte
<svelte:options customElement="my-element" namespace="svg" />
```

All special elements except `<svelte:options>` must appear only at the top level of a component.