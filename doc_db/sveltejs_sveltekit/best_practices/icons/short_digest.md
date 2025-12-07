**CSS approach**: Use Iconify with CSS to include icons from many popular sets; integrates with Tailwind CSS and UnoCSS plugins without per-icon imports.

**Svelte approach**: Avoid icon libraries with one `.svelte` file per icon as they slow Vite's dependency optimization, especially with mixed umbrella and subpath imports.