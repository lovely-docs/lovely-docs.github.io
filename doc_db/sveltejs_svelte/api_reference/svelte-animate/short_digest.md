## flip

Animates element position changes using FLIP technique (First, Last, Invert, Play). Takes element node and DOMRect objects for start/end positions, returns AnimationConfig with optional delay, duration, and easing.

```js
import { flip } from 'svelte/animate';
flip(node, { from: DOMRect, to: DOMRect }, { duration, easing, delay });
```

AnimationConfig properties: `delay`, `duration`, `easing`, `css(t, u)`, `tick(t, u)`