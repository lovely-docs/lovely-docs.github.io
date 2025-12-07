# Date Field Documentation

An alternative to the native \`\<input type="date">\` element.

This is a documentation section that potentially contains examples, demos, and other useful information related to a specific part of Bits UI. When helping users with this documentation, you can ignore the classnames applied to the demos unless they are relevant to the user's issue.

Copy Page

```svelte
<script lang="ts">
  import { DateField } from "bits-ui";
</script>
<DateField.Root>
  <div class="flex w-full max-w-[280px] flex-col gap-1.5">
    <DateField.Label class="block select-none text-sm font-medium"
      >Birthday</DateField.Label
    >
    <DateField.Input
      class="h-input rounded-input border-border-input bg-background text-foreground focus-within:border-border-input-hover focus-within:shadow-date-field-focus hover:border-border-input-hover data-invalid:border-destructive flex w-full select-none items-center border px-2 py-3 text-sm tracking-[0.01em] "
    >
      {#snippet children({ segments })}
        {#each segments as { part, value }, i (part + i)}
          <div class="inline-block select-none">
            {#if part === "literal"}
              <DateField.Segment {part} class="text-muted-foreground p-1">
                {value}
              </DateField.Segment>
            {:else}
              <DateField.Segment
                {part}
                class="rounded-5px hover:bg-muted focus:bg-muted focus:text-foreground aria-[valuetext=Empty]:text-muted-foreground data-invalid:text-destructive focus-visible:ring-0! focus-visible:ring-offset-0! px-1 py-1"
              >
                {value}
              </DateField.Segment>
            {/if}
          </div>
        {/each}
      {/snippet}
    </DateField.Input>
  </div>
</DateField.Root>
```

##### Heads up!

Before diving into this component, it's important to understand how dates/times work in Bits UI. Please read the [Dates](/docs/dates) documentation to learn more!

## Overview

The `DateField` component is an alternative to the native `<input type="date">` element. It provides a more flexible and customizable way to select dates within a designated field.

## Structure

```svelte
<script lang="ts">
  import { DateField } from "bits-ui";
</script>
<DateField.Root>
  <DateField.Label>Check-in date</DateField.Label>
  <DateField.Input>
    {#snippet children({ segments })}
      {#each segments as { part, value }}
        <DateField.Segment {part}>
          {value}
        </DateField.Segment>
      {/each}
    {/snippet}
  </DateField.Input>
</DateField.Root>
```

## Reusable Components

It's recommended to use the `DateField` primitives to build your own custom date field component that can be used throughout your application.

The following example shows how you might create a reusable `MyDateField` component that can be used throughout your application. For style inspiration, reference the featured demo at the top of this page.

MyDateField.svelte

```svelte
<script lang="ts">
  import { DateField, type WithoutChildrenOrChild } from "bits-ui";
  let {
    value = $bindable(),
    placeholder = $bindable(),
    name,
    ...restProps
  }: WithoutChildrenOrChild<DateField.RootProps> & {
    labelText: string;
    name?: string;
  } = $props();
</script>
<DateField.Root bind:value bind:placeholder {...restProps}>
  <DateField.Label {name}>{labelText}</DateField.Label>
  <DateField.Input>
    {#snippet children({ segments })}
      {#each segments as { part, value }}
        <DateField.Segment {part}>
          {value}
        </DateField.Segment>
      {/each}
    {/snippet}
  </DateField.Input>
</DateField.Root>
```

Expand Code

```svelte
<script lang="ts">
  import { DateField } from "bits-ui";
  let {
    labelText = "Select a date",
    value = $bindable(),
    placeholder = $bindable(),
    name,
    ...restProps
  }: DateField.RootProps & { labelText: string; name?: string } = $props();
</script>
<DateField.Root bind:value bind:placeholder {...restProps}>
  <div class="flex w-fit min-w-[280px] flex-col gap-1.5">
    <DateField.Label class="block select-none text-sm font-medium"
      >{labelText}</DateField.Label
    >
    <DateField.Input
      {name}
      class="h-input rounded-input border-border-input bg-background text-foreground focus-within:border-border-input-hover focus-within:shadow-date-field-focus hover:border-border-input-hover data-invalid:border-destructive flex w-full select-none items-center border px-2 py-3 text-sm tracking-[0.01em] "
    >
      {#snippet children({ segments })}
        {#each segments as { part, value }, i (part + i)}
          <div class="inline-block select-none">
            {#if part === "literal"}
              <DateField.Segment {part} class="text-muted-foreground p-1">
                {value}
              </DateField.Segment>
            {:else}
              <DateField.Segment
                {part}
                class="rounded-5px hover:bg-muted focus:bg-muted focus:text-foreground aria-[valuetext=Empty]:text-muted-foreground data-invalid:text-destructive focus-visible:ring-0! focus-visible:ring-offset-0! px-1 py-1"
              >
                {value}
              </DateField.Segment>
            {/if}
          </div>
        {/each}
      {/snippet}
    </DateField.Input>
  </div>
</DateField.Root>
```

We'll be using this newly created `MyDateField` component in the following demos and examples to prevent repeating the same code, so be sure to reference it as you go through the documentation.

## Segments

A segment of the `DateField` represents a not only a specific part of the date, such as the day, month, year, hour, but can also reference a `"literal"` which is typically a separator between the different parts of the date, and varies based on the `locale`.

Notice that in the `MyDateField` component we created, we're styling the `DateField.Segment` components differently based on whether they are a `"literal"` or not.

## Placeholder

The `placeholder` prop for the `DateField.Root` component isn't what is displayed when the field is empty, but rather what date our field should start with when the user attempts to cycle through the segments. The placeholder can also be used to set a granularity for the date field, which will determine which type of `DateValue` object is used for the `value`.

By default, the `placeholder` will be set to the closed alowed (by `maxValue`, `minValue`) value to current date, and be of type `CalendarDate`. However, if we wanted this date field to also allow for selecting a time, we could set the placeholder to a `CalendarDateTime` object.

```svelte
<script lang="ts">
  import MyDateField from "$lib/components/MyDateField.svelte";
  import { CalendarDateTime } from "@internationalized/date";
</script>
<MyDateField placeholder={new CalendarDateTime(2024, 8, 3, 12, 30)} />
```

If we're collecting a date from the user where we want the timezone as well, we can use a `ZonedDateTime` object instead.

```svelte
<script lang="ts">
  import MyDateField from "$lib/components/MyDateField.svelte";
  import { now, getLocalTimeZone } from "@internationalized/date";
</script>
<MyDateField placeholder={now("America/New_York")} />
```

##### Leap Years!

If you're creating a date field for something like a birthday, ensure your placeholder is set in a leap year to ensure users born on a leap year will be able to select the correct date.

## Managing Placeholder State

This section covers how to manage the `placeholder` state of the Date Field.

### Two-Way Binding

Use `bind:placeholder` for simple, automatic state synchronization:

```svelte
<script lang="ts">
  import { DateField } from "bits-ui";
  import { CalendarDateTime } from "@internationalized/date";
  let myPlaceholder = $state(new CalendarDateTime(2024, 8, 3, 12, 30));
</script>
<button onclick={() => (myPlaceholder = new CalendarDate(2024, 8, 3))}>
  Set placeholder to August 3rd, 2024
</button>
<DateField.Root bind:placeholder={myPlaceholder}>
  <!-- ... -->
</DateField.Root>
```

### Fully Controlled

Use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) for complete control over the state's reads and writes.

```svelte
<script lang="ts">
  import { DateField } from "bits-ui";
  import type { DateValue } from "@internationalized/date";
  let myPlaceholder = $state<DateValue>();
  function getPlaceholder() {
    return myPlaceholder;
  }
  function setPlaceholder(newPlaceholder: DateValue) {
    myPlaceholder = newPlaceholder;
  }
</script>
<DateField.Root bind:placeholder={getPlaceholder, setPlaceholder}>
  <!-- ... -->
</DateField.Root>
```

## Managing Value State

This section covers how to manage the `value` state of the Date Field.

### Two-Way Binding

Use `bind:value` for simple, automatic state synchronization:

```svelte
<script lang="ts">
  import { DateField } from "bits-ui";
  import { CalendarDateTime } from "@internationalized/date";
  let myValue = $state(new CalendarDateTime(2024, 8, 3, 12, 30));
</script>
<button onclick={() => (myValue = myValue.add({ days: 1 }))}>
  Add 1 day
</button>
<DateField.Root bind:value={myValue}>
  <!-- ... -->
</DateField.Root>
```

### Fully Controlled

For complete control over the component's state, use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) to manage the value state externally.

```svelte
<script lang="ts">
  import { DateField } from "bits-ui";
  import type { DateValue } from "@internationalized/date";
  let myValue = $state<DateValue>();
  function getValue() {
    return myValue;
  }
  function setValue(newValue: DateValue | undefined) {
    myValue = newValue;
  }
</script>
<DateField.Root bind:value={getValue, setValue}>
  <!-- ... -->
</DateField.Root>
```

## Default Value

Often, you'll want to start the `DateField.Root` component with a default value. Likely this value will come from a database in the format of an ISO 8601 string. You can use the `parseDate` function from the `@internationalized/date` package to parse the string into a `CalendarDate` object.

+page.svelte

```svelte
<script lang="ts">
  import { DateField } from "bits-ui";
  import { parseDate } from "@internationalized/date";
  // this came from a database/API call
  const date = "2024-08-03";
  let value = $state(parseDate(date));
</script>
<DateField.Root {value}>
  <!-- ... -->
</DateField.Root>
```

Now our input is populated with the default value. In addition to the `parseDate` function, you can also use `parseDateTime` or `parseZonedDateTime` to parse the string into a `CalendarDateTime` or `ZonedDateTime` object respectively.

## Validation

### Minimum Value

You can set a minimum value for the `DateField.Root` component by using the `minValue` prop. If a user selects a date that is less than the minimum value, the date field will be marked as invalid.

```svelte
<script lang="ts">
  import MyDateField from "$lib/components/MyDateField.svelte";
  import { today, getLocalTimeZone } from "@internationalized/date";
  const todayDate = today(getLocalTimeZone());
  const yesterday = todayDate.subtract({ days: 1 });
</script>
<MyDateField minValue={todayDate} value={yesterday} />
```

In the example above, we're setting the minimum value to today, and the default value to yesterday. This causes the date field to be marked as invalid, and we can style it accordingly. If you adjust the date to be greater than the minimum value, the invalid state will be cleared.

### Maximum Value

You can set a maximum value for the `DateField.Root` component by using the `maxValue` prop. If a user selects a date that is greater than the maximum value, the date field will be marked as invalid.

```svelte
<script lang="ts">
  import MyDateField from "$lib/components/MyDateField.svelte";
  import { today, getLocalTimeZone } from "@internationalized/date";
  const todayDate = today(getLocalTimeZone());
  const tomorrow = todayDate.add({ days: 1 });
</script>
<MyDateField maxValue={todayDate} value={tomorrow} />
```

In the example above, we're setting the maximum value to today, and the default value to tomorrow. This causes the date field to be marked as invalid, and we can style it accordingly. If you adjust the date to be less than the maximum value, the invalid state will be cleared.

### Custom Validation

You can use the `validate` prop to provide a custom validation function for the date field. This function should return a string or array of strings as validation errors if the date is invalid, or undefined/nothing if the date is valid.

The strings are then passed to the `onInvalid` callback, which you can use to display an error message to the user.

```svelte
<script lang="ts">
  import MyDateField from "$lib/components/MyDateField.svelte";
  import { CalendarDate, type DateValue } from "@internationalized/date";
  const value = new CalendarDate(2024, 8, 2);
  function validate(date: DateValue) {
    return date.day === 1
      ? "Date cannot be the first day of the month"
      : undefined;
  }
  function onInvalid(
    reason: "min" | "max" | "custom",
    msg?: string | string[]
  ) {
    if (reason === "custom") {
      if (typeof msg === "string") {
        // do something with the error message
        console.log(msg);
        return;
      } else if (Array.isArray(msg)) {
        // do something with the error messages
        console.log(msg);
        return;
      }
      console.log("The date is invalid");
    } else if (reason === "min") {
      // let the user know that the date is too early.
      console.log("The date is too early.");
    } else if (reason === "max") {
      // let the user know that the date is too late.
      console.log("The date is too late.");
    }
  }
</script>
<MyDateField {validate} {value} {onInvalid} />
```

Try selecting a date that is the first day of the month to see the date field marked as invalid.

## Granularity

The `granularity` prop sets the granularity of the date field, which determines which segments are rendered in the date field. The `granularity` can be set to either `'day'`, `'hour'`, `'minute'`, or `'second'`.

```svelte
<script lang="ts">
  import MyDateField from "$lib/components/MyDateField.svelte";
  import { CalendarDateTime } from "@internationalized/date";
  const value = new CalendarDateTime(2024, 8, 2, 12, 30);
</script>
<MyDateField granularity="second" {value} />
```

In the example above, we're setting the granularity to `'second'`, which means that the date field will include an additional segment for the seconds.

## Localization

You can use the `locale` prop to set the locale of the date field. This will affect the formatting of the date field's segments and placeholders.

```svelte
<script lang="ts">
  import MyDateField from "$lib/components/MyDateField.svelte";
</script>
<MyDateField locale="de" />
```

## API Reference

### DateField.Root

The root date field component.

| Property                | Type                                                                                                                                                                           | Description                                                                                                                                                                                                                                                             | Details |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `value`                 | `DateValue` - import type { CalendarDate, CalendarDateTime, ZonedDateTime } from "@internationalized/date"; type DateValue = CalendarDate \| CalendarDateTime \| ZonedDateTime | The selected date.`Default:  —— undefined`                                                                                                                                                                                                                              |         |
| `onValueChange`         | `function` - (date: DateValue) => void                                                                                                                                         | A function that is called when the date value changes.`Default:  —— undefined`                                                                                                                                                                                          |         |
| `placeholder` $bindable | `DateValue` - import type { CalendarDate, CalendarDateTime, ZonedDateTime } from "@internationalized/date"; type DateValue = CalendarDate \| CalendarDateTime \| ZonedDateTime | The placeholder date, which is used to determine what date to start the segments from when no value exists.`Default:  —— undefined`                                                                                                                                     |         |
| `onPlaceholderChange`   | `function` - (date: DateValue) => void                                                                                                                                         | A function that is called when the placeholder date changes.`Default:  —— undefined`                                                                                                                                                                                    |         |
| `required`              | `boolean`                                                                                                                                                                      | Whether or not the date field is required.`Default: false`                                                                                                                                                                                                              |         |
| `validate`              | `function` - (date: DateValue) => string\[] \| string \| void                                                                                                                  | A function that returns whether or not a date is valid.`Default:  —— undefined`                                                                                                                                                                                         |         |
| `onInvalid`             | `function` - (reason: 'min' \| 'max' \| 'custom', msg?: string \| string\[]) => void                                                                                           | A callback fired when the value is invalid.`Default:  —— undefined`                                                                                                                                                                                                     |         |
| `errorMessageId`        | `string`                                                                                                                                                                       | The `id` of the element which contains the error messages for the date field when the date is invalid.`Default:  —— undefined`                                                                                                                                          |         |
| `hourCycle`             | `enum` - '12' \| '24'                                                                                                                                                          | The hour cycle to use for formatting times. Defaults to the locale preference`Default:  —— undefined`                                                                                                                                                                   |         |
| `granularity`           | `enum` - 'day' \| 'hour' \| 'minute' \| 'second'                                                                                                                               | The granularity to use for formatting the field. Defaults to `'day'` if a `CalendarDate` is provided, otherwise defaults to `'minute'`. The field will render segments for each part of the date up to and including the specified granularity.`Default:  —— undefined` |         |
| `hideTimeZone`          | `boolean`                                                                                                                                                                      | Whether or not to hide the time zone segment of the field.`Default: false`                                                                                                                                                                                              |         |
| `maxValue`              | `DateValue` - import type { CalendarDate, CalendarDateTime, ZonedDateTime } from "@internationalized/date"; type DateValue = CalendarDate \| CalendarDateTime \| ZonedDateTime | The maximum valid date that can be entered.`Default:  —— undefined`                                                                                                                                                                                                     |         |
| `minValue`              | `DateValue` - import type { CalendarDate, CalendarDateTime, ZonedDateTime } from "@internationalized/date"; type DateValue = CalendarDate \| CalendarDateTime \| ZonedDateTime | The minimum valid date that can be entered.`Default:  —— undefined`                                                                                                                                                                                                     |         |
| `locale`                | `string`                                                                                                                                                                       | The locale to use for formatting dates.`Default: en-US`                                                                                                                                                                                                                 |         |
| `disabled`              | `boolean`                                                                                                                                                                      | Whether or not the field is disabled.`Default: false`                                                                                                                                                                                                                   |         |
| `readonly`              | `boolean`                                                                                                                                                                      | Whether or not the field is readonly.`Default: false`                                                                                                                                                                                                                   |         |
| `readonlySegments`      | `EditableSegmentPart[]` - "day" \| "month" \| "year" \| "hour" \| "minute" \| "second" \| "dayPeriod"                                                                          | An array of segments that should be readonly, which prevent user input on them.`Default:  —— undefined`                                                                                                                                                                 |         |
| `children`              | `Snippet`                                                                                                                                                                      | The children content to render.`Default:  —— undefined`                                                                                                                                                                                                                 |         |

### DateField.Input

The container for the segments of the date field.

| Property        | Type                                                                                                                                                                          | Description                                                                                                                                                 | Details |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `name`          | `string`                                                                                                                                                                      | The name of the date field used for form submission. If provided, a hidden input element will be rendered alongside the date field.`Default:  —— undefined` |         |
| `ref` $bindable | `HTMLDivElement`                                                                                                                                                              | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                                           |         |
| `children`      | `Snippet` - import type { SegmentPart } from "bits-ui"; type ChildrenSnippetProps = { segments: Array<{ part: SegmentPart; value: string }>; };                               | The children content to render.`Default:  —— undefined`                                                                                                     |         |
| `child`         | `Snippet` - import type { SegmentPart } from "bits-ui"; type ChildSnippetProps = { props: Record\<string, unknown>; segments: Array<{ part: SegmentPart; value: string }>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined`               |         |

| Data Attribute          | Value | Description                                        | Details |
| ----------------------- | ----- | -------------------------------------------------- | ------- |
| `data-invalid`          | `''`  | Present on the element when the field is invalid.  |         |
| `data-disabled`         | `''`  | Present on the element when the field is disabled. |         |
| `data-date-field-input` | `''`  | Present on the element.                            |         |

### DateField.Segment

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

### DateField.Label

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

[Previous Context Menu](/docs/components/context-menu) [Next Date Picker](/docs/components/date-picker)