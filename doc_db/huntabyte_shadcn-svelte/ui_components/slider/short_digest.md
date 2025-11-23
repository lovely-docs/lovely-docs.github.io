## Slider

Range input component with single or multiple thumbs.

### Installation

```bash
npx shadcn-svelte@latest add slider -y -o
```

### Usage

Single value:
```svelte
<script lang="ts">
  import { Slider } from "$lib/components/ui/slider/index.js";
  let value = $state(33);
</script>
<Slider type="single" bind:value max={100} step={1} />
```

Multiple values (range):
```svelte
<script lang="ts">
  import { Slider } from "$lib/components/ui/slider/index.js";
  let value = $state([25, 75]);
</script>
<Slider type="multiple" bind:value max={100} step={1} />
```

Vertical:
```svelte
<Slider type="single" orientation="vertical" bind:value max={100} step={1} />
```

### Props

- `type`: "single" or "multiple"
- `bind:value`: reactive value binding
- `max`: maximum value
- `step`: increment size
- `orientation`: "vertical" for vertical layout
- `class`: CSS classes