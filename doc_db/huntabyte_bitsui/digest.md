## Core Concepts

**Components**: 50+ headless UI components with compound architecture, flexible state management (two-way binding or getter/setter), keyboard navigation, ARIA accessibility, and data-attribute/CSS-variable styling. Categories: Disclosure (Accordion, Collapsible, Tabs), Dialogs (AlertDialog, Dialog, Popover, LinkPreview, Tooltip), Dropdowns (DropdownMenu, ContextMenu, Combobox, Command, Select, NavigationMenu), Forms (Checkbox, RadioGroup, Switch, Toggle, ToggleGroup, RatingGroup, PinInput), Date/Time (Calendar, DateField, DatePicker, DateRangeField, DateRangePicker, RangeCalendar, TimeField, TimeRangeField), Data Display (Progress, Meter, Pagination, ScrollArea), Layout (AspectRatio, Separator, Label), Ranges (Slider), Buttons, Utilities (Avatar, Menubar).

**State Management**: Two approaches—two-way binding (`bind:value={state}`) for simple cases, or function binding (`bind:value={getter, setter}`) for complex transformations, conditionals, debouncing, or external state integration.

**Styling**: Five approaches—CSS frameworks (pass classes directly), data attributes (target `[data-state]`, `[data-disabled]`, etc. in global CSS), global classes, scoped styles via `child` snippet, or `style` prop. Components expose CSS variables like `--bits-[component]-content-height` for animations.

**Child Snippet**: Override default element rendering via `child` snippet parameter containing `props` object. Spread `{...props}` onto custom element. For floating components (Popover.Content, Tooltip.Content, etc.), use two-level structure with `wrapperProps` (outer, unstyled) and `props` (inner, styled). Enables Svelte transitions, actions, scoped styles, and custom component integration.

**Ref Prop**: Bindable `ref` prop accesses underlying HTML elements. Works with `child` snippet via element IDs. Use `WithElementRef` type helper for custom components.

**Transitions**: Use `forceMount` prop + `child` snippet with conditional rendering and Svelte transitions. For floating components, wrap with `wrapperProps` element.

**Date/Time**: Uses `DateValue` types from `@internationalized/date` (CalendarDate, CalendarDateTime, ZonedDateTime)—immutable with `.set()`, `.add()`, `.subtract()`, `.cycle()` methods. Months are 1-indexed. `placeholder` prop acts as initial date and controls calendar view. Use `DateFormatter` for formatting.

**Utilities**: 
- `BitsConfig`: Global context for default props (defaultPortalTo, defaultLocale) with scoped inheritance
- `IsUsingKeyboard`: Tracks keyboard usage via shared state
- `mergeProps`: Merges props with event handler chaining, class combining, style merging
- `Portal`: Renders children to specified DOM location (body by default)
- `useId`: Generates unique IDs for element association

**Type Helpers**: `WithElementRef<T, U>` adds optional `ref` prop; `WithoutChild` excludes `child` snippet; `WithoutChildren` excludes `children` snippet; `WithoutChildrenOrChild` excludes both.

**Policies**: Changelog entries use format `- <type>(<scope>): <description>` with types (fix, feat, improve, chore, docs). Feature requests start as Discussions, move to Issues only after acceptance.

## Installation & Setup
```bash
npm install bits-ui @internationalized/date
```

```svelte
<script lang="ts">
  import { Accordion, BitsConfig } from "bits-ui";
  import { today, getLocalTimeZone } from "@internationalized/date";
  
  let value = $state("item-1");
  let placeholder = $state(today(getLocalTimeZone()));
</script>

<BitsConfig defaultPortalTo="#portal" defaultLocale="en">
  <Accordion.Root bind:value type="single">
    <Accordion.Item value="item-1">
      <Accordion.Header>
        <Accordion.Trigger>Title</Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content>Content</Accordion.Content>
    </Accordion.Item>
  </Accordion.Root>
</BitsConfig>
```

## Styling Examples
```svelte
<!-- TailwindCSS -->
<Accordion.Trigger class="h-12 w-full bg-blue-500 hover:bg-blue-600">Click</Accordion.Trigger>

<!-- Data attributes -->
<style>
  [data-accordion-trigger][data-state="open"] { background-color: #f0f0f0; }
  [data-accordion-trigger][data-disabled] { opacity: 0.5; }
</style>

<!-- Scoped styles via child snippet -->
<Accordion.Trigger>
  {#snippet child({ props })}
    <button {...props} class="my-trigger">Click</button>
  {/snippet}
</Accordion.Trigger>
<style>
  .my-trigger { background-color: #3182ce; }
</style>

<!-- CSS variables for animations -->
<style>
  [data-accordion-content] {
    height: 0;
    transition: height 300ms;
  }
  [data-accordion-content][data-state="open"] {
    height: var(--bits-accordion-content-height);
  }
</style>
```

## State Management Examples
```svelte
<!-- Two-way binding -->
<script>
  let selected = $state("option-1");
</script>
<Select.Root bind:value={selected} type="single">
  <!-- ... -->
</Select.Root>

<!-- Function binding with conditional logic -->
<script>
  let value = $state("default");
  function getValue() { return value; }
  function setValue(newValue) {
    if (newValue.length > 0) value = newValue;
  }
</script>
<Combobox.Root bind:value={getValue, setValue} type="single">
  <!-- ... -->
</Combobox.Root>
```

## Child Snippet Examples
```svelte
<!-- Basic custom element -->
<Accordion.Trigger>
  {#snippet child({ props })}
    <div {...props} class="custom-trigger">Custom content</div>
  {/snippet}
</Accordion.Trigger>

<!-- With Svelte transitions -->
<Dialog.Content forceMount>
  {#snippet child({ props, open })}
    {#if open}
      <div {...props} transition:fly={{ y: -10 }}>
        Dialog content
      </div>
    {/if}
  {/snippet}
</Dialog.Content>

<!-- Floating component with wrapper -->
<Popover.Content forceMount>
  {#snippet child({ wrapperProps, props, open })}
    {#if open}
      <div {...wrapperProps}>
        <div {...props} transition:fade>Popover content</div>
      </div>
    {/if}
  {/snippet}
</Popover.Content>

<!-- Custom component integration -->
<Accordion.Trigger>
  {#snippet child({ props })}
    <MyCustomButton {...props}>Toggle</MyCustomButton>
  {/snippet}
</Accordion.Trigger>
```

## Date/Time Examples
```svelte
<script>
  import { Calendar, DatePicker } from "bits-ui";
  import { today, getLocalTimeZone, parseDate } from "@internationalized/date";
  
  let placeholder = $state(today(getLocalTimeZone()));
  let selected = $state(parseDate("2024-07-10"));
</script>

<!-- Calendar with month navigation -->
<Calendar.Root bind:placeholder bind:value={selected}>
  <Calendar.Header>
    <Calendar.PrevButton>Prev</Calendar.PrevButton>
    <Calendar.Heading />
    <Calendar.NextButton>Next</Calendar.NextButton>
  </Calendar.Header>
  <Calendar.Months>
    <Calendar.Month>
      <Calendar.Grid>
        <Calendar.GridHead>
          <Calendar.GridRow>
            <Calendar.HeadCell>Su</Calendar.HeadCell>
            <!-- ... -->
          </Calendar.GridRow>
        </Calendar.GridHead>
        <Calendar.GridBody>
          <Calendar.GridRow>
            <Calendar.Cell>
              <Calendar.Day>1</Calendar.Day>
            </Calendar.Cell>
            <!-- ... -->
          </Calendar.GridRow>
        </Calendar.GridBody>
      </Calendar.Grid>
    </Calendar.Month>
  </Calendar.Months>
</Calendar.Root>

<!-- DatePicker (Calendar + DateField + Popover) -->
<DatePicker.Root bind:value={selected}>
  <DatePicker.Trigger>Open</DatePicker.Trigger>
  <DatePicker.Portal>
    <DatePicker.Content>
      <!-- Calendar content -->
    </DatePicker.Content>
  </DatePicker.Portal>
</DatePicker.Root>

<!-- Update immutable DateValue -->
<script>
  placeholder = placeholder.set({ month: 8 });
  placeholder = placeholder.add({ days: 1 });
  placeholder = placeholder.subtract({ months: 1 });
</script>
```

## Migration from v0 to v1
- `el` → `ref` prop
- `asChild` → `child` snippet
- `transition` props → `forceMount` + `child` snippet with Svelte transitions
- `let:` directives → `children`/`child` snippet props
- `multiple` prop → required `type` prop ('single' or 'multiple')
- `selected` → `value` prop
- Indicator components removed → use `children` snippet to access state
- Auto-portalling removed → wrap content in explicit `Portal` component
- `Checkbox.Input` removed → auto-renders when `name` prop provided
- `Tooltip.Provider` now required (wraps app/section)
- `Slider` requires `type` prop, adds `onValueCommit` callback
- `AlertDialog.Action` no longer closes by default
- `Pin Input` completely overhauled for OTP use case