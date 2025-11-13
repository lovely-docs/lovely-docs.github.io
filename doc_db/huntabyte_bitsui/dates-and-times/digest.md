## DateValue Types

Bits UI uses immutable `DateValue` objects from `@internationalized/date` to represent dates and times:

- **CalendarDate**: Date without time (e.g., `2024-07-10`)
- **CalendarDateTime**: Date with time, no timezone (e.g., `2024-07-10T12:30:00`)
- **ZonedDateTime**: Date with time and timezone (e.g., `2024-07-10T21:00:00-04:00[America/New_York]`)

Creating instances:
```ts
import { CalendarDate, parseDate, today, getLocalTimeZone, CalendarDateTime, parseDateTime, ZonedDateTime, parseZonedDateTime, parseAbsolute, parseAbsoluteToLocal } from "@internationalized/date";

const date = new CalendarDate(2024, 7, 10);
const parsedDate = parseDate("2024-07-10");
const localToday = today(getLocalTimeZone());

const dateTime = new CalendarDateTime(2024, 7, 10, 12, 30, 0);
const parsedDateTime = parseDateTime("2024-07-10T12:30:00");

const zonedDate = new ZonedDateTime(2022, 2, 3, "America/Los_Angeles", -28800000, 9, 15, 0);
const parsedZoned = parseZonedDateTime("2024-07-12T00:45[America/New_York]");
const absolute = parseAbsolute("2024-07-12T07:45:00Z", "America/New_York");
const localAbsolute = parseAbsoluteToLocal("2024-07-12T07:45:00Z");
```

## DateRange Type

For components requiring date ranges:
```ts
type DateRange = {
  start: DateValue;
  end: DateValue;
};
```

## Placeholder Prop

Each date/time component has a bindable `placeholder` prop that:
1. Acts as the initial date when no value is selected
2. Determines the date/time type to display if value is absent
3. Controls the visible date range in calendar views

## Immutability

DateValue objects are immutable. Update using methods that return new instances:
```ts
let placeholder = new CalendarDate(2024, 7, 10);
placeholder = placeholder.set({ month: 8 });
placeholder = placeholder.add({ months: 1 });
placeholder = placeholder.subtract({ days: 5 });
placeholder = placeholder.cycle("month", "forward", [1, 3, 5, 7, 9, 11]);
```

## Formatting and Parsing

Format dates for display using `DateFormatter`:
```ts
import { DateFormatter } from "@internationalized/date";
const formatter = new DateFormatter("en-US", { dateStyle: "full", timeStyle: "short" });
const formattedDate = formatter.format(myDateValue.toDate("America/New_York"));
```

Parse date strings using appropriate functions:
```ts
const date = parseDate("2024-07-10");
const dateTime = parseDateTime("2024-07-10T12:30:00");
const zonedDate = parseZonedDateTime("2024-07-12T00:45[America/New_York]");
const absoluteDate = parseAbsolute("2024-07-12T07:45:00Z", "America/New_York");
const localDate = parseAbsoluteToLocal("2024-07-12T07:45:00Z");
```

## Key Points

- Months are 1-indexed (January = 1), unlike JavaScript's Date
- Always reassign when modifying: `date = date.add({ days: 1 })`
- Use `ZonedDateTime` for schedule-critical events
- Match `placeholder` type to needs (use `CalendarDateTime` if time selection needed)
- Reuse `DateFormatter` instances for performance