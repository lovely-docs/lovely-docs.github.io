## Native Select

Styled wrapper around native HTML select element.

### Installation

```bash
npx shadcn-svelte@latest add native-select -y -o
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

### Grouped Options

```svelte
<NativeSelect.OptGroup label="Engineering">
  <NativeSelect.Option value="frontend">Frontend</NativeSelect.Option>
  <NativeSelect.Option value="backend">Backend</NativeSelect.Option>
</NativeSelect.OptGroup>
```

### States

Disabled: `<NativeSelect.Root disabled>` or `<NativeSelect.Option disabled>`

Invalid: `<NativeSelect.Root aria-invalid="true">`

### API

- **NativeSelect.Root**: Main component, accepts `class` and all `<select>` props
- **NativeSelect.Option**: `value`, `disabled`, `class` props
- **NativeSelect.OptGroup**: `label`, `disabled`, `class` props

### Accessibility

Maintains native HTML select accessibility. Use `aria-label` for context when needed.