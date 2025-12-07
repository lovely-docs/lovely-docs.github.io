## Spring & Tween Classes

Animate values with spring physics or smooth tweening.

```js
import { Spring, Tween } from 'svelte/motion';

const spring = new Spring(0);
spring.target = 100; // bounces to target with stiffness/damping

const tween = new Tween(0);
tween.target = 100; // smoothly animates over duration/easing
```

Both have `target`, `current`, `set(value, options)`, and `static of(fn, options)` for binding to reactive values.

## prefersReducedMotion

Media query for user's reduced motion preference:

```js
import { prefersReducedMotion } from 'svelte/motion';
transition:fly={{ y: prefersReducedMotion.current ? 0 : 200 }}
```

## Legacy

`spring()` and `tweened()` functions are deprecated; use Spring and Tween classes instead.