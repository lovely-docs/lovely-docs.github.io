## Native Select Component

A styled wrapper around the native HTML select element with design system integration.

### Installation
```bash
npm install shadcn-svelte@latest add native-select
```

### Basic Usage
```svelte
<script lang="ts">
  import * as NativeSelect from "$lib/components/ui/native-select/index.js";
</script>
<NativeSelect.Root>
  <NativeSelect.Option value="">Select status</NativeSelect.Option>
  <NativeSelect.Option value="todo">Todo</NativeSelect.Option>
  <NativeSelect.Option value="done">Done</NativeSelect.Option>
</NativeSelect.Root>
```

### Option Groups
Organize options using `NativeSelect.OptGroup`:
```svelte
<NativeSelect.Root>
  <NativeSelect.OptGroup label="Engineering">
    <NativeSelect.Option value="frontend">Frontend</NativeSelect.Option>
    <NativeSelect.Option value="backend">Backend</NativeSelect.Option>
  </NativeSelect.OptGroup>
  <NativeSelect.OptGroup label="Sales">
    <NativeSelect.Option value="sales-rep">Sales Rep</NativeSelect.Option>
  </NativeSelect.OptGroup>
</NativeSelect.Root>
```

### States
- **Disabled**: Set `disabled` prop on Root or individual Options
- **Invalid**: Use `aria-invalid="true"` for validation errors

### API Reference

**NativeSelect.Root** - Main select wrapper
- `class`: string
- All other props passed to native `<select>`

**NativeSelect.Option** - Individual option
- `value`: string
- `disabled`: boolean (default: false)
- `class`: string

**NativeSelect.OptGroup** - Option grouping
- `label`: string
- `disabled`: boolean (default: false)
- `class`: string

### When to Use
- Use NativeSelect for native browser behavior, better performance, and mobile-optimized dropdowns
- Use Select component for custom styling, animations, or complex interactions

### Accessibility
- Maintains native HTML select accessibility
- Screen readers navigate with arrow keys
- Chevron icon marked as `aria-hidden="true"`
- Use `aria-label` or `aria-labelledby` for additional context