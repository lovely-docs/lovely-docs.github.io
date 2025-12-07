

## Pages

### scoped-styles
Component styles are automatically scoped via hash-based classes with +0-1-0 specificity; @keyframes are scoped and animation rules auto-adjusted.

## Scoped Styles

Svelte components can include a `<style>` element containing CSS that is automatically scoped to that component only. Styles will not leak to elements outside the component.

**Implementation**: Scoping works by adding a hash-based class to affected elements (e.g., `svelte-123xyz`).

```svelte
<style>
	p {
		/* only affects <p> in this component */
		color: burlywood;
	}
</style>
```

**Specificity**: Each scoped selector receives a specificity increase of 0-1-0 from the scoping class. This means component styles take precedence over global stylesheets, even if the global stylesheet loads later. When the scoping class must be added multiple times to a selector, subsequent occurrences use `:where(.svelte-xyz123)` to avoid further specificity increases.

**Scoped Keyframes**: `@keyframes` defined in a component are scoped using the same hashing approach. Animation rules referencing these keyframes are automatically adjusted:

```svelte
<style>
	.bouncy {
		animation: bounce 10s;
	}

	@keyframes bounce {
		/* keyframes only accessible inside this component */
	}
</style>
```

### global_styles
:global(...) and :global {...} modifiers for applying styles globally; -global- prefix for global @keyframes

## :global(...) modifier

Apply styles to a single selector globally using the `:global(...)` modifier:

```svelte
<style>
	:global(body) {
		margin: 0;
	}

	div :global(strong) {
		color: goldenrod;
	}

	p:global(.big.red) {
		/* applies to <p> with class="big red" */
	}
</style>
```

For globally accessible @keyframes, prepend the keyframe name with `-global-`. The prefix is removed during compilation:

```svelte
<style>
	@keyframes -global-my-animation-name {
		/* code */
	}
</style>
```

## :global block

Apply styles to a group of selectors globally using a `:global {...}` block:

```svelte
<style>
	:global {
		div { ... }
		p { ... }
	}

	.a :global {
		.b .c .d { ... }
	}
</style>
```

Alternatively, use `.a :global .b .c .d` syntax where everything after `:global` is unscoped (nested form preferred).

### custom-properties
Pass CSS custom properties to components with `--name` syntax; they desugar to wrapper elements and are read via `var(--name, fallback)` inside components; inherit from parents and can be defined globally.

## Passing CSS Custom Properties to Components

Pass CSS custom properties (both static and dynamic) to components using the `--property-name` syntax:

```svelte
<Slider
	bind:value
	min={0}
	max={100}
	--track-color="black"
	--thumb-color="rgb({r} {g} {b})"
/>
```

This desugars to a wrapper element with the custom properties in its style attribute. For regular components, a `<svelte-css-wrapper style="display: contents; ...">` is used. For SVG elements, a `<g>` element is used instead:

```svelte
<!-- Regular component desugars to: -->
<svelte-css-wrapper style="display: contents; --track-color: black; --thumb-color: rgb({r} {g} {b})">
	<Slider bind:value min={0} max={100} />
</svelte-css-wrapper>

<!-- SVG element desugars to: -->
<g style="--track-color: black; --thumb-color: rgb({r} {g} {b})">
	<Slider bind:value min={0} max={100} />
</g>
```

## Reading Custom Properties Inside Components

Inside a component, read custom properties using CSS `var()` function with optional fallback values:

```svelte
<style>
	.track {
		background: var(--track-color, #aaa);
	}

	.thumb {
		background: var(--thumb-color, blue);
	}
</style>
```

## Inheritance and Global Definition

Custom properties don't need to be specified directly on the component—they inherit from parent elements. Define them on the `:root` element in a global stylesheet to apply them application-wide.

## Layout Caveat

The wrapper element (`display: contents` or `<g>`) doesn't affect layout but will affect CSS selectors using the `>` combinator that target elements directly inside the component's container.

### nested-style-elements
Nested style tags bypass Svelte's scoping and apply globally to the DOM.

Svelte components can have only one top-level `<style>` tag, but `<style>` tags can be nested inside other elements or logic blocks. When nested, the style tag is inserted as-is into the DOM without any scoping or processing applied.

Example:
```svelte
<div>
	<style>
		div {
			color: red;
		}
	</style>
</div>
```

In this case, the nested `<style>` tag will apply to all `<div>` elements in the entire DOM, not just the component, since no scoping is performed on nested style tags.

