## vitePreprocess

Include `vitePreprocess` from `@sveltejs/vite-plugin-svelte` to use CSS flavors supported by Vite: PostCSS, SCSS, Less, Stylus, and SugarSS. Included by default with TypeScript setup.

```js
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
  preprocess: [vitePreprocess()]
};
```

TypeScript support: native in Svelte 5 for type syntax only; use `vitePreprocess({ script: true })` for complex TypeScript in Svelte 5 or any TypeScript in Svelte 4.

## Add-ons

Use `npx sv add` to setup integrations: prettier, eslint, vitest, playwright, lucia, tailwind, drizzle, paraglide, mdsvex, storybook.

## Packages

Browse curated Svelte packages on the packages page or sveltesociety.dev for libraries, templates, and resources.

## svelte-preprocess

Alternative preprocessor with additional features: Pug, Babel, and global styles support. May be slower and require more configuration than vitePreprocess. Install with `npm i -D svelte-preprocess` and configure in svelte.config.js. CoffeeScript is not supported.

## Vite plugins

SvelteKit uses Vite, so Vite plugins can enhance projects. See vitejs/awesome-vite repository for available plugins.