## Ref Prop Binding

The `ref` prop provides direct access to underlying HTML elements in Bits UI components for DOM manipulation like focusing inputs or measuring dimensions.

### Basic Usage

Bind the `ref` prop to access the rendered element:

```svelte
<script lang="ts">
  import { Accordion } from "bits-ui";
  let triggerRef = $state<HTMLButtonElement | null>(null);
  function focusTrigger() {
    triggerRef?.focus();
  }
</script>
<button onclick={focusTrigger}>Focus trigger</button>
<Accordion.Trigger bind:ref={triggerRef}>Trigger content</Accordion.Trigger>
```

### With Child Snippets

Bits UI uses element IDs to track references. Pass custom IDs to the parent component first:

```svelte
<script lang="ts">
  import CustomButton from "./CustomButton.svelte";
  import { Accordion } from "bits-ui";
  let triggerRef = $state<HTMLButtonElement | null>(null);
  const myCustomId = "my-custom-id";
</script>
<Accordion.Trigger bind:ref={triggerRef} id={myCustomId}>
  {#snippet child({ props })}
    <CustomButton {...props} />
  {/snippet}
</Accordion.Trigger>
```

**Pitfall**: Don't set `id` directly on the child element—pass it to the parent component instead.

### Null Handling

The `ref` value may be `null` until the component mounts in the DOM.

### Creating Custom Ref Props

Use the `WithElementRef` type helper to implement the same pattern in custom components:

```svelte
<script lang="ts">
  import { WithElementRef } from "bits-ui";
  import type { HTMLButtonAttributes } from "svelte/elements";
  
  let {
    ref = $bindable(null),
    children,
    ...rest
  }: WithElementRef<
    HTMLButtonAttributes & {
      yourPropA: string;
      yourPropB: number;
    },
    HTMLButtonElement
  > = $props();
</script>
<button bind:this={ref} {...rest}>
  {@render children?.()}
</button>
```