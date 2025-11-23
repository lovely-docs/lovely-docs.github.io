## Sheet Component

Dialog-based component for displaying complementary content from screen edges.

### Installation

```bash
npx shadcn-svelte@latest add sheet -y -o
```

### Basic Usage

```svelte
<script lang="ts">
  import * as Sheet from "$lib/components/ui/sheet/index.js";
</script>

<Sheet.Root>
  <Sheet.Trigger>Open</Sheet.Trigger>
  <Sheet.Content side="right">
    <Sheet.Header>
      <Sheet.Title>Title</Sheet.Title>
      <Sheet.Description>Description</Sheet.Description>
    </Sheet.Header>
    <Sheet.Footer>
      <Sheet.Close>Close</Sheet.Close>
    </Sheet.Footer>
  </Sheet.Content>
</Sheet.Root>
```

### Key Features

- **Side property**: Control slide direction with `side="top|right|bottom|left"`
- **Sizing**: Use CSS classes on `Sheet.Content` to adjust dimensions (e.g., `class="w-[400px] sm:w-[540px]"`)
- **Components**: Root, Trigger, Content, Header, Title, Description, Footer, Close

Extends bits-ui Dialog component.