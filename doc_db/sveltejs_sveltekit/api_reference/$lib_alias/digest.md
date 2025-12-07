The `$lib` import alias automatically points to the `src/lib` directory, allowing you to import reusable components and utilities from anywhere in your project without relative paths.

The alias can be customized via the config file's `files` option.

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