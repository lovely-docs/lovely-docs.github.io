## Badge Component

A UI component for displaying badges with multiple style variants.

### Installation

```bash
npx shadcn-svelte@latest add badge -y -o
```

The `-y` flag skips the confirmation prompt and `-o` overwrites existing files.

### Basic Usage

Import and use the Badge component:

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

The component supports four built-in variants: default, secondary, destructive, and outline.

### Customization

Badges can be customized with additional classes for styling:

```svelte
<Badge variant="secondary" class="bg-blue-500 text-white dark:bg-blue-600">
  <BadgeCheckIcon />
  Verified
</Badge>
```

Circular badge variants can be created using custom classes:

```svelte
<Badge class="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">8</Badge>
<Badge class="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums" variant="destructive">99</Badge>
```

### Link Badge

Use the `badgeVariants` helper to style links as badges:

```svelte
<script lang="ts">
  import { badgeVariants } from "$lib/components/ui/badge/index.js";
</script>

<a href="/dashboard" class={badgeVariants({ variant: "outline" })}>Badge</a>
```