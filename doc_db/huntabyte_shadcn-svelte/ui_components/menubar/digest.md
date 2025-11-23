## Menubar

A persistent menu component common in desktop applications providing quick access to a consistent set of commands.

### Installation

```bash
npx shadcn-svelte@latest add menubar -y -o
```

The `-y` flag skips the confirmation prompt and `-o` overwrites existing files.

### Basic Usage

```svelte
<script lang="ts">
  import * as Menubar from "$lib/components/ui/menubar/index.js";
</script>

<Menubar.Root>
  <Menubar.Menu>
    <Menubar.Trigger>File</Menubar.Trigger>
    <Menubar.Content>
      <Menubar.Item>
        New Tab
        <Menubar.Shortcut>T</Menubar.Shortcut>
      </Menubar.Item>
      <Menubar.Item>New Window</Menubar.Item>
      <Menubar.Separator />
      <Menubar.Item>Share</Menubar.Item>
      <Menubar.Separator />
      <Menubar.Item>Print</Menubar.Item>
    </Menubar.Content>
  </Menubar.Menu>
</Menubar.Root>
```

### Component Structure

- **Menubar.Root**: Container for all menus
- **Menubar.Menu**: Individual menu group
- **Menubar.Trigger**: Menu label/button
- **Menubar.Content**: Menu dropdown container
- **Menubar.Item**: Menu item
- **Menubar.Shortcut**: Keyboard shortcut display
- **Menubar.Separator**: Visual divider between items
- **Menubar.Sub / Menubar.SubTrigger / Menubar.SubContent**: Nested submenu
- **Menubar.CheckboxItem**: Checkbox menu item with `bind:checked` binding
- **Menubar.RadioGroup / Menubar.RadioItem**: Radio button group with `bind:value` binding
- **Menubar.Item inset**: Item with inset styling (typically for secondary actions)

### Advanced Example

```svelte
<script lang="ts">
  let bookmarks = $state(false);
  let profileValue = $state("benoit");
</script>

<Menubar.Root>
  <Menubar.Menu>
    <Menubar.Trigger>View</Menubar.Trigger>
    <Menubar.Content>
      <Menubar.CheckboxItem bind:checked={bookmarks}>
        Always Show Bookmarks Bar
      </Menubar.CheckboxItem>
      <Menubar.Separator />
      <Menubar.Item inset>
        Reload <Menubar.Shortcut>R</Menubar.Shortcut>
      </Menubar.Item>
    </Menubar.Content>
  </Menubar.Menu>
  <Menubar.Menu>
    <Menubar.Trigger>Profiles</Menubar.Trigger>
    <Menubar.Content>
      <Menubar.RadioGroup bind:value={profileValue}>
        <Menubar.RadioItem value="andy">Andy</Menubar.RadioItem>
        <Menubar.RadioItem value="benoit">Benoit</Menubar.RadioItem>
      </Menubar.RadioGroup>
      <Menubar.Separator />
      <Menubar.Item inset>Edit...</Menubar.Item>
    </Menubar.Content>
  </Menubar.Menu>
  <Menubar.Menu>
    <Menubar.Trigger>Edit</Menubar.Trigger>
    <Menubar.Content>
      <Menubar.Sub>
        <Menubar.SubTrigger>Find</Menubar.SubTrigger>
        <Menubar.SubContent>
          <Menubar.Item>Search the web</Menubar.Item>
          <Menubar.Separator />
          <Menubar.Item>Find...</Menubar.Item>
        </Menubar.SubContent>
      </Menubar.Sub>
    </Menubar.Content>
  </Menubar.Menu>
</Menubar.Root>
```

### Features

- Multiple independent menus in a single menubar
- Nested submenus with SubTrigger and SubContent
- Checkbox items with reactive state binding
- Radio button groups with reactive value binding
- Keyboard shortcuts display
- Visual separators
- Inset styling for secondary menu items
- Full keyboard navigation support (via underlying Bits UI component)