## Button Component

A reusable button component that can render as `<button>` or `<a>` element with multiple style variants.

### Installation

```bash
npx shadcn-svelte@latest add button -y -o
```

Flags: `-y` skips confirmation prompt, `-o` overwrites existing files.

### Basic Usage

```svelte
<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
</script>

<!-- Default button -->
<Button>Button</Button>

<!-- With variant -->
<Button variant="outline">Button</Button>

<!-- As link -->
<Button href="/dashboard">Dashboard</Button>
```

Alternatively, use `buttonVariants` helper to style links as buttons:
```svelte
<a href="/dashboard" class={buttonVariants({ variant: "outline" })}>
  Dashboard
</a>
```

### Variants

- `default` (primary): Default button style
- `secondary`: Secondary button style
- `destructive`: Red/danger button style
- `outline`: Outlined button style
- `ghost`: Minimal button style
- `link`: Link-styled button

### Examples

```svelte
<Button>Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

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

Supports `size` prop (e.g., `sm`, `icon`) and standard HTML button attributes.