## Navigation Menu Component

A collection of links for navigating websites, built on Bits UI.

### Installation

```bash
pnpm dlx shadcn-svelte@latest add navigation-menu
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

- `NavigationMenu.Root` - Container with optional `viewport={false}` prop
- `NavigationMenu.List` - Wrapper for menu items
- `NavigationMenu.Item` - Individual menu item
- `NavigationMenu.Trigger` - Clickable trigger that shows content
- `NavigationMenu.Content` - Content displayed when trigger is activated
- `NavigationMenu.Link` - Link element with optional `child` snippet for custom rendering

### Features

- Supports nested grid layouts for content (e.g., `md:grid-cols-2`)
- Can use `navigationMenuTriggerStyle()` utility for consistent trigger styling
- Supports icons via Lucide icons
- Responsive design with Tailwind CSS classes
- Snippets for custom content rendering with `{#snippet child()}` and `{@render}`