## Sonner

Toast notification component for Svelte, ported from the React Sonner library by Emil Kowalski.

### Installation

Install via CLI:
```bash
npx shadcn-svelte@latest add sonner -y -o
```

The `-y` flag skips the confirmation prompt and `-o` overwrites existing files.

### Setup

Add the Toaster component to your root layout file (+layout.svelte):
```svelte
<script lang="ts">
  import { Toaster } from "$lib/components/ui/sonner/index.js";
  let { children } = $props();
</script>
<Toaster />
{@render children?.()}
```

### Dark Mode

By default, Sonner uses the system's theme preference. To customize theme behavior, either:
- Pass a custom `theme` prop to the Toaster component
- Use mode-watcher to hardcode `dark` or `light` mode

If you don't want dark mode support, uninstall mode-watcher and remove the `theme` prop from the component.

### Usage

Import the `toast` function and call it with a message:
```svelte
<script lang="ts">
  import { toast } from "svelte-sonner";
  import { Button } from "$lib/components/ui/button/index.js";
</script>
<Button onclick={() => toast("Hello world")}>Show toast</Button>
```

Toast types include `toast.success()`, `toast.error()`, etc. Options include:
- `description`: Additional text below the message
- `action`: Object with `label` and `onClick` callback for action buttons

Example with success toast and action:
```svelte
<Button
  variant="outline"
  onclick={() =>
    toast.success("Event has been created", {
      description: "Sunday, December 03, 2023 at 9:00 AM",
      action: {
        label: "Undo",
        onClick: () => console.info("Undo")
      }
    })}
>
  Show Toast
</Button>
```

See the svelte-sonner documentation for complete API reference.