## DatePicker Component

A date selection component combining a date input field with a calendar interface.

### Structure
The component is composed of three sub-components: Date Field, Calendar, and Popover. Use `DatePicker.Root` as the wrapper, with `DatePicker.Label`, `DatePicker.Input` (containing segments and trigger), and `DatePicker.Content` (containing the calendar).

### State Management

**Placeholder State** - Controls which month displays in the calendar when no date is selected:
```svelte
<script>
  import { DatePicker } from "bits-ui";
  import { CalendarDateTime } from "@internationalized/date";
  let myPlaceholder = $state();
</script>
<button onclick={() => myPlaceholder = new CalendarDateTime(2024, 8, 3, 12, 30)}>
  Set placeholder
</button>
<DatePicker.Root bind:placeholder={myPlaceholder}>
```

**Value State** - The selected date:
```svelte
<script>
  let myValue = $state(new CalendarDateTime(2024, 8, 3, 12, 30));
</script>
<button onclick={() => myValue = myValue.add({ days: 1 })}>Add 1 day</button>
<DatePicker.Root bind:value={myValue}>
```

**Open State** - Controls popover visibility:
```svelte
<script>
  let isOpen = $state(false);
</script>
<button onclick={() => isOpen = true}>Open DatePicker</button>
<DatePicker.Root bind:open={isOpen}>
```

All three states support two-way binding with `bind:` or fully controlled function bindings.

### Key Props on DatePicker.Root
- `value` / `onValueChange` - Selected date
- `placeholder` / `onPlaceholderChange` - Month display control
- `open` / `onOpenChange` - Popover state
- `isDateUnavailable(date)` - Mark dates as unavailable
- `isDateDisabled(date)` - Disable specific dates
- `validate(date)` - Custom validation returning error strings
- `closeOnDateSelect` - Auto-close after selection (default: true)
- `preventDeselect` - Prevent deselecting without selecting another date
- `weekStartsOn` - Day to start week (0=Sunday, 1=Monday, etc.)
- `weekdayFormat` - 'narrow' | 'short' | 'long'
- `fixedWeeks` - Always display 6 weeks
- `numberOfMonths` - Display multiple months
- `minValue` / `maxValue` - Date range constraints
- `disabled` / `readonly` - Disable or make readonly
- `granularity` - 'day' | 'hour' | 'minute' | 'second'
- `hideTimeZone` - Hide timezone segment
- `initialFocus` - Focus selected/today/first day on mount

### DatePicker.Content Props
Popover positioning and behavior: `side`, `sideOffset`, `align`, `alignOffset`, `avoidCollisions`, `sticky`, `trapFocus`, `forceMount`, etc.

### Calendar Sub-components
- `DatePicker.Header` - Contains prev/next buttons and heading
- `DatePicker.PrevButton` / `DatePicker.NextButton` - Navigation
- `DatePicker.Heading` - Month/year display
- `DatePicker.Grid` - Month grid
- `DatePicker.GridHead` / `DatePicker.GridBody` - Table structure
- `DatePicker.Cell` / `DatePicker.Day` - Individual dates
- `DatePicker.MonthSelect` / `DatePicker.YearSelect` - Navigation selects

### Data Attributes
Calendar elements support: `data-disabled`, `data-readonly`, `data-invalid`, `data-selected`, `data-today`, `data-outside-month`, `data-focused`, `data-unavailable`

### Important Notes
Read the Dates documentation to understand how dates/times work in Bits UI. The component uses `@internationalized/date` types (CalendarDate, CalendarDateTime, ZonedDateTime).