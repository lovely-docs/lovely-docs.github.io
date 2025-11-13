## Stores

Access reactive values using `$` prefix in components. Svelte automatically subscribes/unsubscribes.

```svelte
<script>
	import { writable } from 'svelte/store';
	const count = writable(0);
	$count = 2; // calls count.set(2)
</script>
```

**API:**
- `writable(initial, onSubscribe?)` - Readable/writable store with `.set()` and `.update()`
- `readable(initial, onSubscribe)` - Read-only store
- `derived(store(s), callback, initial?)` - Derived store from dependencies
- `readonly(store)` - Wrap store as read-only
- `get(store)` - Synchronously read value

With Svelte 5 runes, prefer `$state` objects for shared state and runes in `.svelte.js` files for logic extraction. Stores remain useful for async data streams and manual control.