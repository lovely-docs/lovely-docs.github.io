## Setting Classes on Elements

There are two approaches: the `class` attribute and the `class:` directive.

### Class Attribute

**Primitive values:**
```svelte
<div class={large ? 'large' : 'small'}>...</div>
```

Note: Falsy values like `false` and `NaN` are stringified as `class="false"`, but `undefined` and `null` omit the attribute entirely.

**Objects and arrays (Svelte 5.16+):**

Objects add truthy keys as classes:
```svelte
<div class={{ cool, lame: !cool }}>...</div>
```

Arrays combine truthy values:
```svelte
<div class={[faded && 'saturate-0 opacity-50', large && 'scale-200']}>...</div>
```

Arrays can contain nested arrays and objects, which clsx flattens. This is useful for combining local classes with component props:
```svelte
<!-- Button.svelte -->
<button {...props} class={['cool-button', props.class]}>
	{@render props.children?.()}
</button>
```

**Type safety (Svelte 5.19+):**
```svelte
<script lang="ts">
	import type { ClassValue } from 'svelte/elements';
	const props: { class: ClassValue } = $props();
</script>
```

### Class Directive

The `class:` directive conditionally applies classes:
```svelte
<div class:cool={cool} class:lame={!cool}>...</div>
```

Shorthand when name matches value:
```svelte
<div class:cool class:lame={!cool}>...</div>
```

The `class` attribute is now preferred over `class:` for its greater power and composability.