## Reactive DOM & State Utilities

Collection of reactive wrappers for browser APIs and state management patterns, designed to work with Svelte's `$state` and `$effect`.

### Focus & Visibility
- **activeElement**: Reactive `document.activeElement` with Shadow DOM support via `new ActiveElement({ document: shadowRoot })`
- **IsDocumentVisible**: Tracks `document.hidden` via Page Visibility API
- **IsFocusWithin**: Tracks if any descendant has focus in container

### Element Measurements
- **ElementRect**: Reactive DOMRect with individual properties (`width`, `height`, `top`, `left`, `right`, `bottom`, `x`, `y`) and complete `current` object
- **ElementSize**: Simplified tracking of `width` and `height`
- **ScrollState**: Tracks scroll position (`x`, `y`), direction, edge arrival, and progress. Methods: `scrollTo()`, `scrollToTop()`, `scrollToBottom()`. Supports RTL and debounced stop callbacks

### Animation & Timing
- **AnimationFrames**: Declarative `requestAnimationFrame` wrapper with FPS limiting. `new AnimationFrames((args) => {}, { fpsLimit: () => 10 })` provides `fps` property and `delta` (ms since last frame)
- **useInterval**: Reactive `setInterval` wrapper with pause/resume and tick counter. `useInterval(() => delay, { callback: (count) => {} })`

### User Interaction
- **PressedKeys**: Tracks pressed keyboard keys. `keys.has("ArrowDown")` or `keys.has("Control", "a")` for combinations. `keys.onKeys(["meta", "k"], callback)` for listeners
- **IsIdle**: Detects user idle state. `new IsIdle({ timeout: 1000 })` exposes `current` (boolean) and `lastActive` (timestamp)
- **onClickOutside**: Detects clicks outside element. `onClickOutside(() => element, callback, { immediate: true, detectIframe: false })`

### Async & Data Fetching
- **resource**: Reactive async data fetcher with automatic cancellation, loading/error states, debounce/throttle. `resource(() => id, async (id, prevId, { signal, onCleanup }) => {}, { debounce: 300 })` provides `current`, `loading`, `error`, `mutate()`, `refetch()`. Supports multiple dependencies as array
- **PersistedState**: Reactive state with localStorage/sessionStorage persistence and cross-tab sync. `new PersistedState("key", initialValue, { storage: "local", syncTabs: true })`

### State Management
- **Context**: Type-safe Context API wrapper. `new Context<T>("name")` with `.set(value)` in parent, `.get()` or `.getOr(fallback)` in child
- **Debounced**: Debounced state wrapper. `new Debounced(() => value, 500)` with `cancel()`, `setImmediately(value)`, `updateImmediately()`
- **Throttled**: Throttled state wrapper. `new Throttled(() => value, 500)` with `cancel()`, `setImmediately(value)`
- **Previous**: Maintains previous getter value. `new Previous(() => count)` exposes `current` (undefined initially, then previous value)
- **StateHistory**: Undo/redo tracking. `new StateHistory(() => count, (c) => count = c)` with `undo()`, `redo()`, `clear()`, `canUndo`, `canRedo`
- **IsMounted**: Mount state tracker. `new IsMounted()` with `current` boolean

### Reactive Utilities
- **watch**: Manually track dependencies. `watch(() => count, (curr, prev) => {})` or `watch([() => a, () => b], ([a, b]) => {})`. Variants: `watch.pre`, `watchOnce`, `watchOnce.pre`
- **extract**: Unwraps `MaybeGetter<T>` (function or static value) to T. Handles functions returning undefined and fallbacks
- **boolAttr**: Converts truthy/falsy to `""` or `undefined` for HTML boolean attributes

### DOM Observers
- **useIntersectionObserver**: Observe element intersection. `useIntersectionObserver(() => target, (entries) => {}, { root: () => rootEl })` with `pause()`, `resume()`, `stop()`
- **useResizeObserver**: Observe element size changes. `useResizeObserver(() => el, (entries) => { const { width, height } = entries[0].contentRect; })`
- **useMutationObserver**: Observe DOM mutations. `useMutationObserver(() => el, (mutations) => {}, { attributes: true })`
- **IsInViewport**: Tracks viewport visibility via Intersection Observer

### Event Handling
- **useEventListener**: Auto-disposed event listeners. `useEventListener(() => document.body, "click", callback)` with automatic cleanup
- **onCleanup**: Register cleanup function for effect context disposal

### Specialized Utilities
- **TextareaAutosize**: Auto-adjusts textarea height to content. `new TextareaAutosize({ element: () => el, input: () => value, styleProp: "height", maxHeight: 500 })`
- **FiniteStateMachine**: Strongly-typed FSM. `new FiniteStateMachine<States, Events>("initial", { state: { event: "nextState" } })` with action functions, `_enter`/`_exit` lifecycle hooks, wildcard `"*"` handlers
- **useGeolocation**: Reactive Geolocation API wrapper. `useGeolocation()` provides `position`, `error`, `isSupported`, `isPaused`, `pause()`, `resume()`
- **useSearchParams**: Type-safe URL search params with schema validation (Zod/Valibot/Arktype). `useSearchParams(schema, { debounce: 300, compress: true })` with `update()`, `reset()`, `toURLSearchParams()`

### Debounce & Throttle
- **useDebounce**: Debounce callback execution. `useDebounce(callback, () => duration)` with `runScheduledNow()`, `cancel()`, `pending` property
- **useThrottle**: Throttle callback execution. `useThrottle(callback, () => duration)`

## Installation & Usage

Install via npm: `npm install runed`

Import utilities into `.svelte` or `.svelte.js|ts` files and use reactively with `$state` and `$effect`:

```svelte
<script lang="ts">
	import { activeElement } from "runed";
	let inputElement = $state<HTMLInputElement | undefined>();
</script>

<input bind:this={inputElement} />
{#if activeElement.current === inputElement}
	The input element is active!
{/if}
```

Or in modules:
```ts
import { activeElement } from "runed";

$effect(() => {
	console.log("Active element is ", activeElement.current);
});
```