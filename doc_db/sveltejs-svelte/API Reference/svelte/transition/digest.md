The svelte/transition module provides built-in transition directives and functions for animating DOM elements when they enter, leave, or update in Svelte components.

Key transitions include:
- `fade` - opacity transition
- `fly` - movement with optional fade
- `slide` - height/width animation
- `scale` - size transformation
- `draw` - SVG path animation
- `crossfade` - coordinated transitions between elements

Transitions accept options like duration, delay, and easing functions. Custom transitions can be created using the transition API with update callbacks.

Example: `<div transition:fade={{ duration: 300 }}>Content</div>`