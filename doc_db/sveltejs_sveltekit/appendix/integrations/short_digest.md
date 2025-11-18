## vitePreprocess

Enables CSS preprocessing (PostCSS, SCSS, Less, Stylus, SugarSS). Included by default with TypeScript.

```js
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
const config = { preprocess: [vitePreprocess()] };
```

## Add-ons

`npx sv add` installs: prettier, eslint, vitest, playwright, lucia, tailwind, drizzle, paraglide, mdsvex, storybook.

## svelte-preprocess

Alternative with Pug, Babel, global styles. Install: `npm i -D svelte-preprocess`.

## Vite plugins

Any Vite plugin works with SvelteKit.