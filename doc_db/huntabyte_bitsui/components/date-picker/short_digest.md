## DatePicker

Combines Date Field, Calendar, and Popover for date selection via input field and calendar interface.

**State management** with two-way or fully controlled binding:
- `bind:value` - selected date (DateValue)
- `bind:placeholder` - month to display when no date selected
- `bind:open` - popover open state

**Key Root properties**:
- `value`, `placeholder`, `open` (bindable)
- `isDateUnavailable`, `isDateDisabled`, `validate` - date validation functions
- `closeOnDateSelect` (default: true), `preventDeselect` (default: false)
- `weekStartsOn`, `weekdayFormat`, `fixedWeeks`, `numberOfMonths`
- `minValue`, `maxValue`, `locale`, `granularity`, `hourCycle`
- `disabled`, `readonly`, `required`

**Components**: Root, Label, Input, Segment, Trigger, Content, Portal, Calendar, Header, PrevButton/NextButton, Heading, Grid, GridRow, GridHead/GridBody, HeadCell, Cell, Day, MonthSelect, YearSelect

**Data attributes** for styling: `data-invalid`, `data-disabled`, `data-readonly`, `data-selected`, `data-today`, `data-outside-month`, `data-focused`, `data-unavailable`

**Popover positioning** via Content: `side`, `align`, `sideOffset`, `alignOffset`, `avoidCollisions`, `strategy`, `trapFocus`, etc.