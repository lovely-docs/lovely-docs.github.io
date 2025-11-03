## $bindable Rune

Enables two-way data binding between parent and child components. Mark props with `$bindable()` to allow children to mutate and communicate changes back to parents.

```svelte
// Child
let { value = $bindable(), ...props } = $props();

// Parent
<Child bind:value={message} />
```

Use sparingly; parents can still pass normal props without binding.