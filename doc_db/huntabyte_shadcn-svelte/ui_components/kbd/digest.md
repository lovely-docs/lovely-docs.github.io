## Kbd Component

Displays textual user input from keyboard.

### Installation

```bash
npx shadcn-svelte@latest add kbd -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Usage

```svelte
<script lang="ts">
  import * as Kbd from "$lib/components/ui/kbd/index.js";
</script>
<Kbd.Root>B</Kbd.Root>
```

### Examples

**Group**: Use `Kbd.Group` to group multiple keyboard keys together:
```svelte
<Kbd.Group>
  <Kbd.Root>Ctrl</Kbd.Root>
  <span>+</span>
  <Kbd.Root>B</Kbd.Root>
</Kbd.Group>
```

**Button**: Embed `Kbd.Root` inside a `Button` component:
```svelte
<Button variant="outline" size="sm" class="pr-2">
  Accept <Kbd.Root>Enter</Kbd.Root>
</Button>
```

**Tooltip**: Use `Kbd.Root` inside `Tooltip.Content`:
```svelte
<Tooltip.Content>
  <div class="flex items-center gap-2">
    Save Changes <Kbd.Root>S</Kbd.Root>
  </div>
</Tooltip.Content>
```

**Input Group**: Use `Kbd.Root` inside `InputGroup.Addon`:
```svelte
<InputGroup.Root>
  <InputGroup.Input placeholder="Search..." />
  <InputGroup.Addon align="inline-end">
    <Kbd.Root>Ctrl</Kbd.Root>
    <Kbd.Root>K</Kbd.Root>
  </InputGroup.Addon>
</InputGroup.Root>
```