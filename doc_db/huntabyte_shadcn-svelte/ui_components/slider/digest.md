## Slider Component

A range input component where users select a value or values within a given range.

### Installation

```bash
pnpm dlx shadcn-svelte@latest add slider
```

### Basic Usage

```svelte
<script lang="ts">
  import { Slider } from "$lib/components/ui/slider/index.js";
  let value = $state(33);
</script>
<Slider type="single" bind:value max={100} step={1} />
```

### Multiple Thumbs (Range Selection)

```svelte
<script lang="ts">
  import { Slider } from "$lib/components/ui/slider/index.js";
  let value = $state([25, 75]);
</script>
<Slider type="multiple" bind:value max={100} step={1} />
```

### Vertical Orientation

```svelte
<script lang="ts">
  import { Slider } from "$lib/components/ui/slider/index.js";
  let value = $state(50);
</script>
<Slider type="single" orientation="vertical" bind:value max={100} step={1} />
```

### Key Props
- `type`: "single" or "multiple" for single or range selection
- `bind:value`: Reactive binding to selected value(s)
- `max`: Maximum value (default 100)
- `step`: Increment step size
- `orientation`: "vertical" for vertical layout
- `class`: CSS classes for styling