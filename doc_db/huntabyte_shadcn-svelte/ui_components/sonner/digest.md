## Sonner

Toast component for Svelte, ported from the React Sonner library by Emil Kowalski.

### Installation

Install via CLI:
```bash
npx shadcn-svelte@latest add sonner -y -o
```
(-y: skip confirmation, -o: overwrite existing files)

Add the Toaster component to your root layout:
```svelte
<script lang="ts">
  import { Toaster } from "$lib/components/ui/sonner/index.js";
  let { children } = $props();
</script>
<Toaster />
{@render children?.()}
```

### Theme Support

By default, Sonner uses system preferences for light/dark theme. To customize, pass a `theme` prop to the Toaster component, or use mode-watcher to hardcode a theme. See Dark Mode documentation for setup details.

To opt out of Dark Mode support, uninstall mode-watcher and remove the `theme` prop from the component.

### Usage

Import `toast` from "svelte-sonner" and call it with a message:
```svelte
<script lang="ts">
  import { toast } from "svelte-sonner";
  import { Button } from "$lib/components/ui/button/index.js";
</script>
<Button onclick={() => toast("Hello world")}>Show toast</Button>
```

Toast types and options:
```svelte
toast.success("Event has been created", {
  description: "Sunday, December 03, 2023 at 9:00 AM",
  action: {
    label: "Undo",
    onClick: () => console.info("Undo")
  }
})
```

Supports `toast.success()`, `toast.error()`, and other variants. Options include `description` for additional text and `action` object with `label` and `onClick` callback.