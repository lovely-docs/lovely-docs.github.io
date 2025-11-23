## Hover Card

Displays preview content on hover over a link.

### Installation

```bash
npx shadcn-svelte@latest add hover-card -y -o
```

### Usage

```svelte
<script lang="ts">
  import * as HoverCard from "$lib/components/ui/hover-card/index.js";
</script>

<HoverCard.Root>
  <HoverCard.Trigger>Hover</HoverCard.Trigger>
  <HoverCard.Content>Preview content</HoverCard.Content>
</HoverCard.Root>
```

### Structure

- `HoverCard.Root`: Container
- `HoverCard.Trigger`: Hover target (supports href, target, rel attributes)
- `HoverCard.Content`: Preview content shown on hover