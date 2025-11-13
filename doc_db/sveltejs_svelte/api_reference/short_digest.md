## Core APIs

**Mounting & Lifecycle**: `mount()`, `hydrate()`, `unmount()`, `onMount()`, `onDestroy()`

**State & Effects**: `tick()`, `settled()`, `flushSync()`, `untrack()`, `getAbortSignal()`

**Context**: `setContext()`, `getContext()`, `getAllContexts()`, `hasContext()`, `createContext()`

**Snippets**: `createRawSnippet()`

**Advanced**: `fork()` for speculative state changes

## Compiler API

- `compile(source, options)` - Converts `.svelte` to JavaScript module
- `compileModule(source, options)` - Compiles JavaScript with runes
- `parse(source, options)` - Returns AST
- `preprocess(source, preprocessor, options)` - Applies preprocessor hooks
- `migrate(source, options)` - Migrates code to runes

## Utilities

**Actions**: `Action` interface for typing, `ActionReturn` with `update`/`destroy`

**Animations**: `flip()` from `svelte/animate`

**Attachments**: `createAttachmentKey()`, `fromAction()` - functions running on element mount

**Easing**: `linear`, `quadIn/Out/InOut`, `cubicIn/Out/InOut`, etc. from `svelte/easing`

**Events**: `on(element, type, handler)` from `svelte/events` - preserves handler execution order

**Motion**: `Spring`, `Tween` classes, `prefersReducedMotion` from `svelte/motion`

**Reactive Window**: `innerWidth.current`, `scrollX.current`, etc. from `svelte/reactivity/window`

**Reactive Built-ins**: `SvelteMap`, `SvelteSet`, `SvelteDate`, `SvelteURL`, `SvelteURLSearchParams`, `MediaQuery`, `createSubscriber()`

**Stores**: `writable()`, `readable()`, `derived()`, `get()`, `readonly()`, `fromStore()`, `toStore()`

**Transitions**: `blur`, `fade`, `fly`, `scale`, `slide`, `draw`, `crossfade` from `svelte/transition`

**Server**: `render(component, options)` for SSR

**Legacy**: Migration utilities in `svelte/legacy` for Svelte 4 compatibility