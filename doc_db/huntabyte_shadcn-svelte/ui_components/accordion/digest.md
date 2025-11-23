## Accordion

A vertically stacked set of interactive headings that each reveal a section of content.

### Installation

```bash
npx shadcn-svelte@latest add accordion -y -o
```

The `-y` flag skips the confirmation prompt and `-o` overwrites existing files.

### Usage

Import and use the accordion components:

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

### Key Components

- **Accordion.Root**: Container component with `type` prop (`"single"` or `"multiple"`)
- **Accordion.Item**: Individual accordion section with `value` prop
- **Accordion.Trigger**: Clickable heading that toggles content visibility
- **Accordion.Content**: Hidden content revealed when trigger is clicked

### Props

- `Accordion.Root` accepts `type` (single/multiple), `class`, and `value` (initial open item)
- `Accordion.Item` accepts `value` identifier
- `Accordion.Content` accepts `class` for styling

### Example with Multiple Items

```svelte
<Accordion.Root type="single" class="w-full sm:max-w-[70%]" value="item-1">
  <Accordion.Item value="item-1">
    <Accordion.Trigger>Product Information</Accordion.Trigger>
    <Accordion.Content class="flex flex-col gap-4 text-balance">
      <p>Product details here</p>
    </Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-2">
    <Accordion.Trigger>Shipping Details</Accordion.Trigger>
    <Accordion.Content class="flex flex-col gap-4 text-balance">
      <p>Shipping information here</p>
    </Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
```

The component is built on Bits UI and follows WAI-ARIA design patterns for accessibility.