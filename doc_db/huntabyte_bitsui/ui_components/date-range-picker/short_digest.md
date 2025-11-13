## DateRangePicker

Composite component combining DateRangeField, RangeCalendar, and Popover for date range selection.

**Basic usage:**
```svelte
<DateRangePicker.Root bind:value={myValue} bind:open={isOpen}>
  <DateRangePicker.Label />
  <DateRangePicker.Input type="start">...</DateRangePicker.Input>
  <DateRangePicker.Input type="end">...</DateRangePicker.Input>
  <DateRangePicker.Trigger />
  <DateRangePicker.Content>
    <DateRangePicker.Calendar>...</DateRangePicker.Calendar>
  </DateRangePicker.Content>
</DateRangePicker.Root>
```

**State management:**
- `bind:value` - DateRange object with `start` and `end` DateValue
- `bind:placeholder` - DateValue for segment initialization
- `bind:open` - Popover visibility

**Key props:** `minValue`, `maxValue`, `minDays`, `maxDays`, `isDateUnavailable`, `isDateDisabled`, `numberOfMonths`, `fixedWeeks`, `closeOnRangeSelect`, `granularity`, `locale`, `disabled`, `readonly`

**Callbacks:** `onValueChange`, `onStartValueChange`, `onEndValueChange`, `onOpenChange`, `onInvalid`

**Day cell data attributes:** `data-selected`, `data-range-start`, `data-range-end`, `data-range-middle`, `data-highlighted`, `data-disabled`, `data-unavailable`, `data-today`