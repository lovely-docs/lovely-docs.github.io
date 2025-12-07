## Popover

Displays rich content in a portal triggered by a button.

### Installation

```bash
npx shadcn-svelte@latest add popover -y -o
```

### Usage

```svelte
<script lang="ts">
  import * as Popover from "$lib/components/ui/popover/index.js";
</script>

<Popover.Root>
  <Popover.Trigger>Open</Popover.Trigger>
  <Popover.Content>Content here</Popover.Content>
</Popover.Root>
```

Wrap trigger and content in `Popover.Root`. Apply custom classes to `Popover.Trigger` and `Popover.Content` as needed.