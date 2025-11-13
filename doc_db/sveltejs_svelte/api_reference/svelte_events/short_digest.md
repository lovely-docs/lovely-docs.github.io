## on()

Attaches event handlers to DOM elements and returns a removal function. Preserves correct handler order relative to declarative handlers (like `onclick` attributes).

```js
import { on } from 'svelte/events';
const unsubscribe = on(window, 'resize', handler);
unsubscribe(); // removes handler
```