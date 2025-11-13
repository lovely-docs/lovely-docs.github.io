## $props()

Receive component inputs with destructuring:

```svelte
let { adjective = 'happy' } = $props();
```

Rename props: `let { super: trouper } = $props();`

Rest props: `let { a, b, ...others } = $props();`

Don't mutate props unless bindable. Use callbacks or `$bindable` to communicate changes.

Add type safety:

```svelte
let { adjective }: { adjective: string } = $props();
```

## $props.id()

Generate unique per-instance ID (consistent during hydration):

```svelte
const uid = $props.id();
<label for="{uid}-name">Name:</label>
<input id="{uid}-name" />
```