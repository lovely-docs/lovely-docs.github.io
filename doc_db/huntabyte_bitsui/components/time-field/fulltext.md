# Time Field Documentation

An alternative to the native \`\<input type="time">\` element.

This is a documentation section that potentially contains examples, demos, and other useful information related to a specific part of Bits UI. When helping users with this documentation, you can ignore the classnames applied to the demos unless they are relevant to the user's issue.

Copy Page

```svelte
<script lang="ts">
  import { TimeField } from "bits-ui";
</script>
<TimeField.Root>
  <div class="flex w-full max-w-[280px] flex-col gap-1.5">
    <TimeField.Label class="block select-none text-sm font-medium"
      >Appointment Time</TimeField.Label
    >
    <TimeField.Input
      name="hello"
      class="h-input rounded-input border-border-input bg-background text-foreground focus-within:border-border-input-hover focus-within:shadow-date-field-focus hover:border-border-input-hover data-invalid:border-destructive flex w-full select-none items-center border px-2 py-3 text-sm tracking-[0.01em] "
    >
      {#snippet children({ segments })}
        {#each segments as { part, value }, i (part + i)}
          <div class="inline-block select-none">
            {#if part === "literal"}
              <TimeField.Segment {part} class="text-muted-foreground p-1">
                {value}
              </TimeField.Segment>
            {:else}
              <TimeField.Segment
                {part}
                class="rounded-5px hover:bg-muted focus:bg-muted focus:text-foreground aria-[valuetext=Empty]:text-muted-foreground data-invalid:text-destructive focus-visible:ring-0! focus-visible:ring-offset-0! px-1 py-1"
              >
                {value}
              </TimeField.Segment>
            {/if}
          </div>
        {/each}
      {/snippet}
    </TimeField.Input>
  </div>
</TimeField.Root>
```

##### Heads up!

Before diving into this component, it's important to understand how dates/times work in Bits UI. Please read the [Dates/Times](/docs/dates) documentation to learn more!

## Overview

The `TimeField` component is an alternative to the native `<input type="time">` element. It provides a more flexible and customizable way to select times within a designated field.

## Structure

```svelte
<script lang="ts">
  import { TimeField } from "bits-ui";
</script>
<TimeField.Root>
  <TimeField.Label>Check-in time</TimeField.Label>
  <TimeField.Input>
    {#snippet children({ segments })}
      {#each segments as { part, value }}
        <TimeField.Segment {part}>
          {value}
        </TimeField.Segment>
      {/each}
    {/snippet}
  </TimeField.Input>
</TimeField.Root>
```

## Reusable Components

It's recommended to use the `TimeField` primitives to build your own custom time field component that can be used throughout your application.

The following example shows how you might create a reusable `MyTimeField` component that can be used throughout your application. For style inspiration, reference the featured demo at the top of this page.

MyTimeField.svelte

```svelte
<script lang="ts" module>
  import type { TimeValue } from "bits-ui";
  import type { Time } from "@internationalized/date";
  type T = unknown;
</script>
<script lang="ts" generics="T extends TimeValue = Time">
  import { TimeField, type WithoutChildrenOrChild } from "bits-ui";
  let {
    value = $bindable(),
    placeholder = $bindable(),
    labelText = "Select a time",
    ...restProps
  }: WithoutChildrenOrChild<TimeField.RootProps<T>> & {
    name?: string;
    labelText?: string;
  } = $props();
</script>
<TimeField.Root bind:value bind:placeholder {...restProps}>
  <TimeField.Label {name}>{labelText}</TimeField.Label>
  <TimeField.Input>
    {#snippet children({ segments })}
      {#each segments as { part, value }}
        <TimeField.Segment {part}>
          {value}
        </TimeField.Segment>
      {/each}
    {/snippet}
  </TimeField.Input>
</TimeField.Root>
```

Expand Code

```svelte
<script lang="ts" module>
  import type { TimeValue } from "bits-ui";
  import type { Time } from "@internationalized/date";
  type T = unknown;
</script>
<script lang="ts" generics="T extends TimeValue = Time">
  import { TimeField } from "bits-ui";
  let {
    labelText = "Select a time",
    value = $bindable(),
    placeholder = $bindable(),
    name,
    ...restProps
  }: TimeField.RootProps<T> & { labelText?: string; name?: string } = $props();
</script>
<TimeField.Root bind:value bind:placeholder {...restProps}>
  <div class="flex w-fit min-w-[280px] flex-col gap-1.5">
    <TimeField.Label class="block select-none text-sm font-medium"
      >{labelText}</TimeField.Label
    >
    <TimeField.Input
      {name}
      class="h-input rounded-input border-border-input bg-background text-foreground focus-within:border-border-input-hover focus-within:shadow-date-field-focus hover:border-border-input-hover data-invalid:border-destructive flex w-full select-none items-center border px-2 py-3 text-sm tracking-[0.01em] "
    >
      {#snippet children({ segments })}
        {#each segments as { part, value }, i (i)}
          <div class="inline-block select-none">
            {#if part === "literal"}
              <TimeField.Segment {part} class="text-muted-foreground p-1">
                {value}
              </TimeField.Segment>
            {:else}
              <TimeField.Segment
                {part}
                class="rounded-5px hover:bg-muted focus:bg-muted focus:text-foreground aria-[valuetext=Empty]:text-muted-foreground data-invalid:text-destructive focus-visible:ring-0! focus-visible:ring-offset-0! px-1 py-1"
              >
                {value}
              </TimeField.Segment>
            {/if}
          </div>
        {/each}
      {/snippet}
    </TimeField.Input>
  </div>
</TimeField.Root>
```

We'll be using this newly created `MyTimeField` component in the following demos and examples to prevent repeating the same code, so be sure to reference it as you go through the documentation.

## Segments

A segment of the `TimeField` represents a not only a specific part of the time, such as the hour, minute, second, dayPeriod, or timeZoneName, but can also reference a `"literal"` which is typically a separator between the different parts of the time, and varies based on the `locale`.

Notice that in the `MyTimeField` component we created, we're styling the `TimeField.Segment` components differently based on whether they are a `"literal"` or not.

## Placeholder

The `placeholder` prop for the `TimeField.Root` component isn't what is displayed when the field is empty, but rather what time our field should start with when the user attempts to cycle through the segments.

By default, the `placeholder` will be set to `12:00 AM` or `00:00` depending on the hour cycle.

```svelte
<script lang="ts">
  import MyTimeField from "$lib/components/MyTimeField.svelte";
  import { Time } from "@internationalized/date";
</script>
<MyTimeField placeholder={new Time(12, 30)} />
```

If we're collecting a time from the user where we want the timezone to be displayed as well, we can use a `ZonedDateTime` object instead.

```svelte
<script lang="ts">
  import MyTimeField from "$lib/components/MyTimeField.svelte";
  import { now, getLocalTimeZone } from "@internationalized/date";
</script>
<MyTimeField placeholder={now("America/New_York")} />
```

## Managing Placeholder State

This section covers how to manage the `placeholder` state of the Time Field.

### Two-Way Binding

Use `bind:placeholder` for simple, automatic state synchronization:

```svelte
<script lang="ts">
  import { TimeField } from "bits-ui";
  import { Time } from "@internationalized/date";
  let myPlaceholder = $state(new Time(12, 30));
</script>
<button onclick={() => (myPlaceholder = new Time(12, 30))}>
  Set placeholder to 12:30 PM
</button>
<TimeField.Root bind:placeholder={myPlaceholder}>
  <!-- ... -->
</TimeField.Root>
```

### Fully Controlled

Use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) for complete control over the state's reads and writes.

```svelte
<script lang="ts">
  import { TimeField, type TimeValue } from "bits-ui";
  let myPlaceholder = $state<TimeValue>();
  function getPlaceholder() {
    return myPlaceholder;
  }
  function setPlaceholder(newPlaceholder: TimeValue) {
    myPlaceholder = newPlaceholder;
  }
</script>
<TimeField.Root bind:placeholder={getPlaceholder, setPlaceholder}>
  <!-- ... -->
</TimeField.Root>
```

## Managing Value State

This section covers how to manage the `value` state of the Time Field. The `value` can be a `Time`, `CalendarDateTime`, or `ZonedDateTime` object, and the type in the `value`/`onValueChange` prop will be inferred based on the type of the `value` prop.

### Two-Way Binding

Use `bind:value` for simple, automatic state synchronization:

```svelte
<script lang="ts">
  import { TimeField } from "bits-ui";
  import { Time } from "@internationalized/date";
  let myValue = $state(new Time(12, 30));
</script>
<button onclick={() => (myValue = myValue.add({ hours: 1 }))}>
  Add 1 hour
</button>
<TimeField.Root bind:value={myValue}>
  <!-- ... -->
</TimeField.Root>
```

### Fully Controlled

For complete control over the component's state, use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) to manage the value state externally.

```svelte
<script lang="ts">
  import { TimeField, type TimeValue } from "bits-ui";
  let myValue = $state<TimeValue>();
  function getValue() {
    return myValue;
  }
  function setValue(newValue: TimeValue | undefined) {
    myValue = newValue;
  }
</script>
<DateField.Root bind:value={getValue, setValue}>
  <!-- ... -->
</DateField.Root>
```

## Default Value

Often, you'll want to start the `TimeField.Root` component with a default value. Likely this value will come from a database in the format of an ISO 8601 string. You can use the `parseDateTime` function from the `@internationalized/date` package to parse the string into a `CalendarDateTime` object.

+page.svelte

```svelte
<script lang="ts">
  import { TimeField } from "bits-ui";
  import { parseDateTime } from "@internationalized/date";
  // this came from a database/API call
  const date = "2024-08-03T15:15";
  let value = $state(parseDateTime(date));
</script>
<TimeField.Root {value}>
  <!-- ... -->
</TimeField.Root>
```

Now our input is populated with the default value. In addition to the `parseDateTime` function, you can also use `parseZonedDateTime` to parse the string into a `ZonedDateTime` object if you're working with a timezone.

## Validation

### Minimum Value

You can set a minimum value for the `TimeField.Root` component by using the `minValue` prop. If a user selects a time that is less than the minimum value, the time field will be marked as invalid.

```svelte
<script lang="ts">
  import MyTimeField from "$lib/components/MyTimeField.svelte";
  import { Time } from "@internationalized/date";
</script>
<MyTimeField minValue={new Time(9, 0)} value={new Time(8, 0)} />
```

In the example above, we're setting the minimum value to 9:00 AM, and the default value to 8:00 AM. This causes the time field to be marked as invalid, and we can style it accordingly. If you adjust the time to be greater than the minimum value, the invalid state will be cleared.

### Maximum Value

You can set a maximum value for the `TimeField.Root` component by using the `maxValue` prop. If a user selects a time that is greater than the maximum value, the time field will be marked as invalid.

```svelte
<script lang="ts">
  import MyTimeField from "$lib/components/MyTimeField.svelte";
  import { Time } from "@internationalized/date";
</script>
<MyTimeField maxValue={new Time(17, 0)} value={new Time(18, 0)} />
```

In the example above, we're setting the maximum value to 5:00 PM, and the default value to 6:00 PM. This causes the time field to be marked as invalid, and we can style it accordingly. If you adjust the time to be less than the maximum value, the invalid state will be cleared.

### Custom Validation

You can use the `validate` prop to provide a custom validation function for the time field. This function should return a string or array of strings as validation errors if the time is invalid, or undefined/nothing if the time is valid.

The strings are then passed to the `onInvalid` callback, which you can use to display an error message to the user.

```svelte
<script lang="ts">
  import MyTimeField from "$lib/components/MyTimeField.svelte";
  import type { TimeValue } from "bits-ui";
  import { Time } from "@internationalized/date";
  import { toast } from "your-favorite-toast-library";
  const value = new Time(12, 30);
  function validate(time: TimeValue) {
    return time.hour === 12 ? "Time cannot be 12:00 PM" : undefined;
  }
  function onInvalid(
    reason: "min" | "max" | "custom",
    msg?: string | string[]
  ) {
    if (reason === "custom") {
      if (typeof msg === "string") {
        // do something with the error message
        toast.error(msg);
        return;
      } else if (Array.isArray(msg)) {
        // do something with the error messages
        toast.error(msg.join(", "));
        return;
      }
      toast.error("The time is invalid");
    } else if (reason === "min") {
      // let the user know that the date is too early.
      toast.error("The time is too early.");
    } else if (reason === "max") {
      // let the user know that the date is too late.
      toast.error("The date is too late.");
    }
  }
</script>
<MyTimeField {validate} {value} {onInvalid} />
```

## Granularity

The `granularity` prop sets the granularity of the date field, which determines which segments are rendered in the date field. The `granularity` can be set to either `'hour'`, `'minute'`, or `'second'` and defaults to `'minute'`.

```svelte
<script lang="ts">
  import MyTimeField from "$lib/components/MyTimeField.svelte";
  import { Time } from "@internationalized/date";
  const value = new Time(12, 30);
</script>
<MyTimeField granularity="second" {value} />
```

In the example above, we're setting the granularity to `'second'`, which means that the time field will include an additional segment for the seconds.

## Localization

You can use the `locale` prop to set the locale of the date field. This will affect the formatting of the date field's segments and placeholders.

```svelte
<script lang="ts">
  import MyTimeField from "$lib/components/MyTimeField.svelte";
</script>
<MyTimeField locale="de" value={new Time(13, 30, 0)} />
```

Notice how in the example above, the hour is displayed as `13` (in 24-hour format) and the day period is not displayed, since the locale is set to `de` (German).

## API Reference

### TimeField.Root

The root time field component.

| Property                | Type                                                                                                                                                           | Description                                                                                                                                                                 | Details |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `value` $bindable       | `TimeValue` - import type { Time, CalendarDateTime, ZonedDateTime } from "@internationalized/date"; type TimeValue = Time \| CalendarDateTime \| ZonedDateTime | The selected time.`Default:  —— undefined`                                                                                                                                  |         |
| `onValueChange`         | `function` - (value: TimeValue) => void                                                                                                                        | A function that is called when the selected time changes. The type of value is inferred from the `value` prop if provided.`Default:  —— undefined`                          |         |
| `placeholder` $bindable | `TimeValue` - import type { Time, CalendarDateTime, ZonedDateTime } from "@internationalized/date"; type TimeValue = Time \| CalendarDateTime \| ZonedDateTime | The placeholder time, which is used to determine what time to start the segments from when no value exists.`Default:  —— undefined`                                         |         |
| `onPlaceholderChange`   | `function` - (value: TimeValue) => void                                                                                                                        | A function that is called when the placeholder time changes.`Default:  —— undefined`                                                                                        |         |
| `required`              | `boolean`                                                                                                                                                      | Whether or not the field is required.`Default: false`                                                                                                                       |         |
| `validate`              | `function` - (time: TimeValue) => string\[] \| string \| void                                                                                                  | A function that returns whether or not a time is unavailable.`Default:  —— undefined`                                                                                       |         |
| `onInvalid`             | `function` - (reason: 'min' \| 'max' \| 'custom', msg?: string \| string\[]) => void                                                                           | A callback fired when the field's value is invalid.`Default:  —— undefined`                                                                                                 |         |
| `errorMessageId`        | `string`                                                                                                                                                       | The `id` of the element which contains the error messages for the field when the time is invalid.`Default:  —— undefined`                                                   |         |
| `hourCycle`             | `enum` - '12' \| '24'                                                                                                                                          | The hour cycle to use for formatting times. Defaults to the locale preference`Default:  —— undefined`                                                                       |         |
| `granularity`           | `enum` - 'hour' \| 'minute' \| 'second'                                                                                                                        | The granularity to use for formatting the field. The field will render segments for each part of the time up to and including the specified granularity.`Default: 'minute'` |         |
| `hideTimeZone`          | `boolean`                                                                                                                                                      | Whether or not to hide the time zone segment of the field. This only applies when using a `ZonedDateTime` as the `value` prop.`Default: false`                              |         |
| `maxValue`              | `TimeValue` - import type { Time, CalendarDateTime, ZonedDateTime } from "@internationalized/date"; type TimeValue = Time \| CalendarDateTime \| ZonedDateTime | The maximum valid time that can be entered.`Default:  —— undefined`                                                                                                         |         |
| `minValue`              | `TimeValue` - import type { Time, CalendarDateTime, ZonedDateTime } from "@internationalized/date"; type TimeValue = Time \| CalendarDateTime \| ZonedDateTime | The minimum valid time that can be entered.`Default:  —— undefined`                                                                                                         |         |
| `locale`                | `string`                                                                                                                                                       | The locale to use for formatting times.`Default: en-US`                                                                                                                     |         |
| `disabled`              | `boolean`                                                                                                                                                      | Whether or not the field is disabled.`Default: false`                                                                                                                       |         |
| `readonly`              | `boolean`                                                                                                                                                      | Whether or not the field is readonly.`Default: false`                                                                                                                       |         |
| `readonlySegments`      | `EditableTimeSegmentPart[]` - "hour" \| "minute" \| "second" \| "dayPeriod"                                                                                    | An array of segments that should be readonly, which prevent user input on them.`Default:  —— undefined`                                                                     |         |
| `children`              | `Snippet`                                                                                                                                                      | The children content to render.`Default:  —— undefined`                                                                                                                     |         |

### TimeField.Input

The container for the segments of the time field.

| Property        | Type                                                                                                                                                                                  | Description                                                                                                                                                 | Details |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `name`          | `string`                                                                                                                                                                              | The name of the time field used for form submission. If provided, a hidden input element will be rendered alongside the time field.`Default:  —— undefined` |         |
| `ref` $bindable | `HTMLDivElement`                                                                                                                                                                      | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                                           |         |
| `children`      | `Snippet` - import type { TimeSegmentPart } from "bits-ui"; type ChildrenSnippetProps = { segments: Array<{ part: TimeSegmentPart; value: string }>; };                               | The children content to render.`Default:  —— undefined`                                                                                                     |         |
| `child`         | `Snippet` - import type { TimeSegmentPart } from "bits-ui"; type ChildSnippetProps = { props: Record\<string, unknown>; segments: Array<{ part: TimeSegmentPart; value: string }>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined`               |         |

| Data Attribute          | Value | Description                                        | Details |
| ----------------------- | ----- | -------------------------------------------------- | ------- |
| `data-invalid`          | `''`  | Present on the element when the field is invalid.  |         |
| `data-disabled`         | `''`  | Present on the element when the field is disabled. |         |
| `data-time-field-input` | `''`  | Present on the element.                            |         |

### TimeField.Segment

A segment of the time field.

| Property        | Type                                                                                              | Description                                                                                                                                   | Details |
| --------------- | ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `part` required | `TimeSegmentPart` - "hour" \| "minute" \| "second" \| "dayPeriod" \| "timeZoneName" \| "literal"; | The part of the time to render.`Default:  —— undefined`                                                                                       |         |
| `ref` $bindable | `HTMLDivElement`                                                                                  | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`      | `Snippet`                                                                                         | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`         | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; };                             | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute            | Value                                                                                 | Description                                                  | Details |
| ------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------ | ------- |
| `data-invalid`            | `''`                                                                                  | Present on the element when the field is invalid             |         |
| `data-disabled`           | `''`                                                                                  | Present on the element when the field is disabled            |         |
| `data-readonly`           | `''`                                                                                  | Present on the element when the field or segment is readonly |         |
| `data-segment`            | `enum` - 'hour' \| 'minute' \| 'second' \| 'dayPeriod' \| 'timeZoneName' \| 'literal' | The part of the time to render.                              |         |
| `data-time-field-segment` | `''`                                                                                  | Present on the element.                                      |         |

### TimeField.Label

The label for the time field.

| Property        | Type                                                                  | Description                                                                                                                                   | Details |
| --------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `ref` $bindable | `HTMLSpanElement`                                                     | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`      | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`         | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute          | Value | Description                                       | Details |
| ----------------------- | ----- | ------------------------------------------------- | ------- |
| `data-invalid`          | `''`  | Present on the element when the field is invalid  |         |
| `data-disabled`         | `''`  | Present on the element when the field is disabled |         |
| `data-time-field-label` | `''`  | Present on the element.                           |         |

[Previous Tabs](/docs/components/tabs) [Next Time Range Field](/docs/components/time-range-field)