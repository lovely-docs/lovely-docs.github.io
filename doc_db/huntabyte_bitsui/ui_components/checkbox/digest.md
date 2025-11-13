## Checkbox Component

A flexible, accessible checkbox input supporting three states: checked, unchecked, and indeterminate.

### Key Features
- Tri-state support (checked, unchecked, indeterminate)
- WAI-ARIA compliant with keyboard navigation and screen reader support
- Controlled and uncontrolled state management
- Form integration with hidden input submission

### Basic Usage
```svelte
<script lang="ts">
  import { Checkbox } from "bits-ui";
</script>
<Checkbox.Root>
  {#snippet children({ checked, indeterminate })}
    {#if indeterminate}
      -
    {:else if checked}
      ✅
    {:else}
      ❌
    {/if}
  {/snippet}
</Checkbox.Root>
```

### State Management

**Checked State - Two-way binding:**
```svelte
<script lang="ts">
  let myChecked = $state(false);
</script>
<Checkbox.Root bind:checked={myChecked} />
```

**Checked State - Fully controlled:**
```svelte
<Checkbox.Root bind:checked={getChecked, setChecked} />
```

**Indeterminate State:**
```svelte
<Checkbox.Root bind:indeterminate={myIndeterminate} />
```

### Disabled & Required
```svelte
<Checkbox.Root disabled />
<Checkbox.Root required />
```

### HTML Forms
```svelte
<!-- Submits 'on' by default when checked -->
<Checkbox.Root name="notifications" />

<!-- Custom value -->
<Checkbox.Root name="notifications" value="hello" />
```

### Checkbox Groups
```svelte
<script lang="ts">
  let myValue = $state<string[]>(["marketing", "news"]);
</script>
<Checkbox.Group bind:value={myValue} name="notifications">
  <Checkbox.GroupLabel>Notifications</Checkbox.GroupLabel>
  <Checkbox.Root value="marketing" />
  <Checkbox.Root value="promotions" />
  <Checkbox.Root value="news" />
</Checkbox.Group>
```

### API Reference

**Checkbox.Root Properties:**
- `checked` $bindable (boolean, default: false)
- `onCheckedChange` (callback)
- `indeterminate` $bindable (boolean, default: false)
- `onIndeterminateChange` (callback)
- `disabled` (boolean, default: false)
- `required` (boolean, default: false)
- `name` (string, optional - enables form submission)
- `value` (string, optional - form submission value)
- `readonly` (boolean, default: false)
- `ref` $bindable (HTMLButtonElement)
- `children` (Snippet with checked, indeterminate props)

**Data Attributes:**
- `data-state`: 'checked' | 'unchecked' | 'indeterminate'
- `data-disabled`, `data-readonly`, `data-checkbox-root`

**Checkbox.Group Properties:**
- `value` $bindable (string[], default: [])
- `onValueChange` (callback)
- `disabled`, `required`, `readonly` (boolean)
- `name` (string, optional)
- `ref` $bindable (HTMLDivElement)

**Checkbox.GroupLabel:** Accessible label component with `ref` and snippet support.