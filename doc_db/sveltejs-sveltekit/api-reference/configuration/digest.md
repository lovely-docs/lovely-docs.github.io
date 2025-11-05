## Configuration File

Your project configuration lives in `svelte.config.js` at the root of your project. This config object is used by SvelteKit and other tooling that integrates with Svelte.

## Basic Setup

```js
import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter()
	}
};

export default config;
```

## Config Properties

The `kit` property configures SvelteKit and accepts various configuration options for controlling adapter behavior, routing, build output, and other framework features.