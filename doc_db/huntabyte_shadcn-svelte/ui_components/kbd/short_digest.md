## Kbd Component

Displays keyboard input visually.

### Installation

```bash
npx shadcn-svelte@latest add kbd -y -o
```

### Usage

```svelte
<script lang="ts">
  import * as Kbd from "$lib/components/ui/kbd/index.js";
</script>
<Kbd.Root>B</Kbd.Root>
<Kbd.Group>
  <Kbd.Root>Ctrl</Kbd.Root>
  <span>+</span>
  <Kbd.Root>B</Kbd.Root>
</Kbd.Group>
```

### Examples

- **Button**: `<Button><Kbd.Root>Esc</Kbd.Root></Button>`
- **Tooltip**: Wrap `Kbd.Root` in `Tooltip.Content`
- **InputGroup**: Place `Kbd.Root` in `InputGroup.Addon`