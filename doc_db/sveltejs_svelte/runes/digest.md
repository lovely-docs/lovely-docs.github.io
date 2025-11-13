## Runes

Runes are `$`-prefixed compiler keywords in Svelte that control reactivity and side effects. They are not regular functions and require no imports.

### $state
Creates reactive state. Arrays and objects become deeply reactive proxies:
```js
let count = $state(0);
let todos = $state([{ done: false, text: 'add more todos' }]);
todos[0].done = !todos[0].done; // triggers updates
```

Variants:
- `$state.raw` — non-reactive, only reassignable
- `$state.snapshot` — static snapshot of a proxy
- `$state.eager` — force immediate updates for `await` expressions

Cannot directly export reassigned state; export objects or accessor functions instead.

### $derived
Reactive computed values that auto-update when dependencies change:
```js
let count = $state(0);
let doubled = $derived(count * 2);
```

Use `$derived.by()` for complex logic. Derived values can be temporarily reassigned for optimistic UI. Unlike `$state`, not deeply reactive proxies.

### $effect
Runs side effects when state updates, automatically tracking synchronous dependencies:
```js
$effect(() => {
	const interval = setInterval(() => count += 1, 1000);
	return () => clearInterval(interval); // teardown
});
```

Variants:
- `$effect.pre` — runs before DOM updates
- `$effect.tracking()` — returns whether in tracking context
- `$effect.root()` — manually controlled scope outside component initialization

Don't use effects to synchronize state; use `$derived` instead.

### $props
Receives component inputs with destructuring, defaults, and renaming:
```js
let { adjective = 'happy', super: trouper = 'lights' } = $props();
let { a, b, ...others } = $props(); // rest props
```

Add type annotations for safety. `$props.id()` generates unique IDs per instance.

### $bindable
Marks props as bindable for bidirectional data flow:
```js
// Child
let { value = $bindable() } = $props();

// Parent
<FancyInput bind:value={message} />
```

### $inspect
Development-only debugging rune that logs when arguments change:
```js
$inspect(count, message).with((type, count) => {
	if (type === 'update') debugger;
});
```

`$inspect.trace()` traces which reactive state caused an effect/derived to re-run.

### $host
Provides access to the host element in custom element components:
```js
$host().dispatchEvent(new CustomEvent('increment'));
```