## Dark Mode in Astro

Uses Tailwind CSS `class` strategy by toggling the `dark` class on the `html` element.

### Inline Script Approach
Create a script that reads theme from `localStorage` or system preference, applies `dark` class on load (prevents FUOC), and syncs class changes back to `localStorage`.

### mode-watcher Approach
Install `npm i mode-watcher@0.5.1` and add `<ModeWatcher client:load />` to your page.

### Toggle Components
Light switch: `<Button onclick={toggleMode}>` with rotating sun/moon icons
Dropdown menu: `<DropdownMenu>` with `setMode("light")`, `setMode("dark")`, `resetMode()` options

Add toggle to page with `client:load` directive.