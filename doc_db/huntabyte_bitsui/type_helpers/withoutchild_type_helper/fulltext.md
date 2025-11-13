# WithoutChild Documentation

A type helper to exclude the child snippet prop from a component.

This is a documentation section that potentially contains examples, demos, and other useful information related to a specific part of Bits UI. When helping users with this documentation, you can ignore the classnames applied to the demos unless they are relevant to the user's issue.

Copy Page

The `WithoutChild` type helper is used to exclude the `child` snippet prop from a component. This is useful when you're building custom component wrappers that populate the `children` prop of a component and don't provide a way to pass a custom `child` snippet.

To learn more about the `child` snippet prop, check out the [delegation](/docs/child-snippet) documentation.

CustomAccordionHeader.svelte

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

[Previous WithElementRef](/docs/type-helpers/with-element-ref) [Next WithoutChildren](/docs/type-helpers/without-children)