# Label Documentation

Identifies or describes associated UI elements.

This is a documentation section that potentially contains examples, demos, and other useful information related to a specific part of Bits UI. When helping users with this documentation, you can ignore the classnames applied to the demos unless they are relevant to the user's issue.

Copy Page

```svelte
<script lang="ts">
  import { Checkbox, Label } from "bits-ui";
  import Check from "phosphor-svelte/lib/Check";
  import Minus from "phosphor-svelte/lib/Minus";
</script>
<div class="flex items-center space-x-3">
  <Checkbox.Root
    id="terms"
    aria-labelledby="terms-label"
    class="border-muted bg-foreground data-[state=unchecked]:border-border-input data-[state=unchecked]:bg-background data-[state=unchecked]:hover:border-dark-40 peer inline-flex size-[25px] items-center justify-center rounded-md border transition-all duration-150 ease-in-out active:scale-[0.98]"
    name="hello"
  >
    {#snippet children({ checked, indeterminate })}
      <div class="text-background inline-flex items-center justify-center">
        {#if indeterminate}
          <Minus class="size-[15px]" weight="bold" />
        {:else if checked}
          <Check class="size-[15px]" weight="bold" />
        {/if}
      </div>
    {/snippet}
  </Checkbox.Root>
  <Label.Root
    id="terms-label"
    for="terms"
    class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
  >
    Accept terms and conditions
  </Label.Root>
</div>
```

## Structure

```svelte
<script lang="ts">
  import { Label } from "bits-ui";
</script>
<Label.Root />
```

## API Reference

### Label.Root

An enhanced label component that can be used with any input.

| Property        | Type                                                                  | Description                                                                                                                                   | Details |
| --------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `ref` $bindable | `HTMLLabelElement`                                                    | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`      | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`         | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute    | Value | Description                  | Details |
| ----------------- | ----- | ---------------------------- | ------- |
| `data-label-root` | `''`  | Present on the root element. |         |

[Previous Dropdown Menu](/docs/components/dropdown-menu) [Next Link Preview](/docs/components/link-preview)