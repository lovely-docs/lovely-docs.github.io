## Reactive Variables and Statements

In legacy mode, top-level variables are automatically reactive. Reassignment triggers updates, but mutations (like `.push()`) require explicit reassignment:

```svelte
<script>
	let count = 0;
	let numbers = [1, 2, 3];
	function addNumber() {
		numbers.push(numbers.length + 1);
		numbers = numbers; // triggers update
	}
</script>
<button on:click={() => count += 1}>clicks: {count}</button>
```

Reactive statements use `$:` prefix and auto-rerun when dependencies change. Dependencies are compile-time detected by analyzing variable references (not assignments). Statements are topologically ordered:

```svelte
<script>
	let a = 1, b = 2;
	$: sum = a + b;
	$: console.log(`${a} + ${b} = ${sum}`); // runs after sum is calculated
	$: if (browser) document.title = title; // wrap SSR-unsafe code
</script>
```

Indirect dependencies fail—the compiler can't see dependencies through function calls or closures.

## Props and Component API

Props declared with `export let`:

```svelte
<script>
	export let foo;
	export let bar = 'default value';
	export function greet(name) { alert(`hello ${name}!`); }
	let className;
	export { className as class }; // rename props
</script>
```

Access all props with `$$props` (includes undeclared) and `$$restProps` (excludes declared exports):

```svelte
<button {...$$restProps} class="variant-{variant}">click me</button>
```

## Events

Attach handlers with `on:` directive and optional modifiers:

```svelte
<button on:click|once|preventDefault={handler}>click</button>
```

Available modifiers: `preventDefault`, `stopPropagation`, `stopImmediatePropagation`, `passive`, `nonpassive`, `capture`, `once`, `self`, `trusted`. Forward events without a handler: `<button on:click>`.

Dispatch custom component events with `createEventDispatcher`:

```svelte
<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
</script>
<button on:click={() => dispatch('increment', { value: 1 })}>+</button>
```

Parent listens: `<Stepper on:increment={(e) => n += e.detail.value} />`. Component events don't bubble; only `once` modifier is valid.

**Migration note**: Use callback props instead for Svelte 5: `export let increment;` then `<button on:click={increment}>`.

## Slots

Default and named slots with fallback content:

```svelte
<!-- Modal.svelte -->
<div class="modal">
	<slot></slot>
	<slot name="buttons">Close</slot>
</div>

<!-- App.svelte -->
<Modal>
	Default content
	<div slot="buttons"><button>OK</button></div>
</Modal>
```

Pass data to slotted content via props and `let:` directive:

```svelte
<!-- FancyList.svelte -->
<ul>
	{#each items as data}
		<li><slot item={process(data)} /></li>
	{/each}
</ul>

<!-- App.svelte -->
<FancyList {items} let:item={processed}>
	<div>{processed.text}</div>
</FancyList>
```

Check which slots were provided with `$$slots`:

```svelte
{#if $$slots.description}
	<hr />
	<slot name="description" />
{/if}
```

Use `<svelte:fragment slot="name">` to fill named slots without wrapping in a DOM element.

## Dynamic Components and Recursion

Render dynamic components with `<svelte:component this={ref} />` to properly handle instance recreation when the component reference changes. If `this` is falsy, nothing renders.

Recursive components use `<svelte:self>` (deprecated—import the component directly instead):

```svelte
<script>
	export let count;
</script>
{#if count > 0}
	<p>counting down... {count}</p>
	<svelte:self count={count - 1} />
{:else}
	<p>lift-off!</p>
{/if}
```

## Imperative Component API (Svelte 3/4)

Create components with constructor:

```ts
import App from './App.svelte';
const app = new App({
	target: document.body,
	props: { answer: 42 },
	anchor: null,
	context: new Map(),
	hydrate: false,
	intro: false
});
```

Methods:
- `$set(props)`: update props (async, schedules for next microtask)
- `$on(event, callback)`: listen to events, returns unsubscribe function
- `$destroy()`: remove from DOM and trigger cleanup

With `accessors: true` compiler option, props have getters/setters for synchronous updates: `component.count += 1`.

Server-side rendering: `App.render(props, { context: new Map() })` returns `{ head, html, css }`.

**Svelte 5 migration**: Use `mount()` and `unmount()` instead, pass callback props instead of `createEventDispatcher`, use `$state` for reactive props.