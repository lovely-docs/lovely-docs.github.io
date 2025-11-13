## TimeField Component

A customizable alternative to the native `<input type="time">` element for selecting times with flexible segment-based input.

### Structure
```svelte
<TimeField.Root>
  <TimeField.Label>Check-in time</TimeField.Label>
  <TimeField.Input>
    {#snippet children({ segments })}
      {#each segments as { part, value }}
        <TimeField.Segment {part}>
          {value}
        </TimeField.Segment>
      {/each}
    {/snippet}
  </TimeField.Input>
</TimeField.Root>
```

### Key Concepts

**Segments**: Represent parts of time (hour, minute, second, dayPeriod, timeZoneName) or "literal" separators. Style literals differently from editable segments.

**Placeholder**: The starting time when cycling through segments, not the empty state display. Defaults to 12:00 AM or 00:00 depending on hour cycle.

**Value Types**: Accepts `Time`, `CalendarDateTime`, or `ZonedDateTime` from `@internationalized/date`.

### State Management

Two-way binding:
```svelte
let myValue = $state(new Time(12, 30));
<TimeField.Root bind:value={myValue} />
```

Fully controlled with function bindings:
```svelte
<TimeField.Root bind:value={getValue, setValue} />
```

### Validation

- `minValue` / `maxValue`: Set time boundaries
- `validate`: Custom validation function returning error strings or undefined
- `onInvalid`: Callback with reason ('min' | 'max' | 'custom') and optional message

```svelte
const validate = (time) => time.hour === 12 ? "Cannot be 12:00 PM" : undefined;
const onInvalid = (reason, msg) => { /* handle error */ };
<MyTimeField {validate} {onInvalid} />
```

### Configuration

- `granularity`: 'hour' | 'minute' | 'second' (default: 'minute') - determines which segments render
- `locale`: Affects formatting and placeholders (default: 'en-US')
- `hourCycle`: '12' | '24' - defaults to locale preference
- `hideTimeZone`: Hide timezone segment for ZonedDateTime values
- `disabled` / `readonly`: Disable or make field read-only
- `readonlySegments`: Array of specific segments to make read-only

### Default Values

Parse ISO 8601 strings using `parseDateTime` or `parseZonedDateTime`:
```svelte
const date = "2024-08-03T15:15";
let value = $state(parseDateTime(date));
<TimeField.Root {value} />
```

### API

**TimeField.Root**: Main component with value/placeholder binding, validation props, and configuration.

**TimeField.Input**: Container with `name` prop for form submission and `segments` snippet providing `{ part, value }` array.

**TimeField.Segment**: Individual segment with required `part` prop. Data attributes: `data-segment`, `data-invalid`, `data-disabled`, `data-readonly`.

**TimeField.Label**: Label element with data attributes for invalid/disabled states.