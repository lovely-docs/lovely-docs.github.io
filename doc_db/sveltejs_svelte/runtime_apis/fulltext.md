

## Pages

### stores
Reactive state containers with `.subscribe()` contract; `svelte/store` provides writable/readable/derived/readonly/get utilities; use `$` prefix in components for auto-subscription; largely superseded by Svelte 5 runes for basic state but still useful for async streams.

## Stores

A store is an object providing reactive access to a value via a simple contract. The `svelte/store` module provides minimal implementations.

### Accessing stores in components

Use the `$` prefix to access store values reactively. Svelte automatically subscribes at initialization and unsubscribes when appropriate. The store must be declared at component top level (not in conditionals or functions).

```svelte
<script>
	import { writable } from 'svelte/store';
	const count = writable(0);
	console.log($count); // 0
	count.set(1);
	console.log($count); // 1
	$count = 2; // requires writable store
	console.log($count); // 2
</script>
```

Assignments to `$`-prefixed variables call the store's `.set` method and require a writable store.

### When to use stores

Prior to Svelte 5, stores were the primary solution for cross-component state and logic extraction. With runes, these use cases have diminished:

- **Logic extraction**: Use runes' universal reactivity instead. Runes work outside component top level and in `.svelte.js`/`.svelte.ts` files.
- **Shared state**: Create a `$state` object in a `.svelte.js` file:

```ts
// state.svelte.js
export const userState = $state({ name: 'name' });
```

```svelte
// App.svelte
<script>
	import { userState } from './state.svelte.js';
</script>
<p>User name: {userState.name}</p>
<button onclick={() => { userState.name = 'new name'; }}>change name</button>
```

Stores remain useful for complex asynchronous data streams, manual control over updates/listeners, or RxJS knowledge reuse.

### writable

Creates a store with externally settable values. Includes `set(value)` and `update(callback)` methods.

```js
import { writable } from 'svelte/store';
const count = writable(0);
count.subscribe((value) => console.log(value)); // logs 0
count.set(1); // logs 1
count.update((n) => n + 1); // logs 2
```

Optional second argument is a function called when subscriber count goes 0→1. It receives `set` and `update` functions and must return a `stop` function called when count goes 1→0:

```js
const count = writable(0, () => {
	console.log('got a subscriber');
	return () => console.log('no more subscribers');
});
count.set(1); // does nothing
const unsubscribe = count.subscribe((value) => console.log(value)); // logs 'got a subscriber', then '1'
unsubscribe(); // logs 'no more subscribers'
```

Store values are lost on page refresh; implement custom logic to sync to localStorage if needed.

### readable

Creates a store whose value cannot be set externally. First argument is initial value; second argument works like writable's second argument.

```ts
import { readable } from 'svelte/store';
const time = readable(new Date(), (set) => {
	set(new Date());
	const interval = setInterval(() => set(new Date()), 1000);
	return () => clearInterval(interval);
});

const ticktock = readable('tick', (set, update) => {
	const interval = setInterval(() => {
		update((sound) => (sound === 'tick' ? 'tock' : 'tick'));
	}, 1000);
	return () => clearInterval(interval);
});
```

### derived

Derives a store from one or more other stores. Callback runs when first subscriber subscribes and whenever dependencies change.

Simple version with single store:

```ts
import { derived } from 'svelte/store';
const doubled = derived(a, ($a) => $a * 2);
```

Callback can set values asynchronously via second argument `set` and optional third argument `update`. Pass initial value as third argument to `derived`:

```ts
const delayed = derived(
	a,
	($a, set) => {
		setTimeout(() => set($a), 1000);
	},
	2000 // initial value
);

const delayedIncrement = derived(a, ($a, set, update) => {
	set($a);
	setTimeout(() => update((x) => x + 1), 1000);
});
```

Return a function from callback to clean up when callback runs again or last subscriber unsubscribes:

```ts
const tick = derived(
	frequency,
	($frequency, set) => {
		const interval = setInterval(() => set(Date.now()), 1000 / $frequency);
		return () => clearInterval(interval);
	},
	2000
);
```

Pass array of stores as first argument to derive from multiple:

```ts
const summed = derived([a, b], ([$a, $b]) => $a + $b);
const delayed = derived([a, b], ([$a, $b], set) => {
	setTimeout(() => set($a + $b), 1000);
});
```

### readonly

Makes a store readonly. Subscriptions to the original still work through the readonly wrapper:

```js
import { readonly, writable } from 'svelte/store';
const writableStore = writable(1);
const readableStore = readonly(writableStore);
readableStore.subscribe(console.log);
writableStore.set(2); // console: 2
readableStore.set(2); // ERROR
```

### get

Retrieves a store's value without subscribing. Creates a subscription, reads the value, then unsubscribes. Not recommended in hot code paths.

```ts
import { get } from 'svelte/store';
const value = get(store);
```

## Store contract

Implement the store contract to create custom stores:

```ts
store = { subscribe: (subscription: (value: any) => void) => (() => void), set?: (value: any) => void }
```

1. Must have `.subscribe(subscriptionFn)` that immediately and synchronously calls the subscription function with current value, then calls it whenever value changes.
2. `.subscribe` must return an unsubscribe function that stops the subscription.
3. May optionally have `.set(value)` that synchronously calls all active subscription functions (writable store).

For RxJS Observable interoperability, `.subscribe` can return an object with `.unsubscribe` method instead of a function. Note: Svelte sees the value as `undefined` until `.subscribe` synchronously calls the subscription.

### context
Context API for passing values down component tree without props; supports reactive state, type-safe variant via createContext, and request isolation for SSR.

## Context API

Context allows components to access values from parent components without prop-drilling through intermediate layers.

**Basic usage:**
```svelte
// Parent.svelte
<script>
	import { setContext } from 'svelte';
	setContext('my-context', 'hello from Parent.svelte');
</script>

// Child.svelte
<script>
	import { getContext } from 'svelte';
	const message = getContext('my-context');
</script>
<h1>{message}, inside Child.svelte</h1>
```

The key and context value can be any JavaScript value. Available functions: `setContext`, `getContext`, `hasContext`, `getAllContexts`.

**Reactive state in context:**
Store reactive state objects in context. Mutate the object directly; reassigning breaks the link:
```svelte
<script>
	import { setContext } from 'svelte';
	let counter = $state({ count: 0 });
	setContext('counter', counter);
</script>

<button onclick={() => counter.count += 1}>increment</button>

// Child.svelte
const counter = getContext('counter');
```

**Type-safe context with `createContext`:**
```ts
// context.ts
import { createContext } from 'svelte';
export const [getUserContext, setUserContext] = createContext<User>();
```

**Global state alternative:**
Context is preferable to module-level `$state` for server-side rendering, as context is not shared between requests while module state persists across users.

### lifecycle-hooks
Svelte 5 lifecycle: onMount (after DOM mount, optional cleanup), onDestroy (before unmount, runs on server), tick (promise for DOM updates); deprecated beforeUpdate/afterUpdate replaced by $effect.pre/$effect for granular state-change reactions.

## Component Lifecycle in Svelte 5

Svelte 5 simplifies the component lifecycle to two phases: creation and destruction. State updates don't trigger component-level hooks; instead, individual render effects react to specific state changes.

### `onMount`

Schedules a callback to run after the component mounts to the DOM. Must be called during component initialization (can be in external modules). Does not run in server-rendered components.

```svelte
import { onMount } from 'svelte';

onMount(() => {
  console.log('mounted');
});
```

If `onMount` returns a function, it runs on unmount (cleanup). Only works with synchronous functions; async functions return a Promise.

```svelte
onMount(() => {
  const interval = setInterval(() => console.log('beep'), 1000);
  return () => clearInterval(interval);
});
```

### `onDestroy`

Schedules a callback immediately before unmount. The only lifecycle hook that runs in server-side components.

```svelte
import { onDestroy } from 'svelte';

onDestroy(() => {
  console.log('destroying');
});
```

### `tick`

Returns a promise that resolves after pending state changes apply to the DOM, or in the next microtask if none pending. Use when you need "after update" behavior.

```svelte
import { tick } from 'svelte';

$effect.pre(() => {
  console.log('about to update');
  tick().then(() => console.log('just updated'));
});
```

### Deprecated: `beforeUpdate` / `afterUpdate`

Svelte 4 hooks shimmed in Svelte 5 for backwards compatibility but unavailable in rune-based components. Fired before/after every component update regardless of relevance.

```svelte
import { beforeUpdate, afterUpdate } from 'svelte';

beforeUpdate(() => console.log('about to update'));
afterUpdate(() => console.log('just updated'));
```

**Replacement:** Use `$effect.pre` instead of `beforeUpdate` and `$effect` instead of `afterUpdate`. These offer granular control—they only react to explicitly referenced state changes.

### Example: Auto-scrolling Chat Window

Old approach with `beforeUpdate` fires on every update (theme toggle, message addition), requiring manual checks:

```svelte
let updatingMessages = false;
let theme = $state('dark');
let messages = $state([]);
let viewport;

beforeUpdate(() => {
  if (!updatingMessages) return;
  const autoscroll = viewport && viewport.offsetHeight + viewport.scrollTop > viewport.scrollHeight - 50;
  if (autoscroll) {
    tick().then(() => viewport.scrollTo(0, viewport.scrollHeight));
  }
  updatingMessages = false;
});

function handleKeydown(event) {
  if (event.key === 'Enter') {
    updatingMessages = true;
    messages = [...messages, event.target.value];
    event.target.value = '';
  }
}

function toggle() {
  theme = theme === 'dark' ? 'light' : 'dark';
}
```

New approach with `$effect.pre` only runs when `messages` changes, not on theme toggle:

```svelte
let theme = $state('dark');
let messages = $state([]);
let viewport;

$effect.pre(() => {
  messages; // explicit dependency
  const autoscroll = viewport && viewport.offsetHeight + viewport.scrollTop > viewport.scrollHeight - 50;
  if (autoscroll) {
    tick().then(() => viewport.scrollTo(0, viewport.scrollHeight));
  }
});

function handleKeydown(event) {
  if (event.key === 'Enter') {
    messages = [...messages, event.target.value];
    event.target.value = '';
  }
}

function toggle() {
  theme = theme === 'dark' ? 'light' : 'dark';
}
```

### imperative-component-api
mount/unmount/render/hydrate functions for component instantiation, DOM attachment, server rendering, and hydration; effects require flushSync() to run immediately.

## mount
Instantiates and mounts a component to a DOM element:
```js
import { mount } from 'svelte';
import App from './App.svelte';

const app = mount(App, {
	target: document.querySelector('#app'),
	props: { some: 'property' }
});
```
Multiple components can be mounted per page. Effects and `onMount` callbacks do not run during `mount` — use `flushSync()` to force them if needed.

## unmount
Removes a component created with `mount` or `hydrate`:
```js
import { unmount } from 'svelte';
unmount(app, { outro: true });
```
Returns a Promise that resolves after transitions complete (if `options.outro` is true) or immediately otherwise.

## render
Server-only function that renders a component to HTML strings:
```js
import { render } from 'svelte/server';
const result = render(App, { props: { some: 'property' } });
result.body; // HTML for <body>
result.head; // HTML for <head>
```

## hydrate
Like `mount`, but reuses HTML from server-side rendering and makes it interactive:
```js
import { hydrate } from 'svelte';
const app = hydrate(App, {
	target: document.querySelector('#app'),
	props: { some: 'property' }
});
```
Effects do not run during `hydrate` — use `flushSync()` afterwards if needed.

