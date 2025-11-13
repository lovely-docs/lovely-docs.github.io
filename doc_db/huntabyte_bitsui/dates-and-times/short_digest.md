## DateValue Types

Three immutable types from `@internationalized/date`:
- **CalendarDate**: `2024-07-10`
- **CalendarDateTime**: `2024-07-10T12:30:00`
- **ZonedDateTime**: `2024-07-10T21:00:00-04:00[America/New_York]`

Creating:
```ts
import { CalendarDate, parseDate, today, getLocalTimeZone, CalendarDateTime, parseDateTime, ZonedDateTime, parseZonedDateTime, parseAbsolute, parseAbsoluteToLocal } from "@internationalized/date";

const date = new CalendarDate(2024, 7, 10);
const dateTime = new CalendarDateTime(2024, 7, 10, 12, 30, 0);
const zonedDate = parseZonedDateTime("2024-07-12T00:45[America/New_York]");
const absolute = parseAbsolute("2024-07-12T07:45:00Z", "America/New_York");
```

## Immutability

```ts
let date = new CalendarDate(2024, 7, 10);
date = date.set({ month: 8 });
date = date.add({ months: 1 });
date = date.subtract({ days: 5 });
```

## Formatting & Parsing

```ts
import { DateFormatter } from "@internationalized/date";
const formatter = new DateFormatter("en-US", { dateStyle: "full" });
formatter.format(myDateValue.toDate("America/New_York"));

const parsed = parseDate("2024-07-10");
```

## Key Points

- Months are 1-indexed (January = 1)
- Always reassign when modifying dates
- Use `ZonedDateTime` for schedule-critical events
- Reuse `DateFormatter` instances