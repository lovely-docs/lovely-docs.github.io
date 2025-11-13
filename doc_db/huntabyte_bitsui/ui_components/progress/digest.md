## Progress Component

Shows the completion status of a task. Value only increases as the task progresses.

**When to use Progress vs Meter:**
- Progress: completion status of a task (file upload, installation, form completion)
- Meter: static measurement within a range that can fluctuate (CPU usage, battery level, volume)

**Basic Usage:**
```svelte
<script lang="ts">
  import { Progress } from "bits-ui";
</script>
<Progress.Root value={50} max={100} />
```

**Reusable Component Example:**
```svelte
<script lang="ts">
  import { Progress, useId } from "bits-ui";
  import type { ComponentProps } from "svelte";
  let {
    max = 100,
    value = 0,
    min = 0,
    label,
    valueLabel,
  }: ComponentProps<typeof Progress.Root> & {
    label: string;
    valueLabel: string;
  } = $props();
  const labelId = useId();
</script>
<div>
  <span id={labelId}>{label}</span>
  <span>{valueLabel}</span>
</div>
<Progress.Root
  aria-labelledby={labelId}
  aria-valuetext={valueLabel}
  {value}
  {min}
  {max}
/>
```

**Accessibility:**
- Use `aria-labelledby` if a visual label exists
- Use `aria-label` if no visual label is present

**Progress.Root Props:**
- `max` (number, default: 100): maximum value
- `min` (number, default: 0): minimum value
- `value` (number | null, default: 0): current value; null makes it indeterminate
- `ref` (HTMLDivElement): bindable reference to DOM element
- `children` (Snippet): content to render
- `child` (Snippet): render delegation for custom elements

**Data Attributes:**
- `data-value`: current value
- `data-state`: 'indeterminate' | 'determinate'
- `data-min`, `data-max`: min/max values
- `data-indeterminate`: present when value is null
- `data-progress-root`: present on root element