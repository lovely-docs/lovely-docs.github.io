## Label Component

An enhanced label element for associating text with form inputs.

### Structure
```svelte
import { Label } from "bits-ui";
<Label.Root />
```

### API Reference

**Label.Root** - Enhanced label component for any input.

| Property | Type | Description |
|----------|------|-------------|
| `ref` $bindable | `HTMLLabelElement` | Reference to the underlying DOM element |
| `children` | `Snippet` | Content to render |
| `child` | `Snippet` | Render delegation for custom elements (see Child Snippet docs) |

| Data Attribute | Value | Description |
|---|---|---|
| `data-label-root` | `''` | Present on root element |

### Example
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
    name="hello"
  >
    {#snippet children({ checked, indeterminate })}
      <div>
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
  >
    Accept terms and conditions
  </Label.Root>
</div>
```