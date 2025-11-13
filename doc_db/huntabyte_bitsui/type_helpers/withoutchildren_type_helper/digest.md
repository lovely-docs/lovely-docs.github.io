The `WithoutChildren` type helper excludes the `children` snippet prop from a component's type definition. This is useful when building custom component wrappers that internally manage the `children` prop.

**Usage:**
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

Apply `WithoutChildren<ComponentProps>` to the component's props type to remove the `children` snippet prop from the exposed interface, ensuring consistency between exposed and internally-used props.