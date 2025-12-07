## vitePreprocess

`vitePreprocess` enables support for CSS preprocessors that Vite supports: PostCSS, SCSS, Less, Stylus, and SugarSS. Included by default in TypeScript projects.

```js
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
  preprocess: [vitePreprocess()]
};
export default config;
```

Required for TypeScript with Svelte 4. Svelte 5 supports TypeScript natively for type syntax only; use `vitePreprocess({ script: true })` for complex TypeScript.

## Add-ons

`npx sv add` command sets up integrations: prettier, eslint, vitest, playwright, lucia, tailwind, drizzle, paraglide, mdsvex, storybook.

## Packages

High-quality Svelte packages available at the packages page and sveltesociety.dev.

## svelte-preprocess

Alternative preprocessor with additional features: Pug, Babel, global styles support. May be slower and require more configuration than vitePreprocess. Install with `npm i -D svelte-preprocess` and add to svelte.config.js. Often requires installing corresponding libraries like `npm i -D sass` or `npm i -D less`. CoffeeScript is not supported.

## Vite plugins

SvelteKit uses Vite, so Vite plugins can enhance projects. Available plugins listed at vitejs/awesome-vite repository.