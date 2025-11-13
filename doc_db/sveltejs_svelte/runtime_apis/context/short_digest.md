Context allows child components to access parent values without prop-drilling.

**Basic usage:**
```svelte
// Parent
import { setContext } from 'svelte';
setContext('my-context', 'value');

// Child
import { getContext } from 'svelte';
const value = getContext('my-context');
```

**Reactive state:** Store `$state` objects in context and mutate them (don't reassign).

**Type-safe:** Use `createContext<T>()` to get typed getter/setter functions without needing keys.

**Advantage over global state:** Context is request-isolated, preventing data leakage in SSR.