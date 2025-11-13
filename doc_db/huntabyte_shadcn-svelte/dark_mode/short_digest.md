## Dark Mode

Install `mode-watcher` and add `<ModeWatcher />` to your root layout. Use `toggleMode()` for a simple button or `setMode()`/`resetMode()` for dropdown menus with light/dark/system options. For Astro, add an inline script to prevent FUOC by reading theme from localStorage or system preference.