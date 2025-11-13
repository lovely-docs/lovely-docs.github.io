## Avatar Component

An image element with fallback text for displaying user avatars.

### Installation

```bash
npm install shadcn-svelte@latest add avatar
```

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

### Styling Variants

- **Rounded corners**: Add `class="rounded-lg"` to `Avatar.Root` for square avatars with rounded corners
- **Grouped avatars**: Use multiple `Avatar.Root` components in a container with negative margin and styling utilities for overlapping avatar groups with grayscale and ring effects

### Component Structure

- `Avatar.Root` - Container element
- `Avatar.Image` - Image element with src and alt attributes
- `Avatar.Fallback` - Text displayed when image fails to load