## Item Component

A flex container for displaying content with title, description, and actions. Can be grouped with `ItemGroup` to create lists.

### Installation

```bash
npx shadcn-svelte@latest add item -y -o
```

(-y: skip confirmation, -o: overwrite existing files)

### Basic Usage

```svelte
<script lang="ts">
  import * as Item from "$lib/components/ui/item/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
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

Three variants available: default (subtle background/borders), `outline` (clear borders, transparent background), `muted` (subdued appearance).

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

<Item.Root variant="muted">
  <Item.Content>
    <Item.Title>Muted Variant</Item.Title>
    <Item.Description>Subdued appearance for secondary content.</Item.Description>
  </Item.Content>
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

**Icon**: Display icons in media slot.

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

**Avatar**: Display single or multiple avatars.

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

**Image**: Display images in media slot.

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
      <Item.Content class="flex-none text-center">
        <Item.Description>3:45</Item.Description>
      </Item.Content>
    </a>
  {/snippet}
</Item.Root>
```

### Grouping

Use `Item.Group` to create lists of items with separators.

```svelte
<Item.Group>
  {#each people as person, index (person.username)}
    <Item.Root>
      <Item.Media>
        <Avatar.Root>
          <Avatar.Image src={person.avatar} class="grayscale" />
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

### Header

Use `Item.Header` for full-width content like images.

```svelte
<Item.Group class="grid grid-cols-3 gap-4">
  {#each models as model (model.name)}
    <Item.Root variant="outline">
      <Item.Header>
        <img src={model.image} alt={model.name} class="aspect-square w-full rounded-sm object-cover" />
      </Item.Header>
      <Item.Content>
        <Item.Title>{model.name}</Item.Title>
        <Item.Description>{model.description}</Item.Description>
      </Item.Content>
    </Item.Root>
  {/each}
</Item.Group>
```

### Links

Use the `child` snippet to render as a link. Hover and focus states apply to the anchor element.

```svelte
<Item.Root>
  {#snippet child({ props })}
    <a href="#/" {...props}>
      <Item.Content>
        <Item.Title>Visit our documentation</Item.Title>
        <Item.Description>Learn how to get started with our components.</Item.Description>
      </Item.Content>
      <Item.Actions>
        <ChevronRightIcon class="size-4" />
      </Item.Actions>
    </a>
  {/snippet}
</Item.Root>

<Item.Root variant="outline">
  {#snippet child({ props })}
    <a href="#/" target="_blank" rel="noopener noreferrer" {...props}>
      <Item.Content>
        <Item.Title>External resource</Item.Title>
        <Item.Description>Opens in a new tab with security attributes.</Item.Description>
      </Item.Content>
      <Item.Actions>
        <ExternalLinkIcon class="size-4" />
      </Item.Actions>
    </a>
  {/snippet}
</Item.Root>
```

### Dropdown Integration

Use Item within dropdown menus for styled list items.

```svelte
<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      <Button {...props} variant="outline" size="sm" class="w-fit">
        Select <ChevronDown />
      </Button>
    {/snippet}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content class="w-72 [--radius:0.65rem]" align="end">
    {#each people as person (person.username)}
      <DropdownMenu.Item class="p-0">
        <Item.Root size="sm" class="w-full p-2">
          <Item.Media>
            <Avatar.Root class="size-8">
              <Avatar.Image src={person.avatar} class="grayscale" />
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

### Item vs Field

Use Field for form inputs (checkbox, input, radio, select). Use Item for displaying content (title, description, actions).