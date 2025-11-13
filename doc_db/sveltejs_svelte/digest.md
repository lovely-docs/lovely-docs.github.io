## Introduction & Setup
Svelte is a compiler-based framework transforming declarative components into optimized JavaScript. Components use `.svelte` files combining HTML, CSS, and JavaScript. Setup via SvelteKit (`npx sv create myapp`) or Vite.

## Runes (Svelte 5)
Compiler keywords managing reactivity:
- `$state(value)` - Reactive state; arrays/objects become deeply reactive proxies
- `$derived(expression)` - Computed values auto-updating on dependency changes
- `$effect(() => { /* side effects */ })` - Runs when state updates; supports `$effect.pre` for pre-DOM execution
- `$props()` - Receives component inputs with destructuring and defaults
- `$bindable()` - Marks props for bidirectional binding
- `$inspect(value)` - Development debugging; logs on changes
- `$host()` - Accesses host element in custom elements

## Template Syntax
- **Markup**: HTML tags lowercase, components capitalized. Attributes accept expressions `{expr}`. Shorthand `{name}` for `name={name}`. Spread with `{...object}`.
- **Events**: `on:eventname` or `onclick` (case-sensitive). Delegated events require `bubbles: true`.
- **Text**: `{expression}` renders; null/undefined omit. Use `{@html string}` for raw HTML.
- **Conditionals**: `{#if}...{:else if}...{:else}...{/if}`
- **Iteration**: `{#each items as item, i (key)}...{:else}...{/each}` with optional keying and destructuring
- **Async**: `{#await promise}pending{:then value}...{:catch error}...{/await}`
- **Snippets**: `{#snippet name(params)}...{/snippet}` defines reusable blocks; `{@render snippet()}` renders them
- **Directives**: `bind:property`, `use:action`, `transition:name`, `animate:name`, `style:property`, `class:name={condition}`
- **Special tags**: `{@const name = value}`, `{@debug var}`, `{@attach function}`

## Styling
- Scoped by default using hash-based classes; specificity increased 0-1-0
- `:global(selector)` applies globally; `:global { ... }` blocks for multiple selectors
- CSS custom properties: `<Component --color="red" />` and read with `var(--color, default)`
- Keyframe names scoped automatically; use `-global-` prefix for global keyframes

## Special Elements
- `<svelte:boundary>` - Error boundary catching rendering/effect errors with fallback UI and async state management
- `<svelte:window>` - Attaches listeners to window; bindable: `innerWidth`, `innerHeight`, `scrollX`, `scrollY`, `online`
- `<svelte:document>` - Attaches to document; bindable: `activeElement`, `visibilityState`
- `<svelte:body>` - Attaches to document.body
- `<svelte:head>` - Inserts into document.head
- `<svelte:element this={tag}>` - Runtime-determined tag name
- `<svelte:options customElement="my-element" namespace="svg" />` - Per-component compiler config

## State Management & Lifecycle
**Stores** (`svelte/store`):
- `writable(initial)` - Mutable store with `.set()` and `.update()`
- `readable(initial, (set) => { ... })` - Read-only with callback
- `derived(store(s), callback)` - Computed from source stores
- `get(store)` - Retrieve value synchronously
- Access with `$` prefix for auto-subscription

**Context**: `setContext(key, value)` and `getContext(key)` for parent-to-child passing without prop-drilling

**Lifecycle**:
- `onMount(fn)` - After DOM mount; can return cleanup
- `onDestroy(fn)` - Before unmount; only hook running in SSR
- `tick()` - Promise resolving after state changes apply to DOM

**Imperative API**:
- `mount(Component, { target, props })` - Instantiate and mount
- `unmount(component, { outro })` - Remove component
- `hydrate(Component, { target, props })` - Reuse SSR HTML

## Runtime APIs
**Animations**: `flip(node, { from, to })` - FLIP animation between positions

**Transitions** (built-in): `blur`, `fade`, `fly`, `scale`, `slide`, `draw` (SVG), `crossfade`

**Actions**: Type with `Action<Element, Param>` interface; return `ActionReturn` with optional `update` and `destroy`

**Easing**: `linear`, `quadIn/Out/InOut`, `cubicIn/Out/InOut`, etc. from `svelte/easing`

**Motion**: `Spring` and `Tween` classes for physics-based and duration-based animations

**Reactive built-ins**: `SvelteMap`, `SvelteSet`, `SvelteDate`, `SvelteURL`, `SvelteURLSearchParams` from `svelte/reactivity`

**Compiler API**: `compile(source, options)`, `parse(source)`, `preprocess(source, preprocessor)`, `migrate(source)` from `svelte/compiler`

## Testing & TypeScript
**Testing**: Unit tests with Vitest using `mount()` API; component tests with `@testing-library/svelte`; E2E with Playwright

**TypeScript**: Add `lang="ts"` to script tags. Type props with interface and `$props()`. Use `generics="Item extends { ... }"` for generic components. Type actions with `Action<Element, Param>`.

**Custom Elements**: Compile with `<svelte:options customElement="my-element" />`. Access host via `$host()`. Properties exposed as attributes and properties.

## Migration
**Svelte 4→5**: `let` → `$state()`, `$:` → `$derived()` or `$effect()`, `export let` → `$props()`, `on:` → event attributes, slots → snippets with `children` prop, components now functions not classes

**Legacy Mode** (Svelte 3/4): Top-level variables reactive; `$:` for reactive statements; `export` for props; `createEventDispatcher()` for events; `<slot>` for content projection; `new Component({ target, props })` for imperative API