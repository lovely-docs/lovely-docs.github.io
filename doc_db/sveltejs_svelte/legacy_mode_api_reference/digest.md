## Reactivity

Top-level variables are automatically reactive. Reassignment triggers updates; mutations like `.push()` require explicit reassignment:

```svelte
<script>
	let numbers = [1, 2, 3];
	function addNumber() {
		numbers.push(numbers.length + 1);
		numbers = numbers; // triggers update
	}
</script>
```

Reactive statements use `$:` prefix and re-run when dependencies change. Dependencies are determined at compile time by direct variable references (not function calls):

```svelte
<script>
	let a = 1, b = 2;
	$: sum = a + b;
	$: console.log(sum);
</script>
```

## Props and Exports

Props declared with `export` keyword; defaults apply when prop is `undefined`:

```svelte
<script>
	export let foo;
	export let bar = 'default';
	export function greet(name) { alert(`hello ${name}!`); }
</script>
```

Access all props with `$$props` and undeclared props with `$$restProps`:

```svelte
<button {...$$restProps} class="variant-{variant}"></button>
```

## Events

Attach handlers with `on:` directive; supports modifiers (`preventDefault`, `stopPropagation`, `capture`, `once`, `self`, `trusted`, etc.):

```svelte
<form on:submit|preventDefault={handleSubmit}></form>
<button on:click>forward event</button>
```

Dispatch custom events with `createEventDispatcher`:

```svelte
<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
</script>
<button on:click={() => dispatch('increment')}>increment</button>
```

## Slots

Default and named slots with fallback content:

```svelte
<!-- Modal.svelte -->
<slot></slot>
<slot name="buttons">Default button</slot>

<!-- App.svelte -->
<Modal>
	<div slot="buttons" let:item={data}>Custom content</div>
</Modal>
```

Check which slots were provided with `$$slots`:

```svelte
{#if $$slots.description}
	<slot name="description" />
{/if}
```

Use `<svelte:fragment slot="name">` to place multiple elements in a named slot without a wrapper.

## Dynamic Components

`<svelte:component this={MyComponent} />` destroys and recreates when component reference changes.

`<svelte:self>` allows recursive self-reference (must be in conditional or slot to prevent infinite loops).

## Imperative API

Components are classes instantiated with target, props, and options:

```ts
import App from './App.svelte';
const app = new App({ target: document.body, props: { answer: 42 } });
app.$set({ answer: 43 });
const off = app.$on('event', callback);
app.$destroy();
```

With `accessors: true`, props become getters/setters with synchronous updates.

Server-side rendering exposes `render()` method returning `{ head, html, css }`.