

## Pages

### reactive_let_var_declarations
Legacy mode automatically makes top-level variables reactive through assignments, requiring explicit reassignment after mutations.

In legacy mode, top-level variables are automatically reactive. Reactivity is assignment-based, so array mutations need a subsequent assignment to trigger updates:

```svelte
let numbers = [1, 2, 3, 4];
numbers.push(5); // no update
numbers = numbers; // triggers update
```

### reactive_statements
Legacy Svelte reactive statements using $: prefix automatically re-run when their directly-referenced dependencies change, with topological ordering and compile-time dependency detection.

## Reactive $: Statements (Legacy)

Prefix top-level statements with `$:` to make them reactive—they re-run when dependencies change and are topologically ordered.

```svelte
<script>
	let a = 1, b = 2;
	$: sum = a + b;
	$: console.log(`${a} + ${b} = ${sum}`);
</script>
```

**Key points:**
- Dependencies determined at compile time by direct variable references
- Indirect dependencies (through function calls) don't work
- Runs during SSR—wrap browser-only code: `$: if (browser) { ... }`
- Can use blocks and destructuring assignments

### export_let
Legacy mode component props are declared with the export keyword and can have defaults; exported functions/classes become part of the component's public API.

## Props in Legacy Mode

Declare props with `export` keyword, optionally with defaults:

```svelte
<script>
	export let foo;
	export let bar = 'default value';
</script>
```

## Component Exports

Export functions/classes as public API:

```svelte
<script>
	export function greet(name) {
		alert(`hello ${name}!`);
	}
</script>
```

Access via `bind:this`:

```svelte
<Greeter bind:this={greeter} />
<button on:click={() => greeter.greet('world')}>greet</button>
```

## Renaming Props

Rename props using separate export syntax:

```svelte
<script>
	let className;
	export { className as class };
</script>
```

### $$props_and_$$restprops
Legacy mode variables for accessing all component props or all props except declared ones.

## Legacy Props in Svelte

- **`$$props`**: All passed props (including undeclared)
- **`$$restProps`**: All props except explicitly exported ones

```svelte
<script>
	export let variant;
</script>

<button {...$$restProps} class="variant-{variant} {$$props.class ?? ''}">
	click me
</button>
```

Note: Has performance penalty; use only when needed. Modern alternative: `$props` rune.

### event_handlers_and_dispatchers
Legacy mode event handling with the on: directive, modifiers, event forwarding, and component event dispatching.

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

### legacy_slots
Legacy mode slots allow passing content to components via slotted content rendered with `<slot>`, supporting named slots, fallback content, and bidirectional data passing.

## Slots in Legacy Mode

Default slots render slotted content with `<slot>`. Named slots use `slot="name"` attribute and `<slot name="name">`.

Slots can pass data back to parent with props and `let:` directive:

```svelte
<!-- Component -->
<slot item={value} />

<!-- Parent -->
<Component let:item={x}>
  <div>{x}</div>
</Component>
```

Fallback content goes inside `<slot>` tags.

### $$slots
$$slots object in legacy mode allows checking which named slots were provided to a component for conditional rendering.

In legacy mode, `$$slots` is an object whose keys are the names of slots provided to a component. Use it to conditionally render optional slots:

```svelte
{#if $$slots.description}
	<slot name="description" />
{/if}
```

In runes mode, use snippet props instead.

### svelte:fragment
Legacy element for placing multiple elements in named slots without a wrapper container.

`<svelte:fragment>` places content in named slots without a wrapping DOM element. In Svelte 5+, use snippets instead.

### svelte:component
Legacy mode directive for dynamically rendering components by destroying and recreating instances when the component reference changes.

In legacy mode, use `<svelte:component this={MyComponent} />` to dynamically render components. The instance is destroyed and recreated when `this` changes. In runes mode, this is no longer necessary.

### svelte:self
Legacy element for recursive component self-reference, now superseded by direct self-imports.

`<svelte:self>` enables recursive component inclusion when placed inside conditional blocks. This is now obsolete—components can import themselves directly instead.

### imperative_component_api
Svelte 3/4 imperative component API for instantiation, prop updates, event handling, and server-side rendering.

## Creating Components

```ts
const app = new App({
	target: document.body,
	props: { answer: 42 },
	hydrate: false,
	intro: false
});
```

## Instance Methods

- `$set(props)` - Update props (async)
- `$on(event, callback)` - Listen to events
- `$destroy()` - Remove component

## Props with Accessors

With `accessors: true`, props are synchronous getters/setters:
```ts
component.count += 1;
```

## Server-side Rendering

```ts
const { head, html, css } = App.render({ answer: 42 });
```

**Note:** Svelte 3/4 API. Svelte 5 uses `mount()`, `$state`, and callback props.

