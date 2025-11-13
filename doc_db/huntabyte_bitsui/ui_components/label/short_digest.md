## Label Component

Enhanced label element for form inputs.

**Label.Root** properties:
- `ref` $bindable - HTMLLabelElement reference
- `children` - Content snippet
- `child` - Render delegation snippet

Data attribute: `data-label-root`

**Example:**
```svelte
<Checkbox.Root id="terms" aria-labelledby="terms-label">
  {#snippet children({ checked, indeterminate })}
    {#if indeterminate}
      <Minus />
    {:else if checked}
      <Check />
    {/if}
  {/snippet}
</Checkbox.Root>
<Label.Root id="terms-label" for="terms">
  Accept terms and conditions
</Label.Root>
```