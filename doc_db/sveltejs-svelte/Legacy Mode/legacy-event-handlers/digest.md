## Event Handler Basics

In legacy mode, attach event handlers using the `on:` directive:

```svelte
<button on:click={handleClick}>count: {count}</button>
```

Handlers can be inline with no performance penalty:

```svelte
<button on:click={() => (count += 1)}>count: {count}</button>
```

## Event Modifiers

Add modifiers with the `|` character. Multiple modifiers can be chained:

```svelte
<form on:submit|preventDefault|once={handleSubmit}></form>
```

Available modifiers:
- `preventDefault` — calls `event.preventDefault()`
- `stopPropagation` — prevents event from reaching next element
- `stopImmediatePropagation` — prevents other listeners of same event
- `passive` — improves scrolling performance (auto-applied where safe)
- `nonpassive` — explicitly set `passive: false`
- `capture` — fires during capture phase instead of bubbling
- `once` — remove handler after first run
- `self` — only trigger if `event.target` is the element itself
- `trusted` — only trigger if `event.isTrusted` is `true`

## Event Forwarding

Use `on:` without a value to forward events:

```svelte
<button on:click>The component itself will emit the click event</button>
```

## Multiple Listeners

Multiple event listeners for the same event are supported:

```svelte
<button on:click={increment} on:click={log}></button>
```

## Component Events

Components dispatch custom events using `createEventDispatcher`:

```svelte
<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
</script>

<button on:click={() => dispatch('increment', value)}>increment</button>
```

Consumers listen for dispatched events:

```svelte
<Stepper on:increment={() => n += 1} on:decrement={() => n -= 1} />
```

Component events do not bubble. Only `once` modifier is valid on component event handlers.

**Migration note:** For Svelte 5 compatibility, use callback props instead of `createEventDispatcher`.