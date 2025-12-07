## Stores

Reactive state containers via `svelte/store` module. A store is an object with a `.subscribe(fn)` method that immediately calls the subscription function with the current value and whenever it changes, returning an unsubscribe function.

**writable**: Creates a store with `.set(value)` and `.update(callback)` methods. Optional second argument is a start function called when subscriber count goes 0→1, receiving `set`/`update` and returning a stop function:
```js
import { writable } from 'svelte/store';
const count = writable(0, () => {
  console.log('got a subscriber');
  return () => console.log('no more subscribers');
});
count.subscribe(v => console.log(v)); // logs 'got a subscriber', then '0'
count.set(1); // logs '1'
count.update(n => n + 1); // logs '2'
```

**readable**: Store whose value cannot be set externally. First argument is initial value; second argument works like writable's start function:
```js
const time = readable(new Date(), (set) => {
  const interval = setInterval(() => set(new Date()), 1000);
  return () => clearInterval(interval);
});
```

**derived**: Derives a store from one or more other stores. Callback runs when first subscriber subscribes and whenever dependencies change. Can set values asynchronously via `set` and `update` arguments:
```js
const doubled = derived(a, ($a) => $a * 2);
const delayed = derived(a, ($a, set) => {
  setTimeout(() => set($a), 1000);
}, 2000); // initial value
const summed = derived([a, b], ([$a, $b]) => $a + $b);
```

**readonly**: Wraps a store to prevent external `.set()` calls while maintaining subscriptions.

**get**: Retrieves a store's value without subscribing (creates temporary subscription).

In components, use `$` prefix for auto-subscription: `$count` accesses value, `$count = 2` calls `.set()` on writable stores. Store must be declared at component top level. Svelte 5 runes largely supersede stores for basic state but stores remain useful for complex async streams and manual control.

## Context API

Pass values down component tree without prop-drilling. `setContext(key, value)` in parent, `getContext(key)` in child. Key and value can be any JavaScript value. Also available: `hasContext(key)`, `getAllContexts()`.

Store reactive state objects in context and mutate directly; reassigning breaks the link:
```svelte
<script>
  import { setContext } from 'svelte';
  let counter = $state({ count: 0 });
  setContext('counter', counter);
</script>
<button onclick={() => counter.count += 1}>increment</button>
```

Type-safe variant via `createContext<T>()` returns `[getContext, setContext]` tuple with proper typing.

Context is preferable to module-level `$state` for SSR since context is request-isolated while module state persists across users.

## Lifecycle Hooks

**onMount**: Runs after component mounts to DOM. Must be called during initialization. Does not run in server-rendered components. If it returns a function, that function runs on unmount (cleanup):
```js
import { onMount } from 'svelte';
onMount(() => {
  const interval = setInterval(() => console.log('beep'), 1000);
  return () => clearInterval(interval);
});
```

**onDestroy**: Runs immediately before unmount. Only lifecycle hook that runs in server-side components.

**tick**: Returns a promise that resolves after pending state changes apply to the DOM, or in the next microtask if none pending. Use for "after update" behavior.

**Deprecated**: `beforeUpdate`/`afterUpdate` (Svelte 4) fire before/after every component update. Replace with `$effect.pre` (before) and `$effect` (after) which only react to explicitly referenced state changes, avoiding unnecessary runs.

## Imperative Component API

**mount**: Instantiates and mounts a component to a DOM element:
```js
import { mount } from 'svelte';
const app = mount(App, {
  target: document.querySelector('#app'),
  props: { some: 'property' }
});
```
Effects and `onMount` do not run during mount — use `flushSync()` to force them.

**unmount**: Removes a component created with `mount` or `hydrate`. Returns a Promise that resolves after transitions complete (if `options.outro` is true) or immediately otherwise.

**render**: Server-only function that renders a component to HTML strings:
```js
import { render } from 'svelte/server';
const result = render(App, { props: { some: 'property' } });
result.body; // HTML for <body>
result.head; // HTML for <head>
```

**hydrate**: Like `mount`, but reuses HTML from server-side rendering and makes it interactive. Effects do not run during hydrate — use `flushSync()` afterwards if needed.