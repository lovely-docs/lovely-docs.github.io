Configuration lives in `svelte.config.js` at project root. The `kit` property configures SvelteKit with options like adapter selection:

```js
import adapter from '@sveltejs/adapter-auto';

const config = {
	kit: { adapter: adapter() }
};

export default config;
```