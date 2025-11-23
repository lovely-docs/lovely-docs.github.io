## Progress Component

Displays a visual indicator showing task completion progress, typically as a progress bar.

### Installation

```bash
npx shadcn-svelte@latest add progress -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Basic Usage

```svelte
<script lang="ts">
  import { Progress } from "$lib/components/ui/progress/index.js";
</script>

<Progress value={33} />
```

### With Dynamic Value

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

### Props

- `value`: Current progress value (number)
- `max`: Maximum value (default: 100)
- `class`: CSS classes for styling

The component is built on Bits UI's progress component (see Bits UI docs for full API reference).