## Calendar Component

A date selection component built on Bits UI Calendar using the @internationalized/date package.

### Installation
```bash
pnpm dlx shadcn-svelte@latest add calendar
```

### Basic Usage
```svelte
<script lang="ts">
  import { getLocalTimeZone, today } from "@internationalized/date";
  import { Calendar } from "$lib/components/ui/calendar/index.js";
  let value = today(getLocalTimeZone());
</script>
<Calendar type="single" bind:value class="rounded-md border shadow-sm" captionLayout="dropdown" />
```

### Examples

**Multiple Months Display**
```svelte
<Calendar type="single" bind:value numberOfMonths={2} />
```

**Month/Year Selector with Dropdown Options**
Use `captionLayout` prop with values: "dropdown" (month and year), "dropdown-months" (month only), "dropdown-years" (year only).

**Date of Birth Picker**
Combines Calendar with Popover and Button. Uses `maxValue={today(getLocalTimeZone())}` to restrict future dates. Closes popover on date selection with `onValueChange`.

**Date and Time Picker**
Combines Calendar with time input field using `<Input type="time" />`.

**Natural Language Date Input**
Uses chrono-node library to parse natural language (e.g., "In 2 days", "Tomorrow"). Parses input with `parseDate()` and updates calendar value accordingly. Supports arrow-down key to open calendar.

### Related Components
- Range Calendar: for date range selection
- Date Picker: uses Calendar component internally
- 30+ calendar blocks available in Blocks Library

### Upgrade
```bash
pnpm dlx shadcn-svelte@latest add calendar
```
Select "Yes" to overwrite existing files. Merge any custom changes manually.