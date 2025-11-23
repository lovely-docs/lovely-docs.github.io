## Item Component

A flex container component for displaying content with optional title, description, media, and actions. Use when displaying content-only layouts; use Field component instead for form inputs.

### Installation

```bash
npx shadcn-svelte@latest add item -y -o
```

The `-y` flag skips the confirmation prompt and `-o` overwrites existing files.

### Basic Usage

```svelte
<script lang="ts">
  import * as Item from "$lib/components/ui/item/index.js";
</script>

<Item.Root>
  <Item.Header>Item Header</Item.Header>
  <Item.Media />
  <Item.Content>
    <Item.Title>Item</Item.Title>
    <Item.Description>Item</Item.Description>
  </Item.Content>
  <Item.Actions />
  <Item.Footer>Item Footer</Item.Footer>
</Item.Root>
```

### Variants

Three variants available: default (subtle background and borders), `outline` (clear borders, transparent background), and `muted` (subdued appearance for secondary content).

```svelte
<Item.Root variant="outline">
  <Item.Content>
    <Item.Title>Outline Variant</Item.Title>
    <Item.Description>Outlined style with clear borders.</Item.Description>
  </Item.Content>
  <Item.Actions>
    <Button variant="outline" size="sm">Open</Button>
  </Item.Actions>
</Item.Root>
```

### Sizes

Default and `sm` (compact) sizes available.

```svelte
<Item.Root variant="outline" size="sm">
  {#snippet child({ props })}
    <a href="#/" {...props}>
      <Item.Media>
        <BadgeCheckIcon class="size-5" />
      </Item.Media>
      <Item.Content>
        <Item.Title>Your profile has been verified.</Item.Title>
      </Item.Content>
      <Item.Actions>
        <ChevronRightIcon class="size-4" />
      </Item.Actions>
    </a>
  {/snippet}
</Item.Root>
```

### Media Variants

**Icon**: Display icons in media slot with `variant="icon"`.

```svelte
<Item.Root variant="outline">
  <Item.Media variant="icon">
    <ShieldAlertIcon />
  </Item.Media>
  <Item.Content>
    <Item.Title>Security Alert</Item.Title>
    <Item.Description>New login detected from unknown device.</Item.Description>
  </Item.Content>
  <Item.Actions>
    <Button size="sm" variant="outline">Review</Button>
  </Item.Actions>
</Item.Root>
```

**Avatar**: Use Avatar component in media slot.

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

**Image**: Use `variant="image"` for image media.

```svelte
<Item.Root variant="outline">
  {#snippet child({ props })}
    <a href="#/" {...props}>
      <Item.Media variant="image">
        <img src="..." alt="..." class="size-8 rounded object-cover" />
      </Item.Media>
      <Item.Content>
        <Item.Title>Song Title</Item.Title>
        <Item.Description>Artist Name</Item.Description>
      </Item.Content>
    </a>
  {/snippet}
</Item.Root>
```

### Grouping Items

Use `Item.Group` to create a list of items. Add `Item.Separator` between items.

```svelte
<Item.Group>
  {#each people as person, index (person.username)}
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
      <Item.Actions>
        <Button variant="ghost" size="icon" class="rounded-full">
          <Plus />
        </Button>
      </Item.Actions>
    </Item.Root>
    {#if index !== people.length - 1}
      <Item.Separator />
    {/if}
  {/each}
</Item.Group>
```

### Header Section

Use `Item.Header` for full-width content like images at the top.

```svelte
<Item.Root variant="outline">
  <Item.Header>
    <img src="..." alt="..." class="aspect-square w-full rounded-sm object-cover" />
  </Item.Header>
  <Item.Content>
    <Item.Title>Model Name</Item.Title>
    <Item.Description>Model description</Item.Description>
  </Item.Content>
</Item.Root>
```

### Link Items

Use the `child` snippet to render items as links. Hover and focus states apply to the anchor element.

```svelte
<Item.Root>
  {#snippet child({ props })}
    <a href="#/" {...props}>
      <Item.Content>
        <Item.Title>Visit our documentation</Item.Title>
        <Item.Description>Learn how to get started.</Item.Description>
      </Item.Content>
      <Item.Actions>
        <ChevronRightIcon class="size-4" />
      </Item.Actions>
    </a>
  {/snippet}
</Item.Root>
```

### Dropdown Integration

Items work well inside dropdown menus.

```svelte
<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      <Button {...props} variant="outline" size="sm">
        Select <ChevronDown />
      </Button>
    {/snippet}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content class="w-72">
    {#each people as person (person.username)}
      <DropdownMenu.Item class="p-0">
        <Item.Root size="sm" class="w-full p-2">
          <Item.Media>
            <Avatar.Root class="size-8">
              <Avatar.Image src={person.avatar} />
              <Avatar.Fallback>{person.username.charAt(0)}</Avatar.Fallback>
            </Avatar.Root>
          </Item.Media>
          <Item.Content class="gap-0.5">
            <Item.Title>{person.username}</Item.Title>
            <Item.Description>{person.email}</Item.Description>
          </Item.Content>
        </Item.Root>
      </DropdownMenu.Item>
    {/each}
  </DropdownMenu.Content>
</DropdownMenu.Root>
```

### Component Structure

- `Item.Root`: Main container with `variant` and `size` props
- `Item.Header`: Full-width top section
- `Item.Media`: Left-side media container (icon, avatar, or image)
- `Item.Content`: Main content area with title and description
- `Item.Title`: Item title text
- `Item.Description`: Item description text
- `Item.Actions`: Right-side action buttons/icons
- `Item.Footer`: Full-width bottom section
- `Item.Group`: Container for multiple items
- `Item.Separator`: Visual divider between grouped items