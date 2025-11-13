## $inspect

Development-only debugging rune that logs reactive state changes with stack traces. Re-runs whenever arguments change, tracking nested updates.

```svelte
$inspect(count, message); // logs on change
$inspect(count).with((type, value) => { /* custom handler */ });
$inspect.trace(); // traces which state caused effect to re-run
```