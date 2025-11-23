## Avatar Component

Image with fallback text for user representation.

### Installation

```bash
npx shadcn-svelte@latest add avatar -y -o
```

### Usage

```svelte
<script lang="ts">
  import * as Avatar from "$lib/components/ui/avatar/index.js";
</script>

<Avatar.Root>
  <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
  <Avatar.Fallback>CN</Avatar.Fallback>
</Avatar.Root>
```

Supports custom styling via class prop on `Avatar.Root` (e.g., `rounded-lg`). Can be grouped with negative spacing and filters applied via parent container.