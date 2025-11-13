## Installation
```bash
npm install bits-ui
```

## Basic Usage
```svelte
<script lang="ts">
  import { Accordion } from "bits-ui";
</script>
<Accordion.Root type="single">
  <Accordion.Item value="item-1">
    <Accordion.Header>
      <Accordion.Trigger>Item 1</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content>Content</Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
```

## Styling
Headless components with `class` and `style` props. Use TailwindCSS classes directly or target data attributes in CSS:
```css
[data-button-root] {
  background-color: #3182ce;
  color: white;
}
```

## TypeScript Support
Full type checking and autocompletion included.