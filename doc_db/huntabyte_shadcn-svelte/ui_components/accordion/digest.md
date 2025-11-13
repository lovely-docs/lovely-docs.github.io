## Accordion Component

A vertically stacked set of interactive headings that each reveal a section of content.

### Installation

```bash
pnpm dlx shadcn-svelte@latest add accordion
```

### Usage

```svelte
<script lang="ts">
  import * as Accordion from "$lib/components/ui/accordion/index.js";
</script>

<Accordion.Root type="single" class="w-full">
  <Accordion.Item value="item-1">
    <Accordion.Trigger>Is it accessible?</Accordion.Trigger>
    <Accordion.Content>
      Yes. It adheres to the WAI-ARIA design pattern.
    </Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-2">
    <Accordion.Trigger>Another item</Accordion.Trigger>
    <Accordion.Content>
      Content for the second item.
    </Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
```

### Key Props

- `Accordion.Root`: `type="single"` for single expansion, `class` for styling, `value` for initial open item
- `Accordion.Item`: `value` to identify the item
- `Accordion.Trigger`: The clickable heading
- `Accordion.Content`: The revealed content section