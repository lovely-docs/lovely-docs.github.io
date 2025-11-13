## Button Component

Reusable button that renders as `<button>` or `<a>` with multiple variants.

### Installation
```bash
pnpm dlx shadcn-svelte@latest add button
```

### Usage
```svelte
<Button>Button</Button>
<Button href="/dashboard">Dashboard</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
```

### With Icons
```svelte
<Button variant="outline" size="sm">
  <GitBranchIcon />
  Login with Email
</Button>
```

### Icon-only
```svelte
<Button variant="secondary" size="icon" class="size-8">
  <ChevronRightIcon />
</Button>
```

### Loading
```svelte
<Button disabled>
  <Loader2Icon class="animate-spin" />
  Please wait
</Button>
```