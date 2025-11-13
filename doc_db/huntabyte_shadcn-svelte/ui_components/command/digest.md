## Command Component

Fast, composable, unstyled command menu for Svelte. Built on Bits UI.

### Installation

```bash
npm install shadcn-svelte@latest add command
```

### Basic Usage

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
    </Command.Group>
    <Command.Separator />
    <Command.Group heading="Settings">
      <Command.Item>Profile</Command.Item>
      <Command.Item>Settings</Command.Item>
    </Command.Group>
  </Command.List>
</Command.Root>
```

### Dialog Example

Use `<Command.Dialog />` instead of `<Command.Root />` to display the command menu in a modal dialog. Bind the `open` prop to control visibility:

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
    </Command.Group>
  </Command.List>
</Command.Dialog>
```

### Components

- `Command.Root` - Container for the command menu
- `Command.Dialog` - Dialog variant that accepts props for both Dialog and Command
- `Command.Input` - Search/command input field
- `Command.List` - Container for command items
- `Command.Empty` - Shown when no results match
- `Command.Group` - Groups related items with optional heading
- `Command.Item` - Individual command item (automatically styles nested icons with `gap-2`, `size-4`, `shrink-0`)
- `Command.Separator` - Visual separator between groups
- `Command.Shortcut` - Display keyboard shortcut hint