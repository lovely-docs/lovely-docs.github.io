## Spring

A class that animates values with spring physics. Changes to `spring.target` smoothly move `spring.current` towards it based on `stiffness` and `damping` parameters.

```js
import { Spring } from 'svelte/motion';
const spring = new Spring(0);
spring.target = 100; // current animates towards 100
```

Methods:
- `set(value, options)` - Sets target and returns promise when animation completes. Options: `instant` (skip animation), `preserveMomentum` (continue trajectory for N ms)
- `Spring.of(fn, options)` - Bind spring to reactive function return value

Properties: `target`, `current`, `stiffness`, `damping`, `precision`

## Tween

A class that smoothly animates values over a fixed duration. Changes to `tween.target` move `tween.current` towards it using `delay`, `duration`, and `easing` options.

```js
import { Tween } from 'svelte/motion';
const tween = new Tween(0);
tween.target = 100; // current animates towards 100 over duration
```

Methods:
- `set(value, options)` - Sets target and returns promise when animation completes
- `Tween.of(fn, options)` - Bind tween to reactive function return value

Properties: `target`, `current`

## prefersReducedMotion

A media query that detects if user prefers reduced motion. Use to conditionally disable animations for accessibility.

```js
import { prefersReducedMotion } from 'svelte/motion';
transition:fly={{ y: prefersReducedMotion.current ? 0 : 200 }}
```

## Legacy APIs

- `spring()` function - Deprecated, use `Spring` class instead
- `tweened()` function - Deprecated, use `Tween` class instead