## CSS
Use Iconify to define icons purely via CSS. Iconify supports many popular icon sets and can be included via CSS. Works with popular CSS frameworks using the Iconify Tailwind CSS plugin or UnoCSS plugin. Doesn't require importing icons into `.svelte` files.

## Svelte
When choosing an icon library, avoid those that provide a `.svelte` file per icon. Libraries with thousands of `.svelte` files significantly slow down Vite's dependency optimization. This problem is especially severe when icons are imported both via umbrella import and subpath import.