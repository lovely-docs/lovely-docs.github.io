## sequence

A helper function for sequencing multiple `handle` calls in a middleware-like manner.

**Behavior:**
- `transformPageChunk` is applied in reverse order and merged
- `preload` is applied in forward order, the first option "wins" and no `preload` options after it are called
- `filterSerializedResponseHeaders` behaves the same as `preload`

**Example:**
```js
import { sequence } from '@sveltejs/kit/hooks';

async function first({ event, resolve }) {
	console.log('first pre-processing');
	const result = await resolve(event, {
		transformPageChunk: ({ html }) => {
			console.log('first transform');
			return html;
		},
		preload: () => {
			console.log('first preload');
			return true;
		}
	});
	console.log('first post-processing');
	return result;
}

async function second({ event, resolve }) {
	console.log('second pre-processing');
	const result = await resolve(event, {
		transformPageChunk: ({ html }) => {
			console.log('second transform');
			return html;
		},
		preload: () => {
			console.log('second preload');
			return true;
		},
		filterSerializedResponseHeaders: () => {
			console.log('second filterSerializedResponseHeaders');
			return true;
		}
	});
	console.log('second post-processing');
	return result;
}

export const handle = sequence(first, second);
```

**Execution order:**
```
first pre-processing
first preload
second pre-processing
second filterSerializedResponseHeaders
second transform
first transform
second post-processing
first post-processing
```

**Type signature:**
```dts
function sequence(...handlers: Handle[]): Handle;
```