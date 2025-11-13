## Popover Component

Displays rich content in a portal triggered by a button.

### Installation

```bash
pnpm dlx shadcn-svelte@latest add popover
```

### Usage

```svelte
<script lang="ts">
  import * as Popover from "$lib/components/ui/popover/index.js";
</script>

<Popover.Root>
  <Popover.Trigger>Open</Popover.Trigger>
  <Popover.Content>Place content for the popover here.</Popover.Content>
</Popover.Root>
```