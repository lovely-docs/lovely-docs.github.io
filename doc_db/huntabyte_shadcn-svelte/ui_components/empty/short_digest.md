## Empty Component

Display empty states with title, description, icon/avatar, and action content.

### Installation

```bash
npx shadcn-svelte@latest add empty -y -o
```

### Basic Usage

```svelte
<Empty.Root>
  <Empty.Header>
    <Empty.Media variant="icon"><FolderCodeIcon /></Empty.Media>
    <Empty.Title>No Projects Yet</Empty.Title>
    <Empty.Description>Get started by creating your first project.</Empty.Description>
  </Empty.Header>
  <Empty.Content>
    <Button>Create Project</Button>
  </Empty.Content>
</Empty.Root>
```

### Examples

- **Outline**: Add `class="border border-dashed"` to `Empty.Root`
- **Background**: Add `class="bg-gradient-to-b from-muted/50 to-background from-30%"` to `Empty.Root`
- **Avatar**: Use `Empty.Media variant="default"` with Avatar component
- **Avatar Group**: Use `Empty.Media` with multiple overlapping avatars
- **With InputGroup**: Add InputGroup component to `Empty.Content` for search functionality