## $effect

Runs side effects when state updates. Automatically tracks reactive values and re-runs when they change. Only runs in browser, not SSR.

```svelte
$effect(() => {
  context.fillStyle = color;
  context.fillRect(0, 0, size, size);
});
```

Can return teardown function. Tracks only synchronously-read values. Use `$effect.pre` to run before DOM updates. Avoid for state synchronization—use `$derived` instead.

**Variants:** `$effect.pre`, `$effect.tracking()`, `$effect.root()`