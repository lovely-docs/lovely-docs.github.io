SvelteKit automatically provides the `$lib` import alias for files under `src/lib`. This allows you to import reusable components and utilities from your library directory without relative paths.

Example:
```svelte
// src/lib/Component.svelte
A reusable component

// src/routes/+page.svelte
<script>
    import Component from '$lib/Component.svelte';
</script>

<Component />
```

The alias target directory can be customized in the config file.