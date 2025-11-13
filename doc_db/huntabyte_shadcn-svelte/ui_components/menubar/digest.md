## Menubar Component

A persistent menu UI component for desktop applications providing quick access to commands.

### Installation

```bash
pnpm dlx shadcn-svelte@latest add menubar
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
      <Menubar.Sub>
        <Menubar.SubTrigger>Share</Menubar.SubTrigger>
        <Menubar.SubContent>
          <Menubar.Item>Email link</Menubar.Item>
        </Menubar.SubContent>
      </Menubar.Sub>
    </Menubar.Content>
  </Menubar.Menu>
</Menubar.Root>
```

### Features

- **Checkbox Items**: `<Menubar.CheckboxItem bind:checked={state}>Label</Menubar.CheckboxItem>`
- **Radio Groups**: `<Menubar.RadioGroup bind:value={state}>` with `<Menubar.RadioItem value="option">Label</Menubar.RadioItem>`
- **Submenus**: Nest `<Menubar.Sub>` with `<Menubar.SubTrigger>` and `<Menubar.SubContent>`
- **Shortcuts**: Display keyboard shortcuts with `<Menubar.Shortcut>Key</Menubar.Shortcut>`
- **Separators**: Use `<Menubar.Separator />` to divide menu sections
- **Inset Items**: Add `inset` prop to `<Menubar.Item>` for visual alignment

### Component Structure

- `Menubar.Root`: Container
- `Menubar.Menu`: Individual menu
- `Menubar.Trigger`: Menu label/button
- `Menubar.Content`: Menu dropdown container
- `Menubar.Item`: Menu item
- `Menubar.CheckboxItem`: Toggleable menu item
- `Menubar.RadioItem`: Radio option in menu
- `Menubar.RadioGroup`: Radio group container
- `Menubar.Sub`: Submenu container
- `Menubar.SubTrigger`: Submenu trigger
- `Menubar.SubContent`: Submenu content