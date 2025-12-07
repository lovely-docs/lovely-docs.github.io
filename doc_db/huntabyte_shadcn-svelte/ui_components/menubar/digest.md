## Menubar

A persistent menu component common in desktop applications providing quick access to commands.

### Installation

```bash
npx shadcn-svelte@latest add menubar -y -o
```

Use `-y` to skip confirmation and `-o` to overwrite existing files.

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
      <Menubar.Item>New Window <Menubar.Shortcut>N</Menubar.Shortcut></Menubar.Item>
      <Menubar.Separator />
      <Menubar.Sub>
        <Menubar.SubTrigger>Share</Menubar.SubTrigger>
        <Menubar.SubContent>
          <Menubar.Item>Email link</Menubar.Item>
          <Menubar.Item>Messages</Menubar.Item>
        </Menubar.SubContent>
      </Menubar.Sub>
    </Menubar.Content>
  </Menubar.Menu>
</Menubar.Root>
```

### Components

- **Menubar.Root**: Container for all menus
- **Menubar.Menu**: Individual menu group
- **Menubar.Trigger**: Menu label/button
- **Menubar.Content**: Menu dropdown container
- **Menubar.Item**: Menu item with optional `inset` prop for alignment
- **Menubar.Shortcut**: Keyboard shortcut display
- **Menubar.Separator**: Visual divider
- **Menubar.Sub / Menubar.SubTrigger / Menubar.SubContent**: Nested submenu
- **Menubar.CheckboxItem**: Checkbox menu item with `bind:checked` for state
- **Menubar.RadioGroup / Menubar.RadioItem**: Radio button group with `bind:value` for selection

### Advanced Example

```svelte
<script lang="ts">
  let bookmarks = $state(false);
  let fullUrls = $state(true);
  let profileRadioValue = $state("benoit");
</script>

<Menubar.Root>
  <Menubar.Menu>
    <Menubar.Trigger>View</Menubar.Trigger>
    <Menubar.Content>
      <Menubar.CheckboxItem bind:checked={bookmarks}>
        Always Show Bookmarks Bar
      </Menubar.CheckboxItem>
      <Menubar.CheckboxItem bind:checked={fullUrls}>
        Always Show Full URLs
      </Menubar.CheckboxItem>
      <Menubar.Separator />
      <Menubar.Item inset>Reload <Menubar.Shortcut>R</Menubar.Shortcut></Menubar.Item>
    </Menubar.Content>
  </Menubar.Menu>
  <Menubar.Menu>
    <Menubar.Trigger>Profiles</Menubar.Trigger>
    <Menubar.Content>
      <Menubar.RadioGroup bind:value={profileRadioValue}>
        <Menubar.RadioItem value="andy">Andy</Menubar.RadioItem>
        <Menubar.RadioItem value="benoit">Benoit</Menubar.RadioItem>
        <Menubar.RadioItem value="luis">Luis</Menubar.RadioItem>
      </Menubar.RadioGroup>
    </Menubar.Content>
  </Menubar.Menu>
</Menubar.Root>
```