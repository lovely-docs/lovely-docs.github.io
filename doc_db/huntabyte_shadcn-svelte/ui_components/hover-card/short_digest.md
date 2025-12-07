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
  <HoverCard.Trigger href="...">Link text</HoverCard.Trigger>
  <HoverCard.Content class="w-80">
    Preview content with avatar, text, metadata, etc.
  </HoverCard.Content>
</HoverCard.Root>
```

Components: `Root`, `Trigger` (accepts href, target, rel), `Content`.