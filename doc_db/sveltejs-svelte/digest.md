# Complete Documentation

## Getting Started
- **Project Setup**: Create with `npx sv create myapp` (SvelteKit recommended) or Vite. VS Code extension available.
- **Component Structure**: `.svelte` files contain `<script>`, `<script module>`, and `<style>` (auto-scoped). Use `.svelte.js/.ts` for reusable reactive logic.

## Runes (Reactive Keywords)
Core system of `$`-prefixed compiler keywords:
- **$state**: Reactive state; arrays/objects become deep proxies. Use `$state.raw` for non-reactive, `$state.snapshot()` for plain objects.
- **$derived**: Automatic computed values when dependencies change. Use `$derived.by(() => {...})` for complex logic.
- **$effect**: Side effects triggered by state updates with automatic dependency tracking. Use `$effect.pre` for pre-DOM, `$effect.root()` for manual control. Returns cleanup function.
- **$props()**: Receive component props with destructuring, defaults, renaming, rest syntax.
- **$bindable()**: Mark props for two-way binding from parent components.
- **$inspect(value)**: Development-only reactive logging; `.with()` for custom handlers, `.trace()` for debugging.
- **$host()**: Access host element in custom element components.

## Template Syntax
- **Markup**: HTML tags (lowercase) or components (capitalized). Attributes: `{expr}` for JS, shorthand `{prop}`, spread `{...obj}`. Text: `{expr}` interpolation, `{@html raw}` for unsafe HTML.
- **Events**: `on:eventname` directive; case-sensitive. Use `svelte/events` `on()` function to avoid stopPropagation issues.
- **Conditionals**: `{#if} {:else if} {:else} {/if}` blocks.
- **Iteration**: `{#each items as item, i (item.id)} {:else} {/each}` with optional keying and fallback.
- **Async**: `{#await promise} {:then value} {:catch error} {/await}` for Promise states.
- **Key blocks**: `{#key expr} content {/key}` destroys/recreates on change.
- **Snippets**: `{#snippet name(param)} ... {/snippet}` reusable blocks; render with `{@render name()}` or pass to components. Type with `Snippet<[ParamType]>`.
- **Data Binding**: 
  - `bind:value` for inputs, auto-coerces type="number"|"range" to number
  - `bind:checked` for checkboxes, `bind:group` for radio/checkbox groups, `bind:files` for file inputs
  - `bind:value` for select (single or multiple array)
  - Media: `bind:currentTime|playbackRate|paused|volume|muted` (two-way) and readonly `duration|buffered|seekable|seeking|ended`
  - `bind:open` for details, `bind:this` for element references, readonly dimensions
  - Component props: `let { count = $bindable(0) } = $props()` then parent `bind:count={value}`
  - Function binding: `bind:value={{ get: () => val, set: (v) => val = v }}`
- **Styling**:
  - Classes: `class={{ active, disabled: !enabled }}` or array `class={[cond && 'class-name']}`
  - Inline styles: `style:color="red"` or `style:width={w}`. `|important` modifier overrides.
- **Directives**:
  - `use:action`: Attach behavior; returns object with `$effect`, `destroy` cleanup
  - `transition:fade|fly|slide|scale|draw|crossfade`: Bidirectional enter/exit animations with `duration`, `delay`, `easing`. Custom: return `{ duration, css(t,u), tick(t,u) }`
  - `in:/out:`: Non-bidirectional (in continues during outro)
  - `animate:flip`: Reorder animation in keyed each blocks
- **Utility Tags**:
  - `{@const var = expr}`: Block-scoped constants
  - `{@debug var1, var2}` or `{@debug}`: Reactive logging
  - `{@attach fn}`: Reactive attachment with optional cleanup
  - `{@render snippet()}`: Render snippet; supports optional chaining
- **Comments**: `<!-- -->` standard HTML; `@component` shows documentation in IDE.

## Styling
- **Scoped**: Svelte adds hash classes automatically; scoped selectors get 0-1-0 specificity boost over globals.
- **Global**: `:global(selector)` or `:global { ... }` block for multiple; `-global-` prefix for keyframes.
- **CSS Custom Properties**: `--property-name` passed to components; inherited from parents and `:root`.
- **Nested `<style>`**: Only one top-level allowed per component; nested tags bypass scoping and apply globally.

## Special Elements
- **`<svelte:boundary>`**: Error boundary catching render/update/effect errors. Optional `failed` snippet or `onerror` callback.
- **`<svelte:window>`**: Attach listeners to window with cleanup. Bindable: `innerWidth|innerHeight|outerWidth|outerHeight|scrollX|scrollY|online|devicePixelRatio`.
- **`<svelte:document>`**: Listeners/actions on document. Bindable readonly: `activeElement|fullscreenElement|pointerLockElement|visibilityState`.
- **`<svelte:body>`**: Listeners/actions on document.body (for mouseenter/mouseleave).
- **`<svelte:head>`**: Insert into document.head.
- **`<svelte:element this={tag}>`**: Runtime-determined tag name; renders nothing if nullish. Supports `xmlns` for SVG/XML.
- **`<svelte:options>`**: Per-component settings: `runes`, `namespace`, `customElement`, `css`.

## Runtime APIs
- **Stores**: Reactive state with `writable`, `readable`, `derived`, `readonly`, `get()`. Implements `.subscribe(fn)` contract. Custom stores return stores from `$derived`.
- **Context**: `setContext(key, value)` and `getContext(key)` for parent-child data without prop drilling. Request-isolated, SSR-safe.
- **Lifecycle**:
  - `onMount()`: Runs on DOM mount only (not server); can return cleanup function
  - `onDestroy()`: Runs before unmount (runs on server)
  - `tick()`: Promise resolving after pending state changes apply
- **Component APIs**:
  - `mount(Component, options)`: Instantiate and mount
  - `unmount(component)`: Remove and return promise after transitions
  - `render(Component, props)`: Server-only SSR
  - `hydrate(Component, options)`: Mount reusing server HTML

## Testing
- **Unit/Integration**: Vitest; wrap effect tests in `$effect.root()`, use `flushSync()` for sync execution
- **Components**: `mount(Component, { target, props })` or `@testing-library/svelte`
- **E2E**: Playwright with webServer config

## TypeScript
- Add `lang="ts"` to `<script>`. Configure `vitePreprocess` in `svelte.config.js`. Use generics: `<script lang="ts" generics="T extends { id: number }">`.
- `Component<Props>` and `ComponentProps<TComponent>` for type constraints.
- Extend custom element types in `.d.ts` via `svelteHTML.IntrinsicElements`.

## Custom Elements
- Compile to web components: `<svelte:options customElement="tag-name" />` or `customElement={{ tag, shadow, props, extend }}`.
- Props exposed as DOM properties/attributes with `reflect` and `attribute` options.
- Limitations: styles encapsulated, not SSR-friendly, slotted content eager, context doesn't cross boundaries.

## Migration (Svelte 4→5)
- **Reactivity**: `let` → `$state`, `$:` → `$derived`/`$effect`, `export let` → `$props()`
- **Events**: `on:click` → `onclick`, `createEventDispatcher` → callback props
- **Slots**: `<slot />` → `children` prop with `{@render}`, named slots → props, `let:` → snippets
- **Components**: Classes → functions, `new App({target})` → `mount(App, {target})`
- **Other**: Mark bindable props with `$bindable()`, stricter HTML, modern browsers only, `null`/`undefined` render empty
- Run `npx sv migrate svelte-5` for automatic migration.

## Legacy Mode (Svelte 3/4)
- **Reactivity**: Top-level `let` auto-reactive via assignment; reassign to trigger updates
- **Reactive Statements**: `$: dependent = source` re-runs when dependencies change; topologically ordered
- **Props**: `export let prop = default`; `$$props` for all, `$$restProps` for undeclared
- **Events**: `on:click` with modifiers (preventDefault, stopPropagation, capture, once, self, passive)
- **Dispatch**: `createEventDispatcher()` with `dispatch('event', detail)`
- **Slots**: `<slot />` and named `slot="name"`. Check `$$slots.name`. Use `let:data` to receive props.
- **Dynamic Components**: `<svelte:component this={Comp} />`
- **Imperative**: `new App({ target, props })` with `$set()`, `$on()`, `$destroy()`

## API Reference
- **Core Modules**: svelte, svelte/action, svelte/animate, svelte/compiler, svelte/easing, svelte/events, svelte/motion, svelte/transition, svelte/store, svelte/server, svelte/reactivity, svelte/legacy
- **Error/Warning**: Check binding targets are reactive, don't mutate `$derived`, use `bind:checked`/`$bindable()`, avoid console logging `$state` proxies, hydration mismatches, `slide` transition requires `display: block/flex/grid`, accessibility rules (a11y_*), component naming conventions

## Key Patterns
- **State Management**: `$state` for local, stores for shared/async, context for parent-child
- **Side Effects**: `$effect` for reactions, lifecycle hooks for mount/destroy, actions for DOM behavior
- **Rendering**: Snippets for reusable markup, `{@render}` to invoke, keyed each for animations
- **Binding**: Mark props `$bindable()`, parent uses `bind:prop={value}`, function binding for validation
- **Styling**: Scoped by default, use `:global()` for exceptions, CSS custom properties for theming
