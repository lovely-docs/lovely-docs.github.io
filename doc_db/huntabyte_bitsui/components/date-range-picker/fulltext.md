# Date Range Picker Documentation

Enables users to select a range of dates using an input field and calendar interface.

This is a documentation section that potentially contains examples, demos, and other useful information related to a specific part of Bits UI. When helping users with this documentation, you can ignore the classnames applied to the demos unless they are relevant to the user's issue.

Copy Page

```svelte
<script lang="ts">
  import { DateRangePicker } from "bits-ui";
  import CalendarBlank from "phosphor-svelte/lib/CalendarBlank";
  import CaretLeft from "phosphor-svelte/lib/CaretLeft";
  import CaretRight from "phosphor-svelte/lib/CaretRight";
</script>
<DateRangePicker.Root
  weekdayFormat="short"
  fixedWeeks={true}
  class="flex w-full max-w-[340px] flex-col gap-1.5"
>
  <DateRangePicker.Label class="block select-none text-sm font-medium"
    >Rental Days</DateRangePicker.Label
  >
  <div
    class="h-input rounded-input border-border-input bg-background text-foreground focus-within:border-border-input-hover focus-within:shadow-date-field-focus hover:border-border-input-hover flex w-full select-none items-center border px-2 py-3 text-sm tracking-[0.01em]"
  >
    {#each ["start", "end"] as const as type (type)}
      <DateRangePicker.Input {type}>
        {#snippet children({ segments })}
          {#each segments as { part, value }, i (part + i)}
            <div class="inline-block select-none">
              {#if part === "literal"}
                <DateRangePicker.Segment
                  {part}
                  class="text-muted-foreground p-1"
                >
                  {value}
                </DateRangePicker.Segment>
              {:else}
                <DateRangePicker.Segment
                  {part}
                  class="rounded-5px hover:bg-muted focus:bg-muted focus:text-foreground aria-[valuetext=Empty]:text-muted-foreground focus-visible:ring-0! focus-visible:ring-offset-0! px-1 py-1"
                >
                  {value}
                </DateRangePicker.Segment>
              {/if}
            </div>
          {/each}
        {/snippet}
      </DateRangePicker.Input>
      {#if type === "start"}
        <div aria-hidden="true" class="text-muted-foreground px-1">–⁠⁠⁠⁠⁠</div>
      {/if}
    {/each}
    <DateRangePicker.Trigger
      class="text-foreground/60 hover:bg-muted active:bg-dark-10 ml-auto inline-flex size-8 items-center justify-center rounded-[5px] transition-all"
    >
      <CalendarBlank class="size-6" />
    </DateRangePicker.Trigger>
  </div>
  <DateRangePicker.Content sideOffset={6} class="z-50">
    <DateRangePicker.Calendar
      class="rounded-15px border-dark-10 bg-background-alt shadow-popover mt-6 border p-[22px]"
    >
      {#snippet children({ months, weekdays })}
        <DateRangePicker.Header class="flex items-center justify-between">
          <DateRangePicker.PrevButton
            class="rounded-9px bg-background-alt hover:bg-muted inline-flex size-10 items-center justify-center transition-all active:scale-[0.98]"
          >
            <CaretLeft class="size-6" />
          </DateRangePicker.PrevButton>
          <DateRangePicker.Heading class="text-[15px] font-medium" />
          <DateRangePicker.NextButton
            class="rounded-9px bg-background-alt hover:bg-muted inline-flex size-10 items-center justify-center transition-all active:scale-[0.98]"
          >
            <CaretRight class="size-6" />
          </DateRangePicker.NextButton>
        </DateRangePicker.Header>
        <div
          class="flex flex-col space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0"
        >
          {#each months as month (month.value)}
            <DateRangePicker.Grid
              class="w-full border-collapse select-none space-y-1"
            >
              <DateRangePicker.GridHead>
                <DateRangePicker.GridRow
                  class="mb-1 flex w-full justify-between"
                >
                  {#each weekdays as day (day)}
                    <DateRangePicker.HeadCell
                      class="text-muted-foreground font-normal! w-10 rounded-md text-xs"
                    >
                      <div>{day.slice(0, 2)}</div>
                    </DateRangePicker.HeadCell>
                  {/each}
                </DateRangePicker.GridRow>
              </DateRangePicker.GridHead>
              <DateRangePicker.GridBody>
                {#each month.weeks as weekDates (weekDates)}
                  <DateRangePicker.GridRow class="flex w-full">
                    {#each weekDates as date (date)}
                      <DateRangePicker.Cell
                        {date}
                        month={month.value}
                        class="p-0! relative m-0 size-10 overflow-visible text-center text-sm focus-within:relative focus-within:z-20"
                      >
                        <DateRangePicker.Day
                          class="rounded-9px text-foreground hover:border-foreground focus-visible:ring-foreground! data-selection-end:rounded-9px data-selection-start:rounded-9px data-highlighted:bg-muted data-selected:bg-muted data-selection-end:bg-foreground data-selection-start:bg-foreground data-disabled:text-foreground/30 data-selected:text-foreground data-selection-end:text-background data-selection-start:text-background data-unavailable:text-muted-foreground data-selected:[&:not([data-selection-start])]:[&:not([data-selection-end])]:focus-visible:border-foreground data-disabled:pointer-events-none data-highlighted:rounded-none  data-outside-month:pointer-events-none data-selected:font-medium data-selection-end:font-medium data-selection-start:font-medium data-selection-start:focus-visible:ring-2 data-selection-start:focus-visible:ring-offset-2! data-unavailable:line-through data-selected:[&:not([data-selection-start])]:[&:not([data-selection-end])]:rounded-none data-selected:[&:not([data-selection-start])]:[&:not([data-selection-end])]:focus-visible:ring-0! data-selected:[&:not([data-selection-start])]:[&:not([data-selection-end])]:focus-visible:ring-offset-0! group relative inline-flex size-10 items-center justify-center overflow-visible whitespace-nowrap border border-transparent bg-transparent p-0 text-sm font-normal transition-all"
                        >
                          <div
                            class="bg-foreground group-data-selected:bg-background group-data-today:block absolute top-[5px] hidden size-1 rounded-full transition-all"
                          ></div>
                          {date.day}
                        </DateRangePicker.Day>
                      </DateRangePicker.Cell>
                    {/each}
                  </DateRangePicker.GridRow>
                {/each}
              </DateRangePicker.GridBody>
            </DateRangePicker.Grid>
          {/each}
        </div>
      {/snippet}
    </DateRangePicker.Calendar>
  </DateRangePicker.Content>
</DateRangePicker.Root>
```

##### Heads up!

Before diving into this component, it's important to understand how dates/times work in Bits UI. Please read the [Dates](/docs/dates) documentation to learn more!

## Structure

```svelte
<script lang="ts">
  import { DateRangePicker } from "bits-ui";
</script>
<DateRangePicker.Root>
  <DateRangePicker.Label />
  {#each ["start", "end"] as const as type}
    <DateRangePicker.Input {type}>
      {#snippet children({ segments })}
        {#each segments as { part, value }}
          <DateRangePicker.Segment {part}>
            {value}
          </DateRangePicker.Segment>
        {/each}
      {/snippet}
    </DateRangePicker.Input>
  {/each}
  <DateRangePicker.Trigger />
  <DateRangePicker.Content>
    <DateRangePicker.Calendar>
      {#snippet children({ months, weekdays })}
        <DateRangePicker.Header>
          <DateRangePicker.PrevButton />
          <DateRangePicker.Heading />
          <DateRangePicker.NextButton />
        </DateRangePicker.Header>
        {#each months as month}
          <DateRangePicker.Grid>
            <DateRangePicker.GridHead>
              <DateRangePicker.GridRow>
                {#each weekdays as day}
                  <DateRangePicker.HeadCell>
                    {day}
                  </DateRangePicker.HeadCell>
                {/each}
              </DateRangePicker.GridRow>
            </DateRangePicker.GridHead>
            <DateRangePicker.GridBody>
              {#each month.weeks as weekDates}
                <DateRangePicker.GridRow>
                  {#each weekDates as date}
                    <DateRangePicker.Cell {date} month={month.value}>
                      <DateRangePicker.Day>
                        {date.day}
                      </DateRangePicker.Day>
                    </DateRangePicker.Cell>
                  {/each}
                </DateRangePicker.GridRow>
              {/each}
            </DateRangePicker.GridBody>
          </DateRangePicker.Grid>
        {/each}
      {/snippet}
    </DateRangePicker.Calendar>
  </DateRangePicker.Content>
</DateRangePicker.Root>
```

## Managing Placeholder State

This section covers how to manage the `placeholder` state of the component.

### Two-Way Binding

Use `bind:placeholder` for simple, automatic state synchronization:

```svelte
<script lang="ts">
  import { DateRangePicker } from "bits-ui";
  import { CalendarDateTime } from "@internationalized/date";
  let myPlaceholder = $state(new CalendarDateTime(2024, 8, 3, 12, 30));
</script>
<DateRangePicker.Root bind:placeholder={myPlaceholder}>
  <!-- ... -->
</DateRangePicker.Root>
```

### Fully Controlled

Use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) for complete control over the state's reads and writes.

```svelte
<script lang="ts">
  import { DateRangePicker } from "bits-ui";
  import type { DateValue } from "@internationalized/date";
  let myPlaceholder = $state<DateValue>();
  function getPlaceholder() {
    return myPlaceholder;
  }
  function setPlaceholder(newPlaceholder: DateValue) {
    myPlaceholder = newPlaceholder;
  }
</script>
<DateRangePicker.Root bind:placeholder={getPlaceholder, setPlaceholder}>
  <!-- ... -->
</DateRangePicker.Root>
```

## Managing Value State

This section covers how to manage the `value` state of the component.

### Two-Way Binding

Use `bind:value` for simple, automatic state synchronization:

```svelte
<script lang="ts">
  import { DateRangePicker } from "bits-ui";
  import { CalendarDateTime } from "@internationalized/date";
  let myValue = $state({
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
<DateRangePicker.Root bind:value={myValue}>
  <!-- ... -->
</DateRangePicker.Root>
```

### Fully Controlled

Use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) for complete control over the state's reads and writes.

```svelte
<script lang="ts">
  import { DateRangePicker, type DateRange } from "bits-ui";
  let myValue = $state<DateRange>();
  function getValue() {
    return myValue;
  }
  function setValue(newValue: DateRange) {
    myValue = newValue;
  }
</script>
<DateRangePicker.Root bind:value={getValue, setValue}>
  <!-- ... -->
</DateRangePicker.Root>
```

## Managing Open State

This section covers how to manage the `open` state of the component.

### Two-Way Binding

Use `bind:open` for simple, automatic state synchronization:

```svelte
<script lang="ts">
  import { DateRangePicker } from "bits-ui";
  let isOpen = $state(false);
</script>
<button onclick={() => (isOpen = true)}>Open DateRangePicker</button>
<DateRangePicker.Root bind:open={isOpen}>
  <!-- ... -->
</DateRangePicker.Root>
```

### Fully Controlled

Use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) for complete control over the state's reads and writes.

```svelte
<script lang="ts">
  import { DateRangePicker } from "bits-ui";
  let myOpen = $state(false);
  function getOpen() {
    return myOpen;
  }
  function setOpen(newOpen: boolean) {
    myOpen = newOpen;
  }
</script>
<DateRangePicker.Root bind:open={getOpen, setOpen}>
  <!-- ... -->
</DateRangePicker.Root>
```

## Customization

The `DateRangePicker` component is made up of three other Bits UI components: [Date Range Field](/docs/components/date-range-field), [Range Calendar](/docs/components/range-calendar), and [Popover](/docs/components/popover).

You can check out the documentation for each of these components to learn more about their customization options, each of which can be used to customize the `DateRangePicker` component.

## API Reference

### DateRangePicker.Root

The root date picker component.

| Property                  | Type                                                                                                                                                                           | Description                                                                                                                                                                                                                                                             | Details |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `value` $bindable         | `DateRange` - { start: DateValue; end: DateValue }                                                                                                                             | The selected date range.`Default:  —— undefined`                                                                                                                                                                                                                        |         |
| `onValueChange`           | `function` - (value: DateRange) => void                                                                                                                                        | A function that is called when the selected date changes.`Default:  —— undefined`                                                                                                                                                                                       |         |
| `placeholder` $bindable   | `DateValue` - import type { CalendarDate, CalendarDateTime, ZonedDateTime } from "@internationalized/date"; type DateValue = CalendarDate \| CalendarDateTime \| ZonedDateTime | The placeholder date, which is used to determine what date to start the segments from when no value exists.`Default:  —— undefined`                                                                                                                                     |         |
| `onPlaceholderChange`     | `function` - (date: DateValue) => void                                                                                                                                         | A function that is called when the placeholder date changes.`Default:  —— undefined`                                                                                                                                                                                    |         |
| `readonlySegments`        | `EditableSegmentPart[]` - "day" \| "month" \| "year" \| "hour" \| "minute" \| "second" \| "dayPeriod"                                                                          | An array of segments that should be readonly, which prevent user input on them.`Default:  —— undefined`                                                                                                                                                                 |         |
| `isDateUnavailable`       | `function` - (date: DateValue) => boolean                                                                                                                                      | A function that returns whether or not a date is unavailable.`Default:  —— undefined`                                                                                                                                                                                   |         |
| `minValue`                | `DateValue` - import type { CalendarDate, CalendarDateTime, ZonedDateTime } from "@internationalized/date"; type DateValue = CalendarDate \| CalendarDateTime \| ZonedDateTime | The minimum valid date that can be entered.`Default:  —— undefined`                                                                                                                                                                                                     |         |
| `maxValue`                | `DateValue` - import type { CalendarDate, CalendarDateTime, ZonedDateTime } from "@internationalized/date"; type DateValue = CalendarDate \| CalendarDateTime \| ZonedDateTime | The maximum valid date that can be entered.`Default:  —— undefined`                                                                                                                                                                                                     |         |
| `validate`                | `function` - (date: DateValue) => string\[] \| string \| void                                                                                                                  | A function that returns whether or not a date is valid.`Default:  —— undefined`                                                                                                                                                                                         |         |
| `onInvalid`               | `function` - (reason: 'min' \| 'max' \| 'custom', msg?: string \| string\[]) => void                                                                                           | A callback fired when the value is invalid.`Default:  —— undefined`                                                                                                                                                                                                     |         |
| `granularity`             | `enum` - 'day' \| 'hour' \| 'minute' \| 'second'                                                                                                                               | The granularity to use for formatting the field. Defaults to `'day'` if a `CalendarDate` is provided, otherwise defaults to `'minute'`. The field will render segments for each part of the date up to and including the specified granularity.`Default:  —— undefined` |         |
| `hideTimeZone`            | `boolean`                                                                                                                                                                      | Whether or not to hide the time zone segment of the field.`Default: false`                                                                                                                                                                                              |         |
| `errorMessageId`          | `string`                                                                                                                                                                       | The `id` of the element which contains the error messages for the date field when the date is invalid.`Default:  —— undefined`                                                                                                                                          |         |
| `hourCycle`               | `enum` - '12' \| '24'                                                                                                                                                          | The hour cycle to use for formatting times. Defaults to the locale preference`Default:  —— undefined`                                                                                                                                                                   |         |
| `locale`                  | `string`                                                                                                                                                                       | The locale to use for formatting dates.`Default: en-US`                                                                                                                                                                                                                 |         |
| `disabled`                | `boolean`                                                                                                                                                                      | Whether or not the field is disabled.`Default: false`                                                                                                                                                                                                                   |         |
| `readonly`                | `boolean`                                                                                                                                                                      | Whether or not the field is readonly.`Default: false`                                                                                                                                                                                                                   |         |
| `required`                | `boolean`                                                                                                                                                                      | Whether or not the date field is required.`Default: false`                                                                                                                                                                                                              |         |
| `closeOnRangeSelect`      | `boolean`                                                                                                                                                                      | Whether or not to close the popover when a date range is selected.`Default: true`                                                                                                                                                                                       |         |
| `disableDaysOutsideMonth` | `boolean`                                                                                                                                                                      | Whether or not to disable days outside the current month.`Default: false`                                                                                                                                                                                               |         |
| `pagedNavigation`         | `boolean`                                                                                                                                                                      | Whether or not to use paged navigation for the calendar. Paged navigation causes the previous and next buttons to navigate by the number of months displayed at once, rather than by one month.`Default: false`                                                         |         |
| `preventDeselect`         | `boolean`                                                                                                                                                                      | Whether or not to prevent the user from deselecting a date without selecting another date first.`Default: false`                                                                                                                                                        |         |
| `weekdayFormat`           | `enum` - 'narrow' \| 'short' \| 'long'                                                                                                                                         | The format to use for the weekday strings provided via the `weekdays` slot prop.`Default: ''narrow''`                                                                                                                                                                   |         |
| `weekStartsOn`            | `number`                                                                                                                                                                       | An absolute day of the week to start the calendar on, regardless of locale. `0` is Sunday, `1` is Monday, etc. If not provided, the calendar will default to the locale's first day of the week.`Default:  —— undefined`                                                |         |
| `calendarLabel`           | `string`                                                                                                                                                                       | The accessible label for the calendar.`Default:  —— undefined`                                                                                                                                                                                                          |         |
| `fixedWeeks`              | `boolean`                                                                                                                                                                      | Whether or not to always display 6 weeks in the calendar.`Default: false`                                                                                                                                                                                               |         |
| `isDateDisabled`          | `function` - (date: DateValue) => boolean                                                                                                                                      | A function that returns whether or not a date is disabled.`Default:  —— undefined`                                                                                                                                                                                      |         |
| `numberOfMonths`          | `number`                                                                                                                                                                       | The number of months to display at once.`Default: 1`                                                                                                                                                                                                                    |         |
| `open` $bindable          | `boolean`                                                                                                                                                                      | The open state of the popover content.`Default: false`                                                                                                                                                                                                                  |         |
| `onOpenChange`            | `function` - (open: boolean) => void                                                                                                                                           | A callback function called when the open state changes.`Default:  —— undefined`                                                                                                                                                                                         |         |
| `onOpenChangeComplete`    | `function` - (open: boolean) => void                                                                                                                                           | A callback function called after the open state changes and all animations have completed.`Default:  —— undefined`                                                                                                                                                      |         |
| `onEndValueChange`        | `function` - (value: DateValue) => void                                                                                                                                        | A function that is called when the end date changes.`Default:  —— undefined`                                                                                                                                                                                            |         |
| `onStartValueChange`      | `function` - (value: DateValue) => void                                                                                                                                        | A function that is called when the start date changes.`Default:  —— undefined`                                                                                                                                                                                          |         |
| `minDays`                 | `number`                                                                                                                                                                       | The minimum number of days that can be selected in a range.`Default:  —— undefined`                                                                                                                                                                                     |         |
| `maxDays`                 | `number`                                                                                                                                                                       | The maximum number of days that can be selected in a range.`Default:  —— undefined`                                                                                                                                                                                     |         |
| `excludeDisabled`         | `boolean`                                                                                                                                                                      | Whether to automatically reset the range if any date within the selected range becomes disabled.`Default: false`                                                                                                                                                        |         |
| `monthFormat`             | `union` - short \| long \| narrow \| numeric \| 2-digit \| (month: number) => string                                                                                           | The format to use for the month strings provided via the `months` slot prop.`Default: 'long'`                                                                                                                                                                           |         |
| `yearFormat`              | `union` - numeric \| 2-digit \| (year: number) => string                                                                                                                       | The format to use for the year strings provided via the `years` slot prop.`Default: 'numeric'`                                                                                                                                                                          |         |
| `ref` $bindable           | `HTMLDivElement`                                                                                                                                                               | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                                                                                                                                                       |         |
| `children`                | `Snippet`                                                                                                                                                                      | The children content to render.`Default:  —— undefined`                                                                                                                                                                                                                 |         |
| `child`                   | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; };                                                                                                          | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined`                                                                                                                           |         |

| Data Attribute       | Value | Description                                                | Details |
| -------------------- | ----- | ---------------------------------------------------------- | ------- |
| `data-invalid`       | `''`  | Present on the root element when the calendar is invalid.  |         |
| `data-disabled`      | `''`  | Present on the root element when the calendar is disabled. |         |
| `data-readonly`      | `''`  | Present on the root element when the calendar is readonly. |         |
| `data-calendar-root` | `''`  | Present on the root element.                               |         |

### DateRangePicker.Label

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

### DateRangePicker.Input

The field input component which contains the segments of the date field.

| Property        | Type                                                                  | Description                                                                                                                                    | Details |
| --------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `name`          | `string`                                                              | The name of the input field used for form submission. If provided a hidden input will be rendered alongside the field.`Default:  —— undefined` |         |
| `type` required | `enum` - 'start' \| 'end'                                             | The type of field to render (start or end).`Default:  —— undefined`                                                                            |         |
| `ref` $bindable | `HTMLDivElement`                                                      | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                              |         |
| `children`      | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                        |         |
| `child`         | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined`  |         |

| Data Attribute          | Value | Description                                        | Details |
| ----------------------- | ----- | -------------------------------------------------- | ------- |
| `data-invalid`          | `''`  | Present on the element when the field is invalid.  |         |
| `data-disabled`         | `''`  | Present on the element when the field is disabled. |         |
| `data-date-field-input` | `''`  | Present on the element.                            |         |

### DateRangePicker.Segment

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

### DateRangePicker.Trigger

A component which toggles the opening and closing of the popover on press.

| Property        | Type                                                                  | Description                                                                                                                                   | Details |
| --------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `ref` $bindable | `HTMLButtonElement`                                                   | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`      | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`         | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute         | Value                       | Description                            | Details |
| ---------------------- | --------------------------- | -------------------------------------- | ------- |
| `data-state`           | `enum` - 'open' \| 'closed' | Whether the popover is open or closed. |         |
| `data-popover-trigger` | `''`                        | Present on the trigger element.        |         |

### DateRangePicker.Content

The contents of the popover which are displayed when the popover is open.

| Property                       | Type                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Description                                                                                                                                                                                                                                                                                                                                                                                                                          | Details |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| `side`                         | `enum` - 'top' \| 'bottom' \| 'left' \| 'right'                                                                                                                                                                                                                                                                                                                                                                                                         | The preferred side of the anchor to render the floating element against when open. Will be reversed when collisions occur.`Default: 'bottom'`                                                                                                                                                                                                                                                                                        |         |
| `sideOffset`                   | `number`                                                                                                                                                                                                                                                                                                                                                                                                                                                | The distance in pixels from the anchor to the floating element.`Default: 0`                                                                                                                                                                                                                                                                                                                                                          |         |
| `align`                        | `enum` - 'start' \| 'center' \| 'end'                                                                                                                                                                                                                                                                                                                                                                                                                   | The preferred alignment of the anchor to render the floating element against when open. This may change when collisions occur.`Default: 'start'`                                                                                                                                                                                                                                                                                     |         |
| `alignOffset`                  | `number`                                                                                                                                                                                                                                                                                                                                                                                                                                                | The distance in pixels from the anchor to the floating element.`Default: 0`                                                                                                                                                                                                                                                                                                                                                          |         |
| `arrowPadding`                 | `number`                                                                                                                                                                                                                                                                                                                                                                                                                                                | The amount in pixels of virtual padding around the viewport edges to check for overflow which will cause a collision.`Default: 0`                                                                                                                                                                                                                                                                                                    |         |
| `avoidCollisions`              | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                               | When `true`, overrides the `side` and `align` options to prevent collisions with the boundary edges.`Default: true`                                                                                                                                                                                                                                                                                                                  |         |
| `collisionBoundary`            | `union` - Element \| null                                                                                                                                                                                                                                                                                                                                                                                                                               | A boundary element or array of elements to check for collisions against.`Default:  —— undefined`                                                                                                                                                                                                                                                                                                                                     |         |
| `collisionPadding`             | `union` - number \| Partial\<Record\<Side, number>>                                                                                                                                                                                                                                                                                                                                                                                                     | The amount in pixels of virtual padding around the viewport edges to check for overflow which will cause a collision.`Default: 0`                                                                                                                                                                                                                                                                                                    |         |
| `sticky`                       | `enum` - 'partial' \| 'always'                                                                                                                                                                                                                                                                                                                                                                                                                          | The sticky behavior on the align axis. `'partial'` will keep the content in the boundary as long as the trigger is at least partially in the boundary whilst `'always'` will keep the content in the boundary regardless.`Default: 'partial'`                                                                                                                                                                                        |         |
| `hideWhenDetached`             | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                               | When `true`, hides the content when it is detached from the DOM. This is useful for when you want to hide the content when the user scrolls away.`Default: true`                                                                                                                                                                                                                                                                     |         |
| `updatePositionStrategy`       | `enum` - 'optimized' \| 'always'                                                                                                                                                                                                                                                                                                                                                                                                                        | The strategy to use when updating the position of the content. When `'optimized'` the content will only be repositioned when the trigger is in the viewport. When `'always'` the content will be repositioned whenever the position changes.`Default: 'optimized'`                                                                                                                                                                   |         |
| `strategy`                     | `enum` - 'fixed' \| 'absolute'                                                                                                                                                                                                                                                                                                                                                                                                                          | The positioning strategy to use for the floating element. When `'fixed'` the element will be positioned relative to the viewport. When `'absolute'` the element will be positioned relative to the nearest positioned ancestor.`Default: 'fixed'`                                                                                                                                                                                    |         |
| `preventScroll`                | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                               | When `true`, prevents the body from scrolling when the content is open. This is useful when you want to use the content as a modal.`Default: false`                                                                                                                                                                                                                                                                                  |         |
| `customAnchor`                 | `union` - string \| HTMLElement \| Measurable \| null                                                                                                                                                                                                                                                                                                                                                                                                   | Use an element other than the trigger to anchor the content to. If provided, the content will be anchored to the provided element instead of the trigger.`Default: null`                                                                                                                                                                                                                                                             |         |
| `onInteractOutside`            | `function` - (event: PointerEvent) => void                                                                                                                                                                                                                                                                                                                                                                                                              | Callback fired when an outside interaction event occurs, which is a `pointerdown` event. You can call `event.preventDefault()` to prevent the default behavior of handling the outside interaction.`Default:  —— undefined`                                                                                                                                                                                                          |         |
| `onFocusOutside`               | `function` - (event: FocusEvent) => void                                                                                                                                                                                                                                                                                                                                                                                                                | Callback fired when focus leaves the dismissible layer. You can call `event.preventDefault()` to prevent the default behavior on focus leaving the layer.`Default:  —— undefined`                                                                                                                                                                                                                                                    |         |
| `interactOutsideBehavior`      | `enum` - 'close' \| 'ignore' \| 'defer-otherwise-close' \| 'defer-otherwise-ignore'                                                                                                                                                                                                                                                                                                                                                                     | The behavior to use when an interaction occurs outside of the floating content. `'close'` will close the content immediately. `'ignore'` will prevent the content from closing. `'defer-otherwise-close'` will defer to the parent element if it exists, otherwise it will close the content. `'defer-otherwise-ignore'` will defer to the parent element if it exists, otherwise it will ignore the interaction.`Default: 'close'`  |         |
| `onEscapeKeydown`              | `function` - (event: KeyboardEvent) => void                                                                                                                                                                                                                                                                                                                                                                                                             | Callback fired when an escape keydown event occurs in the floating content. You can call `event.preventDefault()` to prevent the default behavior of handling the escape keydown event.`Default:  —— undefined`                                                                                                                                                                                                                      |         |
| `escapeKeydownBehavior`        | `enum` - 'close' \| 'ignore' \| 'defer-otherwise-close' \| 'defer-otherwise-ignore'                                                                                                                                                                                                                                                                                                                                                                     | The behavior to use when an escape keydown event occurs in the floating content. `'close'` will close the content immediately. `'ignore'` will prevent the content from closing. `'defer-otherwise-close'` will defer to the parent element if it exists, otherwise it will close the content. `'defer-otherwise-ignore'` will defer to the parent element if it exists, otherwise it will ignore the interaction.`Default: 'close'` |         |
| `onOpenAutoFocus`              | `function` - (event: Event) => void                                                                                                                                                                                                                                                                                                                                                                                                                     | Event handler called when auto-focusing the content as it is opened. Can be prevented.`Default:  —— undefined`                                                                                                                                                                                                                                                                                                                       |         |
| `onCloseAutoFocus`             | `function` - (event: Event) => void                                                                                                                                                                                                                                                                                                                                                                                                                     | Event handler called when auto-focusing the content as it is closed. Can be prevented.`Default:  —— undefined`                                                                                                                                                                                                                                                                                                                       |         |
| `trapFocus`                    | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                               | Whether or not to trap the focus within the content when open.`Default: true`                                                                                                                                                                                                                                                                                                                                                        |         |
| `preventOverflowTextSelection` | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                               | When `true`, prevents the text selection from overflowing the bounds of the element.`Default: true`                                                                                                                                                                                                                                                                                                                                  |         |
| `forceMount`                   | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                               | Whether or not to forcefully mount the content. This is useful if you want to use Svelte transitions or another animation library for the content.`Default: false`                                                                                                                                                                                                                                                                   |         |
| `dir`                          | `enum` - 'ltr' \| 'rtl'                                                                                                                                                                                                                                                                                                                                                                                                                                 | The reading direction of the app.`Default: 'ltr'`                                                                                                                                                                                                                                                                                                                                                                                    |         |
| `ref` $bindable                | `HTMLDivElement`                                                                                                                                                                                                                                                                                                                                                                                                                                        | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                                                                                                                                                                                                                                                                                                                    |         |
| `children`                     | `Snippet`                                                                                                                                                                                                                                                                                                                                                                                                                                               | The children content to render.`Default:  —— undefined`                                                                                                                                                                                                                                                                                                                                                                              |         |
| `child`                        | `Snippet` - type ChildSnippetProps = { /\*\* \* Props for the positioning wrapper \* Do not style this element - \* styling should be applied to the content element \*/ wrapperProps: Record\<string, unknown>; /\*\* \* Props for your content element \* Apply your custom styles here \*/ props: Record\<string, unknown>; /\*\* \* Content visibility state \* Use this for conditional rendering with \* Svelte transitions \*/ open: boolean; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined`                                                                                                                                                                                                                                                                                        |         |

| Data Attribute         | Value                       | Description                            | Details |
| ---------------------- | --------------------------- | -------------------------------------- | ------- |
| `data-state`           | `enum` - 'open' \| 'closed' | Whether the popover is open or closed. |         |
| `data-popover-content` | `''`                        | Present on the content element.        |         |

| CSS Variable                              | Description                                  | Details |
| ----------------------------------------- | -------------------------------------------- | ------- |
| `--bits-popover-content-transform-origin` | The transform origin of the content element. |         |
| `--bits-popover-content-available-width`  | The available width of the content element.  |         |
| `--bits-popover-content-available-height` | The available height of the content element. |         |
| `--bits-popover-anchor-width`             | The width of the anchor element.             |         |
| `--bits-popover-anchor-height`            | The height of the anchor element.            |         |

### DateRangePicker.Portal

When used, will render the popover content into the body or custom `to` element when open

| Property   | Type                        | Description                                                                                                                      | Details |
| ---------- | --------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `to`       | `union` - Element \| string | Where to render the content when it is open. Defaults to the body.`Default: document.body`                                       |         |
| `disabled` | `boolean`                   | Whether the portal is disabled or not. When disabled, the content will be rendered in its original DOM location.`Default: false` |         |
| `children` | `Snippet`                   | The children content to render.`Default:  —— undefined`                                                                          |         |

### DateRangePicker.Calendar

The calendar component containing the grids of dates.

| Data Attribute       | Value | Description                                                | Details |
| -------------------- | ----- | ---------------------------------------------------------- | ------- |
| `data-invalid`       | `''`  | Present on the root element when the calendar is invalid.  |         |
| `data-disabled`      | `''`  | Present on the root element when the calendar is disabled. |         |
| `data-readonly`      | `''`  | Present on the root element when the calendar is readonly. |         |
| `data-calendar-root` | `''`  | Present on the root element.                               |         |

### DateRangePicker.Header

The header of the calendar.

| Property        | Type                                                                  | Description                                                                                                                                   | Details |
| --------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `ref` $bindable | `HTMLElement`                                                         | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`      | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`         | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute               | Value | Description                                                  | Details |
| ---------------------------- | ----- | ------------------------------------------------------------ | ------- |
| `data-disabled`              | `''`  | Present on the header element when the calendar is disabled. |         |
| `data-readonly`              | `''`  | Present on the header element when the calendar is readonly. |         |
| `data-range-calendar-header` | `''`  | Present on the header element.                               |         |

### DateRangePicker.PrevButton

The previous button of the calendar.

| Property        | Type                                                                  | Description                                                                                                                                   | Details |
| --------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `ref` $bindable | `HTMLButtonElement`                                                   | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`      | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`         | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute                    | Value | Description                                                                      | Details |
| --------------------------------- | ----- | -------------------------------------------------------------------------------- | ------- |
| `data-disabled`                   | `''`  | Present on the prev button element when the calendar or this button is disabled. |         |
| `data-range-calendar-prev-button` | `''`  | Present on the prev button element.                                              |         |

### DateRangePicker.Heading

The heading of the calendar.

| Property        | Type                                                                  | Description                                                                                                                                   | Details |
| --------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `ref` $bindable | `HTMLDivElement`                                                      | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`      | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`         | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute                | Value | Description                                                   | Details |
| ----------------------------- | ----- | ------------------------------------------------------------- | ------- |
| `data-disabled`               | `''`  | Present on the heading element when the calendar is disabled. |         |
| `data-readonly`               | `''`  | Present on the heading element when the calendar is readonly. |         |
| `data-range-calendar-heading` | `''`  | Present on the heading element.                               |         |

### DateRangePicker.NextButton

The next button of the calendar.

| Property        | Type                                                                  | Description                                                                                                                                   | Details |
| --------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `ref` $bindable | `HTMLButtonElement`                                                   | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`      | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`         | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute                    | Value | Description                                                                      | Details |
| --------------------------------- | ----- | -------------------------------------------------------------------------------- | ------- |
| `data-disabled`                   | `''`  | Present on the next button element when the calendar or this button is disabled. |         |
| `data-range-calendar-next-button` | `''`  | Present on the next button element.                                              |         |

### DateRangePicker.Grid

The grid of dates in the calendar, typically representing a month.

| Property        | Type                                                                  | Description                                                                                                                                   | Details |
| --------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `ref` $bindable | `HTMLTableElement`                                                    | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`      | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`         | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute             | Value | Description                                                | Details |
| -------------------------- | ----- | ---------------------------------------------------------- | ------- |
| `data-disabled`            | `''`  | Present on the grid element when the calendar is disabled. |         |
| `data-readonly`            | `''`  | Present on the grid element when the calendar is readonly. |         |
| `data-range-calendar-grid` | `''`  | Present on the grid element.                               |         |

### DateRangePicker.GridRow

A row in the grid of dates in the calendar.

| Property        | Type                                                                  | Description                                                                                                                                   | Details |
| --------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `ref` $bindable | `HTMLTableRowElement`                                                 | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`      | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`         | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute                 | Value | Description                                                    | Details |
| ------------------------------ | ----- | -------------------------------------------------------------- | ------- |
| `data-disabled`                | `''`  | Present on the grid row element when the calendar is disabled. |         |
| `data-readonly`                | `''`  | Present on the grid row element when the calendar is readonly. |         |
| `data-range-calendar-grid-row` | `''`  | Present on the grid row element.                               |         |

### DateRangePicker.GridHead

The head of the grid of dates in the calendar.

| Property        | Type                                                                  | Description                                                                                                                                   | Details |
| --------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `ref` $bindable | `HTMLTableSectionElement`                                             | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`      | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`         | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute                  | Value | Description                                                     | Details |
| ------------------------------- | ----- | --------------------------------------------------------------- | ------- |
| `data-disabled`                 | `''`  | Present on the grid head element when the calendar is disabled. |         |
| `data-readonly`                 | `''`  | Present on the grid head element when the calendar is readonly. |         |
| `data-range-calendar-grid-head` | `''`  | Present on the grid head element.                               |         |

### DateRangePicker.HeadCell

A cell in the head of the grid of dates in the calendar.

| Property        | Type                                                                  | Description                                                                                                                                   | Details |
| --------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `ref` $bindable | `HTMLTableCellElement`                                                | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`      | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`         | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute                  | Value | Description                                                     | Details |
| ------------------------------- | ----- | --------------------------------------------------------------- | ------- |
| `data-disabled`                 | `''`  | Present on the head cell element when the calendar is disabled. |         |
| `data-readonly`                 | `''`  | Present on the head cell element when the calendar is readonly. |         |
| `data-range-calendar-head-cell` | `''`  | Present on the head cell element.                               |         |

### DateRangePicker.GridBody

The body of the grid of dates in the calendar.

| Property        | Type                                                                  | Description                                                                                                                                   | Details |
| --------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `ref` $bindable | `HTMLTableSectionElement`                                             | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`      | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`         | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute                  | Value | Description                                                | Details |
| ------------------------------- | ----- | ---------------------------------------------------------- | ------- |
| `data-disabled`                 | `''`  | Present on the grid element when the calendar is disabled. |         |
| `data-readonly`                 | `''`  | Present on the grid element when the calendar is readonly. |         |
| `data-range-calendar-grid-body` | `''`  | Present on the grid body element.                          |         |

### DateRangePicker.Cell

A cell in the calendar grid.

| Property        | Type                                                                                                                                                                           | Description                                                                                                                                   | Details |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `date`          | `DateValue` - import type { CalendarDate, CalendarDateTime, ZonedDateTime } from "@internationalized/date"; type DateValue = CalendarDate \| CalendarDateTime \| ZonedDateTime | The date for the cell.`Default:  —— undefined`                                                                                                |         |
| `month`         | `DateValue` - import type { CalendarDate, CalendarDateTime, ZonedDateTime } from "@internationalized/date"; type DateValue = CalendarDate \| CalendarDateTime \| ZonedDateTime | The current month the date is being displayed in.`Default:  —— undefined`                                                                     |         |
| `ref` $bindable | `HTMLTableCellElement`                                                                                                                                                         | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`      | `Snippet`                                                                                                                                                                      | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`         | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; };                                                                                                          | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute                | Value | Description                                                                                             | Details |
| ----------------------------- | ----- | ------------------------------------------------------------------------------------------------------- | ------- |
| `data-disabled`               | `''`  | Present when the day is disabled.                                                                       |         |
| `data-unavailable`            | `''`  | Present when the day is unavailable.                                                                    |         |
| `data-today`                  | `''`  | Present when the day is today.                                                                          |         |
| `data-outside-month`          | `''`  | Present when the day is outside the current month.                                                      |         |
| `data-outside-visible-months` | `''`  | Present when the day is outside the visible months.                                                     |         |
| `data-focused`                | `''`  | Present when the day is focused.                                                                        |         |
| `data-selected`               | `''`  | Present when the day is selected.                                                                       |         |
| `data-value`                  | `''`  | The date in the format "YYYY-MM-DD".                                                                    |         |
| `data-range-calendar-cell`    | `''`  | Present on the cell element.                                                                            |         |
| `data-range-start`            | `''`  | Present when the cell is the start of a selection range.                                                |         |
| `data-range-end`              | `''`  | Present when the cell is the end of a selection range.                                                  |         |
| `data-range-middle`           | `''`  | Present when the cell is in the middle of a selection range, but not the start or end of the selection. |         |
| `data-highlighted`            | `''`  | Present when the cell is highlighted within a selection range.                                          |         |

### DateRangePicker.Day

A day in the calendar grid.

| Property        | Type                                                                  | Description                                                                                                                                   | Details |
| --------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `ref` $bindable | `HTMLDivElement`                                                      | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`      | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`         | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute                | Value | Description                                                                                             | Details |
| ----------------------------- | ----- | ------------------------------------------------------------------------------------------------------- | ------- |
| `data-disabled`               | `''`  | Present when the day is disabled.                                                                       |         |
| `data-unavailable`            | `''`  | Present when the day is unavailable.                                                                    |         |
| `data-today`                  | `''`  | Present when the day is today.                                                                          |         |
| `data-outside-month`          | `''`  | Present when the day is outside the current month.                                                      |         |
| `data-outside-visible-months` | `''`  | Present when the day is outside the visible months.                                                     |         |
| `data-focused`                | `''`  | Present when the day is focused.                                                                        |         |
| `data-selected`               | `''`  | Present when the day is selected.                                                                       |         |
| `data-value`                  | `''`  | The date in the format "YYYY-MM-DD".                                                                    |         |
| `data-range-calendar-day`     | `''`  | Present on the day element.                                                                             |         |
| `data-range-start`            | `''`  | Present when the cell is the start of a selection range.                                                |         |
| `data-range-end`              | `''`  | Present when the cell is the end of a selection range.                                                  |         |
| `data-range-middle`           | `''`  | Present when the cell is in the middle of a selection range, but not the start or end of the selection. |         |
| `data-highlighted`            | `''`  | Present when the cell is highlighted within a selection range.                                          |         |

### DateRangePicker.MonthSelect

A select you can use to navigate to a specific month in the calendar view.

| Property        | Type                                                                                                                                                                                 | Description                                                                                                                                                                                                     | Details |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `months`        | `number[]`                                                                                                                                                                           | The month values to render in the select.`Default: [1-12]`                                                                                                                                                      |         |
| `monthFormat`   | `enum` - 'narrow' \| 'short' \| 'long' \| 'numeric' \| '2-digit' \| '(month: number) => string'                                                                                      | The format to use for the month strings provided via the `months` slot prop. If a function is provided, it will be called with the month number as an argument and should return a string.`Default: ''narrow''` |         |
| `ref` $bindable | `HTMLSelectElement`                                                                                                                                                                  | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                                                                                               |         |
| `children`      | `Snippet` - type ChildrenSnippetProps = { monthItems: Array<{ value: number; label: string }>; selectedMonthItem: { value: number; label: string }; };                               | The children content to render.`Default:  —— undefined`                                                                                                                                                         |         |
| `child`         | `Snippet` - type ChildSnippetProps = { props: Record\<string, unknown>; monthItems: Array<{ value: number; label: string }>; selectedMonthItem: { value: number; label: string }; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined`                                                                   |         |

| Data Attribute                     | Value | Description                                                        | Details |
| ---------------------------------- | ----- | ------------------------------------------------------------------ | ------- |
| `data-disabled`                    | `''`  | Present on the month select element when the calendar is disabled. |         |
| `data-range-calendar-month-select` | `''`  | Present on the month select element.                               |         |

### DateRangePicker.YearSelect

A select you can use to navigate to a specific year in the calendar view.

| Property        | Type                                                                                                                                                                               | Description                                                                                                                                                                                                                                       | Details |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `years`         | `number[]`                                                                                                                                                                         | The year values to render in the select.``Default: The current year or placeholder year (whichever is higher) + 10 and minus 100 years. When a `minValue`/`maxValue` is provided to `Calendar.Root`, those will be used to constrain the range.`` |         |
| `yearFormat`    | `enum` - 'numeric' \| '2-digit' \| '(year: number) => string'                                                                                                                      | The format to use for the year strings provided via the `years` slot prop. If a function is provided, it will be called with the year as an argument and should return a string.`Default: ''numeric''`                                            |         |
| `ref` $bindable | `HTMLSelectElement`                                                                                                                                                                | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                                                                                                                                 |         |
| `children`      | `Snippet` - type ChildrenSnippetProps = { yearItems: Array<{ value: number; label: string }>; selectedYearItem: { value: number; label: string }; };                               | The children content to render.`Default:  —— undefined`                                                                                                                                                                                           |         |
| `child`         | `Snippet` - type ChildSnippetProps = { props: Record\<string, unknown>; yearItems: Array<{ value: number; label: string }>; selectedYearItem: { value: number; label: string }; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined`                                                                                                     |         |

| Data Attribute                    | Value | Description                                                       | Details |
| --------------------------------- | ----- | ----------------------------------------------------------------- | ------- |
| `data-disabled`                   | `''`  | Present on the year select element when the calendar is disabled. |         |
| `data-range-calendar-year-select` | `''`  | Present on the year select element.                               |         |

[Previous Date Range Field](/docs/components/date-range-field) [Next Dialog](/docs/components/dialog)