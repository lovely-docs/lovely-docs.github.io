## What are Runes

`$`-prefixed compiler keywords in Svelte that control the compiler. Unlike functions, they cannot be imported, assigned, or passed as arguments, and are only valid in specific positions.

## $state

Create reactive state with `$state(value)`. Arrays and plain objects become deeply reactive proxies:
```js
let count = $state(0);
let todos = $state([{ done: false, text: 'add more todos' }]);
todos[0].done = !todos[0].done; // triggers update
```

Use `$state.raw` for non-reactive state. Use `$state.snapshot` to get a plain object from a proxy. Avoid destructuring as it breaks reactivity. Export state via object mutations or functions instead of direct export.

## $derived

Derived state automatically updates when dependencies change:
```svelte
let count = $state(0);
let doubled = $derived(count * 2);
```

Use `$derived.by(() => { ... })` for complex logic. Expressions must be side-effect free. Uses push-pull reactivity: dependents notified immediately, but derived values only re-evaluate when read.

## $effect

Effects run for side effects when state updates. They automatically track reactive values ($state, $derived, $props) read synchronously and re-run when dependencies change:
```svelte
$effect(() => {
	const interval = setInterval(() => count += 1, ms);
	return () => clearInterval(interval);
});
```

Only reruns when objects change, not properties inside. Asynchronously read values aren't tracked. Use `$effect.pre` for pre-DOM effects, `$effect.root()` for manual control.

## $props

Receive component props with destructuring, defaults, renaming, and rest syntax:
```svelte
let { adjective = 'happy', super: trouper, a, b, ...others } = $props();
```

## $bindable

Enables two-way data binding. Mark props with `$bindable()` to allow children to mutate state:
```svelte
// Child
let { value = $bindable() } = $props();
// Parent
<Child bind:value={message} />
```

## $inspect

Development-only reactive logging:
```svelte
$inspect(count, message);
$inspect(count).with((type, value) => { /* custom handler */ });
$inspect.trace(); // traces which reactive state caused re-run
```

## $host

Access the host element in custom element components:
```svelte
$host().dispatchEvent(new CustomEvent(type));
```