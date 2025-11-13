## Transition Functions

Seven built-in transitions for animating element entry/exit:
- **blur**, **fade**, **fly**, **scale**, **slide**, **draw** (SVG), **crossfade** (paired morphing)

Common parameters: `delay`, `duration`, `easing`. Specific ones: `amount`/`opacity` (blur), `x`/`y`/`opacity` (fly), `start`/`opacity` (scale), `axis` (slide), `speed` (draw).

Import: `import { blur, crossfade, draw, fade, fly, scale, slide } from 'svelte/transition'`