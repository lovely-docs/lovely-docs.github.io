

## Pages

### accordion
Accordion component for collapsible content sections with WAI-ARIA accessibility.

## Accordion

Vertically stacked interactive headings that reveal content sections.

```svelte
<Accordion.Root type="single">
  <Accordion.Item value="item-1">
    <Accordion.Trigger>Title</Accordion.Trigger>
    <Accordion.Content>Content</Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
```

Install: `pnpm dlx shadcn-svelte@latest add accordion`

### alert-dialog
Alert Dialog is a modal component for displaying important messages that require user confirmation or action.

## Alert Dialog

Modal dialog component for important user interruptions requiring a response.

```svelte
<AlertDialog.Root>
  <AlertDialog.Trigger>Open</AlertDialog.Trigger>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Title</AlertDialog.Title>
      <AlertDialog.Description>Description</AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action>Action</AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
```

Install with `shadcn-svelte@latest add alert-dialog`.

### alert
Alert component for displaying callout messages with optional icons, titles, descriptions, and destructive variant.

## Alert Component

Callout component for user attention messages.

### Installation
```bash
pnpm dlx shadcn-svelte@latest add alert
```

### Usage
```svelte
<script lang="ts">
  import * as Alert from "$lib/components/ui/alert/index.js";
  import AlertCircleIcon from "@lucide/svelte/icons/alert-circle";
</script>

<Alert.Root variant="destructive">
  <AlertCircleIcon />
  <Alert.Title>Error</Alert.Title>
  <Alert.Description>Your session has expired. Please login again.</Alert.Description>
</Alert.Root>
```

Supports `Alert.Root`, `Alert.Title`, `Alert.Description` with optional icons and `variant="destructive"` for error styling.

### aspect-ratio
AspectRatio component that maintains content within a specified aspect ratio.

## AspectRatio

Constrains content to a specific aspect ratio using the `ratio` prop.

```svelte
<AspectRatio ratio={16 / 9} class="bg-muted">
  <img src="..." alt="..." class="rounded-md object-cover" />
</AspectRatio>
```

Install: `pnpm dlx shadcn-svelte@latest add aspect-ratio`

### avatar
Avatar component for displaying user images with text fallback when images fail to load.

## Avatar Component

Image element with fallback text for user avatars.

### Installation
```bash
npm install shadcn-svelte@latest add avatar
```

### Usage
```svelte
<Avatar.Root>
  <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
  <Avatar.Fallback>CN</Avatar.Fallback>
</Avatar.Root>
```

Supports custom styling via `class` prop and can be grouped with overlapping effects.

### badge
A reusable badge component with multiple style variants and support for custom styling and link badges.

## Badge Component

Displays styled badge elements with multiple variants (default, secondary, destructive, outline).

### Installation
```bash
pnpm dlx shadcn-svelte@latest add badge
```

### Usage
```svelte
<script lang="ts">
  import { Badge } from "$lib/components/ui/badge/index.js";
</script>

<Badge variant="outline">Badge</Badge>
```

### Link Badge
```svelte
<a href="/dashboard" class={badgeVariants({ variant: "outline" })}>Badge</a>
```

### breadcrumb
Breadcrumb component for displaying hierarchical navigation paths with support for custom separators, dropdowns, collapsing, and responsive behavior.

## Breadcrumb Component

Hierarchical navigation path display with links and separators.

**Installation:** `pnpm dlx shadcn-svelte@latest add breadcrumb`

**Basic structure:** `<Breadcrumb.Root>` → `<Breadcrumb.List>` → `<Breadcrumb.Item>` with `<Breadcrumb.Link>` or `<Breadcrumb.Page>`, separated by `<Breadcrumb.Separator />`

**Features:**
- Custom separators via slot
- Dropdown menus in items
- `<Breadcrumb.Ellipsis />` for collapsed state
- `asChild` prop for custom link components
- Responsive example with desktop dropdown / mobile drawer

### button-group
A container component for grouping related buttons with consistent styling, supporting vertical orientation, separators, and integration with other UI components.

## Button Group

Groups related buttons with consistent styling. Set `orientation="vertical"` for vertical layout. Use `ButtonGroup.Separator` to divide buttons. Can nest groups and integrate with Input, Select, DropdownMenu, or Popover components.

```svelte
<ButtonGroup.Root>
  <Button>Button 1</Button>
  <Button>Button 2</Button>
</ButtonGroup.Root>
```

### button
Reusable button component supporting multiple variants, sizes, icons, and link rendering.

## Button Component

Reusable button that renders as `<button>` or `<a>` with multiple variants.

### Installation
```bash
pnpm dlx shadcn-svelte@latest add button
```

### Usage
```svelte
<Button>Button</Button>
<Button href="/dashboard">Dashboard</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
```

### With Icons
```svelte
<Button variant="outline" size="sm">
  <GitBranchIcon />
  Login with Email
</Button>
```

### Icon-only
```svelte
<Button variant="secondary" size="icon" class="size-8">
  <ChevronRightIcon />
</Button>
```

### Loading
```svelte
<Button disabled>
  <Loader2Icon class="animate-spin" />
  Please wait
</Button>
```

### calendar
Date selection component with support for single dates, multiple months, dropdowns, and natural language parsing.

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

### card
Composable card component with header, title, description, action, content, and footer sections.

## Card Component

Composable card with `Card.Root`, `Card.Header`, `Card.Title`, `Card.Description`, `Card.Action`, `Card.Content`, and `Card.Footer` sections.

```svelte
<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
</script>

<Card.Root>
  <Card.Header>
    <Card.Title>Title</Card.Title>
    <Card.Description>Description</Card.Description>
    <Card.Action><Button>Action</Button></Card.Action>
  </Card.Header>
  <Card.Content>Content</Card.Content>
  <Card.Footer>Footer</Card.Footer>
</Card.Root>
```

### carousel
Carousel component built on Embla Carousel with sizing, spacing, orientation, API access, events, and plugin support.

## Carousel Component

Built on Embla Carousel with motion and swipe support.

### Installation
```bash
pnpm dlx shadcn-svelte@latest add carousel
```

### Basic Usage
```svelte
<Carousel.Root>
  <Carousel.Content>
    <Carousel.Item>...</Carousel.Item>
  </Carousel.Content>
  <Carousel.Previous />
  <Carousel.Next />
</Carousel.Root>
```

### Sizing & Spacing
- Size items: `<Carousel.Item class="md:basis-1/2 lg:basis-1/3">`
- Spacing: `<Carousel.Content class="-ml-4">` + `<Carousel.Item class="pl-4">`

### Orientation
```svelte
<Carousel.Root orientation="vertical">
```

### Options
```svelte
<Carousel.Root opts={{ align: "start", loop: true }}>
```

### API Access
```svelte
<script lang="ts">
  let api = $state<CarouselAPI>();
  $effect(() => {
    if (api) {
      api.on("select", () => { /* ... */ });
    }
  });
</script>
<Carousel.Root setApi={(emblaApi) => (api = emblaApi)}>
```

### Plugins
```svelte
<script lang="ts">
  import Autoplay from "embla-carousel-autoplay";
  const plugin = Autoplay({ delay: 2000, stopOnInteraction: true });
</script>
<Carousel.Root plugins={[plugin]} onmouseenter={plugin.stop} onmouseleave={plugin.reset}>
```

### chart
Copy-paste chart components built on LayerChart with composition-based design, chart config for theming, and customizable tooltips.

## Chart Component

Copy-paste chart components built on LayerChart. Composition-based: use LayerChart components directly, add custom components like `Chart.Tooltip` only when needed.

### Installation
```bash
pnpm dlx shadcn-svelte@latest add chart
```

### Basic Example
```svelte
<script lang="ts">
  import * as Chart from "$lib/components/ui/chart/index.js";
  import { BarChart } from "layerchart";
  
  const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
  ];
  
  const chartConfig = {
    desktop: { label: "Desktop", color: "#2563eb" },
    mobile: { label: "Mobile", color: "#60a5fa" },
  } satisfies Chart.ChartConfig;
</script>

<Chart.Container config={chartConfig}>
  <BarChart data={chartData} x="month" series={[
    { key: "desktop", label: chartConfig.desktop.label, color: chartConfig.desktop.color },
    { key: "mobile", label: chartConfig.mobile.label, color: chartConfig.mobile.color },
  ]}>
    {#snippet tooltip()}
      <Chart.Tooltip />
    {/snippet}
  </BarChart>
</Chart.Container>
```

### Chart Config
Decoupled from data. Supports icons and theme objects with light/dark variants.

### Theming
Use CSS variables or direct colors (hex, hsl, oklch). Reference: `color: "var(--chart-1)"` or `fill="var(--color-desktop)"`

### Tooltip Props
`labelKey`, `nameKey`, `indicator` (`dot`|`line`|`dashed`), `hideLabel`, `hideIndicator`, `labelFormatter`, `formatter`

### checkbox
Checkbox component for toggling between checked and unchecked states with support for labels, disabled state, custom styling, and form integration.

## Checkbox Component

Toggle control for checked/unchecked states.

**Installation:** `npm install shadcn-svelte@latest add checkbox`

**Basic:** `<Checkbox />` with optional `checked` and `disabled` props

**With Label:**
```svelte
<Checkbox id="terms" />
<Label for="terms">Accept terms</Label>
```

**Form Integration:**
```svelte
<Checkbox
  checked={$formData.items.includes(item.id)}
  onCheckedChange={(v) => v ? addItem(id) : removeItem(id)}
/>
```

**Styling:** Use `class` prop with `data-[state=checked]` selectors

### collapsible
Collapsible component for expanding/collapsing content panels with Trigger and Content subcomponents.

## Collapsible Component

Expandable/collapsible panel component.

### Installation
```bash
npm install shadcn-svelte@latest add collapsible
```

### Usage
```svelte
<script lang="ts">
  import * as Collapsible from "$lib/components/ui/collapsible/index.js";
</script>

<Collapsible.Root>
  <Collapsible.Trigger>Toggle</Collapsible.Trigger>
  <Collapsible.Content>Hidden content</Collapsible.Content>
</Collapsible.Root>
```

**Components:** `Root`, `Trigger`, `Content`

### combobox
Searchable dropdown component combining Popover and Command with examples for status selection, dropdown menus, and form integration.

## Combobox

Searchable dropdown built from Popover + Command components. Requires both components installed.

**Basic example:**
```svelte
<Popover.Root bind:open>
  <Popover.Trigger>
    <Button role="combobox" aria-expanded={open}>
      {selectedValue || "Select..."}
    </Button>
  </Popover.Trigger>
  <Popover.Content class="p-0">
    <Command.Root>
      <Command.Input placeholder="Search..." />
      <Command.List>
        <Command.Group>
          {#each items as item}
            <Command.Item value={item.value} onSelect={() => { value = item.value; }}>
              {item.label}
            </Command.Item>
          {/each}
        </Command.Group>
      </Command.List>
    </Command.Root>
  </Popover.Content>
</Popover.Root>
```

**Form integration:** Wrap in Form.Field, use Form.Control as trigger wrapper, add hidden input with form value. Requires formsnap v0.5.0+.

### command
Composable command menu component with dialog support and keyboard shortcuts.

## Command Component

Fast, composable command menu for Svelte.

### Installation
```bash
npm install shadcn-svelte@latest add command
```

### Basic Usage
```svelte
<Command.Root>
  <Command.Input placeholder="Type a command or search..." />
  <Command.List>
    <Command.Empty>No results found.</Command.Empty>
    <Command.Group heading="Suggestions">
      <Command.Item>Calendar</Command.Item>
    </Command.Group>
  </Command.List>
</Command.Root>
```

### Dialog with Keyboard Shortcut
```svelte
<script lang="ts">
  let open = $state(false);
  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      open = !open;
    }
  }
</script>
<svelte:document onkeydown={handleKeydown} />
<Command.Dialog bind:open>
  <Command.Input placeholder="Type a command or search..." />
  <Command.List>
    <Command.Empty>No results found.</Command.Empty>
    <Command.Group heading="Suggestions">
      <Command.Item>Calendar</Command.Item>
    </Command.Group>
  </Command.List>
</Command.Dialog>
```

### Components
`Command.Root`, `Command.Dialog`, `Command.Input`, `Command.List`, `Command.Empty`, `Command.Group`, `Command.Item`, `Command.Separator`, `Command.Shortcut`

### context-menu
A right-click context menu component with support for items, submenus, checkboxes, radio groups, and keyboard shortcuts.

## Context Menu

Right-click triggered menu component.

```svelte
<script lang="ts">
  import * as ContextMenu from "$lib/components/ui/context-menu/index.js";
</script>

<ContextMenu.Root>
  <ContextMenu.Trigger>Right click</ContextMenu.Trigger>
  <ContextMenu.Content>
    <ContextMenu.Item>Profile</ContextMenu.Item>
    <ContextMenu.CheckboxItem bind:checked={show}>Show</ContextMenu.CheckboxItem>
    <ContextMenu.RadioGroup bind:value>
      <ContextMenu.RadioItem value="a">Option A</ContextMenu.RadioItem>
      <ContextMenu.RadioItem value="b">Option B</ContextMenu.RadioItem>
    </ContextMenu.RadioGroup>
  </ContextMenu.Content>
</ContextMenu.Root>
```

Supports submenus, separators, disabled items, shortcuts, checkboxes, and radio groups.

### data-table
Build custom data tables with TanStack Table v8 using Svelte 5 snippets and components, supporting pagination, sorting, filtering, column visibility, and row selection.

## Data Table with TanStack Table v8

Install: `npm i @tanstack/table-core && npx shadcn-svelte@latest add table data-table`

Create reusable `<DataTable>` component with `createSvelteTable()` and `getCoreRowModel()`. Use `FlexRender` to render headers and cells from column definitions.

Format cells with `createRawSnippet()` and `renderSnippet()`. Add row actions with `renderComponent()`.

Enable features by adding state and row models:
- **Pagination**: `PaginationState` + `getPaginationRowModel()` + Previous/Next buttons
- **Sorting**: `SortingState` + `getSortedRowModel()` + `column.getToggleSortingHandler()`
- **Filtering**: `ColumnFiltersState` + `getFilteredRowModel()` + `table.getColumn("email")?.setFilterValue()`
- **Visibility**: `VisibilityState` + dropdown to toggle `column.toggleVisibility()`
- **Row Selection**: `RowSelectionState` + select column with checkboxes + `table.getFilteredSelectedRowModel()`

### date-picker
Date picker component supporting single dates, date ranges, presets, and form integration.

## Date Picker

Composable date picker built from Popover + Calendar/RangeCalendar components.

**Basic single date picker:**
```svelte
<Popover.Root>
  <Popover.Trigger>
    {#snippet child({ props })}
      <Button {...props}>{value ? format(value) : "Select a date"}</Button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content class="w-auto p-0">
    <Calendar bind:value type="single" initialFocus />
  </Popover.Content>
</Popover.Root>
```

**Date range picker:** Use RangeCalendar with `numberOfMonths={2}` and track `startValue` via `onStartValueChange`.

**With presets:** Add Select component inside Popover.Content for quick date options.

**Form integration:** Use with sveltekit-superforms, set Calendar `minValue`/`maxValue`, update form data via `onValueChange`.

### dialog
Modal dialog component with composable subcomponents for building overlay windows.

## Dialog Component

Modal overlay component with `Dialog.Root`, `Dialog.Trigger`, `Dialog.Content`, `Dialog.Header`, `Dialog.Title`, `Dialog.Description`, and `Dialog.Footer` subcomponents.

Installation: `pnpm dlx shadcn-svelte@latest add dialog`

```svelte
<Dialog.Root>
  <Dialog.Trigger>Open</Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Title</Dialog.Title>
      <Dialog.Description>Description</Dialog.Description>
    </Dialog.Header>
  </Dialog.Content>
</Dialog.Root>
```

### drawer
Drawer component for Svelte with responsive Dialog/Drawer pattern support.

## Drawer Component

Built on Vaul Svelte. Install with `npm install shadcn-svelte@latest add drawer`.

**Basic usage:**
```svelte
<Drawer.Root>
  <Drawer.Trigger>Open</Drawer.Trigger>
  <Drawer.Content>
    <Drawer.Header>
      <Drawer.Title>Title</Drawer.Title>
    </Drawer.Header>
    <Drawer.Footer>
      <Drawer.Close>Cancel</Drawer.Close>
    </Drawer.Footer>
  </Drawer.Content>
</Drawer.Root>
```

**Responsive Dialog/Drawer:** Use MediaQuery to render Dialog on desktop and Drawer on mobile.

### dropdown_menu
Dropdown menu component with support for items, groups, checkboxes, radio buttons, and nested submenus.

## Dropdown Menu

Menu component triggered by a button, displaying actions or functions.

**Installation:** `pnpm dlx shadcn-svelte@latest add dropdown-menu`

**Basic structure:**
```svelte
<DropdownMenu.Root>
  <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Item>Action</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
```

**Key components:** Root, Trigger, Content, Group, Label, Item, Separator, Sub/SubTrigger/SubContent, Shortcut, CheckboxItem, RadioGroup/RadioItem

**Stateful items:**
```svelte
<DropdownMenu.CheckboxItem bind:checked={state}>Label</DropdownMenu.CheckboxItem>
<DropdownMenu.RadioGroup bind:value={selected}>
  <DropdownMenu.RadioItem value="option">Option</DropdownMenu.RadioItem>
</DropdownMenu.RadioGroup>
```

### empty
Component for displaying empty states with customizable header, media, title, description, and content sections.

## Empty Component

Display empty states with icon, title, description, and content sections.

### Installation
```bash
pnpm dlx shadcn-svelte@latest add empty
```

### Basic Usage
```svelte
<Empty.Root>
  <Empty.Header>
    <Empty.Media variant="icon"><FolderCodeIcon /></Empty.Media>
    <Empty.Title>No data</Empty.Title>
    <Empty.Description>No data found</Empty.Description>
  </Empty.Header>
  <Empty.Content>
    <Button>Add data</Button>
  </Empty.Content>
</Empty.Root>
```

### Variants
- **Outline**: Add `border border-dashed` class
- **Background**: Use gradient utilities like `bg-gradient-to-b`
- **Avatar**: Use `Empty.Media variant="default"` for custom content
- **With InputGroup**: Combine with InputGroup for search functionality

### field
Composable form field components for building accessible forms with flexible layouts and validation support.

## Field Component

Composable form field components with labels, descriptions, and error messages.

### Installation
```bash
pnpm dlx shadcn-svelte@latest add field
```

### Core Components
`Field`, `FieldLabel`, `FieldDescription`, `FieldError`, `FieldGroup`, `FieldSet`, `FieldLegend`, `FieldContent`, `FieldSeparator`, `FieldTitle`

### Orientations
- `vertical` (default) - stacks elements
- `horizontal` - side-by-side layout
- `responsive` - container-query based

### Validation
```svelte
<Field.Field data-invalid>
  <Field.Label for="email">Email</Field.Label>
  <Input id="email" aria-invalid />
  <Field.Error>Invalid email</Field.Error>
</Field.Field>
```

### Accessibility
Semantic HTML with `FieldSet`/`FieldLegend`, `role="group"` on Field, and screen reader support via `FieldSeparator`.

### form
Guide to building accessible, type-safe forms using shadcn-svelte's Form components with Formsnap, Superforms, and Zod validation.

## Form Components

Build accessible, type-safe forms with Formsnap, Superforms, and Zod validation.

**Setup**: Define Zod schema → setup load function with `superValidate` → create form component using `Form.Field`, `Form.Control`, `Form.Label`, `Form.FieldErrors` → create server action for validation.

**Example**:
```svelte
<script>
  import * as Form from "$lib/components/ui/form/index.js";
  import { superForm } from "sveltekit-superforms";
  import { zod4Client } from "sveltekit-superforms/adapters";
  
  const form = superForm(data.form, { validators: zod4Client(formSchema) });
  const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance>
  <Form.Field {form} name="username">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Username</Form.Label>
        <Input {...props} bind:value={$formData.username} />
      {/snippet}
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>
</form>
```

**Install**: `pnpm dlx shadcn-svelte@latest add form`

### hover-card
A component that shows preview content when hovering over a link, built on Bits UI.

## Hover Card

Displays preview content on hover over a link.

```svelte
<HoverCard.Root>
  <HoverCard.Trigger>Hover</HoverCard.Trigger>
  <HoverCard.Content>Preview content</HoverCard.Content>
</HoverCard.Root>
```

Install: `pnpm dlx shadcn-svelte@latest add hover-card`

### input-group
Input group component for adding prefixes, suffixes, icons, buttons, and other UI elements around input and textarea fields.

## Input Group

Component for adding prefixes, suffixes, and actions to inputs/textareas.

### Installation
```bash
pnpm dlx shadcn-svelte@latest add input-group
```

### Basic Usage
```svelte
<InputGroup.Root>
  <InputGroup.Input placeholder="Search..." />
  <InputGroup.Addon><SearchIcon /></InputGroup.Addon>
  <InputGroup.Addon align="inline-end"><InputGroup.Button>Search</InputGroup.Button></InputGroup.Addon>
</InputGroup.Root>
```

### Components
- `InputGroup.Root` - Container
- `InputGroup.Input` / `InputGroup.Textarea` - Input fields
- `InputGroup.Addon` - Prefix/suffix container with `align` prop (`inline-end`, `block-start`, `block-end`)
- `InputGroup.Button` - Action button
- `InputGroup.Text` - Static text

### Examples
**Icons, text, buttons, tooltips, spinners, dropdowns, custom inputs, button groups**

### input-otp
Accessible OTP input component with customizable patterns, separators, and form integration support.

## Input OTP

Accessible one-time password component with copy-paste functionality.

### Installation

```bash
npm install shadcn-svelte@latest add input-otp
```

### Basic Usage

```svelte
<InputOTP.Root maxlength={6}>
  {#snippet children({ cells })}
    <InputOTP.Group>
      {#each cells as cell (cell)}
        <InputOTP.Slot {cell} />
      {/each}
    </InputOTP.Group>
  {/snippet}
</InputOTP.Root>
```

### Key Features

- `pattern` prop for input validation (e.g., `REGEXP_ONLY_DIGITS_AND_CHARS`)
- `aria-invalid` for error states
- `InputOTP.Separator` for visual grouping
- Form integration with sveltekit-superforms

### input
A reusable form input component supporting various input types with optional label, validation, and helper text integration.

## Input Component

Form input field component supporting text, email, file types and more.

### Installation
```bash
npm install shadcn-svelte@latest add input
```

### Usage
```svelte
<script lang="ts">
  import { Input } from "$lib/components/ui/input/index.js";
</script>
<Input type="email" placeholder="email" />
```

### Examples
- **Disabled:** `<Input disabled type="email" />`
- **With label:** Wrap with Label component
- **With helper text:** Add `<p>` below input
- **With button:** Combine in form with Button component
- **Invalid state:** Use `aria-invalid` attribute
- **File input:** `<Input type="file" />`
- **Form validation:** Integrate with sveltekit-superforms and zod for schema validation

### item
Versatile flex container component for displaying content with optional media, title, description, and actions, supporting variants, sizes, and grouping.

## Item Component

Flex container for displaying content with title, description, media, and actions.

**Installation:** `pnpm dlx shadcn-svelte@latest add item`

**Variants:** `default`, `outline`, `muted`  
**Sizes:** `default`, `sm`

**Basic:**
```svelte
<Item.Root>
  <Item.Content>
    <Item.Title>Title</Item.Title>
    <Item.Description>Description</Item.Description>
  </Item.Content>
  <Item.Actions><button>Action</button></Item.Actions>
</Item.Root>
```

**As Link:**
```svelte
<Item.Root>
  {#snippet child({ props })}
    <a href="/" {...props}>
      <Item.Content><Item.Title>Link</Item.Title></Item.Content>
    </a>
  {/snippet}
</Item.Root>
```

**Grouped:**
```svelte
<Item.Group>
  {#each items as item}
    <Item.Root>...</Item.Root>
    <Item.Separator />
  {/each}
</Item.Group>
```

Use `Field` for form inputs, `Item` for content display.

### kbd
Component for displaying keyboard input with support for grouping and integration with other UI components.

## Kbd Component

Display keyboard input with `Kbd.Root` and group with `Kbd.Group`.

**Installation:** `pnpm dlx shadcn-svelte@latest add kbd`

**Basic:** `<Kbd.Root>B</Kbd.Root>`

**Group:** `<Kbd.Group><Kbd.Root>Ctrl</Kbd.Root><Kbd.Root>K</Kbd.Root></Kbd.Group>`

Works inside Button, Tooltip, and InputGroup components.

### label
Accessible label component that associates with form controls via the `for` prop.

## Label

Accessible label component for form controls.

```svelte
<Label for="terms">Accept terms and conditions</Label>
```

Install with `pnpm dlx shadcn-svelte@latest add label`

### menubar
Desktop application menubar component with items, checkboxes, radio groups, submenus, and keyboard shortcuts.

## Menubar Component

Desktop application menu UI with support for items, checkboxes, radio groups, submenus, and keyboard shortcuts.

### Installation
```bash
pnpm dlx shadcn-svelte@latest add menubar
```

### Example
```svelte
<script lang="ts">
  import * as Menubar from "$lib/components/ui/menubar/index.js";
</script>

<Menubar.Root>
  <Menubar.Menu>
    <Menubar.Trigger>File</Menubar.Trigger>
    <Menubar.Content>
      <Menubar.Item>New Tab <Menubar.Shortcut>T</Menubar.Shortcut></Menubar.Item>
      <Menubar.CheckboxItem bind:checked={state}>Show Bookmarks</Menubar.CheckboxItem>
      <Menubar.Separator />
      <Menubar.Sub>
        <Menubar.SubTrigger>Share</Menubar.SubTrigger>
        <Menubar.SubContent>
          <Menubar.Item>Email</Menubar.Item>
        </Menubar.SubContent>
      </Menubar.Sub>
    </Menubar.Content>
  </Menubar.Menu>
</Menubar.Root>
```

### native-select
Native HTML select component with design system styling, option grouping, and accessibility features.

## Native Select

Styled native HTML select with design system integration.

```svelte
import * as NativeSelect from "$lib/components/ui/native-select/index.js";

<NativeSelect.Root>
  <NativeSelect.Option value="">Select status</NativeSelect.Option>
  <NativeSelect.Option value="todo">Todo</NativeSelect.Option>
</NativeSelect.Root>
```

**Option Groups:**
```svelte
<NativeSelect.OptGroup label="Engineering">
  <NativeSelect.Option value="frontend">Frontend</NativeSelect.Option>
</NativeSelect.OptGroup>
```

**States:** `disabled` prop, `aria-invalid="true"` for validation

**API:** NativeSelect.Root, NativeSelect.Option (value, disabled, class), NativeSelect.OptGroup (label, disabled, class)

**Use NativeSelect** for native behavior and mobile optimization; use Select for custom styling.

### navigation-menu
Navigation menu component with triggers and collapsible content sections for website navigation.

## Navigation Menu

Navigational component with triggers and dropdown content.

```svelte
<NavigationMenu.Root>
  <NavigationMenu.List>
    <NavigationMenu.Item>
      <NavigationMenu.Trigger>Menu</NavigationMenu.Trigger>
      <NavigationMenu.Content>
        <NavigationMenu.Link>Link</NavigationMenu.Link>
      </NavigationMenu.Content>
    </NavigationMenu.Item>
  </NavigationMenu.List>
</NavigationMenu.Root>
```

Install: `pnpm dlx shadcn-svelte@latest add navigation-menu`

Key parts: `Root`, `List`, `Item`, `Trigger`, `Content`, `Link`. Supports custom rendering via snippets and responsive grid layouts.

### pagination
Pagination component for navigating through pages with customizable items per page and sibling count.

## Pagination Component

Navigable pagination UI with page numbers, prev/next buttons, and ellipsis.

```svelte
<Pagination.Root count={100} perPage={10}>
  {#snippet children({ pages, currentPage })}
    <Pagination.Content>
      <Pagination.Item><Pagination.PrevButton /></Pagination.Item>
      {#each pages as page (page.key)}
        {#if page.type === "ellipsis"}
          <Pagination.Item><Pagination.Ellipsis /></Pagination.Item>
        {:else}
          <Pagination.Item>
            <Pagination.Link {page} isActive={currentPage === page.value}>
              {page.value}
            </Pagination.Link>
          </Pagination.Item>
        {/if}
      {/each}
      <Pagination.Item><Pagination.NextButton /></Pagination.Item>
    </Pagination.Content>
  {/snippet}
</Pagination.Root>
```

Install: `pnpm dlx shadcn-svelte@latest add pagination`

### popover
A portal component that displays content triggered by a button, with Root, Trigger, and Content subcomponents.

## Popover Component

Displays rich content in a portal triggered by a button.

### Installation

```bash
pnpm dlx shadcn-svelte@latest add popover
```

### Usage

```svelte
<script lang="ts">
  import * as Popover from "$lib/components/ui/popover/index.js";
</script>

<Popover.Root>
  <Popover.Trigger>Open</Popover.Trigger>
  <Popover.Content>Place content for the popover here.</Popover.Content>
</Popover.Root>
```

### progress
A progress bar component that displays task completion with reactive value updates.

## Progress Component

Displays task completion progress as a progress bar.

### Installation
```bash
npm install shadcn-svelte@latest add progress
```

### Usage
```svelte
<script lang="ts">
  import { Progress } from "$lib/components/ui/progress/index.js";
  let value = $state(13);
</script>
<Progress {value} max={100} class="w-[60%]" />
```

Props: `value`, `max`, `class`

### radio-group
Mutually exclusive radio button component with form integration support.

## Radio Group

Mutually exclusive radio button component.

### Installation
```bash
pnpm dlx shadcn-svelte@latest add radio-group
```

### Basic Usage
```svelte
<RadioGroup.Root value="option-one">
  <div class="flex items-center space-x-2">
    <RadioGroup.Item value="option-one" id="option-one" />
    <Label for="option-one">Option One</Label>
  </div>
  <div class="flex items-center space-x-2">
    <RadioGroup.Item value="option-two" id="option-two" />
    <Label for="option-two">Option Two</Label>
  </div>
</RadioGroup.Root>
```

### Form Integration
Bind to form state with `bind:value={$formData.fieldName}` and use with `Form.Control` and `Form.Fieldset` for validation.

### range-calendar
A date range picker calendar component built on Bits UI with internationalization support.

Calendar component for date range selection using @internationalized/date. Initialize with `start` and `end` dates, bind to `value` prop, and apply classes for styling.

```svelte
<RangeCalendar bind:value class="rounded-md border" />
```

### resizable
Resizable panel component for creating accessible, keyboard-navigable draggable panel layouts in horizontal or vertical directions.

## Resizable

Accessible resizable panel groups with keyboard support, built on PaneForge.

```svelte
<Resizable.PaneGroup direction="horizontal">
  <Resizable.Pane defaultSize={50}>Content</Resizable.Pane>
  <Resizable.Handle withHandle />
  <Resizable.Pane defaultSize={50}>Content</Resizable.Pane>
</Resizable.PaneGroup>
```

Key props: `direction` ("horizontal"/"vertical"), `defaultSize` (percentage), `withHandle` (show visual handle). Panels can be nested.

### scroll-area
Scroll Area component for custom-styled scrollable containers with support for vertical, horizontal, or bidirectional scrolling.

## Scroll Area

Custom scrollable container with cross-browser styling.

**Installation:** `npm install shadcn-svelte@latest add scroll-area`

**Basic usage:**
```svelte
<ScrollArea class="h-[200px] w-[350px] rounded-md border p-4">
  Content...
</ScrollArea>
```

**Orientations:** `orientation="horizontal"` or `orientation="both"` for different scroll directions.

### select
Select dropdown component with single/multiple selection, grouping, and form integration support.

## Select Component

Dropdown component for picking from a list of options.

### Installation
```bash
pnpm dlx shadcn-svelte@latest add select
```

### Basic Usage
```svelte
<Select.Root type="single">
  <Select.Trigger>Select a fruit</Select.Trigger>
  <Select.Content>
    <Select.Item value="apple" label="Apple">Apple</Select.Item>
    <Select.Item value="banana" label="Banana">Banana</Select.Item>
  </Select.Content>
</Select.Root>
```

### Form Integration
```svelte
<Select.Root type="single" bind:value={$formData.email} name={props.name}>
  <Select.Trigger {...props}>{$formData.email || "Select email"}</Select.Trigger>
  <Select.Content>
    <Select.Item value="m@example.com" label="m@example.com" />
  </Select.Content>
</Select.Root>
```

Supports grouping, disabled items, and form validation.

### separator
A component for visually separating content horizontally or vertically.

## Separator

Visual content separator component. Supports horizontal and vertical orientations.

```svelte
<Separator class="my-4" />
<Separator orientation="vertical" />
```

### sheet
Sheet component for displaying dialog-based content sliding from screen edges with configurable positioning and sizing.

## Sheet Component

Dialog-based component for displaying complementary content from screen edges.

### Installation
```bash
pnpm dlx shadcn-svelte@latest add sheet
```

### Basic Usage
```svelte
<Sheet.Root>
  <Sheet.Trigger>Open</Sheet.Trigger>
  <Sheet.Content side="right">
    <Sheet.Header>
      <Sheet.Title>Title</Sheet.Title>
      <Sheet.Description>Description</Sheet.Description>
    </Sheet.Header>
  </Sheet.Content>
</Sheet.Root>
```

### Key Features
- `side` prop: `top`, `right`, `bottom`, `left`
- Size with CSS classes: `class="w-[400px] sm:w-[540px]"`
- Components: Root, Trigger, Content, Header, Title, Description, Footer, Close

### sidebar
Composable, themeable sidebar component with collapsible states, menus, and customizable layout variants.

## Installation

`pnpm dlx shadcn-svelte@latest add sidebar` + add CSS variables for theming.

## Basic Setup

```svelte
<Sidebar.Provider>
  <Sidebar.Root>
    <Sidebar.Header />
    <Sidebar.Content>
      <Sidebar.Group />
    </Sidebar.Content>
    <Sidebar.Footer />
  </Sidebar.Root>
  <main>
    <Sidebar.Trigger />
  </main>
</Sidebar.Provider>
```

## Menu Example

```svelte
<Sidebar.Group>
  <Sidebar.GroupLabel>Application</Sidebar.GroupLabel>
  <Sidebar.GroupContent>
    <Sidebar.Menu>
      {#each items as item}
        <Sidebar.MenuItem>
          <Sidebar.MenuButton>
            {#snippet child({ props })}
              <a href={item.url} {...props}>
                <item.icon />
                <span>{item.title}</span>
              </a>
            {/snippet}
          </Sidebar.MenuButton>
        </Sidebar.MenuItem>
      {/each}
    </Sidebar.Menu>
  </Sidebar.GroupContent>
</Sidebar.Group>
```

## Key Props

**Sidebar.Root**: `side` ("left"/"right"), `variant` ("sidebar"/"floating"/"inset"), `collapsible` ("offcanvas"/"icon"/"none")

**Sidebar.Provider**: `open` (bindable boolean), `onOpenChange` callback. Set width with `--sidebar-width` CSS variable.

## useSidebar Hook

```svelte
const sidebar = useSidebar();
sidebar.state; // "expanded" or "collapsed"
sidebar.open; // boolean
sidebar.toggle(); // toggle sidebar
sidebar.isMobile; // boolean
```

## Components

`Sidebar.Header/Footer` (sticky), `Sidebar.Content` (scrollable), `Sidebar.Group` (sections, can be collapsible), `Sidebar.Menu/MenuItem/MenuButton/MenuAction/MenuSub`, `Sidebar.MenuBadge`, `Sidebar.MenuSkeleton`, `Sidebar.Separator`, `Sidebar.Trigger`, `Sidebar.Rail`

## Custom Trigger

```svelte
<button onclick={() => useSidebar().toggle()}>Toggle</button>
```

## Controlled State

```svelte
<Sidebar.Provider bind:open={() => myOpen, (newOpen) => (myOpen = newOpen)}>
```

### skeleton
A placeholder component for displaying loading states with customizable dimensions via Tailwind CSS classes.

## Skeleton

Placeholder component for loading states.

```svelte
import { Skeleton } from "$lib/components/ui/skeleton/index.js";

<Skeleton class="h-4 w-[250px]" />
```

Style with Tailwind CSS utilities via the `class` prop.

### slider
A range input component supporting single/multiple value selection with configurable max, step, and vertical orientation.

## Slider Component

Range input for selecting single or multiple values.

### Installation
```bash
pnpm dlx shadcn-svelte@latest add slider
```

### Usage
```svelte
<script lang="ts">
  import { Slider } from "$lib/components/ui/slider/index.js";
  let value = $state(33);
</script>
<Slider type="single" bind:value max={100} step={1} />
```

### Multiple Values & Vertical
```svelte
<Slider type="multiple" bind:value max={100} step={1} />
<Slider type="single" orientation="vertical" bind:value max={100} step={1} />
```

### sonner
Toast notification component with support for success/error types, descriptions, and action buttons.

Toast component for Svelte. Install with `pnpm dlx shadcn-svelte@latest add sonner`, add `<Toaster />` to root layout, then use `toast()` or `toast.success()` with message and optional config:

```svelte
<Button onclick={() => toast.success("Event created", {
  description: "Sunday, December 03, 2023 at 9:00 AM",
  action: { label: "Undo", onClick: () => console.info("Undo") }
})}>Show Toast</Button>
```

### spinner
A customizable animated spinner component for indicating loading states.

Loading indicator component with animated spinning icon.

**Install:** `pnpm dlx shadcn-svelte@latest add spinner`

**Usage:** `<Spinner />` with `size-*` and `text-*` utility classes for sizing and color.

**Use in:** buttons, badges, input groups, empty states, item lists.

### switch
Toggle control component for boolean form fields with form integration support.

## Switch Component

Toggle control for boolean states.

### Installation
```bash
npx shadcn-svelte@latest add switch
```

### Basic Usage
```svelte
<Switch id="airplane-mode" />
<Label for="airplane-mode">Airplane Mode</Label>
```

### Form Integration
```svelte
<Form.Field {form} name="marketing_emails">
  <Form.Control>
    {#snippet children({ props })}
      <Form.Label>Marketing emails</Form.Label>
      <Switch {...props} bind:checked={$formData.marketing_emails} />
    {/snippet}
  </Form.Control>
</Form.Field>
```

Supports `disabled` and `aria-readonly` attributes.

### table
Responsive table component with composable subcomponents for headers, rows, cells, and footers.

## Table Component

Responsive table component with `Table.Root`, `Table.Header`, `Table.Body`, `Table.Footer`, `Table.Row`, `Table.Head`, and `Table.Cell` subcomponents.

```svelte
import * as Table from "$lib/components/ui/table/index.js";

<Table.Root>
  <Table.Header>
    <Table.Row>
      <Table.Head>Invoice</Table.Head>
      <Table.Head class="text-right">Amount</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {#each invoices as invoice}
      <Table.Row>
        <Table.Cell>{invoice.invoice}</Table.Cell>
        <Table.Cell class="text-right">{invoice.totalAmount}</Table.Cell>
      </Table.Row>
    {/each}
  </Table.Body>
  <Table.Footer>
    <Table.Row>
      <Table.Cell colspan={2}>Total</Table.Cell>
    </Table.Row>
  </Table.Footer>
</Table.Root>
```

### tabs
Tabbed interface component for displaying multiple content sections with one visible at a time.

## Tabs Component

Layered content sections displayed one at a time.

### Installation
```bash
pnpm dlx shadcn-svelte@latest add tabs
```

### Usage
```svelte
<script lang="ts">
  import * as Tabs from "$lib/components/ui/tabs/index.js";
</script>

<Tabs.Root value="account">
  <Tabs.List>
    <Tabs.Trigger value="account">Account</Tabs.Trigger>
    <Tabs.Trigger value="password">Password</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="account">Account content</Tabs.Content>
  <Tabs.Content value="password">Password content</Tabs.Content>
</Tabs.Root>
```

Components: `Tabs.Root` (container), `Tabs.List` (trigger container), `Tabs.Trigger` (tab button), `Tabs.Content` (panel).

### textarea
Textarea component for form inputs with support for labels, validation, and disabled states.

## Textarea Component

Install: `npm install shadcn-svelte@latest add textarea`

Import: `import { Textarea } from "$lib/components/ui/textarea/index.js";`

**Basic:** `<Textarea placeholder="Type your message here." />`

**Disabled:** `<Textarea disabled placeholder="..." />`

**With label and helper text:**
```svelte
<Label for="message">Your message</Label>
<Textarea placeholder="..." id="message" />
<p class="text-muted-foreground text-sm">Helper text</p>
```

**Form with validation:**
```svelte
<Form.Field {form} name="bio">
  <Form.Control>
    {#snippet children({ props })}
      <Form.Label>Bio</Form.Label>
      <Textarea {...props} bind:value={$formData.bio} />
    {/snippet}
  </Form.Control>
  <Form.FieldErrors />
</Form.Field>
```

### toggle-group
A two-state button group component with single/multiple selection modes, customizable sizes and variants.

## Toggle Group

Two-state button group component. Install with `pnpm dlx shadcn-svelte@latest add toggle-group`.

```svelte
<ToggleGroup.Root type="single">
  <ToggleGroup.Item value="a">A</ToggleGroup.Item>
  <ToggleGroup.Item value="b">B</ToggleGroup.Item>
</ToggleGroup.Root>
```

Props: `type` ("single" or "multiple"), `variant` ("outline"), `size` ("sm", "lg"), `disabled`.

### toggle
Two-state toggle button component with variants, sizes, and disabled state support.

## Toggle Component

Two-state button that toggles between on/off.

**Installation**: `npm install shadcn-svelte@latest add toggle`

**Basic usage**:
```svelte
<Toggle>Toggle</Toggle>
```

**Props**: `variant` ("default" | "outline"), `size` ("sm" | "lg"), `disabled`, `aria-label`

**Examples**:
- Icon: `<Toggle aria-label="toggle bold"><BoldIcon class="size-4" /></Toggle>`
- With text: `<Toggle><ItalicIcon class="mr-2 size-4" />Italic</Toggle>`
- Disabled: `<Toggle disabled>...</Toggle>`

### tooltip
Tooltip component that shows information on hover or keyboard focus using Provider, Root, Trigger, and Content subcomponents.

## Tooltip

Displays information on hover or focus.

```svelte
<Tooltip.Provider>
  <Tooltip.Root>
    <Tooltip.Trigger>Hover</Tooltip.Trigger>
    <Tooltip.Content>
      <p>Add to library</p>
    </Tooltip.Content>
  </Tooltip.Root>
</Tooltip.Provider>
```

Install: `pnpm dlx shadcn-svelte@latest add tooltip`

### typography
Tailwind utility classes for styling typography elements (headings, paragraphs, blockquotes, tables, lists, code) since no default styles are provided.

## Typography Utility Classes

No default typography styles included. Use Tailwind classes:

**Headings**: h1 `text-4xl font-extrabold`, h2 `text-3xl font-semibold border-b`, h3 `text-2xl font-semibold`, h4 `text-xl font-semibold`

**Paragraphs**: Default `leading-7 [&:not(:first-child)]:mt-6`, Lead `text-xl text-muted-foreground`, Large `text-lg font-semibold`, Small `text-sm font-medium`, Muted `text-sm text-muted-foreground`

**Other**: Blockquote `border-l-2 pl-6 italic`, Inline code `bg-muted rounded px-[0.3rem] py-[0.2rem] font-mono text-sm`, List `list-disc ml-6`, Table with `overflow-y-auto` wrapper

