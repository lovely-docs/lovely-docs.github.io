

## Pages

### what_are_runes
Runes are $ -prefixed keywords that control the Svelte compiler and form part of the language syntax.

Runes are `$`-prefixed compiler keywords that control Svelte behavior. Example: `let message = $state('hello');`. They're built-in, not importable, and cannot be assigned or passed as arguments.

### $state
The $state rune creates reactive state in Svelte; arrays and objects become deeply reactive proxies, with variants for raw (non-reactive) state and snapshots.

## $state

Create reactive state with `$state(value)`. Arrays and plain objects become deeply reactive proxies:

```js
let count = $state(0);
let todos = $state([{ done: false, text: 'add more todos' }]);
todos[0].done = true; // triggers reactivity
```

Use `$state.raw` for non-reactive objects (reassign only, don't mutate). Use `$state.snapshot` to convert proxies to plain objects.

In classes, declare fields with `$state`:

```js
class Todo {
	done = $state(false);
	reset = () => { this.done = false; }
}
```

When exporting state across modules, export objects and mutate their properties, not the state variable itself:

```js
export const counter = $state({ count: 0 });
export function increment() { counter.count += 1; }
```

### $derived
Derived state automatically updates when its dependencies change, with support for complex derivations and temporary overrides.

## $derived

Declare derived state that automatically updates when dependencies change:

```svelte
let count = $state(0);
let doubled = $derived(count * 2);
```

For complex derivations, use `$derived.by(() => { ... })`. Expressions must be side-effect free.

You can temporarily override derived values for optimistic UI. Derived values are not deeply reactive proxies like `$state`. Svelte uses push-pull reactivity: updates notify dependents immediately but derived values only re-evaluate when read.

### $effect
The $effect rune runs side effects when reactive state changes, with automatic dependency tracking and optional teardown functions.

## $effect

Runs side effects when state updates. Automatically tracks reactive values and re-runs when they change. Only runs in browser, not SSR.

```svelte
$effect(() => {
  context.fillStyle = color;
  context.fillRect(0, 0, size, size);
});
```

Can return teardown function. Tracks only synchronously-read values. Use `$effect.pre` to run before DOM updates. Avoid for state synchronization—use `$derived` instead.

**Variants:** `$effect.pre`, `$effect.tracking()`, `$effect.root()`

### $props
The $props rune receives component inputs with destructuring, fallback values, renaming, and rest syntax; $props.id() generates unique instance IDs for element linking.

## $props()

Receive component inputs with destructuring:

```svelte
let { adjective = 'happy' } = $props();
```

Rename props: `let { super: trouper } = $props();`

Rest props: `let { a, b, ...others } = $props();`

Don't mutate props unless bindable. Use callbacks or `$bindable` to communicate changes.

Add type safety:

```svelte
let { adjective }: { adjective: string } = $props();
```

## $props.id()

Generate unique per-instance ID (consistent during hydration):

```svelte
const uid = $props.id();
<label for="{uid}-name">Name:</label>
<input id="{uid}-name" />
```

### $bindable
The $bindable rune enables two-way data binding for component props, allowing child components to mutate parent state.

## $bindable Rune

Use `$bindable()` to enable two-way data binding on component props:

```svelte
let { value = $bindable(), ...props } = $props();
```

Parent components use `bind:` directive to establish two-way binding:

```svelte
<FancyInput bind:value={message} />
```

Supports fallback values: `$bindable('fallback')`

### $inspect
Development debugging rune that reactively logs value changes and can trace which state changes trigger effects.

## $inspect

Development-only rune that logs values when they change, tracking deep reactivity.

```svelte
$inspect(count, message); // logs on change
$inspect(count).with((type, value) => { /* custom handler */ });
$inspect.trace(); // traces which state caused effect to re-run
```

### $host
$host rune provides access to the host element for dispatching custom events in custom element components.

The `$host` rune accesses the host element in custom element components, enabling custom event dispatch:

```svelte
$host().dispatchEvent(new CustomEvent(type));
```

