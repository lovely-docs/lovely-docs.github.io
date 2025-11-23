## Context Menu

Right-click triggered menu component with items, submenus, checkboxes, and radio buttons.

### Installation

```bash
npx shadcn-svelte@latest add context-menu -y -o
```

### Basic Usage

```svelte
<script lang="ts">
  import * as ContextMenu from "$lib/components/ui/context-menu/index.js";
</script>

<ContextMenu.Root>
  <ContextMenu.Trigger>Right click</ContextMenu.Trigger>
  <ContextMenu.Content>
    <ContextMenu.Item>Profile</ContextMenu.Item>
    <ContextMenu.Item>Billing</ContextMenu.Item>
  </ContextMenu.Content>
</ContextMenu.Root>
```

### Key Components

- **Root/Trigger/Content**: Basic structure
- **Item**: Menu items with optional `inset` and `disabled` props
- **Shortcut**: Keyboard shortcut display
- **Sub/SubTrigger/SubContent**: Nested submenus
- **Separator**: Visual dividers
- **CheckboxItem**: Checkbox items with `bind:checked`
- **RadioGroup/RadioItem**: Radio selection with `bind:value`
- **Group/GroupHeading**: Item grouping with headers