## Command Component

Fast, composable, unstyled command menu for Svelte. Built on Bits UI.

### Installation

```bash
npx shadcn-svelte@latest add command -y -o
```

The `-y` flag skips the confirmation prompt and `-o` overwrites existing files.

### Basic Usage

Import and use the Command component with its subcomponents:

```svelte
<script lang="ts">
  import * as Command from "$lib/components/ui/command/index.js";
</script>

<Command.Root>
  <Command.Input placeholder="Type a command or search..." />
  <Command.List>
    <Command.Empty>No results found.</Command.Empty>
    <Command.Group heading="Suggestions">
      <Command.Item>Calendar</Command.Item>
      <Command.Item>Search Emoji</Command.Item>
      <Command.Item>Calculator</Command.Item>
    </Command.Group>
    <Command.Separator />
    <Command.Group heading="Settings">
      <Command.Item>Profile</Command.Item>
      <Command.Item>Billing</Command.Item>
      <Command.Item>Settings</Command.Item>
    </Command.Group>
  </Command.List>
</Command.Root>
```

### Component Structure

- `<Command.Root>` - Container component, accepts styling classes
- `<Command.Input>` - Search/filter input field
- `<Command.List>` - Scrollable list container
- `<Command.Empty>` - Message shown when no results match
- `<Command.Group>` - Groups items with an optional heading
- `<Command.Item>` - Individual command item (can be disabled)
- `<Command.Separator>` - Visual divider between groups
- `<Command.Shortcut>` - Display keyboard shortcut hint within an item

### Dialog Example

Use `<Command.Dialog>` to display the command menu in a modal dialog:

```svelte
<script lang="ts">
  import * as Command from "$lib/components/ui/command/index.js";
  
  let open = $state(false);
  
  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      open = !open;
    }
  }
</script>

<svelte:document onkeydown={handleKeydown} />

<Command.Dialog bind:open>
  <Command.Input placeholder="Type a command or search..." />
  <Command.List>
    <Command.Empty>No results found.</Command.Empty>
    <Command.Group heading="Suggestions">
      <Command.Item>Calendar</Command.Item>
      <Command.Item>Search Emoji</Command.Item>
      <Command.Item>Calculator</Command.Item>
    </Command.Group>
  </Command.List>
</Command.Dialog>
```

`<Command.Dialog>` accepts props for both Dialog.Root and Command.Root components. Bind the `open` state to control visibility.

### Icon Styling

As of 2024-10-30, `<Command.Item>` automatically applies icon styling: `gap-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0`. Icons placed inside items are automatically sized and spaced correctly.

### API Reference

Full API documentation available in Bits UI docs for the Command component.