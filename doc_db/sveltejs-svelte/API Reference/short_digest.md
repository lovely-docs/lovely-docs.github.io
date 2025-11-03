## API Modules
Core framework modules: **svelte**, **svelte/action**, **svelte/animate**, **svelte/transition**, **svelte/store**, **svelte/compiler**, **svelte/server**, **svelte/reactivity**, **svelte/motion**, **svelte/easing**, **svelte/events**, **svelte/legacy**

Example: `<div transition:fade={{ duration: 300 }}>Content</div>`

## Common Errors & Warnings
- Use `$props()` and `$bindable()` for prop handling; use `$derived()` and `$effect()` for state
- Use array index `array[i] = 4` in each blocks with runes
- Ensure server/client hydration matches; use `{@render snippet()}` syntax
- Accessibility: interactive elements need keyboard handlers, labels need controls, media needs captions
- `transition:slide` requires `display: block/flex/grid`