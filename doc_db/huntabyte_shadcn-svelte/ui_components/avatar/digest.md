## Avatar Component

Image element with fallback for user representation.

### Installation

```bash
npx shadcn-svelte@latest add avatar -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Basic Usage

```svelte
<script lang="ts">
  import * as Avatar from "$lib/components/ui/avatar/index.js";
</script>

<Avatar.Root>
  <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
  <Avatar.Fallback>CN</Avatar.Fallback>
</Avatar.Root>
```

### Variants

**Rounded corners:**
```svelte
<Avatar.Root class="rounded-lg">
  <Avatar.Image src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
  <Avatar.Fallback>ER</Avatar.Fallback>
</Avatar.Root>
```

**Avatar group with styling:**
```svelte
<div class="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
  <Avatar.Root>
    <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
    <Avatar.Fallback>CN</Avatar.Fallback>
  </Avatar.Root>
  <Avatar.Root>
    <Avatar.Image src="https://github.com/leerob.png" alt="@leerob" />
    <Avatar.Fallback>LR</Avatar.Fallback>
  </Avatar.Root>
</div>
```

### Structure

- `Avatar.Root`: Container component
- `Avatar.Image`: Image element with src and alt attributes
- `Avatar.Fallback`: Text displayed when image fails to load