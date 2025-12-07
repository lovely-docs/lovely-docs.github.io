## Button Component

Reusable button with multiple variants (default, secondary, destructive, outline, ghost, link).

### Installation
```bash
npx shadcn-svelte@latest add button -y -o
```

### Usage
```svelte
<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
</script>

<Button>Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

<!-- As link -->
<Button href="/dashboard">Dashboard</Button>

<!-- With icon -->
<Button variant="outline" size="sm">
  <GitBranchIcon />
  Login with Email
</Button>

<!-- Icon only -->
<Button variant="secondary" size="icon" class="size-8">
  <ChevronRightIcon />
</Button>

<!-- Loading state -->
<Button disabled>
  <Loader2Icon class="animate-spin" />
  Please wait
</Button>
```

Use `buttonVariants` helper to style links as buttons. Supports `size` prop and standard HTML attributes.