## Breadcrumb Component

Displays hierarchical navigation path using links and separators.

### Installation
```bash
pnpm dlx shadcn-svelte@latest add breadcrumb
```

### Basic Usage
```svelte
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

### Custom Separator
Pass custom components (e.g., SlashIcon) into `<Breadcrumb.Separator>` slot to replace default separator.

### Dropdown Integration
Compose `<Breadcrumb.Item />` with `<DropdownMenu />` to add dropdown menus within breadcrumb items.

### Collapsed State
Use `<Breadcrumb.Ellipsis />` component to show collapsed state for long breadcrumbs.

### Custom Link Component
Use `asChild` prop on `<Breadcrumb.Link />` to integrate custom routing library link components.

### Responsive Example
Combines `<Breadcrumb.Ellipsis />`, `<DropdownMenu />`, and `<Drawer />` with MediaQuery to display dropdown on desktop and drawer on mobile. Shows/hides middle items based on available space while keeping first and last items visible.