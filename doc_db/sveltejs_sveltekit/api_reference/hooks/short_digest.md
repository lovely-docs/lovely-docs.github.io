**sequence** - Chains multiple `handle` middleware functions. `transformPageChunk` applies in reverse order, `preload` and `filterSerializedResponseHeaders` apply in forward order with first option winning.

```js
import { sequence } from '@sveltejs/kit/hooks';
export const handle = sequence(first, second);
```