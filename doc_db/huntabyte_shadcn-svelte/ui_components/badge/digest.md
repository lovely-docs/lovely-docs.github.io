## Badge

Displays a badge or badge-like component.

### Installation

```bash
npx shadcn-svelte@latest add badge -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Usage

Basic badge with variants:

```svelte
<script lang="ts">
  import { Badge } from "$lib/components/ui/badge/index.js";
  import BadgeCheckIcon from "@lucide/svelte/icons/badge-check";
</script>

<Badge>Badge</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>

<!-- With icon -->
<Badge variant="secondary" class="bg-blue-500 text-white dark:bg-blue-600">
  <BadgeCheckIcon />
  Verified
</Badge>

<!-- Circular badges with numbers -->
<Badge class="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">8</Badge>
<Badge class="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums" variant="destructive">99</Badge>
<Badge class="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums" variant="outline">20+</Badge>
```

Available variants: `default`, `secondary`, `destructive`, `outline`.

### Link Badge

Use `badgeVariants` helper to style a link as a badge:

```svelte
<script lang="ts">
  import { badgeVariants } from "$lib/components/ui/badge/index.js";
</script>

<a href="/dashboard" class={badgeVariants({ variant: "outline" })}>Badge</a>
```