## DateField Component

Customizable date input with segment-based editing (day, month, year, hour, minute, second, timezone).

**Basic Structure:**
```svelte
<DateField.Root bind:value bind:placeholder>
  <DateField.Label>Birthday</DateField.Label>
  <DateField.Input>
    {#snippet children({ segments })}
      {#each segments as { part, value }}
        <DateField.Segment {part}>{value}</DateField.Segment>
      {/each}
    {/snippet}
  </DateField.Input>
</DateField.Root>
```

**Key Features:**
- **Placeholder:** Sets starting date and granularity (CalendarDate, CalendarDateTime, or ZonedDateTime). For birthdays, use leap year placeholder.
- **Validation:** `minValue`, `maxValue`, custom `validate()` function with `onInvalid()` callback
- **Granularity:** Control detail level with `'day' | 'hour' | 'minute' | 'second'`
- **Localization:** `locale` prop affects formatting
- **State:** Two-way binding (`bind:value`, `bind:placeholder`) or fully controlled with function bindings
- **Default Values:** Parse ISO 8601 strings with `parseDate()`, `parseDateTime()`, `parseZonedDateTime()`
- **Readonly Segments:** Prevent input on specific segments with `readonlySegments` array
- **Form Integration:** `name` prop on Input renders hidden input for form submission

**Data Attributes:** `data-invalid`, `data-disabled`, `data-readonly`, `data-segment` for styling