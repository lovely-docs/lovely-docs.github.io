## Card Component

Composable card with `Card.Root`, `Card.Header`, `Card.Title`, `Card.Description`, `Card.Action`, `Card.Content`, and `Card.Footer` sections.

```svelte
<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
</script>

<Card.Root>
  <Card.Header>
    <Card.Title>Title</Card.Title>
    <Card.Description>Description</Card.Description>
    <Card.Action><Button>Action</Button></Card.Action>
  </Card.Header>
  <Card.Content>Content</Card.Content>
  <Card.Footer>Footer</Card.Footer>
</Card.Root>
```