## Native Select

Styled native HTML select with design system integration.

```svelte
import * as NativeSelect from "$lib/components/ui/native-select/index.js";

<NativeSelect.Root>
  <NativeSelect.Option value="">Select status</NativeSelect.Option>
  <NativeSelect.Option value="todo">Todo</NativeSelect.Option>
</NativeSelect.Root>
```

**Option Groups:**
```svelte
<NativeSelect.OptGroup label="Engineering">
  <NativeSelect.Option value="frontend">Frontend</NativeSelect.Option>
</NativeSelect.OptGroup>
```

**States:** `disabled` prop, `aria-invalid="true"` for validation

**API:** NativeSelect.Root, NativeSelect.Option (value, disabled, class), NativeSelect.OptGroup (label, disabled, class)

**Use NativeSelect** for native behavior and mobile optimization; use Select for custom styling.