## $bindable Rune

Mark a prop as bindable to allow bidirectional data flow between parent and child:

```svelte
// Child
let { value = $bindable(), ...props } = $props();

// Parent
<Child bind:value={message} />
```

Parents can optionally use `bind:` or pass a normal prop. Supports fallback values: `$bindable('fallback')`