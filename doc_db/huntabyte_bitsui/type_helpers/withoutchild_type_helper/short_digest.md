`WithoutChild` excludes the `child` snippet prop from a component type. Use when building wrappers that populate `children` without exposing custom `child` snippets.

```svelte
let { children, ...restProps }: WithoutChild<Accordion.ItemProps> = $props();
```