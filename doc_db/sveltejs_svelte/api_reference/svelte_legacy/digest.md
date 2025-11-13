## Migration utilities for Svelte 4 to Svelte 5

The `svelte/legacy` module provides deprecated functions to help migrate from Svelte 4 to Svelte 5. All exports are temporary solutions and should be replaced over time.

### Component migration
- `asClassComponent(component)` - Converts a Svelte 5 component function to a Svelte 4 compatible class component
- `createClassComponent(options)` - Creates a Svelte 4 compatible component from options and a component function

### Event handling
- `handlers(...handlers)` - Combines multiple event listeners into one
- `once(fn)` - Wraps a function to execute only once
- `preventDefault(fn)` - Wraps a function to call `preventDefault()` on the event
- `stopPropagation(fn)` - Wraps a function to call `stopPropagation()` on the event
- `stopImmediatePropagation(fn)` - Wraps a function to call `stopImmediatePropagation()` on the event
- `self(fn)` - Wraps a function to only execute when event target matches the element
- `trusted(fn)` - Wraps a function to only execute for trusted events

### Event modifiers as actions
- `passive(node, [event, handler])` - Action implementing the `passive` event modifier
- `nonpassive(node, [event, handler])` - Action implementing the `nonpassive` event modifier

### Other utilities
- `createBubbler()` - Returns a function that creates bubble handlers mimicking Svelte 4's automatic event delegation
- `run(fn)` - Executes a function immediately on server, works like `$effect.pre` on client