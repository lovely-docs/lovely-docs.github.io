## Setup
```js
import adapter from '@sveltejs/adapter-vercel';
const config = { kit: { adapter: adapter() } };
```

## Route Configuration
```js
export const config = {
	split: true,
	runtime: 'edge',
	regions: ['iad1'],
	memory: 1024,
	maxDuration: 15
};
```

## ISR (Incremental Static Regeneration)
```js
export const config = {
	isr: {
		expiration: 60,
		bypassToken: BYPASS_TOKEN,
		allowQuery: ['search']
	}
};
```

## Key Points
- Configure per-route via `+server.js`, `+page(.server).js`, `+layout(.server).js`
- Use `$env/static/private` for Vercel environment variables
- Use `read()` from `$app/server` for file access (not `fs`)
- Enable Skew Protection in project settings to route to original deployment