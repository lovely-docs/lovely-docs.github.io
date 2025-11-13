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