## Navigation Menu

Navigational component with triggers and dropdown content.

```svelte
<NavigationMenu.Root>
  <NavigationMenu.List>
    <NavigationMenu.Item>
      <NavigationMenu.Trigger>Menu</NavigationMenu.Trigger>
      <NavigationMenu.Content>
        <NavigationMenu.Link>Link</NavigationMenu.Link>
      </NavigationMenu.Content>
    </NavigationMenu.Item>
  </NavigationMenu.List>
</NavigationMenu.Root>
```

Install: `pnpm dlx shadcn-svelte@latest add navigation-menu`

Key parts: `Root`, `List`, `Item`, `Trigger`, `Content`, `Link`. Supports custom rendering via snippets and responsive grid layouts.