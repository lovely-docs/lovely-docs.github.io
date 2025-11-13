## Calendar Component

Date picker displaying dates and days of the week.

### Basic Usage
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
          {#each weekdays as day}
            <Calendar.HeadCell>{day}</Calendar.HeadCell>
          {/each}
        </Calendar.GridHead>
        <Calendar.GridBody>
          {#each month.weeks as weekDates}
            {#each weekDates as date}
              <Calendar.Cell {date} month={month.value}>
                <Calendar.Day />
              </Calendar.Cell>
            {/each}
          {/each}
        </Calendar.GridBody>
      </Calendar.Grid>
    {/each}
  {/snippet}
</Calendar.Root>
```

### State Management
```svelte
<script>
  let value = $state(new CalendarDateTime(2024, 8, 3, 12, 30));
</script>
<Calendar.Root type="single" bind:value={value} />
```

Or fully controlled:
```svelte
<Calendar.Root type="single" bind:value={getValue, setValue} />
```

### Validation
```svelte
<Calendar.Root 
  minValue={todayDate}
  maxValue={tomorrowDate}
  isDateDisabled={(date) => date.day === 1}
  isDateUnavailable={(date) => date.day === 1}
  type="multiple"
  maxDays={3}
/>
```

### Options
- `type`: 'single' | 'multiple'
- `fixedWeeks`, `numberOfMonths`, `pagedNavigation`: Layout
- `locale`, `weekStartsOn`, `weekdayFormat`: Formatting
- `disabled`, `readonly`: State
- `initialFocus`: Focus on mount

### Custom Navigation
```svelte
<script>
  let placeholder = $state(new CalendarDate(2024, 8, 3));
</script>
<button onclick={() => { placeholder = placeholder.set({ month: 8 }); }}>
  Set month to August
</button>
<Calendar.Root bind:placeholder />
```

Use `Calendar.MonthSelect` and `Calendar.YearSelect` for dropdown navigation.