## Installation
```bash
npm install bits-ui
```

## Basic Usage
Import and use components in Svelte files:
```svelte
<script lang="ts">
  import { Accordion } from "bits-ui";
</script>
<Accordion.Root type="single">
  <Accordion.Item value="item-1">
    <Accordion.Header>
      <Accordion.Trigger>Item 1 Title</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content>Content here</Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
```

## Styling
Bits UI components are headless with minimal styling. Use `class` and `style` props to apply styles.

**With TailwindCSS/UnoCSS:**
```svelte
<Accordion.Root class="mx-auto w-full max-w-md">
  <Accordion.Item class="mb-2 rounded-md border border-gray-200">
    <Accordion.Header class="bg-gray-50 transition-colors hover:bg-gray-100">
      <Accordion.Trigger class="flex w-full items-center justify-between p-4">
        Styled Accordion
      </Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content class="p-4 text-gray-700">Content</Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
```

**With Data Attributes:**
Check component API reference for data attributes, then use in global CSS:
```css
[data-button-root] {
  height: 3rem;
  width: 100%;
  background-color: #3182ce;
  color: white;
  border-radius: 0.375rem;
  padding: 0.5rem 1rem;
  font-weight: 500;
}
```

## TypeScript Support
Full type checking and autocompletion available:
```svelte
<script lang="ts">
  import { Accordion } from "bits-ui";
  const accordionMultipleProps: Accordion.RootProps = {
    type: "multiple",
    value: ["item-1"],
  };
  const accordionSingleProps: Accordion.RootProps = {
    type: "single",
    value: "item-1",
  };
</script>
```