## DateField Component

A customizable alternative to the native `<input type="date">` element that provides segment-based date input with flexible formatting and validation.

### Structure
```svelte
<DateField.Root>
  <DateField.Label>Check-in date</DateField.Label>
  <DateField.Input>
    {#snippet children({ segments })}
      {#each segments as { part, value }}
        <DateField.Segment {part}>{value}</DateField.Segment>
      {/each}
    {/snippet}
  </DateField.Input>
</DateField.Root>
```

### Segments
Segments represent parts of the date (day, month, year, hour, minute, second) or `"literal"` separators. Style them differently based on type:
```svelte
{#if part === "literal"}
  <DateField.Segment {part} class="text-muted-foreground">{value}</DateField.Segment>
{:else}
  <DateField.Segment {part} class="hover:bg-muted focus:bg-muted">{value}</DateField.Segment>
{/if}
```

### Placeholder & Granularity
The `placeholder` prop sets the starting date for cycling through segments and determines granularity. Use `CalendarDate` for dates only, `CalendarDateTime` for dates with time, or `ZonedDateTime` for timezone-aware dates. For birthdays, use a leap year placeholder so users born on Feb 29 can select correctly.

```svelte
<DateField.Root placeholder={new CalendarDateTime(2024, 8, 3, 12, 30)}>
```

The `granularity` prop controls which segments render: `'day'`, `'hour'`, `'minute'`, or `'second'`.

### State Management
Two-way binding: `bind:value={myValue}` and `bind:placeholder={myPlaceholder}`

Fully controlled with function bindings:
```svelte
<DateField.Root bind:value={getValue, setValue}>
```

### Default Values
Parse ISO 8601 strings using `parseDate()`, `parseDateTime()`, or `parseZonedDateTime()` from `@internationalized/date`:
```svelte
let value = $state(parseDate("2024-08-03"));
<DateField.Root {value}>
```

### Validation
- `minValue` and `maxValue` props enforce date bounds
- `validate` prop accepts custom validation function returning error strings or undefined
- `onInvalid` callback receives reason (`'min'`, `'max'`, or `'custom'`) and optional error message(s)

```svelte
function validate(date: DateValue) {
  return date.day === 1 ? "Cannot be first day of month" : undefined;
}
<DateField.Root {validate} {onInvalid}>
```

### Localization
Use `locale` prop to set formatting: `<DateField.Root locale="de">`

### Additional Props
- `required`: boolean
- `disabled`: boolean
- `readonly`: boolean
- `readonlySegments`: array of specific segments to lock
- `hourCycle`: `'12'` or `'24'`
- `hideTimeZone`: boolean
- `errorMessageId`: id of error message container
- `name`: for form submission (renders hidden input)