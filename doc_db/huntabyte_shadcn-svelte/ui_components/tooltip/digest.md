## Tooltip Component

A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.

### Installation

```bash
npx shadcn-svelte@latest add tooltip -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

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

The component structure consists of:
- `Tooltip.Provider`: Wraps the tooltip context
- `Tooltip.Root`: The root container for the tooltip
- `Tooltip.Trigger`: The element that triggers the tooltip on hover or focus
- `Tooltip.Content`: The popup content displayed when triggered

The trigger element can accept styling through class bindings, such as button variants.