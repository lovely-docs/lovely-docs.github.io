## Slider

An input component where users select a value from a given range.

### Installation

```bash
npx shadcn-svelte@latest add slider -y -o
```

The `-y` flag skips the confirmation prompt and `-o` overwrites existing files.

### Basic Usage

Single value slider:

```svelte
<script lang="ts">
  import { Slider } from "$lib/components/ui/slider/index.js";
  let value = $state(33);
</script>
<Slider type="single" bind:value max={100} step={1} />
```

### Multiple Thumbs

Range slider with two handles:

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

### Props

- `type`: "single" or "multiple" - determines if one or multiple thumbs are used
- `bind:value`: reactive binding to the selected value(s)
- `max`: maximum value of the range
- `step`: increment step size
- `orientation`: "vertical" for vertical layout (default is horizontal)
- `class`: CSS classes for styling

Reference: Bits UI Slider documentation and API reference available in external docs.