## Context API

Context allows components to access values from parent components without prop-drilling through intermediate layers.

**Setting context in parent:**
```svelte
<script>
	import { setContext } from 'svelte';
	setContext('my-context', 'hello from Parent.svelte');
</script>
```

**Retrieving context in child:**
```svelte
<script>
	import { getContext } from 'svelte';
	const message = getContext('my-context');
</script>
<h1>{message}</h1>
```

The key and value can be any JavaScript value.

**Available functions:** `setContext`, `getContext`, `hasContext`, `getAllContexts`

**Storing reactive state in context:**
```svelte
<script>
	import { setContext } from 'svelte';
	let counter = $state({ count: 0 });
	setContext('counter', counter);
</script>
<button onclick={() => counter.count += 1}>increment</button>
```

When updating context state, mutate the object rather than reassigning it, or the reactivity link breaks.

**Type-safe context pattern:**
```js
const key = {};
export function setUserContext(user) {
	setContext(key, user);
}
export function getUserContext() {
	return getContext(key);
}
```

**Context vs global state:** Context is isolated per request (safe for SSR), while global module state is shared across requests and can leak data between users during server-side rendering.