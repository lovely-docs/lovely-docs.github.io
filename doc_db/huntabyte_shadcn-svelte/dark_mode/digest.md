## Dark Mode Implementation

Dark mode is implemented using Tailwind CSS's `class` strategy with the `mode-watcher` library for theme management and persistence.

### Setup

Install `mode-watcher`:
```bash
npm i mode-watcher
```

Add `ModeWatcher` component to your root layout:
```svelte
<script lang="ts">
  import { ModeWatcher } from "mode-watcher";
</script>
<ModeWatcher />
```

### Mode Toggle

Simple toggle button that switches between light and dark:
```svelte
<script lang="ts">
  import { toggleMode } from "mode-watcher";
  import { Button } from "$lib/components/ui/button";
</script>
<Button onclick={toggleMode} variant="outline" size="icon">
  <SunIcon class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 dark:-rotate-90 dark:scale-0" />
  <MoonIcon class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
</Button>
```

Dropdown menu with light/dark/system options:
```svelte
<script lang="ts">
  import { resetMode, setMode } from "mode-watcher";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
</script>
<DropdownMenu.Root>
  <DropdownMenu.Trigger>Theme</DropdownMenu.Trigger>
  <DropdownMenu.Content align="end">
    <DropdownMenu.Item onclick={() => setMode("light")}>Light</DropdownMenu.Item>
    <DropdownMenu.Item onclick={() => setMode("dark")}>Dark</DropdownMenu.Item>
    <DropdownMenu.Item onclick={() => resetMode()}>System</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
```

### Astro Support

For Astro projects, add an inline script to prevent FUOC (Flash of Unstyled Content):
```astro
<script is:inline>
  const getThemePreference = () => {
    if (localStorage.getItem('theme')) {
      return localStorage.getItem('theme');
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };
  const isDark = getThemePreference() === 'dark';
  document.documentElement.classList[isDark ? 'add' : 'remove']('dark');
</script>
```

Then add `<ModeWatcher client:load />` to your page.