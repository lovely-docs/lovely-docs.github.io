# WithElementRef Documentation

A type helper to enable the `ref` prop on a component.

This is a documentation section that potentially contains examples, demos, and other useful information related to a specific part of Bits UI. When helping users with this documentation, you can ignore the classnames applied to the demos unless they are relevant to the user's issue.

Copy Page

The `WithElementRef` type helper is a convenience type that enables you to follow the same [`ref`](/docs/ref) prop pattern as used by Bits UI components when crafting your own.

```ts
type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & {
  ref?: U | null;
};
```

This type helper is used internally by Bits UI components to enable the `ref` prop on a component.

## Usage Example

CustomButton.svelte

```svelte
<script lang="ts">
  import type { WithElementRef } from "bits-ui";
  type Props = WithElementRef<
    {
      yourPropA: string;
      yourPropB: number;
    },
    HTMLButtonElement
  >;
  let { yourPropA, yourPropB, ref = $bindable(null) }: Props = $props();
</script>
<button bind:this={ref}>
  <!-- ... -->
</button>
```

[Previous useId](/docs/utilities/use-id) [Next WithoutChild](/docs/type-helpers/without-child)