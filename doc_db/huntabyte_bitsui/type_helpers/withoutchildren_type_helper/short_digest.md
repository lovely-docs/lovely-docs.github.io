`WithoutChildren<T>` removes the `children` snippet prop from a component's type. Use it when wrapping components that manage their own children:

```svelte
let { ...restProps }: WithoutChildren<Accordion.RootProps> = $props();
```