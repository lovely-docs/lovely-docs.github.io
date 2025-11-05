Export a `snapshot` object with `capture()` and `restore()` methods from `+page.svelte` or `+layout.svelte` to preserve DOM state across navigation. Data must be JSON-serializable and is stored in `sessionStorage`.

```svelte
export const snapshot = {
	capture: () => state,
	restore: (value) => state = value
};
```