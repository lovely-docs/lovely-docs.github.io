## Dark Mode in Astro

Astro uses Tailwind CSS's `class` strategy for dark mode toggling by adding/removing the `dark` class on the `html` element.

### Inline Theme Script

Create a script in your Astro page that:
- Reads theme preference from `localStorage` or system preference via `prefers-color-scheme` media query
- Applies the `dark` class to `document.documentElement` on initial load (prevents FUOC)
- Observes class changes on the html element and syncs them to `localStorage`

```astro
---
import "$lib/styles/app.css";
---
<script is:inline>
  const isBrowser = typeof localStorage !== 'undefined';
  const getThemePreference = () => {
    if (isBrowser && localStorage.getItem('theme')) {
      return localStorage.getItem('theme');
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark' : 'light';
  };
  const isDark = getThemePreference() === 'dark';
  document.documentElement.classList[isDark ? 'add' : 'remove']('dark');
  if (isBrowser) {
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
  }
</script>
<html lang="en">
 <body>
      <h1>Astro</h1>
 </body>
</html>
```

### Using mode-watcher

Install mode-watcher:
```bash
npm i mode-watcher@0.5.1
```

Add the `ModeWatcher` component with `client:load` directive to enable theme tracking:
```astro
---
import { ModeWatcher } from "mode-watcher";
---
<html lang="en">
 <body>
      <ModeWatcher client:load />
 </body>
</html>
```

### Mode Toggle Components

Create a light switch toggle:
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

Add the toggle to your page with `client:load`:
```astro
---
import { ModeWatcher } from "mode-watcher";
import ModeToggle from "$lib/components/mode-toggle.svelte";
---
<html lang="en">
 <body>
      <ModeWatcher client:load />
      <ModeToggle client:load />
 </body>
</html>
```