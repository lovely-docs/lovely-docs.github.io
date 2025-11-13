## Type Helpers for Custom Components

### WithElementRef
Adds a `ref` prop to custom components following Bits UI's pattern. Enables access to underlying HTML elements.

```ts
type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & {
  ref?: U | null;
};

type Props = WithElementRef<{ yourPropA: string }, HTMLButtonElement>;
let { yourPropA, ref = $bindable(null) }: Props = $props();
```

### WithoutChild
Excludes the `child` snippet prop from a component type. Use when building wrappers that populate children internally.

```ts
let { children, ...restProps }: WithoutChild<Accordion.ItemProps> = $props();
```

### WithoutChildren
Excludes the `children` snippet prop from a component type. Use when building wrappers that manage children internally.

```ts
let { value, onValueChange, ...restProps }: WithoutChildren<Accordion.RootProps> = $props();
```

### WithoutChildrenOrChild
Excludes both `child` and `children` snippet props from a component type. Use when building wrappers that fully manage the children interface.

```ts
let { title, ...restProps }: WithoutChildrenOrChild<Accordion.TriggerProps & { title: string }> = $props();
```