## Item Component

A flex container component for displaying content with optional title, description, media, and actions. Use `Item.Root` as the wrapper, with sub-components: `Item.Header`, `Item.Media`, `Item.Content`, `Item.Title`, `Item.Description`, `Item.Actions`, `Item.Footer`, and `Item.Group` for grouping multiple items.

### Installation
```bash
pnpm dlx shadcn-svelte@latest add item
```

### Basic Usage
```svelte
<script lang="ts">
  import * as Item from "$lib/components/ui/item/index.js";
</script>
<Item.Root>
  <Item.Content>
    <Item.Title>Title</Item.Title>
    <Item.Description>Description</Item.Description>
  </Item.Content>
  <Item.Actions>
    <button>Action</button>
  </Item.Actions>
</Item.Root>
```

### Variants
- `default`: Standard styling with subtle background and borders
- `outline`: Outlined style with clear borders and transparent background
- `muted`: Subdued appearance with muted colors

### Sizes
- `default`: Standard size
- `sm`: Compact size

### Media Variants
- `default`: Standard media container
- `icon`: For displaying icons
- `image`: For displaying images

### Examples

**With Avatar:**
```svelte
<Item.Root variant="outline">
  <Item.Media>
    <Avatar.Root class="size-10">
      <Avatar.Image src="https://github.com/evilrabbit.png" />
      <Avatar.Fallback>ER</Avatar.Fallback>
    </Avatar.Root>
  </Item.Media>
  <Item.Content>
    <Item.Title>Evil Rabbit</Item.Title>
    <Item.Description>Last seen 5 months ago</Item.Description>
  </Item.Content>
  <Item.Actions>
    <Button size="icon" variant="outline" class="rounded-full">
      <Plus />
    </Button>
  </Item.Actions>
</Item.Root>
```

**As Link:**
```svelte
<Item.Root>
  {#snippet child({ props })}
    <a href="/" {...props}>
      <Item.Content>
        <Item.Title>Visit documentation</Item.Title>
      </Item.Content>
      <Item.Actions>
        <ChevronRightIcon class="size-4" />
      </Item.Actions>
    </a>
  {/snippet}
</Item.Root>
```

**Grouped Items:**
```svelte
<Item.Group>
  {#each people as person}
    <Item.Root>
      <Item.Media>
        <Avatar.Root>
          <Avatar.Image src={person.avatar} />
          <Avatar.Fallback>{person.username.charAt(0)}</Avatar.Fallback>
        </Avatar.Root>
      </Item.Media>
      <Item.Content class="gap-1">
        <Item.Title>{person.username}</Item.Title>
        <Item.Description>{person.email}</Item.Description>
      </Item.Content>
    </Item.Root>
    {#if index !== people.length - 1}
      <Item.Separator />
    {/if}
  {/each}
</Item.Group>
```

### Item vs Field
Use `Field` for form inputs (checkbox, input, radio, select). Use `Item` for displaying content only.