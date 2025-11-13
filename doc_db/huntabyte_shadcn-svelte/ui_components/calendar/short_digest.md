## Calendar Component

Date selection component built on Bits UI Calendar.

**Installation**: `pnpm dlx shadcn-svelte@latest add calendar`

**Basic**: `<Calendar type="single" bind:value captionLayout="dropdown" />`

**Examples**:
- Multiple months: `numberOfMonths={2}`
- Month/year selector: `captionLayout="dropdown"` (or "dropdown-months", "dropdown-years")
- Date of birth picker: with Popover, `maxValue={today(getLocalTimeZone())}`
- Date and time: Calendar + `<Input type="time" />`
- Natural language input: uses chrono-node `parseDate()` to parse text like "In 2 days"

**Related**: Range Calendar, Date Picker, 30+ calendar blocks