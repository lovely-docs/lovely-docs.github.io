Reactive async data fetching with automatic request cancellation, loading/error states, debouncing/throttling, and cleanup hooks. Supports single or multiple dependencies, pre-render execution, and optimistic updates via `mutate()`.

**Basic usage:**
```svelte
const resource = resource(
  () => id,
  async (id, prevId, { data, signal, onCleanup }) => {
    const res = await fetch(`/api/posts?id=${id}`, { signal });
    return res.json();
  },
  { debounce: 300 }
);
// Access: resource.current, resource.loading, resource.error
// Methods: resource.mutate(), resource.refetch()
```

**Multiple dependencies:** `resource([() => query, () => page], async ([query, page]) => ...)`

**Pre-render:** `resource.pre(() => query, async (query) => ...)`

**Options:** `lazy`, `once`, `initialValue`, `debounce`, `throttle`