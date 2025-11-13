## Event Handlers

Attach handlers with `on:` directive:

```svelte
<button on:click={handleClick}>count: {count}</button>
```

### Modifiers

Chain modifiers with `|`: `preventDefault`, `stopPropagation`, `stopImmediatePropagation`, `passive`, `nonpassive`, `capture`, `once`, `self`, `trusted`

```svelte
<form on:submit|preventDefault={handleSubmit}></form>
```

Forward events without a value: `<button on:click></button>`

## Component Events

```svelte
<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
</script>

<button on:click={() => dispatch('increment')}>increment</button>
```

Listen: `<Stepper on:increment={() => n += 1} />`

Component events don't bubble. For Svelte 5, use callback props instead.