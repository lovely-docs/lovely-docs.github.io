## `<svelte:element>` Component

Renders a DOM element with a runtime-determined tag name via the `this` prop.

```svelte
<svelte:element this={tag} />
```

- If `this` is nullish, nothing renders
- Only `bind:this` binding works
- Void elements cannot have children (throws error in dev)
- Use `xmlns` attribute to explicitly set namespace for SVG/XML elements