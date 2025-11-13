## $bindable Rune

Use `$bindable()` to enable two-way data binding on component props:

```svelte
let { value = $bindable(), ...props } = $props();
```

Parent components use `bind:` directive to establish two-way binding:

```svelte
<FancyInput bind:value={message} />
```

Supports fallback values: `$bindable('fallback')`