## Stores Overview

A store is an object providing reactive access to a value via a simple contract. Access store values in components using the `$` prefix, which automatically subscribes/unsubscribes.

```svelte
<script>
	import { writable } from 'svelte/store';
	const count = writable(0);
	console.log($count); // 0
	$count = 2; // calls count.set(2)
</script>
```

Store declarations must be at component top level, not inside conditionals or functions.

## When to Use Stores

With Svelte 5 runes, stores are less necessary:
- For extracting logic: use runes in `.svelte.js`/`.svelte.ts` files
- For shared state: use `$state` objects

Stores remain useful for complex async data streams or when you need manual control over updates and subscriptions.

## svelte/store API

**writable(initialValue, onSubscribe?)** - Creates a store with `.set(value)` and `.update(callback)` methods. Optional second argument receives `set`/`update` functions and must return a stop function.

```js
const count = writable(0);
count.set(1);
count.update(n => n + 1);
```

**readable(initialValue, onSubscribe)** - Creates a read-only store. The callback receives `set` and optional `update` functions.

```ts
const time = readable(new Date(), (set) => {
	const interval = setInterval(() => set(new Date()), 1000);
	return () => clearInterval(interval);
});
```

**derived(store(s), callback, initialValue?)** - Derives a store from one or more stores. Callback receives store values and optional `set`/`update` functions for async operations.

```ts
const doubled = derived(a, ($a) => $a * 2);
const summed = derived([a, b], ([$a, $b]) => $a + $b);
const delayed = derived(a, ($a, set) => {
	setTimeout(() => set($a), 1000);
}, 2000);
```

**readonly(store)** - Wraps a store as read-only while maintaining subscriptions to the original.

**get(store)** - Retrieves store value synchronously by subscribing, reading, and unsubscribing. Not recommended in hot code paths.

## Store Contract

Implement custom stores by providing:
1. `.subscribe(subscription)` - Must synchronously call subscription with current value and return unsubscribe function
2. `.set(value)?` - Optional method for writable stores
3. For RxJS interop: `.subscribe` can return object with `.unsubscribe` method