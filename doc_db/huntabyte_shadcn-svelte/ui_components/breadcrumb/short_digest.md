## Breadcrumb Component

Hierarchical navigation path display with links and separators.

**Installation:** `pnpm dlx shadcn-svelte@latest add breadcrumb`

**Basic structure:** `<Breadcrumb.Root>` → `<Breadcrumb.List>` → `<Breadcrumb.Item>` with `<Breadcrumb.Link>` or `<Breadcrumb.Page>`, separated by `<Breadcrumb.Separator />`

**Features:**
- Custom separators via slot
- Dropdown menus in items
- `<Breadcrumb.Ellipsis />` for collapsed state
- `asChild` prop for custom link components
- Responsive example with desktop dropdown / mobile drawer