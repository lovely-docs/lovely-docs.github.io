## Slider

Continuous range selector with single/multiple thumbs, vertical/horizontal orientation, discrete steps, and tick/thumb labels.

**Basic single slider:**
```svelte
let value = $state(50);
<Slider.Root type="single" bind:value>
  <Slider.Range />
  <Slider.Thumb index={0} />
</Slider.Root>
```

**Multiple thumbs with ticks:**
```svelte
let value = $state([25, 75]);
<Slider.Root type="multiple" bind:value step={1} min={0} max={10}>
  {#snippet children({ thumbItems, tickItems })}
    <Slider.Range />
    {#each thumbItems as { index }}
      <Slider.Thumb {index} />
    {/each}
    {#each tickItems as { index, value }}
      <Slider.Tick {index} />
      <Slider.TickLabel {index}>{value}</Slider.TickLabel>
    {/each}
  {/snippet}
</Slider.Root>
```

**Discrete steps (snap to values):**
```svelte
<Slider.Root type="single" step={[0, 4, 8, 16, 24]} />
```

**Vertical orientation:**
```svelte
<Slider.Root type="single" orientation="vertical" />
```

**State management:** Use `bind:value` for two-way binding or function binding for full control. Callbacks: `onValueChange` (continuous), `onValueCommit` (on release).

**Key props:** `type` (required), `min`/`max`, `step`, `orientation`, `dir` (RTL), `disabled`, `autoSort`, `trackPadding`