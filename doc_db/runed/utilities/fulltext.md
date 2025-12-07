

## Pages

### active-element
Reactive wrapper for document.activeElement with Shadow DOM support and optional custom document scoping.

## activeElement

Provides reactive access to the currently focused DOM element, similar to `document.activeElement` but with reactive updates.

**Features:**
- Updates synchronously with DOM focus changes
- Returns `null` when no element is focused
- Safe to use with SSR
- Lightweight alternative to manual focus tracking
- Searches through Shadow DOM boundaries for the true active element

**Basic usage:**
```svelte
<script lang="ts">
	import { activeElement } from "runed";
</script>

<p>
	Currently active element:
	{activeElement.current?.localName ?? "No active element found"}
</p>
```

**Custom document/shadow root:**
```svelte
<script lang="ts">
	import { ActiveElement } from "runed";

	const activeElement = new ActiveElement({
		document: shadowRoot
	});
</script>
```

**Type:**
```ts
interface ActiveElement {
	readonly current: Element | null;
}
```

### animation-frames
requestAnimationFrame wrapper with FPS limiting, frame metrics (fps, delta), and automatic cleanup

## AnimationFrames

A declarative wrapper around the browser's `requestAnimationFrame` API that adds FPS limiting and frame metrics while handling cleanup automatically.

### Core Features
- Wraps `requestAnimationFrame` with a declarative API
- FPS limiting capabilities via `fpsLimit` option
- Frame metrics including `fps` property and `delta` (time since last frame in ms)
- Automatic cleanup

### Usage

```svelte
<script lang="ts">
	import { AnimationFrames } from "runed";

	let frames = $state(0);
	let fpsLimit = $state(10);
	let delta = $state(0);
	
	const animation = new AnimationFrames(
		(args) => {
			frames++;
			delta = args.delta;
		},
		{ fpsLimit: () => fpsLimit }
	);
</script>

<button onclick={() => animation.running ? animation.stop() : animation.start()}>
	{animation.running ? "Stop" : "Start"}
</button>
<p>FPS: {animation.fps.toFixed(0)}, Delta: {delta.toFixed(0)}ms</p>
```

### API
- Constructor takes a callback function and options object
- Callback receives `args` object with `delta` property (milliseconds since last frame)
- Options: `fpsLimit` can be a number or function returning a number (0 = unlimited)
- Properties: `fps` (current frames per second), `running` (boolean state)
- Methods: implied `start()` and `stop()` for controlling animation

### boolattr
boolAttr(value): "" | undefined — converts truthy/falsy values to empty string or undefined for proper HTML boolean attribute behavior

## Purpose
Transforms any value into `""` (empty string) or `undefined` for HTML boolean attributes, where presence indicates truth rather than value.

## Problem
Boolean values render as strings in HTML attributes, making both true and false cases present:
```svelte
<div data-active={true}>Content</div>  <!-- renders: data-active="true" -->
<div data-active={false}>Content</div> <!-- renders: data-active="false" -->
```

## Solution
```ts
import { boolAttr } from "runed";

let isActive = $state(true);
let isLoading = $state(false);

<div data-active={boolAttr(isActive)}>Active</div>    <!-- renders: data-active="" -->
<div data-loading={boolAttr(isLoading)}>Loading</div> <!-- renders: (no attribute) -->
```

## API
```ts
function boolAttr(value: unknown): "" | undefined;
```
- Returns `""` when value is truthy
- Returns `undefined` when value is falsy

### context
Type-safe Context API wrapper: define with `new Context<T>(name)`, set with `.set(value)` in parent init, read with `.get()` or `.getOr(fallback)` in child init.

## Purpose
Type-safe wrapper around Svelte's Context API for sharing data between components without prop drilling.

## Creating Context
Define a context instance with a type:
```ts
import { Context } from "runed";
export const myTheme = new Context<"light" | "dark">("theme");
```
The constructor parameter is just an identifier for debugging. The context is empty until explicitly set.

## Setting Context
Set the value in a parent component during initialization:
```svelte
<script lang="ts">
	import { myTheme } from "./context";
	let { data, children } = $props();
	myTheme.set(data.theme);
</script>
{@render children?.()}
```
Must be called during component initialization, not in event handlers or callbacks.

## Reading Context
Child components retrieve the value:
```svelte
<script lang="ts">
	import { myTheme } from "./context";
	const theme = myTheme.get();
	const theme = myTheme.getOr("light"); // with fallback
</script>
```

## API
- `constructor(name: string)` - Creates context with identifier
- `key: symbol` - Internal key (avoid direct use)
- `exists(): boolean` - Check if context is set
- `get(): TContext` - Retrieve context, throws if not set
- `getOr<TFallback>(fallback: TFallback): TContext | TFallback` - Retrieve with fallback
- `set(context: TContext): TContext` - Set and return context value

All methods must be called during component initialization.

### debounced
Debounced state wrapper with cancel, immediate set, and immediate update methods; access value via .current property

A wrapper over `useDebounce` that returns a debounced state object.

**Usage:**
```ts
import { Debounced } from "runed";

let search = $state("");
const debounced = new Debounced(() => search, 500);
```

Access the debounced value via `debounced.current`.

**Methods:**
- `cancel()` - Cancel the pending debounced update
- `setImmediately(value)` - Set a new value immediately and cancel pending updates
- `updateImmediately()` - Run the pending update immediately

**Example:**
```ts
let count = $state(0);
const debounced = new Debounced(() => count, 500);

count = 1;
debounced.cancel();
console.log(debounced.current); // 0 (update was cancelled)

count = 2;
debounced.setImmediately(count);
console.log(debounced.current); // 2 (set immediately)

count = 3;
await debounced.updateImmediately();
console.log(debounced.current); // 3 (updated immediately)
```

### element-rect
ElementRect: reactive DOMRect tracking with individual dimension/position properties and complete rect object

## ElementRect

Provides reactive access to an element's dimensions and position information, automatically updating when the element's size or position changes.

### Usage

```svelte
<script lang="ts">
	import { ElementRect } from "runed";

	let el = $state<HTMLElement>();
	const rect = new ElementRect(() => el);
</script>

<textarea bind:this={el}></textarea>

<p>Width: {rect.width} Height: {rect.height}</p>
<pre>{JSON.stringify(rect.current, null, 2)}</pre>
```

### API

```ts
type Rect = Omit<DOMRect, "toJSON">;

interface ElementRectOptions {
	initialRect?: DOMRect;
}

class ElementRect {
	constructor(node: MaybeGetter<HTMLElement | undefined | null>, options?: ElementRectOptions);
	readonly current: Rect;
	readonly width: number;
	readonly height: number;
	readonly top: number;
	readonly left: number;
	readonly right: number;
	readonly bottom: number;
	readonly x: number;
	readonly y: number;
}
```

Pass an element getter to the constructor. Access dimensions via individual properties (`width`, `height`, `top`, `left`, `right`, `bottom`, `x`, `y`) or the complete `current` object.

### element-size
ElementSize: reactive width/height tracker for DOM elements, updates automatically on dimension changes

## ElementSize

Provides reactive access to an element's width and height, automatically updating when dimensions change. Similar to `ElementRect` but focused only on size measurements.

### Usage

```svelte
<script lang="ts">
	import { ElementSize } from "runed";

	let el = $state() as HTMLElement;
	const size = new ElementSize(() => el);
</script>

<textarea bind:this={el}></textarea>

<p>Width: {size.width} Height: {size.height}</p>
```

### Type Definition

```ts
interface ElementSize {
	readonly width: number;
	readonly height: number;
}
```

The utility accepts a function that returns an HTMLElement and exposes `width` and `height` properties that update reactively.

### extract
Utility that unwraps MaybeGetter<T> (function or static value) to T, with optional fallback for undefined.

## Purpose
The `extract` utility resolves either a getter function or a static value to a plain value, simplifying code that needs to handle both reactive and static inputs.

## Problem
APIs that accept `MaybeGetter<T>` (either a function returning T or a static value) require verbose conditional logic:
```ts
typeof wait === "function" ? (wait() ?? 250) : (wait ?? 250)
```

## Solution
```ts
import { extract } from "runed";

function throwConfetti(intervalProp?: MaybeGetter<number | undefined>) {
	const interval = $derived(extract(intervalProp, 100));
}

// Also works with Debounced:
const d1 = new Debounced(() => search, () => debounceTime);
const d2 = new Debounced(() => search, 500);
const d3 = new Debounced(() => search);
```

## Behavior
`extract(input, fallback)` resolves:
- Static value → returns the value
- `undefined` → returns fallback
- Function returning value → returns the result
- Function returning `undefined` → returns fallback

Fallback is optional; omitting it returns `T | undefined`.

## Types
```ts
function extract<T>(input: MaybeGetter<T | undefined>, fallback: T): T;
function extract<T>(input: MaybeGetter<T | undefined>): T | undefined;
```

### finite-state-machine
Strongly-typed finite state machine with state→event→state transitions, action functions, lifecycle hooks (_enter/_exit), wildcard handlers, and debounce scheduling.

## Finite State Machine

A strongly-typed FSM for tracking states and events. Define states and which events transition between them.

### Basic Usage

```ts
import { FiniteStateMachine } from "runed";
type MyStates = "on" | "off";
type MyEvents = "toggle";

const f = new FiniteStateMachine<MyStates, MyEvents>("off", {
	off: { toggle: "on" },
	on: { toggle: "off" }
});

f.send("toggle"); // transition to next state
```

First argument is initial state. Second argument maps each state to its valid events and target states.

### Actions

Instead of string targets, use functions that return a state. Can receive parameters and conditionally transition or prevent transitions by returning nothing:

```ts
const f = new FiniteStateMachine<MyStates, MyEvents>("off", {
	off: {
		toggle: () => isTuesday ? "on" : undefined
	},
	on: {
		toggle: (heldMillis: number) => heldMillis > 3000 ? "off" : undefined
	}
});

f.send("toggle", arg1, arg2); // pass args to action
```

### Lifecycle Methods

`_enter` and `_exit` handlers invoked on state transitions:

```ts
const f = new FiniteStateMachine<MyStates, MyEvents>("off", {
	off: {
		toggle: "on",
		_enter: (meta) => console.log("off"),
		_exit: (meta) => console.log("leaving off")
	},
	on: {
		toggle: "off",
		_enter: (meta) => console.log("on"),
		_exit: (meta) => console.log("leaving on")
	}
});
```

Metadata object contains: `from` (exited state), `to` (entered state), `event` (triggering event), `args` (optional additional params). For initial state, `from` and `event` are `null`.

### Wildcard Handlers

Use `"*"` state as fallback for unhandled events:

```ts
const f = new FiniteStateMachine<MyStates, MyEvents>("off", {
	off: { toggle: "on" },
	on: { toggle: "off" },
	"*": { emergency: "off" }
});

f.send("emergency"); // handled by wildcard, works from any state
```

### Debouncing

Schedule state transitions after a delay. Re-invoking with same event cancels and restarts the timer:

```ts
f.debounce(5000, "toggle"); // transition in 5 seconds
f.debounce(5000, "toggle"); // cancels previous, starts new timer

// Use in actions or lifecycle methods:
const f = new FiniteStateMachine<MyStates, MyEvents>("off", {
	off: {
		toggle: () => {
			f.debounce(5000, "toggle");
			return "on";
		}
	},
	on: { toggle: "off" }
});
```

### Notes

Minimalistic implementation. Based on kenkunz/svelte-fsm. For more features, see statelyai/xstate.

### is-document-visible
Reactive wrapper around Page Visibility API; tracks document.hidden state with automatic visibilitychange event listening.

Reactive boolean that tracks document visibility state using the Page Visibility API.

**Usage:**
```ts
import { IsDocumentVisible } from "runed";

const visible = new IsDocumentVisible();
console.log(visible.current); // true when document is visible, false when hidden
```

**Type Definition:**
```ts
type IsDocumentVisibleOptions = {
	window?: Window;
	document?: Document;
};

class IsDocumentVisible {
	constructor(options?: IsDocumentVisibleOptions);
	readonly current: boolean;
}
```

**Details:**
- Listens to the `visibilitychange` event and updates automatically
- Uses `document.hidden` and `visibilitychange` from the Page Visibility API
- In non-browser contexts, `current` defaults to `false`
- Accepts optional `window` and `document` parameters for custom contexts

### is-focus-within
IsFocusWithin utility class reactively tracks whether any descendant has focus in a container element; constructor takes getter returning HTMLElement, exposes readonly boolean current property.

## IsFocusWithin

A utility class that reactively tracks whether any descendant element has focus within a specified container element. Updates automatically when focus changes.

### Usage

```ts
import { IsFocusWithin } from "runed";

let formElement = $state<HTMLFormElement>();
const focusWithinForm = new IsFocusWithin(() => formElement);

// Access current focus state
console.log(focusWithinForm.current); // boolean
```

Use in template:
```svelte
<p>Focus within form: {focusWithinForm.current}</p>
<form bind:this={formElement}>
	<input type="text" />
	<button type="submit">Submit</button>
</form>
```

### Type Definition

```ts
class IsFocusWithin {
	constructor(node: MaybeGetter<HTMLElement | undefined | null>);
	readonly current: boolean;
}
```

Constructor accepts a getter function that returns the container element to track. The `current` property is a readonly boolean indicating whether focus is currently within the container.

### is-idle
User idle detection utility tracking activity via events (mousemove, keydown, touch, etc.) with configurable timeout; exposes current idle state and lastActive timestamp.

Tracks user activity and determines idle state based on configurable timeout. Monitors mouse movement, keyboard input, and touch events.

**Usage:**
```ts
import { IsIdle } from "runed";
const idle = new IsIdle({ timeout: 1000 });
// idle.current - boolean idle state
// idle.lastActive - timestamp of last activity
```

**Options:**
- `events` - array of window events to monitor (default: mousemove, mousedown, resize, keydown, touchstart, wheel)
- `timeout` - milliseconds before idle state triggers (default: 60000)
- `detectVisibilityChanges` - detect document visibility changes (default: false)
- `initialState` - initial idle state (default: false)

**API:**
- `current` - readonly boolean indicating if user is idle
- `lastActive` - readonly number timestamp of last user activity

### is-in-viewport
Class utility that tracks viewport visibility of DOM elements via Intersection Observer; constructor takes element/getter and optional config, exposes `current` boolean property.

## IsInViewport

Tracks whether an element is visible within the current viewport using the Intersection Observer API.

### Purpose
Provides a class-based utility to monitor if a DOM element is currently in view, useful for lazy loading, analytics, or triggering animations when elements become visible.

### How it works
- Built on top of `useIntersectionObserver` utility
- Accepts an element or a getter function that returns an element
- Supports optional configuration options that align with `useIntersectionObserver` options

### Usage

```ts
import { IsInViewport } from "runed";

let targetNode = $state<HTMLElement>()!;
const inViewport = new IsInViewport(() => targetNode);
```

```svelte
<p bind:this={targetNode}>Target node</p>
<p>Target node in viewport: {inViewport.current}</p>
```

### API

**Constructor:**
- `new IsInViewport(node: MaybeGetter<HTMLElement | null | undefined>, options?: IsInViewportOptions)`

**Properties:**
- `current: boolean` - getter that returns whether the element is currently in the viewport

**Options:**
- Accepts `IsInViewportOptions` which extends `UseIntersectionObserverOptions`

### is-mounted
IsMounted class provides a mounted state object with a `current` property; shorthand for onMount/effect-based mount tracking.

## IsMounted

A utility class that tracks whether a component has mounted.

### Usage

```svelte
<script lang="ts">
	import { IsMounted } from "runed";
	const isMounted = new IsMounted();
</script>
```

The `isMounted` object has a `current` property that is `false` initially and becomes `true` after the component mounts.

### Equivalent implementations

Using `onMount`:
```svelte
import { onMount } from "svelte";
const isMounted = $state({ current: false });
onMount(() => {
	isMounted.current = true;
});
```

Using `$effect` with `untrack`:
```svelte
import { untrack } from "svelte";
const isMounted = $state({ current: false });
$effect(() => {
	untrack(() => (isMounted.current = true));
});
```

### on-cleanup
onCleanup(cb): registers cleanup function for effect context disposal; replaces onDestroy; works in components and $effect.root

Register a cleanup function that executes when the current effect context is disposed (component destruction or root effect disposal).

Shorthand for returning a cleanup function from `$effect()`:

```ts
$effect(() => {
	return () => {
		// cleanup
	};
});
```

**Usage:**

```svelte
<script lang="ts">
	import { onCleanup } from "runed";

	// Replace onDestroy
	onCleanup(() => {
		console.log("Component is being cleaned up!");
	});

	// Within root effect
	$effect.root(() => {
		onCleanup(() => {
			console.log("Root effect is being cleaned up!");
		});
	});
</script>
```

**Type:**
```ts
function onCleanup(cb: () => void): void;
```

### on-click-outside
Utility that triggers callback on clicks outside a specified element; supports programmatic control via start/stop methods and immediate/detectIframe options.

## onClickOutside

Detects clicks outside a specified element and executes a callback. Useful for dismissible dropdowns, modals, and interactive components.

### Basic Usage
```svelte
import { onClickOutside } from "runed";

let container = $state<HTMLElement>()!;

onClickOutside(
	() => container,
	() => console.log("clicked outside")
);
```

### Controlled Listener
Returns control methods `start()` and `stop()` plus a reactive `enabled` property to manage the listener programmatically.

```svelte
const clickOutside = onClickOutside(
	() => dialog,
	() => {
		dialog.close();
		clickOutside.stop();
	},
	{ immediate: false }
);

function openDialog() {
	dialog.showModal();
	clickOutside.start();
}

function closeDialog() {
	dialog.close();
	clickOutside.stop();
}
```

### Options
- `immediate` (boolean, default: true) - Whether handler is enabled by default
- `detectIframe` (boolean, default: false) - Detect focus events from iframes
- `document` (Document, default: global document) - Document object to use
- `window` (Window, default: global window) - Window object to use

### Type Definition
```ts
export declare function onClickOutside<T extends Element = HTMLElement>(
	container: MaybeElementGetter<T>,
	callback: (event: PointerEvent | FocusEvent) => void,
	opts?: OnClickOutsideOptions
): {
	stop: () => boolean;
	start: () => boolean;
	readonly enabled: boolean;
};
```

### persisted-state
Reactive state container with automatic localStorage/sessionStorage persistence, cross-tab sync, connection control, and custom serialization support; plain objects/arrays deeply reactive, class instances require full replacement.

## PersistedState

A reactive state manager that persists data to browser storage (localStorage or sessionStorage) and optionally synchronizes changes across browser tabs in real-time.

### Basic Usage

```ts
import { PersistedState } from "runed";

const count = new PersistedState("count", 0);
count.current++; // Persists automatically
```

### Complex Objects

Only plain structures (arrays, plain objects, primitives) are deeply reactive and persist on mutation:

```ts
const arr = new PersistedState("foo", ["a", "b"]);
arr.current.push("c"); // Persists

const obj = new PersistedState("bar", { name: "Bob" });
obj.current.name = "JG"; // Persists

class Person { name: string; }
const complex = new PersistedState("baz", new Person("Bob"));
complex.current.name = "JG"; // Does NOT persist
complex.current = new Person("JG"); // Persists
```

### Configuration Options

```ts
const state = new PersistedState("key", initialValue, {
  storage: "session", // 'local' (default) or 'session'
  syncTabs: false,    // Cross-tab sync (default: true)
  connected: false,   // Start disconnected (default: true)
  serializer: {
    serialize: superjson.stringify,
    deserialize: superjson.parse
  }
});
```

### Connection Control

```ts
const state = new PersistedState("temp", value, { connected: false });
state.current = "new"; // In-memory only
state.connect();       // Persists to storage
state.disconnect();    // Removes from storage, keeps in memory
console.log(state.connected); // Check status
```

When disconnected: state changes stay in memory, storage changes don't affect state, cross-tab sync is disabled. `disconnect()` removes from storage but preserves value in memory. `connect()` immediately persists current in-memory value.

### Custom Serialization

For complex types like Date objects:

```ts
import superjson from "superjson";

const lastAccessed = new PersistedState("last-accessed", new Date(), {
  serializer: {
    serialize: superjson.stringify,
    deserialize: superjson.parse
  }
});
```

### pressed-keys
Keyboard key press tracker with has(), all property, and onKeys() callback registration for key combinations.

## PressedKeys

A sensor utility that tracks which keyboard keys are currently pressed.

### Creating an instance
```ts
const keys = new PressedKeys();
```

### Checking if keys are pressed
Use the `has` method to check if a specific key or key combination is currently pressed:
```ts
const isArrowDownPressed = $derived(keys.has("ArrowDown"));
const isCtrlAPressed = $derived(keys.has("Control", "a"));
```

### Getting all pressed keys
Access the `all` property to get a collection of all currently pressed keys:
```ts
console.log(keys.all);
```

### Registering key combination callbacks
Use `onKeys` to execute a callback when a specific key combination is pressed:
```ts
keys.onKeys(["meta", "k"], () => {
	console.log("open command palette");
});
```

### previous
Previous: reactive wrapper maintaining prior getter value via `.current` property for state change tracking.

## Previous

A reactive utility that maintains and provides access to the previous value of a getter function.

### Purpose
Useful for comparing state changes or implementing transition effects by tracking the prior value of reactive state.

### Usage

```ts
import { Previous } from "runed";

let count = $state(0);
const previous = new Previous(() => count);

// Access previous value
console.log(previous.current); // undefined initially, then previous count value
```

In a component:
```svelte
<button onclick={() => count++}>Count: {count}</button>
<pre>Previous: {previous.current}</pre>
```

### API

```ts
class Previous<T> {
	constructor(getter: () => T);
	readonly current: T | undefined; // Previous value, undefined until getter is called once
}
```

The `current` property reactively tracks the previous value of the getter function. On first access, it's undefined since there is no prior value yet.

### resource
Reactive async data fetching utility with automatic request cancellation, loading/error states, debounce/throttle, cleanup hooks, multiple dependencies, and pre-render support.

## Purpose
Reactive async data fetching utility that combines state management with automatic request handling. Built on `watch`, runs after rendering by default with optional pre-render support via `resource.pre()`.

## Basic Usage
```svelte
import { resource } from "runed";

let id = $state(1);

const searchResource = resource(
  () => id,
  async (id, prevId, { data, refetching, onCleanup, signal }) => {
    const response = await fetch(`api/posts?id=${id}`, { signal });
    return response.json();
  },
  { debounce: 300 }
);

// Access: searchResource.current, searchResource.loading, searchResource.error
// Methods: searchResource.mutate(), searchResource.refetch()
```

## Features
- **Automatic Request Cancellation**: In-flight requests canceled when dependencies change
- **Loading & Error States**: Built-in `loading` and `error` properties
- **Debouncing & Throttling**: Optional rate limiting (debounce takes precedence if both specified)
- **Type Safety**: Full TypeScript support with inferred types
- **Multiple Dependencies**: Track multiple reactive dependencies as array
- **Custom Cleanup**: `onCleanup()` callback runs before refetching
- **Pre-render Support**: `resource.pre()` for pre-render execution

## Advanced Examples

**Multiple Dependencies:**
```svelte
const results = resource(
  [() => query, () => page],
  async ([query, page]) => {
    const res = await fetch(`/api/search?q=${query}&page=${page}`);
    return res.json();
  }
);
```

**Custom Cleanup:**
```svelte
const stream = resource(
  () => streamId,
  async (id, _, { signal, onCleanup }) => {
    const eventSource = new EventSource(`/api/stream/${id}`);
    onCleanup(() => eventSource.close());
    const res = await fetch(`/api/stream/${id}/init`, { signal });
    return res.json();
  }
);
```

**Pre-render:**
```svelte
const data = resource.pre(
  () => query,
  async (query) => {
    const res = await fetch(`/api/search?q=${query}`);
    return res.json();
  }
);
```

## Configuration Options
- `lazy`: Skip initial fetch, only fetch on dependency changes or `refetch()`
- `once`: Fetch only once, ignore subsequent dependency changes
- `initialValue`: Provide initial value before first fetch completes
- `debounce`: Milliseconds to debounce rapid changes (cancels pending requests)
- `throttle`: Milliseconds to throttle rapid changes (spaces requests by delay)

## API
- `current`: Current resource value
- `loading`: Boolean loading state
- `error`: Error object if fetch failed
- `mutate(value)`: Update resource value directly (optimistic updates)
- `refetch(info?)`: Re-run fetcher with current watching values

## Fetcher Parameters
- `value`: Current source value(s)
- `previousValue`: Previous source value(s)
- `data`: Previous fetcher return value
- `refetching`: Boolean or value passed to `refetch()`
- `onCleanup`: Register cleanup function
- `signal`: AbortSignal for canceling fetch requests

### scroll-state
Reactive scroll position/direction/edge tracking with programmatic scrolling, RTL support, and debounced stop callbacks.

## ScrollState

Reactive utility for tracking scroll position, direction, and edge states with programmatic scrolling support.

### Core Features

- Track scroll positions (`x`, `y`) — reactive, get/set
- Detect scroll direction (`left`, `right`, `top`, `bottom`)
- Determine edge arrival state (`arrived`) — whether scrolled to each edge
- Programmatic scrolling: `scrollTo(x, y)`, `scrollToTop()`, `scrollToBottom()`
- Listen to scroll and scroll-end events
- Respects flex, RTL, and reverse layout modes

### Usage

```svelte
<script lang="ts">
	import { ScrollState } from "runed";

	let el = $state<HTMLElement>();

	const scroll = new ScrollState({
		element: () => el
	});
</script>

<div bind:this={el} style="overflow: auto; height: 200px;">
	<!-- scrollable content here -->
</div>
```

Access properties:
- `scroll.x`, `scroll.y` — current scroll positions
- `scroll.directions` — active scroll directions
- `scroll.arrived` — edge arrival state
- `scroll.progress` — scroll percentage on x/y axis

### Options

| Option | Type | Description |
|--------|------|-------------|
| `element` | `MaybeGetter<HTMLElement \| Window \| Document \| null>` | Scroll container (required) |
| `idle` | `MaybeGetter<number \| undefined>` | Debounce time after scroll ends (default: 200ms) |
| `offset` | `{ top?, bottom?, left?, right? }` | Pixel thresholds for "arrived" detection (default: 0) |
| `onScroll` | `(e: Event) => void` | Scroll event callback |
| `onStop` | `(e: Event) => void` | Callback after scrolling stops |
| `eventListenerOptions` | `AddEventListenerOptions` | Listener options (default: `{ passive: true, capture: false }`) |
| `behavior` | `ScrollBehavior` | Scroll behavior: "auto", "smooth", etc. (default: "auto") |
| `onError` | `(error: unknown) => void` | Error handler (default: console.error) |

### Notes

- Both position and edge arrival state are reactive
- Programmatically setting `scroll.x` and `scroll.y` triggers element scroll
- Layout direction and reverse flex settings are respected
- `onStop` is debounced and invoked after idle period

### state-history
StateHistory utility for tracking state changes with undo/redo; constructor takes getter/setter, provides undo/redo/clear methods and canUndo/canRedo/log properties.

## StateHistory

Tracks state changes with undo/redo capabilities. Takes a getter and setter, logs each state change with timestamp.

### Basic Usage

```ts
import { StateHistory } from "runed";

let count = $state(0);
const history = new StateHistory(() => count, (c) => (count = c));
history.log[0]; // { snapshot: 0, timestamp: ... }
```

### Methods

**`undo()`** - Reverts state to previous value in history log, moves current state to redo stack.
```ts
let count = $state(0);
const history = new StateHistory(() => count, (c) => (count = c));
count = 1;
count = 2;
history.undo(); // count is now 1
history.undo(); // count is now 0
```

**`redo()`** - Restores previously undone state from redo stack.
```ts
history.undo(); // count is now 1
history.redo();  // count is now 2
```

**`clear()`** - Clears history log and redo stack.
```ts
history.clear();
console.log(history.log); // []
console.log(history.canUndo); // false
console.log(history.canRedo); // false
```

### Properties

- **`log`** - Array of `LogEvent<T>` objects with `snapshot` and `timestamp`
- **`canUndo`** - Derived boolean, true when log has more than one item
- **`canRedo`** - Derived boolean, true when redo stack is not empty

### UI Example

```svelte
<script lang="ts">
	import { StateHistory } from "runed";
	let count = $state(0);
	const history = new StateHistory(() => count, (c) => (count = c));
</script>

<p>{count}</p>
<button onclick={() => count++}>Increment</button>
<button onclick={() => count--}>Decrement</button>
<button disabled={!history.canUndo} onclick={history.undo}>Undo</button>
<button disabled={!history.canRedo} onclick={history.redo}>Redo</button>
<button onclick={history.clear}>Clear History</button>
```

### textarea-autosize
Textarea utility that auto-adjusts height to content via off-screen clone measurement; supports grow-only mode via minHeight and max height limits.

## TextareaAutosize

Utility that automatically adjusts textarea height based on content without layout shifts.

### How it works
- Creates an invisible off-screen textarea clone
- Copies computed styles from the actual textarea
- Measures scroll height of the clone to determine needed height
- Applies the height (or minHeight) to the real textarea
- Recalculates on content changes, element resizes, and width changes

### Basic usage
```svelte
<script lang="ts">
	import { TextareaAutosize } from "runed";

	let el = $state<HTMLTextAreaElement>(null!);
	let value = $state("");

	new TextareaAutosize({
		element: () => el,
		input: () => value
	});
</script>

<textarea bind:this={el} bind:value></textarea>
```

### Options
- `element` (required): `Getter<HTMLElement | undefined>` - The target textarea
- `input` (required): `Getter<string>` - Reactive input value
- `onResize`: `() => void` - Called whenever height is updated
- `styleProp`: `"height" | "minHeight"` - CSS property to control size. "height" resizes both ways, "minHeight" grows only. Default: "height"
- `maxHeight`: `number` - Maximum height in pixels before scroll appears. Default: unlimited

### Grow-only behavior
```ts
new TextareaAutosize({
	element: () => el,
	input: () => value,
	styleProp: "minHeight"
});
```
Textarea expands as needed but won't shrink smaller than current size.

### throttled
Throttled state wrapper with configurable delay; provides cancel() and setImmediately() methods.

## Throttled

A wrapper over `useThrottle` that returns a throttled state. Delays state updates by a specified interval.

### Basic Usage

```ts
import { Throttled } from "runed";

let search = $state("");
const throttled = new Throttled(() => search, 500);
```

The throttled object's `current` property reflects the throttled value. In the example above, `throttled.current` updates at most every 500ms as `search` changes.

### Canceling and Immediate Updates

```ts
let count = $state(0);
const throttled = new Throttled(() => count, 500);

count = 1;
throttled.cancel(); // Cancels pending update
console.log(throttled.current); // Still 0

count = 2;
console.log(throttled.current); // Still 0
throttled.setImmediately(count); // Sets value immediately, cancels pending updates
console.log(throttled.current); // 2
```

Methods:
- `cancel()` - Cancels any pending throttled update
- `setImmediately(value)` - Sets the throttled value immediately and cancels pending updates

### usedebounce
useDebounce: delays callback execution until after inactivity period; accepts callback and duration getter; provides runScheduledNow(), cancel(), and pending property

## useDebounce

A utility function that creates a debounced version of a callback function. Debouncing delays function execution until after a specified duration of inactivity, preventing excessive calls.

### Usage

```svelte
import { useDebounce } from "runed";

let count = $state(0);
let logged = $state("");
let debounceDuration = $state(1000);

const logCount = useDebounce(
	() => {
		logged = `You pressed the button ${count} times!`;
		count = 0;
	},
	() => debounceDuration
);

function ding() {
	count++;
	logCount();
}
```

The debounced function accepts:
- A callback function to debounce
- A function that returns the debounce duration in milliseconds

The returned debounced function has methods:
- `runScheduledNow()` - Execute the pending debounced call immediately
- `cancel()` - Cancel the pending debounced call
- `pending` - Boolean property indicating if a call is scheduled

### use-event-listener
useEventListener: attach auto-disposed event listeners to elements via function-based target, with automatic cleanup on component destroy or element change

## useEventListener

Attaches an automatically disposed event listener to DOM elements, useful for listening to events on elements you don't directly control (document, window, or elements from parent components).

**Key Features:**
- Automatic cleanup when component is destroyed or element reference changes
- Lazy initialization via function-based target element definition
- Ideal for global listeners where direct DOM attachment is impractical

**Example:**

```ts
import { useEventListener } from "runed";

export class ClickLogger {
	#clicks = $state(0);

	constructor() {
		useEventListener(
			() => document.body,
			"click",
			() => this.#clicks++
		);
	}

	get clicks() {
		return this.#clicks;
	}
}
```

Usage in Svelte component:
```svelte
<script lang="ts">
	import { ClickLogger } from "./ClickLogger.ts";
	const logger = new ClickLogger();
</script>

<p>You've clicked the document {logger.clicks} {logger.clicks === 1 ? "time" : "times"}</p>
```

The listener is automatically removed when the component is destroyed or the element reference changes.

### use-geolocation
Reactive Geolocation API wrapper with position tracking, pause/resume control, and error handling.

Reactive wrapper around the browser's Geolocation API for accessing device location.

**Usage:**
```svelte
import { useGeolocation } from "runed";
const location = useGeolocation();
```

Access location data via `location.position.coords` and `location.position.timestamp`. Check `location.error` for errors and `location.isSupported` for API support. Control tracking with `location.pause()` and `location.resume()`, checking `location.isPaused` for state.

**Options:**
- `immediate` (boolean, default: true): Start tracking immediately or wait for `resume()` call
- Accepts standard PositionOptions (timeout, enableHighAccuracy, maximumAge)

**Return type includes:**
- `isSupported`: boolean indicating Geolocation API availability
- `position`: GeolocationPosition with coords and timestamp
- `error`: GeolocationPositionError or null
- `isPaused`: boolean tracking state
- `pause()` and `resume()`: control methods

### use-intersection-observer
useIntersectionObserver hook: observe element intersection with callback, control via pause/resume/stop, check isActive getter

## useIntersectionObserver

Watch for intersection changes of a target element using the Intersection Observer API.

### Basic Usage

```svelte
<script lang="ts">
	import { useIntersectionObserver } from "runed";

	let target = $state<HTMLElement | null>(null);
	let root = $state<HTMLElement | null>(null);
	let isIntersecting = $state(false);

	useIntersectionObserver(
		() => target,
		(entries) => {
			const entry = entries[0];
			if (!entry) return;
			isIntersecting = entry.isIntersecting;
		},
		{ root: () => root }
	);
</script>

<div bind:this={root}>
	<div bind:this={target}>
		{#if isIntersecting}
			<div>Target is intersecting</div>
		{:else}
			<div>Target is not intersecting</div>
		{/if}
	</div>
</div>
```

The utility accepts a getter function for the target element, a callback that receives intersection entries, and optional configuration including a root element.

### Control Methods

```ts
const observer = useIntersectionObserver(/* ... */);

observer.pause();    // Pause observation
observer.resume();   // Resume observation
observer.stop();     // Stop observation completely
```

### isActive Property

Check if the observer is currently active. This is a getter and cannot be destructured:

```ts
const observer = useIntersectionObserver(/* ... */);

if (observer.isActive) {
	// do something
}
```

### use-interval
useInterval: reactive setInterval wrapper with pause/resume, tick counter, optional callback, reactive delay support via function, options for immediate start/callback execution.

## useInterval

A reactive wrapper around `setInterval` with pause/resume controls and automatic tick counting.

### Basic Usage

```svelte
import { useInterval } from "runed";

let delay = $state(1000);
const interval = useInterval(() => delay, {
  callback: (count) => console.log(`Tick ${count}`)
});

<p>Counter: {interval.counter}</p>
<p>Status: {interval.isActive ? "Running" : "Paused"}</p>
<input type="number" bind:value={delay} />
<button onclick={interval.pause} disabled={!interval.isActive}>Pause</button>
<button onclick={interval.resume} disabled={interval.isActive}>Resume</button>
<button onclick={interval.reset}>Reset Counter</button>
```

### Counter

Built-in `counter` property tracks ticks. Call `interval.reset()` to reset it.

### Callback

Optional callback receives current counter value on each tick:
```svelte
const interval = useInterval(1000, {
  callback: (count) => console.log(`Tick number ${count}`)
});
```

### Options

- `immediate` (default: `true`) - Start interval immediately
- `immediateCallback` (default: `false`) - Execute callback immediately when resuming
- `callback` - Optional callback function receiving counter value

```svelte
const interval = useInterval(1000, {
  immediate: false,
  immediateCallback: true,
  callback: (count) => console.log(count)
});
```

### Reactive Interval

Pass a function returning the delay to make it reactive. Timer automatically restarts when delay changes:
```svelte
let delay = $state(1000);
const interval = useInterval(() => delay);
<input type="range" bind:value={delay} min="100" max="2000" />
```

### API

- `counter` - Current tick count
- `isActive` - Whether interval is running
- `pause()` - Pause the interval
- `resume()` - Resume the interval
- `reset()` - Reset counter to 0

### use-mutation-observer
useMutationObserver hook observes DOM element changes via MutationObserver API; accepts element getter, callback receiving mutations array, and config options; returns stop() method.

## useMutationObserver

Hook to observe changes in a DOM element using the MutationObserver API.

### Basic Usage

Pass an element reference, a callback function to handle mutations, and options object:

```ts
import { useMutationObserver } from "runed";

let el = $state<HTMLElement | null>(null);
const messages = $state<string[]>([]);
let className = $state("");

useMutationObserver(
	() => el,
	(mutations) => {
		const mutation = mutations[0];
		if (!mutation) return;
		messages.push(mutation.attributeName!);
	},
	{ attributes: true }
);

setTimeout(() => {
	className = "text-brand";
}, 1000);
```

The callback receives an array of mutations. In this example, attribute changes are tracked by pushing the `attributeName` to a messages array.

### Stopping the Observer

Call the `stop` method to halt observation:

```ts
const { stop } = useMutationObserver(/* ... */);
stop();
```

### use-resize-observer
useResizeObserver hook: observe element dimensions via callback with ResizeObserverEntry array, stop() to unobserve

## useResizeObserver

Detects changes in the size of an element using the Resize Observer API.

### Usage

Pass a function that returns an element reference and a callback that receives resize entries:

```ts
import { useResizeObserver } from "runed";

let el = $state<HTMLElement | null>(null);
let text = $state("");

useResizeObserver(
	() => el,
	(entries) => {
		const entry = entries[0];
		if (!entry) return;
		const { width, height } = entry.contentRect;
		text = `width: ${width};\nheight: ${height};`;
	}
);
```

The callback receives an array of `ResizeObserverEntry` objects. Access the new dimensions via `entry.contentRect.width` and `entry.contentRect.height`.

### Stopping the Observer

Call the `stop()` method returned from `useResizeObserver()` to stop observing:

```ts
const { stop } = useResizeObserver(/* ... */);
stop();
```

### usesearchparams
Reactive, type-safe URL search params with schema validation (Zod/Valibot/Arktype/built-in), defaults, compression, debouncing, history control, date formatting, and Zod codec support; top-level reactivity only.

## useSearchParams

Reactive, type-safe, schema-driven management of URL search parameters in Svelte/SvelteKit. Supports validation, defaults, compression, debouncing, and history control.

### Requirements
- `@sveltejs/kit` installed
- Standard Schema compatible validator (Zod, Valibot, Arktype, or built-in `createSearchParamsSchema`)

### Basic Usage

Define schema with Zod:
```ts
import { z } from "zod";
export const productSearchSchema = z.object({
	page: z.coerce.number().default(1),
	filter: z.string().default(""),
	sort: z.enum(["newest", "oldest", "price"]).default("newest")
});
```

Use in component:
```svelte
<script lang="ts">
import { useSearchParams } from "runed/kit";
import { productSearchSchema } from './schemas';

const params = useSearchParams(productSearchSchema);
const page = $derived(params.page); // number (defaults to 1)
const sort = $derived(params.sort); // 'newest' | 'oldest' | 'price'

// Update parameters
params.page = 2; // Updates URL to ?page=2
params.update({ page: 3, sort: 'oldest' }); // Multiple updates
params.reset(); // Reset to defaults
params.toURLSearchParams(); // Get URLSearchParams object
</script>

<input type="text" bind:value={params.filter} />
```

Use in load function:
```ts
import { validateSearchParams } from "runed/kit";
import { productSearchSchema } from "./schemas";

export const load = ({ url, fetch }) => {
	const { searchParams } = validateSearchParams(url, productSearchSchema);
	const response = await fetch(`/api/products?${searchParams.toString()}`);
	return { products: await response.json() };
};
```

### Options

- `showDefaults` (boolean): Show parameters with default values in URL (default: false)
- `debounce` (number): Delay URL updates in milliseconds (default: 0)
- `pushHistory` (boolean): Create new history entries on update (default: true)
- `compress` (boolean): Compress all params into single `_data` parameter using lz-string (default: false)
- `compressedParamName` (string): Custom name for compressed parameter (default: '_data')
- `updateURL` (boolean): Update URL when parameters change (default: true)
- `noScroll` (boolean): Preserve scroll position on URL update (default: false)
- `dateFormats` (object): Map field names to 'date' (YYYY-MM-DD) or 'datetime' (ISO8601) format

Example with options:
```ts
const params = useSearchParams(schema, {
  showDefaults: true,
  debounce: 300,
  pushHistory: false,
  compress: true,
  compressedParamName: '_compressed'
});
```

### Alternative Schema Validators

Valibot:
```ts
import * as v from "valibot";
const schema = v.object({
	page: v.optional(v.fallback(v.number(), 1), 1),
	filter: v.optional(v.fallback(v.string(), ""), ""),
	sort: v.optional(v.fallback(v.picklist(["newest", "oldest", "price"]), "newest"), "newest")
});
const params = useSearchParams(schema);
```

Arktype:
```ts
import { type } from "arktype";
const schema = type({
	page: "number = 1",
	filter: 'string = ""',
	sort: '"newest" | "oldest" | "price" = "newest"'
});
const params = useSearchParams(schema);
```

### createSearchParamsSchema

Lightweight built-in schema creator without external dependencies:
```ts
const schema = createSearchParamsSchema({
	page: { type: "number", default: 1 },
	filter: { type: "string", default: "" },
	sort: { type: "string", default: "newest" },
	tags: { type: "array", default: ["new"], arrayType: "" },
	config: { type: "object", default: { theme: "light" }, objectType: { theme: "" } }
});
```

URL storage format:
- Arrays: JSON strings `?tags=["sale","featured"]`
- Objects: JSON strings `?config={"theme":"dark"}`
- Dates: ISO8601 `?createdAt=2023-12-01T10:30:00.000Z` or date-only `?birthDate=2023-12-01`
- Primitives: Direct `?page=2&filter=red`

Limitations:
- Basic array/object validation only (no nested validation)
- No custom validation rules
- No granular reactivity for nested properties (must reassign entire value: `params.config = {...params.config, theme: 'dark'}`)

### Date Format Support

Option 1: Using `dateFormat` in schema:
```ts
const schema = createSearchParamsSchema({
	birthDate: { type: "date", default: new Date("1990-01-15"), dateFormat: "date" },
	createdAt: { type: "date", default: new Date(), dateFormat: "datetime" }
});
const params = useSearchParams(schema);
// URL: ?birthDate=1990-01-15&createdAt=2023-01-01T10:30:00.000Z
```

Option 2: Using `dateFormats` option (works with any validator):
```ts
const params = useSearchParams(zodSchema, {
	dateFormats: {
		birthDate: "date",
		createdAt: "datetime"
	}
});
```

Date format details:
- `'date'`: YYYY-MM-DD format (e.g., 2025-10-21), parsed as midnight UTC
- `'datetime'`: Full ISO8601 (e.g., 2025-10-21T18:18:14.196Z), preserves exact time

Practical example:
```svelte
<script lang="ts">
	import { useSearchParams, createSearchParamsSchema } from "runed/kit";

	const schema = createSearchParamsSchema({
		eventDate: { type: "date", default: new Date("2025-01-01"), dateFormat: "date" },
		createdAt: { type: "date", default: new Date(), dateFormat: "datetime" }
	});

	const params = useSearchParams(schema);
</script>

<label>
	Event Date:
	<input
		type="date"
		value={params.eventDate.toISOString().split("T")[0]}
		oninput={(e) => (params.eventDate = new Date(e.target.value))} />
</label>

<label>
	Created At:
	<input
		type="datetime-local"
		value={params.createdAt.toISOString().slice(0, 16)}
		oninput={(e) => (params.createdAt = new Date(e.target.value))} />
</label>
```

### validateSearchParams

Server-side utility to extract, validate, and convert URL search parameters to URLSearchParams. Handles both standard and compressed parameters.

```ts
import { validateSearchParams } from "runed/kit";
import { productSchema } from "./schemas";

export const load = ({ url, fetch }) => {
	const { searchParams, data } = validateSearchParams(url, productSchema, {
		compressedParamName: "_compressed",
		dateFormats: {
			birthDate: "date",
			createdAt: "datetime"
		}
	});

	const response = await fetch(`/api/products?${searchParams.toString()}`);
	return { products: await response.json() };
};
```

### Advanced: Zod Codecs (Zod v4.1.0+)

Custom bidirectional transformations for URL serialization. Use when you need custom date formats, complex type conversions, or compact representations.

Define reusable codecs:
```ts
import { z } from "zod";

// Unix timestamp codec (stores Date as number)
const unixTimestampCodec = z.codec(
	z.coerce.number(),
	z.date(),
	{
		decode: (timestamp) => new Date(timestamp * 1000),
		encode: (date) => Math.floor(date.getTime() / 1000)
	}
);

// Date-only codec (stores Date as YYYY-MM-DD)
const dateOnlyCodec = z.codec(
	z.string(),
	z.date(),
	{
		decode: (str) => new Date(str + "T00:00:00.000Z"),
		encode: (date) => date.toISOString().split("T")[0]
	}
);

// Compact ID codec (stores number as base36 string)
const compactIdCodec = z.codec(
	z.string(),
	z.number(),
	{
		decode: (str) => parseInt(str, 36),
		encode: (num) => num.toString(36)
	}
);
```

Use in schema:
```ts
const searchSchema = z.object({
	query: z.string().default(""),
	page: z.coerce.number().default(1),
	createdAfter: unixTimestampCodec.optional(),
	birthDate: dateOnlyCodec.default(new Date("1990-01-15")),
	productId: compactIdCodec.optional()
});

const params = useSearchParams(searchSchema);
```

Real-world event search example:
```svelte
<script lang="ts">
	import { z } from "zod";
	import { useSearchParams } from "runed/kit";

	const unixTimestamp = z.codec(z.coerce.number(), z.date(), {
		decode: (ts) => new Date(ts * 1000),
		encode: (date) => Math.floor(date.getTime() / 1000)
	});

	const dateOnly = z.codec(z.string(), z.date(), {
		decode: (str) => new Date(str + "T00:00:00.000Z"),
		encode: (date) => date.toISOString().split("T")[0]
	});

	const eventSearchSchema = z.object({
		query: z.string().default(""),
		eventDate: dateOnly.default(new Date()),
		createdAfter: unixTimestamp.optional(),
		updatedSince: unixTimestamp.optional()
	});

	const params = useSearchParams(eventSearchSchema);
</script>

<label>
	Event Date:
	<input
		type="date"
		value={params.eventDate.toISOString().split("T")[0]}
		oninput={(e) => (params.eventDate = new Date(e.target.value))} />
</label>

<label>
	Created After:
	<input
		type="date"
		value={params.createdAfter?.toISOString().split("T")[0] ?? ""}
		oninput={(e) =>
			(params.createdAfter = e.target.value ? new Date(e.target.value) : undefined)} />
</label>

<!-- Clean URLs:
     Without codecs: ?eventDate=2025-01-15T00:00:00.000Z&createdAfter=2024-01-01T00:00:00.000Z
     With codecs:    ?eventDate=2025-01-15&createdAfter=1704067200
-->
```

Codec benefits:
- Custom date formats (Unix timestamps, relative dates, custom strings)
- Any type conversions (numbers, objects, arrays)
- Optimized URL size
- Full Zod validation + transformation
- Reusable codec definitions
- Automatic with `validateSearchParams` on server

Codecs work automatically with `validateSearchParams`:
```ts
export const load = ({ url }) => {
	const { searchParams, data } = validateSearchParams(url, eventSearchSchema);
	// data.eventDate is a Date object (decoded from URL string)
	return { events: await fetchEvents(searchParams) };
};
```

### Reactivity Limitations

Top-level reactivity only:

✅ Works (direct property assignment):
```svelte
<script>
	const params = useSearchParams(schema);
	params.page = 2;
	params.filter = "active";
	params.config = { theme: "dark", size: "large" };
	params.items = [...params.items, newItem];
</script>
```

❌ Doesn't work (nested property mutations):
```svelte
<script>
	const params = useSearchParams(schema);
	params.config.theme = "dark"; // Nested object property
	params.items.push(newItem); // Array method
	params.items[0].name = "updated"; // Array item property
	delete params.config.oldProp; // Property deletion
</script>
```

Design rationale: Prioritizes simplicity, type safety, and ease of use. Benefits include simple predictable API, full TypeScript support, clean URLs, performance, and reliability.

### Type Definitions

```ts
interface SearchParamsOptions {
	showDefaults?: boolean; // default: false
	debounce?: number; // default: 0
	pushHistory?: boolean; // default: true
	compress?: boolean; // default: false
	compressedParamName?: string; // default: '_data'
	updateURL?: boolean; // default: true
	noScroll?: boolean; // default: false
	dateFormats?: Record<string, "date" | "datetime">;
}

type ReturnUseSearchParams<Schema extends StandardSchemaV1> = {
	[key: string]: any; // Typed, reactive params
	update(values: Partial<StandardSchemaV1.InferOutput<Schema>>): void;
	reset(showDefaults?: boolean): void;
	toURLSearchParams(): URLSearchParams;
};

type SchemaTypeConfig<ArrayType = unknown, ObjectType = unknown> =
	| { type: "string"; default?: string }
	| { type: "number"; default?: number }
	| { type: "boolean"; default?: boolean }
	| { type: "array"; default?: ArrayType[]; arrayType?: ArrayType }
	| { type: "object"; default?: ObjectType; objectType?: ObjectType }
	| { type: "date"; default?: Date; dateFormat?: "date" | "datetime" };
```

### use-throttle
useThrottle(callback, durationFn) - throttles callback execution to max once per duration returned by durationFn

## useThrottle

A higher-order function that throttles function execution, limiting how frequently a function can be called.

### Usage

```svelte
import { useThrottle } from "runed";

let search = $state("");
let throttledSearch = $state("");
let durationMs = $state(1000);

const throttledUpdate = useThrottle(
	() => {
		throttledSearch = search;
	},
	() => durationMs
);

// Call throttledUpdate() - it will execute at most once per durationMs
```

The function takes two arguments:
1. A callback function to throttle
2. A function that returns the throttle duration in milliseconds

The returned throttled function can be called repeatedly, but the callback will only execute at most once per specified duration interval.

### watch
watch(getter, callback, options?) - manually track specific reactive dependencies; supports single/array sources, deep watching, lazy execution, and one-time variants

## watch

Manually specify which reactive values should trigger a callback, unlike `$effect` which automatically tracks all dependencies.

**watch(source, callback, options?)**

Runs callback when source changes. Source is a getter function returning the dependency value(s).

```ts
import { watch } from "runed";

let count = $state(0);
watch(() => count, (curr, prev) => {
	console.log(`count is ${curr}, was ${prev}`);
});
```

Watch entire objects with `$state.snapshot()`:
```ts
let user = $state({ name: 'bob', age: 20 });
watch(() => $state.snapshot(user), () => {
	console.log(`${user.name} is ${user.age} years old`);
});
```

Watch specific nested values:
```ts
watch(() => user.age, () => {
	console.log(`User is now ${user.age} years old`);
});
```

Watch multiple sources as array:
```ts
let age = $state(20);
let name = $state("bob");
watch([() => age, () => name], ([age, name], [prevAge, prevName]) => {
	// callback receives current and previous values as arrays
});
```

**Options:**
- `lazy: true` - First run only happens after sources change (default: false)

**watch.pre** - Uses `$effect.pre` instead of `$effect` under the hood.

**watchOnce / watchOnce.pre** - Runs callback only once, then stops. Same behavior as `watch`/`watch.pre` but no options parameter.

