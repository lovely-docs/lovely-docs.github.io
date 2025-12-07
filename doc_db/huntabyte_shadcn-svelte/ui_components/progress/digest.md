## Progress

Displays a progress bar indicator showing task completion.

### Installation

```bash
npx shadcn-svelte@latest add progress -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Usage

```svelte
<script lang="ts">
  import { onMount } from "svelte";
  import { Progress } from "$lib/components/ui/progress/index.js";
  
  let value = $state(13);
  
  onMount(() => {
    const timer = setTimeout(() => (value = 66), 500);
    return () => clearTimeout(timer);
  });
</script>

<Progress {value} max={100} class="w-[60%]" />
```

The component accepts:
- `value`: current progress value (number)
- `max`: maximum value (default: 100)
- `class`: CSS classes for styling

Reference: Bits UI Progress component documentation and API reference available in upstream docs.