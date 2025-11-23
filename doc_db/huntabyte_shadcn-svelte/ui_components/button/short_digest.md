## Button Component

Displays a button or component that looks like a button.

### Installation

```bash
npx shadcn-svelte@latest add button -y -o
```

### Usage

```svelte
<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
</script>
<Button variant="outline">Button</Button>
```

### Variants

`outline`, `secondary`, `destructive`, `ghost`, `link`

### Link Conversion

```svelte
<Button href="/dashboard">Dashboard</Button>
```

Or use `buttonVariants` helper:

```svelte
<a href="/dashboard" class={buttonVariants({ variant: "outline" })}>
  Dashboard
</a>
```

### Icons and Sizes

```svelte
<Button variant="outline" size="sm">
  <GitBranchIcon />
  Login with Email
</Button>
<Button variant="secondary" size="icon" class="size-8">
  <ChevronRightIcon />
</Button>
```

### Disabled State

```svelte
<Button disabled>
  <Loader2Icon class="animate-spin" />
  Please wait
</Button>
```