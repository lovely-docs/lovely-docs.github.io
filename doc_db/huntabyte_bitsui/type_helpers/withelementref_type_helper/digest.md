The `WithElementRef` type helper enables the `ref` prop on custom components following Bits UI's pattern.

**Type Definition:**
```ts
type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & {
  ref?: U | null;
};
```

**Usage:**
Create a custom component with a ref prop by intersecting your props type with `WithElementRef`, specifying the HTML element type:

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

Then bind the ref to the element:
```svelte
<button bind:this={ref}>
  <!-- content -->
</button>
```

This allows consumers of your component to access the underlying HTML element via the ref prop, consistent with Bits UI components.