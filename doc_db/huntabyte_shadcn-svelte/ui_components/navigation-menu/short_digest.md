## Navigation Menu

Dropdown navigation component built on Bits UI.

### Install
```bash
npx shadcn-svelte@latest add navigation-menu -y -o
```

### Basic Structure
```svelte
<script lang="ts">
  import * as NavigationMenu from "$lib/components/ui/navigation-menu/index.js";
</script>

<NavigationMenu.Root viewport={false}>
  <NavigationMenu.List>
    <NavigationMenu.Item>
      <NavigationMenu.Trigger>Menu</NavigationMenu.Trigger>
      <NavigationMenu.Content>
        <NavigationMenu.Link href="/">Link</NavigationMenu.Link>
      </NavigationMenu.Content>
    </NavigationMenu.Item>
  </NavigationMenu.List>
</NavigationMenu.Root>
```

### Key Components
- `Root` - Container with optional `viewport` prop
- `List`, `Item` - Structural wrappers
- `Trigger` - Clickable text that opens dropdown
- `Content` - Dropdown container
- `Link` - Links with optional `href` and `child` snippet

### Patterns
- Grid layouts with descriptions using `class="grid w-[400px] gap-2 md:grid-cols-2"`
- Icon support by adding icons alongside text
- Use `navigationMenuTriggerStyle()` for consistent trigger styling
- Customize with Tailwind CSS classes