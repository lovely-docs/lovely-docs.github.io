## Type Helpers for Component Props

Utility types for customizing component prop types when building wrappers and custom components.

### WithElementRef
Adds an optional `ref` prop to component types for accessing underlying HTML elements.

```ts
type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & {
  ref?: U | null;
};
```

Generic parameters: `T` (component props), `U` (HTML element type, defaults to `HTMLElement`).

Usage: Apply to your component's props type, then bind the ref to your element with `bind:this={ref}`.

### WithoutChild
Excludes the `child` snippet prop from component types. Use when building wrappers that populate children internally and don't expose a custom `child` snippet.

```ts
let { children, ...restProps }: WithoutChild<Accordion.ItemProps> = $props();
```

### WithoutChildren
Excludes the `children` snippet prop from component types. Use when building wrappers that manage the `children` prop internally.

```ts
let { value, onValueChange, ...restProps }: WithoutChildren<Accordion.RootProps> = $props();
```

### WithoutChildrenOrChild
Excludes both `child` and `children` props from component types. Use when building wrappers that internally populate children and don't expose either prop to users.

```ts
let { title, ...restProps }: WithoutChildrenOrChild<Accordion.TriggerProps & { title: string }> = $props();
```

All helpers prevent consumers from passing props that will be ignored or overridden by the wrapper's internal structure.