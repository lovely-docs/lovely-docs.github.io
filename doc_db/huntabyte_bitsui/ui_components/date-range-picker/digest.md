## DateRangePicker Component

A composite component for selecting date ranges using an input field and calendar interface. Combines DateRangeField, RangeCalendar, and Popover components.

### Basic Structure
```svelte
<DateRangePicker.Root>
  <DateRangePicker.Label />
  <DateRangePicker.Input type="start">
    {#snippet children({ segments })}
      {#each segments as { part, value }}
        <DateRangePicker.Segment {part}>{value}</DateRangePicker.Segment>
      {/each}
    {/snippet}
  </DateRangePicker.Input>
  <DateRangePicker.Input type="end">...</DateRangePicker.Input>
  <DateRangePicker.Trigger />
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

**Value binding** - Two-way binding or fully controlled:
```svelte
<script>
  import { CalendarDateTime } from "@internationalized/date";
  let myValue = $state({
    start: new CalendarDateTime(2024, 8, 3, 12, 30),
    end: new CalendarDateTime(2024, 8, 4, 12, 30),
  });
</script>
<DateRangePicker.Root bind:value={myValue}>...</DateRangePicker.Root>
```

**Placeholder binding** - Controls the starting date for segments when no value exists:
```svelte
<script>
  let myPlaceholder = $state(new CalendarDateTime(2024, 8, 3, 12, 30));
</script>
<DateRangePicker.Root bind:placeholder={myPlaceholder}>...</DateRangePicker.Root>
```

**Open state binding** - Control popover visibility:
```svelte
<script>
  let isOpen = $state(false);
</script>
<button onclick={() => (isOpen = true)}>Open</button>
<DateRangePicker.Root bind:open={isOpen}>...</DateRangePicker.Root>
```

### Key Props on Root
- `value` - Selected date range object with `start` and `end` DateValue properties
- `placeholder` - DateValue for segment initialization
- `open` - Popover visibility state
- `minValue`, `maxValue` - Date constraints
- `isDateUnavailable`, `isDateDisabled` - Functions to mark dates as unavailable/disabled
- `minDays`, `maxDays` - Range length constraints
- `closeOnRangeSelect` - Auto-close popover after selection (default: true)
- `disableDaysOutsideMonth` - Disable dates outside current month
- `numberOfMonths` - Display multiple months (default: 1)
- `fixedWeeks` - Always show 6 weeks
- `weekdayFormat` - 'narrow' | 'short' | 'long'
- `locale` - Locale string (default: 'en-US')
- `granularity` - 'day' | 'hour' | 'minute' | 'second'
- `disabled`, `readonly`, `required` - Field states
- Callbacks: `onValueChange`, `onPlaceholderChange`, `onOpenChange`, `onStartValueChange`, `onEndValueChange`, `onInvalid`

### Data Attributes
Root element: `data-invalid`, `data-disabled`, `data-readonly`, `data-calendar-root`
Day cells: `data-selected`, `data-range-start`, `data-range-end`, `data-range-middle`, `data-highlighted`, `data-disabled`, `data-unavailable`, `data-today`, `data-outside-month`, `data-focused`

### Popover Content Props
Floating UI positioning: `side`, `sideOffset`, `align`, `alignOffset`, `avoidCollisions`, `collisionBoundary`, `sticky`, `strategy`
Behavior: `trapFocus`, `preventScroll`, `forceMount`, `onInteractOutside`, `onEscapeKeydown`

### CSS Variables on Content
- `--bits-popover-content-transform-origin`
- `--bits-popover-content-available-width`
- `--bits-popover-content-available-height`
- `--bits-popover-anchor-width`
- `--bits-popover-anchor-height`

Note: Read the Dates documentation to understand how dates/times work in Bits UI.