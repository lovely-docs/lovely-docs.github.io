## Overview
Groups multiple radio items under a common name for form submission.

## Basic Structure
```svelte
<RadioGroup.Root>
  <RadioGroup.Item value="option1">
    {#snippet children({ checked })}
      {#if checked}✅{/if}
    {/snippet}
  </RadioGroup.Item>
</RadioGroup.Root>
```

## State Management
- **Two-way binding**: `bind:value={myValue}` for automatic synchronization
- **Fully controlled**: Use function bindings `bind:value={getValue, setValue}` for complete control
- **Callback**: `onValueChange` fires when selection changes

## Form Integration
Set `name` prop to render a hidden input for form submission. Use `required` prop to make it required.

## Reusable Component Pattern
Create custom components by wrapping RadioGroup primitives with Label components and accepting an items array:
```svelte
<script lang="ts">
  import { RadioGroup, Label, useId } from "bits-ui";
  type Item = { value: string; label: string; disabled?: boolean };
  let { value = $bindable(""), items, ...restProps }: Props = $props();
</script>
<RadioGroup.Root bind:value {...restProps}>
  {#each items as item}
    {@const id = useId()}
    <RadioGroup.Item {id} value={item.value} disabled={item.disabled}>
      {#snippet children({ checked })}
        {#if checked}✅{/if}
      {/snippet}
    </RadioGroup.Item>
    <Label.Root for={id}>{item.label}</Label.Root>
  {/each}
</RadioGroup.Root>
```

## Configuration
- **`disabled`**: Disables entire group or individual items
- **`readonly`**: Users can focus/navigate but cannot change selection
- **`orientation`**: 'vertical' (ArrowUp/Down) or 'horizontal' (ArrowLeft/Right) for keyboard navigation
- **`loop`**: Whether arrow key navigation loops through items

## API
**RadioGroup.Root props**: value, onValueChange, disabled, required, name, loop, orientation, readonly, ref, children, child

**RadioGroup.Item props**: value (required), disabled, ref, children, child

**Data attributes**: data-state (checked/unchecked), data-disabled, data-readonly, data-orientation, data-value