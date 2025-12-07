

## Pages

### legacy-reactive-declarations
Legacy mode: top-level variables are reactive via assignment; mutations need explicit reassignment to update UI.

## Reactive Variables in Legacy Mode

In legacy mode, variables declared at the top level of a component are automatically reactive. Reassigning or mutating these variables triggers UI updates.

```svelte
<script>
	let count = 0;
</script>

<button on:click={() => count += 1}>
	clicks: {count}
</button>
```

### Assignment-Based Reactivity

Legacy mode reactivity is based on assignments. Array methods like `.push()` and `.splice()` don't automatically trigger updates because they mutate without reassigning. A subsequent assignment is required to notify the compiler:

```svelte
<script>
	let numbers = [1, 2, 3, 4];

	function addNumber() {
		numbers.push(numbers.length + 1); // mutation, no update
		numbers = numbers; // assignment triggers update
	}
</script>
```

### legacy-reactive-assignments
Legacy Svelte reactive statements: prefix top-level statements with `$:` to auto-rerun when compile-time-detected dependencies change, with topological ordering; dependencies must be directly referenced (not via closures), and SSR-unsafe code needs browser guards.

## Reactive $: Statements in Legacy Mode

In legacy Svelte, reactive statements use the `$:` label prefix on top-level statements. These run after other script code and before markup rendering, then re-run whenever their dependencies change.

### Basic Usage

```svelte
<script>
	let a = 1;
	let b = 2;

	$: console.log(`${a} + ${b} = ${sum}`);
	$: sum = a + b;
</script>
```

Reactive assignments (like `$: sum = a + b`) automatically recalculate when dependencies change. No separate declaration needed.

### Multiple Statements in Blocks

```js
$: {
	total = 0;
	for (const item of items) {
		total += item.value;
	}
}
```

### Destructuring

```js
$: ({ larry, moe, curly } = stooges);
```

### Topological Ordering

Statements are automatically ordered by dependencies. In the example above, `sum` is calculated before the `console.log` even though it appears later, because `console.log` depends on `sum`.

### Understanding Dependencies

Dependencies are determined at compile time by analyzing which variables are referenced (not assigned). This means:

```js
let count = 0;
let double = () => count * 2;
$: doubled = double();  // Won't re-run when count changes - compiler can't see the dependency
```

Indirect dependencies also fail:

```svelte
<script>
	let x = 0;
	let y = 0;

	$: z = y;
	$: setY(x);  // y is updated here, but z won't re-run because y isn't marked dirty

	function setY(value) {
		y = value;
	}
</script>
```

Fix by reordering: `$: setY(x)` before `$: z = y`.

### Browser-Only Code

Reactive statements run during SSR. Wrap browser-only code in a conditional:

```js
$: if (browser) {
	document.title = title;
}
```

### export-let
Legacy mode component props declared with `export let` keyword, supporting defaults and renaming; exported functions/classes become public API.

## Props Declaration

In legacy mode, component props are declared using the `export` keyword with optional default values:

```svelte
<script>
	export let foo;
	export let bar = 'default value';
	console.log({ foo });
</script>
```

Default values are used when props would otherwise be `undefined`. Props without defaults are required; Svelte warns during development if not provided. Suppress warnings by setting `undefined` as default: `export let foo = undefined;`

Unlike runes mode, if a parent changes a prop from a defined value to `undefined`, it does not revert to the initial value.

## Component Exports

Exported `const`, `class`, or `function` declarations are not props—they become part of the component's public API:

```svelte
// Greeter.svelte
<script>
	export function greet(name) {
		alert(`hello ${name}!`);
	}
</script>

// App.svelte
<script>
	import Greeter from './Greeter.svelte';
	let greeter;
</script>

<Greeter bind:this={greeter} />
<button on:click={() => greeter.greet('world')}>greet</button>
```

## Renaming Props

Use separate `export` keyword to rename props, useful for reserved words:

```svelte
<script>
	let className;
	export { className as class };
</script>
```

### $$props_and_$$restprops
Legacy mode: `$$props` contains all passed props, `$$restProps` contains all except declared exports; use for prop forwarding with filtering.

In legacy mode (pre-runes), use `$$props` and `$$restProps` to access component props:

- `$$props`: object containing all props passed to the component, including undeclared ones
- `$$restProps`: object containing all props except those individually declared with `export`

Example - Button component passing props to underlying button element while excluding the `variant` prop:

```svelte
<script>
	export let variant;
</script>

<button {...$$restProps} class="variant-{variant} {$$props.class ?? ''}">
	click me
</button>

<style>
	.variant-danger {
		background: red;
	}
</style>
```

Note: In Svelte 3/4, using `$$props` and `$$restProps` incurs a modest performance penalty and should only be used when necessary. In runes mode, use the `$props` rune instead.

### legacy-on-directive
Legacy mode event handlers via `on:` directive with modifiers (preventDefault, stopPropagation, capture, once, self, trusted, etc.); component events via createEventDispatcher; callback props recommended for Svelte 5 migration.

## Event Handlers with `on:` Directive

In legacy mode, attach event handlers to elements using the `on:` directive:

```svelte
<script>
	let count = 0;
	function handleClick(event) {
		count += 1;
	}
</script>

<button on:click={handleClick}>count: {count}</button>
```

Handlers can be inline: `<button on:click={() => (count += 1)}>count: {count}</button>`

## Event Modifiers

Add modifiers with `|` character: `<form on:submit|preventDefault={handleSubmit}>`

Available modifiers:
- `preventDefault` — calls `event.preventDefault()`
- `stopPropagation` — calls `event.stopPropagation()`
- `stopImmediatePropagation` — calls `event.stopImmediatePropagation()`
- `passive` — improves scrolling performance on touch/wheel events
- `nonpassive` — explicitly set `passive: false`
- `capture` — fires during capture phase instead of bubbling
- `once` — remove handler after first run
- `self` — only trigger if `event.target` is the element itself
- `trusted` — only trigger if `event.isTrusted` is `true`

Modifiers chain: `on:click|once|capture={...}`

## Event Forwarding

Use `on:` without a value to forward events: `<button on:click>The component itself will emit the click event</button>`

## Multiple Listeners

Multiple handlers for same event are supported:

```svelte
<script>
	let count = 0;
	function increment() { count += 1; }
	function log(event) { console.log(event); }
</script>

<button on:click={increment} on:click={log}>clicks: {count}</button>
```

## Component Events

Components dispatch custom events using `createEventDispatcher`:

```svelte
<!--- Stepper.svelte --->
<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
</script>

<button on:click={() => dispatch('decrement')}>decrement</button>
<button on:click={() => dispatch('increment')}>increment</button>
```

Consumers listen for dispatched events:

```svelte
<script>
	import Stepper from './Stepper.svelte';
	let n = 0;
</script>

<Stepper
	on:decrement={() => n -= 1}
	on:increment={() => n += 1}
/>

<p>n: {n}</p>
```

`dispatch` creates a `CustomEvent`. A second argument becomes the `detail` property.

Component events do not bubble — only immediate children can be listened to. Only `once` modifier is valid on component event handlers.

**Migration note**: For Svelte 5, use callback props instead of `createEventDispatcher` (which is deprecated):

```svelte
<!--- Stepper.svelte --->
<script>
	export let decrement;
	export let increment;
</script>

<button on:click={decrement}>decrement</button>
<button on:click={increment}>increment</button>
```

### legacy-slots
Legacy Svelte slots: default and named slots with fallback content, bidirectional data passing via props and let: directive.

## Legacy Slots in Svelte 5

In Svelte 5 legacy mode, content passed to components is rendered using `<slot>` elements (as opposed to snippets and render tags in modern Svelte).

### Basic Slots

Content inside component tags becomes slotted content, rendered by the component:

```svelte
// App.svelte
<Modal>This is some slotted content</Modal>

// Modal.svelte
<div class="modal">
  <slot></slot>
</div>
```

To render a literal `<slot>` element, use `<svelte:element this={'slot'} />`.

### Named Slots

Components can have multiple named slots. Parent side uses `slot="name"` attribute:

```svelte
// App.svelte
<Modal>
  Default content
  <div slot="buttons">
    <button on:click={() => open = false}>close</button>
  </div>
</Modal>

// Modal.svelte
<div class="modal">
  <slot></slot>
  <hr>
  <slot name="buttons"></slot>
</div>
```

### Fallback Content

Slots can define fallback content rendered when no slotted content is provided:

```svelte
<slot>
  This will be rendered if no slotted content is provided
</slot>
```

### Passing Data to Slotted Content

Slots can pass values back to parent using props. Parent exposes values with `let:` directive:

```svelte
// FancyList.svelte
<ul>
  {#each items as data}
    <li class="fancy">
      <slot item={process(data)} />
    </li>
  {/each}
</ul>

// App.svelte
<FancyList {items} let:item={processed}>
  <div>{processed.text}</div>
</FancyList>
```

Shorthand: `let:item` equals `let:item={item}`, and `<slot {item}>` equals `<slot item={item}>`.

Named slots can also expose values using `let:` on the element with the `slot` attribute:

```svelte
// FancyList.svelte
<ul>
  {#each items as item}
    <li class="fancy">
      <slot name="item" item={process(data)} />
    </li>
  {/each}
</ul>
<slot name="footer" />

// App.svelte
<FancyList {items}>
  <div slot="item" let:item>{item.text}</div>
  <p slot="footer">Copyright (c) 2019 Svelte Industries</p>
</FancyList>
```

### $$slots
$$slots object in legacy mode contains keys for each slot passed to a component; check presence with {#if $$slots.name} to conditionally render slot content.

In legacy mode, `$$slots` is an object that tells you which slots were provided to a component by its parent. The keys of `$$slots` are the names of the slots that were passed in.

Use `$$slots` to conditionally render content based on whether a slot was provided:

```svelte
<div>
	<slot name="title" />
	{#if $$slots.description}
		<hr />
		<slot name="description" />
	{/if}
</div>
```

When a parent component uses this component without providing a `description` slot, that conditional block won't render. In runes mode, you can check snippet props directly instead of using `$$slots`.

### svelte-fragment
Invisible wrapper for named slot content that doesn't render a DOM element; replaced by snippets in Svelte 5+.

The `<svelte:fragment>` element allows you to place content in a named slot without wrapping it in a container DOM element, preserving document flow layout.

**Example:**

```svelte
<!-- Widget.svelte -->
<div>
	<slot name="header">No header was provided</slot>
	<p>Some content between header and footer</p>
	<slot name="footer" />
</div>

<!-- App.svelte -->
<Widget>
	<h1 slot="header">Hello</h1>
	<svelte:fragment slot="footer">
		<p>All rights reserved.</p>
		<p>Copyright (c) 2019 Svelte Industries</p>
	</svelte:fragment>
</Widget>
```

Without `<svelte:fragment>`, you would need to wrap multiple elements in a container (like a `<div>`) to fill a named slot, which adds an extra DOM node. `<svelte:fragment>` solves this by being an invisible wrapper that doesn't render to the DOM.

**Note:** In Svelte 5+, this is obsolete as snippets don't create wrapping elements.

### legacy-svelte-component
Legacy mode requires `<svelte:component this={ref} />` for dynamic component rendering with proper instance lifecycle; runes mode handles this automatically.

In legacy mode, dynamic component rendering requires `<svelte:component>` to properly handle component instance recreation when the component reference changes.

**Behavior difference:**
- Runes mode: `<MyComponent>` automatically re-renders when `MyComponent` value changes
- Legacy mode: Must use `<svelte:component>` which destroys and recreates the component instance

**Usage:**
```svelte
<svelte:component this={MyComponent} />
```

If `this` is falsy, no component is rendered.

See the Svelte 5 migration guide for context on why this is no longer necessary in runes mode.

### svelte-self
Deprecated `<svelte:self>` element for recursive component inclusion; replaced by direct self-imports.

The `<svelte:self>` element allows a component to recursively include itself. It must be placed inside an if or each block, or passed to a component's slot to prevent infinite loops.

Example:
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

**Note:** This feature is obsolete. Modern Svelte allows components to import themselves directly instead:
```svelte
<script>
	import Self from './App.svelte'
	export let count;
</script>

{#if count > 0}
	<p>counting down... {count}</p>
	<Self count={count - 1} />
{:else}
	<p>lift-off!</p>
{/if}
```

### legacy-component-api
Svelte 3/4 imperative API: constructor with target/props/context/hydrate/intro, $set/$on/$destroy methods, optional accessors, server-side render() method; superseded by mount/unmount in Svelte 5.

## Svelte 3/4 Component API (Legacy)

This documents the imperative component API for Svelte 3 and 4. In Svelte 5, use `mount()` and `unmount()` instead.

### Creating a Component

Client-side components are JavaScript classes compiled with `generate: 'dom'`:

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

- `target` (required): HTMLElement or ShadowRoot to render into
- `anchor`: child of target to render before
- `props`: object of properties
- `context`: Map of root-level context key-value pairs
- `hydrate`: upgrade existing DOM from server-side rendering (requires `hydratable: true` compiler option)
- `intro`: play transitions on initial render

Hydration example:
```ts
const app = new App({
  target: document.querySelector('#server-rendered-html'),
  hydrate: true
});
```

### `$set(props)`

Programmatically set props. Schedules update for next microtask (async):
```ts
component.$set({ answer: 42 });
```

In Svelte 5+, use `$state` instead:
```ts
let props = $state({ answer: 42 });
const component = mount(Component, { props });
props.answer = 24;
```

### `$on(event, callback)`

Listen to component events. Returns function to remove listener:
```ts
const off = component.$on('selected', (event) => {
  console.log(event.detail.selection);
});
off();
```

In Svelte 5+, pass callback props instead.

### `$destroy()`

Remove component from DOM and trigger `onDestroy` handlers:
```ts
component.$destroy();
```

In Svelte 5+, use `unmount()` instead.

### Component Props (with `accessors: true`)

If compiled with `accessors: true`, each prop has getter/setter for synchronous updates:
```ts
console.log(component.count);
component.count += 1;
```

In Svelte 5+, `export` props instead.

### Server-side Component API

Server-side components expose `render(props, options)` returning `{ head, html, css }`:

```ts
require('svelte/register');
const App = require('./App.svelte').default;

const { head, html, css } = App.render(
  { answer: 42 },
  { context: new Map([['key', 'value']]) }
);
```

In Svelte 5+, use `render()` from `svelte-server` instead.

