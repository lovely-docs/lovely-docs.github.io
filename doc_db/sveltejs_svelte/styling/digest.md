## Scoped Styles

Svelte components automatically scope CSS via hash-based classes (e.g., `svelte-123xyz`). Scoped selectors gain +0-1-0 specificity, ensuring component styles override global stylesheets even if loaded later. When multiple scoping classes are needed, subsequent ones use `:where(.svelte-xyz123)` to avoid further specificity increases.

```svelte
<style>
	p { color: burlywood; } /* only affects <p> in this component */
</style>
```

`@keyframes` are scoped identically and animation rules are auto-adjusted to reference the scoped keyframe names.

## Global Styles

Use `:global(...)` modifier to apply styles globally:

```svelte
<style>
	:global(body) { margin: 0; }
	div :global(strong) { color: goldenrod; }
	p:global(.big.red) { /* applies to <p class="big red"> */ }
</style>
```

For globally accessible `@keyframes`, prepend `-global-` prefix (removed during compilation):

```svelte
<style>
	@keyframes -global-my-animation { /* ... */ }
</style>
```

Apply styles to multiple selectors globally using `:global {...}` block or `.a :global .b .c .d` syntax (everything after `:global` is unscoped).

## CSS Custom Properties

Pass CSS custom properties to components using `--property-name` syntax (static or dynamic):

```svelte
<Slider --track-color="black" --thumb-color="rgb({r} {g} {b})" />
```

Desugars to a wrapper element: `<svelte-css-wrapper style="display: contents; --track-color: black; ...">` for regular components, or `<g>` for SVG elements.

Read custom properties inside components using `var()` with optional fallbacks:

```svelte
<style>
	.track { background: var(--track-color, #aaa); }
</style>
```

Custom properties inherit from parent elements and can be defined globally on `:root`. The wrapper element doesn't affect layout but affects CSS `>` combinator selectors.

## Nested Style Elements

Nested `<style>` tags (inside elements or logic blocks) bypass Svelte's scoping and apply globally to the DOM without processing. Only one top-level `<style>` tag is allowed per component.