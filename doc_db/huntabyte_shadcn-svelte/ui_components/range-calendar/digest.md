## RangeCalendar Component

A calendar component for selecting a range of dates, built on top of Bits UI's Range Calendar component using the @internationalized/date package for date handling.

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

The component accepts a `value` object with `start` and `end` date properties and supports standard class bindings for styling.

### Installation

```bash
npm install shadcn-svelte@latest add range-calendar
```

### References

- Full API reference available in Bits UI documentation
- 30+ calendar block examples available in the component library