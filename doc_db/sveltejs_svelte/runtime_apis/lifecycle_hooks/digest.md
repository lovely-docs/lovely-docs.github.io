## Component Lifecycle

Svelte 5 has a simplified lifecycle with only two phases: creation and destruction. State updates don't trigger component-level hooks; instead, individual render effects react to changes.

## `onMount`

Schedules a callback when the component mounts to the DOM. Must be called during component initialization. Does not run on the server.

```svelte
import { onMount } from 'svelte';

onMount(() => {
  console.log('mounted');
  
  const interval = setInterval(() => console.log('beep'), 1000);
  return () => clearInterval(interval); // cleanup on unmount
});
```

Note: Only synchronous functions can return cleanup functions. Async functions always return a Promise.

## `onDestroy`

Schedules a callback immediately before component unmount. This is the only lifecycle hook that runs in server-side components.

```svelte
import { onDestroy } from 'svelte';

onDestroy(() => {
  console.log('component is being destroyed');
});
```

## `tick`

Returns a promise that resolves after pending state changes are applied to the DOM, or in the next microtask if there are none. Use this when you need to ensure the UI is updated before continuing.

```svelte
import { tick } from 'svelte';

$effect.pre(() => {
  console.log('about to update');
  tick().then(() => console.log('just updated'));
});
```

## Deprecated: `beforeUpdate` / `afterUpdate`

These Svelte 4 hooks are shimmed for backwards compatibility but not available in components using runes. Replace `beforeUpdate` with `$effect.pre` and `afterUpdate` with `$effect` for more granular control that only reacts to relevant state changes.

Example: Chat window autoscroll that only scrolls when messages change, not when theme changes:

```svelte
import { tick } from 'svelte';

let theme = $state('dark');
let messages = $state([]);
let viewport;

$effect.pre(() => {
  messages; // explicitly reference to trigger on message changes only
  const autoscroll = viewport && viewport.offsetHeight + viewport.scrollTop > viewport.scrollHeight - 50;
  
  if (autoscroll) {
    tick().then(() => {
      viewport.scrollTo(0, viewport.scrollHeight);
    });
  }
});

function handleKeydown(event) {
  if (event.key === 'Enter') {
    messages = [...messages, event.target.value];
    event.target.value = '';
  }
}
```