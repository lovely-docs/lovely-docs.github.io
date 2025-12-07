## Avatar

Image element with fallback for user representation.

### Installation

```bash
npx shadcn-svelte@latest add avatar -y -o
```

Use `-y` to skip confirmation prompt and `-o` to overwrite existing files.

### Usage

```svelte
<script lang="ts">
  import * as Avatar from "$lib/components/ui/avatar/index.js";
</script>

<!-- Basic avatar -->
<Avatar.Root>
  <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
  <Avatar.Fallback>CN</Avatar.Fallback>
</Avatar.Root>

<!-- Rounded variant -->
<Avatar.Root class="rounded-lg">
  <Avatar.Image src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
  <Avatar.Fallback>ER</Avatar.Fallback>
</Avatar.Root>

<!-- Multiple avatars with styling -->
<div class="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
  <Avatar.Root>
    <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
    <Avatar.Fallback>CN</Avatar.Fallback>
  </Avatar.Root>
  <Avatar.Root>
    <Avatar.Image src="https://github.com/leerob.png" alt="@leerob" />
    <Avatar.Fallback>LR</Avatar.Fallback>
  </Avatar.Root>
  <Avatar.Root>
    <Avatar.Image src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
    <Avatar.Fallback>ER</Avatar.Fallback>
  </Avatar.Root>
</div>
```

Structure: `Avatar.Root` wraps `Avatar.Image` (with src and alt) and `Avatar.Fallback` (text shown if image fails to load). Supports custom styling via class prop.