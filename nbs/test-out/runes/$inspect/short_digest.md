## $inspect

Development-only rune that logs values when they change, tracking deep reactivity.

```svelte
$inspect(count, message); // logs on change
$inspect(count).with((type, value) => { /* custom handler */ });
$inspect.trace(); // traces which state caused effect to re-run
```