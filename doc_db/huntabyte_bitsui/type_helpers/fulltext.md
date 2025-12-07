

## Pages

### with-element-ref
Type helper adding optional `ref` prop to components: `WithElementRef<PropsType, ElementType>` intersects props with `{ ref?: ElementType | null }`

## WithElementRef Type Helper

A convenience type that enables the `ref` prop on custom components, following the same pattern used by Bits UI components.

### Type Definition

```ts
type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & {
  ref?: U | null;
};
```

Generic parameters:
- `T`: Your component's props type
- `U`: The HTML element type (defaults to `HTMLElement`)

### Usage Example

```ts
import type { WithElementRef } from "bits-ui";

type Props = WithElementRef<
  {
    yourPropA: string;
    yourPropB: number;
  },
  HTMLButtonElement
>;

let { yourPropA, yourPropB, ref = $bindable(null) }: Props = $props();
```

Then bind the ref to your element:
```svelte
<button bind:this={ref}>
  <!-- content -->
</button>
```

This allows consumers of your component to access the underlying HTML element via the `ref` prop.

### withoutchild_type_helper
WithoutChild type helper excludes child snippet prop from component types for custom wrappers managing internal children.

## WithoutChild Type Helper

Excludes the `child` snippet prop from a component. Useful when building custom component wrappers that populate the `children` prop and don't expose a custom `child` snippet.

### Example

```svelte
<script lang="ts">
  import { Accordion, type WithoutChild } from "bits-ui";
  let { children, ...restProps }: WithoutChild<Accordion.ItemProps> = $props();
</script>
<Accordion.Header {...restProps}>
  <Accordion.Trigger>
    {@render children?.()}
  </Accordion.Trigger>
</Accordion.Header>
```

Use `WithoutChild<ComponentProps>` to type a component that wraps another component and manages its children internally, preventing consumers from passing a custom `child` snippet.

### withoutchildren_type_helper
Type helper to exclude `children` snippet prop from component props when building wrappers that manage children internally.

## WithoutChildren Type Helper

Excludes the `children` snippet prop from a component's type definition. Useful when building custom component wrappers that internally manage the `children` prop.

### Usage

```svelte
import { Accordion, type WithoutChildren } from "bits-ui";

let {
  value,
  onValueChange,
  ...restProps
}: WithoutChildren<Accordion.RootProps> = $props();
```

Apply `WithoutChildren<ComponentProps>` to a component's props type to remove the `children` snippet prop. This ensures exposed props match what's actually used internally, preventing consumers from passing a `children` prop that will be ignored or overridden by the wrapper's internal structure.

### withoutchildrenorchild_type_helper
Type helper excluding child/children props from component types; use when wrapping components that manage their own children.

## WithoutChildrenOrChild Type Helper

A type helper that excludes the `child` and `children` props from a component's type definition.

**Purpose**: Use when building custom component wrappers that internally populate the `children` prop and don't expose it to users.

**Example**:
```svelte
<script lang="ts">
  import { Accordion, type WithoutChildrenOrChild } from "bits-ui";
  let {
    title,
    ...restProps
  }: WithoutChildrenOrChild<
    Accordion.TriggerProps & {
      title: string;
    }
  > = $props();
</script>
<Accordion.Trigger>
  {title}
</Accordion.Trigger>
```

The `CustomAccordionTrigger` component exposes all root component props except `children` and `child`. This prevents users from passing conflicting children while still allowing other customization through inherited props.

Related: `child` snippet prop (see delegation documentation), `WithoutChildren` type helper

