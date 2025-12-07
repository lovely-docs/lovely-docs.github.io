## Special Elements Reference

Svelte provides special elements prefixed with `svelte:` for accessing browser APIs and controlling rendering behavior.

### Error Boundary (`<svelte:boundary>`)
Creates error boundaries to catch rendering/effect errors. Shows pending UI while `await` expressions resolve, and failed UI when errors occur. Receives `pending` and `failed` snippets, plus optional `onerror` handler. **Limitation**: Only catches rendering/effect errors, not event handler or external async errors.

```svelte
<svelte:boundary onerror={(error, reset) => {}}>
  <p>{await delayed('hello!')}</p>
  {#snippet pending()}
    <p>loading...</p>
  {/snippet}
  {#snippet failed(error, reset)}
    <button onclick={reset}>retry</button>
  {/snippet}
</svelte:boundary>
```

### Window/Document/Body (`<svelte:window>`, `<svelte:document>`, `<svelte:body>`)
Attach event listeners and bind to properties with automatic cleanup. Must be top-level only.

**svelte:window** - Bindable properties: `innerWidth`, `innerHeight`, `outerWidth`, `outerHeight`, `scrollX` (writable), `scrollY` (writable), `online`, `devicePixelRatio`. Attach events: `onkeydown`, `onresize`, etc.

**svelte:document** - Bindable properties: `activeElement`, `fullscreenElement`, `pointerLockElement`, `visibilityState`. Attach events like `onvisibilitychange`.

**svelte:body** - Attach events like `onmouseenter`, `onmouseleave` that don't fire on window.

```svelte
<svelte:window bind:scrollY={y} onkeydown={handleKeydown} />
<svelte:document bind:visibilityState={state} onvisibilitychange={handler} />
<svelte:body onmouseenter={enter} onmouseleave={leave} />
```

### Head (`<svelte:head>`)
Inserts elements into `document.head`. Top-level only. Useful for title, meta tags, and SEO.

```svelte
<svelte:head>
  <title>Page Title</title>
  <meta name="description" content="..." />
</svelte:head>
```

### Dynamic Element (`<svelte:element>`)
Renders DOM element with tag name from `this` prop. Only `bind:this` binding supported. Throws error if void element (br, hr) has children. Use `xmlns` for explicit namespace (e.g., SVG).

```svelte
<svelte:element this={tagName} xmlns="http://www.w3.org/2000/svg" />
```

### Options (`<svelte:options>`)
Per-component compiler options: `runes={true|false}`, `namespace="html|svg|mathml"`, `customElement="tag-name"`, `css="injected"`. Deprecated: `immutable`, `accessors`.

```svelte
<svelte:options customElement="my-element" namespace="svg" />
```