A comprehensive collection of 50+ headless UI components for Svelte, each with compound sub-component architecture, flexible state management (two-way binding or fully controlled via function binding), keyboard navigation, ARIA accessibility, and extensive customization via data attributes and CSS variables.

**Core Patterns:**
- State: `bind:value={state}` or `bind:value={getter, setter}` for full control
- Composition: Root manages state/context, sub-components (Trigger, Content, Item, etc.) handle rendering
- Styling: Data attributes (`data-state`, `data-disabled`, etc.) and CSS variables for animations
- Transitions: `forceMount` prop + `child` snippet for Svelte transitions

**Components by Category:**

**Disclosure/Expansion:** Accordion (single/multiple, keyboard nav, browser search via `hiddenUntilFound`), Collapsible (open/closed state, transitions), Tabs (horizontal/vertical, automatic/manual activation)

**Dialogs/Popovers:** AlertDialog, Dialog, Popover (all with focus trap, escape/outside-click handling, nested support), LinkPreview (hover-triggered, 700ms delay), Tooltip (Provider wrapper required, non-essential content only)

**Dropdowns/Menus:** DropdownMenu, ContextMenu, Combobox (searchable with typeahead), Command (filterable with custom scoring), Select (single/multiple with scroll buttons), NavigationMenu (hierarchical with Viewport for smooth transitions)

**Forms:** Checkbox (tri-state: checked/unchecked/indeterminate, groups), RadioGroup, Switch, Toggle, ToggleGroup (single/multiple), RatingGroup (stars with half-ratings, keyboard: direct number input, arrows, Home/End), PinInput (OTP/2FA with invisible input, paste transformation, patterns)

**Date/Time:** Calendar (single/multiple selection, min/max/disabled/unavailable dates, multiple months, month/year selectors), DateField (segment-based: day/month/year/hour/minute/second), DatePicker (Calendar + DateField + Popover), DateRangeField, DateRangePicker (with minDays/maxDays constraints), RangeCalendar, TimeField, TimeRangeField

**Data Display:** Progress (task completion, indeterminate state), Meter (static measurement in range), Pagination (pages/ellipsis, prev/next buttons, configurable siblings), ScrollArea (hover/scroll/auto/always visibility, customizable hide delay)

**Layout:** AspectRatio (maintains ratio), Separator (horizontal/vertical, decorative flag), Label (form association)

**Input Ranges:** Slider (single/multiple thumbs, vertical/horizontal, discrete steps, ticks, labels, RTL support)

**Buttons:** Button (renders as button or anchor via href prop)

**Utilities:** Avatar (image + fallback with loading states, delayMs), Menubar (horizontal menu bar with nested submenus, radio/checkbox items)

**Key Features Across All:**
- Keyboard navigation (arrows, Enter, Escape, Tab)
- Screen reader support (ARIA roles, labels, descriptions)
- Portal rendering to prevent layout issues
- Floating UI positioning (with static alternatives)
- Form integration (hidden inputs, name/required/disabled props)
- RTL support via `dir` prop
- Reusable component patterns via `WithoutChild`/`WithoutChildrenOrChild` types
- Snippet-based rendering for maximum flexibility

**Common Props:**
- `ref` ($bindable): DOM element reference
- `disabled`, `readonly`: interaction control
- `children`/`child`: Snippet for content/render delegation
- `onValueChange`, `onOpenChange`: callbacks
- `forceMount`: keep in DOM for transitions
- `trapFocus`, `preventScroll`: focus/scroll management
- `escapeKeydownBehavior`, `interactOutsideBehavior`: customizable close triggers

**Data Attributes for Styling:**
- `data-state`: 'open'/'closed', 'checked'/'unchecked', 'active'/'inactive'
- `data-disabled`, `data-readonly`, `data-selected`, `data-highlighted`
- `data-orientation`: 'horizontal'/'vertical'
- Component-specific: `data-value`, `data-range-start`, `data-range-end`, `data-today`, `data-outside-month`

**CSS Variables for Animations:**
- `--bits-[component]-content-height/width`: for auto-sizing
- `--bits-[component]-content-transform-origin`: for Floating UI
- `--bits-[component]-content-available-width/height`: viewport constraints
- `--bits-[component]-anchor-width/height`: trigger dimensions
- `--bits-dialog-depth`, `--bits-dialog-nested-count`: for nested dialogs