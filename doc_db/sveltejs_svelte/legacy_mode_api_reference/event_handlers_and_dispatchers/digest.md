## Event Handlers

Use the `on:` directive to attach event handlers to elements:

```svelte
<button on:click={handleClick}>count: {count}</button>
```

Handlers can be inline with no performance penalty:

```svelte
<button on:click={() => (count += 1)}>count: {count}</button>
```

### Modifiers

Add modifiers with the `|` character:

```svelte
<form on:submit|preventDefault={handleSubmit}></form>
```

Available modifiers:
- `preventDefault` — calls `event.preventDefault()`
- `stopPropagation` — prevents event reaching next element
- `stopImmediatePropagation` — prevents other listeners of same event
- `passive` — improves scrolling performance (auto-added where safe)
- `nonpassive` — explicitly set `passive: false`
- `capture` — fires during capture phase instead of bubbling
- `once` — remove handler after first run
- `self` — only trigger if `event.target` is the element itself
- `trusted` — only trigger if `event.isTrusted` is `true`

Modifiers can be chained: `on:click|once|capture={...}`

### Event Forwarding

Use `on:` without a value to forward events:

```svelte
<button on:click>The component itself will emit the click event</button>
```

Multiple listeners for the same event are supported:

```svelte
<button on:click={increment} on:click={log}></button>
```

## Component Events

Create a dispatcher to emit custom events:

```svelte
<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
</script>

<button on:click={() => dispatch('increment')}>increment</button>
```

Listen for dispatched events:

```svelte
<Stepper on:increment={() => n += 1} />
```

Component events don't bubble. Only the `once` modifier is valid on component event handlers. For Svelte 5 migration, use callback props instead of `createEventDispatcher`.