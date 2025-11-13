

## Pages

### withelementref_type_helper
Type helper to add a ref prop to custom components following Bits UI's pattern.

Type helper that adds a `ref` prop to custom components. Intersect your props type with `WithElementRef<YourProps, HTMLElementType>` and bind the ref to your element with `bind:this={ref}`.

### withoutchild_type_helper
Type helper to exclude the child snippet prop from a component when building custom wrappers.

`WithoutChild` excludes the `child` snippet prop from a component type. Use when building wrappers that populate `children` without exposing custom `child` snippets.

```svelte
let { children, ...restProps }: WithoutChild<Accordion.ItemProps> = $props();
```

### withoutchildren_type_helper
Type helper that excludes the children snippet prop from a component's type definition for custom wrappers.

`WithoutChildren<T>` removes the `children` snippet prop from a component's type. Use it when wrapping components that manage their own children:

```svelte
let { ...restProps }: WithoutChildren<Accordion.RootProps> = $props();
```

### withoutchildrenorchild_type_helper
Type helper that removes child and children props from component types for custom wrappers.

`WithoutChildrenOrChild` type helper excludes `child` and `children` props from a component, useful for custom wrappers that manage children internally.

```svelte
type WithoutChildrenOrChild<Accordion.TriggerProps & { title: string }>
```

