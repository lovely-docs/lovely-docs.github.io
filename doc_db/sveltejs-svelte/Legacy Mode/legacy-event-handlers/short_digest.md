## Event Handlers

Attach handlers with `on:` directive:
```svelte
<button on:click={handleClick}>click me</button>
<button on:click={() => count++}>inline</button>
```

## Modifiers

Chain modifiers with `|`:
```svelte
<form on:submit|preventDefault|once={handle}></form>
```

Available: `preventDefault`, `stopPropagation`, `stopImmediatePropagation`, `passive`, `nonpassive`, `capture`, `once`, `self`, `trusted`

## Event Forwarding

```svelte
<button on:click>forward event</button>
```

## Component Events

```svelte
<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
</script>
<button on:click={() => dispatch('increment')}>+</button>
```

Listen on component: `<Stepper on:increment={() => n++} />`

Only `once` modifier works on component events. For Svelte 5, use callback props instead.