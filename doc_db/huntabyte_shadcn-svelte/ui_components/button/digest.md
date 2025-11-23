## Button Component

Displays a button or a component that looks like a button.

### Installation

```bash
npx shadcn-svelte@latest add button -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Basic Usage

Import and render a button:

```svelte
<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
</script>
<Button>Button</Button>
```

### Variants

The `variant` prop controls the button's appearance:

```svelte
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
```

### Link Conversion

Convert the button to an `<a>` element by passing an `href` prop:

```svelte
<Button href="/dashboard">Dashboard</Button>
```

Alternatively, use the `buttonVariants` helper to style a link as a button:

```svelte
<script lang="ts">
  import { buttonVariants } from "$lib/components/ui/button";
</script>
<a href="/dashboard" class={buttonVariants({ variant: "outline" })}>
  Dashboard
</a>
```

### Size and Icons

Use the `size` prop to control button size. The `size="icon"` variant creates icon-only buttons:

```svelte
<script lang="ts">
  import GitBranchIcon from "@lucide/svelte/icons/git-branch";
  import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";
  import { Button } from "$lib/components/ui/button/index.js";
</script>
<Button variant="outline" size="sm">
  <GitBranchIcon />
  Login with Email
</Button>
<Button variant="secondary" size="icon" class="size-8">
  <ChevronRightIcon />
</Button>
```

### Disabled State

Disable buttons with the `disabled` attribute. Commonly used with loading indicators:

```svelte
<script lang="ts">
  import Loader2Icon from "@lucide/svelte/icons/loader-2";
  import { Button } from "$lib/components/ui/button/index.js";
</script>
<Button disabled>
  <Loader2Icon class="animate-spin" />
  Please wait
</Button>
```

See Bits UI Button documentation for full API reference.