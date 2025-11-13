The `svelte/easing` module provides a collection of easing functions for animations and transitions. Available functions include:

- **Linear**: `linear` - constant speed
- **Quadratic**: `quadIn`, `quadOut`, `quadInOut`
- **Cubic**: `cubicIn`, `cubicOut`, `cubicInOut`
- **Quartic**: `quartIn`, `quartOut`, `quartInOut`
- **Quintic**: `quintIn`, `quintOut`, `quintInOut`
- **Sine**: `sineIn`, `sineOut`, `sineInOut`
- **Exponential**: `expoIn`, `expoOut`, `expoInOut`
- **Circular**: `circIn`, `circOut`, `circInOut`
- **Back**: `backIn`, `backOut`, `backInOut`
- **Bounce**: `bounceIn`, `bounceOut`, `bounceInOut`
- **Elastic**: `elasticIn`, `elasticOut`, `elasticInOut`

Each function accepts a normalized time value `t` (typically 0 to 1) and returns the eased value. The `In`, `Out`, and `InOut` variants control whether easing is applied at the start, end, or both ends of the animation.

Import example: `import { cubicInOut, bounceOut } from 'svelte/easing';`