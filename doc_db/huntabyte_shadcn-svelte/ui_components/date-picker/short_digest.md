## Date Picker

Composable date picker built from Popover + Calendar/RangeCalendar components.

**Basic single date picker:**
```svelte
<Popover.Root>
  <Popover.Trigger>
    {#snippet child({ props })}
      <Button {...props}>{value ? format(value) : "Select a date"}</Button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content class="w-auto p-0">
    <Calendar bind:value type="single" initialFocus />
  </Popover.Content>
</Popover.Root>
```

**Date range picker:** Use RangeCalendar with `numberOfMonths={2}` and track `startValue` via `onStartValueChange`.

**With presets:** Add Select component inside Popover.Content for quick date options.

**Form integration:** Use with sveltekit-superforms, set Calendar `minValue`/`maxValue`, update form data via `onValueChange`.