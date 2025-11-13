## Command Component

Fast, composable command menu for Svelte.

### Installation
```bash
npm install shadcn-svelte@latest add command
```

### Basic Usage
```svelte
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

### Dialog with Keyboard Shortcut
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
`Command.Root`, `Command.Dialog`, `Command.Input`, `Command.List`, `Command.Empty`, `Command.Group`, `Command.Item`, `Command.Separator`, `Command.Shortcut`