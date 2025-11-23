## Calendar Component

Date selection component built on Bits UI Calendar with @internationalized/date support.

### Installation
```bash
npx shadcn-svelte@latest add calendar -y -o
```

### Basic Usage
```svelte
<script lang="ts">
  import { Calendar } from "$lib/components/ui/calendar/index.js";
  import { today, getLocalTimeZone } from "@internationalized/date";
  let value = today(getLocalTimeZone());
</script>
<Calendar type="single" bind:value captionLayout="dropdown" />
```

### Key Props
- `type="single"` - single date selection
- `numberOfMonths` - display multiple months
- `captionLayout` - "dropdown" (month/year), "dropdown-months", "dropdown-years"
- `maxValue`/`minValue` - date constraints
- `onValueChange` - callback on selection

### Examples
**Popover Date Picker:**
```svelte
<Popover.Root bind:open>
  <Popover.Trigger>{#snippet child({ props })}<Button {...props}>{value?.toDate(getLocalTimeZone()).toLocaleDateString()}</Button>{/snippet}</Popover.Trigger>
  <Popover.Content class="w-auto p-0"><Calendar type="single" bind:value onValueChange={() => open = false} /></Popover.Content>
</Popover.Root>
```

**Date + Time Picker:** Combine Calendar in Popover with `<Input type="time" />`

**Natural Language Input (chrono-node):** Parse text like "In 2 days" with `parseDate()` and update Calendar value

### Related
- Range Calendar for date ranges
- Date Picker component
- 30+ calendar blocks in Blocks Library