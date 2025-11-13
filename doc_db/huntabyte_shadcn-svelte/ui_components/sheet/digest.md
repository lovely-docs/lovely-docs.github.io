## Sheet Component

A dialog-based component that displays complementary content sliding in from screen edges.

### Installation
```bash
pnpm dlx shadcn-svelte@latest add sheet
```

### Basic Usage
```svelte
<script lang="ts">
  import * as Sheet from "$lib/components/ui/sheet/index.js";
</script>
<Sheet.Root>
  <Sheet.Trigger>Open</Sheet.Trigger>
  <Sheet.Content>
    <Sheet.Header>
      <Sheet.Title>Title</Sheet.Title>
      <Sheet.Description>Description text</Sheet.Description>
    </Sheet.Header>
  </Sheet.Content>
</Sheet.Root>
```

### Positioning
Use the `side` prop on `<Sheet.Content />` to control where the sheet slides from: `top`, `right`, `bottom`, or `left`.

### Sizing
Adjust sheet dimensions with CSS classes on `<Sheet.Content />`:
```svelte
<Sheet.Content class="w-[400px] sm:w-[540px]">
```

### Components
- `Sheet.Root` - Container
- `Sheet.Trigger` - Opens the sheet
- `Sheet.Content` - Main content area with `side` prop
- `Sheet.Header` - Header section
- `Sheet.Title` - Title text
- `Sheet.Description` - Description text
- `Sheet.Footer` - Footer section
- `Sheet.Close` - Closes the sheet

Extends the Dialog component from bits-ui.