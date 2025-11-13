## Button Component

A flexible button component that switches between `<button>` and `<a>` elements based on the `href` prop.

### Button.Root

Main component with the following props:

- `href` (string, optional): Converts the button into an anchor tag when provided
- `disabled` (boolean, default: false): Disables button interaction
- `ref` (bindable HTMLButtonElement): Reference to the underlying DOM element
- `children` (Snippet): Content to render inside the button

Data attribute `data-button-root` is present on the rendered element.

### Example

```svelte
<script lang="ts">
  import { Button } from "bits-ui";
</script>

<Button.Root
  class="rounded-input bg-dark text-background shadow-mini hover:bg-dark/95 inline-flex
  h-12 items-center justify-center px-[21px] text-[15px]
  font-semibold active:scale-[0.98] active:transition-all"
>
  Unlimited
</Button.Root>
```