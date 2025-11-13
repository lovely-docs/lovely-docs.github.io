## Switch Component

A toggle control for binary on/off states with WAI-ARIA accessibility support.

### Structure
```svelte
<Switch.Root>
  <Switch.Thumb />
</Switch.Root>
```

### State Management

**Two-way binding:**
```svelte
<script lang="ts">
  import { Switch } from "bits-ui";
  let myChecked = $state(true);
</script>
<Switch.Root bind:checked={myChecked} />
```

**Fully controlled with function bindings:**
```svelte
<script lang="ts">
  import { Switch } from "bits-ui";
  let myChecked = $state(false);
  function getChecked() { return myChecked; }
  function setChecked(newChecked: boolean) { myChecked = newChecked; }
</script>
<Switch.Root bind:checked={getChecked, setChecked} />
```

### Disabled State
```svelte
<Switch.Root disabled />
```

### HTML Forms
Pass `name` prop to render a hidden input for form submission (defaults to 'on' when checked):
```svelte
<Switch.Root name="dnd" value="custom-value" required />
```

### API Reference

**Switch.Root props:**
- `checked` ($bindable): boolean, default false
- `onCheckedChange`: (checked: boolean) => void callback
- `disabled`: boolean, default false
- `name`: string for form submission
- `required`: boolean, default false
- `value`: string for hidden input value
- `ref` ($bindable): HTMLButtonElement reference

**Data attributes:**
- `data-state`: 'checked' | 'unchecked'
- `data-checked`: present when checked
- `data-disabled`: present when disabled
- `data-switch-root`: present on root

**Switch.Thumb props:**
- `ref` ($bindable): HTMLSpanElement reference

**Data attributes:**
- `data-state`: 'checked' | 'unchecked'
- `data-checked`: present when checked
- `data-switch-thumb`: present on thumb