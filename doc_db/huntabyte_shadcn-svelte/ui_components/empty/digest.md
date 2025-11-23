## Empty Component

Display empty states with customizable content structure.

### Installation

```bash
npx shadcn-svelte@latest add empty -y -o
```

Use `-y` to skip confirmation and `-o` to overwrite existing files.

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
  </Empty.Content>
</Empty.Root>
```

### Component Structure

- `Empty.Root` - Container wrapper
- `Empty.Header` - Header section containing media, title, and description
- `Empty.Media` - Media container with `variant="icon"` (default) or `variant="default"` for custom content
- `Empty.Title` - Title text
- `Empty.Description` - Description text
- `Empty.Content` - Content area for buttons, forms, or other interactive elements

### Examples

**Outline variant** - Add dashed border:
```svelte
<Empty.Root class="border border-dashed">
  <Empty.Header>
    <Empty.Media variant="icon">
      <CloudIcon />
    </Empty.Media>
    <Empty.Title>Cloud Storage Empty</Empty.Title>
    <Empty.Description>Upload files to your cloud storage to access them anywhere.</Empty.Description>
  </Empty.Header>
  <Empty.Content>
    <Button variant="outline" size="sm">Upload Files</Button>
  </Empty.Content>
</Empty.Root>
```

**Background variant** - Add gradient background:
```svelte
<Empty.Root class="from-muted/50 to-background h-full bg-gradient-to-b from-30%">
  <Empty.Header>
    <Empty.Media variant="icon">
      <BellIcon />
    </Empty.Media>
    <Empty.Title>No Notifications</Empty.Title>
    <Empty.Description>You're all caught up. New notifications will appear here.</Empty.Description>
  </Empty.Header>
  <Empty.Content>
    <Button variant="outline" size="sm">
      <RefreshCcwIcon />
      Refresh
    </Button>
  </Empty.Content>
</Empty.Root>
```

**Avatar** - Display single avatar in media:
```svelte
<Empty.Root>
  <Empty.Header>
    <Empty.Media variant="default">
      <Avatar.Root class="size-12">
        <Avatar.Image src="https://github.com/shadcn.png" class="grayscale" />
        <Avatar.Fallback>LR</Avatar.Fallback>
      </Avatar.Root>
    </Empty.Media>
    <Empty.Title>User Offline</Empty.Title>
    <Empty.Description>This user is currently offline. You can leave a message to notify them or try again later.</Empty.Description>
  </Empty.Header>
  <Empty.Content>
    <Button size="sm">Leave Message</Button>
  </Empty.Content>
</Empty.Root>
```

**Avatar Group** - Display multiple overlapping avatars:
```svelte
<Empty.Root>
  <Empty.Header>
    <Empty.Media>
      <div class="*:ring-background flex -space-x-2 *:size-12 *:ring-2 *:grayscale">
        <Avatar.Root>
          <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
          <Avatar.Fallback>CN</Avatar.Fallback>
        </Avatar.Root>
        <Avatar.Root>
          <Avatar.Image src="https://github.com/maxleiter.png" alt="@maxleiter" />
          <Avatar.Fallback>ML</Avatar.Fallback>
        </Avatar.Root>
        <Avatar.Root>
          <Avatar.Image src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
          <Avatar.Fallback>ER</Avatar.Fallback>
        </Avatar.Root>
      </div>
    </Empty.Media>
    <Empty.Title>No Team Members</Empty.Title>
    <Empty.Description>Invite your team to collaborate on this project.</Empty.Description>
  </Empty.Header>
  <Empty.Content>
    <Button size="sm">
      <PlusIcon />
      Invite Members
    </Button>
  </Empty.Content>
</Empty.Root>
```

**With InputGroup** - Add search input to empty state:
```svelte
<Empty.Root>
  <Empty.Header>
    <Empty.Title>404 - Not Found</Empty.Title>
    <Empty.Description>The page you're looking for doesn't exist. Try searching for what you need below.</Empty.Description>
  </Empty.Header>
  <Empty.Content>
    <InputGroup.Root class="sm:w-3/4">
      <InputGroup.Input placeholder="Try searching for pages..." />
      <InputGroup.Addon>
        <SearchIcon />
      </InputGroup.Addon>
      <InputGroup.Addon align="inline-end">
        <Kbd.Root>/</Kbd.Root>
      </InputGroup.Addon>
    </InputGroup.Root>
    <Empty.Description>
      Need help? <a href="#/">Contact support</a>
    </Empty.Description>
  </Empty.Content>
</Empty.Root>
```

### Styling

Use Tailwind utility classes on `Empty.Root` to customize appearance:
- `border border-dashed` - Add dashed border outline
- `bg-gradient-to-b from-muted/50 to-background from-30%` - Add gradient background
- `h-full` - Full height container