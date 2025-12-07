## Calendar Component

Date picker built on Bits UI Calendar with @internationalized/date.

**Install:** `npx shadcn-svelte@latest add calendar -y -o`

**Basic:** `<Calendar type="single" bind:value captionLayout="dropdown" />`

**Examples:**
- Multiple months: `numberOfMonths={2}`
- Dropdown selectors: `captionLayout="dropdown-months"` or `"dropdown-years"`
- In Popover with max date constraint: `maxValue={today(getLocalTimeZone())}`
- With time input for date+time picker
- Natural language parsing via chrono-node: "In 2 days", "Tomorrow"

**Related:** Range Calendar for date ranges, Date Picker component, 30+ calendar blocks