## Custom Elements

Compile Svelte components to web components with `customElement: true` and `<svelte:options customElement="my-element" />`. Props are exposed as DOM properties and attributes.

```svelte
<svelte:options customElement="my-element" />
<script>
	let { name = 'world' } = $props();
</script>
<h1>Hello {name}!</h1>
```

Register with `customElements.define('my-element', MyElement.element)`.

Configure with object syntax: `tag`, `shadow: "none"`, `props` (with `attribute`, `reflect`, `type`), and `extend` function for lifecycle customization.

**Key differences**: styles are encapsulated, slotted content renders eagerly, context doesn't cross custom element boundaries, properties starting with `on` become event listeners.