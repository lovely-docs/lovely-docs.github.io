## `<svelte:element>` Component

Renders a DOM element whose tag name is determined at runtime via the `this` prop.

### Basic Usage
```svelte
<script>
	let tag = $state('div');
</script>

<svelte:element this={tag} />
```

### Key Behaviors
- If `this` is nullish, the element and children are not rendered
- Only `bind:this` binding is supported; other Svelte bindings don't work with generic elements
- All properties and event listeners are applied to the rendered element
- `this` must be a valid DOM element tag name (not `#text` or `svelte:head`)

### Void Elements
Void elements (like `br`, `hr`, `img`) cannot have children. Attempting to add children to a void element throws a runtime error in development:

```svelte
<script>
	let tag = $state('hr');
</script>

<svelte:element this={tag}>
	This text cannot appear inside an hr element
</svelte:element>
```

### Namespace Handling
Svelte infers the namespace from context, but you can make it explicit with `xmlns`:

```svelte
<svelte:element this={tag} xmlns="http://www.w3.org/2000/svg" />
```

Use cases: rendering elements from CMS data, dynamic component rendering based on content type.