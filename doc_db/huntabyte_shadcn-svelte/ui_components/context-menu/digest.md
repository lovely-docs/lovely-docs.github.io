## Context Menu

A component that displays a menu triggered by right-click, containing actions, functions, or options.

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

### Components

- **Root**: Container for the context menu
- **Trigger**: Element that triggers the menu on right-click
- **Content**: Menu container with optional `class` prop for styling (e.g., `w-52`)
- **Item**: Menu item with optional `inset` and `disabled` props
- **Shortcut**: Displays keyboard shortcut text within an item
- **Sub/SubTrigger/SubContent**: Nested submenu structure
- **Separator**: Visual divider between menu sections
- **CheckboxItem**: Menu item with checkbox state, use `bind:checked` for reactivity
- **RadioGroup/RadioItem**: Radio button group within menu, use `bind:value` for selection
- **Group/GroupHeading**: Groups related items with optional heading

### Example with All Features

```svelte
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
    <ContextMenu.Sub>
      <ContextMenu.SubTrigger inset>More Tools</ContextMenu.SubTrigger>
      <ContextMenu.SubContent class="w-48">
        <ContextMenu.Item>Save Page As...<ContextMenu.Shortcut>S</ContextMenu.Shortcut></ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Item>Developer Tools</ContextMenu.Item>
      </ContextMenu.SubContent>
    </ContextMenu.Sub>
    <ContextMenu.Separator />
    <ContextMenu.CheckboxItem bind:checked={showBookmarks}>Show Bookmarks</ContextMenu.CheckboxItem>
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

### State Management

Use reactive state variables with `$state()` for checkbox and radio items:

```svelte
<script lang="ts">
  let showBookmarks = $state(false);
  let value = $state("pedro");
</script>
```

### Documentation

Full API reference available at bits-ui documentation for context-menu component.