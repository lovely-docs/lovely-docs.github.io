The `sveltekit()` function from `@sveltejs/kit/vite` returns an array of Vite plugins required for SvelteKit projects.

**Usage:**
```js
import { sveltekit } from '@sveltejs/kit/vite';
const plugins = await sveltekit();
```

**Function signature:**
- `sveltekit()`: Returns `Promise<import('vite').Plugin[]>` - an async function that resolves to an array of Vite plugin objects.