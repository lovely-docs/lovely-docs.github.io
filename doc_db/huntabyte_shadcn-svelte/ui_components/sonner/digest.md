Sonner is an opinionated toast component for Svelte, ported from the React Sonner library by Emil Kowalski.

**Installation:**
Install via CLI with `pnpm dlx shadcn-svelte@latest add sonner`. This sets up theme support using mode-watcher for dark/light mode detection. Add the Toaster component to your root layout:

```svelte
<script lang="ts">
  import { Toaster } from "$lib/components/ui/sonner/index.js";
  let { children } = $props();
</script>
<Toaster />
{@render children?.()}
```

**Usage:**
Import the `toast` function from "svelte-sonner" and call it with a message or configuration object:

```svelte
<script lang="ts">
  import { toast } from "svelte-sonner";
  import { Button } from "$lib/components/ui/button/index.js";
</script>
<Button onclick={() => toast.success("Event has been created", {
  description: "Sunday, December 03, 2023 at 9:00 AM",
  action: {
    label: "Undo",
    onClick: () => console.info("Undo")
  }
})}>
  Show Toast
</Button>
```

Supports toast types like `success`, custom descriptions, and action buttons with callbacks. Dark mode support can be disabled by uninstalling mode-watcher and removing the theme prop.