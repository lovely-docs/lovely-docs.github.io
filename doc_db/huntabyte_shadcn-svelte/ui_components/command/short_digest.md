## Command

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
      <Command.Item disabled>Calculator</Command.Item>
    </Command.Group>
    <Command.Separator />
    <Command.Group heading="Settings">
      <Command.Item>
        Profile
        <Command.Shortcut>P</Command.Shortcut>
      </Command.Item>
    </Command.Group>
  </Command.List>
</Command.Root>
```

### Dialog Variant

Use `<Command.Dialog bind:open>` to show command menu in a modal. Bind `open` state and toggle with keyboard shortcut (e.g., Cmd+K):

```svelte
<script>
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
  <!-- items -->
</Command.Dialog>
```

### Components

Root, Input, List, Empty, Group (with heading), Item (supports disabled), Separator, Shortcut, Dialog. Icons in items auto-styled.