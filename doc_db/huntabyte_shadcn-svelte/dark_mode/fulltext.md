

## Pages

### dark-mode-astro
Implement dark mode in Astro using Tailwind's class strategy with mode-watcher and localStorage persistence.

Add inline script to manage `dark` class on `html` element using `localStorage` and system preference. Install `mode-watcher@0.5.1`, add `<ModeWatcher client:load />`, then create a toggle using `toggleMode()` or `setMode()`/`resetMode()` functions with `client:load` directive.

### dark-mode
Implement dark mode in Svelte using mode-watcher with ModeWatcher component and toggle controls.

Install `mode-watcher` and add `ModeWatcher` component to root layout. Use `toggleMode()` for simple toggle or `setMode()`/`resetMode()` for dropdown with light/dark/system options.

