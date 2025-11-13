## RangeCalendar

Calendar component for date range selection with min/max constraints, date disabling, and multi-month display.

**Key Props**: `value` (bindable), `minDays`, `maxDays`, `excludeDisabled`, `isDateDisabled()`, `numberOfMonths`, `pagedNavigation`

**Components**: Root, Header, Heading, Grid, Cell, Day, PrevButton, NextButton, MonthSelect, YearSelect

**Selection States**: `data-selected`, `data-range-start`, `data-range-end`, `data-range-middle`, `data-highlighted`

**Example - Min/Max Range**:
```svelte
<RangeCalendar.Root minDays={3} maxDays={10} bind:value>
  {#snippet children({ months, weekdays })}
    <!-- render calendar -->
  {/snippet}
</RangeCalendar.Root>
```

**Example - Exclude Weekends**:
```svelte
<RangeCalendar.Root excludeDisabled isDateDisabled={(date) => isWeekend(date, "en-US")} bind:value>
  {#snippet children({ months, weekdays })}
    <!-- render calendar -->
  {/snippet}
</RangeCalendar.Root>
```