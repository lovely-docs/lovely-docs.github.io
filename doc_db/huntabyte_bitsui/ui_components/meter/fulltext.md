# Meter Documentation

Displays a static measurement within a known range.

This is a documentation section that potentially contains examples, demos, and other useful information related to a specific part of Bits UI. When helping users with this documentation, you can ignore the classnames applied to the demos unless they are relevant to the user's issue.

Copy Page

```svelte
<script lang="ts">
  import { Meter, useId } from "bits-ui";
  let value = $state(2000);
  const labelId = useId();
  const max = 4000;
  const min = 0;
  const usedPercentage = $derived((value / max) * 100);
  const percentageRemaining = $derived(100 - usedPercentage);
  const color = $derived.by(() => {
    if (percentageRemaining < 15) return "bg-red-500 dark:bg-red-400";
    if (percentageRemaining < 35) return "bg-orange-500 dark:bg-orange-400";
    if (percentageRemaining < 50) return "bg-yellow-500 dark:bg-yellow-400";
    return "bg-green-500 dark:bg-green-400";
  });
</script>
<div class="flex w-[60%] flex-col gap-2">
  <div class="flex items-center justify-between text-sm font-medium">
    <span id={labelId}> Tokens used </span>
    <span>{value} / {max}</span>
  </div>
  <Meter.Root
    aria-labelledby={labelId}
    aria-valuetext="{value} out of {max}"
    {value}
    {min}
    {max}
    class="bg-dark-10 shadow-mini-inset relative h-[15px] overflow-hidden rounded-full"
  >
    <div
      class="shadow-mini-inset h-full w-full flex-1 rounded-full transition-all duration-1000 ease-in-out {color}"
      style="transform: translateX(-{100 - (100 * (value ?? 0)) / max}%)"
    ></div>
  </Meter.Root>
</div>
```

While often visually similar, meters and [Progress](/docs/components/progress) bars serve distinct purposes:

**Meter**:

- Displays a **static measurement** within a known range (0-100)
- Value can fluctuate up/down based on real-time measurements
- Examples: CPU usage, battery level, sound volume
- Use when showing current state relative to capacity

**Progress bar**:

- Shows **completion status** of a task
- Value only increases as task progresses
- Examples: File upload, installation status, form completion
- Use when tracking advancement toward completion

If a progress bar better fits your requirements, check out the [Progress](/docs/components/progress) component.

## Structure

```svelte
<script lang="ts">
  import { Meter } from "bits-ui";
</script>
<Meter.Root />
```

## Reusable Components

It's recommended to use the `Meter` primitive to create your own custom meter component that can be used throughout your application. In the example below, we're using the `Meter` primitive to create a more comprehensive meter component.

```svelte
<script lang="ts">
  import { Meter, useId } from "bits-ui";
  import type { ComponentProps } from "svelte";
  let {
    max = 100,
    value = 0,
    min = 0,
    label,
    valueLabel,
  }: ComponentProps<typeof Meter.Root> & {
    label: string;
    valueLabel: string;
  } = $props();
  const labelId = useId();
</script>
<div>
  <span id={labelId}> {label} </span>
  <span>{valueLabel}</span>
</div>
<Meter.Root
  aria-labelledby={labelId}
  aria-valuetext={valueLabel}
  {value}
  {min}
  {max}
/>
```

You can then use the `MyMeter` component in your application like so:

+page.svelte

```svelte
<script lang="ts">
  import MyMeter from "$lib/components/MyMeter.svelte";
  let value = $state(3000);
  const max = 4000;
</script>
<MyMeter label="Tokens used" valueLabel="{value} / {max}" {value} {max} />
```

Of course, you'd want to apply your own styles and other customizations to the `MyMeter` component to fit your application's design.



## Accessibility

If a visual label is used, the ID of the label element should be pass via the `aria-labelledby` prop to `Meter.Root`. If no visual label is used, the `aria-label` prop should be used to provide a text description of the progress bar.

Assistive technologies often present `aria-valuenow` as a percentage. If conveying the value of the meter only in terms of a percentage would not be user friendly, the `aria-valuetext` property should be set to a string that makes the meter value understandable. For example, a battery meter value might be conveyed as `aria-valuetext="50% (6 hours) remaining"`. \[[source](https://www.w3.org/WAI/ARIA/apg/patterns/meter/)]

## API Reference

### Meter.Root

The meter component.

| Property        | Type                                                                  | Description                                                                                                                                   | Details |
| --------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `max`           | `number`                                                              | The maximum value of the meter.`Default: 100`                                                                                                 |         |
| `min`           | `number`                                                              | The minimum value of the meter.`Default: 0`                                                                                                   |         |
| `value`         | `number`                                                              | The current value of the meter.`Default: 0`                                                                                                   |         |
| `ref` $bindable | `HTMLDivElement`                                                      | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`      | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`         | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute    | Value | Description                     | Details |
| ----------------- | ----- | ------------------------------- | ------- |
| `data-value`      | `''`  | The current value of the meter. |         |
| `data-min`        | `''`  | The minimum value of the meter. |         |
| `data-max`        | `''`  | The maximum value of the meter. |         |
| `data-meter-root` | `''`  | Present on the root element.    |         |

[Previous Menubar](/docs/components/menubar) [Next Navigation Menu](/docs/components/navigation-menu)