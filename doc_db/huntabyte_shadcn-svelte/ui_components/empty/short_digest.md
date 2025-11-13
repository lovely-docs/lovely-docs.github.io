## Empty Component

Display empty states with icon, title, description, and content sections.

### Installation
```bash
pnpm dlx shadcn-svelte@latest add empty
```

### Basic Usage
```svelte
<Empty.Root>
  <Empty.Header>
    <Empty.Media variant="icon"><FolderCodeIcon /></Empty.Media>
    <Empty.Title>No data</Empty.Title>
    <Empty.Description>No data found</Empty.Description>
  </Empty.Header>
  <Empty.Content>
    <Button>Add data</Button>
  </Empty.Content>
</Empty.Root>
```

### Variants
- **Outline**: Add `border border-dashed` class
- **Background**: Use gradient utilities like `bg-gradient-to-b`
- **Avatar**: Use `Empty.Media variant="default"` for custom content
- **With InputGroup**: Combine with InputGroup for search functionality