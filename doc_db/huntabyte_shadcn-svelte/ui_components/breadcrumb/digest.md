## Breadcrumb Component

Displays the path to the current resource using a hierarchy of links.

### Installation

```bash
npx shadcn-svelte@latest add breadcrumb -y -o
```

The `-y` flag skips the confirmation prompt and `-o` overwrites existing files.

### Basic Usage

```svelte
<script lang="ts">
  import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
</script>

<Breadcrumb.Root>
  <Breadcrumb.List>
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator />
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/components">Components</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator />
    <Breadcrumb.Item>
      <Breadcrumb.Page>Breadcrumb</Breadcrumb.Page>
    </Breadcrumb.Item>
  </Breadcrumb.List>
</Breadcrumb.Root>
```

### Component Structure

- `<Breadcrumb.Root>` - Root container
- `<Breadcrumb.List>` - List wrapper
- `<Breadcrumb.Item>` - Individual breadcrumb item
- `<Breadcrumb.Link>` - Clickable link with `href` prop
- `<Breadcrumb.Page>` - Current page (non-clickable)
- `<Breadcrumb.Separator>` - Separator between items (default: forward slash)
- `<Breadcrumb.Ellipsis>` - Collapsed state indicator

### Custom Separator

Pass a custom component to the `<Breadcrumb.Separator />` slot:

```svelte
<Breadcrumb.Separator>
  <SlashIcon />
</Breadcrumb.Separator>
```

### Dropdown Integration

Compose `<Breadcrumb.Item />` with `<DropdownMenu />` to create interactive breadcrumbs:

```svelte
<Breadcrumb.Item>
  <DropdownMenu.Root>
    <DropdownMenu.Trigger class="flex items-center gap-1">
      Components
      <ChevronDownIcon class="size-4" />
    </DropdownMenu.Trigger>
    <DropdownMenu.Content align="start">
      <DropdownMenu.Item>Documentation</DropdownMenu.Item>
      <DropdownMenu.Item>Themes</DropdownMenu.Item>
      <DropdownMenu.Item>GitHub</DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
</Breadcrumb.Item>
```

### Collapsed State

Use `<Breadcrumb.Ellipsis />` to show a collapsed state for long breadcrumbs:

```svelte
<Breadcrumb.Item>
  <Breadcrumb.Ellipsis />
</Breadcrumb.Item>
```

### Custom Link Component

Use the `asChild` prop on `<Breadcrumb.Link />` to integrate with routing libraries.

### Responsive Breadcrumb

Compose with `<DropdownMenu />` for desktop and `<Drawer />` for mobile using `MediaQuery`:

```svelte
<script lang="ts">
  import { MediaQuery } from "svelte/reactivity";
  import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
  import * as Drawer from "$lib/components/ui/drawer/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  
  const items = [
    { href: "#", label: "Home" },
    { href: "#", label: "Documentation" },
    { href: "#", label: "Building Your Application" },
    { href: "#", label: "Data Fetching" },
    { label: "Caching and Revalidating" }
  ];
  const ITEMS_TO_DISPLAY = 3;
  let open = $state(false);
  const isDesktop = new MediaQuery("(min-width: 768px)");
</script>

<Breadcrumb.Root>
  <Breadcrumb.List>
    <Breadcrumb.Item>
      <Breadcrumb.Link href={items[0].href}>
        {items[0].label}
      </Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator />
    {#if items.length > ITEMS_TO_DISPLAY}
      <Breadcrumb.Item>
        {#if isDesktop.current}
          <DropdownMenu.Root bind:open>
            <DropdownMenu.Trigger class="flex items-center gap-1">
              <Breadcrumb.Ellipsis class="size-4" />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="start">
              {#each items.slice(1, -2) as item, i (i)}
                <DropdownMenu.Item>
                  <a href={item.href ? item.href : "#"}>
                    {item.label}
                  </a>
                </DropdownMenu.Item>
              {/each}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        {:else}
          <Drawer.Root bind:open>
            <Drawer.Trigger>
              <Breadcrumb.Ellipsis class="size-4" />
            </Drawer.Trigger>
            <Drawer.Content>
              <Drawer.Header class="text-left">
                <Drawer.Title>Navigate to</Drawer.Title>
              </Drawer.Header>
              <div class="grid gap-1 px-4">
                {#each items.slice(1, -2) as item, i (i)}
                  <a href={item.href ? item.href : "#"} class="py-1 text-sm">
                    {item.label}
                  </a>
                {/each}
              </div>
            </Drawer.Content>
          </Drawer.Root>
        {/if}
      </Breadcrumb.Item>
      <Breadcrumb.Separator />
    {/if}
    {#each items.slice(-ITEMS_TO_DISPLAY + 1) as item (item.label)}
      <Breadcrumb.Item>
        {#if item.href}
          <Breadcrumb.Link href={item.href} class="max-w-20 truncate md:max-w-none">
            {item.label}
          </Breadcrumb.Link>
          <Breadcrumb.Separator />
        {:else}
          <Breadcrumb.Page class="max-w-20 truncate md:max-w-none">
            {item.label}
          </Breadcrumb.Page>
        {/if}
      </Breadcrumb.Item>
    {/each}
  </Breadcrumb.List>
</Breadcrumb.Root>
```