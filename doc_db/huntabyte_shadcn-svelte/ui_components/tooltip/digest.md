## Tooltip

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
  import { buttonVariants } from "../ui/button/index.js";
</script>

<Tooltip.Provider>
  <Tooltip.Root>
    <Tooltip.Trigger class={buttonVariants({ variant: "outline" })}>
      Hover
    </Tooltip.Trigger>
    <Tooltip.Content>
      <p>Add to library</p>
    </Tooltip.Content>
  </Tooltip.Root>
</Tooltip.Provider>
```

Wrap content in `Tooltip.Provider`, then use `Tooltip.Root` with `Tooltip.Trigger` (the element that activates the tooltip) and `Tooltip.Content` (the popup content). The trigger can accept any styling classes.