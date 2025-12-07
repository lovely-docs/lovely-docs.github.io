## Command

Fast, composable, unstyled command menu component for Svelte.

### Installation

```bash
npx shadcn-svelte@latest add command -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

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
      <Command.Item disabled>Calculator</Command.Item>
    </Command.Group>
    <Command.Separator />
    <Command.Group heading="Settings">
      <Command.Item>
        <span>Profile</span>
        <Command.Shortcut>P</Command.Shortcut>
      </Command.Item>
      <Command.Item>
        <span>Billing</span>
        <Command.Shortcut>B</Command.Shortcut>
      </Command.Item>
      <Command.Item>
        <span>Settings</span>
        <Command.Shortcut>S</Command.Shortcut>
      </Command.Item>
    </Command.Group>
  </Command.List>
</Command.Root>
```

### Components

- `<Command.Root>` - Container for the command menu
- `<Command.Input>` - Search/input field
- `<Command.List>` - Container for command items
- `<Command.Empty>` - Message shown when no results match
- `<Command.Group>` - Groups items with an optional heading
- `<Command.Item>` - Individual command item (supports `disabled` prop)
- `<Command.Separator>` - Visual separator between groups
- `<Command.Shortcut>` - Displays keyboard shortcut hint
- `<Command.Dialog>` - Dialog variant that wraps Command.Root with Dialog.Root

### Dialog Example

Use `<Command.Dialog>` to display the command menu in a modal dialog. It accepts props for both Dialog and Command components.

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
    <Command.Group heading="Settings">
      <Command.Item>Profile</Command.Item>
      <Command.Item>Billing</Command.Item>
      <Command.Item>Settings</Command.Item>
    </Command.Group>
  </Command.List>
</Command.Dialog>
```

### Styling

- Icons inside `<Command.Item>` are automatically styled with `gap-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0` classes
- Component is unstyled by default; apply custom classes to `<Command.Root>` (e.g., `rounded-lg border shadow-md`)
- Use Lucide Svelte icons for consistent iconography