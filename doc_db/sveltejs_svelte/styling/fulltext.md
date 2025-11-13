

## Pages

### scoped_styles
Svelte automatically scopes component styles using hash-based classes to prevent style leakage, with specificity handling and support for scoped keyframes.

Svelte scopes component styles by adding a hash-based class (e.g., `svelte-123xyz`) to elements. Scoped selectors get a 0-1-0 specificity boost, overriding global styles. Keyframe names are also scoped automatically.

```svelte
<style>
	p { color: burlywood; } /* only affects <p> in this component */
	@keyframes bounce { /* scoped to component */ }
</style>
```

### global_styles
How to apply styles globally in Svelte components using :global() modifier and blocks.

Use `:global(selector)` to apply styles globally to a single selector, or `:global { ... }` block for multiple selectors. Prepend keyframe names with `-global-` to make them globally accessible.

### custom_properties
How to pass and use CSS custom properties in Svelte components.

Pass CSS custom properties to components with `--property-name` syntax. Read them inside components using `var(--property-name, fallback)`. Properties can be inherited from parent elements or defined globally on `:root`.

### nested_style_elements
Nested style tags bypass Svelte's scoping and apply globally to the DOM.

Only one top-level `<style>` tag per component is allowed. Nested `<style>` tags inside elements or logic blocks are inserted as-is without scoping, affecting the entire DOM.

```svelte
<div>
	<style>
		div { color: red; } /* affects all divs in DOM */
	</style>
</div>
```

