## Date Picker

Composable date picker built from Popover and Calendar/RangeCalendar components.

### Basic Usage
```svelte
<Popover.Root>
  <Popover.Trigger>
    {#snippet child({ props })}
      <Button {...props}>
        <CalendarIcon class="mr-2 size-4" />
        {value ? df.format(value.toDate(getLocalTimeZone())) : "Select a date"}
      </Button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content class="w-auto p-0">
    <Calendar bind:value type="single" initialFocus />
  </Popover.Content>
</Popover.Root>
```

### Date Range Picker
Use `RangeCalendar` with `numberOfMonths={2}` to display two months side-by-side. Track `startValue` separately via `onStartValueChange` callback.

### With Presets
Combine `Select` component with preset date options (Today, Tomorrow, In 3 days, In a week) that update the calendar value.

### Form Integration
Use with sveltekit-superforms and zod validation. Set `minValue` and `maxValue` on Calendar to constrain date selection (e.g., date of birth between 1900 and today).