## DateRangeField

Combines two Date Field components for date range input with start/end segments.

```svelte
<DateRangeField.Root bind:value={myValue}>
  <DateRangeField.Label>Check-in date</DateRangeField.Label>
  {#each ["start", "end"] as type}
    <DateRangeField.Input {type}>
      {#snippet children({ segments })}
        {#each segments as { part, value }}
          <DateRangeField.Segment {part}>{value}</DateRangeField.Segment>
        {/each}
      {/snippet}
    </DateRangeField.Input>
  {/each}
</DateRangeField.Root>
```

**Key props**: `value` (DateRange), `placeholder`, `minValue`/`maxValue`, `granularity`, `validate`, `disabled`, `readonly`, `locale`, `hourCycle`

**Callbacks**: `onValueChange`, `onStartValueChange`, `onEndValueChange`, `onPlaceholderChange`, `onInvalid`