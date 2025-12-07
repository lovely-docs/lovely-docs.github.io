## Stores

Reactive objects accessed via `$` prefix in components. `svelte/store` provides: `writable` (externally settable with `set`/`update`), `readable` (internal-only), `derived` (computed from other stores), `readonly` (wrapper), and `get` (one-time read).

With Svelte 5 runes, stores are less necessary for basic state/logic; use `$state` objects in `.svelte.js` files instead. Stores remain useful for complex async streams and manual control.

**Examples:**
```js
// writable
const count = writable(0);
count.set(1); count.update(n => n + 1);
count.subscribe(v => console.log(v));

// readable with setup function
const time = readable(new Date(), (set) => {
	const interval = setInterval(() => set(new Date()), 1000);
	return () => clearInterval(interval);
});

// derived from single or multiple stores
const doubled = derived(a, ($a) => $a * 2);
const summed = derived([a, b], ([$a, $b]) => $a + $b);
const delayed = derived(a, ($a, set) => {
	setTimeout(() => set($a), 1000);
}, 2000);

// readonly, get
const ro = readonly(writable);
const val = get(store);
```

Store contract: `.subscribe(fn)` returns unsubscribe function; optional `.set(value)` for writable stores.