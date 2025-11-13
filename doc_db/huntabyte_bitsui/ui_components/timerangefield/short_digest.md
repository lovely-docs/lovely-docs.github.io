## TimeRangeField

Combines two Time Field components for start/end time input.

**Basic usage:**
```svelte
<TimeRangeField.Root bind:value={myValue}>
  <TimeRangeField.Label>Working Hours</TimeRangeField.Label>
  {#each ["start", "end"] as type}
    <TimeRangeField.Input {type}>
      {#snippet children({ segments })}
        {#each segments as { part, value }}
          <TimeRangeField.Segment {part}>{value}</TimeRangeField.Segment>
        {/each}
      {/snippet}
    </TimeRangeField.Input>
  {/each}
</TimeRangeField.Root>
```

**Key props:** `value` (TimeRange), `placeholder`, `minValue`/`maxValue`, `granularity` ('hour'|'minute'|'second'), `hourCycle` ('12'|'24'), `locale`, `hideTimeZone`, `disabled`, `readonly`, `required`, `readonlySegments`, `validate`, `onValueChange`, `onStartValueChange`, `onEndValueChange`

**Sub-components:** `Input` (requires `type: 'start'|'end'`), `Segment` (requires `part`), `Label`