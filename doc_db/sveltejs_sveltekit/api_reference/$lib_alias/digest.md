SvelteKit automatically provides a `$lib` import alias that points to files under `src/lib`. This alias can be configured via the config file's files option.

Example usage:
```svelte
// src/lib/Component.svelte
A reusable component

// src/routes/+page.svelte
<script>
    import Component from '$lib/Component.svelte';
</script>

<Component />
```