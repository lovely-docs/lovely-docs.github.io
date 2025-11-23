## Accordion

Vertically stacked interactive headings that reveal content sections.

### Installation

```bash
npx shadcn-svelte@latest add accordion -y -o
```

### Usage

```svelte
<script lang="ts">
  import * as Accordion from "$lib/components/ui/accordion/index.js";
</script>

<Accordion.Root type="single">
  <Accordion.Item value="item-1">
    <Accordion.Trigger>Is it accessible?</Accordion.Trigger>
    <Accordion.Content>
      Yes. It adheres to the WAI-ARIA design pattern.
    </Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
```

**Components**: `Accordion.Root` (type: "single"/"multiple"), `Accordion.Item` (value), `Accordion.Trigger`, `Accordion.Content`