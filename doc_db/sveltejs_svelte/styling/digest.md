## Scoped Styles

Svelte automatically scopes component styles using hash-based classes (e.g., `svelte-123xyz`) to prevent style leakage. Scoped selectors receive a specificity increase of 0-1-0, allowing them to override global styles. When the scoping class appears multiple times, subsequent occurrences use `:where()` to avoid further specificity increases. Keyframe names are also scoped automatically.

## Global Styles

Use `:global(selector)` to apply styles globally:

```svelte
<style>
	:global(body) { margin: 0; }
	div :global(strong) { color: goldenrod; }
</style>
```

Use `:global {...}` blocks for multiple selectors or `:global` in selector chains:

```svelte
<style>
	:global {
		div { ... }
		p { ... }
	}
	.a :global .b .c { ... }
</style>
```

For global keyframes, prefix with `-global-`:

```svelte
@keyframes -global-my-animation { /* ... */ }
```

## CSS Custom Properties

Pass custom properties to components using `--property-name` syntax:

```svelte
<Slider --track-color="black" --thumb-color="rgb({r} {g} {b})" />
```

Read them inside the component with `var()`:

```svelte
<style>
	.track { background: var(--track-color, #aaa); }
</style>
```

Custom properties can be inherited from parent elements or defined globally on `:root`.

## Nested Style Elements

Nested `<style>` tags inside elements or logic blocks bypass scoping and apply globally to the DOM without processing.