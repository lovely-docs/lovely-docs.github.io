**vitePreprocess**: Enables CSS preprocessors (PostCSS, SCSS, Less, Stylus, SugarSS). Default in TypeScript projects. Required for Svelte 4 TypeScript; Svelte 5 has native TypeScript support.

```js
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
const config = { preprocess: [vitePreprocess()] };
```

**Add-ons**: `npx sv add` installs prettier, eslint, vitest, playwright, lucia, tailwind, drizzle, paraglide, mdsvex, storybook.

**svelte-preprocess**: Alternative with Pug, Babel, global styles. Install `npm i -D svelte-preprocess` plus language libraries.

**Vite plugins**: Use any Vite plugin to enhance projects.