The `WithoutChildrenOrChild` type helper excludes the `child` and `children` props from a component. This is useful when building custom component wrappers that populate the `children` prop internally and don't expose it to users.

**Example:**
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

The `CustomAccordionTrigger` component exposes all root component props except `children` and `child`, which are managed internally.