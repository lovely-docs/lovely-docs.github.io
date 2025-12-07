## Calendar Component

Date picker displaying dates and weekdays. Uses `@internationalized/date` for date handling.

**Basic usage:**
```svelte
<script lang="ts">
  import { Calendar } from "bits-ui";
  import { today, getLocalTimeZone } from "@internationalized/date";
  let value = $state(today(getLocalTimeZone()));
</script>

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

**State management:**
- Two-way binding: `bind:value={myValue}` or `bind:placeholder={myPlaceholder}`
- Fully controlled: `bind:value={getValue, setValue}`

**Validation:**
```svelte
<Calendar.Root 
  minValue={todayDate}
  maxValue={tomorrowDate}
  {isDateDisabled}
  {isDateUnavailable}
  maxDays={3}
>
```

**Appearance:**
- `type`: 'single' | 'multiple'
- `fixedWeeks`: always render 6 weeks
- `numberOfMonths`: display multiple months
- `pagedNavigation`: navigate by displayed month count
- `locale`: localization (default: 'en')
- `weekStartsOn`: 0-6 (default: locale-based)
- `weekdayFormat`: 'narrow' | 'short' | 'long'
- `monthFormat`, `yearFormat`: formatting options

**Custom composition:**
- `Calendar.MonthSelect`, `Calendar.YearSelect` for month/year navigation
- Update `placeholder` to change calendar view programmatically
- Preset buttons can set `value` to specific dates

**Data attributes on Calendar.Cell/Day:**
- `data-selected`, `data-disabled`, `data-unavailable`, `data-today`, `data-outside-month`, `data-focused`
- `data-value`: "YYYY-MM-DD" format