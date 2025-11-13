## DatePicker Component

Combines date input field with calendar interface. Composed of Date Field, Calendar, and Popover sub-components.

### State Management
```svelte
<script>
  import { DatePicker } from "bits-ui";
  import { CalendarDateTime } from "@internationalized/date";
  let myValue = $state(new CalendarDateTime(2024, 8, 3, 12, 30));
  let isOpen = $state(false);
</script>
<DatePicker.Root bind:value={myValue} bind:open={isOpen}>
  <DatePicker.Label>Birthday</DatePicker.Label>
  <DatePicker.Input>
    {#snippet children({ segments })}
      {#each segments as { part, value }}
        <DatePicker.Segment {part}>{value}</DatePicker.Segment>
      {/each}
      <DatePicker.Trigger />
    {/snippet}
  </DatePicker.Input>
  <DatePicker.Content>
    <DatePicker.Calendar>
      {#snippet children({ months, weekdays })}
        <DatePicker.Header>
          <DatePicker.PrevButton />
          <DatePicker.Heading />
          <DatePicker.NextButton />
        </DatePicker.Header>
        {#each months as month}
          <DatePicker.Grid>
            <!-- Grid structure with cells and days -->
          </DatePicker.Grid>
        {/each}
      {/snippet}
    </DatePicker.Calendar>
  </DatePicker.Content>
</DatePicker.Root>
```

### Key Props
- `value` - Selected date (CalendarDate | CalendarDateTime | ZonedDateTime)
- `placeholder` - Controls displayed month
- `open` - Popover visibility
- `isDateUnavailable(date)` / `isDateDisabled(date)` - Date restrictions
- `closeOnDateSelect` - Auto-close after selection (default: true)
- `weekdayFormat` - 'narrow' | 'short' | 'long'
- `fixedWeeks` - Always show 6 weeks
- `numberOfMonths` - Display multiple months
- `minValue` / `maxValue` - Date range
- `granularity` - 'day' | 'hour' | 'minute' | 'second'