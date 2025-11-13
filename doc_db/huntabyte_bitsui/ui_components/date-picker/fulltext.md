# Date Picker Documentation

Enables users to select dates using an input field and calendar interface.

This is a documentation section that potentially contains examples, demos, and other useful information related to a specific part of Bits UI. When helping users with this documentation, you can ignore the classnames applied to the demos unless they are relevant to the user's issue.

Copy Page

```svelte
<script lang="ts">
  import { DatePicker } from "bits-ui";
  import CalendarBlank from "phosphor-svelte/lib/CalendarBlank";
  import CaretLeft from "phosphor-svelte/lib/CaretLeft";
  import CaretRight from "phosphor-svelte/lib/CaretRight";
</script>
<DatePicker.Root weekdayFormat="short" fixedWeeks={true}>
  <div class="flex w-full max-w-[232px] flex-col gap-1.5">
    <DatePicker.Label class="block select-none text-sm font-medium"
      >Birthday</DatePicker.Label
    >
    <DatePicker.Input
      class="h-input rounded-input border-border-input bg-background text-foreground focus-within:border-border-input-hover focus-within:shadow-date-field-focus hover:border-border-input-hover flex w-full max-w-[232px] select-none items-center border px-2 py-3 text-sm tracking-[0.01em]"
    >
      {#snippet children({ segments })}
        {#each segments as { part, value }, i (part + i)}
          <div class="inline-block select-none">
            {#if part === "literal"}
              <DatePicker.Segment {part} class="text-muted-foreground p-1">
                {value}
              </DatePicker.Segment>
            {:else}
              <DatePicker.Segment
                {part}
                class="rounded-5px hover:bg-muted focus:bg-muted focus:text-foreground aria-[valuetext=Empty]:text-muted-foreground focus-visible:ring-0! focus-visible:ring-offset-0! px-1 py-1"
              >
                {value}
              </DatePicker.Segment>
            {/if}
          </div>
        {/each}
        <DatePicker.Trigger
          class="text-foreground/60 hover:bg-muted active:bg-dark-10 ml-auto inline-flex size-8 items-center justify-center rounded-[5px] transition-all"
        >
          <CalendarBlank class="size-6" />
        </DatePicker.Trigger>
      {/snippet}
    </DatePicker.Input>
    <DatePicker.Content sideOffset={6} class="z-50">
      <DatePicker.Calendar
        class="border-dark-10 bg-background-alt shadow-popover rounded-[15px] border p-[22px]"
      >
        {#snippet children({ months, weekdays })}
          <DatePicker.Header class="flex items-center justify-between">
            <DatePicker.PrevButton
              class="rounded-9px bg-background-alt hover:bg-muted inline-flex size-10 items-center justify-center transition-all active:scale-[0.98]"
            >
              <CaretLeft class="size-6" />
            </DatePicker.PrevButton>
            <DatePicker.Heading class="text-[15px] font-medium" />
            <DatePicker.NextButton
              class="rounded-9px bg-background-alt hover:bg-muted inline-flex size-10 items-center justify-center transition-all active:scale-[0.98]"
            >
              <CaretRight class="size-6" />
            </DatePicker.NextButton>
          </DatePicker.Header>
          <div
            class="flex flex-col space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0"
          >
            {#each months as month (month.value)}
              <DatePicker.Grid
                class="w-full border-collapse select-none space-y-1"
              >
                <DatePicker.GridHead>
                  <DatePicker.GridRow class="mb-1 flex w-full justify-between">
                    {#each weekdays as day (day)}
                      <DatePicker.HeadCell
                        class="text-muted-foreground font-normal! w-10 rounded-md text-xs"
                      >
                        <div>{day.slice(0, 2)}</div>
                      </DatePicker.HeadCell>
                    {/each}
                  </DatePicker.GridRow>
                </DatePicker.GridHead>
                <DatePicker.GridBody>
                  {#each month.weeks as weekDates (weekDates)}
                    <DatePicker.GridRow class="flex w-full">
                      {#each weekDates as date (date)}
                        <DatePicker.Cell
                          {date}
                          month={month.value}
                          class="p-0! relative size-10 text-center text-sm"
                        >
                          <DatePicker.Day
                            class="rounded-9px text-foreground hover:border-foreground data-selected:bg-foreground data-disabled:text-foreground/30 data-selected:text-background data-unavailable:text-muted-foreground data-disabled:pointer-events-none data-outside-month:pointer-events-none data-selected:font-medium data-unavailable:line-through group relative inline-flex size-10 items-center justify-center whitespace-nowrap border border-transparent bg-transparent p-0 text-sm font-normal transition-all"
                          >
                            <div
                              class="bg-foreground group-data-selected:bg-background group-data-today:block absolute top-[5px] hidden size-1 rounded-full transition-all"
                            ></div>
                            {date.day}
                          </DatePicker.Day>
                        </DatePicker.Cell>
                      {/each}
                    </DatePicker.GridRow>
                  {/each}
                </DatePicker.GridBody>
              </DatePicker.Grid>
            {/each}
          </div>
        {/snippet}
      </DatePicker.Calendar>
    </DatePicker.Content>
  </div>
</DatePicker.Root>
```

##### Heads up!

Before diving into this component, it's important to understand how dates/times work in Bits UI. Please read the [Dates](/docs/dates) documentation to learn more!

## Structure

```svelte
<script lang="ts">
  import { DatePicker } from "bits-ui";
</script>
<DatePicker.Root>
  <DatePicker.Label />
  <DatePicker.Input>
    {#snippet children({ segments })}
      {#each segments as { part, value }}
        <DatePicker.Segment {part}>
          {value}
        </DatePicker.Segment>
      {/each}
      <DatePicker.Trigger />
    {/snippet}
  </DatePicker.Input>
  <DatePicker.Content>
    <DatePicker.Calendar>
      {#snippet children({ months, weekdays })}
        <DatePicker.Header>
          <DatePicker.PrevButton />
          <DatePicker.Heading />
          <DatePicker.NextButton />
        </DatePicker.Header>
        {#each months as month}
          <DatePicker.Grid>
            <DatePicker.GridHead>
              <DatePicker.GridRow>
                {#each weekdays as day}
                  <DatePicker.HeadCell>
                    {day}
                  </DatePicker.HeadCell>
                {/each}
              </DatePicker.GridRow>
            </DatePicker.GridHead>
            <DatePicker.GridBody>
              {#each month.weeks as weekDates}
                <DatePicker.GridRow>
                  {#each weekDates as date}
                    <DatePicker.Cell {date} month={month.value}>
                      <DatePicker.Day />
                    </DatePicker.Cell>
                  {/each}
                </DatePicker.GridRow>
              {/each}
            </DatePicker.GridBody>
          </DatePicker.Grid>
        {/each}
      {/snippet}
    </DatePicker.Calendar>
  </DatePicker.Content>
</DatePicker.Root>
```

## Managing Placeholder State

This section covers how to manage the `placeholder` state of the component.

### Two-Way Binding

Use `bind:placeholder` for simple, automatic state synchronization:

```svelte
<script lang="ts">
  import { DatePicker } from "bits-ui";
  import { CalendarDateTime } from "@internationalized/date";
  let myPlaceholder = $state();
</script>
<button
  onclick={() => {
    myPlaceholder = new CalendarDateTime(2024, 8, 3, 12, 30);
  }}
>
  Set placeholder to August 3rd, 2024
</button>
<DatePicker.Root bind:placeholder={myPlaceholder}>
  <!-- ... -->
</DatePicker.Root>
```

### Fully Controlled

Use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) for complete control over the state's reads and writes.

```svelte
<script lang="ts">
  import { DatePicker } from "bits-ui";
  import type { DateValue } from "@internationalized/date";
  let myPlaceholder = $state<DateValue>();
  function getPlaceholder() {
    return myPlaceholder;
  }
  function setPlaceholder(newPlaceholder: DateValue) {
    myPlaceholder = newPlaceholder;
  }
</script>
<DatePicker.Root bind:placeholder={getPlaceholder, setPlaceholder}>
  <!-- ... -->
</DatePicker.Root>
```

## Managing Value State

This section covers how to manage the `value` state of the component.

### Two-Way Binding

Use `bind:value` for simple, automatic state synchronization:

```svelte
<script lang="ts">
  import { DatePicker } from "bits-ui";
  import { CalendarDateTime } from "@internationalized/date";
  let myValue = $state(new CalendarDateTime(2024, 8, 3, 12, 30));
</script>
<button onclick={() => (myValue = myValue.add({ days: 1 }))}>
  Add 1 day
</button>
<DatePicker.Root bind:value={myValue}>
  <!-- ... -->
</DatePicker.Root>
```

### Fully Controlled

Use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) for complete control over the state's reads and writes.

```svelte
<script lang="ts">
  import { DatePicker } from "bits-ui";
  import type { DateValue } from "@internationalized/date";
  let myValue = $state<DateValue>();
  function getValue() {
    return myValue;
  }
  function setValue(newValue: DateValue) {
    myValue = newValue;
  }
</script>
<DatePicker.Root bind:value={getValue, setValue}>
  <!-- ... -->
</DatePicker.Root>
```

## Managing Open State

This section covers how to manage the `open` state of the component.

### Two-Way Binding

Use `bind:open` for simple, automatic state synchronization:

```svelte
<script lang="ts">
  import { DatePicker } from "bits-ui";
  let isOpen = $state(false);
</script>
<button onclick={() => (isOpen = true)}>Open DatePicker</button>
<DatePicker.Root bind:open={isOpen}>
  <!-- ... -->
</DatePicker.Root>
```

### Fully Controlled

Use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) for complete control over the state's reads and writes.

```svelte
<script lang="ts">
  import { DatePicker } from "bits-ui";
  let myOpen = $state(false);
  function getOpen() {
    return myOpen;
  }
  function setOpen(newOpen: boolean) {
    myOpen = newOpen;
  }
</script>
<DatePicker.Root bind:open={getOpen, setOpen}>
  <!-- ... -->
</DatePicker.Root>
```

## Customization

The `DatePicker` component is made up of three other Bits UI components: [Date Field](/docs/components/date-field), [Calendar](/docs/components/calendar), and [Popover](/docs/components/popover).

You can check out the documentation for each of these components to learn more about their customization options, each of which can be used to customize the `DatePicker` component.

## API Reference

### DatePicker.Root

The root date picker component.

| Property                  | Type                                                                                                                                                                           | Description                                                                                                                                                                                                                                                             | Details |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `value`                   | `DateValue` - import type { CalendarDate, CalendarDateTime, ZonedDateTime } from "@internationalized/date"; type DateValue = CalendarDate \| CalendarDateTime \| ZonedDateTime | The selected date.`Default:  —— undefined`                                                                                                                                                                                                                              |         |
| `onValueChange`           | `function` - (value: DateValue) => void \| (value: DateValue\[]) => void                                                                                                       | A function that is called when the selected date changes.`Default:  —— undefined`                                                                                                                                                                                       |         |
| `open` $bindable          | `boolean`                                                                                                                                                                      | The open state of the popover content.`Default: false`                                                                                                                                                                                                                  |         |
| `onOpenChange`            | `function` - (open: boolean) => void                                                                                                                                           | A callback function called when the open state changes.`Default:  —— undefined`                                                                                                                                                                                         |         |
| `onOpenChangeComplete`    | `function` - (open: boolean) => void                                                                                                                                           | A callback function called after the open state changes and all animations have completed.`Default:  —— undefined`                                                                                                                                                      |         |
| `placeholder`             | `DateValue` - import type { CalendarDate, CalendarDateTime, ZonedDateTime } from "@internationalized/date"; type DateValue = CalendarDate \| CalendarDateTime \| ZonedDateTime | The placeholder date, which is used to determine what month to display when no date is selected. This updates as the user navigates the calendar, and can be used to programmatically control the calendar's view.`Default:  —— undefined`                              |         |
| `onPlaceholderChange`     | `function` - (date: DateValue) => void                                                                                                                                         | A function that is called when the placeholder date changes.`Default:  —— undefined`                                                                                                                                                                                    |         |
| `isDateUnavailable`       | `function` - (date: DateValue) => boolean                                                                                                                                      | A function that returns whether or not a date is unavailable.`Default:  —— undefined`                                                                                                                                                                                   |         |
| `isDateDisabled`          | `function` - (date: DateValue) => boolean                                                                                                                                      | A function that returns whether or not a date is disabled.`Default:  —— undefined`                                                                                                                                                                                      |         |
| `validate`                | `function` - (date: DateValue) => string\[] \| string \| void                                                                                                                  | A function that returns whether or not a date is valid.`Default:  —— undefined`                                                                                                                                                                                         |         |
| `onInvalid`               | `function` - (reason: 'min' \| 'max' \| 'custom', msg?: string \| string\[]) => void                                                                                           | A callback fired when the value is invalid.`Default:  —— undefined`                                                                                                                                                                                                     |         |
| `required`                | `boolean`                                                                                                                                                                      | Whether or not the date field is required.`Default: false`                                                                                                                                                                                                              |         |
| `errorMessageId`          | `string`                                                                                                                                                                       | The `id` of the element which contains the error messages for the date field when the date is invalid.`Default:  —— undefined`                                                                                                                                          |         |
| `readonlySegments`        | `EditableSegmentPart[]` - "day" \| "month" \| "year" \| "hour" \| "minute" \| "second" \| "dayPeriod"                                                                          | An array of segments that should be readonly, which prevent user input on them.`Default:  —— undefined`                                                                                                                                                                 |         |
| `disableDaysOutsideMonth` | `boolean`                                                                                                                                                                      | Whether or not to disable days outside the current month.`Default: false`                                                                                                                                                                                               |         |
| `closeOnDateSelect`       | `boolean`                                                                                                                                                                      | Whether or not to close the popover when a date is selected.`Default: true`                                                                                                                                                                                             |         |
| `pagedNavigation`         | `boolean`                                                                                                                                                                      | Whether or not to use paged navigation for the calendar. Paged navigation causes the previous and next buttons to navigate by the number of months displayed at once, rather than by one month.`Default: false`                                                         |         |
| `preventDeselect`         | `boolean`                                                                                                                                                                      | Whether or not to prevent the user from deselecting a date without selecting another date first.`Default: false`                                                                                                                                                        |         |
| `weekStartsOn`            | `number`                                                                                                                                                                       | An absolute day of the week to start the calendar on, regardless of locale. `0` is Sunday, `1` is Monday, etc. If not provided, the calendar will default to the locale's first day of the week.`Default:  —— undefined`                                                |         |
| `weekdayFormat`           | `enum` - 'narrow' \| 'short' \| 'long'                                                                                                                                         | The format to use for the weekday strings provided via the `weekdays` slot prop.`Default: ''narrow''`                                                                                                                                                                   |         |
| `calendarLabel`           | `string`                                                                                                                                                                       | The accessible label for the calendar.`Default:  —— undefined`                                                                                                                                                                                                          |         |
| `fixedWeeks`              | `boolean`                                                                                                                                                                      | Whether or not to always display 6 weeks in the calendar.`Default: false`                                                                                                                                                                                               |         |
| `maxValue`                | `DateValue` - import type { CalendarDate, CalendarDateTime, ZonedDateTime } from "@internationalized/date"; type DateValue = CalendarDate \| CalendarDateTime \| ZonedDateTime | The maximum date that can be selected.`Default:  —— undefined`                                                                                                                                                                                                          |         |
| `minValue`                | `DateValue` - import type { CalendarDate, CalendarDateTime, ZonedDateTime } from "@internationalized/date"; type DateValue = CalendarDate \| CalendarDateTime \| ZonedDateTime | The minimum date that can be selected.`Default:  —— undefined`                                                                                                                                                                                                          |         |
| `locale`                  | `string`                                                                                                                                                                       | The locale to use for formatting dates.`Default: 'en'`                                                                                                                                                                                                                  |         |
| `numberOfMonths`          | `number`                                                                                                                                                                       | The number of months to display at once.`Default: 1`                                                                                                                                                                                                                    |         |
| `disabled`                | `boolean`                                                                                                                                                                      | Whether or not the Date Picker is disabled.`Default: false`                                                                                                                                                                                                             |         |
| `readonly`                | `boolean`                                                                                                                                                                      | Whether or not the Date Picker is readonly.`Default: false`                                                                                                                                                                                                             |         |
| `hourCycle`               | `enum` - '12' \| '24'                                                                                                                                                          | The hour cycle to use for formatting times. Defaults to the locale preference`Default:  —— undefined`                                                                                                                                                                   |         |
| `granularity`             | `enum` - 'day' \| 'hour' \| 'minute' \| 'second'                                                                                                                               | The granularity to use for formatting the field. Defaults to `'day'` if a `CalendarDate` is provided, otherwise defaults to `'minute'`. The field will render segments for each part of the date up to and including the specified granularity.`Default:  —— undefined` |         |
| `hideTimeZone`            | `boolean`                                                                                                                                                                      | Whether or not to hide the time zone segment of the field.`Default: false`                                                                                                                                                                                              |         |
| `initialFocus`            | `boolean`                                                                                                                                                                      | If `true`, the calendar will focus the selected day, today, or the first day of the month in that order depending on what is visible when the calendar is mounted.`Default: false`                                                                                      |         |
| `monthFormat`             | `union` - short \| long \| narrow \| numeric \| 2-digit \| (month: number) => string                                                                                           | The format to use for the month strings provided via the `months` slot prop.`Default: 'long'`                                                                                                                                                                           |         |
| `yearFormat`              | `union` - numeric \| 2-digit \| (year: number) => string                                                                                                                       | The format to use for the year strings provided via the `years` slot prop.`Default: 'numeric'`                                                                                                                                                                          |         |
| `children`                | `Snippet`                                                                                                                                                                      | The children content to render.`Default:  —— undefined`                                                                                                                                                                                                                 |         |

### DatePicker.Label

The label for the date field.

| Property        | Type                                                                  | Description                                                                                                                                   | Details |
| --------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `ref` $bindable | `HTMLSpanElement`                                                     | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`      | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`         | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute          | Value | Description                                       | Details |
| ----------------------- | ----- | ------------------------------------------------- | ------- |
| `data-invalid`          | `''`  | Present on the element when the field is invalid  |         |
| `data-disabled`         | `''`  | Present on the element when the field is disabled |         |
| `data-date-field-label` | `''`  | Present on the element.                           |         |

### DatePicker.Input

The field input component which contains the segments of the date field.

| Property        | Type                                                                  | Description                                                                                                                                                 | Details |
| --------------- | --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `ref` $bindable | `HTMLDivElement`                                                      | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                                           |         |
| `children`      | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                                     |         |
| `child`         | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined`               |         |
| `name`          | `string`                                                              | The name of the date field used for form submission. If provided, a hidden input element will be rendered alongside the date field.`Default:  —— undefined` |         |

| Data Attribute          | Value | Description                                        | Details |
| ----------------------- | ----- | -------------------------------------------------- | ------- |
| `data-invalid`          | `''`  | Present on the element when the field is invalid.  |         |
| `data-disabled`         | `''`  | Present on the element when the field is disabled. |         |
| `data-date-field-input` | `''`  | Present on the element.                            |         |

### DatePicker.Segment

A segment of the date field.

| Property        | Type                                                                                                                       | Description                                                                                                                                   | Details |
| --------------- | -------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `part` required | `SegmentPart` - "day" \|"month" \| "year" \| "hour" \| "minute" \| "second" \| "dayPeriod" \| "timeZoneName" \| "literal"; | The part of the date to render.`Default:  —— undefined`                                                                                       |         |
| `ref` $bindable | `HTMLDivElement`                                                                                                           | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`      | `Snippet`                                                                                                                  | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`         | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; };                                                      | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute            | Value                                                                                                               | Description                                                  | Details |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | ------- |
| `data-invalid`            | `''`                                                                                                                | Present on the element when the field is invalid             |         |
| `data-disabled`           | `''`                                                                                                                | Present on the element when the field is disabled            |         |
| `data-readonly`           | `''`                                                                                                                | Present on the element when the field or segment is readonly |         |
| `data-segment`            | `enum` - 'day' \| 'month' \| 'year' \| 'hour' \| 'minute' \| 'second' \| 'dayPeriod' \| 'timeZoneName' \| 'literal' | The part of the date being rendered.                         |         |
| `data-date-field-segment` | `''`                                                                                                                | Present on the element.                                      |         |

### DatePicker.Trigger

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

### DatePicker.Content

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

### DatePicker.Portal

When used, will render the popover content into the body or custom `to` element when open

| Property   | Type                        | Description                                                                                                                      | Details |
| ---------- | --------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `to`       | `union` - Element \| string | Where to render the content when it is open. Defaults to the body.`Default: document.body`                                       |         |
| `disabled` | `boolean`                   | Whether the portal is disabled or not. When disabled, the content will be rendered in its original DOM location.`Default: false` |         |
| `children` | `Snippet`                   | The children content to render.`Default:  —— undefined`                                                                          |         |

### DatePicker.Calendar

The calendar component containing the grids of dates.

| Data Attribute       | Value | Description                                                    | Details |
| -------------------- | ----- | -------------------------------------------------------------- | ------- |
| `data-invalid`       | `''`  | Present on the calendar element when the calendar is invalid.  |         |
| `data-disabled`      | `''`  | Present on the calendar element when the calendar is disabled. |         |
| `data-readonly`      | `''`  | Present on the calendar element when the calendar is readonly. |         |
| `data-calendar-root` | `''`  | Present on the calendar element.                               |         |

### DatePicker.Header

The header of the calendar.

| Property        | Type                                                                  | Description                                                                                                                                   | Details |
| --------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `ref` $bindable | `HTMLElement`                                                         | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`      | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`         | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute         | Value | Description                                                  | Details |
| ---------------------- | ----- | ------------------------------------------------------------ | ------- |
| `data-disabled`        | `''`  | Present on the header element when the calendar is disabled. |         |
| `data-readonly`        | `''`  | Present on the header element when the calendar is readonly. |         |
| `data-calendar-header` | `''`  | Present on the header element.                               |         |

### DatePicker.PrevButton

The previous button of the calendar.

| Property        | Type                                                                  | Description                                                                                                                                   | Details |
| --------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `ref` $bindable | `HTMLButtonElement`                                                   | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`      | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`         | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute              | Value | Description                                                                      | Details |
| --------------------------- | ----- | -------------------------------------------------------------------------------- | ------- |
| `data-disabled`             | `''`  | Present on the prev button element when the calendar or this button is disabled. |         |
| `data-calendar-prev-button` | `''`  | Present on the prev button element.                                              |         |

### DatePicker.Heading

The heading of the calendar.

| Property        | Type                                                                  | Description                                                                                                                                   | Details |
| --------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `ref` $bindable | `HTMLDivElement`                                                      | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`      | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`         | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute          | Value | Description                                                   | Details |
| ----------------------- | ----- | ------------------------------------------------------------- | ------- |
| `data-disabled`         | `''`  | Present on the heading element when the calendar is disabled. |         |
| `data-readonly`         | `''`  | Present on the heading element when the calendar is readonly. |         |
| `data-calendar-heading` | `''`  | Present on the heading element.                               |         |

### DatePicker.NextButton

The next button of the calendar.

| Property        | Type                                                                  | Description                                                                                                                                   | Details |
| --------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `ref` $bindable | `HTMLButtonElement`                                                   | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`      | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`         | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute              | Value | Description                                                                      | Details |
| --------------------------- | ----- | -------------------------------------------------------------------------------- | ------- |
| `data-disabled`             | `''`  | Present on the next button element when the calendar or this button is disabled. |         |
| `data-calendar-next-button` | `''`  | Present on the next button element.                                              |         |

### DatePicker.Grid

The grid of dates in the calendar, typically representing a month.

| Property        | Type                                                                  | Description                                                                                                                                   | Details |
| --------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `ref` $bindable | `HTMLTableElement`                                                    | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`      | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`         | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute       | Value | Description                                                | Details |
| -------------------- | ----- | ---------------------------------------------------------- | ------- |
| `data-disabled`      | `''`  | Present on the grid element when the calendar is disabled. |         |
| `data-readonly`      | `''`  | Present on the grid element when the calendar is readonly. |         |
| `data-calendar-grid` | `''`  | Present on the grid element.                               |         |

### DatePicker.GridRow

A row in the grid of dates in the calendar.

| Property        | Type                                                                  | Description                                                                                                                                   | Details |
| --------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `ref` $bindable | `HTMLTableRowElement`                                                 | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`      | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`         | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute           | Value | Description                                                    | Details |
| ------------------------ | ----- | -------------------------------------------------------------- | ------- |
| `data-disabled`          | `''`  | Present on the grid row element when the calendar is disabled. |         |
| `data-readonly`          | `''`  | Present on the grid row element when the calendar is readonly. |         |
| `data-calendar-grid-row` | `''`  | Present on the grid row element.                               |         |

### DatePicker.GridHead

The head of the grid of dates in the calendar.

| Property        | Type                                                                  | Description                                                                                                                                   | Details |
| --------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `ref` $bindable | `HTMLTableSectionElement`                                             | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`      | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`         | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute            | Value | Description                                                     | Details |
| ------------------------- | ----- | --------------------------------------------------------------- | ------- |
| `data-disabled`           | `''`  | Present on the grid head element when the calendar is disabled. |         |
| `data-readonly`           | `''`  | Present on the grid head element when the calendar is readonly. |         |
| `data-calendar-grid-head` | `''`  | Present on the grid head element.                               |         |

### DatePicker.HeadCell

A cell in the head of the grid of dates in the calendar.

| Property        | Type                                                                  | Description                                                                                                                                   | Details |
| --------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `ref` $bindable | `HTMLTableCellElement`                                                | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`      | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`         | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute            | Value | Description                                                     | Details |
| ------------------------- | ----- | --------------------------------------------------------------- | ------- |
| `data-disabled`           | `''`  | Present on the head cell element when the calendar is disabled. |         |
| `data-readonly`           | `''`  | Present on the head cell element when the calendar is readonly. |         |
| `data-calendar-head-cell` | `''`  | Present on the head cell element.                               |         |

### DatePicker.GridBody

The body of the grid of dates in the calendar.

| Property        | Type                                                                  | Description                                                                                                                                   | Details |
| --------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `ref` $bindable | `HTMLTableSectionElement`                                             | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`      | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`         | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute            | Value | Description                                                | Details |
| ------------------------- | ----- | ---------------------------------------------------------- | ------- |
| `data-disabled`           | `''`  | Present on the grid element when the calendar is disabled. |         |
| `data-readonly`           | `''`  | Present on the grid element when the calendar is readonly. |         |
| `data-calendar-grid-body` | `''`  | Present on the grid body element.                          |         |

### DatePicker.Cell

A cell in the calendar grid.

| Property        | Type                                                                                                                                                                           | Description                                                                                                                                   | Details |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `date`          | `DateValue` - import type { CalendarDate, CalendarDateTime, ZonedDateTime } from "@internationalized/date"; type DateValue = CalendarDate \| CalendarDateTime \| ZonedDateTime | The date for the cell.`Default:  —— undefined`                                                                                                |         |
| `month`         | `DateValue` - import type { CalendarDate, CalendarDateTime, ZonedDateTime } from "@internationalized/date"; type DateValue = CalendarDate \| CalendarDateTime \| ZonedDateTime | The current month the date is being displayed in.`Default:  —— undefined`                                                                     |         |
| `ref` $bindable | `HTMLTableCellElement`                                                                                                                                                         | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`      | `Snippet`                                                                                                                                                                      | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`         | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; };                                                                                                          | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute                | Value | Description                                         | Details |
| ----------------------------- | ----- | --------------------------------------------------- | ------- |
| `data-disabled`               | `''`  | Present when the day is disabled.                   |         |
| `data-unavailable`            | `''`  | Present when the day is unavailable.                |         |
| `data-today`                  | `''`  | Present when the day is today.                      |         |
| `data-outside-month`          | `''`  | Present when the day is outside the current month.  |         |
| `data-outside-visible-months` | `''`  | Present when the day is outside the visible months. |         |
| `data-focused`                | `''`  | Present when the day is focused.                    |         |
| `data-selected`               | `''`  | Present when the day is selected.                   |         |
| `data-value`                  | `''`  | The date in the format "YYYY-MM-DD".                |         |
| `data-calendar-cell`          | `''`  | Present on the cell element.                        |         |

### DatePicker.Day

A day in the calendar grid.

| Property        | Type                                                                  | Description                                                                                                                                   | Details |
| --------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `ref` $bindable | `HTMLDivElement`                                                      | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`      | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`         | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute                | Value | Description                                         | Details |
| ----------------------------- | ----- | --------------------------------------------------- | ------- |
| `data-disabled`               | `''`  | Present when the day is disabled.                   |         |
| `data-unavailable`            | `''`  | Present when the day is unavailable.                |         |
| `data-today`                  | `''`  | Present when the day is today.                      |         |
| `data-outside-month`          | `''`  | Present when the day is outside the current month.  |         |
| `data-outside-visible-months` | `''`  | Present when the day is outside the visible months. |         |
| `data-focused`                | `''`  | Present when the day is focused.                    |         |
| `data-selected`               | `''`  | Present when the day is selected.                   |         |
| `data-value`                  | `''`  | The date in the format "YYYY-MM-DD".                |         |
| `data-calendar-day`           | `''`  | Present on the day element.                         |         |

### DatePicker.MonthSelect

A select you can use to navigate to a specific month in the calendar view.

| Property        | Type                                                                                                                                                                                 | Description                                                                                                                                                                                                     | Details |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `months`        | `number[]`                                                                                                                                                                           | The month values to render in the select.`Default: [1-12]`                                                                                                                                                      |         |
| `monthFormat`   | `enum` - 'narrow' \| 'short' \| 'long' \| 'numeric' \| '2-digit' \| '(month: number) => string'                                                                                      | The format to use for the month strings provided via the `months` slot prop. If a function is provided, it will be called with the month number as an argument and should return a string.`Default: ''narrow''` |         |
| `ref` $bindable | `HTMLSelectElement`                                                                                                                                                                  | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                                                                                               |         |
| `children`      | `Snippet` - type ChildrenSnippetProps = { monthItems: Array<{ value: number; label: string }>; selectedMonthItem: { value: number; label: string }; };                               | The children content to render.`Default:  —— undefined`                                                                                                                                                         |         |
| `child`         | `Snippet` - type ChildSnippetProps = { props: Record\<string, unknown>; monthItems: Array<{ value: number; label: string }>; selectedMonthItem: { value: number; label: string }; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined`                                                                   |         |

| Data Attribute               | Value | Description                                                        | Details |
| ---------------------------- | ----- | ------------------------------------------------------------------ | ------- |
| `data-disabled`              | `''`  | Present on the month select element when the calendar is disabled. |         |
| `data-calendar-month-select` | `''`  | Present on the month select element.                               |         |

### DatePicker.YearSelect

A select you can use to navigate to a specific year in the calendar view.

| Property        | Type                                                                                                                                                                               | Description                                                                                                                                                                                                                                       | Details |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `years`         | `number[]`                                                                                                                                                                         | The year values to render in the select.``Default: The current year or placeholder year (whichever is higher) + 10 and minus 100 years. When a `minValue`/`maxValue` is provided to `Calendar.Root`, those will be used to constrain the range.`` |         |
| `yearFormat`    | `enum` - 'numeric' \| '2-digit' \| '(year: number) => string'                                                                                                                      | The format to use for the year strings provided via the `years` slot prop. If a function is provided, it will be called with the year as an argument and should return a string.`Default: ''numeric''`                                            |         |
| `ref` $bindable | `HTMLSelectElement`                                                                                                                                                                | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                                                                                                                                 |         |
| `children`      | `Snippet` - type ChildrenSnippetProps = { yearItems: Array<{ value: number; label: string }>; selectedYearItem: { value: number; label: string }; };                               | The children content to render.`Default:  —— undefined`                                                                                                                                                                                           |         |
| `child`         | `Snippet` - type ChildSnippetProps = { props: Record\<string, unknown>; yearItems: Array<{ value: number; label: string }>; selectedYearItem: { value: number; label: string }; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined`                                                                                                     |         |

| Data Attribute              | Value | Description                                                       | Details |
| --------------------------- | ----- | ----------------------------------------------------------------- | ------- |
| `data-disabled`             | `''`  | Present on the year select element when the calendar is disabled. |         |
| `data-calendar-year-select` | `''`  | Present on the year select element.                               |         |

[Previous Date Field](/docs/components/date-field) [Next Date Range Field](/docs/components/date-range-field)