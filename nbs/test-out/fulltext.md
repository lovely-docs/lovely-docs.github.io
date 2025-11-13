
## Directories

### getting_started
How to set up Svelte projects, structure components in .svelte files, and create reusable reactive logic with runes.

## Project Setup

Create a new project with SvelteKit and Vite:
```bash
npx sv create myapp
cd myapp
npm install
npm run dev
```

Alternative: Use Vite directly with `npm create vite@latest` and select the `svelte` option. Plugins exist for Rollup and Webpack but Vite is recommended.

## Development Tools

- VS Code extension maintained by the Svelte team
- Command-line checking with `sv check`
- Community editor integrations via Svelte Society
- Support via Discord or Stack Overflow (tag: svelte)

## Component Files

Components are written in `.svelte` files with optional `<script>`, `<style>`, and markup sections.

**`<script>`** runs per component instance. Top-level variables are accessible in markup and use runes for props and reactivity.

**`<script module>`** runs once at module load. Variables are accessible in the component but not vice versa. You can export bindings (they become module exports), but not `export default`.

```svelte
<script module>
	let total = 0;
</script>

<script>
	total += 1;
	console.log(`instantiated ${total} times`);
</script>
```

**`<style>`** is scoped to the component only.

## Reactive Logic Files

`.svelte.js` and `.svelte.ts` files support runes for creating reusable reactive logic and shared reactive state. They behave like standard modules but with Svelte's reactivity system. You cannot export reassigned state across modules.

### runes
Svelte 5's `$`-prefixed runes provide reactive state management, derived values, effects, props, two-way binding, and debugging utilities.

## Runes

Runes are `$`-prefixed compiler keywords that form Svelte's reactivity system. They are built-in (not imported) and valid only in specific positions.

### $state
Creates reactive state. Arrays and objects become deeply reactive proxies:
```js
let count = $state(0);
let todos = $state([{ done: false, text: 'add more todos' }]);
todos[0].done = !todos[0].done; // triggers reactivity
```

Destructuring breaks reactivity. Use `$state.raw` for non-reactive objects (only reassignable, not mutable). Use `$state.snapshot()` to convert proxies to plain objects. Cannot export state that's directly reassigned; export objects and mutate properties instead.

### $derived
Declares derived state that auto-updates when dependencies change:
```js
let count = $state(0);
let doubled = $derived(count * 2);
let total = $derived.by(() => {
  let sum = 0;
  for (const n of numbers) sum += n;
  return sum;
});
```

Can temporarily reassign derived values (unless `const`) for optimistic UI. Uses push-pull reactivity: state changes notify dependents immediately, but derived values only re-evaluate when read.

### $effect
Runs side effects when reactive state changes. Automatically tracks dependencies read synchronously:
```js
$effect(() => {
  const interval = setInterval(() => count += 1, milliseconds);
  return () => clearInterval(interval);
});
```

Effects run after mount and in microtasks after state changes. Return a teardown function for cleanup. Use `$effect.pre()` to run before DOM updates. Use `$effect.root()` for manually controlled nested effects outside component initialization.

### $props
Receives component inputs with destructuring, defaults, and rest syntax:
```js
let { adjective = 'happy', ...others } = $props();
```

Props update reactively. Use `$props.id()` to generate unique instance IDs for element linking.

### $bindable
Enables two-way data binding for component props:
```js
// Child
let { value = $bindable() } = $props();
<input bind:value={value} />

// Parent
<FancyInput bind:value={message} />
```

### $inspect
Development-only rune that reactively logs value changes:
```js
$inspect(count, message);
$inspect(count).with((type, value) => { /* custom handler */ });
$inspect.trace(); // traces which state caused effect/derived to re-run
```

### $host
Provides access to the host element in custom element components for dispatching custom events:
```js
$host().dispatchEvent(new CustomEvent('increment'));
```



## Pages

### $effect
$effect runs functions when state updates, tracking dependencies and supporting cleanup, with variants for pre-DOM execution and manual control.

## $effect

Browser-only functions that run when state updates. Track reactive values synchronously and re-run on dependency changes. Return teardown functions for cleanup.

```svelte
$effect(() => {
    // runs when dependencies change
    // can return cleanup function
});
```

**Lifecycle**: Runs after mount in microtask, batches multiple state changes, teardown runs before re-run and on destroy.

**Dependencies**: Only synchronous reads tracked; async reads (after `await`, `setTimeout`) ignored. Conditional code affects which values are dependencies.

**Variants**: `$effect.pre` (before DOM updates), `$effect.tracking()` (check if in tracking context), `$effect.root()` (manual control).

**Don't use for**: State synchronization—use `$derived` instead. Linking values—use callbacks or function bindings.

