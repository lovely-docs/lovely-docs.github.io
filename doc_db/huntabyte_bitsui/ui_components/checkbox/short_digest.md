## Checkbox Component

Tri-state checkbox (checked, unchecked, indeterminate) with accessibility and form support.

### Basic Usage
```svelte
<Checkbox.Root bind:checked={myChecked}>
  {#snippet children({ checked, indeterminate })}
    {#if indeterminate}-{:else if checked}✅{:else}❌{/if}
  {/snippet}
</Checkbox.Root>
```

### State Management
- `bind:checked` for two-way binding or function binding for full control
- `bind:indeterminate` for indeterminate state
- `disabled`, `required`, `readonly` props

### Forms
```svelte
<Checkbox.Root name="notifications" value="hello" />
```

### Groups
```svelte
<Checkbox.Group bind:value={myValue} name="notifications">
  <Checkbox.GroupLabel>Notifications</Checkbox.GroupLabel>
  <Checkbox.Root value="marketing" />
  <Checkbox.Root value="promotions" />
</Checkbox.Group>
```

### Key Props
- `checked`, `indeterminate` (bindable)
- `disabled`, `required`, `readonly`
- `name`, `value` (for forms)
- `ref` (DOM reference)
- `children` snippet with `{ checked, indeterminate }`

### Data Attributes
- `data-state`: 'checked' | 'unchecked' | 'indeterminate'
- `data-disabled`, `data-readonly`, `data-checkbox-root`