## Empty State Component

Display empty states with title, description, icon/avatar, and action content.

### Installation

```bash
npx shadcn-svelte@latest add empty -y -o
```

### Basic Usage

```svelte
<script lang="ts">
  import * as Empty from "$lib/components/ui/empty/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import FolderCodeIcon from "@tabler/icons-svelte/icons/folder-code";
</script>

<Empty.Root>
  <Empty.Header>
    <Empty.Media variant="icon"><FolderCodeIcon /></Empty.Media>
    <Empty.Title>No Projects Yet</Empty.Title>
    <Empty.Description>Create your first project to get started.</Empty.Description>
  </Empty.Header>
  <Empty.Content>
    <Button>Create Project</Button>
  </Empty.Content>
</Empty.Root>
```

### Variants

- **Outline**: Add `class="border border-dashed"` to `Empty.Root`
- **Background**: Use gradient utilities like `class="bg-gradient-to-b from-muted/50 to-background"`
- **Avatar**: Use `Empty.Media variant="default"` with `Avatar.Root`
- **Avatar Group**: Multiple avatars with `-space-x-2` and `ring-2`
- **With Input**: Add `InputGroup` to `Empty.Content` for search functionality