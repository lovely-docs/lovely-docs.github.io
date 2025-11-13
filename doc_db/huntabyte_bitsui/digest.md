## UI Components Library

Complete collection of accessible, composable UI components for Svelte with state management, keyboard navigation, and Floating UI positioning.

**State Management**: Two-way binding (`bind:value`) or function binding with custom getter/setter logic for complex transformations.

**Compound Components**: Sub-component architecture (Root, Trigger, Content, etc.) for maximum flexibility.

**Data Attributes & CSS Variables**: Components expose `data-*` attributes for styling states and CSS variables for dynamic values.

### Component Categories

**Form Controls**: Checkbox, Radio Group, Toggle, Switch, Slider, Range Slider, Select, Combobox, PIN Input, Rating Group

**Date/Time**: Calendar, Range Calendar, DateField, DateRangeField, TimeField, TimeRangeField, DatePicker, DateRangePicker

**Disclosure**: Accordion, Collapsible, Tabs

**Menus & Navigation**: Dropdown Menu, Context Menu, Menubar, Navigation Menu, Command

**Dialogs & Overlays**: Dialog, Alert Dialog, Popover, Tooltip, Link Preview

**Progress & Feedback**: Progress, Meter, Pagination

**Layout**: Separator, Scroll Area, Aspect Ratio, Label, Button, Avatar, Toolbar

### Key Features

**Accessibility**: WAI-ARIA compliant with keyboard navigation and focus management.

**Positioning**: Floating UI integration for automatic collision detection.

**Animations**: `forceMount` prop with `child` snippet enables Svelte transitions on visibility changes.

**Keyboard Navigation**: Arrow keys, Enter, Escape, and component-specific shortcuts.

**Validation**: Date/time components support min/max constraints and custom validation.

**Form Integration**: Hidden inputs via `name` prop; `required` prop for validation.

**Customization**: Snippet props for rendering, data attributes for styling, CSS variables for dynamic values.

## Getting Started

```bash
npm install bits-ui
```

```svelte
<script lang="ts">
  import { Accordion } from "bits-ui";
</script>
<Accordion.Root type="single">
  <Accordion.Item value="item-1">
    <Accordion.Trigger>Item 1</Accordion.Trigger>
    <Accordion.Content>Content</Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
```

## Styling

Components are headless with no default styles. Apply styles via `class` prop or data attributes:

```svelte
<Accordion.Trigger class="h-12 bg-blue-500">Click me</Accordion.Trigger>
```

```css
[data-accordion-trigger][data-state="open"] { background-color: #f0f0f0; }
```

## Child Snippet

Override rendered elements while preserving accessibility:

```svelte
<Accordion.Trigger id="my-id">
  {#snippet child({ props })}
    <button {...props} class="custom-button">Toggle</button>
  {/snippet}
</Accordion.Trigger>
```

For floating components (Popover, Tooltip, etc.), use two-level structure:

```svelte
<Popover.Content>
  {#snippet child({ wrapperProps, props, open })}
    {#if open}
      <div {...wrapperProps}>
        <div {...props}>Content</div>
      </div>
    {/if}
  {/snippet}
</Popover.Content>
```

## Transitions

Use `forceMount` with `child` snippet for Svelte transitions:

```svelte
<Dialog.Content forceMount>
  {#snippet child({ props, open })}
    {#if open}
      <div {...props} transition:fly>Content</div>
    {/if}
  {/snippet}
</Dialog.Content>
```

## Ref Prop Binding

Access underlying HTML elements via `ref` prop:

```svelte
<script lang="ts">
  let triggerRef = $state<HTMLButtonElement | null>(null);
</script>
<Accordion.Trigger bind:ref={triggerRef}>Trigger</Accordion.Trigger>
<button onclick={() => triggerRef?.focus()}>Focus</button>
```

## DateValue Types

Use immutable `DateValue` objects from `@internationalized/date`:

```ts
import { CalendarDate, parseDate, today, getLocalTimeZone } from "@internationalized/date";

const date = new CalendarDate(2024, 7, 10);
const parsedDate = parseDate("2024-07-10");
const localToday = today(getLocalTimeZone());

// Update via methods returning new instances
date = date.add({ days: 1 });
date = date.set({ month: 8 });
```

Months are 1-indexed (January = 1). Use `ZonedDateTime` for timezone-aware dates.

## Utilities

**BitsConfig**: Global context for default props (portal target, locale) with inheritance:

```svelte
<BitsConfig defaultPortalTo="#main-portal" defaultLocale="de">
  <Dialog.Root>...</Dialog.Root>
</BitsConfig>
```

**IsUsingKeyboard**: Tracks keyboard usage globally.

**mergeProps**: Merges props with special handling for event handlers (preventDefault stops chain), functions, classes, and styles.

**Portal**: Renders children in a portal to prevent layout issues.

**useId**: Generates unique IDs for components.

## Type Helpers

**WithElementRef**: Adds `ref` prop to custom components.

**WithoutChild/WithoutChildren/WithoutChildrenOrChild**: Exclude snippet props when building wrappers.

## Contribution Guidelines

**Changelog Format**: `- <type>(<scope>): <description>`
- Types: `fix`, `feat`, `improve`, `chore`, `docs`
- Scope: Component name or general term
- Description: Concise, lowercase, 10-15 words max

**Issues vs Discussions**: Start feature requests in Discussions, move to Issues after consensus.

## Migration from v0.x to v1

**Global**: `el` → `ref`, `asChild` → `child` snippet, `transition` props removed, `let:` → snippet props

**Component-specific**:
- Accordion: `multiple` prop → required `type` prop
- Checkbox: `Indicator` removed, `indeterminate` state removed
- Combobox/Select/Menu: `*Indicator` removed, auto-portalling removed (use `Portal` component)
- Slider: `type` prop now required, new `onValueCommit` callback
- Tooltip: New required `Tooltip.Provider` component