## Navigation Menu

A collection of links for navigating websites using Bits UI and Tailwind CSS.

### Installation

```bash
npx shadcn-svelte@latest add navigation-menu -y -o
```

### Basic Usage

```svelte
<script lang="ts">
  import * as NavigationMenu from "$lib/components/ui/navigation-menu/index.js";
</script>

<NavigationMenu.Root>
  <NavigationMenu.List>
    <NavigationMenu.Item>
      <NavigationMenu.Trigger>Item One</NavigationMenu.Trigger>
      <NavigationMenu.Content>
        <NavigationMenu.Link>Link</NavigationMenu.Link>
      </NavigationMenu.Content>
    </NavigationMenu.Item>
  </NavigationMenu.List>
</NavigationMenu.Root>
```

### Key Components

- `NavigationMenu.Root` - Container (supports `viewport={false}`)
- `NavigationMenu.List` - Menu items wrapper
- `NavigationMenu.Item` - Individual item
- `NavigationMenu.Trigger` - Opens dropdown content
- `NavigationMenu.Content` - Dropdown container
- `NavigationMenu.Link` - Link with snippet-based children

### Examples

**Grid with descriptions:**
```svelte
<NavigationMenu.Content>
  <ul class="grid w-[400px] gap-2 p-2 md:grid-cols-2">
    <li>
      <NavigationMenu.Link>
        {#snippet child()}
          <a href="/docs" class="block p-3 rounded-md hover:bg-accent">
            <div class="font-medium">Title</div>
            <p class="text-muted-foreground text-sm">Description</p>
          </a>
        {/snippet}
      </NavigationMenu.Link>
    </li>
  </ul>
</NavigationMenu.Content>
```

**With icons:**
```svelte
<NavigationMenu.Link href="##" class="flex-row items-center gap-2">
  <IconComponent />
  Label
</NavigationMenu.Link>
```

Use `navigationMenuTriggerStyle()` utility for consistent trigger styling and `cn()` to combine classes.