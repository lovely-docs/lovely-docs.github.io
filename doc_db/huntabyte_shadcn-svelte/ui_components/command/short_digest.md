## Command Component

Fast, composable command menu for Svelte.

### Installation

```bash
npx shadcn-svelte@latest add command -y -o
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
    </Command.Group>
  </Command.List>
</Command.Root>
```

### Dialog Mode

```svelte
<script lang="ts">
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
    </Command.Group>
  </Command.List>
</Command.Dialog>
```

### Components

- `Root` - Container
- `Input` - Search field
- `List` - Scrollable list
- `Empty` - No results message
- `Group` - Item grouping with heading
- `Item` - Command item (supports disabled state)
- `Separator` - Visual divider
- `Shortcut` - Keyboard shortcut display

Icons in items are auto-styled (size-4, gap-2, pointer-events-none).