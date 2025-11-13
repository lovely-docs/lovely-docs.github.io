## Lifecycle Hooks

**`onMount`** - Runs when component mounts to DOM. Can return cleanup function (must be synchronous).

**`onDestroy`** - Runs before component unmounts. Only lifecycle hook that runs on server.

**`tick`** - Returns promise that resolves after DOM updates. Use instead of `afterUpdate`.

**Deprecated** - `beforeUpdate`/`afterUpdate` replaced by `$effect.pre`/`$effect` for granular reactivity.

Example: Auto-scroll chat on new messages using `$effect.pre`:
```svelte
$effect.pre(() => {
  messages; // trigger only on message changes
  tick().then(() => viewport.scrollTo(0, viewport.scrollHeight));
});
```