## Special Elements

Built-in components for browser APIs and document manipulation.

- **`<svelte:boundary>`** — Error boundary catching rendering/effect errors with `failed` snippet or `onerror` callback
- **`<svelte:window>`** — Window event listeners and bindable properties (innerWidth, scrollY, etc.)
- **`<svelte:document>`** — Document event listeners and readonly bindings (activeElement, visibilityState)
- **`<svelte:body>`** — Body event listeners for mouseenter/mouseleave
- **`<svelte:head>`** — Insert elements into document head
- **`<svelte:element>`** — Render elements with runtime-determined tag names
- **`<svelte:options>`** — Per-component compiler configuration (runes mode, namespace, customElement)