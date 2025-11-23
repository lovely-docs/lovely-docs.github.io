## Breadcrumb Component

Displays hierarchical navigation path using links and separators.

### Installation

```bash
npx shadcn-svelte@latest add breadcrumb -y -o
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
      <Breadcrumb.Page>Current</Breadcrumb.Page>
    </Breadcrumb.Item>
  </Breadcrumb.List>
</Breadcrumb.Root>
```

### Key Components

- `<Breadcrumb.Link>` - Clickable link with `href`
- `<Breadcrumb.Page>` - Current page (non-clickable)
- `<Breadcrumb.Separator>` - Divider (accepts custom slot content)
- `<Breadcrumb.Ellipsis>` - Collapsed state indicator

### Examples

**Custom separator:**
```svelte
<Breadcrumb.Separator>
  <SlashIcon />
</Breadcrumb.Separator>
```

**Dropdown integration:**
```svelte
<Breadcrumb.Item>
  <DropdownMenu.Root>
    <DropdownMenu.Trigger>Components <ChevronDownIcon /></DropdownMenu.Trigger>
    <DropdownMenu.Content align="start">
      <DropdownMenu.Item>Documentation</DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
</Breadcrumb.Item>
```

**Responsive (desktop dropdown, mobile drawer):**
Use `MediaQuery("(min-width: 768px)")` to conditionally render `<DropdownMenu />` or `<Drawer />` with `<Breadcrumb.Ellipsis />` for collapsed items.