## `<svelte:options>` Element

Specifies per-component compiler options.

### Available Options

- `runes={true|false}` — Forces component into runes mode or legacy mode
- `namespace="html|svg|mathml"` — Sets the namespace where the component will be used (default: "html")
- `customElement={...}` — Configures custom element compilation. Pass an object with custom element options or a string to set the tag name
- `css="injected"` — Injects component styles inline as a `<style>` tag during SSR or via JavaScript during client-side rendering

### Deprecated Options (Svelte 4, non-functional in runes mode)

- `immutable={true|false}` — Enables/disables simple referential equality checks for change detection
- `accessors={true|false}` — Adds/removes getters and setters for component props

### Example

```svelte
<svelte:options customElement="my-custom-element" />
```