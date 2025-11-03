## Reactive Variables
Assignment-based reactivity; mutations require reassignment. `$:` statements are reactive and topologically ordered.

## Props & Events
Declare with `export let`. Handle events with `on:` directive and modifiers. Dispatch with `createEventDispatcher()`.

## Slots
Use `<slot>` and `slot="name"` for named slots. Check slots with `$$slots`. Fragment element for wrapper-free slot content.

## Dynamic Components & API
`<svelte:component this={Component} />` for dynamic rendering. Imperative API: `new App()`, `$set()`, `$on()`, `$destroy()`.