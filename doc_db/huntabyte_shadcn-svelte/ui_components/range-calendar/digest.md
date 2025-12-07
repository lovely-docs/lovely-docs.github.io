## Range Calendar

A calendar component for selecting a date range.

Built on Bits UI's Range Calendar component using the @internationalized/date package for date handling.

### Basic Usage

```svelte
<script lang="ts">
  import { getLocalTimeZone, today } from "@internationalized/date";
  import { RangeCalendar } from "$lib/components/ui/range-calendar/index.js";
  
  const start = today(getLocalTimeZone());
  const end = start.add({ days: 7 });
  let value = $state({
    start,
    end
  });
</script>

<RangeCalendar bind:value class="rounded-md border" />
```

The component accepts a `value` object with `start` and `end` date properties and supports standard HTML class binding for styling.

### Installation

```bash
npx shadcn-svelte@latest add range-calendar -y -o
```

Use `-y` to skip confirmation and `-o` to overwrite existing files.

### Related Resources

30+ Calendar Blocks are available showcasing the component in action.