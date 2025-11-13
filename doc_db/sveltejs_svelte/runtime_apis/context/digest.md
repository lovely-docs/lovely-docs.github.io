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

**Type-safe context with createContext:**
```ts
import { createContext } from 'svelte';
export const [getUserContext, setUserContext] = createContext<User>();
```

**Replacing global state:** Context is preferable to module-level state for shared state because it's not shared between server-side rendering requests, preventing data leakage between users.

Available functions: `setContext`, `getContext`, `hasContext`, `getAllContexts`.