The `svelte/easing` module provides a collection of easing functions for animations and transitions. These functions take a value between 0 and 1 (representing progress through an animation) and return an eased value, allowing you to create smooth, natural-looking motion effects.

Common easing functions include:
- Linear: constant speed
- Quadratic, cubic, quartic, quintic: polynomial easing with varying intensity
- Sine, exponential, circular: smooth curves with different characteristics
- Elastic, back, bounce: specialized effects for springy or bouncy animations

Example usage in a Svelte transition:
```javascript
import { quintOut } from 'svelte/easing';

transition:fade={{ duration: 300, easing: quintOut }}
```