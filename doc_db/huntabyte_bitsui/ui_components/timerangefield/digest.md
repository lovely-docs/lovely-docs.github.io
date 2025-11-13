## TimeRangeField Component

Combines two Time Field components to create a time range input with start and end times.

### Basic Structure
```svelte
<TimeRangeField.Root>
  <TimeRangeField.Label>Working Hours</TimeRangeField.Label>
  {#each ["start", "end"] as const as type}
    <TimeRangeField.Input {type}>
      {#snippet children({ segments })}
        {#each segments as { part, value }}
          <TimeRangeField.Segment {part}>
            {value}
          </TimeRangeField.Segment>
        {/each}
      {/snippet}
    </TimeRangeField.Input>
  {/each}
</TimeRangeField.Root>
```

### State Management

**Two-way binding:**
```svelte
<script lang="ts">
  import { TimeRangeField, type TimeRange } from "bits-ui";
  import { Time } from "@internationalized/date";
  let myValue = $state<TimeRange>({
    start: new Time(12, 30),
    end: new Time(12, 30),
  });
</script>
<TimeRangeField.Root bind:value={myValue}>
  <!-- ... -->
</TimeRangeField.Root>
```

**Fully controlled with function binding:**
```svelte
<script lang="ts">
  import { TimeRangeField, type TimeRange } from "bits-ui";
  let myValue = $state<TimeRange | undefined>({
    start: undefined,
    end: undefined,
  });
  function getValue() { return myValue; }
  function setValue(newValue: TimeRange | undefined) { myValue = newValue; }
</script>
<TimeRangeField.Root bind:value={getValue, setValue}>
  <!-- ... -->
</TimeRangeField.Root>
```

Same patterns apply to `placeholder` state.

### Key Props (TimeRangeField.Root)

- `value` - TimeRange object with start/end TimeValue
- `onValueChange` - Callback when range changes
- `placeholder` - TimeValue for default segment display
- `minValue`, `maxValue` - Validation bounds
- `granularity` - 'hour' | 'minute' | 'second' (default: 'minute')
- `hourCycle` - '12' | '24'
- `locale` - Formatting locale (default: en-US)
- `hideTimeZone` - Hide timezone segment for ZonedDateTime
- `disabled`, `readonly`, `required` - Field states
- `readonlySegments` - Array of segments to lock from editing
- `validate` - Custom validation function
- `onInvalid` - Callback for validation failures
- `onStartValueChange`, `onEndValueChange` - Individual time callbacks

### Components

**TimeRangeField.Input** - Container for segments, requires `type` prop ('start' | 'end'), optional `name` for form submission

**TimeRangeField.Segment** - Individual segment, requires `part` prop (hour | minute | second | dayPeriod | timeZoneName | literal)

**TimeRangeField.Label** - Label element

Data attributes available: `data-invalid`, `data-disabled`, `data-segment`, etc.