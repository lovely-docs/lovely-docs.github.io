## TimeField

Customizable time input with segments for hour, minute, second, dayPeriod, timeZoneName.

**Basic usage:**
```svelte
<TimeField.Root bind:value bind:placeholder>
  <TimeField.Label>Time</TimeField.Label>
  <TimeField.Input>
    {#snippet children({ segments })}
      {#each segments as { part, value }}
        <TimeField.Segment {part}>{value}</TimeField.Segment>
      {/each}
    {/snippet}
  </TimeField.Input>
</TimeField.Root>
```

**Key features:**
- `placeholder`: starting time for segment cycling (not empty-state display)
- `value`: accepts Time, CalendarDateTime, or ZonedDateTime
- `granularity`: 'hour' | 'minute' | 'second' (controls rendered segments)
- `minValue`/`maxValue`: validation constraints
- `validate`: custom validation function returning error string(s)
- `onInvalid`: callback with reason ('min' | 'max' | 'custom') and message
- `locale`: affects formatting and placeholders
- `hourCycle`: '12' | '24'
- `hideTimeZone`: hide timezone segment for ZonedDateTime
- `readonlySegments`: array of segment parts to make readonly
- `disabled`, `readonly`: boolean flags
- `name`: for form submission (renders hidden input)

**State management:** Use `bind:value` and `bind:placeholder` for two-way binding, or function bindings for full control.

**Default values:** Parse ISO 8601 with `parseDateTime()` or `parseZonedDateTime()`.

**Segments:** Render differently based on `part` ('literal' for separators, others for editable parts). Data attributes: `data-segment`, `data-invalid`, `data-disabled`, `data-readonly`.