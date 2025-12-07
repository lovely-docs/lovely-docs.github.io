## Checkbox Component

Tri-state checkbox (checked, unchecked, indeterminate) with accessibility support.

### Basic Usage
```svelte
<Checkbox.Root bind:checked={myChecked}>
  {#snippet children({ checked, indeterminate })}
    {#if indeterminate}-{:else if checked}✅{/if}
  {/snippet}
</Checkbox.Root>
```

### State Management
- **Two-way binding**: `bind:checked={myChecked}`, `bind:indeterminate={myIndeterminate}`
- **Fully controlled**: `bind:checked={getChecked, setChecked}`

### Forms
- `name` prop renders hidden input for form submission
- `value` prop sets custom submission value (default: `'on'`)
- `required` prop enforces form validation

### Checkbox Groups
```svelte
<Checkbox.Group bind:value={myValue} name="notifications">
  <Checkbox.GroupLabel>Notifications</Checkbox.GroupLabel>
  <Checkbox.Root value="marketing" />
  <Checkbox.Root value="promotions" />
</Checkbox.Group>
```
Group inherits `name`, `required`, `disabled` to children.

### Key Props
- `checked`, `indeterminate`, `disabled`, `readonly`, `required`, `name`, `value`
- `onCheckedChange`, `onIndeterminateChange` callbacks
- Data attributes: `data-state`, `data-disabled`, `data-readonly`
