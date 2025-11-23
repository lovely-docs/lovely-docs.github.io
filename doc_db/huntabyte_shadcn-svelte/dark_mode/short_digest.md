## Dark Mode Setup

Install `mode-watcher`:
```bash
npm i mode-watcher
```

Add `ModeWatcher` to root layout:
```svelte
<script lang="ts">
  import { ModeWatcher } from "mode-watcher";
</script>
<ModeWatcher />
```

Create toggle with `toggleMode()`, `setMode()`, or `resetMode()` from mode-watcher. Use Lucide icons (Sun/Moon) with dark mode transitions for UI.