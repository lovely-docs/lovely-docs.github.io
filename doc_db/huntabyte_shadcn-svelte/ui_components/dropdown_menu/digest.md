## Dropdown Menu

A menu component that displays a set of actions or functions triggered by a button.

### Installation

```bash
npx shadcn-svelte@latest add dropdown-menu -y -o
```

The `-y` flag skips the confirmation prompt and `-o` overwrites existing files.

### Basic Usage

```svelte
<script lang="ts">
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      <Button {...props} variant="outline">Open</Button>
    {/snippet}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content class="w-56" align="start">
    <DropdownMenu.Label>My Account</DropdownMenu.Label>
    <DropdownMenu.Group>
      <DropdownMenu.Item>
        Profile
        <DropdownMenu.Shortcut>P</DropdownMenu.Shortcut>
      </DropdownMenu.Item>
      <DropdownMenu.Item>Billing</DropdownMenu.Item>
      <DropdownMenu.Item>Settings</DropdownMenu.Item>
    </DropdownMenu.Group>
    <DropdownMenu.Separator />
    <DropdownMenu.Item disabled>API</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
```

### Components

- **Root**: Container for the dropdown menu
- **Trigger**: Button that opens the menu (accepts snippet with props)
- **Content**: Menu container with optional `align` and `class` props
- **Label**: Section label
- **Group**: Groups related items
- **Item**: Menu item (supports `disabled` prop)
- **Shortcut**: Keyboard shortcut display
- **Separator**: Visual divider
- **Sub/SubTrigger/SubContent**: Nested submenu support
- **CheckboxItem**: Menu item with checkbox (bind:checked for state)
- **RadioGroup/RadioItem**: Radio button group in menu

### Examples

**Checkboxes with state binding:**
```svelte
<script lang="ts">
  let showStatusBar = $state(true);
</script>

<DropdownMenu.CheckboxItem bind:checked={showStatusBar}>
  Status Bar
</DropdownMenu.CheckboxItem>
```

**Radio group:**
```svelte
<script lang="ts">
  let position = $state("bottom");
</script>

<DropdownMenu.RadioGroup bind:value={position}>
  <DropdownMenu.RadioItem value="top">Top</DropdownMenu.RadioItem>
  <DropdownMenu.RadioItem value="bottom">Bottom</DropdownMenu.RadioItem>
</DropdownMenu.RadioGroup>
```

### Changelog

**2024-10-30**: Added automatic styling for `DropdownMenu.SubTrigger` with `gap-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0` classes to style icons. Icon `size-4` class removed from manual implementation as it's now handled by parent.