## Breadcrumb

Displays navigation path using hierarchy of links.

### Installation

```bash
npx shadcn-svelte@latest add breadcrumb -y -o
```

### Components

- `<Breadcrumb.Root>`, `<Breadcrumb.List>`, `<Breadcrumb.Item>` - Structure
- `<Breadcrumb.Link href="...">` - Clickable link
- `<Breadcrumb.Page>` - Current page (non-clickable)
- `<Breadcrumb.Separator>` - Separator (customizable via slot)
- `<Breadcrumb.Ellipsis>` - Collapsed state indicator

### Examples

**Basic:**
```svelte
<Breadcrumb.Root>
  <Breadcrumb.List>
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator />
    <Breadcrumb.Item>
      <Breadcrumb.Page>Current</Breadcrumb.Page>
    </Breadcrumb.Item>
  </Breadcrumb.List>
</Breadcrumb.Root>
```

**Custom separator:** Pass component to `<Breadcrumb.Separator>` slot.

**Dropdown:** Compose `<Breadcrumb.Item>` with `<DropdownMenu>`.

**Collapsed:** Use `<Breadcrumb.Ellipsis />` for long breadcrumbs.

**Responsive:** Use `MediaQuery` to show `<DropdownMenu>` on desktop and `<Drawer>` on mobile.
