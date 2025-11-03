## Stores Overview

A store is an object providing reactive access to a value via a simple contract. Access store values in components using the `$` prefix, which automatically subscribes/unsubscribes.

```svelte
<script>
	import { writable } from 'svelte/store';
	const count = writable(0);
	$count = 2; // assignment calls .set()
</script>
```

## When to Use Stores

With Svelte 5 runes, stores are less necessary:
- For extracting logic: use runes in `.svelte.js`/`.svelte.ts` files instead
- For shared state: use `$state` objects
- Stores remain useful for complex async data streams or when you need manual control over updates/subscriptions

## svelte/store API

**writable(initialValue, startFunction?)** - Creates a store with `.set()` and `.update()` methods. The optional start function receives `set`/`update` functions and must return a stop function.

```js
const count = writable(0, () => {
	console.log('got subscriber');
	return () => console.log('no subscribers');
});
count.set(1);
const unsubscribe = count.subscribe(v => console.log(v)); // logs 'got subscriber', then '1'
unsubscribe(); // logs 'no subscribers'
```

**readable(initialValue, startFunction)** - Store whose value cannot be set externally. Start function works like writable's.

```ts
const time = readable(new Date(), (set) => {
	const interval = setInterval(() => set(new Date()), 1000);
	return () => clearInterval(interval);
});
```

**derived(store(s), callback, initialValue?)** - Derives a store from one or more stores. Callback runs when first subscriber subscribes and when dependencies change. Can accept `set` and `update` arguments for async operations.

```ts
const doubled = derived(a, ($a) => $a * 2);
const delayed = derived([a, b], ([$a, $b], set) => {
	setTimeout(() => set($a + $b), 1000);
});
```

**readonly(store)** - Makes a store readonly while preserving subscriptions to the original.

**get(store)** - Retrieves store value without subscribing (creates temporary subscription). Not recommended in hot code paths.

## Store Contract

Implement custom stores by providing:
1. `.subscribe(subscription)` method that immediately calls subscription with current value, returns unsubscribe function
2. Optional `.set(value)` method for writable stores
3. For RxJS interoperability, `.subscribe()` can return object with `.unsubscribe()` method instead of function