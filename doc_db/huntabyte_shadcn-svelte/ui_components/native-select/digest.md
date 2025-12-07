## Native Select

A styled wrapper around the native HTML `<select>` element with design system integration.

### Installation

```bash
npx shadcn-svelte@latest add native-select -y -o
```

Use `-y` to skip confirmation and `-o` to overwrite existing files.

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
  <NativeSelect.Option value="cancelled">Cancelled</NativeSelect.Option>
</NativeSelect.Root>
```

### Option Groups

Organize options with `NativeSelect.OptGroup`:

```svelte
<NativeSelect.Root>
  <NativeSelect.Option value="">Select department</NativeSelect.Option>
  <NativeSelect.OptGroup label="Engineering">
    <NativeSelect.Option value="frontend">Frontend</NativeSelect.Option>
    <NativeSelect.Option value="backend">Backend</NativeSelect.Option>
    <NativeSelect.Option value="devops">DevOps</NativeSelect.Option>
  </NativeSelect.OptGroup>
  <NativeSelect.OptGroup label="Sales">
    <NativeSelect.Option value="sales-rep">Sales Rep</NativeSelect.Option>
    <NativeSelect.Option value="account-manager">Account Manager</NativeSelect.Option>
    <NativeSelect.Option value="sales-director">Sales Director</NativeSelect.Option>
  </NativeSelect.OptGroup>
</NativeSelect.Root>
```

### States

**Disabled:**
```svelte
<NativeSelect.Root disabled>
  <NativeSelect.Option value="">Select priority</NativeSelect.Option>
  <NativeSelect.Option value="low">Low</NativeSelect.Option>
  <NativeSelect.Option value="medium">Medium</NativeSelect.Option>
  <NativeSelect.Option value="high">High</NativeSelect.Option>
</NativeSelect.Root>
```

**Invalid (with aria-invalid):**
```svelte
<NativeSelect.Root aria-invalid="true">
  <NativeSelect.Option value="">Select role</NativeSelect.Option>
  <NativeSelect.Option value="admin">Admin</NativeSelect.Option>
  <NativeSelect.Option value="editor">Editor</NativeSelect.Option>
  <NativeSelect.Option value="viewer">Viewer</NativeSelect.Option>
</NativeSelect.Root>
```

**Individual option disabled:**
```svelte
<NativeSelect.Option value="grapes" disabled>Grapes</NativeSelect.Option>
```

### API Reference

**NativeSelect.Root** - Main select wrapper
- `class`: string (optional)
- All other props passed to native `<select>`

**NativeSelect.Option** - Individual option
- `value`: string (required)
- `disabled`: boolean (default: false)
- `class`: string (optional)
- All other props passed to native `<option>`

**NativeSelect.OptGroup** - Option grouping
- `label`: string (required)
- `disabled`: boolean (default: false)
- `class`: string (optional)
- All other props passed to native `<optgroup>`

### Accessibility

- Maintains native HTML select accessibility
- Screen readers navigate with arrow keys
- Chevron icon marked `aria-hidden="true"`
- Use `aria-label` or `aria-labelledby` for context:

```svelte
<NativeSelect.Root aria-label="Choose your preferred language">
  <NativeSelect.Option value="en">English</NativeSelect.Option>
  <NativeSelect.Option value="es">Spanish</NativeSelect.Option>
  <NativeSelect.Option value="fr">French</NativeSelect.Option>
</NativeSelect.Root>
```

### NativeSelect vs Select

Use `NativeSelect` for native browser behavior, better performance, or mobile-optimized dropdowns. Use `Select` for custom styling, animations, or complex interactions.