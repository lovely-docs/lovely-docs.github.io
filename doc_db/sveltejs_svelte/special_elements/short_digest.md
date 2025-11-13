## Special Elements

- **`<svelte:boundary>`** — Error boundary and async state management with `pending` and `failed` snippets. Catches rendering/effect errors only.
- **`<svelte:window>`** — Event listeners and bindable properties (`scrollX`, `scrollY`, `innerWidth`, etc.) on window.
- **`<svelte:document>`** — Event listeners and actions on document with bindable properties (`activeElement`, `visibilityState`, etc.).
- **`<svelte:body>`** — Event listeners and actions on document.body.
- **`<svelte:head>`** — Inserts content into document.head (SSR-aware).
- **`<svelte:element>`** — Renders DOM element with runtime-determined tag name via `this` prop.
- **`<svelte:options>`** — Per-component compiler options (`runes`, `namespace`, `customElement`, `css`).

All must appear at top level except `<svelte:options>`.