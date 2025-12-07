## Navigation Menu

A collection of links for navigating websites. Built on Bits UI.

### Installation

```bash
npx shadcn-svelte@latest add navigation-menu -y -o
```

Use `-y` to skip confirmation prompt and `-o` to overwrite existing files.

### Basic Usage

```svelte
<script lang="ts">
  import * as NavigationMenu from "$lib/components/ui/navigation-menu/index.js";
</script>

<NavigationMenu.Root viewport={false}>
  <NavigationMenu.List>
    <NavigationMenu.Item>
      <NavigationMenu.Trigger>Item One</NavigationMenu.Trigger>
      <NavigationMenu.Content>
        <NavigationMenu.Link href="/">Link</NavigationMenu.Link>
      </NavigationMenu.Content>
    </NavigationMenu.Item>
  </NavigationMenu.List>
</NavigationMenu.Root>
```

### Components

- `NavigationMenu.Root` - Container with optional `viewport` prop
- `NavigationMenu.List` - Wrapper for menu items
- `NavigationMenu.Item` - Individual menu item
- `NavigationMenu.Trigger` - Clickable trigger text
- `NavigationMenu.Content` - Dropdown content container
- `NavigationMenu.Link` - Link element with optional `href` prop and `child` snippet

### Examples

**Grid layout with descriptions:**
```svelte
<NavigationMenu.Root viewport={false}>
  <NavigationMenu.List>
    <NavigationMenu.Item>
      <NavigationMenu.Trigger>Components</NavigationMenu.Trigger>
      <NavigationMenu.Content>
        <ul class="grid w-[400px] gap-2 p-2 md:w-[500px] md:grid-cols-2">
          <li>
            <NavigationMenu.Link>
              {#snippet child()}
                <a href="/docs/components/alert-dialog" class="block p-3 rounded-md hover:bg-accent">
                  <div class="font-medium">Alert Dialog</div>
                  <p class="text-sm text-muted-foreground">A modal dialog that interrupts the user...</p>
                </a>
              {/snippet}
            </NavigationMenu.Link>
          </li>
        </ul>
      </NavigationMenu.Content>
    </NavigationMenu.Item>
  </NavigationMenu.List>
</NavigationMenu.Root>
```

**With icons:**
```svelte
<NavigationMenu.Item>
  <NavigationMenu.Trigger>With Icon</NavigationMenu.Trigger>
  <NavigationMenu.Content>
    <ul class="grid w-[200px] gap-4 p-2">
      <li>
        <NavigationMenu.Link href="##" class="flex-row items-center gap-2">
          <CircleHelpIcon />
          Backlog
        </NavigationMenu.Link>
        <NavigationMenu.Link href="##" class="flex-row items-center gap-2">
          <CircleCheckIcon />
          Done
        </NavigationMenu.Link>
      </li>
    </ul>
  </NavigationMenu.Content>
</NavigationMenu.Item>
```

**Simple list:**
```svelte
<NavigationMenu.Item>
  <NavigationMenu.Trigger>Simple</NavigationMenu.Trigger>
  <NavigationMenu.Content>
    <ul class="grid w-[200px] gap-4 p-2">
      <li>
        <NavigationMenu.Link href="##">Components</NavigationMenu.Link>
        <NavigationMenu.Link href="##">Documentation</NavigationMenu.Link>
      </li>
    </ul>
  </NavigationMenu.Content>
</NavigationMenu.Item>
```

Use `navigationMenuTriggerStyle()` utility for consistent trigger styling. Use `cn()` utility to combine classes. Customize with Tailwind CSS classes on any component.