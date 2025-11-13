## DateField Component

Customizable date input with segment-based editing. Use `CalendarDate`, `CalendarDateTime`, or `ZonedDateTime` for the `placeholder` to set granularity. Manage state with `bind:value` and `bind:placeholder` or function bindings. Validate with `minValue`, `maxValue`, and custom `validate` function. Style segments differently based on `part === "literal"`. Supports localization via `locale` prop and readonly segments via `readonlySegments`.

```svelte
<DateField.Root bind:value placeholder={new CalendarDateTime(2024, 8, 3, 12, 30)}>
  <DateField.Label>Birthday</DateField.Label>
  <DateField.Input>
    {#snippet children({ segments })}
      {#each segments as { part, value }}
        <DateField.Segment {part}>{value}</DateField.Segment>
      {/each}
    {/snippet}
  </DateField.Input>
</DateField.Root>
```