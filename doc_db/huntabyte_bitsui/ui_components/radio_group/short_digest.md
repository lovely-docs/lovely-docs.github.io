## Radio Group
Groups radio items for form submission with state management and keyboard navigation.

## Basic Usage
```svelte
<RadioGroup.Root bind:value={myValue}>
  <RadioGroup.Item value="option1">
    {#snippet children({ checked })}
      {#if checked}✅{/if}
    {/snippet}
  </RadioGroup.Item>
</RadioGroup.Root>
```

## Key Features
- **State**: Two-way binding with `bind:value` or fully controlled with function bindings
- **Form integration**: Set `name` prop for hidden input submission, `required` for validation
- **Reusable component**: Wrap with Label and accept items array for custom components
- **Configuration**: `disabled`, `readonly`, `orientation` ('vertical'/'horizontal'), `loop`
- **Keyboard nav**: ArrowUp/Down for vertical, ArrowLeft/Right for horizontal

## API
**Root**: value, onValueChange, disabled, required, name, loop, orientation, readonly, ref
**Item**: value (required), disabled, ref
**Data attributes**: data-state, data-disabled, data-readonly, data-orientation, data-value