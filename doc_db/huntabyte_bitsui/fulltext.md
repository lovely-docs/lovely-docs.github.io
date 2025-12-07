
## Directories

### components
Comprehensive headless component library for Svelte with flexible state management, keyboard navigation, accessibility, and customizable styling.

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

### policies
Contribution guidelines for changelog entries and issue/discussion management

## Changelog Entry Format

All changelog entries follow the structure: `- <type>(<scope>): <description>`

**Types:**
- `fix`: Resolves a bug or issue
- `feat`: Adds a new feature or enhancement (Minor or Major release)
- `improve`: Enhances existing functionality without fixing a bug
- `chore`: Internal refactors, cleanups, or tooling changes with no user-facing impact
- `docs`: Changes to documentation in the codebase (JSdoc comments); documentation site changes don't require entries

**Scope:** Use component name (e.g., `Select`, `Tooltip`, `Calendar`) for component-specific changes, general terms (e.g., `all`, `SSR`) for multi-component changes, or omit for truly global changes.

**Description:** Concise, lowercase phrase starting with a verb where possible. Use backticks for code (prop names, types, values). Target 10-15 words max.

Examples:
- `fix(Select.Trigger): improve accessibility for screen readers and keyboard navigation`
- `fix(Calendar): prevent outside days from being focusable when `disableOutsideDays` is `true``
- `chore(Menubar.Content): simplify internal implementation for maintainability`

## Issues vs Discussions Policy

**Issues** are for reproducible bugs with clear steps, error messages, screenshots, and expected vs actual behavior; confirmed problems; and accepted feature requests that have been discussed, refined, and approved.

**Discussions** are for feature requests (starting point), design discussions, questions, brainstorming, and RFCs.

**Feature Request Workflow:**
1. Start a Discussion describing the feature, benefits, and potential challenges
2. Gather feedback and refine based on community input
3. If consensus is reached and deemed valuable, maintainer determines next steps
4. Once accepted for implementation, create an Issue to track progress

If a feature request is opened as an Issue, the maintainer converts it to a Discussion (if not yet accepted), explains the move with a comment, and closes the original issue to keep the tracker clean. This keeps the issue tracker focused on real bugs and planned features, avoids clutter, enables clear prioritization, and maintains a clean backlog.

### type_helpers
Type utilities for managing component props when creating custom wrappers and adding ref support.

## Type Helpers for Component Props

Utility types for customizing component prop types when building wrappers and custom components.

### WithElementRef
Adds an optional `ref` prop to component types for accessing underlying HTML elements.

```ts
type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & {
  ref?: U | null;
};
```

Generic parameters: `T` (component props), `U` (HTML element type, defaults to `HTMLElement`).

Usage: Apply to your component's props type, then bind the ref to your element with `bind:this={ref}`.

### WithoutChild
Excludes the `child` snippet prop from component types. Use when building wrappers that populate children internally and don't expose a custom `child` snippet.

```ts
let { children, ...restProps }: WithoutChild<Accordion.ItemProps> = $props();
```

### WithoutChildren
Excludes the `children` snippet prop from component types. Use when building wrappers that manage the `children` prop internally.

```ts
let { value, onValueChange, ...restProps }: WithoutChildren<Accordion.RootProps> = $props();
```

### WithoutChildrenOrChild
Excludes both `child` and `children` props from component types. Use when building wrappers that internally populate children and don't expose either prop to users.

```ts
let { title, ...restProps }: WithoutChildrenOrChild<Accordion.TriggerProps & { title: string }> = $props();
```

All helpers prevent consumers from passing props that will be ignored or overridden by the wrapper's internal structure.

### utilities
Helper utilities for configuration, state tracking, props merging, DOM portalling, and ID generation.

## BitsConfig
Global context provider for setting default props across all components within its scope. Supports scoped defaults with inheritance and component-level overrides.

**Key features:**
- Scoped defaults apply only to components within scope
- Child configs inherit parent values and can override them
- Value resolution order: direct component prop → nearest parent BitsConfig → inherited from parent BitsConfig(s) → built-in component default

**Properties:**
- `defaultPortalTo` (Element | string): Where to render content when open, defaults to document.body
- `defaultLocale` (string): Default locale for the app, defaults to "en"
- `children` (Snippet): Children content to render

**Example:**
```svelte
<BitsConfig defaultPortalTo="#main-portal" defaultLocale="de">
  <Dialog.Root>
    <Dialog.Portal>
      <Dialog.Content>Main dialog</Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
  <BitsConfig defaultPortalTo="#tooltip-portal">
    <Tooltip.Root>
      <Tooltip.Trigger>Hover me</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content>Tooltip content</Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
    <Dialog.Root>
      <Dialog.Portal>
        <Dialog.Content>Nested dialog (inherits "de" locale)</Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  </BitsConfig>
</BitsConfig>
```

Individual components override global defaults via direct props (e.g., `<Dialog.Portal to="#special-portal">`).

## IsUsingKeyboard
Utility component that tracks whether the user is actively using the keyboard via global shared state. Prevents duplicate event listener registration across instances.

**Usage:**
```svelte
import { IsUsingKeyboard } from "bits-ui";
const isUsingKeyboard = new IsUsingKeyboard();
const shouldShowMenu = $derived(isUsingKeyboard.current);
```

Access current keyboard usage state via the `current` property.

## mergeProps
Utility function to merge multiple props objects with event handler chaining, class name combining, and style merging.

**Key features:**
- Chains event handlers in order; if a handler calls `event.preventDefault()`, subsequent handlers are not executed
- Non-event handler functions are chained without cancellation ability
- Class names merged using clsx
- Style objects and strings merged with later properties overriding earlier ones

**Examples:**
```ts
// Event handlers with preventDefault
const props1 = { onclick: (e) => console.log("First") };
const props2 = { onclick: (e) => { console.log("Second"); e.preventDefault(); } };
const props3 = { onclick: (e) => console.log("Third") };
const merged = mergeProps(props1, props2, props3);
merged.onclick(new MouseEvent("click")); // Logs: "First" then "Second" only

// Classes
const merged = mergeProps(
  { class: "text-lg font-bold" },
  { class: ["bg-blue-500", "hover:bg-blue-600"] }
);
// Result: "text-lg font-bold bg-blue-500 hover:bg-blue-600"

// Styles
const merged = mergeProps(
  { style: { color: "red", fontSize: "16px" } },
  { style: "background-color: blue; font-weight: bold;" }
);
// Result: "color: red; font-size: 16px; background-color: blue; font-weight: bold;"
```

## Portal
Utility component that renders children to a specified DOM location (body by default).

**Properties:**
- `to` (Element | string): Where to render content, defaults to document.body
- `disabled` (boolean): When true, renders content in original DOM location, default false
- `children` (Snippet): Content to render

**Usage:**
```svelte
<Portal>
  <div>Portalled to body</div>
</Portal>

<Portal to="#custom-target">
  <div>Portalled to #custom-target</div>
</Portal>

<Portal disabled>
  <div>Not portalled</div>
</Portal>
```

Default target can be changed via BitsConfig's `defaultPortalTo` prop.

## useId
Utility function to generate unique IDs for element association, used internally by all components and exposed for public use.

**Usage:**
```svelte
import { useId } from "bits-ui";
const id = useId();
```

Apply to elements:
```svelte
<label for={id}>Label here</label>
<input {id} />
```

Returns a unique identifier string suitable for associating form labels with inputs and other elements requiring unique identifiers.



## Pages

### child-snippet
Child snippet enables custom element rendering in Bits UI components with full prop merging, Svelte feature support, and special two-level structure for floating components.

## Child Snippet

The `child` snippet provides complete control over rendered elements in Bits UI components while maintaining accessibility and functionality.

### When to Use
- Need Svelte features (transitions, animations, actions, scoped styles)
- Custom component integration
- Precise DOM structure control
- Advanced component composition

### Basic Usage

Components like `Accordion.Trigger` render default elements (e.g., `<button>`). Override with the `child` snippet:

```svelte
<script lang="ts">
  import MyCustomButton from "$lib/components";
  import { Accordion } from "bits-ui";
</script>

<Accordion.Trigger>
  {#snippet child({ props })}
    <MyCustomButton {...props}>Toggle Item</MyCustomButton>
  {/snippet}
</Accordion.Trigger>

<!-- or with scoped styles -->
<Accordion.Trigger>
  {#snippet child({ props })}
    <button {...props} class="scoped-button">Toggle Item</button>
  {/snippet}
</Accordion.Trigger>

<style>
  .scoped-button {
    background-color: #3182ce;
    color: #fff;
  }
</style>
```

The `props` parameter contains all necessary attributes and event handlers. Spread `{...props}` onto your custom element.

### How It Works

Components supporting `child` snippet:
1. Pass internal props and user props via the `props` snippet parameter
2. You decide which element receives these props
3. Component's internal logic continues working

Internal implementation pattern:
```svelte
<script lang="ts">
  let { child, children, ...restProps } = $props();
  const trigger = makeTrigger();
  const mergedProps = $derived(mergeProps(restProps, trigger.props));
</script>

{#if child}
  {@render child({ props: mergedProps })}
{:else}
  <button {...mergedProps}>
    {@render children?.()}
  </button>
{/if}
```

### Working with Props

Pass custom IDs, attributes, and event handlers to the component; they merge into `props`:

```svelte
<Accordion.Trigger
  id="my-custom-id"
  data-testid="accordion-trigger"
  onclick={() => console.log("clicked")}
>
  {#snippet child({ props })}
    <button {...props}>Open accordion item</button>
  {/snippet}
</Accordion.Trigger>
```

The `props` object includes custom ID, data attributes, click handler (merged with internal handlers), and all required ARIA attributes.

### Svelte Features Integration

Apply transitions, actions, and scoped styles:

```svelte
<Accordion.Trigger>
  {#snippet child({ props })}
    <div {...props} use:myCustomAction class="my-custom-trigger">
      <!-- ... -->
    </div>
  {/snippet}
</Accordion.Trigger>

<style>
  .my-custom-trigger {
    background-color: #3182ce;
    color: #fff;
  }
</style>
```

### Floating Components

Floating content (tooltips, popovers, dropdowns) requires two-level structure:

```svelte
<Popover.Content>
  {#snippet child({ wrapperProps, props, open })}
    {#if open}
      <div {...wrapperProps}>
        <div {...props}>
          <!-- content -->
        </div>
      </div>
    {/if}
  {/snippet}
</Popover.Content>
```

**Rules:**
- Outer wrapper with `{...wrapperProps}` must be unstyled (handles positioning)
- Style the inner content element
- Use `open` parameter for conditional rendering and transitions
- Maintain two-level structure for proper positioning

**Components requiring wrapper:** `Combobox.Content`, `DatePicker.Content`, `DateRangePicker.Content`, `DropdownMenu.Content`, `LinkPreview.Content`, `Menubar.Content`, `Popover.Content`, `Select.Content`, `Tooltip.Content`

### Examples

Basic custom element:
```svelte
<Collapsible.Trigger>
  {#snippet child({ props })}
    <button {...props}>
      <Icon name="star" />
      <span>Favorite</span>
    </button>
  {/snippet}
</Collapsible.Trigger>
```

With Svelte transitions:
```svelte
<Dialog.Content>
  {#snippet child({ props, open })}
    {#if open}
      <div {...props} transition:scale={{ start: 0.95 }}>
        Dialog content with a scale transition
      </div>
    {/if}
  {/snippet}
</Dialog.Content>
```

Floating element:
```svelte
<Tooltip.Content>
  {#snippet child({ wrapperProps, props, open })}
    {#if open}
      <div {...wrapperProps}>
        <div {...props} transition:fade>Custom tooltip content</div>
      </div>
    {/if}
  {/snippet}
</Tooltip.Content>
```

### Common Pitfalls
- Missing `{...props}` spread on custom element
- Styling wrapper element in floating components (breaks positioning)
- Other children outside snippet are ignored when using child
- Forgetting two-level structure for floating elements

### dates-and-times
DateValue types (CalendarDate, CalendarDateTime, ZonedDateTime) from @internationalized/date for locale/timezone-aware date handling; immutable with .set/.add/.subtract/.cycle methods; 1-indexed months; DateFormatter for formatting; placeholder prop for initial values and calendar navigation.

## Overview
Bits UI uses `DateValue` objects from `@internationalized/date` package for consistent date/time handling across locales and timezones.

## Installation
```bash
npm install @internationalized/date
```

## DateValue Types
Three immutable types represent different date scenarios:

| Type | Purpose | Example |
|------|---------|---------|
| `CalendarDate` | Date only | `2024-07-10` |
| `CalendarDateTime` | Date + time | `2024-07-10T12:30:00` |
| `ZonedDateTime` | Date + time + timezone | `2024-07-10T21:00:00-04:00[America/New_York]` |

### Creating DateValues
```ts
import { CalendarDate, parseDate, today, getLocalTimeZone, CalendarDateTime, parseDateTime, ZonedDateTime, parseZonedDateTime, parseAbsolute, parseAbsoluteToLocal } from "@internationalized/date";

// CalendarDate
const date = new CalendarDate(2024, 7, 10);
const parsed = parseDate("2024-07-10");
const losAngelesToday = today("America/Los_Angeles");
const localToday = today(getLocalTimeZone());

// CalendarDateTime
const dateTime = new CalendarDateTime(2024, 7, 10, 12, 30, 0);
const parsedDT = parseDateTime("2024-07-10T12:30:00");

// ZonedDateTime
const zdt = new ZonedDateTime(2022, 2, 3, "America/Los_Angeles", -28800000, 9, 15, 0);
const zdt1 = parseZonedDateTime("2024-07-12T00:45[America/New_York]");
const zdt2 = parseAbsolute("2024-07-12T07:45:00Z", "America/New_York");
const zdt3 = parseAbsoluteToLocal("2024-07-12T07:45:00Z");
```

## DateRange Type
```ts
type DateRange = {
  start: DateValue;
  end: DateValue;
};
```
Used in Date Range Field, Date Range Picker, Range Calendar components.

## Placeholder Prop
Each date/time component has a bindable `placeholder` prop that:
1. Acts as initial date when no value selected
2. Determines date/time type to display if value absent
3. Controls visible date range in calendar views

```svelte
<script lang="ts">
  import { Calendar } from "bits-ui";
  import { today, getLocalTimeZone, type DateValue } from "@internationalized/date";
  
  let placeholder: DateValue = $state(today(getLocalTimeZone()));
  let selectedMonth: number = $state(placeholder.month);
</script>

<select onchange={() => { placeholder = placeholder.set({ month: selectedMonth }); }} bind:value={selectedMonth}>
  <option value={1}>January</option>
  <option value={2}>February</option>
</select>

<Calendar.Root bind:placeholder>
  <!-- Calendar components... -->
</Calendar.Root>
```

## Updating DateValues
Since immutable, use methods that return new instances:
```ts
let placeholder = new CalendarDate(2024, 7, 10);

// Using set()
placeholder = placeholder.set({ month: 8 });

// Using add()
placeholder = placeholder.add({ months: 1 });

// Using subtract()
placeholder = placeholder.subtract({ days: 5 });

// Using cycle()
placeholder = placeholder.cycle("month", "forward", [1, 3, 5, 7, 9, 11]);
```

## Formatting and Parsing
```ts
import { DateFormatter } from "@internationalized/date";

const formatter = new DateFormatter("en-US", {
  dateStyle: "full",
  timeStyle: "short",
});
const formattedDate = formatter.format(myDateValue.toDate("America/New_York"));
// Output: "Wednesday, July 10, 2024 at 12:30 PM"
```

## Key Points
- Month indexing is 1-based (January = 1), unlike JavaScript's Date
- Always reassign when modifying: `date = date.add({ days: 1 })`
- Use `ZonedDateTime` for schedule-critical events
- Match `placeholder` type to needs (use `CalendarDateTime` if time selection needed)
- Reuse `DateFormatter` instances for performance

### getting-started
Install with npm, import components, style via class props or data attributes, full TypeScript support.

## Installation
```bash
npm install bits-ui
```

## Basic Usage
Import and use components in Svelte files:
```svelte
<script lang="ts">
  import { Accordion } from "bits-ui";
</script>
<Accordion.Root type="single">
  <Accordion.Item value="item-1">
    <Accordion.Header>
      <Accordion.Trigger>Item 1 Title</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content>This is the collapsible content for this section.</Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-2">
    <Accordion.Header>
      <Accordion.Trigger>Item 2 Title</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content>This is the collapsible content for this section.</Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
```

## Styling
Bits UI components are headless with minimal styling. Use `class` and `style` props to apply styles.

### TailwindCSS/UnoCSS
Pass utility classes directly to components:
```svelte
<Accordion.Root class="mx-auto w-full max-w-md">
  <Accordion.Item class="mb-2 rounded-md border border-gray-200">
    <Accordion.Header class="bg-gray-50 transition-colors hover:bg-gray-100">
      <Accordion.Trigger class="flex w-full items-center justify-between p-4 text-left font-medium">
        <span>Tailwind-styled Accordion</span>
        <svg class="h-5 w-5 transform transition-transform" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content class="p-4 text-gray-700">This accordion is styled using Tailwind CSS classes.</Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
```

### Data Attributes
Components apply data attributes to HTML elements for CSS targeting. Check API Reference for each component's data attributes, then use in global styles:
```css
[data-button-root] {
  height: 3rem;
  width: 100%;
  background-color: #3182ce;
  color: white;
  border-radius: 0.375rem;
  padding: 0.5rem 1rem;
  font-weight: 500;
}
[data-button-root]:hover {
  background-color: #2c5282;
}
```

## TypeScript Support
Full type definitions and autocompletion provided:
```svelte
<script lang="ts">
  import { Accordion } from "bits-ui";
  const accordionMultipleProps: Accordion.RootProps = {
    type: "multiple",
    value: ["item-1"], // type error if value is not an array
  };
  const accordionSingleProps: Accordion.RootProps = {
    type: "single",
    value: "item-1", // type error if value is an array
  };
</script>
```

## Next Steps
- Explore Component Documentation for all available components
- Learn about render delegation using Child Snippet for maximum flexibility
- Learn about State Management and taking more control over components

## Resources
- Open issues on GitHub for confirmed bugs
- Join Discord community or open GitHub discussions for questions
- Open GitHub discussions in feature-requests-ideas category for feature requests

### introduction
Headless, unstyled Svelte components with TypeScript, WAI-ARIA accessibility, and full composability via render delegation and event overrides.

Bits UI is a headless component library for Svelte focused on developer experience, accessibility, and creative control.

**Key Features:**

- **Unstyled Components**: Most components ship completely unstyled except where required for core functionality. No CSS resets or design system assumptions. Styling via standard `class` props or `data-*` attributes.

- **Developer Experience**: Full TypeScript coverage, stable and predictable APIs, flexible event override system, great defaults that are easily overridden, comprehensive documentation and examples.

- **Accessibility**: WAI-ARIA compliance, keyboard navigation by default, focus management handled automatically, screen reader support built-in.

- **Composability**: Components are primitives, not black boxes. Features include render delegation for total flexibility, chainable events and callbacks, override-friendly defaults, and minimal dependencies.

**Community & Credits:**

Built and maintained by Hunter Johnston with design support from Pavel Stianko and his team at Bitworks Studio, and tooling support from Adrian Gonz. Inspired by Melt UI (internal architecture), Radix UI (API design), and React Spectrum (date/time components and accessibility patterns).

### migration-guide-v0-to-v1
v0→v1 breaking changes: el→ref, asChild→child snippet, let:→snippet props, transition props removed; multiple→required type prop; selected→value; indicator components→children snippet; auto-portalling→explicit Portal wrapper; Checkbox.Input removed; AlertDialog.Action no-close; Pin Input overhauled; Slider type prop+onValueCommit; Tooltip.Provider required.

## Overview
Bits UI v1 is a complete rewrite for Svelte 5 with breaking changes from v0.x. Key benefits include performance improvements, more flexible APIs, bug fixes, and better developer experience.

## Shared Changes Across All Components
- `el` prop → `ref` prop for HTML element references
- `asChild` prop → `child` snippet prop for component composition
- `transition` props removed → use `child` snippet with `forceMount` and Svelte transitions instead
- `let:` directives → `children`/`child` snippet props for exposing component data

## Component-Specific Changes

**Accordion**
- `multiple` prop removed → replaced with required `type` prop (`'single'` or `'multiple'`)
- `transition` props removed from `Accordion.Content`

**Alert Dialog**
- `transition` props removed from `AlertDialog.Content` and `AlertDialog.Overlay`
- Must wrap `AlertDialog.Content` in `AlertDialog.Portal` to render in portal
- `AlertDialog.Action` no longer closes dialog by default (use form submission pattern instead)

**Button**
- `builders` prop removed → use `child` snippet on components instead

**Checkbox**
- `Checkbox.Indicator` removed → use `children` snippet to access `checked` state
- `Checkbox.Input` removed → hidden input auto-renders when `name` prop provided to `Checkbox.Root`
- `checked` state type changed from `boolean | 'indeterminate'` to `boolean` (indeterminate is separate state via `indeterminate` prop)
- New `Checkbox.Group` component added

**Combobox**
- `multiple` prop removed → replaced with required `type` prop (`'single'` or `'multiple'`)
- `selected` prop → `value` prop (string or string[] if `type="multiple"`)
- Hidden input auto-renders when `name` prop provided
- `Combobox.ItemIndicator` removed → use `children` snippet to access `selected` state
- New `Combobox.Group` and `Combobox.GroupHeading` components added
- Auto-portalling removed → wrap `Combobox.Content` in `Combobox.Portal` (accepts `to` and `disabled` props)

**Context Menu / Dropdown Menu / Menubar Menu**
- `*Menu.RadioIndicator` and `*Menu.CheckboxIndicator` removed → use `children` snippet to access `checked`/`selected` state
- `*Menu.Label` → `*Menu.GroupHeading` for group headings
- `href` prop on `.Item` removed → use `child` snippet to render anchor element
- Auto-portalling removed → wrap `*Menu.Content` in `*Menu.Portal` (accepts `to` and `disabled` props)

**Pin Input**
- Completely overhauled to function as OTP input component (based on Input OTP library)
- Refer to documentation for migration details

**Popover**
- Auto-portalling removed → wrap `Popover.Content` in `Popover.Portal` (accepts `to` and `disabled` props)

**Radio Group**
- `RadioGroup.ItemIndicator` removed → use `children` snippet to access `checked` state

**Scroll Area**
- `ScrollArea.Content` removed (not necessary in v1)

**Select**
- `multiple` prop removed → replaced with required `type` prop (`'single'` or `'multiple'`)
- `selected` prop → `value` prop (string or string[] if `type="multiple"`)
- Hidden input auto-renders when `name` prop provided
- `Select.ItemIndicator` removed → use `children` snippet to access `selected` state
- `Select.Value` removed → use `value` prop to render custom label in trigger
- New `Select.Group` and `Select.GroupHeading` components added
- Auto-portalling removed → wrap `Select.Content` in `Select.Portal` (accepts `to` and `disabled` props)

**Slider**
- `Slider.Root` requires `type` prop (`'single'` or `'multiple'`)
- New `onValueCommit` callback fires when user commits value change (mouse release, Enter key), not on every movement

**Tooltip**
- New required `Tooltip.Provider` component replaces `group` prop from v0
- Wrap app or section with `Tooltip.Provider` to provide shared context

### ref-prop
Bindable ref prop accesses underlying HTML elements for DOM manipulation; works with child snippets via IDs; use WithElementRef helper for custom components.

## Ref Prop for DOM Access

The `ref` prop provides direct access to underlying HTML elements in Bits UI components for DOM manipulation like focusing inputs or measuring dimensions.

### Basic Usage

```svelte
<script lang="ts">
  import { Accordion } from "bits-ui";
  let triggerRef = $state<HTMLButtonElement | null>(null);
  function focusTrigger() {
    triggerRef?.focus();
  }
</script>
<button onclick={focusTrigger}>Focus trigger</button>
<Accordion.Trigger bind:ref={triggerRef}>Trigger content</Accordion.Trigger>
```

### With Child Snippet

Bits UI uses element IDs to track references. The `ref` binding works automatically with delegated child elements/components.

```svelte
<script lang="ts">
  import CustomButton from "./CustomButton.svelte";
  import { Accordion } from "bits-ui";
  let triggerRef = $state<HTMLButtonElement | null>(null);
</script>
<Accordion.Trigger bind:ref={triggerRef}>
  {#snippet child({ props })}
    <CustomButton {...props} />
  {/snippet}
</Accordion.Trigger>
```

When using custom IDs, pass them to the parent component first:

```svelte
<Accordion.Trigger bind:ref={triggerRef} id="my-custom-id">
  {#snippet child({ props })}
    <CustomButton {...props} />
  {/snippet}
</Accordion.Trigger>
```

**Pitfall**: Don't set `id` directly on the child element—set it on the parent component instead, otherwise the ref binding breaks.

### Null Behavior

The `ref` value may be `null` until the component mounts in the DOM, consistent with native DOM methods like `getElementById`.

### Creating Custom Ref Props

Use the `WithElementRef` type helper to implement the same pattern in custom components:

```svelte
<script lang="ts">
  import { WithElementRef } from "bits-ui";
  import type { HTMLButtonAttributes } from "svelte/elements";
  let {
    ref = $bindable(null),
    children,
    ...rest
  }: WithElementRef<
    HTMLButtonAttributes & {
      yourPropA: string;
      yourPropB: number;
    },
    HTMLButtonElement
  > = $props();
</script>
<button bind:this={ref} {...rest}>
  {@render children?.()}
</button>
```

### state-management
Two state management patterns: two-way binding for simple cases, function binding (getter/setter) for complex transformations, conditionals, debouncing, or external state integration.

## State Management

Bits UI components support multiple approaches to manage component state. Each component's API reference highlights which props are `bindable`, and you can replace the `value` prop with any `bindable` prop.

### Two-Way Binding

Use Svelte's built-in two-way binding with `bind:`:

```svelte
import { ComponentName } from "bits-ui";
let myValue = $state("default-value");
```

```svelte
<button onclick={() => (myValue = "new-value")}> Update Value </button>
<ComponentName.Root bind:value={myValue}></ComponentName.Root>
```

**Why use it:**
- Zero-boilerplate state updates
- External controls work automatically
- Great for simple use cases

### Function Binding

Use a Function Binding for complete control with both getter and setter:

```svelte
let myValue = $state("default-value");
function getValue() {
  return myValue;
}
function setValue(newValue: string) {
  const now = new Date();
  const hour = now.getHours();
  if (hour >= 9 && hour <= 17) {
    myValue = newValue;
  }
}
```

```svelte
<ComponentName.Root bind:value={getValue, setValue}></ComponentName.Root>
```

When the component wants to set the value from an internal action, it invokes the setter, where you can determine if the setter actually updates the state or not.

**When to use:**
- Complex state transformation logic
- Conditional updates
- Debouncing or throttling state changes
- Maintaining additional state alongside the primary value
- Integrating with external state systems

### styling
Five styling approaches (CSS frameworks, data attributes, global classes, scoped styles, style prop); state styling via data attributes and CSS variables; animation techniques combining state selectors with keyframes.

## Styling Approaches

Bits UI ships with zero styles by default. All components that render HTML elements expose `class` and `style` props.

**CSS Frameworks**: Pass framework classes directly to components:
```svelte
<Accordion.Trigger class="h-12 w-full bg-blue-500 hover:bg-blue-600">Click me</Accordion.Trigger>
```

**Data Attributes**: Each component applies data attributes for reliable CSS selectors. Target them in global stylesheets:
```css
[data-accordion-trigger] {
  height: 3rem;
  width: 100%;
  background-color: #3182ce;
  color: #fff;
}
```
Import stylesheet in layout component.

**Global Classes**: Define CSS classes and apply via `class` prop:
```css
.accordion-trigger {
  height: 3rem;
  width: 100%;
  background-color: #3182ce;
  color: #fff;
}
```
```svelte
<Accordion.Trigger class="accordion-trigger">Click me</Accordion.Trigger>
```

**Scoped Styles**: Use the `child` snippet to bring elements into component scope for Svelte scoped styles:
```svelte
<Accordion.Trigger>
  {#snippet child({ props })}
    <button {...props} class="my-accordion-trigger">Click me!</button>
  {/snippet}
</Accordion.Trigger>
<style>
  .my-accordion-trigger {
    height: 3rem;
    width: 100%;
    background-color: #3182ce;
    color: #fff;
  }
</style>
```

**Style Prop**: Accept string or object, merged with internal styles via `mergeProps`:
```svelte
<Accordion.Trigger style="background-color: #3182ce; color: white; padding: 1rem;">
  Click me
</Accordion.Trigger>
<!-- Or object -->
<Accordion.Trigger style={{ backgroundColor: "#3182ce", color: "white", padding: "1rem" }}>
  Click me
</Accordion.Trigger>
```

## Styling Component States

**State Data Attributes**: Components expose state via data attributes:
```css
[data-accordion-trigger][data-state="open"] {
  background-color: #f0f0f0;
  font-weight: bold;
}
[data-accordion-trigger][data-state="closed"] {
  background-color: #ffffff;
}
[data-accordion-trigger][data-disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}
```

**CSS Variables**: Components expose CSS variables for internal values. Example: `--bits-select-anchor-width` for Select.Content width:
```css
[data-select-content] {
  width: var(--bits-select-anchor-width);
  min-width: var(--bits-select-anchor-width);
  max-width: var(--bits-select-anchor-width);
}
```

**Example Accordion with States**:
```svelte
<Accordion.Root>
  <Accordion.Item value="item-1">
    <Accordion.Trigger>Section 1</Accordion.Trigger>
    <Accordion.Content>Content for section 1</Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-2">
    <Accordion.Trigger disabled>Section 2 (Disabled)</Accordion.Trigger>
    <Accordion.Content>Content for section 2</Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
<style>
  :global([data-accordion-item]) {
    border: 1px solid #e2e8f0;
    border-radius: 0.25rem;
    margin-bottom: 0.5rem;
  }
  :global([data-accordion-trigger]) {
    width: 100%;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  :global([data-accordion-trigger][data-state="open"]) {
    background-color: #f7fafc;
    border-bottom: 1px solid #e2e8f0;
  }
  :global([data-accordion-trigger][data-disabled]) {
    opacity: 0.5;
    cursor: not-allowed;
  }
  :global([data-accordion-content]) {
    padding: 1rem;
  }
</style>
```

## Advanced Styling Techniques

**Combining Data Attributes with CSS Variables**: Animate accordion content using `--bits-accordion-content-height` and `data-state`:
```css
[data-accordion-content] {
  overflow: hidden;
  transition: height 300ms ease-out;
  height: 0;
}
[data-accordion-content][data-state="open"] {
  height: var(--bits-accordion-content-height);
}
[data-accordion-content][data-state="closed"] {
  height: 0;
}
```

**Custom Keyframe Animations**:
```css
@keyframes accordionOpen {
  0% {
    height: 0;
    opacity: 0;
  }
  80% {
    height: var(--bits-accordion-content-height);
    opacity: 0.8;
  }
  100% {
    height: var(--bits-accordion-content-height);
    opacity: 1;
  }
}
@keyframes accordionClose {
  0% {
    height: var(--bits-accordion-content-height);
    opacity: 1;
  }
  20% {
    height: var(--bits-accordion-content-height);
    opacity: 0.8;
  }
  100% {
    height: 0;
    opacity: 0;
  }
}
[data-accordion-content][data-state="open"] {
  animation: accordionOpen 400ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
[data-accordion-content][data-state="closed"] {
  animation: accordionClose 300ms cubic-bezier(0.7, 0, 0.84, 0) forwards;
}
```

**Animated Accordion Example**:
```svelte
<Accordion.Root type="single">
  <Accordion.Item value="item-1">
    <Accordion.Trigger>Section 1</Accordion.Trigger>
    <Accordion.Content>Content for section 1</Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-2">
    <Accordion.Trigger>Section 2</Accordion.Trigger>
    <Accordion.Content>Content for section 2</Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
<style>
  :global([data-accordion-item]) {
    border: 1px solid #e2e8f0;
    border-radius: 0.25rem;
    margin-bottom: 0.5rem;
  }
  :global([data-accordion-trigger]) {
    width: 100%;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  :global([data-accordion-trigger][data-state="open"]) {
    background-color: #f7fafc;
    border-bottom: 1px solid #e2e8f0;
  }
  :global([data-accordion-content]) {
    overflow: hidden;
    transition: height 300ms ease-out;
  }
  @keyframes -global-accordionOpen {
    0% { height: 0; opacity: 0; }
    80% { height: var(--bits-accordion-content-height); opacity: 0.8; }
    100% { height: var(--bits-accordion-content-height); opacity: 1; }
  }
  @keyframes -global-accordionClose {
    0% { height: var(--bits-accordion-content-height); opacity: 1; }
    20% { height: var(--bits-accordion-content-height); opacity: 0.8; }
    100% { height: 0; opacity: 0; }
  }
  :global([data-accordion-content][data-state="open"]) {
    animation: accordionOpen 400ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  :global([data-accordion-content][data-state="closed"]) {
    animation: accordionClose 300ms cubic-bezier(0.7, 0, 0.84, 0) forwards;
  }
</style>
```

### transitions
Apply transitions to Bits UI components via forceMount + child snippet pattern; Floating UI components require wrapperProps wrapper element.

## Using Transitions with Components

Svelte transitions (in:, out:, transition:) don't work directly on components. Bits UI v5 removed the old workaround of exposing transition* props and instead provides `forceMount` prop and `child` snippet for flexible animation support.

### Default Behavior
Components handle mounting/unmounting automatically with transition support. CSS transitions and animations work out of the box (examples use tailwindcss-animate).

### Force Mounting Pattern
Use `forceMount` prop to keep component mounted in DOM, then use the `child` snippet to conditionally render and apply transitions:

```svelte
<Dialog.Root>
  <Dialog.Content forceMount>
    {#snippet child({ props, open })}
      {#if open}
        <div {...props} transition:fly>
          <!-- content -->
        </div>
      {/if}
    {/snippet}
  </Dialog.Content>
</Dialog.Root>
```

For reusability, wrap this pattern in a custom component:

```svelte
<script lang="ts">
  import type { Snippet } from "svelte";
  import { fly } from "svelte/transition";
  import { Dialog, type WithoutChildrenOrChild } from "bits-ui";
  let {
    ref = $bindable(null),
    children,
    ...restProps
  }: WithoutChildrenOrChild<Dialog.ContentProps> & {
    children?: Snippet;
  } = $props();
</script>
<Dialog.Content bind:ref {...restProps} forceMount={true}>
  {#snippet child({ props, open })}
    {#if open}
      <div {...props} transition:fly>
        {@render children?.()}
      </div>
    {/if}
  {/snippet}
</Dialog.Content>
```

Then use it with other Dialog components normally.

### Floating Content Components
For components using Floating UI (like Popover.Content), add a wrapper element and spread `wrapperProps`:

```svelte
<Popover.Content forceMount>
  {#snippet child({ wrapperProps, props, open })}
    {#if open}
      <div {...wrapperProps}>
        <div {...props} transition:fly>
          <!-- content -->
        </div>
      </div>
    {/if}
  {/snippet}
</Popover.Content>
```

