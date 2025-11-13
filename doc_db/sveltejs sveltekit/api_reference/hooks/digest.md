## sequence

Helper function for chaining multiple `handle` middleware functions with specific ordering rules:

- `transformPageChunk`: Applied in **reverse order** and merged
- `preload`: Applied in **forward order**, first one wins (subsequent calls skipped)
- `filterSerializedResponseHeaders`: Applied in **forward order**, first one wins

### Example

```js
import { sequence } from '@sveltejs/kit/hooks';

async function first({ event, resolve }) {
	const result = await resolve(event, {
		transformPageChunk: ({ html }) => html,
		preload: () => true
	});
	return result;
}

async function second({ event, resolve }) {
	const result = await resolve(event, {
		transformPageChunk: ({ html }) => html,
		preload: () => true,
		filterSerializedResponseHeaders: () => true
	});
	return result;
}

export const handle = sequence(first, second);
```

Execution order: first preload runs (wins), then second filterSerializedResponseHeaders runs (wins), then transforms run in reverse (second, then first).