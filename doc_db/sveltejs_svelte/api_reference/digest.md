## Core Component API

**Component type** - Type for strongly-typed Svelte components with intellisense support.

**mount(component, options)** - Mounts component to target, returns exports. Options: `target`, `anchor`, `props`, `events`, `context`, `intro`.

**hydrate(component, options)** - Hydrates SSR-rendered HTML on target.

**unmount(component, options)** - Unmounts component, optionally plays outro transitions with `{ outro: true }`.

## Lifecycle Functions

**onMount(callback)** - Runs after component mounts to DOM, can return cleanup function. Doesn't run during SSR.

**onDestroy(callback)** - Runs before unmount. Only lifecycle that runs in SSR.

**beforeUpdate/afterUpdate** - Deprecated, use `$effect.pre` and `$effect` instead.

## Context API

**createContext()** - Type-safe context pair returning `[get, set]` functions (5.40.0+).

**getContext(key)** - Retrieves context from parent.

**setContext(key, value)** - Associates context for children.

**getAllContexts()** - Gets entire context map.

**hasContext(key)** - Checks if context exists.

## Event Handling

**createEventDispatcher()** - Creates typed event dispatcher (deprecated, use callback props or `$host()`).

**on(target, event, handler, options)** - Attaches event listener to window/document/element/MediaQueryList/EventTarget, returns unsubscribe function. Preserves correct handler execution order vs declarative handlers.

## State & Synchronization

**tick()** - Returns promise resolving after pending state changes applied to DOM.

**settled()** - Returns promise resolving after state changes and async work complete (5.36+).

**flushSync(callback?)** - Synchronously flushes pending updates.

**fork(fn)** - Creates off-screen fork for speculative state changes, returns object with `commit()` and `discard()` methods (5.42+).

**untrack(fn)** - Prevents state reads inside function from being treated as dependencies.

**getAbortSignal()** - Returns AbortSignal that aborts when derived/effect re-runs or destroys.

## Animations & Transitions

**flip(node, {from, to}, params)** - FLIP animation for position changes. Returns AnimationConfig with `delay`, `duration`, `easing`, `css`, `tick`.

**Transition functions** - blur, fade, fly, scale, slide, draw (SVG), crossfade (paired morphing). All accept `delay`, `duration`, `easing` plus function-specific params.

**Easing functions** - 32 functions: linear, quad/cubic/quart/quint/sine/expo/circ/back/bounce/elastic with In/Out/InOut variants.

## Motion Classes

**Spring** - Physics-based animation class. Properties: `target`, `current`, `stiffness`, `damping`, `precision`. Methods: `set(value, options)` with `instant` and `preserveMomentum` options.

**Tween** - Time-based animation class. Properties: `target`, `current`. Methods: `set(value, options)` with delay/duration/easing overrides.

**prefersReducedMotion** - Media query matching user's prefers-reduced-motion setting (5.7.0+).

## Stores

**readable(value?, start?)** - Read-only store with optional initialization callback.

**writable(value?, start?)** - Store with `set(value)` and `update(updater)` methods.

**derived(stores, fn, initial?)** - Computed store from source stores, supports async via `set`/`update` callbacks.

**get(store)** - Synchronously retrieves current store value.

**readonly(store)** - Wraps store to hide write interface.

**fromStore(store)** - Converts store to reactive object with `current` property.

**toStore(get, set?)** - Converts getter/setter functions to store.

## Reactive Built-ins

**MediaQuery** - Wraps `matchMedia()` with reactive `current` property (5.7.0+).

**SvelteDate** - Reactive Date wrapper, triggers reactivity on method reads.

**SvelteMap/SvelteSet** - Reactive Map/Set, trigger on iteration/size/get/has/add/delete.

**SvelteURL/SvelteURLSearchParams** - Reactive URL wrapper with reactive `searchParams`.

**createSubscriber(start)** - Integrates external event systems with Svelte reactivity (5.7.0+).

## Reactive Window Properties

**innerWidth/Height, outerWidth/Height, scrollX/Y, screenLeft/Top, devicePixelRatio, online** - All have reactive `.current` property, undefined on server. screenLeft/Top update via requestAnimationFrame.

## Attachments

**createAttachmentKey()** - Creates symbol for programmatic attachment spreading onto elements.

**fromAction(action, fn)** - Converts action to attachment with identical behavior.

**Attachment** - Function running on element mount, optionally returns cleanup function.

## Compiler API

**compile(source, options)** - Converts `.svelte` to JavaScript module. Returns `{ js, css, warnings, metadata, ast }`.

**compileModule(source, options)** - Compiles JavaScript with runes.

**parse(source, options)** - Parses component to AST. With `modern: true` returns modern format.

**preprocess(source, preprocessor, options)** - Applies preprocessor hooks (e.g., sass→css). Accepts single or array of PreprocessorGroup.

**migrate(source, options)** - Best-effort migration to runes/event attributes/render tags.

**CompileOptions** - `name`, `customElement`, `namespace`, `css` ('injected'|'external'), `cssHash`, `preserveComments`, `preserveWhitespace`, `fragments` ('html'|'tree'), `runes`, `compatibility.componentApi` (4|5), `experimental.async`.

## Server Rendering

**render(component, options)** - Server-only function returning `{ body, head }` HTML strings. Options: `props`, `context`, `idPrefix`.

## Types

**ComponentProps** - Extracts props type from component.

**Snippet** - Type for snippet blocks with typed parameters.

**Action/ActionReturn** - Interfaces for typing element lifecycle functions with optional update/destroy callbacks and custom attributes/events.

## Legacy APIs

**asClassComponent, createClassComponent, createBubbler** - Svelte 4 compatibility functions.

**Event modifiers** - once, preventDefault, stopPropagation, stopImmediatePropagation, self, trusted, passive, nonpassive functions replacing removed modifiers.

**spring(value?, opts?), tweened(value?, defaults?)** - Deprecated store functions, use Spring/Tween classes instead.