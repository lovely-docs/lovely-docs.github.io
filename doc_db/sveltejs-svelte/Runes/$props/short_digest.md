## $props rune

Receive component props with destructuring:
```svelte
let { adjective = 'happy' } = $props();
```

Rename props: `let { super: trouper } = $props();`

Rest props: `let { a, b, ...others } = $props();`

Props update reactively but shouldn't be mutated unless bindable. Add type safety with TypeScript or JSDoc.

Generate unique instance IDs with `$props.id()` for linking elements.