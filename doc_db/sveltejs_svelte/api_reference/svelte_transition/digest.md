## Transition Functions

Built-in transition functions for animating element entry and exit:

- **blur**: Animates blur filter and opacity. Parameters: `delay`, `duration`, `easing`, `amount`, `opacity`
- **fade**: Animates opacity from 0 to current (in) or current to 0 (out). Parameters: `delay`, `duration`, `easing`
- **fly**: Animates x, y position and opacity. Parameters: `delay`, `duration`, `easing`, `x`, `y`, `opacity`
- **scale**: Animates opacity and scale. Parameters: `delay`, `duration`, `easing`, `start`, `opacity`
- **slide**: Slides element in/out along an axis. Parameters: `delay`, `duration`, `easing`, `axis` ('x' or 'y')
- **draw**: Animates SVG stroke like drawing. Works with `<path>` and `<polyline>`. Parameters: `delay`, `speed`, `duration`, `easing`
- **crossfade**: Creates paired `send` and `receive` transitions that morph elements between positions. Accepts `fallback` transition for unmatched elements. Parameters: `delay`, `duration`, `easing`

All transitions return a `TransitionConfig` with optional `delay`, `duration`, `easing`, `css(t, u)`, and `tick(t, u)` properties.

Import: `import { blur, crossfade, draw, fade, fly, scale, slide } from 'svelte/transition'`