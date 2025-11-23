## Native Select

A styled wrapper around the native HTML select element with consistent design system integration.

### Installation

```bash
npx shadcn-svelte@latest add native-select -y -o
```

The `-y` flag skips the confirmation prompt and `-o` overwrites existing files.

### Basic Usage

```svelte
<script lang="ts">
  import * as NativeSelect from "$lib/components/ui/native-select/index.js";
</script>

<NativeSelect.Root>
  <NativeSelect.Option value="">Select status</NativeSelect.Option>
  <NativeSelect.Option value="todo">Todo</NativeSelect.Option>
  <NativeSelect.Option value="in-progress">In Progress</NativeSelect.Option>
  <NativeSelect.Option value="done">Done</NativeSelect.Option>
</NativeSelect.Root>
```

### Grouped Options

Use `NativeSelect.OptGroup` to organize related options:

```svelte
<NativeSelect.Root>
  <NativeSelect.Option value="">Select department</NativeSelect.Option>
  <NativeSelect.OptGroup label="Engineering">
    <NativeSelect.Option value="frontend">Frontend</NativeSelect.Option>
    <NativeSelect.Option value="backend">Backend</NativeSelect.Option>
  </NativeSelect.OptGroup>
  <NativeSelect.OptGroup label="Sales">
    <NativeSelect.Option value="sales-rep">Sales Rep</NativeSelect.Option>
  </NativeSelect.OptGroup>
</NativeSelect.Root>
```

### Disabled State

Disable individual options or the entire select:

```svelte
<NativeSelect.Root disabled>
  <NativeSelect.Option value="">Select priority</NativeSelect.Option>
  <NativeSelect.Option value="low">Low</NativeSelect.Option>
  <NativeSelect.Option value="high">High</NativeSelect.Option>
</NativeSelect.Root>
```

Or disable specific options:

```svelte
<NativeSelect.Option value="grapes" disabled>Grapes</NativeSelect.Option>
```

### Invalid State

Use `aria-invalid="true"` to show validation errors:

```svelte
<NativeSelect.Root aria-invalid="true">
  <NativeSelect.Option value="">Select role</NativeSelect.Option>
  <NativeSelect.Option value="admin">Admin</NativeSelect.Option>
  <NativeSelect.Option value="editor">Editor</NativeSelect.Option>
</NativeSelect.Root>
```

### API Reference

**NativeSelect.Root** - Main select component wrapping native HTML select
- `class`: string - Custom CSS classes
- All other props pass through to the underlying `<select>` element

**NativeSelect.Option** - Individual option element
- `value`: string - Option value
- `disabled`: boolean (default: false) - Disable this option
- `class`: string - Custom CSS classes
- All other props pass through to the underlying `<option>` element

**NativeSelect.OptGroup** - Groups related options
- `label`: string - Group label
- `disabled`: boolean (default: false) - Disable entire group
- `class`: string - Custom CSS classes
- All other props pass through to the underlying `<optgroup>` element

### When to Use

Use `NativeSelect` for native browser behavior, better performance, and mobile-optimized dropdowns. Use the `Select` component instead when you need custom styling, animations, or complex interactions.

### Accessibility

- Maintains all native HTML select accessibility features
- Screen readers navigate through options using arrow keys
- Chevron icon marked as `aria-hidden="true"` to avoid duplication
- Use `aria-label` or `aria-labelledby` for additional context:

```svelte
<NativeSelect.Root aria-label="Choose your preferred language">
  <NativeSelect.Option value="en">English</NativeSelect.Option>
  <NativeSelect.Option value="es">Spanish</NativeSelect.Option>
</NativeSelect.Root>
```