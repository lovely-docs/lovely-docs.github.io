## Calendar Component

A date selection component built on Bits UI Calendar using @internationalized/date for date handling.

### Basic Usage
```svelte
import { getLocalTimeZone, today } from "@internationalized/date";
import { Calendar } from "$lib/components/ui/calendar/index.js";

let value = today(getLocalTimeZone());
```
```svelte
<Calendar
  type="single"
  bind:value
  class="rounded-md border shadow-sm"
  captionLayout="dropdown"
/>
```

### Installation
```bash
npx shadcn-svelte@latest add calendar -y -o
```
(-y: skip confirmation, -o: overwrite existing files)

### Examples

**Multiple Months Display**
```svelte
let value = new CalendarDate(2025, 6, 12);
<Calendar type="single" bind:value numberOfMonths={2} />
```

**Month/Year Selector with Dropdown Options**
```svelte
let dropdown = "dropdown"; // or "dropdown-months", "dropdown-years"
<Calendar type="single" bind:value captionLayout={dropdown} />
```
Pair with Select component to switch between "Month and Year", "Month Only", "Year Only" layouts.

**Date of Birth Picker (in Popover)**
```svelte
let open = false;
let value;
<Popover.Root bind:open>
  <Popover.Trigger>
    <Button variant="outline">
      {value ? value.toDate(getLocalTimeZone()).toLocaleDateString() : "Select date"}
    </Button>
  </Popover.Trigger>
  <Popover.Content class="w-auto p-0">
    <Calendar
      type="single"
      bind:value
      captionLayout="dropdown"
      onValueChange={() => { open = false; }}
      maxValue={today(getLocalTimeZone())}
    />
  </Popover.Content>
</Popover.Root>
```

**Date and Time Picker**
Combine Calendar in Popover with time Input:
```svelte
<Calendar type="single" bind:value captionLayout="dropdown" />
<Input type="time" step="1" value="10:30:00" />
```

**Natural Language Date Input**
Uses chrono-node to parse text like "In 2 days", "Tomorrow", "next week":
```svelte
import { parseDate } from "chrono-node";
import { CalendarDate } from "@internationalized/date";

let inputValue = "In 2 days";
let value = parseDate(inputValue) 
  ? new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate())
  : undefined;

<Input
  bind:value={inputValue}
  placeholder="Tomorrow or next week"
  onkeydown={(e) => { if (e.key === "ArrowDown") open = true; }}
/>
<Calendar type="single" bind:value onValueChange={(v) => { inputValue = formatDate(v); }} />
```

### Related Components
- Range Calendar: for date range selection
- Date Picker: wrapper component using Calendar
- 30+ calendar blocks available in Blocks Library

### Upgrade
```bash
npx shadcn-svelte@latest add calendar -y -o
```
Then add new blocks: `npx shadcn-svelte@latest add calendar-02 -y -o`