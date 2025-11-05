## Shallow Routing

Use `pushState()` and `replaceState()` from `$app/navigation` to create history entries without navigating. Access state via `page.state`.

```svelte
pushState('', { showModal: true });
```

For rendering nested pages, preload data with `preloadData()` before calling `pushState()`:

```svelte
const result = await preloadData(href);
if (result.type === 'loaded' && result.status === 200) {
	pushState(href, { selected: result.data });
}
```

**Caveats:** `page.state` is empty during SSR and on initial page load. Requires JavaScript.