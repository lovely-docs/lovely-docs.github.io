## Button Component

A reusable button component that can render as `<button>` or `<a>` element.

### Installation
```bash
pnpm dlx shadcn-svelte@latest add button
```

### Basic Usage
```svelte
<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
</script>
<Button>Button</Button>
```

### Link Button
Pass `href` prop to render as anchor element:
```svelte
<Button href="/dashboard">Dashboard</Button>
```

Or use `buttonVariants` helper to style a link:
```svelte
<a href="/dashboard" class={buttonVariants({ variant: "outline" })}>
  Dashboard
</a>
```

### Variants
- `variant="secondary"` - Secondary style
- `variant="destructive"` - Destructive/danger style
- `variant="outline"` - Outlined style
- `variant="ghost"` - Ghost style
- `variant="link"` - Link style

### Sizes and Modifiers
- `size="sm"` - Small size
- `size="icon"` - Icon-only button
- Can include icons from lucide-svelte
- `disabled` prop for disabled state with loading indicator

### Examples
Icon button with text:
```svelte
<Button variant="outline" size="sm">
  <GitBranchIcon />
  Login with Email
</Button>
```

Icon-only button:
```svelte
<Button variant="secondary" size="icon" class="size-8">
  <ChevronRightIcon />
</Button>
```

Loading state:
```svelte
<Button disabled>
  <Loader2Icon class="animate-spin" />
  Please wait
</Button>
```