Type helper that removes the `child` snippet prop from component types. Used when wrapping components that manage their own children.

```svelte
let { children, ...restProps }: WithoutChild<Accordion.ItemProps> = $props();
```