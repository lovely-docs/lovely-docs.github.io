## TimeField Component

Customizable time input with segment-based editing (hour, minute, second, dayPeriod).

**Basic usage**:
```svelte
<TimeField.Root bind:value={myTime}>
  <TimeField.Label>Time</TimeField.Label>
  <TimeField.Input>
    {#snippet children({ segments })}
      {#each segments as { part, value }}
        <TimeField.Segment {part}>{value}</TimeField.Segment>
      {/each}
    {/snippet}
  </TimeField.Input>
</TimeField.Root>
```

**Key props**: `value`, `placeholder`, `granularity` ('hour'|'minute'|'second'), `locale`, `minValue`, `maxValue`, `validate`, `onInvalid`, `hourCycle`, `hideTimeZone`, `disabled`, `readonly`, `readonlySegments`

**Validation**: Use `minValue`/`maxValue` for bounds or `validate` function for custom rules. `onInvalid` callback receives reason ('min'|'max'|'custom') and message.

**State**: Use `bind:value` for two-way binding or function bindings for full control. Parse ISO strings with `parseDateTime()` or `parseZonedDateTime()`.

**Segments**: Render different styles for "literal" (separators) vs editable parts. `granularity` controls which segments appear.