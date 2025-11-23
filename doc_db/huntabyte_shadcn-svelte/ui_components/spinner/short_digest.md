## Spinner

Loading state indicator component.

### Installation

```bash
npx shadcn-svelte@latest add spinner -y -o
```

### Basic Usage

```svelte
<script lang="ts">
  import { Spinner } from "$lib/components/ui/spinner/index.js";
</script>
<Spinner />
```

### Customization

Replace the default LoaderIcon by editing the component to use any other icon.

### Examples

**Size & Color**: Use `size-*` and `text-*` utility classes:
```svelte
<Spinner class="size-6 text-red-500" />
```

**Button**: 
```svelte
<Button disabled size="sm">
  <Spinner />
  Loading...
</Button>
```

**Badge, Input Group, Empty, Item**: Can be placed in the Media/Addon slots of these components to indicate loading states.