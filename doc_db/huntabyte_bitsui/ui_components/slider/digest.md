## Slider Component

A primitive component for selecting values from a continuous or discrete range with support for single/multiple thumbs, vertical orientation, and custom labels.

### Basic Usage

```svelte
<script lang="ts">
  import { Slider } from "bits-ui";
  let value = $state(50);
</script>

<Slider.Root type="single" bind:value>
  <span class="track">
    <Slider.Range />
  </span>
  <Slider.Thumb index={0} />
</Slider.Root>
```

### State Management

Two-way binding with `bind:value` for automatic synchronization, or function bindings for complete control:

```svelte
<Slider.Root type="single" bind:value={getValue, setValue}>
  <!-- ... -->
</Slider.Root>
```

### Multiple Thumbs

Set `type="multiple"` with an array value to render multiple draggable thumbs:

```svelte
<script lang="ts">
  let value = $state([25, 75]);
</script>

<Slider.Root type="multiple" bind:value>
  {#snippet children({ thumbItems })}
    <Slider.Range />
    {#each thumbItems as { index } (index)}
      <Slider.Thumb {index} />
    {/each}
  {/snippet}
</Slider.Root>
```

### Discrete Steps

Pass an array to `step` to snap to specific values instead of continuous stepping:

```svelte
<Slider.Root type="single" step={[0, 4, 8, 16, 24]} bind:value>
  <!-- ... -->
</Slider.Root>
```

### Ticks and Labels

Use `tickItems` snippet prop to render tick marks and labels at intervals:

```svelte
<Slider.Root type="single" step={1} min={0} max={10}>
  {#snippet children({ tickItems })}
    {#each tickItems as { index, value } (index)}
      <Slider.Tick {index} />
      <Slider.TickLabel {index} position="top">{value}</Slider.TickLabel>
    {/each}
  {/snippet}
</Slider.Root>
```

### Thumb Labels

Render labels positioned relative to thumbs using `Slider.ThumbLabel`:

```svelte
<Slider.Root type="multiple" value={[10, 50]}>
  <Slider.Range />
  <Slider.Thumb index={0} />
  <Slider.ThumbLabel index={0} position="top">Min</Slider.ThumbLabel>
  <Slider.Thumb index={1} />
  <Slider.ThumbLabel index={1} position="top">Max</Slider.ThumbLabel>
</Slider.Root>
```

### Vertical Orientation

```svelte
<Slider.Root type="single" orientation="vertical">
  <!-- ... -->
</Slider.Root>
```

### Key Props

- `type`: 'single' | 'multiple' (required)
- `value`: number or number[] (bindable)
- `min`, `max`: range bounds (default 0-100)
- `step`: number or number[] for discrete values
- `orientation`: 'horizontal' | 'vertical'
- `dir`: 'ltr' | 'rtl'
- `autoSort`: auto-sort multiple values (default true)
- `disabled`: disable interaction
- `onValueChange`: callback during drag
- `onValueCommit`: callback when drag ends
- `thumbPositioning`: 'exact' | 'contain' (default 'contain')
- `trackPadding`: percentage padding for SSR-friendly thumb containment

### Form Integration

No hidden input by default. Manually add hidden inputs for form submission:

```svelte
<form method="POST">
  <Slider.Root type="multiple" bind:value={range}>
    <!-- ... -->
  </Slider.Root>
  <input type="hidden" name="min" value={range[0]} />
  <input type="hidden" name="max" value={range[1]} />
  <button type="submit">Submit</button>
</form>
```

### Data Attributes

- `data-orientation`: 'horizontal' | 'vertical'
- `data-disabled`: present when disabled
- `data-active`: present on thumb when grabbed
- `data-bounded`: present on tick when ≤ current value
- `data-selected`: present on tick matching thumb value