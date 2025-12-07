## `on:` Directive for Event Handlers

Attach handlers with `on:eventname={handler}` or inline. Modifiers available: `preventDefault`, `stopPropagation`, `stopImmediatePropagation`, `passive`, `nonpassive`, `capture`, `once`, `self`, `trusted` (chain with `|`).

Forward events with `on:eventname` (no value). Multiple listeners supported.

## Component Events

Use `createEventDispatcher()` to dispatch custom events. Consumers listen with `on:eventname={handler}`. Events don't bubble; only `once` modifier valid. For Svelte 5 migration, use callback props instead.