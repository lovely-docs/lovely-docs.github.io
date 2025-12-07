## Lifecycle Hooks

**`onMount`** - Runs after component mounts to DOM. Can return cleanup function for unmount. Doesn't run on server.

```svelte
import { onMount } from 'svelte';
onMount(() => {
  console.log('mounted');
  return () => console.log('cleanup');
});
```

**`onDestroy`** - Runs before unmount. Only hook that runs on server.

```svelte
import { onDestroy } from 'svelte';
onDestroy(() => console.log('destroying'));
```

**`tick`** - Promise that resolves after DOM updates from pending state changes.

```svelte
import { tick } from 'svelte';
$effect.pre(() => {
  tick().then(() => console.log('DOM updated'));
});
```

**Deprecated: `beforeUpdate` / `afterUpdate`** - Svelte 4 hooks, shimmed in Svelte 5 but fire on every update. Replace with `$effect.pre` and `$effect` which only react to explicitly referenced state changes, providing granular control.