
## Directories

### ui_components
Complete library of accessible, composable UI components for Svelte with flexible state management, keyboard navigation, and Floating UI positioning.

## UI Components Library

Complete collection of accessible, composable UI components for Svelte applications.

### Core Patterns

**State Management**: All components support two-way binding (`bind:value`) and fully controlled function bindings (`bind:value={getValue, setValue}`).

**Compound Components**: Components use sub-component architecture (Root, Trigger, Content, etc.) for maximum flexibility and customization.

**Data Attributes & CSS Variables**: Components expose `data-*` attributes for styling states and CSS variables for dynamic values.

### Component Categories

**Form Controls**
- Checkbox, Radio Group, Toggle, Switch - Binary/single selection
- Slider, Range Slider - Continuous value selection
- Select, Combobox - Dropdown selection with search/filtering
- PIN Input - OTP/2FA input with autofill support
- Rating Group - Star ratings with half-step support

**Date/Time Inputs**
- Calendar, Range Calendar - Date selection with constraints
- DateField, DateRangeField - Segment-based date input
- TimeField, TimeRangeField - Segment-based time input
- DatePicker, DateRangePicker - Combined field + calendar interface

**Disclosure Components**
- Accordion - Collapsible sections (single/multiple)
- Collapsible - Expandable content with transitions
- Tabs - Tabbed content organization

**Menus & Navigation**
- Dropdown Menu, Context Menu - Popup menus with items/groups/checkboxes/radio buttons
- Menubar - Horizontal menu bar with submenus
- Navigation Menu - Hierarchical navigation with dropdowns
- Command - Searchable command palette with keyboard navigation

**Dialogs & Overlays**
- Dialog - Modal with focus management and nested support
- Alert Dialog - Confirmation dialogs
- Popover - Floating panels with positioning
- Tooltip - Hover/focus triggered hints
- Link Preview - Link content preview on hover

**Progress & Feedback**
- Progress - Task completion status
- Meter - Static measurements within range
- Pagination - Page navigation

**Layout & Structure**
- Separator - Visual dividers
- Scroll Area - Custom scrollbars with hide delays
- Aspect Ratio - Maintains content aspect ratio
- Label - Enhanced label elements
- Button - Flexible button/anchor element
- Avatar - Image with loading states and fallback
- Toolbar - Action bar with toggle groups

### Key Features Across Components

**Accessibility**: WAI-ARIA compliant with keyboard navigation, screen reader support, and focus management.

**Positioning**: Floating UI integration for automatic collision detection and positioning (with manual alternatives).

**Animations**: `forceMount` prop with `child` snippet enables Svelte transitions on visibility changes.

**Keyboard Navigation**: Arrow keys, Enter, Escape, and component-specific shortcuts (vim bindings in Command, etc.).

**Validation**: Date/time components support min/max constraints, custom validation functions, and error callbacks.

**Form Integration**: Hidden inputs for form submission via `name` prop; `required` prop for validation.

**Customization**: Extensive snippet props for rendering, data attributes for styling, CSS variables for dynamic values.

### Common Patterns

**Reusable Wrappers**: Create wrapper components accepting items arrays and configuration props to reduce boilerplate.

**Scroll Management**: Combobox, Select, Command support scroll buttons with customizable delays or native scrollbars.

**Nested Structures**: Dialog, Menu, and Navigation components support nesting with depth tracking via CSS variables.

**Search/Filter**: Combobox and Command provide filtering with custom scoring algorithms or custom filter functions.

**Multi-Selection**: Select, Checkbox Group, Toggle Group support multiple values as arrays.

### contribution_policies
Guidelines for writing changelog entries and managing feature requests through Issues and Discussions.

## Changelog Entry Format

Changelog entries follow the structure: `- <type>(<scope>): <description>`

**Types:**
- `fix`: Bug or issue resolution
- `feat`: New feature or enhancement
- `improve`: Existing functionality enhancement
- `chore`: Internal refactors or tooling with no user-facing impact
- `docs`: JSDoc documentation changes only

**Scope:** Component name (e.g., `Select`, `Tooltip`) for component-specific changes, or general term (e.g., `all`, `SSR`) for cross-cutting changes. Omit for truly global changes.

**Description:** Concise, lowercase phrase without period; start with a verb; use backticks for code; target 10-15 words max.

Example: `fix(Select.Trigger): improve accessibility for screen readers and keyboard navigation`

## Issues vs Discussions

**Issues:** Reproducible bugs with clear steps and error messages, or accepted feature requests approved for implementation.

**Discussions:** Feature requests (starting point), design discussions, questions, and RFCs.

**Feature Request Workflow:**
1. Start Discussion describing feature and benefits
2. Gather feedback and refine
3. If consensus reached, maintainer creates Issue for implementation tracking

### type_helpers
Utility type helpers for customizing component prop interfaces when wrapping Bits UI components.

## Type Helpers for Custom Components

### WithElementRef
Adds a `ref` prop to custom components following Bits UI's pattern. Enables access to underlying HTML elements.

```ts
type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & {
  ref?: U | null;
};

type Props = WithElementRef<{ yourPropA: string }, HTMLButtonElement>;
let { yourPropA, ref = $bindable(null) }: Props = $props();
```

### WithoutChild
Excludes the `child` snippet prop from a component type. Use when building wrappers that populate children internally.

```ts
let { children, ...restProps }: WithoutChild<Accordion.ItemProps> = $props();
```

### WithoutChildren
Excludes the `children` snippet prop from a component type. Use when building wrappers that manage children internally.

```ts
let { value, onValueChange, ...restProps }: WithoutChildren<Accordion.RootProps> = $props();
```

### WithoutChildrenOrChild
Excludes both `child` and `children` snippet props from a component type. Use when building wrappers that fully manage the children interface.

```ts
let { title, ...restProps }: WithoutChildrenOrChild<Accordion.TriggerProps & { title: string }> = $props();
```

### utilities
Collection of utility functions and components for managing global configuration, keyboard tracking, props merging, portals, and ID generation.

## BitsConfig
Global context provider for setting default props (portal target, locale) across components with inheritance and override support.

**Properties:**
- `defaultPortalTo` (Element | string): Default portal target, defaults to `document.body`
- `defaultLocale` (string): Default locale, defaults to `"en"`
- `children` (Snippet): Content to render

**Value resolution order:** Direct component prop → Nearest parent BitsConfig → Inherited from parent BitsConfig(s) → Built-in default

```svelte
<BitsConfig defaultPortalTo="#main-portal" defaultLocale="de">
  <Dialog.Root>
    <Dialog.Portal>
      <Dialog.Content>Main dialog</Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
  <BitsConfig defaultPortalTo="#tooltip-portal">
    <!-- Inherits locale="de", uses new portal target -->
    <Tooltip.Root>
      <Tooltip.Trigger>Hover me</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content>Tooltip content</Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  </BitsConfig>
</BitsConfig>
```

## IsUsingKeyboard
Tracks whether the user is actively using the keyboard with global state shared across instances.

```svelte
const isUsingKeyboard = new IsUsingKeyboard();
const shouldShowMenu = $derived(isUsingKeyboard.current);
```

## mergeProps
Merges props objects with special handling for event handlers (with preventDefault support), functions, classes, and styles.

**Event handlers** chain in order; if a handler calls `event.preventDefault()`, subsequent handlers don't execute:
```ts
const merged = mergeProps(
  { onclick: (e) => console.log("First") },
  { onclick: (e) => { console.log("Second"); e.preventDefault(); } },
  { onclick: (e) => console.log("Third") }
);
merged.onclick(new MouseEvent("click")); // Logs: "First" then "Second" only
```

**Non-event functions** chain without cancellation. **Classes** merge using clsx. **Styles** merge as objects/strings with later properties overriding earlier ones.

## Portal
Renders children in a portal to prevent layout issues, with customizable target and disable options.

```svelte
<Portal to="#custom-target">
  <div>Portalled to #custom-target</div>
</Portal>

<Portal disabled>
  <div>Rendered in original DOM location</div>
</Portal>
```

**API:** `to` (Element | string), `disabled` (boolean), `children` (Snippet)

## useId
Generates unique IDs for components and form elements.

```svelte
const id = useId();
<label for={id}>Label</label>
<input {id} />
```



## Pages

### child-snippet
Use the child snippet to customize rendered elements in Bits UI components while preserving accessibility and functionality.

## Child Snippet

Override default element rendering in Bits UI components using the `child` snippet.

**Basic usage:**
```svelte
<Accordion.Trigger id="my-id" onclick={handler}>
  {#snippet child({ props })}
    <button {...props} class="custom">Toggle</button>
  {/snippet}
</Accordion.Trigger>
```

**Floating components** (tooltips, popovers, dropdowns) require two-level structure:
```svelte
<Popover.Content>
  {#snippet child({ wrapperProps, props, open })}
    {#if open}
      <div {...wrapperProps}>
        <div {...props} transition:fade>Content</div>
      </div>
    {/if}
  {/snippet}
</Popover.Content>
```

Key points:
- Spread `{...props}` onto your custom element
- For floating components: wrapper element unstyled, inner element styled
- Use `open` parameter for conditional rendering with transitions
- Always include `{...props}` spread

### dates-and-times
Guide to working with immutable DateValue objects from @internationalized/date in Bits UI components.

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

### getting-started
Install bits-ui, import components, style using class props or data attributes, and leverage TypeScript support.

## Installation
```bash
npm install bits-ui
```

## Basic Usage
```svelte
<script lang="ts">
  import { Accordion } from "bits-ui";
</script>
<Accordion.Root type="single">
  <Accordion.Item value="item-1">
    <Accordion.Header>
      <Accordion.Trigger>Item 1</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content>Content</Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
```

## Styling
Headless components with `class` and `style` props. Use TailwindCSS classes directly or target data attributes in CSS:
```css
[data-button-root] {
  background-color: #3182ce;
  color: white;
}
```

## TypeScript Support
Full type checking and autocompletion included.

### introduction
Headless Svelte component library focused on developer experience, accessibility, and creative control with unstyled components and composable design.

## Bits UI

Headless Svelte component library with unstyled components, full TypeScript support, WAI-ARIA compliance, keyboard navigation, and composable design using render delegation and chainable events.

### migration_guide:_v0.x_to_v1
Bits UI v1 migration guide covering breaking changes: prop renames (el→ref, asChild→child snippet), required type discriminants, removed indicator components, explicit portalling, and component-specific updates.

## Key Migration Changes

**Global:** `el` → `ref`, `asChild` → `child` snippet, remove `transition` props, `let:` → snippet props

**Type Props:** Accordion, Combobox, Select, Slider now require `type` prop (`'single'`/`'multiple'`)

**Removed Indicators:** Checkbox, Combobox, Select, Radio, Menu indicators removed → use `children` snippet

**Portalling:** Combobox, Select, Popover, Menu, Alert Dialog now use explicit `*.Portal` wrapper (auto-portalling removed)

**Other:** Checkbox `checked` type is now `boolean` only, Slider adds `onValueCommit`, Tooltip requires `Tooltip.Provider`, Pin Input completely overhauled

### ref-prop-binding
The ref prop provides bindable access to underlying HTML elements in Bits UI components for direct DOM manipulation.

## Ref Prop Binding

Bind `ref` to access underlying HTML elements for DOM manipulation:

```svelte
let triggerRef = $state<HTMLButtonElement | null>(null);
<Accordion.Trigger bind:ref={triggerRef}>Content</Accordion.Trigger>
```

With child snippets, pass custom IDs to the parent component:

```svelte
<Accordion.Trigger bind:ref={triggerRef} id={myCustomId}>
  {#snippet child({ props })}
    <CustomButton {...props} />
  {/snippet}
</Accordion.Trigger>
```

Use `WithElementRef` type helper to create custom ref props in your components.

### state-management
Two state management patterns for Bits UI components: simple two-way binding with bind: and advanced function binding with custom getter/setter logic.

Two approaches to state management:

1. **Two-Way Binding**: `bind:value={myValue}` - simple, zero-boilerplate
2. **Function Binding**: `bind:value={getValue, setValue}` - for complex logic, conditional updates, debouncing, or external state integration

### styling
Multiple approaches to style unstyled Bits UI components using classes, data attributes, CSS variables, and inline styles, with support for state-based and animated styling.

## Styling Methods

- **CSS Frameworks**: Pass classes directly to components
- **Data Attributes**: Target with `[data-component-name]` selectors
- **Global Classes**: Define and apply via `class` prop
- **Scoped Styles**: Use `child` snippet for Svelte scoped styles
- **Style Prop**: Inline styles as string or object

## State Styling

Use data attributes like `[data-state="open"]` and `[data-disabled]` to style based on component state. Access internal values via CSS variables like `--bits-accordion-content-height`.

## Animations

Combine state attributes with CSS variables and keyframes:
```css
[data-accordion-content][data-state="open"] {
  animation: accordionOpen 400ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
```

### transitions
How to apply Svelte transitions and animations to Bits UI components using forceMount and child snippets.

Use `forceMount` prop with `child` snippet to apply transitions to Bits UI components. For regular components, conditionally render with `{#if open}` and apply transitions to the inner element. For Floating UI components, wrap with `wrapperProps` and apply transitions to the content element.

