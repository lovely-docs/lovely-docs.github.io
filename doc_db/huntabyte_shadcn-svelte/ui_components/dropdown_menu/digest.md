## Dropdown Menu Component

A menu component that displays a set of actions or functions triggered by a button.

### Installation

```bash
pnpm dlx shadcn-svelte@latest add dropdown-menu
```

### Basic Usage

```svelte
<script lang="ts">
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Group>
      <DropdownMenu.Label>My Account</DropdownMenu.Label>
      <DropdownMenu.Separator />
      <DropdownMenu.Item>Profile</DropdownMenu.Item>
      <DropdownMenu.Item>Billing</DropdownMenu.Item>
      <DropdownMenu.Item>Team</DropdownMenu.Item>
      <DropdownMenu.Item>Subscription</DropdownMenu.Item>
    </DropdownMenu.Group>
  </DropdownMenu.Content>
</DropdownMenu.Root>
```

### Key Components

- `Root`: Container for the dropdown
- `Trigger`: Button that opens the menu
- `Content`: Menu container with alignment options
- `Group`: Groups related items
- `Label`: Section labels
- `Item`: Menu items (supports `disabled` state)
- `Separator`: Visual divider
- `Sub`/`SubTrigger`/`SubContent`: Nested submenus
- `Shortcut`: Keyboard shortcut display
- `CheckboxItem`: Items with checkbox state binding
- `RadioGroup`/`RadioItem`: Radio button selection

### Examples

**Checkboxes with state binding:**
```svelte
<DropdownMenu.CheckboxItem bind:checked={showStatusBar}>
  Status Bar
</DropdownMenu.CheckboxItem>
```

**Radio group for selection:**
```svelte
<DropdownMenu.RadioGroup bind:value={position}>
  <DropdownMenu.RadioItem value="top">Top</DropdownMenu.RadioItem>
  <DropdownMenu.RadioItem value="bottom">Bottom</DropdownMenu.RadioItem>
</DropdownMenu.RadioGroup>
```

### Recent Changes (2024-10-30)

SubTrigger now includes automatic icon styling with `gap-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0`, removing the need to manually size icons.