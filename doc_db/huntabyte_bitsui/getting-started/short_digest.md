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
      <Accordion.Trigger>Item 1 Title</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content>Content here</Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
```

## Styling
Headless components with `class` and `style` props. Use TailwindCSS/UnoCSS classes directly or target data attributes in global CSS:
```css
[data-button-root] {
  background-color: #3182ce;
  color: white;
  padding: 0.5rem 1rem;
}
```

## TypeScript Support
Full type definitions with autocompletion for component props.