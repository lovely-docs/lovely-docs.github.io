## Core Runes

`$state(value)` - Reactive state, arrays/objects are deeply reactive proxies
```js
let count = $state(0);
```

`$derived(expr)` / `$derived.by(() => {})` - Computed values that auto-update
```svelte
let doubled = $derived(count * 2);
```

`$effect(() => {})` - Side effects that auto-track and re-run on dependency change, supports teardown
```svelte
$effect(() => {
	const id = setInterval(() => count++, ms);
	return () => clearInterval(id);
});
```

`$props()` - Receive component inputs with destructuring
```svelte
let { adjective = 'happy', ...rest } = $props();
```

`$bindable()` - Enable two-way binding on props for child mutations
```svelte
let { value = $bindable() } = $props();
```

`$inspect(value)` - Development-only reactive logging with `.with()` handlers
`$host()` - Access host element in custom elements