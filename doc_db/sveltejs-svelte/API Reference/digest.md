## Core Modules

- **svelte**: Main entry point with core framework APIs
- **svelte/action**: Custom actions for DOM element behavior
- **svelte/animate**: Animation utilities and directives
- **svelte/compiler**: Programmatic component compilation to JavaScript
- **svelte/easing**: Easing functions (linear, quadratic, cubic, sine, exponential, elastic, bounce) for smooth animations
- **svelte/events**: Event handling utilities
- **svelte/motion**: Smooth animations and value transitions with easing
- **svelte/transition**: Transition directives (fade, fly, slide, scale, draw, crossfade) with duration, delay, easing options. Example: `<div transition:fade={{ duration: 300 }}>Content</div>`
- **svelte/store**: Reactive state management with store creation and subscription
- **svelte/server**: Server-side rendering utilities
- **svelte/reactivity**: Reactive versions of Map, Set, URL, and other built-ins
- **svelte/reactivity/window**: Reactive window properties (innerWidth, innerHeight) accessible via `.current`
- **svelte/legacy**: Deprecated migration utilities from older versions

## Error and Warning Reference

### Client Runtime Errors
- **Binding**: Use `bind:checked` for checkboxes, `bind:this` for components; mark properties with `$bindable()`
- **State**: Cannot mutate state in `$derived()` or templates; use `$effect` for side-effects
- **Each blocks (runes mode)**: Use array index `array[i] = 4` instead of `entry = 4`
- **Hydration**: Server/client values must match; use `svelte-ignore` or force update via `$effect`
- **Snippets**: Use `{@render snippet()}` not `{snippet}`; need null checks

### Client Runtime Warnings
- **binding_property_non_reactive**: Binding targets non-reactive property
- **console_log_state**: Use `$inspect()` or `$state.snapshot()` instead of logging `$state` proxies
- **hydration_mismatch**: Server/client values or DOM structure don't match
- **ownership_invalid_mutation**: Use `bind:`, callbacks, or mark as `$bindable()` instead of mutating unbound props
- **transition_slide_display**: `slide` transition requires `display: block/flex/grid`
- **state_proxy_equality_mismatch**: `$state()` proxies have different identity; compare consistently

### Compiler Errors
- **Runes**: `$derived()` cannot reference itself; use `$effect` for side-effects
- **Props**: Use `$props()` instead of `export let`; mark bindable properties with `$bindable()`
- **Each blocks**: Use array index assignment in runes mode
- **Slots**: Cannot mix `<slot>` and `{@render}` directives
- **Lifecycle**: Methods must be called at top level, not in functions

### Compiler Warnings
- **Accessibility (a11y_*)**: No `accesskey`/`autofocus`; interactive elements need keyboard handlers; labels need associated controls; media needs captions; ARIA must match roles
- **Code Quality**: Unused CSS (use `:global` to preserve); lowercase component names; deprecated syntax