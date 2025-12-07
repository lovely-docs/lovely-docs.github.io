# Range Calendar Documentation

Enables users to select a range of dates using a calendar interface.

This is a documentation section that potentially contains examples, demos, and other useful information related to a specific part of Bits UI. When helping users with this documentation, you can ignore the classnames applied to the demos unless they are relevant to the user's issue.

Copy Page

```svelte
<script lang="ts">
  import { RangeCalendar } from "bits-ui";
  import CaretLeft from "phosphor-svelte/lib/CaretLeft";
  import CaretRight from "phosphor-svelte/lib/CaretRight";
  import cn from "clsx";
  import type { ComponentProps } from "svelte";
  let { value = $bindable() }: ComponentProps<typeof RangeCalendar.Root> =
    $props();
</script>
<RangeCalendar.Root
  class="rounded-15px border-dark-10 bg-background-alt shadow-card mt-6 border p-[22px]"
  weekdayFormat="short"
  fixedWeeks={true}
  bind:value
>
  {#snippet children({ months, weekdays })}
    <RangeCalendar.Header class="flex items-center justify-between">
      <RangeCalendar.PrevButton
        class="rounded-9px bg-background-alt hover:bg-muted inline-flex size-10 items-center justify-center active:scale-[0.98]"
      >
        <CaretLeft class="size-6" />
      </RangeCalendar.PrevButton>
      <RangeCalendar.Heading class="text-[15px] font-medium" />
      <RangeCalendar.NextButton
        class="rounded-9px bg-background-alt hover:bg-muted inline-flex size-10 items-center justify-center active:scale-[0.98]"
      >
        <CaretRight class="size-6" />
      </RangeCalendar.NextButton>
    </RangeCalendar.Header>
    <div
      class="flex flex-col space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0"
    >
      {#each months as month (month.value.month)}
        <RangeCalendar.Grid
          class="w-full border-collapse select-none space-y-1"
        >
          <RangeCalendar.GridHead>
            <RangeCalendar.GridRow class="mb-1 flex w-full justify-between">
              {#each weekdays as day (day)}
                <RangeCalendar.HeadCell
                  class="text-muted-foreground font-normal! w-10 rounded-md text-xs"
                >
                  <div>{day.slice(0, 2)}</div>
                </RangeCalendar.HeadCell>
              {/each}
            </RangeCalendar.GridRow>
          </RangeCalendar.GridHead>
          <RangeCalendar.GridBody>
            {#each month.weeks as weekDates, i (i)}
              <RangeCalendar.GridRow class="flex w-full">
                {#each weekDates as date, d (d)}
                  <RangeCalendar.Cell
                    {date}
                    month={month.value}
                    class="p-0! relative m-0 size-10 text-center text-sm focus-within:z-20"
                  >
                    <RangeCalendar.Day
                      class={cn(
                        "rounded-9px text-foreground hover:border-foreground focus-visible:ring-foreground! data-selection-end:rounded-9px data-selection-start:rounded-9px data-highlighted:bg-muted data-selected:bg-muted data-selection-end:bg-foreground data-selection-start:bg-foreground data-disabled:text-foreground/30 data-selected:text-foreground data-selection-end:text-background data-selection-start:text-background data-unavailable:text-muted-foreground data-selected:[&:not([data-selection-start])]:[&:not([data-selection-end])]:focus-visible:border-foreground data-disabled:pointer-events-none data-highlighted:rounded-none data-outside-month:pointer-events-none data-selected:font-medium data-selection-end:font-medium data-selection-start:font-medium data-selection-start:focus-visible:ring-2 data-selection-start:focus-visible:ring-offset-2! data-unavailable:line-through data-selected:[&:not([data-selection-start])]:[&:not([data-selection-end])]:rounded-none data-selected:[&:not([data-selection-start])]:[&:not([data-selection-end])]:focus-visible:ring-0! data-selected:[&:not([data-selection-start])]:[&:not([data-selection-end])]:focus-visible:ring-offset-0! group relative inline-flex size-10 items-center justify-center overflow-visible whitespace-nowrap border border-transparent bg-transparent p-0 text-sm font-normal"
                      )}
                    >
                      <div
                        class="bg-foreground group-data-selected:bg-background group-data-today:block absolute top-[5px] hidden size-1 rounded-full"
                      ></div>
                      {date.day}
                    </RangeCalendar.Day>
                  </RangeCalendar.Cell>
                {/each}
              </RangeCalendar.GridRow>
            {/each}
          </RangeCalendar.GridBody>
        </RangeCalendar.Grid>
      {/each}
    </div>
  {/snippet}
</RangeCalendar.Root>
```

##### Heads up!

Before diving into this component, it's important to understand how dates/times work in Bits UI. Please read the [Dates](/docs/dates) documentation to learn more!

## Structure

```svelte
<script lang="ts">
  import { RangeCalendar } from "bits-ui";
</script>
<RangeCalendar.Root>
  {#snippet children({ months, weekdays })}
    <RangeCalendar.Header>
      <RangeCalendar.PrevButton />
      <RangeCalendar.Heading />
      <RangeCalendar.NextButton />
    </RangeCalendar.Header>
    {#each months as month}
      <RangeCalendar.Grid>
        <RangeCalendar.GridHead>
          <RangeCalendar.GridRow>
            {#each weekdays as day}
              <RangeCalendar.HeadCell>
                {day}
              </RangeCalendar.HeadCell>
            {/each}
          </RangeCalendar.GridRow>
        </RangeCalendar.GridHead>
        <RangeCalendar.GridBody>
          {#each month.weeks as weekDates}
            <RangeCalendar.GridRow>
              {#each weekDates as date}
                <RangeCalendar.Cell {date} month={month.value}>
                  <RangeCalendar.Day />
                </RangeCalendar.Cell>
              {/each}
            </RangeCalendar.GridRow>
          {/each}
        </RangeCalendar.GridBody>
      </RangeCalendar.Grid>
    {/each}
  {/snippet}
</RangeCalendar.Root>
```

## Examples

### Min Days

You can set the `minDays` prop to limit the minimum number of days that must be selected for a range.

```svelte
<RangeCalendar.Root minDays={3}>
  <!-- ... -->
</RangeCalendar.Root>
```

Expand Code

```svelte
<script lang="ts">
  import { RangeCalendar } from "bits-ui";
  import CaretLeft from "phosphor-svelte/lib/CaretLeft";
  import CaretRight from "phosphor-svelte/lib/CaretRight";
  import cn from "clsx";
  import type { ComponentProps } from "svelte";
  let { value = $bindable() }: ComponentProps<typeof RangeCalendar.Root> =
    $props();
</script>
<RangeCalendar.Root
  class="rounded-15px border-dark-10 bg-background-alt shadow-card mt-6 border p-[22px]"
  weekdayFormat="short"
  fixedWeeks={true}
  bind:value
  minDays={3}
>
  {#snippet children({ months, weekdays })}
    <RangeCalendar.Header class="flex items-center justify-between">
      <RangeCalendar.PrevButton
        class="rounded-9px bg-background-alt hover:bg-muted inline-flex size-10 items-center justify-center active:scale-[0.98]"
      >
        <CaretLeft class="size-6" />
      </RangeCalendar.PrevButton>
      <RangeCalendar.Heading class="text-[15px] font-medium" />
      <RangeCalendar.NextButton
        class="rounded-9px bg-background-alt hover:bg-muted inline-flex size-10 items-center justify-center active:scale-[0.98]"
      >
        <CaretRight class="size-6" />
      </RangeCalendar.NextButton>
    </RangeCalendar.Header>
    <div
      class="flex flex-col space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0"
    >
      {#each months as month (month.value.month)}
        <RangeCalendar.Grid
          class="w-full border-collapse select-none space-y-1"
        >
          <RangeCalendar.GridHead>
            <RangeCalendar.GridRow class="mb-1 flex w-full justify-between">
              {#each weekdays as day (day)}
                <RangeCalendar.HeadCell
                  class="text-muted-foreground font-normal! w-10 rounded-md text-xs"
                >
                  <div>{day.slice(0, 2)}</div>
                </RangeCalendar.HeadCell>
              {/each}
            </RangeCalendar.GridRow>
          </RangeCalendar.GridHead>
          <RangeCalendar.GridBody>
            {#each month.weeks as weekDates, i (i)}
              <RangeCalendar.GridRow class="flex w-full">
                {#each weekDates as date, d (d)}
                  <RangeCalendar.Cell
                    {date}
                    month={month.value}
                    class="p-0! relative m-0 size-10 text-center text-sm focus-within:z-20"
                  >
                    <RangeCalendar.Day
                      class={cn(
                        "rounded-9px text-foreground hover:border-foreground focus-visible:ring-foreground! data-selection-end:rounded-9px data-selection-start:rounded-9px data-highlighted:bg-muted data-selected:bg-muted data-selection-end:bg-foreground data-selection-start:bg-foreground data-disabled:text-foreground/30 data-selected:text-foreground data-selection-end:text-background data-selection-start:text-background data-unavailable:text-muted-foreground data-selected:[&:not([data-selection-start])]:[&:not([data-selection-end])]:focus-visible:border-foreground data-disabled:pointer-events-none data-highlighted:rounded-none data-outside-month:pointer-events-none data-selected:font-medium data-selection-end:font-medium data-selection-start:font-medium data-selection-start:focus-visible:ring-2 data-selection-start:focus-visible:ring-offset-2! data-unavailable:line-through data-selected:[&:not([data-selection-start])]:[&:not([data-selection-end])]:rounded-none data-selected:[&:not([data-selection-start])]:[&:not([data-selection-end])]:focus-visible:ring-0! data-selected:[&:not([data-selection-start])]:[&:not([data-selection-end])]:focus-visible:ring-offset-0! group relative inline-flex size-10 items-center justify-center overflow-visible whitespace-nowrap border border-transparent bg-transparent p-0 text-sm font-normal"
                      )}
                    >
                      <div
                        class="bg-foreground group-data-selected:bg-background group-data-today:block absolute top-[5px] hidden size-1 rounded-full"
                      ></div>
                      {date.day}
                    </RangeCalendar.Day>
                  </RangeCalendar.Cell>
                {/each}
              </RangeCalendar.GridRow>
            {/each}
          </RangeCalendar.GridBody>
        </RangeCalendar.Grid>
      {/each}
    </div>
  {/snippet}
</RangeCalendar.Root>
```

### Max Days

You can set the `maxDays` prop to limit the maximum number of days that can be selected for a range.

```svelte
<RangeCalendar.Root maxDays={7}>
  <!-- ... -->
</RangeCalendar.Root>
```

Expand Code

```svelte
<script lang="ts">
  import { RangeCalendar } from "bits-ui";
  import CaretLeft from "phosphor-svelte/lib/CaretLeft";
  import CaretRight from "phosphor-svelte/lib/CaretRight";
  import cn from "clsx";
  import type { ComponentProps } from "svelte";
  let { value = $bindable() }: ComponentProps<typeof RangeCalendar.Root> =
    $props();
</script>
<RangeCalendar.Root
  class="rounded-15px border-dark-10 bg-background-alt shadow-card mt-6 border p-[22px]"
  weekdayFormat="short"
  fixedWeeks={true}
  bind:value
  maxDays={7}
>
  {#snippet children({ months, weekdays })}
    <RangeCalendar.Header class="flex items-center justify-between">
      <RangeCalendar.PrevButton
        class="rounded-9px bg-background-alt hover:bg-muted inline-flex size-10 items-center justify-center active:scale-[0.98]"
      >
        <CaretLeft class="size-6" />
      </RangeCalendar.PrevButton>
      <RangeCalendar.Heading class="text-[15px] font-medium" />
      <RangeCalendar.NextButton
        class="rounded-9px bg-background-alt hover:bg-muted inline-flex size-10 items-center justify-center active:scale-[0.98]"
      >
        <CaretRight class="size-6" />
      </RangeCalendar.NextButton>
    </RangeCalendar.Header>
    <div
      class="flex flex-col space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0"
    >
      {#each months as month (month.value.month)}
        <RangeCalendar.Grid
          class="w-full border-collapse select-none space-y-1"
        >
          <RangeCalendar.GridHead>
            <RangeCalendar.GridRow class="mb-1 flex w-full justify-between">
              {#each weekdays as day (day)}
                <RangeCalendar.HeadCell
                  class="text-muted-foreground font-normal! w-10 rounded-md text-xs"
                >
                  <div>{day.slice(0, 2)}</div>
                </RangeCalendar.HeadCell>
              {/each}
            </RangeCalendar.GridRow>
          </RangeCalendar.GridHead>
          <RangeCalendar.GridBody>
            {#each month.weeks as weekDates, i (i)}
              <RangeCalendar.GridRow class="flex w-full">
                {#each weekDates as date, d (d)}
                  <RangeCalendar.Cell
                    {date}
                    month={month.value}
                    class="p-0! relative m-0 size-10 text-center text-sm focus-within:z-20"
                  >
                    <RangeCalendar.Day
                      class={cn(
                        "rounded-9px text-foreground hover:border-foreground focus-visible:ring-foreground! data-selection-end:rounded-9px data-selection-start:rounded-9px data-highlighted:bg-muted data-selected:bg-muted data-selection-end:bg-foreground data-selection-start:bg-foreground data-disabled:text-foreground/30 data-selected:text-foreground data-selection-end:text-background data-selection-start:text-background data-unavailable:text-muted-foreground data-selected:[&:not([data-selection-start])]:[&:not([data-selection-end])]:focus-visible:border-foreground data-disabled:pointer-events-none data-highlighted:rounded-none data-outside-month:pointer-events-none data-selected:font-medium data-selection-end:font-medium data-selection-start:font-medium data-selection-start:focus-visible:ring-2 data-selection-start:focus-visible:ring-offset-2! data-unavailable:line-through data-selected:[&:not([data-selection-start])]:[&:not([data-selection-end])]:rounded-none data-selected:[&:not([data-selection-start])]:[&:not([data-selection-end])]:focus-visible:ring-0! data-selected:[&:not([data-selection-start])]:[&:not([data-selection-end])]:focus-visible:ring-offset-0! group relative inline-flex size-10 items-center justify-center overflow-visible whitespace-nowrap border border-transparent bg-transparent p-0 text-sm font-normal"
                      )}
                    >
                      <div
                        class="bg-foreground group-data-selected:bg-background group-data-today:block absolute top-[5px] hidden size-1 rounded-full"
                      ></div>
                      {date.day}
                    </RangeCalendar.Day>
                  </RangeCalendar.Cell>
                {/each}
              </RangeCalendar.GridRow>
            {/each}
          </RangeCalendar.GridBody>
        </RangeCalendar.Grid>
      {/each}
    </div>
  {/snippet}
</RangeCalendar.Root>
```

### Min and Max Days

You can set both `minDays` and `maxDays` to limit the number of days that can be selected for a range.

```svelte
<RangeCalendar.Root minDays={3} maxDays={10}>
  <!-- ... -->
</RangeCalendar.Root>
```

Expand Code

```svelte
<script lang="ts">
  import { RangeCalendar } from "bits-ui";
  import CaretLeft from "phosphor-svelte/lib/CaretLeft";
  import CaretRight from "phosphor-svelte/lib/CaretRight";
  import cn from "clsx";
  import type { ComponentProps } from "svelte";
  let { value = $bindable() }: ComponentProps<typeof RangeCalendar.Root> =
    $props();
</script>
<RangeCalendar.Root
  class="rounded-15px border-dark-10 bg-background-alt shadow-card mt-6 border p-[22px]"
  weekdayFormat="short"
  fixedWeeks={true}
  bind:value
  maxDays={10}
  minDays={3}
>
  {#snippet children({ months, weekdays })}
    <RangeCalendar.Header class="flex items-center justify-between">
      <RangeCalendar.PrevButton
        class="rounded-9px bg-background-alt hover:bg-muted inline-flex size-10 items-center justify-center active:scale-[0.98]"
      >
        <CaretLeft class="size-6" />
      </RangeCalendar.PrevButton>
      <RangeCalendar.Heading class="text-[15px] font-medium" />
      <RangeCalendar.NextButton
        class="rounded-9px bg-background-alt hover:bg-muted inline-flex size-10 items-center justify-center active:scale-[0.98]"
      >
        <CaretRight class="size-6" />
      </RangeCalendar.NextButton>
    </RangeCalendar.Header>
    <div
      class="flex flex-col space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0"
    >
      {#each months as month (month.value.month)}
        <RangeCalendar.Grid
          class="w-full border-collapse select-none space-y-1"
        >
          <RangeCalendar.GridHead>
            <RangeCalendar.GridRow class="mb-1 flex w-full justify-between">
              {#each weekdays as day (day)}
                <RangeCalendar.HeadCell
                  class="text-muted-foreground font-normal! w-10 rounded-md text-xs"
                >
                  <div>{day.slice(0, 2)}</div>
                </RangeCalendar.HeadCell>
              {/each}
            </RangeCalendar.GridRow>
          </RangeCalendar.GridHead>
          <RangeCalendar.GridBody>
            {#each month.weeks as weekDates, i (i)}
              <RangeCalendar.GridRow class="flex w-full">
                {#each weekDates as date, d (d)}
                  <RangeCalendar.Cell
                    {date}
                    month={month.value}
                    class="p-0! relative m-0 size-10 text-center text-sm focus-within:z-20"
                  >
                    <RangeCalendar.Day
                      class={cn(
                        "rounded-9px text-foreground hover:border-foreground focus-visible:ring-foreground! data-selection-end:rounded-9px data-selection-start:rounded-9px data-highlighted:bg-muted data-selected:bg-muted data-selection-end:bg-foreground data-selection-start:bg-foreground data-disabled:text-foreground/30 data-selected:text-foreground data-selection-end:text-background data-selection-start:text-background data-unavailable:text-muted-foreground data-selected:[&:not([data-selection-start])]:[&:not([data-selection-end])]:focus-visible:border-foreground data-disabled:pointer-events-none data-highlighted:rounded-none data-outside-month:pointer-events-none data-selected:font-medium data-selection-end:font-medium data-selection-start:font-medium data-selection-start:focus-visible:ring-2 data-selection-start:focus-visible:ring-offset-2! data-unavailable:line-through data-selected:[&:not([data-selection-start])]:[&:not([data-selection-end])]:rounded-none data-selected:[&:not([data-selection-start])]:[&:not([data-selection-end])]:focus-visible:ring-0! data-selected:[&:not([data-selection-start])]:[&:not([data-selection-end])]:focus-visible:ring-offset-0! group relative inline-flex size-10 items-center justify-center overflow-visible whitespace-nowrap border border-transparent bg-transparent p-0 text-sm font-normal"
                      )}
                    >
                      <div
                        class="bg-foreground group-data-selected:bg-background group-data-today:block absolute top-[5px] hidden size-1 rounded-full"
                      ></div>
                      {date.day}
                    </RangeCalendar.Day>
                  </RangeCalendar.Cell>
                {/each}
              </RangeCalendar.GridRow>
            {/each}
          </RangeCalendar.GridBody>
        </RangeCalendar.Grid>
      {/each}
    </div>
  {/snippet}
</RangeCalendar.Root>
```

### Exclude Disabled

You can set the `excludeDisabled` prop to automatically reset the range if any date within the selected range becomes disabled.

```svelte
<RangeCalendar.Root
  excludeDisabled
  isDateDisabled={(date) => isWeekend(date, "en-US")}
>
  <!-- ... -->
</RangeCalendar.Root>
```

Expand Code

```svelte
<script lang="ts">
  import { RangeCalendar } from "bits-ui";
  import CaretLeft from "phosphor-svelte/lib/CaretLeft";
  import CaretRight from "phosphor-svelte/lib/CaretRight";
  import cn from "clsx";
  import type { ComponentProps } from "svelte";
  import { isWeekend } from "@internationalized/date";
  let { value = $bindable() }: ComponentProps<typeof RangeCalendar.Root> =
    $props();
</script>
<RangeCalendar.Root
  class="rounded-15px border-dark-10 bg-background-alt shadow-card mt-6 border p-[22px]"
  weekdayFormat="short"
  fixedWeeks={true}
  bind:value
  isDateDisabled={(date) => isWeekend(date, "en-US")}
  excludeDisabled
>
  {#snippet children({ months, weekdays })}
    <RangeCalendar.Header class="flex items-center justify-between">
      <RangeCalendar.PrevButton
        class="rounded-9px bg-background-alt hover:bg-muted inline-flex size-10 items-center justify-center active:scale-[0.98]"
      >
        <CaretLeft class="size-6" />
      </RangeCalendar.PrevButton>
      <RangeCalendar.Heading class="text-[15px] font-medium" />
      <RangeCalendar.NextButton
        class="rounded-9px bg-background-alt hover:bg-muted inline-flex size-10 items-center justify-center active:scale-[0.98]"
      >
        <CaretRight class="size-6" />
      </RangeCalendar.NextButton>
    </RangeCalendar.Header>
    <div
      class="flex flex-col space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0"
    >
      {#each months as month (month.value.month)}
        <RangeCalendar.Grid
          class="w-full border-collapse select-none space-y-1"
        >
          <RangeCalendar.GridHead>
            <RangeCalendar.GridRow class="mb-1 flex w-full justify-between">
              {#each weekdays as day (day)}
                <RangeCalendar.HeadCell
                  class="text-muted-foreground font-normal! w-10 rounded-md text-xs"
                >
                  <div>{day.slice(0, 2)}</div>
                </RangeCalendar.HeadCell>
              {/each}
            </RangeCalendar.GridRow>
          </RangeCalendar.GridHead>
          <RangeCalendar.GridBody>
            {#each month.weeks as weekDates, i (i)}
              <RangeCalendar.GridRow class="flex w-full">
                {#each weekDates as date, d (d)}
                  <RangeCalendar.Cell
                    {date}
                    month={month.value}
                    class="p-0! relative m-0 size-10 text-center text-sm focus-within:z-20"
                  >
                    <RangeCalendar.Day
                      class={cn(
                        "rounded-9px text-foreground hover:border-foreground focus-visible:ring-foreground! data-selection-end:rounded-9px data-selection-start:rounded-9px data-highlighted:bg-muted data-selected:bg-muted data-selection-end:bg-foreground data-selection-start:bg-foreground data-disabled:text-foreground/30 data-selected:text-foreground data-selection-end:text-background data-selection-start:text-background data-unavailable:text-muted-foreground data-selected:[&:not([data-selection-start])]:[&:not([data-selection-end])]:focus-visible:border-foreground data-disabled:pointer-events-none data-highlighted:rounded-none data-outside-month:pointer-events-none data-selected:font-medium data-selection-end:font-medium data-selection-start:font-medium data-selection-start:focus-visible:ring-2 data-selection-start:focus-visible:ring-offset-2! data-unavailable:line-through data-selected:[&:not([data-selection-start])]:[&:not([data-selection-end])]:rounded-none data-selected:[&:not([data-selection-start])]:[&:not([data-selection-end])]:focus-visible:ring-0! data-selected:[&:not([data-selection-start])]:[&:not([data-selection-end])]:focus-visible:ring-offset-0! group relative inline-flex size-10 items-center justify-center overflow-visible whitespace-nowrap border border-transparent bg-transparent p-0 text-sm font-normal"
                      )}
                    >
                      <div
                        class="bg-foreground group-data-selected:bg-background group-data-today:block absolute top-[5px] hidden size-1 rounded-full"
                      ></div>
                      {date.day}
                    </RangeCalendar.Day>
                  </RangeCalendar.Cell>
                {/each}
              </RangeCalendar.GridRow>
            {/each}
          </RangeCalendar.GridBody>
        </RangeCalendar.Grid>
      {/each}
    </div>
  {/snippet}
</RangeCalendar.Root>
```

## API Reference

### RangeCalendar.Root

The root range calendar component which contains all other calendar components.

| Property                  | Type                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Description                                                                                                                                                                                                                                | Details |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| `value` $bindable         | `DateRange` - import type { DateValue } from "@internationalized/date"; import { createNumberProp } from './helpers'; type DateRange = { start: DateValue \| undefined; end: DateValue \| undefined; };                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | The selected date range.`Default:  —— undefined`                                                                                                                                                                                           |         |
| `onValueChange`           | `function` - (range: DateRange) => void                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | A function that is called when the selected date range changes.`Default:  —— undefined`                                                                                                                                                    |         |
| `placeholder`             | `DateValue` - import type { CalendarDate, CalendarDateTime, ZonedDateTime } from "@internationalized/date"; type DateValue = CalendarDate \| CalendarDateTime \| ZonedDateTime                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | The placeholder date, which is used to determine what month to display when no date is selected. This updates as the user navigates the calendar, and can be used to programmatically control the calendar's view.`Default:  —— undefined` |         |
| `onPlaceholderChange`     | `function` - (date: DateValue) => void                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | A function that is called when the placeholder date changes.`Default:  —— undefined`                                                                                                                                                       |         |
| `pagedNavigation`         | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Whether or not to use paged navigation for the calendar. Paged navigation causes the previous and next buttons to navigate by the number of months displayed at once, rather than by one month.`Default: false`                            |         |
| `preventDeselect`         | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Whether or not to prevent the user from deselecting a date without selecting another date first.`Default: false`                                                                                                                           |         |
| `weekdayFormat`           | `enum` - 'narrow' \| 'short' \| 'long'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | The format to use for the weekday strings provided via the `weekdays` slot prop.`Default: ''narrow''`                                                                                                                                      |         |
| `weekStartsOn`            | `number`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | An absolute day of the week to start the calendar on, regardless of locale. `0` is Sunday, `1` is Monday, etc. If not provided, the calendar will default to the locale's first day of the week.`Default:  —— undefined`                   |         |
| `calendarLabel`           | `string`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | The accessible label for the calendar.`Default:  —— undefined`                                                                                                                                                                             |         |
| `fixedWeeks`              | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Whether or not to always display 6 weeks in the calendar.`Default: false`                                                                                                                                                                  |         |
| `isDateDisabled`          | `function` - (date: DateValue) => boolean                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | A function that returns whether or not a date is disabled.`Default:  —— undefined`                                                                                                                                                         |         |
| `isDateUnavailable`       | `function` - (date: DateValue) => boolean                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | A function that returns whether or not a date is unavailable.`Default:  —— undefined`                                                                                                                                                      |         |
| `maxValue`                | `DateValue` - import type { CalendarDate, CalendarDateTime, ZonedDateTime } from "@internationalized/date"; type DateValue = CalendarDate \| CalendarDateTime \| ZonedDateTime                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | The maximum date that can be selected.`Default:  —— undefined`                                                                                                                                                                             |         |
| `minValue`                | `DateValue` - import type { CalendarDate, CalendarDateTime, ZonedDateTime } from "@internationalized/date"; type DateValue = CalendarDate \| CalendarDateTime \| ZonedDateTime                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | The minimum date that can be selected.`Default:  —— undefined`                                                                                                                                                                             |         |
| `locale`                  | `string`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | The locale to use for formatting dates.`Default: 'en'`                                                                                                                                                                                     |         |
| `numberOfMonths`          | `number`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | The number of months to display at once.`Default: 1`                                                                                                                                                                                       |         |
| `disabled`                | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Whether or not the calendar is disabled.`Default: false`                                                                                                                                                                                   |         |
| `readonly`                | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Whether or not the calendar is readonly.`Default: false`                                                                                                                                                                                   |         |
| `disableDaysOutsideMonth` | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Whether or not to disable days outside the current month.`Default: false`                                                                                                                                                                  |         |
| `onStartValueChange`      | `function` - (value: DateValue) => void                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | A function that is called when the start date changes.`Default:  —— undefined`                                                                                                                                                             |         |
| `onEndValueChange`        | `function` - (value: DateValue) => void                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | A function that is called when the end date changes.`Default:  —— undefined`                                                                                                                                                               |         |
| `minDays`                 | `number`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | The minimum number of days that can be selected in a range.`Default:  —— undefined`                                                                                                                                                        |         |
| `maxDays`                 | `number`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | The maximum number of days that can be selected in a range.`Default:  —— undefined`                                                                                                                                                        |         |
| `excludeDisabled`         | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Whether to automatically reset the range if any date within the selected range becomes disabled.`Default: false`                                                                                                                           |         |
| `monthFormat`             | `union` - short \| long \| narrow \| numeric \| 2-digit \| (month: number) => string                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | The format to use for the month strings provided via the `months` slot prop.`Default: 'long'`                                                                                                                                              |         |
| `yearFormat`              | `union` - numeric \| 2-digit \| (year: number) => string                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | The format to use for the year strings provided via the `years` slot prop.`Default: 'numeric'`                                                                                                                                             |         |
| `child`                   | `Snippet` - type Month\<T> = { /\*\* \* A DateValue used to represent the month. Since days \* from the previous and next months may be included in the \* calendar grid, we need a source of truth for the value \* the grid is representing. \*/ value: DateValue; /\*\* \* An array of arrays representing the weeks in the calendar. \* Each sub-array represents a week, and contains the dates for each \* day in that week. This structure is useful for rendering the calendar \* grid using a table, where each row represents a week and each cell \* represents a day. \*/ weeks: T\[]\[]; /\*\* \* An array of all the dates in the current month, including dates from \* the previous and next months that are used to fill out the calendar grid. \* This array is useful for rendering the calendar grid in a customizable way, \* as it provides all the dates that should be displayed in the grid in a flat \* array. \*/ dates: T\[]; }; type ChildSnippetProps = { props: Record\<string, unknown>; months: Month\<DateValue>\[]; weekdays: string\[]; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined`                                                                                              |         |
| `children`                | `Snippet` - type Month\<T> = { /\*\* \* A DateValue used to represent the month. Since days \* from the previous and next months may be included in the \* calendar grid, we need a source of truth for the value \* the grid is representing. \*/ value: DateValue; /\*\* \* An array of arrays representing the weeks in the calendar. \* Each sub-array represents a week, and contains the dates for each \* day in that week. This structure is useful for rendering the calendar \* grid using a table, where each row represents a week and each cell \* represents a day. \*/ weeks: T\[]\[]; /\*\* \* An array of all the dates in the current month, including dates from \* the previous and next months that are used to fill out the calendar grid. \* This array is useful for rendering the calendar grid in a customizable way, \* as it provides all the dates that should be displayed in the grid in a flat \* array. \*/ dates: T\[]; }; type ChildrenSnippetProps = { months: Month\<DateValue>\[]; weekdays: string\[]; };                               | The children content to render.`Default:  —— undefined`                                                                                                                                                                                    |         |
| `ref` $bindable           | `HTMLDivElement`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                                                                                                                          |         |

| Data Attribute             | Value | Description                                                | Details |
| -------------------------- | ----- | ---------------------------------------------------------- | ------- |
| `data-invalid`             | `''`  | Present on the root element when the calendar is invalid.  |         |
| `data-disabled`            | `''`  | Present on the root element when the calendar is disabled. |         |
| `data-readonly`            | `''`  | Present on the root element when the calendar is readonly. |         |
| `data-range-calendar-root` | `''`  | Present on the root element.                               |         |

### RangeCalendar.Header

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

### RangeCalendar.Heading

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

### RangeCalendar.NextButton

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

### RangeCalendar.PrevButton

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

### RangeCalendar.Cell

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

### RangeCalendar.Day

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

### RangeCalendar.Grid

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

### RangeCalendar.GridBody

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

### RangeCalendar.GridHead

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

### RangeCalendar.GridRow

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

### RangeCalendar.HeadCell

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

### RangeCalendar.MonthSelect

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

### RangeCalendar.YearSelect

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

[Previous Radio Group](/docs/components/radio-group) [Next Rating Group](/docs/components/rating-group)