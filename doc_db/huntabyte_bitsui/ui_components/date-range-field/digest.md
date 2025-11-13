## DateRangeField Component

A component that combines two Date Field components to create a date range input with separate start and end date segments.

### Structure
```svelte
<DateRangeField.Root>
  <DateRangeField.Label>Check-in date</DateRangeField.Label>
  {#each ["start", "end"] as const as type}
    <DateRangeField.Input {type}>
      {#snippet children({ segments })}
        {#each segments as { part, value }}
          <DateRangeField.Segment {part}>
            {value}
          </DateRangeField.Segment>
        {/each}
      {/snippet}
    </DateRangeField.Input>
  {/each}
</DateRangeField.Root>
```

### State Management

**Value binding** - Use `bind:value` for two-way binding or function bindings for full control:
```svelte
<script lang="ts">
  import { DateRangeField, type DateRange } from "bits-ui";
  import { CalendarDateTime } from "@internationalized/date";
  let myValue = $state<DateRange>({
    start: new CalendarDateTime(2024, 8, 3, 12, 30),
    end: new CalendarDateTime(2024, 8, 4, 12, 30),
  });
</script>
<DateRangeField.Root bind:value={myValue}>
  <!-- ... -->
</DateRangeField.Root>
```

**Placeholder binding** - Similar pattern for placeholder state management.

### Key Props (DateRangeField.Root)
- `value` - DateRange object with start/end DateValue properties
- `placeholder` - DateValue for segment initialization when no value exists
- `minValue`, `maxValue` - Date constraints
- `granularity` - 'day' | 'hour' | 'minute' | 'second' (defaults to 'day' for CalendarDate)
- `validate` - Custom validation function
- `onInvalid` - Callback for validation failures
- `disabled`, `readonly` - Field state
- `hourCycle` - '12' | '24' hour format
- `locale` - Formatting locale (default: en-US)
- `onStartValueChange`, `onEndValueChange` - Callbacks for individual date changes

### Components
- **DateRangeField.Input** - Container for segments, requires `type` prop ('start' | 'end'), optional `name` for form submission
- **DateRangeField.Segment** - Individual date part, requires `part` prop (month, day, year, hour, minute, second, dayPeriod, timeZoneName, literal)
- **DateRangeField.Label** - Label element