## Item Component

Flex container for displaying content with title, description, media, and actions.

**Installation:** `pnpm dlx shadcn-svelte@latest add item`

**Variants:** `default`, `outline`, `muted`  
**Sizes:** `default`, `sm`

**Basic:**
```svelte
<Item.Root>
  <Item.Content>
    <Item.Title>Title</Item.Title>
    <Item.Description>Description</Item.Description>
  </Item.Content>
  <Item.Actions><button>Action</button></Item.Actions>
</Item.Root>
```

**As Link:**
```svelte
<Item.Root>
  {#snippet child({ props })}
    <a href="/" {...props}>
      <Item.Content><Item.Title>Link</Item.Title></Item.Content>
    </a>
  {/snippet}
</Item.Root>
```

**Grouped:**
```svelte
<Item.Group>
  {#each items as item}
    <Item.Root>...</Item.Root>
    <Item.Separator />
  {/each}
</Item.Group>
```

Use `Field` for form inputs, `Item` for content display.