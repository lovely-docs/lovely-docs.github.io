## Empty Component

Display empty states with customizable content structure.

### Installation
```bash
pnpm dlx shadcn-svelte@latest add empty
```

### Basic Usage
```svelte
<script lang="ts">
  import * as Empty from "$lib/components/ui/empty/index.js";
  import FolderCodeIcon from "@tabler/icons-svelte/icons/folder-code";
</script>
<Empty.Root>
  <Empty.Header>
    <Empty.Media variant="icon">
      <FolderCodeIcon />
    </Empty.Media>
    <Empty.Title>No data</Empty.Title>
    <Empty.Description>No data found</Empty.Description>
  </Empty.Header>
  <Empty.Content>
    <Button>Add data</Button>
  </Empty.Content>
</Empty.Root>
```

### Variants

**Outline**: Add `border border-dashed` class to Empty.Root for a bordered empty state.

**Background**: Use `bg-gradient-to-b` and gradient utilities on Empty.Root for styled backgrounds.

**Avatar**: Use `Empty.Media variant="default"` to display avatars or custom content instead of icons.

**Avatar Group**: Combine multiple avatars in Empty.Media with negative margin and ring utilities.

**With InputGroup**: Combine Empty.Content with InputGroup component for search/input functionality in empty states.