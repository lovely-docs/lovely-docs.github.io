## Badge Component

A UI component for displaying badges with multiple style variants.

### Installation

```bash
pnpm dlx shadcn-svelte@latest add badge
```

### Basic Usage

```svelte
<script lang="ts">
  import { Badge } from "$lib/components/ui/badge/index.js";
</script>

<Badge>Badge</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>
```

### Variants

- `default` - Standard badge style
- `secondary` - Secondary style
- `destructive` - Destructive/error style
- `outline` - Outlined style

### Advanced Examples

Badges can be customized with icons and custom styling:

```svelte
<Badge variant="secondary" class="bg-blue-500 text-white">
  <BadgeCheckIcon />
  Verified
</Badge>
```

Circular badges with numbers:

```svelte
<Badge class="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">8</Badge>
```

### Link Badge

Use the `badgeVariants` helper to create links styled as badges:

```svelte
<script lang="ts">
  import { badgeVariants } from "$lib/components/ui/badge/index.js";
</script>

<a href="/dashboard" class={badgeVariants({ variant: "outline" })}>Badge</a>
```