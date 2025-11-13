## Progress Component

A UI component that displays task completion progress, typically as a progress bar.

### Installation

```bash
npm install shadcn-svelte@latest add progress
```

### Basic Usage

```svelte
<script lang="ts">
  import { Progress } from "$lib/components/ui/progress/index.js";
</script>

<Progress value={33} />
```

### Props

- `value` - Current progress value (number)
- `max` - Maximum value (default: 100)
- `class` - CSS classes for styling

### Example with State Update

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

The component is built on Bits UI and supports reactive value updates.