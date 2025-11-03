## Stores

Reactive values accessed via `$` prefix in components. Svelte 5 runes reduce store necessity, but stores remain useful for async data streams and manual control.

**API:**
- `writable(initial, startFn?)` - Mutable store with `.set()` and `.update()`
- `readable(initial, startFn)` - Immutable store
- `derived(store(s), callback, initial?)` - Computed store
- `readonly(store)` - Wraps store as read-only
- `get(store)` - Get value without subscribing

**Store Contract:** Must have `.subscribe(fn)` returning unsubscribe function, optionally `.set()` for writable stores.

```js
const count = writable(0);
count.subscribe(v => console.log(v)); // logs 0
count.set(1); // logs 1
```