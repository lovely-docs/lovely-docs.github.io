The `WithoutChild` type helper excludes the `child` snippet prop from a component. Use it when building custom component wrappers that populate the `children` prop and don't expose a custom `child` snippet.

Example: Creating a custom accordion header that wraps `Accordion.Header` and `Accordion.Trigger`:

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

This pattern allows you to create a simplified component interface by removing the `child` snippet prop while still accepting other props through `restProps`.