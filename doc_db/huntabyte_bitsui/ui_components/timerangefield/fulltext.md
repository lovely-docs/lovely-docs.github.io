# Time Range Field Documentation

Enables users to input a range of times within a designated field.

This is a documentation section that potentially contains examples, demos, and other useful information related to a specific part of Bits UI. When helping users with this documentation, you can ignore the classnames applied to the demos unless they are relevant to the user's issue.

Copy Page

```svelte
<script lang="ts">
  import { TimeRangeField } from "bits-ui";
</script>
<TimeRangeField.Root class="group flex w-full max-w-[320px] flex-col gap-1.5">
  <TimeRangeField.Label class="block select-none text-sm font-medium">
    Hotel dates
  </TimeRangeField.Label>
  <div
    class="h-input rounded-input border-border-input bg-background text-foreground focus-within:border-border-input-hover focus-within:shadow-date-field-focus hover:border-border-input-hover group-data-invalid:border-destructive flex w-full select-none items-center border px-2 py-3 text-sm tracking-[0.01em]"
  >
    {#each ["start", "end"] as const as type (type)}
      <TimeRangeField.Input {type}>
        {#snippet children({ segments })}
          {#each segments as { part, value }, i (part + i)}
            <div class="inline-block select-none">
              {#if part === "literal"}
                <TimeRangeField.Segment
                  {part}
                  class="text-muted-foreground p-1"
                >
                  {value}
                </TimeRangeField.Segment>
              {:else}
                <TimeRangeField.Segment
                  {part}
                  class="rounded-5px hover:bg-muted focus:bg-muted focus:text-foreground aria-[valuetext=Empty]:text-muted-foreground focus-visible:ring-0! focus-visible:ring-offset-0! px-1 py-1"
                >
                  {value}
                </TimeRangeField.Segment>
              {/if}
            </div>
          {/each}
        {/snippet}
      </TimeRangeField.Input>
      {#if type === "start"}
        <div aria-hidden="true" class="text-muted-foreground pl-1 pr-2">to</div>
      {/if}
    {/each}
  </div>
</TimeRangeField.Root>
```

##### Heads up!

Before diving into this component, it's important to understand how dates/times work in Bits UI. Please read the [Dates/Times](/docs/dates) documentation to learn more!

## Overview

The `TimeRangeField` component combines two [Time Field](/docs/components/time-field) components to create a time range field. Check out the [Time Field](/docs/components/time-field) component documentation for information on how to customize this component.

## Structure

```svelte
<script lang="ts">
  import { TimeRangeField } from "bits-ui";
</script>
<TimeRangeField.Root>
  <TimeRangeField.Label>Working Hours</TimeRangeField.Label>
  {#each ["start", "end"] as const as type}
    <TimeRangeField.Input {type}>
      {#snippet children({ segments })}
        {#each segments as { part, value }}
          <TimeRangeField.Segment {part}>
            {value}
          </TimeRangeField.Segment>
        {/each}
      {/snippet}
    </TimeRangeField.Input>
  {/each}
</TimeRangeField.Root>
```

## Managing Placeholder State

This section covers how to manage the `placeholder` state of the component.

### Two-Way Binding

Use `bind:placeholder` for simple, automatic state synchronization:

```svelte
<script lang="ts">
  import { TimeRangeField } from "bits-ui";
  import { Time } from "@internationalized/date";
  let myPlaceholder = $state(new Time(12, 30));
</script>
<TimeRangeField.Root bind:placeholder={myPlaceholder}>
  <!-- ... -->
</TimeRangeField.Root>
```

### Fully Controlled

Use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) for complete control over the state's reads and writes.

```svelte
<script lang="ts">
  import { TimeRangeField, type TimeValue } from "bits-ui";
  import { Time } from "@internationalized/date";
  let myPlaceholder = $state(new Time(12, 30));
  function getPlaceholder() {
    return myPlaceholder;
  }
  function setPlaceholder(newPlaceholder: TimeValue) {
    myPlaceholder = newPlaceholder;
  }
</script>
<TimeRangeField.Root bind:placeholder={getPlaceholder, setPlaceholder}>
  <!-- ... -->
</TimeRangeField.Root>
```

## Managing Value State

This section covers how to manage the `value` state of the component.

### Two-Way Binding

Use `bind:value` for simple, automatic state synchronization:

```svelte
<script lang="ts">
  import { TimeRangeField, type TimeRange } from "bits-ui";
  import { Time } from "@internationalized/date";
  let myValue = $state<TimeRange>({
    start: new Time(12, 30),
    end: new Time(12, 30),
  });
</script>
<button
  onclick={() => {
    myValue = {
      start: myValue.start.add({ hours: 1 }),
      end: myValue.end.add({ hours: 1 }),
    };
  }}
>
  Add 1 hour
</button>
<TimeRangeField.Root bind:value={myValue}>
  <!-- ... -->
</TimeRangeField.Root>
```

### Fully Controlled

Use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) for complete control over the state's reads and writes.

```svelte
<script lang="ts">
  import { TimeRangeField, type TimeRange } from "bits-ui";
  let myValue = $state<TimeRange | undefined>({
    start: undefined,
    end: undefined,
  });
  function getValue() {
    return myValue;
  }
  function setValue(newValue: TimeRange | undefined) {
    myValue = newValue;
  }
</script>
<DateRangeField.Root bind:value={getValue, setValue}>
  <!-- ... -->
</DateRangeField.Root>
```

## API Reference

### TimeRangeField.Root

The root time field component.

| Property                | Type                                                                                                                                                           | Description                                                                                                                                                                 | Details |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `value` $bindable       | `TimeRange` - { start: TimeValue \| undefined; end: TimeValue \| undefined }                                                                                   | The selected time range.`Default:  —— undefined`                                                                                                                            |         |
| `onValueChange`         | `function` - (value: TimeRange) => void                                                                                                                        | A function that is called when the selected time range changes.`Default:  —— undefined`                                                                                     |         |
| `placeholder` $bindable | `TimeValue` - import type { Time, CalendarDateTime, ZonedDateTime } from "@internationalized/date"; type TimeValue = Time \| CalendarDateTime \| ZonedDateTime | The placeholder time, which is used to determine what time to start the segments from when no value exists.`Default:  —— undefined`                                         |         |
| `onPlaceholderChange`   | `function` - (value: TimeValue) => void                                                                                                                        | A function that is called when the placeholder time changes.`Default:  —— undefined`                                                                                        |         |
| `errorMessageId`        | `string`                                                                                                                                                       | The `id` of the element which contains the error messages for the field when the time is invalid.`Default:  —— undefined`                                                   |         |
| `validate`              | `function` - (time: TimeValue) => string\[] \| string \| void                                                                                                  | A function that returns whether or not a time is unavailable.`Default:  —— undefined`                                                                                       |         |
| `onInvalid`             | `function` - (reason: 'min' \| 'max' \| 'custom', msg?: string \| string\[]) => void                                                                           | A callback fired when the field's value is invalid.`Default:  —— undefined`                                                                                                 |         |
| `minValue`              | `TimeValue` - import type { Time, CalendarDateTime, ZonedDateTime } from "@internationalized/date"; type TimeValue = Time \| CalendarDateTime \| ZonedDateTime | The minimum valid time that can be entered.`Default:  —— undefined`                                                                                                         |         |
| `maxValue`              | `TimeValue` - import type { Time, CalendarDateTime, ZonedDateTime } from "@internationalized/date"; type TimeValue = Time \| CalendarDateTime \| ZonedDateTime | The maximum valid time that can be entered.`Default:  —— undefined`                                                                                                         |         |
| `granularity`           | `enum` - 'hour' \| 'minute' \| 'second'                                                                                                                        | The granularity to use for formatting the field. The field will render segments for each part of the time up to and including the specified granularity.`Default: 'minute'` |         |
| `hideTimeZone`          | `boolean`                                                                                                                                                      | Whether or not to hide the time zone segment of the field. This only applies when using a `ZonedDateTime` as the `value` prop.`Default: false`                              |         |
| `hourCycle`             | `enum` - '12' \| '24'                                                                                                                                          | The hour cycle to use for formatting times. Defaults to the locale preference`Default:  —— undefined`                                                                       |         |
| `locale`                | `string`                                                                                                                                                       | The locale to use for formatting times.`Default: en-US`                                                                                                                     |         |
| `disabled`              | `boolean`                                                                                                                                                      | Whether or not the field is disabled.`Default: false`                                                                                                                       |         |
| `readonly`              | `boolean`                                                                                                                                                      | Whether or not the field is readonly.`Default: false`                                                                                                                       |         |
| `readonlySegments`      | `EditableTimeSegmentPart[]` - "hour" \| "minute" \| "second" \| "dayPeriod"                                                                                    | An array of segments that should be readonly, which prevent user input on them.`Default:  —— undefined`                                                                     |         |
| `required`              | `boolean`                                                                                                                                                      | Whether or not the field is required.`Default: false`                                                                                                                       |         |
| `onStartValueChange`    | `function` - (value: TimeValue \| undefined) => void                                                                                                           | A function that is called when the start time changes.`Default:  —— undefined`                                                                                              |         |
| `onEndValueChange`      | `function` - (value: TimeValue \| undefined) => void                                                                                                           | A function that is called when the end time changes.`Default:  —— undefined`                                                                                                |         |
| `ref` $bindable         | `HTMLDivElement`                                                                                                                                               | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                                                           |         |
| `children`              | `Snippet`                                                                                                                                                      | The children content to render.`Default:  —— undefined`                                                                                                                     |         |
| `child`                 | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; };                                                                                          | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined`                               |         |

| Data Attribute               | Value | Description                  | Details |
| ---------------------------- | ----- | ---------------------------- | ------- |
| `data-time-range-field-root` | `''`  | Present on the root element. |         |

### TimeRangeField.Input

The container for the segments of the time field.

| Property        | Type                                                                                                                                                                                  | Description                                                                                                                                                 | Details |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `type` required | `enum` - 'start' \| 'end'                                                                                                                                                             | The type of field to render (start or end).`Default:  —— undefined`                                                                                         |         |
| `name`          | `string`                                                                                                                                                                              | The name of the time field used for form submission. If provided, a hidden input element will be rendered alongside the time field.`Default:  —— undefined` |         |
| `ref` $bindable | `HTMLDivElement`                                                                                                                                                                      | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                                           |         |
| `children`      | `Snippet` - import type { TimeSegmentPart } from "bits-ui"; type ChildrenSnippetProps = { segments: Array<{ part: TimeSegmentPart; value: string }>; };                               | The children content to render.`Default:  —— undefined`                                                                                                     |         |
| `child`         | `Snippet` - import type { TimeSegmentPart } from "bits-ui"; type ChildSnippetProps = { props: Record\<string, unknown>; segments: Array<{ part: TimeSegmentPart; value: string }>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined`               |         |

| Data Attribute          | Value | Description                                        | Details |
| ----------------------- | ----- | -------------------------------------------------- | ------- |
| `data-invalid`          | `''`  | Present on the element when the field is invalid.  |         |
| `data-disabled`         | `''`  | Present on the element when the field is disabled. |         |
| `data-time-field-input` | `''`  | Present on the element.                            |         |

### TimeRangeField.Segment

A segment of the time field.

| Property        | Type                                                                                             | Description                                                                                                                                   | Details |
| --------------- | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `part` required | `TimeSegmentPart` - "hour" \| "minute" \| "second" \| "dayPeriod" \| "timeZoneName" \| "literal" | The part of the time to render.`Default:  —— undefined`                                                                                       |         |
| `ref` $bindable | `HTMLSpanElement`                                                                                | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`      | `Snippet`                                                                                        | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`         | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; };                            | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute            | Value                                                                                 | Description                                       | Details |
| ------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------- | ------- |
| `data-invalid`            | `''`                                                                                  | Present on the element when the field is invalid  |         |
| `data-disabled`           | `''`                                                                                  | Present on the element when the field is disabled |         |
| `data-segment`            | `enum` - 'hour' \| 'minute' \| 'second' \| 'dayPeriod' \| 'timeZoneName' \| 'literal' | The type of segment the element represents.       |         |
| `data-time-field-segment` | `''`                                                                                  | Present on the element.                           |         |

### TimeRangeField.Label

The label for the time field.

| Property        | Type                                                                  | Description                                                                                                                                   | Details |
| --------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `ref` $bindable | `HTMLSpanElement`                                                     | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`      | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`         | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute          | Value | Description                                      | Details |
| ----------------------- | ----- | ------------------------------------------------ | ------- |
| `data-invalid`          | `''`  | Present on the element when the field is invalid |         |
| `data-time-field-label` | `''`  | Present on the element.                          |         |

[Previous Time Field](/docs/components/time-field) [Next Toggle](/docs/components/toggle)