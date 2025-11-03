## Reactive Variables & Statements

Top-level variables are automatically reactive via assignment-based reactivity. Mutations require reassignment to trigger updates:
```svelte
let numbers = [1, 2, 3];
numbers.push(4); // no update
numbers = numbers; // triggers update
```

`$:` prefix makes statements reactive—they re-run when dependencies change and are topologically ordered:
```svelte
let a = 1, b = 2;
$: sum = a + b;
$: console.log(`sum: ${sum}`);
```

## Props & Exports

Declare props with `export let`:
```svelte
export let foo;
export let bar = 'default value';
export { className as class };
```

Access all props via `$$props` and undeclared props via `$$restProps`.

## Event Handling

Attach handlers with `on:` directive and chain modifiers:
```svelte
<button on:click={handleClick}>click</button>
<form on:submit|preventDefault|once={handle}></form>
```

Available modifiers: `preventDefault`, `stopPropagation`, `stopImmediatePropagation`, `passive`, `nonpassive`, `capture`, `once`, `self`, `trusted`

Dispatch component events with `createEventDispatcher()`:
```svelte
import { createEventDispatcher } from 'svelte';
const dispatch = createEventDispatcher();
dispatch('increment');
```

## Slots

Render slotted content with `<slot>` and named slots with `slot="name"` attribute. Pass data to slots via props and expose to parent using `let:` directive. Check for named slots with `$$slots` object:
```svelte
{#if $$slots.description}
  <slot name="description" />
{/if}
```

Use `<svelte:fragment slot="name">` to fill named slots without wrapping DOM elements.

## Dynamic Components

Use `<svelte:component this={MyComponent} />` to re-render when component value changes.

## Imperative API

Create components imperatively:
```ts
const app = new App({
  target: document.body,
  props: { answer: 42 }
});
app.$set(props);
app.$on(event, callback);
app.$destroy();
```

Render on server with `App.render({ answer: 42 })`.