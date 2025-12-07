## DateRangePicker

Composite component for selecting date ranges with input field and calendar popup.

### Basic Usage
```svelte
<DateRangePicker.Root bind:value={myValue} bind:open={isOpen}>
  <DateRangePicker.Label>Select dates</DateRangePicker.Label>
  {#each ["start", "end"] as type}
    <DateRangePicker.Input {type}>
      {#snippet children({ segments })}
        {#each segments as { part, value }}
          <DateRangePicker.Segment {part}>{value}</DateRangePicker.Segment>
        {/each}
      {/snippet}
    </DateRangePicker.Input>
  {/each}
  <DateRangePicker.Trigger>📅</DateRangePicker.Trigger>
  <DateRangePicker.Content>
    <DateRangePicker.Calendar>
      {#snippet children({ months, weekdays })}
        <DateRangePicker.Header>
          <DateRangePicker.PrevButton />
          <DateRangePicker.Heading />
          <DateRangePicker.NextButton />
        </DateRangePicker.Header>
        {#each months as month}
          <DateRangePicker.Grid>
            <DateRangePicker.GridHead>
              <DateRangePicker.GridRow>
                {#each weekdays as day}
                  <DateRangePicker.HeadCell>{day}</DateRangePicker.HeadCell>
                {/each}
              </DateRangePicker.GridRow>
            </DateRangePicker.GridHead>
            <DateRangePicker.GridBody>
              {#each month.weeks as weekDates}
                <DateRangePicker.GridRow>
                  {#each weekDates as date}
                    <DateRangePicker.Cell {date} month={month.value}>
                      <DateRangePicker.Day>{date.day}</DateRangePicker.Day>
                    </DateRangePicker.Cell>
                  {/each}
                </DateRangePicker.GridRow>
              {/each}
            </DateRangePicker.GridBody>
          </DateRangePicker.Grid>
        {/each}
      {/snippet}
    </DateRangePicker.Calendar>
  </DateRangePicker.Content>
</DateRangePicker.Root>
```

### State Management
```svelte
// Two-way binding
let myValue = $state({ start: date1, end: date2 });
let myPlaceholder = $state(placeholderDate);
let isOpen = $state(false);
<DateRangePicker.Root bind:value={myValue} bind:placeholder={myPlaceholder} bind:open={isOpen}>

// Fully controlled
let myValue = $state();
<DateRangePicker.Root bind:value={() => myValue, (v) => myValue = v}>
```

### Key Props
- `value`: `{ start: DateValue; end: DateValue }` - Selected range
- `placeholder`: `DateValue` - Placeholder for segments
- `open`: `boolean` - Popover visibility
- `minValue`, `maxValue`: `DateValue` - Date bounds
- `minDays`, `maxDays`: `number` - Range length constraints
- `isDateUnavailable`, `isDateDisabled`: `(date) => boolean` - Date filtering
- `granularity`: `'day' | 'hour' | 'minute' | 'second'` - Segment precision
- `locale`: `string` - Formatting locale (default 'en-US')
- `weekdayFormat`: `'narrow' | 'short' | 'long'` - Weekday labels
- `numberOfMonths`: `number` - Simultaneous month display
- `closeOnRangeSelect`: `boolean` - Auto-close after selection (default true)
- `disabled`, `readonly`, `required`: `boolean` - Field states
- Callbacks: `onValueChange`, `onPlaceholderChange`, `onOpenChange`, `onStartValueChange`, `onEndValueChange`, `onInvalid`

### Data Attributes
Root: `data-invalid`, `data-disabled`, `data-readonly`, `data-calendar-root`
Cell/Day: `data-selected`, `data-range-start`, `data-range-end`, `data-range-middle`, `data-highlighted`, `data-disabled`, `data-unavailable`, `data-today`, `data-outside-month`, `data-value` (YYYY-MM-DD)