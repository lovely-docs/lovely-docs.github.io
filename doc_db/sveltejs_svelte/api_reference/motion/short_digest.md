## Spring & Tween Classes

Animate values smoothly:

```js
import { Spring, Tween } from 'svelte/motion';
const spring = new Spring(0);
const tween = new Tween(0);
spring.target = 100; // animates with spring physics
tween.target = 100;  // animates over fixed duration
```

**Spring**: Physics-based animation with `stiffness` and `damping`. Methods: `set(value, options)`, `Spring.of(fn)`.

**Tween**: Time-based animation with `duration` and `easing`. Methods: `set(value, options)`, `Tween.of(fn)`.

**prefersReducedMotion**: Media query for accessibility - disable animations when user prefers reduced motion.

Legacy: `spring()` and `tweened()` functions are deprecated.