## Item Component

Flex container for displaying content with title, description, media, and actions. Use for content-only layouts (use Field for form inputs).

### Installation

```bash
npx shadcn-svelte@latest add item -y -o
```

### Basic Structure

```svelte
<Item.Root>
  <Item.Header />
  <Item.Media />
  <Item.Content>
    <Item.Title>Title</Item.Title>
    <Item.Description>Description</Item.Description>
  </Item.Content>
  <Item.Actions />
  <Item.Footer />
</Item.Root>
```

### Variants & Sizes

- **Variants**: `default`, `outline`, `muted`
- **Sizes**: default, `sm`

### Media Types

- **Icon**: `<Item.Media variant="icon"><IconComponent /></Item.Media>`
- **Avatar**: `<Item.Media><Avatar.Root>...</Avatar.Root></Item.Media>`
- **Image**: `<Item.Media variant="image"><img /></Item.Media>`

### Grouping

```svelte
<Item.Group>
  <Item.Root>...</Item.Root>
  <Item.Separator />
  <Item.Root>...</Item.Root>
</Item.Group>
```

### Link Items

Use `child` snippet to render as link with proper hover/focus states:

```svelte
<Item.Root>
  {#snippet child({ props })}
    <a href="#/" {...props}>
      <Item.Content>...</Item.Content>
      <Item.Actions>...</Item.Actions>
    </a>
  {/snippet}
</Item.Root>
```

### Dropdown Integration

Items work inside dropdown menus by wrapping in `DropdownMenu.Item` with `p-0` class.