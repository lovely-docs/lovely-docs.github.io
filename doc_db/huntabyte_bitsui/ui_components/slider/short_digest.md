## Slider

Continuous/discrete range selector with single or multiple thumbs, vertical orientation, and custom labels.

### Basic Single Slider
```svelte
<script lang="ts">
  import { Slider } from "bits-ui";
  let value = $state(50);
</script>

<Slider.Root type="single" bind:value>
  <span class="track"><Slider.Range /></span>
  <Slider.Thumb index={0} />
</Slider.Root>
```

### Multiple Thumbs
```svelte
<script lang="ts">
  let value = $state([25, 75]);
</script>

<Slider.Root type="multiple" bind:value>
  {#snippet children({ thumbItems })}
    <Slider.Range />
    {#each thumbItems as { index }}
      <Slider.Thumb {index} />
    {/each}
  {/snippet}
</Slider.Root>
```

### Discrete Steps & Labels
```svelte
<Slider.Root type="single" step={[0, 4, 8, 16, 24]} bind:value>
  {#snippet children({ tickItems })}
    {#each tickItems as { index, value } (index)}
      <Slider.Tick {index} />
      <Slider.TickLabel {index}>{value}</Slider.TickLabel>
    {/each}
  {/snippet}
</Slider.Root>
```

### Thumb Labels
```svelte
<Slider.Root type="multiple" value={[10, 50]}>
  <Slider.Range />
  <Slider.Thumb index={0} />
  <Slider.ThumbLabel index={0}>Min</Slider.ThumbLabel>
  <Slider.Thumb index={1} />
  <Slider.ThumbLabel index={1}>Max</Slider.ThumbLabel>
</Slider.Root>
```

### Key Props
- `type`: 'single' | 'multiple' (required)
- `value`: number | number[] (bindable)
- `min`, `max`: bounds (0-100 default)
- `step`: number | number[] for discrete snapping
- `orientation`: 'horizontal' | 'vertical'
- `onValueChange`, `onValueCommit`: callbacks
- `autoSort`: auto-sort multiple values (true default)
- `disabled`, `dir`, `thumbPositioning`, `trackPadding`