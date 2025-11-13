## Context Menu Component

A right-click triggered menu component for displaying actions or functions.

### Installation

```bash
pnpm dlx shadcn-svelte@latest add context-menu
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
    <ContextMenu.Item>Team</ContextMenu.Item>
    <ContextMenu.Item>Subscription</ContextMenu.Item>
  </ContextMenu.Content>
</ContextMenu.Root>
```

### Advanced Features

- **Submenus**: Use `ContextMenu.Sub`, `ContextMenu.SubTrigger`, and `ContextMenu.SubContent` for nested menus
- **Separators**: `ContextMenu.Separator` divides menu sections
- **Disabled Items**: Add `disabled` prop to `ContextMenu.Item`
- **Shortcuts**: Display keyboard shortcuts with `ContextMenu.Shortcut`
- **Checkbox Items**: `ContextMenu.CheckboxItem` with `bind:checked` for toggleable options
- **Radio Groups**: `ContextMenu.RadioGroup` with `ContextMenu.RadioItem` for mutually exclusive selections, use `bind:value` to track selection
- **Grouping**: `ContextMenu.Group` and `ContextMenu.GroupHeading` for organizing radio items
- **Styling**: Apply custom classes to `ContextMenu.Content` and `ContextMenu.Trigger`

See Bits UI documentation for full API reference.