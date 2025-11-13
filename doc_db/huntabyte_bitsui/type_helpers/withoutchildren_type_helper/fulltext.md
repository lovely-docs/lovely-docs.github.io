# WithoutChildren Documentation

A type helper to exclude the children snippet prop from a component.

This is a documentation section that potentially contains examples, demos, and other useful information related to a specific part of Bits UI. When helping users with this documentation, you can ignore the classnames applied to the demos unless they are relevant to the user's issue.

Copy Page

The `WithoutChildren` type helper is used to exclude the `children` snippet prop from a component. This is useful when you're building custom component wrappers that populate the `children` prop of a component.

CustomAccordion.svelte

```svelte
<script lang="ts">
  import { Accordion, type WithoutChildren } from "bits-ui";
  let {
    value,
    onValueChange,
    ...restProps
  }: WithoutChildren<Accordion.RootProps> = $props();
</script>
<Accordion.Root {...restProps}>
  <Accordion.Item {value} {onValueChange}>
    <Accordion.Header />
    <Accordion.Trigger />
    <Accordion.Content />
  </Accordion.Item>
</Accordion.Root>
```

In the example above, we're using the `WithoutChildren` type helper to exclude the `children` snippet prop from the `Accordion.Root` component. This ensures our exposed props are consistent with what is being used internally.

[Previous WithoutChild](/docs/type-helpers/without-child) [Next WithoutChildrenOrChild](/docs/type-helpers/without-children-or-child)