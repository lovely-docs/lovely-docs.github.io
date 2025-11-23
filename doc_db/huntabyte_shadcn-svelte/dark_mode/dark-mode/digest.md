## Setup

Install `mode-watcher`:
```bash
npm i mode-watcher
```

Add the `ModeWatcher` component to your root layout (src/routes/+layout.svelte):
```svelte
<script lang="ts">
  import "../app.css";
  import { ModeWatcher } from "mode-watcher";
  let { children } = $props();
</script>
<ModeWatcher />
{@render children?.()}
```

## Mode Toggle

Create a simple toggle button:
```svelte
<script lang="ts">
  import SunIcon from "@lucide/svelte/icons/sun";
  import MoonIcon from "@lucide/svelte/icons/moon";
  import { toggleMode } from "mode-watcher";
  import { Button } from "$lib/components/ui/button/index.js";
</script>
<Button onclick={toggleMode} variant="outline" size="icon">
  <SunIcon
    class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 !transition-all dark:-rotate-90 dark:scale-0"
  />
  <MoonIcon
    class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 !transition-all dark:rotate-0 dark:scale-100"
  />
  <span class="sr-only">Toggle theme</span>
</Button>
```

Or create a dropdown menu with light/dark/system options:
```svelte
<script lang="ts">
  import SunIcon from "@lucide/svelte/icons/sun";
  import MoonIcon from "@lucide/svelte/icons/moon";
  import { resetMode, setMode } from "mode-watcher";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import { buttonVariants } from "$lib/components/ui/button/index.js";
</script>
<DropdownMenu.Root>
  <DropdownMenu.Trigger
    class={buttonVariants({ variant: "outline", size: "icon" })}
  >
    <SunIcon
      class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 !transition-all dark:-rotate-90 dark:scale-0"
    />
    <MoonIcon
      class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 !transition-all dark:rotate-0 dark:scale-100"
    />
    <span class="sr-only">Toggle theme</span>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content align="end">
    <DropdownMenu.Item onclick={() => setMode("light")}>Light</DropdownMenu.Item>
    <DropdownMenu.Item onclick={() => setMode("dark")}>Dark</DropdownMenu.Item>
    <DropdownMenu.Item onclick={() => resetMode()}>System</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
```

Use `toggleMode()` to switch modes, `setMode(mode)` to set a specific mode, and `resetMode()` to use system preference.