## Progress Component

Displays task completion progress as a progress bar.

### Installation
```bash
npm install shadcn-svelte@latest add progress
```

### Usage
```svelte
<script lang="ts">
  import { Progress } from "$lib/components/ui/progress/index.js";
  let value = $state(13);
</script>
<Progress {value} max={100} class="w-[60%]" />
```

Props: `value`, `max`, `class`