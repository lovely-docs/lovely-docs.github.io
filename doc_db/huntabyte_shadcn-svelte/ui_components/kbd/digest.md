## Kbd Component

Displays textual user input from keyboard.

### Installation

```bash
npx shadcn-svelte@latest add kbd -y -o
```

Use `-y` to skip confirmation prompt and `-o` to overwrite existing files.

### Basic Usage

```svelte
<script lang="ts">
  import * as Kbd from "$lib/components/ui/kbd/index.js";
</script>
<Kbd.Root>B</Kbd.Root>
```

### Components

- `Kbd.Root`: Individual keyboard key display
- `Kbd.Group`: Groups multiple keyboard keys together

### Examples

**Group keys together:**
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
  Accept <Kbd.Root></Kbd.Root>
</Button>
<Button variant="outline" size="sm" class="pr-2">
  Cancel <Kbd.Root>Esc</Kbd.Root>
</Button>
```

**Inside Tooltip:**
```svelte
<Tooltip.Root>
  <Tooltip.Trigger>
    {#snippet child({ props })}
      <Button size="sm" variant="outline" {...props}>Save</Button>
    {/snippet}
  </Tooltip.Trigger>
  <Tooltip.Content>
    <div class="flex items-center gap-2">
      Save Changes <Kbd.Root>S</Kbd.Root>
    </div>
  </Tooltip.Content>
</Tooltip.Root>
<Tooltip.Root>
  <Tooltip.Trigger>
    {#snippet child({ props })}
      <Button size="sm" variant="outline" {...props}>Print</Button>
    {/snippet}
  </Tooltip.Trigger>
  <Tooltip.Content>
    <div class="flex items-center gap-2">
      Print Document
      <Kbd.Group>
        <Kbd.Root>Ctrl</Kbd.Root>
        <Kbd.Root>P</Kbd.Root>
      </Kbd.Group>
    </div>
  </Tooltip.Content>
</Tooltip.Root>
```

**Inside InputGroup:**
```svelte
<InputGroup.Root>
  <InputGroup.Input placeholder="Search..." />
  <InputGroup.Addon>
    <SearchIcon />
  </InputGroup.Addon>
  <InputGroup.Addon align="inline-end">
    <Kbd.Root></Kbd.Root>
    <Kbd.Root>K</Kbd.Root>
  </InputGroup.Addon>
</InputGroup.Root>
```