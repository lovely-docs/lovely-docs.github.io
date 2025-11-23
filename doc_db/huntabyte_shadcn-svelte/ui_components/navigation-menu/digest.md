## Navigation Menu

A collection of links for navigating websites. Built on Bits UI with Tailwind CSS styling.

### Installation

```bash
npx shadcn-svelte@latest add navigation-menu -y -o
```

The `-y` flag skips the confirmation prompt and `-o` overwrites existing files.

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

### Component Structure

- `NavigationMenu.Root` - Container with optional `viewport={false}` prop
- `NavigationMenu.List` - Wrapper for menu items
- `NavigationMenu.Item` - Individual menu item
- `NavigationMenu.Trigger` - Clickable trigger that opens content
- `NavigationMenu.Content` - Dropdown content container
- `NavigationMenu.Link` - Link element with snippet-based child content

### Advanced Examples

**Grid Layout with Descriptions:**
```svelte
<NavigationMenu.Item>
  <NavigationMenu.Trigger>Components</NavigationMenu.Trigger>
  <NavigationMenu.Content>
    <ul class="grid w-[400px] gap-2 p-2 md:w-[500px] md:grid-cols-2">
      <li>
        <NavigationMenu.Link>
          {#snippet child()}
            <a href="/docs/components/alert-dialog" class="block p-3 rounded-md hover:bg-accent">
              <div class="text-sm font-medium">Alert Dialog</div>
              <p class="text-muted-foreground text-sm">A modal dialog that interrupts the user with important content.</p>
            </a>
          {/snippet}
        </NavigationMenu.Link>
      </li>
    </ul>
  </NavigationMenu.Content>
</NavigationMenu.Item>
```

**Featured Item with Grid:**
```svelte
<ul class="grid gap-2 p-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
  <li class="row-span-3">
    <NavigationMenu.Link class="bg-linear-to-b from-muted/50 to-muted flex h-full flex-col justify-end rounded-md p-6">
      {#snippet child({ props })}
        <a {...props} href="/">
          <div class="text-lg font-medium">shadcn-svelte</div>
          <p class="text-muted-foreground text-sm">Beautifully designed components built with Tailwind CSS.</p>
        </a>
      {/snippet}
    </NavigationMenu.Link>
  </li>
</ul>
```

**With Icons:**
```svelte
<NavigationMenu.Link href="##" class="flex-row items-center gap-2">
  <CircleCheckIcon />
  Done
</NavigationMenu.Link>
```

### Styling

- Use `navigationMenuTriggerStyle()` utility for consistent trigger styling
- Use `cn()` utility to combine classes
- Supports Tailwind CSS classes for customization (hover states, colors, spacing, etc.)
- Supports snippet-based child content for flexible rendering

### Key Props

- `NavigationMenu.Root`: `viewport` - boolean to control viewport behavior
- `NavigationMenu.Link`: `href` - link destination, `class` - custom styling
- All components support standard HTML attributes and Svelte event handlers

### Related Documentation

See Bits UI documentation for full API reference and additional configuration options.