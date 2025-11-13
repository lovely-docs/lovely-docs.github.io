## Calendar Component

A date picker component that displays dates and days of the week for date-related interactions.

### Basic Structure
```svelte
<Calendar.Root type="single" bind:value>
  {#snippet children({ months, weekdays })}
    <Calendar.Header>
      <Calendar.PrevButton />
      <Calendar.Heading />
      <Calendar.NextButton />
    </Calendar.Header>
    {#each months as month}
      <Calendar.Grid>
        <Calendar.GridHead>
          <Calendar.GridRow>
            {#each weekdays as day}
              <Calendar.HeadCell>{day}</Calendar.HeadCell>
            {/each}
          </Calendar.GridRow>
        </Calendar.GridHead>
        <Calendar.GridBody>
          {#each month.weeks as weekDates}
            <Calendar.GridRow>
              {#each weekDates as date}
                <Calendar.Cell {date} month={month.value}>
                  <Calendar.Day />
                </Calendar.Cell>
              {/each}
            </Calendar.GridRow>
          {/each}
        </Calendar.GridBody>
      </Calendar.Grid>
    {/each}
  {/snippet}
</Calendar.Root>
```

### State Management

**Two-way binding:**
```svelte
<script>
  import { Calendar } from "bits-ui";
  let myValue = $state(new CalendarDateTime(2024, 8, 3, 12, 30));
</script>
<Calendar.Root type="single" bind:value={myValue} />
```

**Fully controlled with function bindings:**
```svelte
<script>
  let myValue = $state();
  function getValue() { return myValue; }
  function setValue(newValue) { myValue = newValue; }
</script>
<Calendar.Root type="single" bind:value={getValue, setValue} />
```

Same pattern applies to `placeholder` state.

### Default Values
Parse ISO 8601 strings using `parseDate` from `@internationalized/date`:
```svelte
<script>
  import { parseDate } from "@internationalized/date";
  const date = "2024-08-03";
  let value = $state(parseDate(date));
</script>
<Calendar.Root {value} />
```

### Validation

**Min/Max values:**
```svelte
<Calendar.Root minValue={todayDate} value={yesterday} />
<Calendar.Root maxValue={todayDate} value={tomorrow} />
```

**Unavailable dates:**
```svelte
<Calendar.Root isDateUnavailable={(date) => date.day === 1} />
```

**Disabled dates:**
```svelte
<Calendar.Root isDateDisabled={(date) => date.day === 1} />
```

**Max days for multiple selection:**
```svelte
<Calendar.Root type="multiple" maxDays={3} />
```

### Appearance & Behavior

- `fixedWeeks`: Render fixed number of weeks regardless of month length
- `numberOfMonths`: Display multiple months at once
- `pagedNavigation`: Navigate by number of displayed months instead of one month
- `locale`: Format according to locale (defaults to 'en-US')
- `weekStartsOn`: Override first day of week (0=Sunday, 6=Saturday)
- `type`: Set to 'multiple' for multi-date selection
- `weekdayFormat`: 'narrow' | 'short' | 'long'

### Custom Composition

**Month selector via placeholder:**
```svelte
<script>
  let placeholder = $state(new CalendarDate(2024, 8, 3));
</script>
<button onclick={() => { placeholder = placeholder.set({ month: 8 }); }}>
  Set month to August
</button>
<Calendar.Root bind:placeholder />
```

**Month and Year selects:**
```svelte
<Calendar.Header>
  <Calendar.MonthSelect aria-label="Select month" />
  <Calendar.YearSelect aria-label="Select year" />
</Calendar.Header>
```

### Key Props

**Calendar.Root:**
- `type` (required): 'single' | 'multiple'
- `value` (bindable): DateValue | DateValue[]
- `placeholder`: DateValue for initial view
- `minValue`, `maxValue`: Date constraints
- `isDateDisabled`, `isDateUnavailable`: Validation functions
- `maxDays`: Limit selections in multiple mode
- `fixedWeeks`, `numberOfMonths`, `pagedNavigation`: Layout options
- `locale`, `weekStartsOn`, `weekdayFormat`: Formatting options
- `disabled`, `readonly`: State flags
- `initialFocus`: Focus selected/today/first day on mount

**Calendar.MonthSelect** and **Calendar.YearSelect:**
- `months`/`years`: Array of values to render
- `monthFormat`/`yearFormat`: Format strings or functions