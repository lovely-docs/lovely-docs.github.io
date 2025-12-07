## CSS Icons

Use Iconify to define icons purely via CSS. Iconify supports many popular icon sets available at icon-sets.iconify.design. Icons can be included via CSS and integrated with popular CSS frameworks using the Iconify Tailwind CSS plugin or UnoCSS plugin. This approach doesn't require importing each icon into `.svelte` files.

## Svelte Icons

Many icon libraries exist for Svelte. When choosing an icon library, avoid those that provide one `.svelte` file per icon, as these can have thousands of files that significantly slow down Vite's dependency optimization. This performance issue is especially problematic when icons are imported both via umbrella imports and subpath imports, as documented in the vite-plugin-svelte FAQ.