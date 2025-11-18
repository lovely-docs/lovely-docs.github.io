## CSS Icons

Use Iconify to include icons via CSS. Supports many popular icon sets and integrates with CSS frameworks through Tailwind CSS or UnoCSS plugins. No need to import individual icons into `.svelte` files.

## Svelte Icons

When choosing icon libraries, avoid those providing one `.svelte` file per icon. These libraries with thousands of `.svelte` files significantly slow down Vite's dependency optimization, especially when icons are imported both via umbrella imports and subpath imports.