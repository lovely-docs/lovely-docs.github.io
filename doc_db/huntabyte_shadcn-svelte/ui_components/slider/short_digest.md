## Slider Component

Range input for selecting single or multiple values.

### Installation
```bash
pnpm dlx shadcn-svelte@latest add slider
```

### Usage
```svelte
<script lang="ts">
  import { Slider } from "$lib/components/ui/slider/index.js";
  let value = $state(33);
</script>
<Slider type="single" bind:value max={100} step={1} />
```

### Multiple Values & Vertical
```svelte
<Slider type="multiple" bind:value max={100} step={1} />
<Slider type="single" orientation="vertical" bind:value max={100} step={1} />
```