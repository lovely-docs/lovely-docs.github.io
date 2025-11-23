## Sonner

Toast notification component for Svelte.

### Installation
```bash
npx shadcn-svelte@latest add sonner -y -o
```

### Setup
Add to +layout.svelte:
```svelte
<script lang="ts">
  import { Toaster } from "$lib/components/ui/sonner/index.js";
  let { children } = $props();
</script>
<Toaster />
{@render children?.()}
```

### Usage
```svelte
<script lang="ts">
  import { toast } from "svelte-sonner";
  import { Button } from "$lib/components/ui/button/index.js";
</script>
<Button onclick={() => 
  toast.success("Event created", {
    description: "Sunday, December 03, 2023 at 9:00 AM",
    action: { label: "Undo", onClick: () => console.info("Undo") }
  })
}>
  Show Toast
</Button>
```

Supports dark mode via system preference or mode-watcher configuration.