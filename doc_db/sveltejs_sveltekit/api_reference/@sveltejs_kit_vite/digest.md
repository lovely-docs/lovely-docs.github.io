The `sveltekit` function from `@sveltejs/kit/vite` returns an array of Vite plugins required for SvelteKit projects.

**Usage:**
```js
import { sveltekit } from '@sveltejs/kit/vite';

const plugins = await sveltekit();
```

This is typically used in a Vite configuration file to integrate SvelteKit's build and development tooling with Vite.