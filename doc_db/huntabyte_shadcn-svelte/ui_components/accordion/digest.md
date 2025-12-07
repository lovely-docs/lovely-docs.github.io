## Accordion

A vertically stacked set of interactive headings that each reveal a section of content.

### Installation

```bash
npx shadcn-svelte@latest add accordion -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Usage

```svelte
<script lang="ts">
  import * as Accordion from "$lib/components/ui/accordion/index.js";
</script>

<!-- Single type (only one item open at a time) -->
<Accordion.Root type="single" class="w-full sm:max-w-[70%]" value="item-1">
  <Accordion.Item value="item-1">
    <Accordion.Trigger>Is it accessible?</Accordion.Trigger>
    <Accordion.Content>
      Yes. It adheres to the WAI-ARIA design pattern.
    </Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-2">
    <Accordion.Trigger>Product Information</Accordion.Trigger>
    <Accordion.Content class="flex flex-col gap-4 text-balance">
      <p>Our flagship product combines cutting-edge technology with sleek design.</p>
      <p>Key features include advanced processing capabilities and an intuitive user interface.</p>
    </Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
```

**Key props:**
- `Accordion.Root`: `type="single"` (only one item open) or `type="multiple"` (multiple items can be open), `value` (initial open item), `class` (styling)
- `Accordion.Item`: `value` (unique identifier)
- `Accordion.Trigger`: clickable heading
- `Accordion.Content`: revealed content section

Adheres to WAI-ARIA design patterns for accessibility.