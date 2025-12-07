## Context Menu

A component that displays a menu triggered by right-click, containing actions, functions, and interactive elements.

### Installation

```bash
npx shadcn-svelte@latest add context-menu -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

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

### Features

**Structure:**
- `ContextMenu.Root` - wrapper component
- `ContextMenu.Trigger` - element that triggers the menu on right-click
- `ContextMenu.Content` - container for menu items

**Item Types:**
- `ContextMenu.Item` - basic menu item with optional `inset` and `disabled` props
- `ContextMenu.Shortcut` - displays keyboard shortcut text within items
- `ContextMenu.Separator` - divider between item groups
- `ContextMenu.CheckboxItem` - toggleable item with `bind:checked` for state binding
- `ContextMenu.RadioItem` - radio button item within `ContextMenu.RadioGroup`
- `ContextMenu.Group` - groups related items
- `ContextMenu.GroupHeading` - label for item groups

**Nested Menus:**
- `ContextMenu.Sub` - container for submenu
- `ContextMenu.SubTrigger` - opens submenu on hover/click
- `ContextMenu.SubContent` - submenu content container

### Complete Example

```svelte
<script lang="ts">
  import * as ContextMenu from "$lib/components/ui/context-menu/index.js";
  let showBookmarks = $state(false);
  let showFullURLs = $state(true);
  let value = $state("pedro");
</script>

<ContextMenu.Root>
  <ContextMenu.Trigger class="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
    Right click here
  </ContextMenu.Trigger>
  <ContextMenu.Content class="w-52">
    <ContextMenu.Item inset>
      Back
      <ContextMenu.Shortcut>[</ContextMenu.Shortcut>
    </ContextMenu.Item>
    <ContextMenu.Item inset disabled>
      Forward
      <ContextMenu.Shortcut>]</ContextMenu.Shortcut>
    </ContextMenu.Item>
    <ContextMenu.Item inset>
      Reload
      <ContextMenu.Shortcut>R</ContextMenu.Shortcut>
    </ContextMenu.Item>
    <ContextMenu.Sub>
      <ContextMenu.SubTrigger inset>More Tools</ContextMenu.SubTrigger>
      <ContextMenu.SubContent class="w-48">
        <ContextMenu.Item>Save Page As... <ContextMenu.Shortcut>S</ContextMenu.Shortcut></ContextMenu.Item>
        <ContextMenu.Item>Create Shortcut...</ContextMenu.Item>
        <ContextMenu.Item>Name Window...</ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Item>Developer Tools</ContextMenu.Item>
      </ContextMenu.SubContent>
    </ContextMenu.Sub>
    <ContextMenu.Separator />
    <ContextMenu.CheckboxItem bind:checked={showBookmarks}>
      Show Bookmarks
    </ContextMenu.CheckboxItem>
    <ContextMenu.CheckboxItem bind:checked={showFullURLs}>
      Show Full URLs
    </ContextMenu.CheckboxItem>
    <ContextMenu.Separator />
    <ContextMenu.RadioGroup bind:value>
      <ContextMenu.Group>
        <ContextMenu.GroupHeading inset>People</ContextMenu.GroupHeading>
        <ContextMenu.RadioItem value="pedro">Pedro Duarte</ContextMenu.RadioItem>
        <ContextMenu.RadioItem value="colm">Colm Tuite</ContextMenu.RadioItem>
      </ContextMenu.Group>
    </ContextMenu.RadioGroup>
  </ContextMenu.Content>
</ContextMenu.Root>
```