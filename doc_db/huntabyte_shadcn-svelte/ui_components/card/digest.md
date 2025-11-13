## Card Component

A composable card component with header, content, and footer sections for displaying structured information.

### Installation

```bash
pnpm dlx shadcn-svelte@latest add card
```

### Usage

Import and compose card sections:

```svelte
<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
</script>

<Card.Root>
  <Card.Header>
    <Card.Title>Card Title</Card.Title>
    <Card.Description>Card Description</Card.Description>
  </Card.Header>
  <Card.Content>
    <p>Card Content</p>
  </Card.Content>
  <Card.Footer>
    <p>Card Footer</p>
  </Card.Footer>
</Card.Root>
```

### Available Components

- `Card.Root` - Container wrapper
- `Card.Header` - Header section
- `Card.Title` - Title text
- `Card.Description` - Description text
- `Card.Action` - Action area (typically for buttons)
- `Card.Content` - Main content area
- `Card.Footer` - Footer section

All components accept standard HTML class attributes for styling.