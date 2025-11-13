

## Pages

### svelte-boundary
Svelte special element for error boundaries and async state management with pending and failed UI snippets.

## svelte:boundary

Error boundary and async state handler for Svelte components (5.3.0+).

**Properties:**
- `pending` snippet: shown while `await` expressions resolve
- `failed` snippet: rendered on error with `error` and `reset` function
- `onerror` handler: called on error for tracking/logging

**Example:**
```svelte
<svelte:boundary onerror={(e, r) => report(e)}>
	<p>{await data}</p>
	{#snippet pending()}<p>loading...</p>{/snippet}
	{#snippet failed(error, reset)}<button onclick={reset}>retry</button>{/snippet}
</svelte:boundary>
```

**Limitations:** Only catches rendering/effect errors, not event handlers or async callbacks.

### svelte-window
Special element for safely binding to window events and properties with automatic cleanup.

## `<svelte:window>`

Attach event listeners to `window` with automatic cleanup and SSR safety.

```svelte
<svelte:window onkeydown={handleKeydown} />
<svelte:window bind:scrollY={y} />
```

Bindable properties: `innerWidth`, `innerHeight`, `outerWidth`, `outerHeight`, `scrollX`, `scrollY`, `online`, `devicePixelRatio`. Only `scrollX`/`scrollY` are writable. Must be at component top level.

### svelte-document
Special element for attaching event listeners and actions to the document object with bindable properties.

`<svelte:document>` attaches event listeners and actions to the document object. Must be at component top level.

```svelte
<svelte:document onvisibilitychange={handleVisibilityChange} use:someAction />
```

Bindable readonly properties: `activeElement`, `fullscreenElement`, `pointerLockElement`, `visibilityState`

### svelte:body
Special element for attaching event listeners and actions to the document body.

Attach event listeners and actions to `document.body` using `<svelte:body>`. Must be at component top level.

```svelte
<svelte:body onmouseenter={handleMouseenter} onmouseleave={handleMouseleave} use:someAction />
```

### svelte:head
Special element for inserting content into the document head, with SSR support and top-level-only placement requirement.

`<svelte:head>` inserts elements into `document.head`. Must appear only at component top level, never inside blocks or elements.

```svelte
<svelte:head>
	<title>Hello world!</title>
	<meta name="description" content="This is where the description goes for SEO" />
</svelte:head>
```

### svelte-element
Component for rendering DOM elements with tag names determined at runtime.

## `<svelte:element>`

Renders a runtime-determined DOM element tag via the `this` prop. Supports properties and event listeners, but only `bind:this` binding. Throws error if void element has children. Use `xmlns` attribute to specify namespace explicitly.

```svelte
<svelte:element this={tag} />
```

### svelte:options
Configure per-component compiler options using the <svelte:options> element.

The `<svelte:options>` element sets per-component compiler options like `runes`, `namespace`, `customElement`, and `css="injected"`. Deprecated options include `immutable` and `accessors`.

```svelte
<svelte:options customElement="my-custom-element" />
```

