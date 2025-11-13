## Kbd Component

Display textual user input from keyboard using `Kbd.Root` and `Kbd.Group` components.

### Installation
```bash
pnpm dlx shadcn-svelte@latest add kbd
```

### Basic Usage
```svelte
<script lang="ts">
  import * as Kbd from "$lib/components/ui/kbd/index.js";
</script>
<Kbd.Root>B</Kbd.Root>
```

### Examples

**Group multiple keys:**
```svelte
<Kbd.Group>
  <Kbd.Root>Ctrl</Kbd.Root>
  <span>+</span>
  <Kbd.Root>B</Kbd.Root>
</Kbd.Group>
```

**Inside Button:**
```svelte
<Button variant="outline" size="sm" class="pr-2">
  Accept <Kbd.Root>Esc</Kbd.Root>
</Button>
```

**Inside Tooltip:**
```svelte
<Tooltip.Content>
  <div class="flex items-center gap-2">
    Save Changes <Kbd.Root>S</Kbd.Root>
  </div>
</Tooltip.Content>
```

**Inside InputGroup:**
```svelte
<InputGroup.Addon align="inline-end">
  <Kbd.Root>Ctrl</Kbd.Root>
  <Kbd.Root>K</Kbd.Root>
</InputGroup.Addon>
```