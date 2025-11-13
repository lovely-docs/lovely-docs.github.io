## Tooltip Component

A popup that displays information when an element receives keyboard focus or mouse hover.

### Installation

```bash
pnpm dlx shadcn-svelte@latest add tooltip
```

### Usage

```svelte
<script lang="ts">
  import * as Tooltip from "$lib/components/ui/tooltip/index.js";
</script>

<Tooltip.Provider>
  <Tooltip.Root>
    <Tooltip.Trigger>Hover</Tooltip.Trigger>
    <Tooltip.Content>
      <p>Add to library</p>
    </Tooltip.Content>
  </Tooltip.Root>
</Tooltip.Provider>
```

The component requires wrapping in `Tooltip.Provider` and consists of `Tooltip.Root` containing a `Tooltip.Trigger` element and `Tooltip.Content` that displays on interaction. The trigger can accept styling via class attributes like `buttonVariants()`.

See Bits UI documentation for full API reference.