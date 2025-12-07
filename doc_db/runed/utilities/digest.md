## Reactive DOM & State Utilities

Collection of reactive wrappers and utilities for common browser APIs and state management patterns.

### Focus & Visibility
- **activeElement**: Reactive access to `document.activeElement` with Shadow DOM support. Returns `null` when no element focused. Use `new ActiveElement({ document: shadowRoot })` for custom scopes.
- **IsDocumentVisible**: Tracks `document.hidden` via Page Visibility API. `visible.current` is boolean, updates on `visibilitychange` events.
- **IsFocusWithin**: Tracks if any descendant has focus in container. `new IsFocusWithin(() => element)` exposes `current` boolean.

### Element Measurements
- **ElementRect**: Reactive DOMRect tracking with individual properties (`width`, `height`, `top`, `left`, `right`, `bottom`, `x`, `y`) and complete `current` object. Updates on size/position changes.
- **ElementSize**: Simplified version tracking only `width` and `height`.
- **ScrollState**: Tracks scroll position (`x`, `y`), direction (`left`, `right`, `top`, `bottom`), edge arrival (`arrived`), and progress. Supports programmatic scrolling (`scrollTo()`, `scrollToTop()`, `scrollToBottom()`), RTL, and debounced stop callbacks.

### Animation & Timing
- **AnimationFrames**: Declarative `requestAnimationFrame` wrapper with FPS limiting and frame metrics. `new AnimationFrames((args) => {}, { fpsLimit: () => 10 })` provides `fps` property and `delta` (ms since last frame). Methods: `start()`, `stop()`.
- **useInterval**: Reactive `setInterval` wrapper with pause/resume, tick counter, and optional callback. `useInterval(() => delay, { callback: (count) => {} })` with `counter`, `isActive`, `pause()`, `resume()`, `reset()`.

### User Interaction
- **PressedKeys**: Tracks currently pressed keyboard keys. `keys.has("ArrowDown")` or `keys.has("Control", "a")` for combinations. `keys.all` for all pressed keys. `keys.onKeys(["meta", "k"], callback)` for key combo listeners.
- **IsIdle**: Detects user idle state based on activity (mousemove, keydown, touch, etc.). `new IsIdle({ timeout: 1000 })` exposes `current` (boolean) and `lastActive` (timestamp). Options: `events`, `timeout`, `detectVisibilityChanges`, `initialState`.
- **onClickOutside**: Detects clicks outside element. `onClickOutside(() => element, callback, { immediate: true, detectIframe: false })` returns `{ start(), stop(), enabled }`.

### Async & Data Fetching
- **resource**: Reactive async data fetcher with automatic request cancellation, loading/error states, debounce/throttle. `resource(() => id, async (id, prevId, { signal, onCleanup }) => {}, { debounce: 300 })` provides `current`, `loading`, `error`, `mutate()`, `refetch()`. Supports multiple dependencies as array. `resource.pre()` for pre-render execution.
- **PersistedState**: Reactive state with localStorage/sessionStorage persistence and cross-tab sync. `new PersistedState("key", initialValue, { storage: "local", syncTabs: true, connected: true, serializer: {} })`. Methods: `connect()`, `disconnect()`. Plain objects/arrays deeply reactive; class instances require full replacement.

### State Management
- **Context**: Type-safe Context API wrapper. `new Context<T>("name")` with `.set(value)` in parent init, `.get()` or `.getOr(fallback)` in child init. `.exists()` to check if set.
- **Debounced**: Debounced state wrapper. `new Debounced(() => value, 500)` with `current` property. Methods: `cancel()`, `setImmediately(value)`, `updateImmediately()`.
- **Throttled**: Throttled state wrapper. `new Throttled(() => value, 500)` with `current` property. Methods: `cancel()`, `setImmediately(value)`.
- **Previous**: Maintains previous getter value. `new Previous(() => count)` exposes `current` (undefined initially, then previous value).
- **StateHistory**: Undo/redo tracking. `new StateHistory(() => count, (c) => count = c)` with `undo()`, `redo()`, `clear()`, `log` array, `canUndo`, `canRedo`.
- **IsMounted**: Mount state tracker. `new IsMounted()` with `current` boolean (false initially, true after mount).

### Reactive Utilities
- **watch**: Manually track specific reactive dependencies. `watch(() => count, (curr, prev) => {})` or `watch([() => a, () => b], ([a, b]) => {})`. Options: `lazy: true`. Variants: `watch.pre`, `watchOnce`, `watchOnce.pre`.
- **extract**: Unwraps `MaybeGetter<T>` (function or static value) to T. `extract(input, fallback)` handles functions returning undefined, static values, and fallbacks.
- **boolAttr**: Converts truthy/falsy to `""` or `undefined` for HTML boolean attributes. `boolAttr(value)` returns `""` when truthy, `undefined` when falsy.

### DOM Observers
- **useIntersectionObserver**: Observe element intersection. `useIntersectionObserver(() => target, (entries) => {}, { root: () => rootEl })` with `pause()`, `resume()`, `stop()`, `isActive` getter.
- **useResizeObserver**: Observe element size changes. `useResizeObserver(() => el, (entries) => { const { width, height } = entries[0].contentRect; })` with `stop()`.
- **useMutationObserver**: Observe DOM mutations. `useMutationObserver(() => el, (mutations) => {}, { attributes: true })` with `stop()`.
- **IsInViewport**: Tracks viewport visibility via Intersection Observer. `new IsInViewport(() => element)` with `current` boolean.

### Event Handling
- **useEventListener**: Auto-disposed event listeners. `useEventListener(() => document.body, "click", callback)` with automatic cleanup on component destroy or element change.
- **onCleanup**: Register cleanup function for effect context disposal. `onCleanup(() => { /* cleanup */ })` replaces `onDestroy`, works in components and `$effect.root`.

### Specialized Utilities
- **TextareaAutosize**: Auto-adjusts textarea height to content. `new TextareaAutosize({ element: () => el, input: () => value, styleProp: "height", maxHeight: 500 })` with `onResize` callback.
- **FiniteStateMachine**: Strongly-typed FSM. `new FiniteStateMachine<States, Events>("initial", { state: { event: "nextState" } })` with action functions, `_enter`/`_exit` lifecycle hooks, wildcard `"*"` handlers, and `debounce(ms, event)` scheduling.
- **useGeolocation**: Reactive Geolocation API wrapper. `useGeolocation()` provides `position`, `error`, `isSupported`, `isPaused`, `pause()`, `resume()`.
- **useSearchParams**: Type-safe URL search params with schema validation (Zod/Valibot/Arktype). `useSearchParams(schema, { debounce: 300, compress: true })` with `update()`, `reset()`, `toURLSearchParams()`. Supports date formatting, compression, history control. Server-side: `validateSearchParams(url, schema)`.

### Debounce & Throttle
- **useDebounce**: Debounce callback execution. `useDebounce(callback, () => duration)` with `runScheduledNow()`, `cancel()`, `pending` property.
- **useThrottle**: Throttle callback execution. `useThrottle(callback, () => duration)` limits execution to once per interval.