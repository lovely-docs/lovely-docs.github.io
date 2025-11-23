## Calendar Component

A date selection component built on Bits UI Calendar using @internationalized/date for date handling.

### Basic Usage
```svelte
<script lang="ts">
  import { getLocalTimeZone, today } from "@internationalized/date";
  import { Calendar } from "$lib/components/ui/calendar/index.js";
  let value = today(getLocalTimeZone());
</script>
<Calendar type="single" bind:value class="rounded-md border shadow-sm" captionLayout="dropdown" />
```

### Installation
```bash
npx shadcn-svelte@latest add calendar -y -o
```
Flags: `-y` skips confirmation, `-o` overwrites existing files.

### Key Features
- Single date selection with `type="single"`
- Multiple month display with `numberOfMonths` prop
- Caption layout options: `"dropdown"` (month/year), `"dropdown-months"` (month only), `"dropdown-years"` (year only)
- Date constraints with `maxValue` and `minValue` props
- Event handling with `onValueChange` callback
- Timezone support via @internationalized/date

### Examples

**Multiple Months:**
```svelte
<Calendar type="single" bind:value numberOfMonths={2} />
```

**Month/Year Selector with Dropdown:**
```svelte
<script lang="ts">
  import Calendar from "$lib/components/ui/calendar/calendar.svelte";
  import * as Select from "$lib/components/ui/select/index.js";
  let value = $state(new CalendarDate(2025, 6, 12));
  let dropdown = $state("dropdown");
</script>
<Calendar type="single" bind:value captionLayout={dropdown} />
<Select.Root type="single" bind:value={dropdown}>
  <Select.Trigger>
    {selectedDropdown}
  </Select.Trigger>
  <Select.Content>
    <Select.Item value="dropdown">Month and Year</Select.Item>
    <Select.Item value="dropdown-months">Month Only</Select.Item>
    <Select.Item value="dropdown-years">Year Only</Select.Item>
  </Select.Content>
</Select.Root>
```

**Date of Birth Picker (with Popover):**
```svelte
<script lang="ts">
  import Calendar from "$lib/components/ui/calendar/calendar.svelte";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { today } from "@internationalized/date";
  let open = $state(false);
  let value = $state();
</script>
<Popover.Root bind:open>
  <Popover.Trigger>
    {#snippet child({ props })}
      <Button {...props} variant="outline">
        {value ? value.toDate(getLocalTimeZone()).toLocaleDateString() : "Select date"}
      </Button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content class="w-auto p-0">
    <Calendar type="single" bind:value maxValue={today(getLocalTimeZone())} 
      onValueChange={() => { open = false; }} />
  </Popover.Content>
</Popover.Root>
```

**Date and Time Picker:**
```svelte
<div class="flex gap-4">
  <Popover.Root bind:open>
    <Popover.Trigger>
      {#snippet child({ props })}
        <Button {...props} variant="outline">
          {value ? value.toDate(getLocalTimeZone()).toLocaleDateString() : "Select date"}
        </Button>
      {/snippet}
    </Popover.Trigger>
    <Popover.Content class="w-auto p-0">
      <Calendar type="single" bind:value onValueChange={() => { open = false; }} />
    </Popover.Content>
  </Popover.Root>
  <Input type="time" value="10:30:00" />
</div>
```

**Natural Language Date Picker (using chrono-node):**
```svelte
<script lang="ts">
  import { Calendar } from "$lib/components/ui/calendar/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { parseDate } from "chrono-node";
  import { CalendarDate, getLocalTimeZone } from "@internationalized/date";
  
  let open = $state(false);
  let inputValue = $state("In 2 days");
  let value = $state(parseDate(inputValue) ? new CalendarDate(...) : undefined);
</script>
<Input bind:value={inputValue} placeholder="Tomorrow or next week" 
  onkeydown={(e) => { if (e.key === "ArrowDown") open = true; }} />
<Popover.Root bind:open>
  <Popover.Trigger>Calendar Icon</Popover.Trigger>
  <Popover.Content class="w-auto p-0">
    <Calendar type="single" bind:value 
      onValueChange={(v) => { inputValue = formatDate(v); open = false; }} />
  </Popover.Content>
</Popover.Root>
```

### Related Components
- Range Calendar: for date range selection
- Date Picker: higher-level date selection component
- 30+ calendar blocks available in Blocks Library

### Upgrade
```bash
npx shadcn-svelte@latest add calendar -y -o
```
If you've customized the component, manually merge changes. After upgrading, add new blocks:
```bash
npx shadcn-svelte@latest add calendar-02 -y -o
```