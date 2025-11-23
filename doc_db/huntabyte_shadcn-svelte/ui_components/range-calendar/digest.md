## Range Calendar

A calendar component for selecting a date range.

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

### Implementation Details

- Built on top of Bits Range Calendar component
- Uses `@internationalized/date` package for date handling
- Accepts `value` object with `start` and `end` date properties
- Supports standard HTML class binding for styling

### Installation

```bash
npx shadcn-svelte@latest add range-calendar -y -o
```

Use `-y` to skip confirmation prompt and `-o` to overwrite existing files.

### Related Resources

- Bits UI Range Calendar documentation and API reference available
- 30+ Calendar Blocks available showcasing the component in action