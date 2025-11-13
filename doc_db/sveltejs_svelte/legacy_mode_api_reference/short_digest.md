## Reactivity
Top-level variables auto-reactive; mutations need explicit reassignment. `$:` statements re-run on dependency changes (compile-time detection):
```svelte
$: sum = a + b;
```

## Props & Events
Props with `export`; access all with `$$props`/`$$restProps`. Events via `on:` directive with modifiers, custom events via `createEventDispatcher()`.

## Slots
Named slots with fallback content and data passing via `let:`. Check provided slots with `$$slots`. Use `<svelte:fragment>` for multi-element slots.

## Dynamic Components
`<svelte:component this={Component} />` for dynamic rendering; `<svelte:self>` for recursion.

## Imperative API
Components are classes: `new App({ target, props })`. Methods: `$set()`, `$on()`, `$destroy()`. SSR via `render()` method.