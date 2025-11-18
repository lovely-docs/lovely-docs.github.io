Import `sveltekit` from `@sveltejs/kit/vite` and call it to get an array of Vite plugins for SvelteKit integration.

```js
import { sveltekit } from '@sveltejs/kit/vite';
const plugins = await sveltekit();
```