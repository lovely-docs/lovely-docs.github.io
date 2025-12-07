## Empty State Component

Display empty states with customizable content structure.

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
    <Empty.Media variant="icon">
      <FolderCodeIcon />
    </Empty.Media>
    <Empty.Title>No Projects Yet</Empty.Title>
    <Empty.Description>
      You haven't created any projects yet. Get started by creating your first project.
    </Empty.Description>
  </Empty.Header>
  <Empty.Content>
    <Button>Create Project</Button>
    <Button variant="outline">Import Project</Button>
  </Empty.Content>
</Empty.Root>
```

### Component Structure

- `Empty.Root`: Container
- `Empty.Header`: Header section containing media, title, and description
- `Empty.Media`: Media container with `variant="icon"` (for icons) or `variant="default"` (for custom content like avatars)
- `Empty.Title`: Title text
- `Empty.Description`: Description text
- `Empty.Content`: Action content area (buttons, forms, etc.)

### Examples

**Outline variant** - Add `class="border border-dashed"` to `Empty.Root` for a bordered empty state.

**Background variant** - Use Tailwind utilities like `class="from-muted/50 to-background h-full bg-gradient-to-b from-30%"` on `Empty.Root` for gradient backgrounds.

**Avatar** - Use `Empty.Media variant="default"` with `Avatar.Root` component:
```svelte
<Empty.Media variant="default">
  <Avatar.Root class="size-12">
    <Avatar.Image src="..." class="grayscale" />
    <Avatar.Fallback>LR</Avatar.Fallback>
  </Avatar.Root>
</Empty.Media>
```

**Avatar Group** - Multiple avatars in `Empty.Media` with negative margin and ring styling:
```svelte
<Empty.Media>
  <div class="*:ring-background flex -space-x-2 *:size-12 *:ring-2 *:grayscale">
    <Avatar.Root>...</Avatar.Root>
    <Avatar.Root>...</Avatar.Root>
    <Avatar.Root>...</Avatar.Root>
  </div>
</Empty.Media>
```

**With InputGroup** - Add search/input functionality to `Empty.Content`:
```svelte
<Empty.Content>
  <InputGroup.Root class="sm:w-3/4">
    <InputGroup.Input placeholder="Try searching..." />
    <InputGroup.Addon>
      <SearchIcon />
    </InputGroup.Addon>
    <InputGroup.Addon align="inline-end">
      <Kbd.Root>/</Kbd.Root>
    </InputGroup.Addon>
  </InputGroup.Root>
</Empty.Content>
```