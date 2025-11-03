## Scoped Styles
Svelte automatically scopes component styles by adding hash-based classes (e.g., `svelte-123xyz`) to elements. Scoped selectors receive a 0-1-0 specificity boost, taking precedence over global styles. Keyframes are scoped automatically:

```svelte
<style>
	@keyframes bounce { /* ... */ }
	.bouncy { animation: bounce 10s; }
</style>
```

## Global Styles
Use `:global(selector)` to apply styles globally, `-global-` prefix for keyframes, and `:global {...}` block for multiple global selectors:

```svelte
<style>
	:global(body) { margin: 0; }
	@keyframes -global-my-animation { }
	:global { div { } p { } }
</style>
```

## CSS Custom Properties
Pass CSS custom properties to components with `--property-name` syntax and consume them using `var(--property-name, fallback)`. Properties are inherited from parent elements and can be defined globally on `:root`.

## Nested Style Elements
Only one top-level `<style>` tag per component is allowed. Nested `<style>` tags inside elements or logic blocks bypass component scoping and apply globally to the DOM:

```svelte
<div>
	<style>
		div { color: red; }
	</style>
</div>
```