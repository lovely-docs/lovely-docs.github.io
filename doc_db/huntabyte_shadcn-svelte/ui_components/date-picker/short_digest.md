## Date Picker

Composite component combining Popover + Calendar/RangeCalendar for date selection.

**Basic single date picker:**
```svelte
<script lang="ts">
  import { DateFormatter, type DateValue, getLocalTimeZone } from "@internationalized/date";
  import { Calendar } from "$lib/components/ui/calendar/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  
  const df = new DateFormatter("en-US", { dateStyle: "long" });
  let value = $state<DateValue | undefined>();
</script>

<Popover.Root>
  <Popover.Trigger>{value ? df.format(value.toDate(getLocalTimeZone())) : "Pick a date"}</Popover.Trigger>
  <Popover.Content class="w-auto p-0">
    <Calendar type="single" bind:value />
  </Popover.Content>
</Popover.Root>
```

**Date range picker:** Use `RangeCalendar` with `numberOfMonths={2}` and bind to `DateRange` object with `start`/`end` properties.

**With presets:** Add `Select` component in Popover.Content alongside Calendar to offer quick date options (Today, Tomorrow, etc.).

**Form integration:** Use with sveltekit-superforms, bind calendar value to form field, set `minValue`/`maxValue` constraints.