## Menubar

Desktop application-style persistent menu component.

### Installation

```bash
npx shadcn-svelte@latest add menubar -y -o
```

### Basic Usage

```svelte
<script lang="ts">
  import * as Menubar from "$lib/components/ui/menubar/index.js";
</script>

<Menubar.Root>
  <Menubar.Menu>
    <Menubar.Trigger>File</Menubar.Trigger>
    <Menubar.Content>
      <Menubar.Item>New Tab <Menubar.Shortcut>T</Menubar.Shortcut></Menubar.Item>
      <Menubar.Separator />
      <Menubar.Item>Print</Menubar.Item>
    </Menubar.Content>
  </Menubar.Menu>
</Menubar.Root>
```

### Key Components

- **Menubar.Root**: Container
- **Menubar.Menu / Menubar.Trigger / Menubar.Content**: Menu structure
- **Menubar.Item**: Menu item
- **Menubar.Shortcut**: Keyboard shortcut display
- **Menubar.Separator**: Divider
- **Menubar.Sub / Menubar.SubTrigger / Menubar.SubContent**: Nested submenu
- **Menubar.CheckboxItem**: Checkbox with `bind:checked`
- **Menubar.RadioGroup / Menubar.RadioItem**: Radio buttons with `bind:value`
- **Menubar.Item inset**: Secondary action styling