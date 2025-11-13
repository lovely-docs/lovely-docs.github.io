## RangeCalendar Component

A calendar component for selecting date ranges with customizable constraints and formatting.

### Key Features

- **Range Selection**: Select start and end dates with visual highlighting of the range
- **Min/Max Days**: Constrain range length with `minDays` and `maxDays` props
- **Date Constraints**: Disable specific dates via `isDateDisabled()` or mark as unavailable with `isDateUnavailable()`
- **Exclude Disabled**: Use `excludeDisabled` to automatically reset range if any date becomes disabled
- **Multi-Month Display**: Show multiple months simultaneously with `numberOfMonths`
- **Customizable Navigation**: Previous/next buttons with optional paged navigation
- **Formatting Options**: Control weekday format (`narrow`/`short`/`long`), month/year formatting, and week start day

### Core Components

- `RangeCalendar.Root`: Main container with date range state management
- `RangeCalendar.Header/Heading`: Navigation header with prev/next buttons
- `RangeCalendar.Grid/GridHead/GridBody`: Calendar grid structure
- `RangeCalendar.Cell/Day`: Individual date cells with selection states
- `RangeCalendar.MonthSelect/YearSelect`: Optional month/year navigation selects

### Data Attributes

Selection states: `data-selected`, `data-range-start`, `data-range-end`, `data-range-middle`, `data-highlighted`
Date states: `data-disabled`, `data-unavailable`, `data-today`, `data-outside-month`, `data-focused`

### Example: Min/Max Range

```svelte
<RangeCalendar.Root minDays={3} maxDays={10} bind:value>
  {#snippet children({ months, weekdays })}
    <!-- calendar structure -->
  {/snippet}
</RangeCalendar.Root>
```

### Example: Exclude Weekends

```svelte
<RangeCalendar.Root 
  excludeDisabled 
  isDateDisabled={(date) => isWeekend(date, "en-US")}
  bind:value
>
  {#snippet children({ months, weekdays })}
    <!-- calendar structure -->
  {/snippet}
</RangeCalendar.Root>
```

### Important Notes

- Requires understanding of date/time handling in Bits UI (see Dates documentation)
- Uses `@internationalized/date` for DateValue types
- Supports `$bindable()` for reactive value updates
- Provides `months` and `weekdays` via snippet props for flexible rendering