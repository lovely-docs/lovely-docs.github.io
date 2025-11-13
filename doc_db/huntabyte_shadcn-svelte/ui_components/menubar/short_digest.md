## Menubar Component

Desktop application menu UI with support for items, checkboxes, radio groups, submenus, and keyboard shortcuts.

### Installation
```bash
pnpm dlx shadcn-svelte@latest add menubar
```

### Example
```svelte
<script lang="ts">
  import * as Menubar from "$lib/components/ui/menubar/index.js";
</script>

<Menubar.Root>
  <Menubar.Menu>
    <Menubar.Trigger>File</Menubar.Trigger>
    <Menubar.Content>
      <Menubar.Item>New Tab <Menubar.Shortcut>T</Menubar.Shortcut></Menubar.Item>
      <Menubar.CheckboxItem bind:checked={state}>Show Bookmarks</Menubar.CheckboxItem>
      <Menubar.Separator />
      <Menubar.Sub>
        <Menubar.SubTrigger>Share</Menubar.SubTrigger>
        <Menubar.SubContent>
          <Menubar.Item>Email</Menubar.Item>
        </Menubar.SubContent>
      </Menubar.Sub>
    </Menubar.Content>
  </Menubar.Menu>
</Menubar.Root>
```