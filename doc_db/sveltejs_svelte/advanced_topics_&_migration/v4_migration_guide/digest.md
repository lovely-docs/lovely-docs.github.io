## Minimum version requirements
- Node 16+, SvelteKit 1.20.4+, vite-plugin-svelte 2.4.1+, webpack 5+ with svelte-loader 3.1.8+, rollup-plugin-svelte 7.1.5+, TypeScript 5+

## Browser conditions for bundlers
Bundlers must specify the `browser` condition. For Rollup, set `browser: true` in `@rollup/plugin-node-resolve`. For webpack, add `"browser"` to `conditionNames` array.

## Removal of CJS output
CommonJS format, `svelte/register` hook, and CJS runtime are removed. Use a bundler to convert ESM to CJS if needed.

## Stricter types
- `createEventDispatcher` now enforces payload requirements (optional, required, or non-existent)
- `Action` and `ActionReturn` default to `undefined` parameter type; specify generic if needed: `Action<HTMLElement, string>`
- `onMount` errors if you return a function asynchronously (only sync returns work as destroy callbacks)

## Custom Elements
Replace `<svelte:options tag="my-component" />` with `<svelte:options customElement="my-component" />`

## SvelteComponentTyped deprecated
Replace `SvelteComponentTyped` with `SvelteComponent`. If using `typeof SvelteComponent` as a type, change to `typeof SvelteComponent<any>`.

## Transitions are local by default
Transitions only play when the direct parent block is created/destroyed, not ancestor blocks. Use `|global` modifier to restore old behavior.

## Default slot bindings
Slot bindings are no longer shared between default and named slots:
```svelte
<Nested let:count>
  <p>{count}</p>
  <p slot="bar">{count}</p> <!-- count not available here -->
</Nested>
```

## Preprocessors
Execution order changed: preprocessors run in order, within each preprocessor: markup → script → style. MDsveX must come before script/style preprocessors. Each preprocessor must have a name.

## ESLint
`eslint-plugin-svelte3` is deprecated. Switch to `eslint-plugin-svelte`.

## Other breaking changes
- `inert` attribute applied to outroing elements
- Runtime uses `classList.toggle(name, boolean)` and `CustomEvent` constructor (may need polyfills for old browsers)
- `StartStopNotifier` interface now requires update function in addition to set function
- `derived` throws on falsy values instead of stores
- `svelte/internal` type definitions removed
- DOM node removal is now batched
- `svelte.JSX` namespace replaced with `svelteHTML` namespace; use `svelte/elements` for types