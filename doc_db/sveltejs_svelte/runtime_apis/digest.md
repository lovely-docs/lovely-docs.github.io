## Stores

Reactive state management via `svelte/store`. Access values with `$` prefix for automatic subscription.

**writable(initialValue, onSubscribe?)** - Creates mutable store with `.set()` and `.update()` methods.
```js
const count = writable(0);
count.set(1);
count.update(n => n + 1);
```

**readable(initialValue, onSubscribe)** - Read-only store with callback receiving `set` function.
```js
const time = readable(new Date(), (set) => {
	const interval = setInterval(() => set(new Date()), 1000);
	return () => clearInterval(interval);
});
```

**derived(store(s), callback, initialValue?)** - Derives from one or more stores.
```js
const doubled = derived(a, ($a) => $a * 2);
const summed = derived([a, b], ([$a, $b]) => $a + $b);
```

**readonly(store)** - Wraps store as read-only. **get(store)** - Retrieves value synchronously.

Custom stores require `.subscribe(subscription)` method returning unsubscribe function, and optional `.set(value)`.

## Context

Parent-to-child value passing without prop-drilling via `setContext`/`getContext`.

```svelte
<script>
	import { setContext, getContext } from 'svelte';
	setContext('my-context', 'value');
	const value = getContext('my-context');
</script>
```

Store reactive state in context by mutating objects rather than reassigning. Use `createContext` for type-safe context:
```ts
export const [getUserContext, setUserContext] = createContext<User>();
```

Available: `setContext`, `getContext`, `hasContext`, `getAllContexts`.

## Lifecycle Hooks

**onMount** - Runs after component mounts to DOM. Can return cleanup function.
```js
onMount(() => {
	const interval = setInterval(() => {}, 1000);
	return () => clearInterval(interval);
});
```

**onDestroy** - Runs before unmount. Only hook that runs in SSR.

**tick** - Returns promise resolving after pending state changes apply to DOM.
```js
await tick();
```

Replace deprecated `beforeUpdate`/`afterUpdate` with `$effect.pre` and `$effect`.

## Imperative Component API

**mount(Component, { target, props })** - Instantiate and mount component to DOM element.

**unmount(component, { outro })** - Remove mounted component. Returns promise if `outro: true`.

**render(Component, { props })** - Server-only SSR function returning `{ body, head }`.

**hydrate(Component, { target, props })** - Mount component reusing SSR HTML output.