

## Pages

### accordion
Collapsible accordion component supporting single/multiple open items with accessible defaults, state management, and transition support.

## Accordion Component

Collapsible sections with single or multiple open items.

### Quick Start
```svelte
<Accordion.Root type="single">
  <Accordion.Item value="item-1">
    <Accordion.Header>
      <Accordion.Trigger>Title</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content>Content</Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
```

### Key Props
- `type`: "single" or "multiple"
- `value`: Currently open item(s), bindable
- `disabled`: Disable accordion or items
- `orientation`: "vertical" or "horizontal"
- `forceMount`: Mount content for transitions
- `hiddenUntilFound`: Enable browser search in collapsed content

### State Management
```svelte
let myValue = $state<string[]>([]);
<Accordion.Root type="multiple" bind:value={myValue}>
```

### Transitions
```svelte
<Accordion.Content forceMount={true}>
  {#snippet child({ props, open })}
    {#if open}
      <div {...props} transition:slide>Content</div>
    {/if}
  {/snippet}
</Accordion.Content>
```

### Components
Root, Item, Header, Trigger, Content

### alert-dialog
Modal dialog component with compound structure, focus management, and customizable behaviors for confirmations and user input.

## Alert Dialog

Modal component for confirmations and user input without navigation.

**Basic structure**: Root → Trigger, Portal → (Overlay + Content with Title/Description/Cancel/Action)

**State**: `bind:open` for two-way binding or function bindings for full control

**Focus**: Trapped by default; customize with `onOpenAutoFocus`/`onCloseAutoFocus`

**Behaviors**: 
- Scroll lock enabled by default (`preventScroll={false}` to disable)
- Escape key closes by default (`escapeKeydownBehavior="ignore"` to prevent)
- Outside clicks ignored by default (`interactOutsideBehavior="close"` to close)

**Nesting**: Use `data-nested`, `data-nested-open`, `--bits-dialog-depth`, `--bits-dialog-nested-count` for styling

**Forms**: Action button doesn't auto-close; programmatically close after async work. Keep Portal inside form to avoid submission issues.

### aspect_ratio
Component that maintains a specified aspect ratio for its content using the ratio prop.

## AspectRatio Component

Maintains a specified aspect ratio for content.

```svelte
<AspectRatio.Root ratio={14 / 9}>
  <img src="/abstract.png" alt="painting" />
</AspectRatio.Root>
```

**Props**: `ratio` (number, default 1), `ref` ($bindable), `children` (Snippet), `child` (Snippet)

### avatar
Compound component for displaying images with automatic loading state management and fallback support.

## Avatar Component

Compound component for displaying images with loading states and fallbacks.

**Structure**: Avatar.Root (container) → Avatar.Image + Avatar.Fallback

**Basic usage**:
```svelte
<Avatar.Root>
  <Avatar.Image src="url" alt="text" />
  <Avatar.Fallback>HB</Avatar.Fallback>
</Avatar.Root>
```

**Key props**:
- `loadingStatus` (bindable): 'loading' | 'loaded' | 'error'
- `delayMs`: Delay before showing image (prevents flickering)
- `onLoadingStatusChange`: Callback for state changes

**Skip loading check** for guaranteed images:
```svelte
<Avatar.Root loadingStatus="loaded">
  <Avatar.Image src={localAsset} alt="text" />
  <Avatar.Fallback>HB</Avatar.Fallback>
</Avatar.Root>
```

**Data attributes**: `data-status`, `data-avatar-root`, `data-avatar-image`, `data-avatar-fallback`

### button
A button component that conditionally renders as an anchor tag when href is provided.

## Button

Flexible button component that renders as `<button>` or `<a>` based on `href` prop.

**Props:**
- `href` (string): Converts to anchor tag
- `disabled` (boolean): Disables interaction
- `ref` (bindable): DOM element reference
- `children` (Snippet): Content

**Example:**
```svelte
<Button.Root class="...">Unlimited</Button.Root>
```

### calendar
Calendar component for date selection with single/multiple modes, validation, and customizable navigation.

## Calendar Component

Date picker displaying dates and days of the week.

### Basic Usage
```svelte
<Calendar.Root type="single" bind:value>
  {#snippet children({ months, weekdays })}
    <Calendar.Header>
      <Calendar.PrevButton />
      <Calendar.Heading />
      <Calendar.NextButton />
    </Calendar.Header>
    {#each months as month}
      <Calendar.Grid>
        <Calendar.GridHead>
          {#each weekdays as day}
            <Calendar.HeadCell>{day}</Calendar.HeadCell>
          {/each}
        </Calendar.GridHead>
        <Calendar.GridBody>
          {#each month.weeks as weekDates}
            {#each weekDates as date}
              <Calendar.Cell {date} month={month.value}>
                <Calendar.Day />
              </Calendar.Cell>
            {/each}
          {/each}
        </Calendar.GridBody>
      </Calendar.Grid>
    {/each}
  {/snippet}
</Calendar.Root>
```

### State Management
```svelte
<script>
  let value = $state(new CalendarDateTime(2024, 8, 3, 12, 30));
</script>
<Calendar.Root type="single" bind:value={value} />
```

Or fully controlled:
```svelte
<Calendar.Root type="single" bind:value={getValue, setValue} />
```

### Validation
```svelte
<Calendar.Root 
  minValue={todayDate}
  maxValue={tomorrowDate}
  isDateDisabled={(date) => date.day === 1}
  isDateUnavailable={(date) => date.day === 1}
  type="multiple"
  maxDays={3}
/>
```

### Options
- `type`: 'single' | 'multiple'
- `fixedWeeks`, `numberOfMonths`, `pagedNavigation`: Layout
- `locale`, `weekStartsOn`, `weekdayFormat`: Formatting
- `disabled`, `readonly`: State
- `initialFocus`: Focus on mount

### Custom Navigation
```svelte
<script>
  let placeholder = $state(new CalendarDate(2024, 8, 3));
</script>
<button onclick={() => { placeholder = placeholder.set({ month: 8 }); }}>
  Set month to August
</button>
<Calendar.Root bind:placeholder />
```

Use `Calendar.MonthSelect` and `Calendar.YearSelect` for dropdown navigation.

### checkbox
Checkbox component with tri-state support, form integration, and checkbox groups.

## Checkbox Component

Tri-state checkbox (checked, unchecked, indeterminate) with accessibility and form support.

### Basic Usage
```svelte
<Checkbox.Root bind:checked={myChecked}>
  {#snippet children({ checked, indeterminate })}
    {#if indeterminate}-{:else if checked}✅{:else}❌{/if}
  {/snippet}
</Checkbox.Root>
```

### State Management
- `bind:checked` for two-way binding or function binding for full control
- `bind:indeterminate` for indeterminate state
- `disabled`, `required`, `readonly` props

### Forms
```svelte
<Checkbox.Root name="notifications" value="hello" />
```

### Groups
```svelte
<Checkbox.Group bind:value={myValue} name="notifications">
  <Checkbox.GroupLabel>Notifications</Checkbox.GroupLabel>
  <Checkbox.Root value="marketing" />
  <Checkbox.Root value="promotions" />
</Checkbox.Group>
```

### Key Props
- `checked`, `indeterminate` (bindable)
- `disabled`, `required`, `readonly`
- `name`, `value` (for forms)
- `ref` (DOM reference)
- `children` snippet with `{ checked, indeterminate }`

### Data Attributes
- `data-state`: 'checked' | 'unchecked' | 'indeterminate'
- `data-disabled`, `data-readonly`, `data-checkbox-root`

### collapsible
Collapsible component for expandable/collapsible content sections with state management, transitions, and browser search integration.

## Collapsible

Expandable/collapsible content with accessibility and transitions.

**Basic structure:**
```svelte
<Collapsible.Root bind:open={isOpen}>
  <Collapsible.Trigger>Toggle</Collapsible.Trigger>
  <Collapsible.Content>Content</Collapsible.Content>
</Collapsible.Root>
```

**Transitions with forceMount:**
```svelte
<Collapsible.Content forceMount>
  {#snippet child({ props, open })}
    {#if open}
      <div {...props} transition:fade>Content</div>
    {/if}
  {/snippet}
</Collapsible.Content>
```

**Hidden until found (browser search):**
```svelte
<Collapsible.Content hiddenUntilFound>Content</Collapsible.Content>
```

**Key props:** `open` (bindable), `onOpenChange`, `disabled`, `forceMount`, `hiddenUntilFound`

### combobox
Searchable dropdown component with keyboard navigation, single/multiple selection, and customizable positioning.

## Combobox

Searchable dropdown with single/multiple selection, keyboard navigation, and WAI-ARIA support.

**State:** `bind:value` (string or string[]), `bind:open` (boolean)

**Positioning:** `Combobox.Content` uses Floating UI; `Combobox.ContentStatic` for manual positioning. Custom anchor via `customAnchor` prop.

**Filtering:**
```svelte
let searchValue = $state("");
const filtered = $derived(items.filter(i => i.label.toLowerCase().includes(searchValue.toLowerCase())));
<Combobox.Input oninput={(e) => (searchValue = e.currentTarget.value)} />
{#each filtered as item}
  <Combobox.Item value={item.value} label={item.label} />
{/each}
```

**Scrolling:** Use `Combobox.Viewport` with `ScrollUpButton`/`ScrollDownButton`. Custom delay: `delay={(tick) => number}`

**Styling:** `data-highlighted`, `data-selected`, `data-disabled` attributes; `onHighlight`/`onUnhighlight` callbacks

**Options:** `preventScroll`, `forceMount` (for transitions), `scrollAlignment`, `allowDeselect`, `loop`, `escapeKeydownBehavior`, `interactOutsideBehavior`

### command
Searchable, filterable command menu component with keyboard navigation, grouping, and customizable filtering.

## Command Component

Searchable, filterable menu with keyboard navigation, grouping, and grid layout support.

### State Management
- Two-way: `bind:value={myValue}`
- Handler: `onValueChange={(value) => {}}`
- Controlled: `bind:value={() => myValue, (v) => (myValue = v)}`

### Filtering
- Default: relevance scoring
- Custom: `filter={(value, search, keywords) => 0-1}`
- Disable: `shouldFilter={false}`

### Selection & Links
- `<Command.Item onSelect={() => {}} />`
- `<Command.LinkItem href="/path" />` for links

### Imperative API
```svelte
let command;
<Command.Root bind:this={command}>
command.getValidItems()
command.updateSelectedToIndex(2)
command.updateSelectedByItem(1)
```

### Examples
Modal with Cmd+J:
```svelte
<Dialog.Root bind:open={dialogOpen}>
  <Command.Root>
    <Command.Input placeholder="Search..." />
    <Command.List>
      <Command.Viewport>
        <Command.Group>
          <Command.GroupHeading>Suggestions</Command.GroupHeading>
          <Command.GroupItems>
            <Command.Item value="intro">Introduction</Command.Item>
          </Command.GroupItems>
        </Command.Group>
      </Command.Viewport>
    </Command.List>
  </Command.Root>
</Dialog.Root>
```

Grid layout:
```svelte
<Command.Root columns={8}>
  <Command.GroupItems class="grid grid-cols-8">
    <Command.Item value="emoji">🎉</Command.Item>
  </Command.GroupItems>
</Command.Root>
```

### Important
- Use unique `value` props on items to avoid selection issues

### context-menu
Right-click context menu component with support for items, checkboxes, radio groups, nested submenus, and Svelte transitions.

## Context Menu

Right-click triggered menu with items, checkboxes, radio groups, and nested submenus.

**Basic usage:**
```svelte
<ContextMenu.Root>
  <ContextMenu.Trigger>Right click</ContextMenu.Trigger>
  <ContextMenu.Portal>
    <ContextMenu.Content>
      <ContextMenu.Item>Edit</ContextMenu.Item>
      <ContextMenu.Item>Delete</ContextMenu.Item>
    </ContextMenu.Content>
  </ContextMenu.Portal>
</ContextMenu.Root>
```

**Checkbox items:**
```svelte
<ContextMenu.CheckboxItem bind:checked={value}>
  {#snippet children({ checked })}
    {#if checked}✅{/if}
    Option
  {/snippet}
</ContextMenu.CheckboxItem>
```

**Radio groups:**
```svelte
<ContextMenu.RadioGroup bind:value={selected}>
  <ContextMenu.RadioItem value="one">One</ContextMenu.RadioItem>
  <ContextMenu.RadioItem value="two">Two</ContextMenu.RadioItem>
</ContextMenu.RadioGroup>
```

**Nested menus:**
```svelte
<ContextMenu.Sub>
  <ContextMenu.SubTrigger>Add</ContextMenu.SubTrigger>
  <ContextMenu.SubContent>
    <ContextMenu.Item>Header</ContextMenu.Item>
  </ContextMenu.SubContent>
</ContextMenu.Sub>
```

**Animations:** Use `forceMount` on Content with `{#if open}` and Svelte transitions.

**State:** `bind:open` for two-way binding or function bindings for full control.

### datefield
Customizable date input component with segment-based editing, validation, and flexible date/time granularity control.

## DateField Component

Customizable date input with segment-based editing. Use `CalendarDate`, `CalendarDateTime`, or `ZonedDateTime` for the `placeholder` to set granularity. Manage state with `bind:value` and `bind:placeholder` or function bindings. Validate with `minValue`, `maxValue`, and custom `validate` function. Style segments differently based on `part === "literal"`. Supports localization via `locale` prop and readonly segments via `readonlySegments`.

```svelte
<DateField.Root bind:value placeholder={new CalendarDateTime(2024, 8, 3, 12, 30)}>
  <DateField.Label>Birthday</DateField.Label>
  <DateField.Input>
    {#snippet children({ segments })}
      {#each segments as { part, value }}
        <DateField.Segment {part}>{value}</DateField.Segment>
      {/each}
    {/snippet}
  </DateField.Input>
</DateField.Root>
```

### date-picker
A composable date picker component combining segmented input field and calendar interface with flexible state management and date constraints.

## DatePicker Component

Combines date input field with calendar interface. Composed of Date Field, Calendar, and Popover sub-components.

### State Management
```svelte
<script>
  import { DatePicker } from "bits-ui";
  import { CalendarDateTime } from "@internationalized/date";
  let myValue = $state(new CalendarDateTime(2024, 8, 3, 12, 30));
  let isOpen = $state(false);
</script>
<DatePicker.Root bind:value={myValue} bind:open={isOpen}>
  <DatePicker.Label>Birthday</DatePicker.Label>
  <DatePicker.Input>
    {#snippet children({ segments })}
      {#each segments as { part, value }}
        <DatePicker.Segment {part}>{value}</DatePicker.Segment>
      {/each}
      <DatePicker.Trigger />
    {/snippet}
  </DatePicker.Input>
  <DatePicker.Content>
    <DatePicker.Calendar>
      {#snippet children({ months, weekdays })}
        <DatePicker.Header>
          <DatePicker.PrevButton />
          <DatePicker.Heading />
          <DatePicker.NextButton />
        </DatePicker.Header>
        {#each months as month}
          <DatePicker.Grid>
            <!-- Grid structure with cells and days -->
          </DatePicker.Grid>
        {/each}
      {/snippet}
    </DatePicker.Calendar>
  </DatePicker.Content>
</DatePicker.Root>
```

### Key Props
- `value` - Selected date (CalendarDate | CalendarDateTime | ZonedDateTime)
- `placeholder` - Controls displayed month
- `open` - Popover visibility
- `isDateUnavailable(date)` / `isDateDisabled(date)` - Date restrictions
- `closeOnDateSelect` - Auto-close after selection (default: true)
- `weekdayFormat` - 'narrow' | 'short' | 'long'
- `fixedWeeks` - Always show 6 weeks
- `numberOfMonths` - Display multiple months
- `minValue` / `maxValue` - Date range
- `granularity` - 'day' | 'hour' | 'minute' | 'second'

### date-range-field
DateRangeField component for capturing start and end dates with customizable validation, formatting, and state management.

## DateRangeField

Combines two Date Field components for date range input with start/end segments.

```svelte
<DateRangeField.Root bind:value={myValue}>
  <DateRangeField.Label>Check-in date</DateRangeField.Label>
  {#each ["start", "end"] as type}
    <DateRangeField.Input {type}>
      {#snippet children({ segments })}
        {#each segments as { part, value }}
          <DateRangeField.Segment {part}>{value}</DateRangeField.Segment>
        {/each}
      {/snippet}
    </DateRangeField.Input>
  {/each}
</DateRangeField.Root>
```

**Key props**: `value` (DateRange), `placeholder`, `minValue`/`maxValue`, `granularity`, `validate`, `disabled`, `readonly`, `locale`, `hourCycle`

**Callbacks**: `onValueChange`, `onStartValueChange`, `onEndValueChange`, `onPlaceholderChange`, `onInvalid`

### date-range-picker
Complete API reference for DateRangePicker component with state management patterns, props, callbacks, and data attributes.

## DateRangePicker

Composite component combining DateRangeField, RangeCalendar, and Popover for date range selection.

**Basic usage:**
```svelte
<DateRangePicker.Root bind:value={myValue} bind:open={isOpen}>
  <DateRangePicker.Label />
  <DateRangePicker.Input type="start">...</DateRangePicker.Input>
  <DateRangePicker.Input type="end">...</DateRangePicker.Input>
  <DateRangePicker.Trigger />
  <DateRangePicker.Content>
    <DateRangePicker.Calendar>...</DateRangePicker.Calendar>
  </DateRangePicker.Content>
</DateRangePicker.Root>
```

**State management:**
- `bind:value` - DateRange object with `start` and `end` DateValue
- `bind:placeholder` - DateValue for segment initialization
- `bind:open` - Popover visibility

**Key props:** `minValue`, `maxValue`, `minDays`, `maxDays`, `isDateUnavailable`, `isDateDisabled`, `numberOfMonths`, `fixedWeeks`, `closeOnRangeSelect`, `granularity`, `locale`, `disabled`, `readonly`

**Callbacks:** `onValueChange`, `onStartValueChange`, `onEndValueChange`, `onOpenChange`, `onInvalid`

**Day cell data attributes:** `data-selected`, `data-range-start`, `data-range-end`, `data-range-middle`, `data-highlighted`, `data-disabled`, `data-unavailable`, `data-today`

### dialog
Accessible modal dialog component with compound structure, focus management, nested dialog support, and customizable escape/outside interaction behavior.

## Dialog Component

Accessible modal dialog with compound component pattern (Root, Trigger, Portal, Overlay, Content, Title, Description, Close).

### State Management
```svelte
<Dialog.Root bind:open={isOpen}>
```

### Focus Management
```svelte
<Dialog.Content
  onOpenAutoFocus={(e) => { e.preventDefault(); input?.focus(); }}
  onCloseAutoFocus={(e) => { e.preventDefault(); input?.focus(); }}
  trapFocus={true}
>
```

### Advanced Behaviors
- Escape key: `escapeKeydownBehavior` ('close'|'ignore'|'defer-otherwise-close'|'defer-otherwise-ignore') or `onEscapeKeydown`
- Outside interaction: `interactOutsideBehavior` or `onInteractOutside`
- Scroll lock: `preventScroll={true}` (default)

### Nested Dialogs
CSS variables: `--bits-dialog-depth`, `--bits-dialog-nested-count`
Data attributes: `data-nested`, `data-nested-open`

### Transitions
```svelte
<Dialog.Overlay forceMount>
  {#snippet child({ props, open })}
    {#if open}
      <div {...props} transition:fade></div>
    {/if}
  {/snippet}
</Dialog.Overlay>
```

### Form Submission
```svelte
<form onsubmit={() => wait(1000).then(() => (open = false))}>
```

### Reusable Component
Accept `buttonText`, `title`, `description` snippets and `contentProps` for customization.

### dropdown-menu
Dropdown menu component with support for items, groups, checkboxes, radio buttons, nested submenus, and keyboard navigation.

## Dropdown Menu

Displays selectable menu items with support for groups, checkboxes, radio buttons, and nested submenus.

### Basic Usage
```svelte
<DropdownMenu.Root>
  <DropdownMenu.Trigger>Menu</DropdownMenu.Trigger>
  <DropdownMenu.Portal>
    <DropdownMenu.Content>
      <DropdownMenu.Item>Profile</DropdownMenu.Item>
      <DropdownMenu.Item>Settings</DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu.Portal>
</DropdownMenu.Root>
```

### State Management
- Two-way binding: `bind:open={isOpen}`
- Fully controlled: `bind:open={getOpen, setOpen}`

### Checkbox Items
```svelte
<DropdownMenu.CheckboxItem bind:checked={notifications}>
  {#snippet children({ checked })}
    {#if checked}✅{/if} Notifications
  {/snippet}
</DropdownMenu.CheckboxItem>
```

### Radio Groups
```svelte
<DropdownMenu.RadioGroup bind:value>
  <DropdownMenu.RadioItem value="one">One</DropdownMenu.RadioItem>
  <DropdownMenu.RadioItem value="two">Two</DropdownMenu.RadioItem>
</DropdownMenu.RadioGroup>
```

### Nested Menus
```svelte
<DropdownMenu.Sub>
  <DropdownMenu.SubTrigger>Submenu</DropdownMenu.SubTrigger>
  <DropdownMenu.SubContent>
    <DropdownMenu.Item>Sub Item</DropdownMenu.Item>
  </DropdownMenu.SubContent>
</DropdownMenu.Sub>
```

### Transitions
```svelte
<DropdownMenu.Content forceMount>
  {#snippet child({ open })}
    {#if open}
      <div transition:fly>...</div>
    {/if}
  {/snippet}
</DropdownMenu.Content>
```

### label
Enhanced label component for associating descriptive text with form inputs.

## Label Component

Enhanced label element for form inputs.

**Label.Root** properties:
- `ref` $bindable - HTMLLabelElement reference
- `children` - Content snippet
- `child` - Render delegation snippet

Data attribute: `data-label-root`

**Example:**
```svelte
<Checkbox.Root id="terms" aria-labelledby="terms-label">
  {#snippet children({ checked, indeterminate })}
    {#if indeterminate}
      <Minus />
    {:else if checked}
      <Check />
    {/if}
  {/snippet}
</Checkbox.Root>
<Label.Root id="terms-label" for="terms">
  Accept terms and conditions
</Label.Root>
```

### link-preview
A hover/focus-triggered preview component for links that uses Floating UI for positioning and supports state management, custom anchoring, and Svelte transitions.

## LinkPreview Component

Displays a preview of linked content on hover/focus (mouse/pointing devices only). Uses Floating UI for positioning by default.

**Basic structure:**
```svelte
<LinkPreview.Root>
  <LinkPreview.Trigger href="..." />
  <LinkPreview.Content><!-- preview content --></LinkPreview.Content>
</LinkPreview.Root>
```

**State management:** `bind:open` for two-way binding or function binding for full control.

**Positioning:** `LinkPreview.Content` uses Floating UI; use `LinkPreview.ContentStatic` for manual positioning. Anchor to different element with `customAnchor` prop.

**Animations:** Use `forceMount` with `child` snippet for Svelte transitions.

**Key props:** `openDelay` (700ms), `closeDelay` (300ms), `side`, `sideOffset`, `align`, `trapFocus`, `preventScroll`

### menubar
Horizontal menu bar component with support for checkboxes, radio buttons, nested submenus, and state management.

## Menubar

Horizontal bar with multiple dropdown menus. Each menu can contain items, checkboxes, radio buttons, and nested submenus.

**Checkbox items:**
```svelte
<Menubar.CheckboxGroup bind:value={colors}>
  <Menubar.CheckboxItem value="red">Red</Menubar.CheckboxItem>
</Menubar.CheckboxGroup>
```

**Radio items:**
```svelte
<Menubar.RadioGroup bind:value={selected}>
  <Menubar.RadioItem value="table">Table</Menubar.RadioItem>
</Menubar.RadioGroup>
```

**Nested menus:**
```svelte
<Menubar.Sub>
  <Menubar.SubTrigger>Find</Menubar.SubTrigger>
  <Menubar.SubContent>
    <Menubar.Item>Search</Menubar.Item>
  </Menubar.SubContent>
</Menubar.Sub>
```

**Control active menu:**
```svelte
<Menubar.Root bind:value={activeValue}>
  <Menubar.Menu value="menu-1">...</Menubar.Menu>
</Menubar.Root>
```

### meter
Component for displaying static measurements within a known range with real-time value fluctuation.

## Meter Component

Static measurement display within a known range. Value fluctuates based on real-time measurements (CPU, battery, volume).

**Basic Usage:**
```svelte
<Meter.Root value={2000} min={0} max={4000} aria-labelledby={labelId} aria-valuetext="2000 out of 4000">
  <div style="transform: translateX(-{100 - (100 * value) / max}%)"></div>
</Meter.Root>
```

**Props:** `value`, `min` (default 0), `max` (default 100), `ref`, `children`, `child`

**Accessibility:** Use `aria-labelledby` for visual labels or `aria-label` for text description. Set `aria-valuetext` for user-friendly value representation.

### navigation_menu
Hierarchical navigation menu component with support for dropdowns, submenus, animations, and flexible layouts.

## Components

Root, List, Item, Trigger, Content, Link, Viewport, Indicator, Sub

## Key Props

- **Root**: `orientation` ('horizontal'|'vertical'), `delayDuration` (200ms), `skipDelayDuration` (300ms), `value` (bindable)
- **Item**: `openOnHover` (default true)
- **Content**: `forceMount`, `onInteractOutside`, `onFocusOutside`, `onEscapeKeydown`
- **Viewport/Indicator**: `forceMount`

## Usage

Vertical: `<NavigationMenu.Root orientation="vertical">`

Submenus: Nest `NavigationMenu.Sub` inside Content

Click-to-open: `<NavigationMenu.Item openOnHover={false}>`

Force mount for SEO: `<NavigationMenu.Content forceMount>` with `data-state` for visibility control

Animations: Use `data-motion` ('from-start'|'from-end'|'to-start'|'to-end') on Content and CSS variables on Viewport

### pagination
Pagination component for navigating through pages with customizable state management and keyboard navigation support.

## Pagination Component

Navigate through pages with `Pagination.Root`, `Pagination.Page`, `Pagination.PrevButton`, and `Pagination.NextButton`.

**Basic example:**
```svelte
<Pagination.Root count={100} perPage={10}>
  {#snippet children({ pages, range })}
    <Pagination.PrevButton><CaretLeft /></Pagination.PrevButton>
    {#each pages as page (page.key)}
      {#if page.type === "ellipsis"}
        <div>...</div>
      {:else}
        <Pagination.Page {page}>{page.value}</Pagination.Page>
      {/if}
    {/each}
    <Pagination.NextButton><CaretRight /></Pagination.NextButton>
    <p>Showing {range.start} - {range.end}</p>
  {/snippet}
</Pagination.Root>
```

**State management:**
- Two-way binding: `bind:page={myPage}`
- Fully controlled: `bind:page={getPage, setPage}` with function bindings

**Key props:**
- `count`: Total items (required)
- `perPage`: Items per page (default: 1)
- `siblingCount`: Page buttons around current (default: 1)
- `loop`: Wrap around at end (default: false)
- `orientation`: 'horizontal' or 'vertical' (default: 'horizontal')

### pin_input
Customizable PIN/OTP input component with invisible input for form submission, autofill support, and flexible validation patterns.

## PIN Input Component

Customizable OTP/2FA/MFA input component with invisible input technique for form integration and autofill support.

### Basic Usage
```svelte
<PinInput.Root maxlength={6} bind:value={myValue}>
  {#snippet children({ cells })}
    {#each cells as cell}
      <PinInput.Cell {cell} />
    {/each}
  {/snippet}
</PinInput.Root>
```

### Key Props
- `value` (bindable) - input value
- `maxlength` (default: 6)
- `onComplete` - callback when filled
- `pattern` - restrict input (REGEXP_ONLY_DIGITS, REGEXP_ONLY_CHARS, REGEXP_ONLY_DIGITS_AND_CHARS)
- `pasteTransformer` - sanitize pasted text
- `name` - for HTML form submission
- `disabled` (default: false)

### Form Integration
```svelte
<form method="POST" bind:this={form}>
  <PinInput.Root name="mfaCode" onComplete={() => form.submit()}>
</form>
```

### Data Attributes
- `data-pin-input-root` - root element
- `data-active` / `data-inactive` - cell states
- `data-pin-input-cell` - cell element

### popover_component
Floating panel component with configurable positioning, focus management, interaction handling, and animation support.

## Popover Component

Floating panel anchored to trigger element.

**State**: `bind:open={isOpen}` or fully controlled with function bindings

**Focus**: Trap enabled by default; customize with `onOpenAutoFocus`/`onCloseAutoFocus`

**Interactions**: 
- Escape closes by default → `escapeKeydownBehavior="ignore"`
- Outside click closes → `interactOutsideBehavior="ignore"`
- Scroll locked with `preventScroll={true}`

**Positioning**: 
- `side` ('top'|'bottom'|'left'|'right'), `align` ('start'|'center'|'end')
- `sideOffset`, `alignOffset` for spacing
- `customAnchor` to anchor to different element
- Collision avoidance enabled by default

**Animations**: Use `forceMount` with child snippet for Svelte transitions

**Overlay**: Optional `Popover.Overlay` for backdrop

### progress
Progress component for displaying task completion status with configurable min/max values and indeterminate state support.

## Progress Component

Shows task completion status (value only increases).

**Basic Usage:**
```svelte
<Progress.Root value={50} max={100} />
```

**Props:** `max` (default 100), `min` (default 0), `value` (null = indeterminate), `ref`, `children`, `child`

**Data Attributes:** `data-value`, `data-state` ('indeterminate'|'determinate'), `data-min`, `data-max`, `data-indeterminate`, `data-progress-root`

**Accessibility:** Use `aria-labelledby` with visual label or `aria-label` without one.

**vs Meter:** Progress tracks completion; Meter shows static measurements that fluctuate.

### radio_group
A form component that groups radio items with configurable state management, keyboard navigation, and accessibility features.

## Radio Group
Groups radio items for form submission with state management and keyboard navigation.

## Basic Usage
```svelte
<RadioGroup.Root bind:value={myValue}>
  <RadioGroup.Item value="option1">
    {#snippet children({ checked })}
      {#if checked}✅{/if}
    {/snippet}
  </RadioGroup.Item>
</RadioGroup.Root>
```

## Key Features
- **State**: Two-way binding with `bind:value` or fully controlled with function bindings
- **Form integration**: Set `name` prop for hidden input submission, `required` for validation
- **Reusable component**: Wrap with Label and accept items array for custom components
- **Configuration**: `disabled`, `readonly`, `orientation` ('vertical'/'horizontal'), `loop`
- **Keyboard nav**: ArrowUp/Down for vertical, ArrowLeft/Right for horizontal

## API
**Root**: value, onValueChange, disabled, required, name, loop, orientation, readonly, ref
**Item**: value (required), disabled, ref
**Data attributes**: data-state, data-disabled, data-readonly, data-orientation, data-value

### range-calendar
Calendar component for selecting date ranges with constraints, date disabling, and customizable formatting.

## RangeCalendar

Calendar component for date range selection with min/max constraints, date disabling, and multi-month display.

**Key Props**: `value` (bindable), `minDays`, `maxDays`, `excludeDisabled`, `isDateDisabled()`, `numberOfMonths`, `pagedNavigation`

**Components**: Root, Header, Heading, Grid, Cell, Day, PrevButton, NextButton, MonthSelect, YearSelect

**Selection States**: `data-selected`, `data-range-start`, `data-range-end`, `data-range-middle`, `data-highlighted`

**Example - Min/Max Range**:
```svelte
<RangeCalendar.Root minDays={3} maxDays={10} bind:value>
  {#snippet children({ months, weekdays })}
    <!-- render calendar -->
  {/snippet}
</RangeCalendar.Root>
```

**Example - Exclude Weekends**:
```svelte
<RangeCalendar.Root excludeDisabled isDateDisabled={(date) => isWeekend(date, "en-US")} bind:value>
  {#snippet children({ months, weekdays })}
    <!-- render calendar -->
  {/snippet}
</RangeCalendar.Root>
```

### rating-group
A customizable rating component supporting half-ratings, form integration, keyboard navigation, and full accessibility with slider pattern ARIA implementation.

## RatingGroup Component

Customizable rating component with stars or custom items.

### Basic Usage
```svelte
<RatingGroup.Root bind:value max={5}>
  {#snippet children({ items })}
    {#each items as item (item.index)}
      <RatingGroup.Item index={item.index}>
        {#if item.state === "active"}⭐{:else}☆{/if}
      </RatingGroup.Item>
    {/each}
  {/snippet}
</RatingGroup.Root>
```

### Key Features
- **State**: Two-way binding with `bind:value` or fully controlled with function bindings
- **Half ratings**: `allowHalf` prop enables 3.5-star ratings
- **Modes**: `readonly`, `disabled`, `hoverPreview` control
- **Range**: `min`/`max` props (defaults 0-5)
- **Forms**: `name` and `required` props for form submission
- **RTL**: Automatic support with reversed navigation
- **Keyboard**: Number input, arrow keys, Home/End navigation
- **Accessibility**: Slider pattern with full ARIA support, customizable `aria-valuetext`

### scroll-area
ScrollArea component with configurable scroll behavior types and customizable hide delays for cross-platform consistent scrolling.

## ScrollArea

Customizable scroll area with four types: **hover** (default, shows on hover), **scroll** (MacOS-like), **auto** (always visible when needed), **always** (always visible).

```svelte
<ScrollArea.Root type="hover" scrollHideDelay={600}>
  <ScrollArea.Viewport>Content</ScrollArea.Viewport>
  <ScrollArea.Scrollbar orientation="vertical"><ScrollArea.Thumb /></ScrollArea.Scrollbar>
  <ScrollArea.Scrollbar orientation="horizontal"><ScrollArea.Thumb /></ScrollArea.Scrollbar>
  <ScrollArea.Corner />
</ScrollArea.Root>
```

Key props: `type`, `scrollHideDelay`, `dir`, `orientation`. Use data attributes like `data-state`, `data-scroll-area-scrollbar-x/y` for styling.

### select
Dropdown select component supporting single/multiple selection with typeahead, keyboard navigation, customizable positioning, and scroll management.

## Select Component

Dropdown for single or multiple selection with typeahead, keyboard navigation, and accessibility.

### State Management
```svelte
<script>
  let value = $state("");
</script>
<Select.Root type="single" bind:value>
  <!-- ... -->
</Select.Root>
```

### Multiple Selection
```svelte
<script>
  let value = $state<string[]>([]);
</script>
<Select.Root type="multiple" bind:value>
  <!-- ... -->
</Select.Root>
```

### Positioning
- **Floating UI** (default): `Select.Content` with `side`, `sideOffset`, `align`, `alignOffset`
- **Static**: `Select.ContentStatic` for manual positioning
- **Custom anchor**: `customAnchor` prop

### Scroll Buttons
```svelte
<Select.Viewport>
  {#each items as item}
    <Select.Item value={item.value}>{item.label}</Select.Item>
  {/each}
</Select.Viewport>
<Select.ScrollUpButton delay={tick => 50} />
<Select.ScrollDownButton delay={tick => 50} />
```

### Animations with Transitions
```svelte
<Select.Content forceMount>
  {#snippet child({ wrapperProps, props, open })}
    {#if open}
      <div {...wrapperProps}>
        <div {...props} transition:fly><!-- content --></div>
      </div>
    {/if}
  {/snippet}
</Select.Content>
```

### Reusable Wrapper
Create wrapper component to avoid repeating structure with `Select.Root`, `Select.Trigger`, `Select.Portal`, `Select.Content`, `Select.Viewport`, and `Select.Item` components.

### separator
Headless separator component for visually dividing content with horizontal or vertical orientation.

## Separator

Headless component for separating content.

```svelte
import { Separator } from "bits-ui";

<!-- Horizontal (default) -->
<Separator.Root class="h-px w-full" />

<!-- Vertical -->
<Separator.Root orientation="vertical" class="w-[1px] h-full" />
```

**Props**: `orientation` ('horizontal' | 'vertical'), `decorative` (boolean), `ref` (bindable HTMLDivElement)

**Data Attributes**: `data-orientation`, `data-separator-root`

### slider
Slider component for selecting single or multiple values from a range with support for discrete steps, custom labels, and vertical orientation.

## Slider

Continuous/discrete range selector with single or multiple thumbs, vertical orientation, and custom labels.

### Basic Single Slider
```svelte
<script lang="ts">
  import { Slider } from "bits-ui";
  let value = $state(50);
</script>

<Slider.Root type="single" bind:value>
  <span class="track"><Slider.Range /></span>
  <Slider.Thumb index={0} />
</Slider.Root>
```

### Multiple Thumbs
```svelte
<script lang="ts">
  let value = $state([25, 75]);
</script>

<Slider.Root type="multiple" bind:value>
  {#snippet children({ thumbItems })}
    <Slider.Range />
    {#each thumbItems as { index }}
      <Slider.Thumb {index} />
    {/each}
  {/snippet}
</Slider.Root>
```

### Discrete Steps & Labels
```svelte
<Slider.Root type="single" step={[0, 4, 8, 16, 24]} bind:value>
  {#snippet children({ tickItems })}
    {#each tickItems as { index, value } (index)}
      <Slider.Tick {index} />
      <Slider.TickLabel {index}>{value}</Slider.TickLabel>
    {/each}
  {/snippet}
</Slider.Root>
```

### Thumb Labels
```svelte
<Slider.Root type="multiple" value={[10, 50]}>
  <Slider.Range />
  <Slider.Thumb index={0} />
  <Slider.ThumbLabel index={0}>Min</Slider.ThumbLabel>
  <Slider.Thumb index={1} />
  <Slider.ThumbLabel index={1}>Max</Slider.ThumbLabel>
</Slider.Root>
```

### Key Props
- `type`: 'single' | 'multiple' (required)
- `value`: number | number[] (bindable)
- `min`, `max`: bounds (0-100 default)
- `step`: number | number[] for discrete snapping
- `orientation`: 'horizontal' | 'vertical'
- `onValueChange`, `onValueCommit`: callbacks
- `autoSort`: auto-sort multiple values (true default)
- `disabled`, `dir`, `thumbPositioning`, `trackPadding`

### switch_component
Toggle switch component with state management, form integration, and accessibility features.

## Switch Component

Toggle control for on/off states with accessibility support.

**Basic usage:**
```svelte
<Switch.Root bind:checked={myChecked}>
  <Switch.Thumb />
</Switch.Root>
```

**Form submission:**
```svelte
<Switch.Root name="dnd" value="custom-value" required />
```

**Key props:** `checked`, `disabled`, `name`, `value`, `required`

**Data attributes:** `data-state` ('checked'|'unchecked'), `data-checked`, `data-disabled`

### tabs
Tabbed interface component with configurable keyboard navigation, activation modes, and state management.

## Tabs Component

Organizes content into tabbed sections.

```svelte
<Tabs.Root bind:value={activeTab}>
  <Tabs.List>
    <Tabs.Trigger value="tab-1">Tab 1</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="tab-1">Content</Tabs.Content>
</Tabs.Root>
```

**Key props:**
- `orientation`: `'horizontal'` | `'vertical'` - controls keyboard navigation
- `activationMode`: `'automatic'` | `'manual'` - focus vs press to activate
- `disabled`, `loop` - disable tabs or wrap keyboard navigation

### timefield_component
Customizable time input component with segment-based editing, validation, and support for multiple time value types.

## TimeField Component

Customizable time input with segment-based editing (hour, minute, second, dayPeriod).

**Basic usage**:
```svelte
<TimeField.Root bind:value={myTime}>
  <TimeField.Label>Time</TimeField.Label>
  <TimeField.Input>
    {#snippet children({ segments })}
      {#each segments as { part, value }}
        <TimeField.Segment {part}>{value}</TimeField.Segment>
      {/each}
    {/snippet}
  </TimeField.Input>
</TimeField.Root>
```

**Key props**: `value`, `placeholder`, `granularity` ('hour'|'minute'|'second'), `locale`, `minValue`, `maxValue`, `validate`, `onInvalid`, `hourCycle`, `hideTimeZone`, `disabled`, `readonly`, `readonlySegments`

**Validation**: Use `minValue`/`maxValue` for bounds or `validate` function for custom rules. `onInvalid` callback receives reason ('min'|'max'|'custom') and message.

**State**: Use `bind:value` for two-way binding or function bindings for full control. Parse ISO strings with `parseDateTime()` or `parseZonedDateTime()`.

**Segments**: Render different styles for "literal" (separators) vs editable parts. `granularity` controls which segments appear.

### timerangefield
API reference for TimeRangeField component that combines two time inputs for selecting start and end times with validation and state management options.

## TimeRangeField

Combines two Time Field components for start/end time input.

**Basic usage:**
```svelte
<TimeRangeField.Root bind:value={myValue}>
  <TimeRangeField.Label>Working Hours</TimeRangeField.Label>
  {#each ["start", "end"] as type}
    <TimeRangeField.Input {type}>
      {#snippet children({ segments })}
        {#each segments as { part, value }}
          <TimeRangeField.Segment {part}>{value}</TimeRangeField.Segment>
        {/each}
      {/snippet}
    </TimeRangeField.Input>
  {/each}
</TimeRangeField.Root>
```

**Key props:** `value` (TimeRange), `placeholder`, `minValue`/`maxValue`, `granularity` ('hour'|'minute'|'second'), `hourCycle` ('12'|'24'), `locale`, `hideTimeZone`, `disabled`, `readonly`, `required`, `readonlySegments`, `validate`, `onValueChange`, `onStartValueChange`, `onEndValueChange`

**Sub-components:** `Input` (requires `type: 'start'|'end'`), `Segment` (requires `part`), `Label`

### toggle
A toggle button component with bindable pressed state and support for controlled/uncontrolled state management.

## Toggle Component

A button that switches between pressed/unpressed states.

```svelte
<script lang="ts">
  import { Toggle } from "bits-ui";
  let pressed = $state(false);
</script>
<Toggle.Root bind:pressed={pressed} />
```

**State management:** Use `bind:pressed` for two-way binding, or function bindings `bind:pressed={getPressed, setPressed}` for full control.

**Key props:** `pressed`, `onPressedChange`, `disabled`, `ref`

**Data attributes:** `data-state` ('on'|'off'), `data-disabled`, `data-toggle-root`

### toggle-group
ToggleGroup component for grouping toggle controls with single or multiple selection modes.

## ToggleGroup

Groups toggle controls with single or multiple selection modes.

**Types:** `'single'` (string value) or `'multiple'` (string[] value)

**Basic usage:**
```svelte
<script lang="ts">
  let value = $state(["bold"]);
</script>
<ToggleGroup.Root bind:value type="multiple">
  <ToggleGroup.Item value="bold">bold</ToggleGroup.Item>
  <ToggleGroup.Item value="italic">italic</ToggleGroup.Item>
</ToggleGroup.Root>
```

**Key props:** `type` (required), `value` ($bindable), `onValueChange`, `disabled`, `orientation`, `loop`, `rovingFocus`

**Item props:** `value`, `disabled`

**Data attributes:** `data-state` ('on'|'off'), `data-orientation`, `data-disabled`

### toolbar
A toolbar component for displaying frequently used actions with support for single/multiple toggle groups and state management.

## Toolbar Component

Displays frequently used actions in a compact bar.

### Basic Structure
```svelte
<Toolbar.Root>
  <Toolbar.Group type="single" bind:value={myValue}>
    <Toolbar.GroupItem value="item-1" />
  </Toolbar.Group>
  <Toolbar.Button />
  <Toolbar.Link />
</Toolbar.Root>
```

### Key Props
- **Toolbar.Root**: `loop`, `orientation` ('horizontal' | 'vertical')
- **Toolbar.Group**: `type` ('single' | 'multiple'), `value` $bindable, `onValueChange`
- **Toolbar.GroupItem**: `value` required, `disabled`
- **Toolbar.Button/Link**: `disabled`, `ref` $bindable

### State Management
Use `bind:value` for two-way binding or function bindings for full control over reads/writes.

### tooltip
Accessible tooltip component with hover/focus triggers, configurable delays, Floating UI positioning, and support for Svelte transitions.

## Structure
```svelte
<Tooltip.Provider>
  <Tooltip.Root>
    <Tooltip.Trigger />
    <Tooltip.Portal>
      <Tooltip.Content>
        <Tooltip.Arrow />
      </Tooltip.Content>
    </Tooltip.Portal>
  </Tooltip.Root>
</Tooltip.Provider>
```

## Key Features
- `Tooltip.Provider` required as ancestor; ensures only one tooltip open at a time
- State management: `bind:open` or function bindings
- Not supported on mobile (no hover state)
- Default delay: 700ms

## Configuration
- `delayDuration`: Delay before showing (default: 700ms)
- `disableCloseOnTriggerClick`: Keep open on click
- `disableHoverableContent`: Close when moving toward content
- `ignoreNonKeyboardFocus`: Ignore non-keyboard focus

## Advanced
- Use `forceMount` with child snippet for Svelte transitions
- `Tooltip.ContentStatic` for manual positioning (no Floating UI)
- `customAnchor` to anchor to different element
- `Tooltip.Portal` to render into body or custom element

