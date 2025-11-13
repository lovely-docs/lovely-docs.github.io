## `<svelte:element>` Component

Renders a DOM element whose tag name is determined at runtime via the `this` prop.

**Basic Usage:**
```svelte
<script>
	let tag = $state('hr');
</script>

<svelte:element this={tag}>
	Content here
</svelte:element>
```

**Key Behaviors:**
- If `this` is nullish, the element and children are not rendered
- Only `bind:this` binding is supported; other Svelte bindings don't work with generic elements
- All properties and event listeners are applied to the element
- Throws a runtime error in development if `this` is a void element (like `br`, `hr`) but has child content

**Namespace Handling:**
Svelte infers the namespace from context, but you can make it explicit:
```svelte
<svelte:element this={tag} xmlns="http://www.w3.org/2000/svg" />
```

**Constraints:**
- `this` must be a valid DOM element tag name
- Invalid values like `#text` or `svelte:head` will not work