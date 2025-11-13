## flip

Animates element position changes using the FLIP technique (First, Last, Invert, Play).

```js
import { flip } from 'svelte/animate';

flip(node, { from: DOMRect, to: DOMRect }, params?: FlipParams): AnimationConfig
```

**AnimationConfig**: `delay`, `duration`, `easing`, `css`, `tick`

**FlipParams**: `delay`, `duration` (number or function), `easing`