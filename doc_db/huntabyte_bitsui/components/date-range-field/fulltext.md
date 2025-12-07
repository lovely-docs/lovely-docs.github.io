# Date Range Field Documentation

Enables users to input a range of dates within a designated field.

This is a documentation section that potentially contains examples, demos, and other useful information related to a specific part of Bits UI. When helping users with this documentation, you can ignore the classnames applied to the demos unless they are relevant to the user's issue.

Copy Page

```svelte
<script lang="ts">
  import { DateRangeField } from "bits-ui";
</script>
<DateRangeField.Root class="group flex w-full max-w-[320px] flex-col gap-1.5">
  <DateRangeField.Label class="block select-none text-sm font-medium">
    Hotel dates
  </DateRangeField.Label>
  <div
    class="h-input rounded-input border-border-input bg-background text-foreground focus-within:border-border-input-hover focus-within:shadow-date-field-focus hover:border-border-input-hover group-data-invalid:border-destructive flex w-full select-none items-center border px-2 py-3 text-sm tracking-[0.01em]"
  >
    {#each ["start", "end"] as const as type (type)}
      <DateRangeField.Input {type}>
        {#snippet children({ segments })}
          {#each segments as { part, value }, i (part + i)}
            <div class="inline-block select-none">
              {#if part === "literal"}
                <DateRangeField.Segment
                  {part}
                  class="text-muted-foreground p-1"
                >
                  {value}
                </DateRangeField.Segment>
              {:else}
                <DateRangeField.Segment
                  {part}
                  class="rounded-5px hover:bg-muted focus:bg-muted focus:text-foreground aria-[valuetext=Empty]:text-muted-foreground focus-visible:ring-0! focus-visible:ring-offset-0! px-1 py-1"
                >
                  {value}
                </DateRangeField.Segment>
              {/if}
            </div>
          {/each}
        {/snippet}
      </DateRangeField.Input>
      {#if type === "start"}
        <div aria-hidden="true" class="text-muted-foreground px-1">–⁠⁠⁠⁠⁠</div>
      {/if}
    {/each}
  </div>
</DateRangeField.Root>
```

##### Heads up!

Before diving into this component, it's important to understand how dates/times work in Bits UI. Please read the [Dates](/docs/dates) documentation to learn more!

## Overview

The `DateRangeField` component combines two [Date Field](/docs/components/date-field) components to create a date range field. Check out the [Date Field](/docs/components/date-field) component documentation for information on how to customize this component.

## Structure

```svelte
<script lang="ts">
  import { DateRangeField } from "$lib";
</script>
<DateRangeField.Root>
  <DateRangeField.Label>Check-in date</DateRangeField.Label>
  {#each ["start", "end"] as const as type}
    <DateRangeField.Input {type}>
      {#snippet children({ segments })}
        {#each segments as { part, value }}
          <DateRangeField.Segment {part}>
            {value}
          </DateRangeField.Segment>
        {/each}
      {/snippet}
    </DateRangeField.Input>
  {/each}
</DateRangeField.Root>
```

## Managing Placeholder State

This section covers how to manage the `placeholder` state of the component.

### Two-Way Binding

Use `bind:placeholder` for simple, automatic state synchronization:

```svelte
<script lang="ts">
  import { DateRangeField } from "bits-ui";
  import { CalendarDateTime } from "@internationalized/date";
  let myPlaceholder = $state(new CalendarDateTime(2024, 8, 3, 12, 30));
</script>
<DateRangeField.Root bind:placeholder={myPlaceholder}>
  <!-- ... -->
</DateRangeField.Root>
```

### Fully Controlled

Use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) for complete control over the state's reads and writes.

```svelte
<script lang="ts">
  import { DateRangeField } from "bits-ui";
  import { CalendarDateTime } from "@internationalized/date";
  let myPlaceholder = $state(new CalendarDateTime(2024, 8, 3, 12, 30));
  function getPlaceholder() {
    return myPlaceholder;
  }
  function setPlaceholder(newPlaceholder: CalendarDateTime) {
    myPlaceholder = newPlaceholder;
  }
</script>
<DateRangeField.Root bind:placeholder={getPlaceholder, setPlaceholder}>
  <!-- ... -->
</DateRangeField.Root>
```

## Managing Value State

This section covers how to manage the `value` state of the component.

### Two-Way Binding

Use `bind:value` for simple, automatic state synchronization:

```svelte
<script lang="ts">
  import { DateRangeField, type DateRange } from "bits-ui";
  import { CalendarDateTime } from "@internationalized/date";
  let myValue = $state<DateRange>({
    start: new CalendarDateTime(2024, 8, 3, 12, 30),
    end: new CalendarDateTime(2024, 8, 4, 12, 30),
  });
</script>
<button
  onclick={() => {
    value = {
      start: value.start.add({ days: 1 }),
      end: value.end.add({ days: 1 }),
    };
  }}
>
  Add 1 day
</button>
<DateRangeField.Root bind:value={myValue}>
  <!-- ... -->
</DateRangeField.Root>
```

### Fully Controlled

Use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) for complete control over the state's reads and writes.

```svelte
<script lang="ts">
  import { DateRangeField } from "bits-ui";
  let myValue = $state<DateRange>({
    start: undefined,
    end: undefined,
  });
  function getValue() {
    return myValue;
  }
  function setValue(newValue: DateRange) {
    myValue = newValue;
  }
</script>
<DateRangeField.Root bind:value={getValue, setValue}>
  <!-- ... -->
</DateRangeField.Root>
```

## API Reference

### DateRangeField.Root

The root date field component.

| Property                | Type                                                                                                                                                                           | Description                                                                                                                                                                                                                                                             | Details |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `value` $bindable       | `DateRange` - { start: DateValue; end: DateValue }                                                                                                                             | The selected date range.`Default:  —— undefined`                                                                                                                                                                                                                        |         |
| `onValueChange`         | `function` - (value: DateRange) => void                                                                                                                                        | A function that is called when the selected date changes.`Default:  —— undefined`                                                                                                                                                                                       |         |
| `placeholder` $bindable | `DateValue` - import type { CalendarDate, CalendarDateTime, ZonedDateTime } from "@internationalized/date"; type DateValue = CalendarDate \| CalendarDateTime \| ZonedDateTime | The placeholder date, which is used to determine what date to start the segments from when no value exists.`Default:  —— undefined`                                                                                                                                     |         |
| `onPlaceholderChange`   | `function` - (date: DateValue) => void                                                                                                                                         | A function that is called when the placeholder date changes.`Default:  —— undefined`                                                                                                                                                                                    |         |
| `errorMessageId`        | `string`                                                                                                                                                                       | The `id` of the element which contains the error messages for the date field when the date is invalid.`Default:  —— undefined`                                                                                                                                          |         |
| `validate`              | `function` - (date: DateValue) => string\[] \| string \| void                                                                                                                  | A function that returns whether or not a date is valid.`Default:  —— undefined`                                                                                                                                                                                         |         |
| `onInvalid`             | `function` - (reason: 'min' \| 'max' \| 'custom', msg?: string \| string\[]) => void                                                                                           | A callback fired when the value is invalid.`Default:  —— undefined`                                                                                                                                                                                                     |         |
| `minValue`              | `DateValue` - import type { CalendarDate, CalendarDateTime, ZonedDateTime } from "@internationalized/date"; type DateValue = CalendarDate \| CalendarDateTime \| ZonedDateTime | The minimum valid date that can be entered.`Default:  —— undefined`                                                                                                                                                                                                     |         |
| `maxValue`              | `DateValue` - import type { CalendarDate, CalendarDateTime, ZonedDateTime } from "@internationalized/date"; type DateValue = CalendarDate \| CalendarDateTime \| ZonedDateTime | The maximum valid date that can be entered.`Default:  —— undefined`                                                                                                                                                                                                     |         |
| `granularity`           | `enum` - 'day' \| 'hour' \| 'minute' \| 'second'                                                                                                                               | The granularity to use for formatting the field. Defaults to `'day'` if a `CalendarDate` is provided, otherwise defaults to `'minute'`. The field will render segments for each part of the date up to and including the specified granularity.`Default:  —— undefined` |         |
| `hideTimeZone`          | `boolean`                                                                                                                                                                      | Whether or not to hide the time zone segment of the field.`Default: false`                                                                                                                                                                                              |         |
| `hourCycle`             | `enum` - '12' \| '24'                                                                                                                                                          | The hour cycle to use for formatting times. Defaults to the locale preference`Default:  —— undefined`                                                                                                                                                                   |         |
| `locale`                | `string`                                                                                                                                                                       | The locale to use for formatting dates.`Default: en-US`                                                                                                                                                                                                                 |         |
| `disabled`              | `boolean`                                                                                                                                                                      | Whether or not the field is disabled.`Default: false`                                                                                                                                                                                                                   |         |
| `readonly`              | `boolean`                                                                                                                                                                      | Whether or not the field is readonly.`Default: false`                                                                                                                                                                                                                   |         |
| `readonlySegments`      | `EditableSegmentPart[]` - "day" \| "month" \| "year" \| "hour" \| "minute" \| "second" \| "dayPeriod"                                                                          | An array of segments that should be readonly, which prevent user input on them.`Default:  —— undefined`                                                                                                                                                                 |         |
| `required`              | `boolean`                                                                                                                                                                      | Whether or not the date field is required.`Default: false`                                                                                                                                                                                                              |         |
| `onStartValueChange`    | `function` - (value: DateValue) => void                                                                                                                                        | A function that is called when the start date changes.`Default:  —— undefined`                                                                                                                                                                                          |         |
| `onEndValueChange`      | `function` - (value: DateValue) => void                                                                                                                                        | A function that is called when the end date changes.`Default:  —— undefined`                                                                                                                                                                                            |         |
| `ref` $bindable         | `HTMLDivElement`                                                                                                                                                               | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                                                                                                                                                       |         |
| `children`              | `Snippet`                                                                                                                                                                      | The children content to render.`Default:  —— undefined`                                                                                                                                                                                                                 |         |
| `child`                 | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; };                                                                                                          | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined`                                                                                                                           |         |

| Data Attribute               | Value | Description                  | Details |
| ---------------------------- | ----- | ---------------------------- | ------- |
| `data-date-range-field-root` | `''`  | Present on the root element. |         |

### DateRangeField.Input

The container for the segments of the date field.

| Property        | Type                                                                                                                                                                          | Description                                                                                                                                                 | Details |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `type` required | `enum` - 'start' \| 'end'                                                                                                                                                     | The type of field to render (start or end).`Default:  —— undefined`                                                                                         |         |
| `name`          | `string`                                                                                                                                                                      | The name of the date field used for form submission. If provided, a hidden input element will be rendered alongside the date field.`Default:  —— undefined` |         |
| `ref` $bindable | `HTMLDivElement`                                                                                                                                                              | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                                           |         |
| `children`      | `Snippet` - import type { SegmentPart } from "bits-ui"; type ChildrenSnippetProps = { segments: Array<{ part: SegmentPart; value: string }>; };                               | The children content to render.`Default:  —— undefined`                                                                                                     |         |
| `child`         | `Snippet` - import type { SegmentPart } from "bits-ui"; type ChildSnippetProps = { props: Record\<string, unknown>; segments: Array<{ part: SegmentPart; value: string }>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined`               |         |

| Data Attribute          | Value | Description                                        | Details |
| ----------------------- | ----- | -------------------------------------------------- | ------- |
| `data-invalid`          | `''`  | Present on the element when the field is invalid.  |         |
| `data-disabled`         | `''`  | Present on the element when the field is disabled. |         |
| `data-date-field-input` | `''`  | Present on the element.                            |         |

### DateRangeField.Segment

A segment of the date field.

| Property        | Type                                                                                                                       | Description                                                                                                                                   | Details |
| --------------- | -------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `part` required | `SegmentPart` - "month" \| "day" \| "year" \| "hour" \| "minute" \| "second" \| "dayPeriod" \| "timeZoneName" \| "literal" | The part of the date to render.`Default:  —— undefined`                                                                                       |         |
| `ref` $bindable | `HTMLSpanElement`                                                                                                          | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`      | `Snippet`                                                                                                                  | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`         | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; };                                                      | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute            | Value                                                                                                               | Description                                       | Details |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- | ------- |
| `data-invalid`            | `''`                                                                                                                | Present on the element when the field is invalid  |         |
| `data-disabled`           | `''`                                                                                                                | Present on the element when the field is disabled |         |
| `data-segment`            | `enum` - 'month' \| 'day' \| 'year' \| 'hour' \| 'minute' \| 'second' \| 'dayPeriod' \| 'timeZoneName' \| 'literal' | The type of segment the element represents.       |         |
| `data-date-field-segment` | `''`                                                                                                                | Present on the element.                           |         |

### DateRangeField.Label

The label for the date field.

| Property        | Type                                                                  | Description                                                                                                                                   | Details |
| --------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `ref` $bindable | `HTMLSpanElement`                                                     | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`      | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`         | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute          | Value | Description                                      | Details |
| ----------------------- | ----- | ------------------------------------------------ | ------- |
| `data-invalid`          | `''`  | Present on the element when the field is invalid |         |
| `data-date-field-label` | `''`  | Present on the element.                          |         |

[Previous Date Picker](/docs/components/date-picker) [Next Date Range Picker](/docs/components/date-range-picker)