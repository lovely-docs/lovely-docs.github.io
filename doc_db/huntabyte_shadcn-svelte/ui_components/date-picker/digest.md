## Date Picker

A composable date picker component built from Popover and Calendar (or RangeCalendar) components.

### Installation
Requires installation of Popover, Calendar, and RangeCalendar components.

### Basic Usage
```svelte
<script lang="ts">
  import CalendarIcon from "@lucide/svelte/icons/calendar";
  import { DateFormatter, type DateValue, getLocalTimeZone } from "@internationalized/date";
  import { cn } from "$lib/utils.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Calendar } from "$lib/components/ui/calendar/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  
  const df = new DateFormatter("en-US", { dateStyle: "long" });
  let value = $state<DateValue>();
</script>

<Popover.Root>
  <Popover.Trigger>
    {#snippet child({ props })}
      <Button variant="outline" class={cn("w-[280px] justify-start text-left font-normal", !value && "text-muted-foreground")} {...props}>
        <CalendarIcon class="mr-2 size-4" />
        {value ? df.format(value.toDate(getLocalTimeZone())) : "Select a date"}
      </Button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content class="w-auto p-0">
    <Calendar bind:value type="single" initialFocus />
  </Popover.Content>
</Popover.Root>
```

### Date Range Picker
Use RangeCalendar with `numberOfMonths={2}` to display two months side-by-side. Track `startValue` separately via `onStartValueChange` callback for intermediate selection states.

### With Presets
Combine a Select component with Calendar inside Popover.Content to provide quick date options (Today, Tomorrow, In 3 days, In a week) alongside manual calendar selection.

### Form Integration
Use with sveltekit-superforms and zod validation. Set Calendar `minValue` and `maxValue` props for constraints. Update form data via `onValueChange` callback and store the date string in a hidden input.