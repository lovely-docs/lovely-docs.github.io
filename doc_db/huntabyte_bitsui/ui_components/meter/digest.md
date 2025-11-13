## Meter Component

Displays a static measurement within a known range. Value can fluctuate up/down based on real-time measurements (e.g., CPU usage, battery level, sound volume).

**Meter vs Progress Bar:**
- Meter: static measurement within known range, value fluctuates, shows current state relative to capacity
- Progress Bar: completion status of task, value only increases, tracks advancement toward completion

**Basic Usage:**
```svelte
<script lang="ts">
  import { Meter, useId } from "bits-ui";
  let value = $state(2000);
  const labelId = useId();
  const max = 4000;
</script>

<div>
  <span id={labelId}>Tokens used</span>
  <span>{value} / {max}</span>
</div>
<Meter.Root
  aria-labelledby={labelId}
  aria-valuetext="{value} out of {max}"
  value={value}
  min={0}
  max={max}
  class="h-[15px] rounded-full"
>
  <div style="transform: translateX(-{100 - (100 * value) / max}%)"></div>
</Meter.Root>
```

**Reusable Component Pattern:**
```svelte
<script lang="ts">
  import { Meter, useId } from "bits-ui";
  import type { ComponentProps } from "svelte";
  let { max = 100, value = 0, min = 0, label, valueLabel }: ComponentProps<typeof Meter.Root> & { label: string; valueLabel: string } = $props();
  const labelId = useId();
</script>

<span id={labelId}>{label}</span>
<span>{valueLabel}</span>
<Meter.Root aria-labelledby={labelId} aria-valuetext={valueLabel} {value} {min} {max} />
```

**Accessibility:**
- Use `aria-labelledby` if visual label exists, otherwise use `aria-label`
- Set `aria-valuetext` to make value understandable (e.g., "50% (6 hours) remaining")

**API - Meter.Root:**
- `max` (number, default: 100): maximum value
- `min` (number, default: 0): minimum value
- `value` (number, default: 0): current value
- `ref` (bindable HTMLDivElement): underlying DOM element
- `children` (Snippet): content to render
- `child` (Snippet): render delegation for custom elements

Data attributes: `data-value`, `data-min`, `data-max`, `data-meter-root`