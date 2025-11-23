## Progress Component

Visual task completion indicator displayed as a progress bar.

### Installation

```bash
npx shadcn-svelte@latest add progress -y -o
```

### Usage

```svelte
<script lang="ts">
  import { Progress } from "$lib/components/ui/progress/index.js";
  let value = $state(13);
</script>

<Progress {value} max={100} class="w-[60%]" />
```

Props: `value` (current progress), `max` (maximum value, default 100), `class` (styling).