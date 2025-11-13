## Setup Dark Mode in Astro

Use Tailwind CSS `class` strategy for dark mode toggling.

### Inline Theme Script
Add an inline script to your Astro page that:
- Reads theme preference from `localStorage` or system preference
- Adds/removes `dark` class on `html` element
- Prevents FUOC by running before page renders

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
```

### Add mode-watcher
Install `mode-watcher@0.5.1` and add `<ModeWatcher client:load />` to your page.

### Create Mode Toggle
Use `toggleMode()` for a simple button or `setMode()`/`resetMode()` for a dropdown menu with light/dark/system options. Import icons from `@lucide/svelte` and use `client:load` directive on the toggle component.