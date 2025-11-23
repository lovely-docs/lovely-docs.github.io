

## Pages

### accordion
Accordion component with Root, Item, Trigger, and Content subcomponents; supports single/multiple type; WAI-ARIA accessible; install with `npx shadcn-svelte@latest add accordion -y -o`

## Accordion

A vertically stacked set of interactive headings that each reveal a section of content.

### Installation

```bash
npx shadcn-svelte@latest add accordion -y -o
```

The `-y` flag skips the confirmation prompt and `-o` overwrites existing files.

### Usage

Import and use the accordion components:

```svelte
<script lang="ts">
  import * as Accordion from "$lib/components/ui/accordion/index.js";
</script>

<Accordion.Root type="single">
  <Accordion.Item value="item-1">
    <Accordion.Trigger>Is it accessible?</Accordion.Trigger>
    <Accordion.Content>
      Yes. It adheres to the WAI-ARIA design pattern.
    </Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
```

### Key Components

- **Accordion.Root**: Container component with `type` prop (`"single"` or `"multiple"`)
- **Accordion.Item**: Individual accordion section with `value` prop
- **Accordion.Trigger**: Clickable heading that toggles content visibility
- **Accordion.Content**: Hidden content revealed when trigger is clicked

### Props

- `Accordion.Root` accepts `type` (single/multiple), `class`, and `value` (initial open item)
- `Accordion.Item` accepts `value` identifier
- `Accordion.Content` accepts `class` for styling

### Example with Multiple Items

```svelte
<Accordion.Root type="single" class="w-full sm:max-w-[70%]" value="item-1">
  <Accordion.Item value="item-1">
    <Accordion.Trigger>Product Information</Accordion.Trigger>
    <Accordion.Content class="flex flex-col gap-4 text-balance">
      <p>Product details here</p>
    </Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-2">
    <Accordion.Trigger>Shipping Details</Accordion.Trigger>
    <Accordion.Content class="flex flex-col gap-4 text-balance">
      <p>Shipping information here</p>
    </Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
```

The component is built on Bits UI and follows WAI-ARIA design patterns for accessibility.

### alert-dialog
Modal dialog component with Root, Trigger, Content, Header, Title, Description, Footer, Cancel, and Action sub-components; install with `npx shadcn-svelte@latest add alert-dialog -y -o`.

## Alert Dialog

Modal dialog component that interrupts the user with important content and expects a response.

### Installation

```bash
npx shadcn-svelte@latest add alert-dialog -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Usage

Import the AlertDialog components:

```svelte
<script lang="ts">
  import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
  import { buttonVariants } from "$lib/components/ui/button/index.js";
</script>
```

Basic structure with all available sub-components:

```svelte
<AlertDialog.Root>
  <AlertDialog.Trigger class={buttonVariants({ variant: "outline" })}>
    Show Dialog
  </AlertDialog.Trigger>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
      <AlertDialog.Description>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action>Continue</AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
```

### Components

- `AlertDialog.Root` - Root container
- `AlertDialog.Trigger` - Button that opens the dialog
- `AlertDialog.Content` - Dialog content wrapper
- `AlertDialog.Header` - Header section
- `AlertDialog.Title` - Dialog title
- `AlertDialog.Description` - Dialog description text
- `AlertDialog.Footer` - Footer section
- `AlertDialog.Cancel` - Cancel button
- `AlertDialog.Action` - Action/confirm button

The component is built on Bits UI. See Bits UI documentation for API reference and additional configuration options.

### alert
Alert component with Root/Title/Description subcomponents; supports default and destructive variants; accepts icons and rich content.

## Alert Component

Displays a callout for user attention with customizable variants and content.

### Installation

```bash
npx shadcn-svelte@latest add alert -y -o
```

The `-y` flag skips the confirmation prompt and `-o` overwrites existing files.

### Basic Usage

```svelte
<script lang="ts">
  import * as Alert from "$lib/components/ui/alert/index.js";
</script>

<Alert.Root>
  <Alert.Title>Heads up!</Alert.Title>
  <Alert.Description>
    You can add components to your app using the cli.
  </Alert.Description>
</Alert.Root>
```

### Component Structure

- `Alert.Root`: Container component
- `Alert.Title`: Title text
- `Alert.Description`: Description content
- Supports icon elements (from lucide-svelte or custom)

### Variants

**Default variant** - Standard alert styling:
```svelte
<Alert.Root>
  <CheckCircle2Icon />
  <Alert.Title>Success! Your changes have been saved</Alert.Title>
  <Alert.Description>This is an alert with icon, title and description.</Alert.Description>
</Alert.Root>
```

**Destructive variant** - Error/warning styling:
```svelte
<Alert.Root variant="destructive">
  <CircleAlertIcon class="size-4" />
  <Alert.Title>Error</Alert.Title>
  <Alert.Description>Your session has expired. Please login again.</Alert.Description>
</Alert.Root>
```

### Features

- Flexible composition: can include title only, description only, or both
- Icon support via slot (typically lucide-svelte icons)
- Rich content support in description (paragraphs, lists, etc.)
- Two built-in variants: default and destructive

### aspect-ratio
AspectRatio component maintains content at specified ratio (e.g., 16/9); accepts ratio prop and class styling.

## Aspect Ratio

Component that constrains content to a specific aspect ratio.

### Usage

Import and wrap content with the `AspectRatio` component, specifying the desired ratio:

```svelte
<script lang="ts">
  import { AspectRatio } from "$lib/components/ui/aspect-ratio/index.js";
</script>

<div class="w-[450px]">
  <AspectRatio ratio={16 / 9} class="bg-muted">
    <img src="..." alt="..." class="rounded-md object-cover" />
  </AspectRatio>
</div>
```

The `ratio` prop accepts a numeric value (e.g., `16 / 9` for widescreen). Child content will be scaled to maintain the specified aspect ratio. Apply additional styling via the `class` prop.

### Installation

```bash
npx shadcn-svelte@latest add aspect-ratio -y -o
```

Flags: `-y` skips confirmation prompt, `-o` overwrites existing files.

### avatar
Avatar component with Image and Fallback subcomponents; displays user image or initials fallback text.

## Avatar Component

Image element with fallback for user representation.

### Installation

```bash
npx shadcn-svelte@latest add avatar -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Basic Usage

```svelte
<script lang="ts">
  import * as Avatar from "$lib/components/ui/avatar/index.js";
</script>

<Avatar.Root>
  <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
  <Avatar.Fallback>CN</Avatar.Fallback>
</Avatar.Root>
```

### Variants

**Rounded corners:**
```svelte
<Avatar.Root class="rounded-lg">
  <Avatar.Image src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
  <Avatar.Fallback>ER</Avatar.Fallback>
</Avatar.Root>
```

**Avatar group with styling:**
```svelte
<div class="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
  <Avatar.Root>
    <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
    <Avatar.Fallback>CN</Avatar.Fallback>
  </Avatar.Root>
  <Avatar.Root>
    <Avatar.Image src="https://github.com/leerob.png" alt="@leerob" />
    <Avatar.Fallback>LR</Avatar.Fallback>
  </Avatar.Root>
</div>
```

### Structure

- `Avatar.Root`: Container component
- `Avatar.Image`: Image element with src and alt attributes
- `Avatar.Fallback`: Text displayed when image fails to load

### badge
Badge component with default/secondary/destructive/outline variants; supports custom styling and link styling via badgeVariants helper.

## Badge Component

A UI component for displaying badges with multiple style variants.

### Installation

```bash
npx shadcn-svelte@latest add badge -y -o
```

The `-y` flag skips the confirmation prompt and `-o` overwrites existing files.

### Basic Usage

Import and use the Badge component:

```svelte
<script lang="ts">
  import { Badge } from "$lib/components/ui/badge/index.js";
</script>

<Badge>Badge</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>
```

### Variants

The component supports four built-in variants: default, secondary, destructive, and outline.

### Customization

Badges can be customized with additional classes for styling:

```svelte
<Badge variant="secondary" class="bg-blue-500 text-white dark:bg-blue-600">
  <BadgeCheckIcon />
  Verified
</Badge>
```

Circular badge variants can be created using custom classes:

```svelte
<Badge class="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">8</Badge>
<Badge class="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums" variant="destructive">99</Badge>
```

### Link Badge

Use the `badgeVariants` helper to style links as badges:

```svelte
<script lang="ts">
  import { badgeVariants } from "$lib/components/ui/badge/index.js";
</script>

<a href="/dashboard" class={badgeVariants({ variant: "outline" })}>Badge</a>
```

### breadcrumb
Breadcrumb component with Link, Page, Separator, Ellipsis; supports custom separators, dropdown/drawer integration, and responsive collapsed states.

## Breadcrumb Component

Displays the path to the current resource using a hierarchy of links.

### Installation

```bash
npx shadcn-svelte@latest add breadcrumb -y -o
```

The `-y` flag skips the confirmation prompt and `-o` overwrites existing files.

### Basic Usage

```svelte
<script lang="ts">
  import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
</script>

<Breadcrumb.Root>
  <Breadcrumb.List>
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator />
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/components">Components</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator />
    <Breadcrumb.Item>
      <Breadcrumb.Page>Breadcrumb</Breadcrumb.Page>
    </Breadcrumb.Item>
  </Breadcrumb.List>
</Breadcrumb.Root>
```

### Component Structure

- `<Breadcrumb.Root>` - Root container
- `<Breadcrumb.List>` - List wrapper
- `<Breadcrumb.Item>` - Individual breadcrumb item
- `<Breadcrumb.Link>` - Clickable link with `href` prop
- `<Breadcrumb.Page>` - Current page (non-clickable)
- `<Breadcrumb.Separator>` - Separator between items (default: forward slash)
- `<Breadcrumb.Ellipsis>` - Collapsed state indicator

### Custom Separator

Pass a custom component to the `<Breadcrumb.Separator />` slot:

```svelte
<Breadcrumb.Separator>
  <SlashIcon />
</Breadcrumb.Separator>
```

### Dropdown Integration

Compose `<Breadcrumb.Item />` with `<DropdownMenu />` to create interactive breadcrumbs:

```svelte
<Breadcrumb.Item>
  <DropdownMenu.Root>
    <DropdownMenu.Trigger class="flex items-center gap-1">
      Components
      <ChevronDownIcon class="size-4" />
    </DropdownMenu.Trigger>
    <DropdownMenu.Content align="start">
      <DropdownMenu.Item>Documentation</DropdownMenu.Item>
      <DropdownMenu.Item>Themes</DropdownMenu.Item>
      <DropdownMenu.Item>GitHub</DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
</Breadcrumb.Item>
```

### Collapsed State

Use `<Breadcrumb.Ellipsis />` to show a collapsed state for long breadcrumbs:

```svelte
<Breadcrumb.Item>
  <Breadcrumb.Ellipsis />
</Breadcrumb.Item>
```

### Custom Link Component

Use the `asChild` prop on `<Breadcrumb.Link />` to integrate with routing libraries.

### Responsive Breadcrumb

Compose with `<DropdownMenu />` for desktop and `<Drawer />` for mobile using `MediaQuery`:

```svelte
<script lang="ts">
  import { MediaQuery } from "svelte/reactivity";
  import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
  import * as Drawer from "$lib/components/ui/drawer/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  
  const items = [
    { href: "#", label: "Home" },
    { href: "#", label: "Documentation" },
    { href: "#", label: "Building Your Application" },
    { href: "#", label: "Data Fetching" },
    { label: "Caching and Revalidating" }
  ];
  const ITEMS_TO_DISPLAY = 3;
  let open = $state(false);
  const isDesktop = new MediaQuery("(min-width: 768px)");
</script>

<Breadcrumb.Root>
  <Breadcrumb.List>
    <Breadcrumb.Item>
      <Breadcrumb.Link href={items[0].href}>
        {items[0].label}
      </Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator />
    {#if items.length > ITEMS_TO_DISPLAY}
      <Breadcrumb.Item>
        {#if isDesktop.current}
          <DropdownMenu.Root bind:open>
            <DropdownMenu.Trigger class="flex items-center gap-1">
              <Breadcrumb.Ellipsis class="size-4" />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="start">
              {#each items.slice(1, -2) as item, i (i)}
                <DropdownMenu.Item>
                  <a href={item.href ? item.href : "#"}>
                    {item.label}
                  </a>
                </DropdownMenu.Item>
              {/each}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        {:else}
          <Drawer.Root bind:open>
            <Drawer.Trigger>
              <Breadcrumb.Ellipsis class="size-4" />
            </Drawer.Trigger>
            <Drawer.Content>
              <Drawer.Header class="text-left">
                <Drawer.Title>Navigate to</Drawer.Title>
              </Drawer.Header>
              <div class="grid gap-1 px-4">
                {#each items.slice(1, -2) as item, i (i)}
                  <a href={item.href ? item.href : "#"} class="py-1 text-sm">
                    {item.label}
                  </a>
                {/each}
              </div>
            </Drawer.Content>
          </Drawer.Root>
        {/if}
      </Breadcrumb.Item>
      <Breadcrumb.Separator />
    {/if}
    {#each items.slice(-ITEMS_TO_DISPLAY + 1) as item (item.label)}
      <Breadcrumb.Item>
        {#if item.href}
          <Breadcrumb.Link href={item.href} class="max-w-20 truncate md:max-w-none">
            {item.label}
          </Breadcrumb.Link>
          <Breadcrumb.Separator />
        {:else}
          <Breadcrumb.Page class="max-w-20 truncate md:max-w-none">
            {item.label}
          </Breadcrumb.Page>
        {/if}
      </Breadcrumb.Item>
    {/each}
  </Breadcrumb.List>
</Breadcrumb.Root>
```

### button-group
Container for grouping related buttons with consistent styling, supporting vertical/horizontal orientation, separators, nesting, and integration with Input, DropdownMenu, Select, Popover components; accessible with role="group" and aria-label support.

## Button Group

A container component that groups related buttons together with consistent styling and spacing.

### Installation

```bash
npx shadcn-svelte@latest add button-group -y -o
```

The `-y` flag skips the confirmation prompt and `-o` overwrites existing files.

### Basic Usage

```svelte
<script lang="ts">
  import * as ButtonGroup from "$lib/components/ui/button-group/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
</script>

<ButtonGroup.Root>
  <Button>Button 1</Button>
  <Button>Button 2</Button>
</ButtonGroup.Root>
```

### Accessibility

- The component has `role="group"` set automatically
- Use `tabindex` to navigate between buttons
- Label with `aria-label` or `aria-labelledby`:

```svelte
<ButtonGroup.Root aria-label="Button group">
  <Button>Button 1</Button>
  <Button>Button 2</Button>
</ButtonGroup.Root>
```

### ButtonGroup vs ToggleGroup

- **ButtonGroup**: Group buttons that perform actions
- **ToggleGroup**: Group buttons that toggle state

### Orientation

Set `orientation="vertical"` for vertical layout:

```svelte
<ButtonGroup.Root orientation="vertical" aria-label="Media controls" class="h-fit">
  <Button variant="outline" size="icon"><Plus /></Button>
  <Button variant="outline" size="icon"><Minus /></Button>
</ButtonGroup.Root>
```

### Size

Control button sizes using the `size` prop on individual buttons (sm, default, lg, icon-sm, icon, icon-lg):

```svelte
<ButtonGroup.Root>
  <Button variant="outline" size="sm">Small</Button>
  <Button variant="outline">Default</Button>
  <Button variant="outline" size="lg">Large</Button>
</ButtonGroup.Root>
```

### Nested Groups

Nest `ButtonGroup` components to create groups with spacing:

```svelte
<ButtonGroup.Root>
  <ButtonGroup.Root>
    <Button variant="outline" size="sm">1</Button>
    <Button variant="outline" size="sm">2</Button>
    <Button variant="outline" size="sm">3</Button>
  </ButtonGroup.Root>
  <ButtonGroup.Root>
    <Button variant="outline" size="icon-sm" aria-label="Previous"><ArrowLeft /></Button>
    <Button variant="outline" size="icon-sm" aria-label="Next"><ArrowRight /></Button>
  </ButtonGroup.Root>
</ButtonGroup.Root>
```

### Separator

Use `ButtonGroup.Separator` to visually divide buttons. Recommended for non-outline variants:

```svelte
<ButtonGroup.Root>
  <Button variant="secondary" size="sm">Copy</Button>
  <ButtonGroup.Separator />
  <Button variant="secondary" size="sm">Paste</Button>
</ButtonGroup.Root>
```

### Split Button

Create a split button with a separator and icon button:

```svelte
<ButtonGroup.Root>
  <Button variant="secondary">Button</Button>
  <ButtonGroup.Separator />
  <Button variant="secondary" size="icon"><Plus /></Button>
</ButtonGroup.Root>
```

### With Input

Wrap an `Input` component with buttons:

```svelte
<ButtonGroup.Root>
  <Input placeholder="Search..." />
  <Button variant="outline" size="icon" aria-label="Search"><Search /></Button>
</ButtonGroup.Root>
```

### With InputGroup

Create complex input layouts with `InputGroup`:

```svelte
<ButtonGroup.Root class="[--radius:9999rem]">
  <ButtonGroup.Root>
    <Button variant="outline" size="icon"><Plus /></Button>
  </ButtonGroup.Root>
  <ButtonGroup.Root>
    <InputGroup.Root>
      <InputGroup.Input placeholder="Send a message..." />
      <InputGroup.Addon align="inline-end">
        <InputGroup.Button size="icon-xs" aria-pressed={voiceEnabled}>
          <AudioLines />
        </InputGroup.Button>
      </InputGroup.Addon>
    </InputGroup.Root>
  </ButtonGroup.Root>
</ButtonGroup.Root>
```

### With DropdownMenu

Create a split button with dropdown menu:

```svelte
<ButtonGroup.Root>
  <Button variant="outline">Follow</Button>
  <DropdownMenu.Root>
    <DropdownMenu.Trigger>
      {#snippet child({ props })}
        <Button {...props} variant="outline" class="!pl-2">
          <ChevronDown />
        </Button>
      {/snippet}
    </DropdownMenu.Trigger>
    <DropdownMenu.Content align="end">
      <DropdownMenu.Item><VolumeOff />Mute Conversation</DropdownMenu.Item>
      <DropdownMenu.Item><Check />Mark as Read</DropdownMenu.Item>
      <DropdownMenu.Separator />
      <DropdownMenu.Item variant="destructive"><Trash />Delete</DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
</ButtonGroup.Root>
```

### With Select

Pair with a `Select` component:

```svelte
<ButtonGroup.Root>
  <ButtonGroup.Root>
    <Select.Root type="single" bind:value={currency}>
      <Select.Trigger class="font-mono">{currency}</Select.Trigger>
      <Select.Content>
        <Select.Item value="$">$ US Dollar</Select.Item>
        <Select.Item value="€">€ Euro</Select.Item>
      </Select.Content>
    </Select.Root>
    <Input placeholder="10.00" />
  </ButtonGroup.Root>
  <ButtonGroup.Root>
    <Button size="icon" variant="outline"><ArrowRight /></Button>
  </ButtonGroup.Root>
</ButtonGroup.Root>
```

### With Popover

Use with a `Popover` component:

```svelte
<ButtonGroup.Root>
  <Button variant="outline"><Bot />Copilot</Button>
  <Popover.Root>
    <Popover.Trigger>
      {#snippet child({ props })}
        <Button {...props} variant="outline" size="icon"><ChevronDown /></Button>
      {/snippet}
    </Popover.Trigger>
    <Popover.Content align="end" class="rounded-xl p-0">
      <div class="px-4 py-3">Agent Tasks</div>
      <Separator />
      <div class="p-4"><Textarea placeholder="Describe your task..." /></div>
    </Popover.Content>
  </Popover.Root>
</ButtonGroup.Root>
```

### button
Button component with variants (outline, secondary, destructive, ghost, link), href support for links, icon/size props, and disabled state.

## Button Component

Displays a button or a component that looks like a button.

### Installation

```bash
npx shadcn-svelte@latest add button -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Basic Usage

Import and render a button:

```svelte
<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
</script>
<Button>Button</Button>
```

### Variants

The `variant` prop controls the button's appearance:

```svelte
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
```

### Link Conversion

Convert the button to an `<a>` element by passing an `href` prop:

```svelte
<Button href="/dashboard">Dashboard</Button>
```

Alternatively, use the `buttonVariants` helper to style a link as a button:

```svelte
<script lang="ts">
  import { buttonVariants } from "$lib/components/ui/button";
</script>
<a href="/dashboard" class={buttonVariants({ variant: "outline" })}>
  Dashboard
</a>
```

### Size and Icons

Use the `size` prop to control button size. The `size="icon"` variant creates icon-only buttons:

```svelte
<script lang="ts">
  import GitBranchIcon from "@lucide/svelte/icons/git-branch";
  import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";
  import { Button } from "$lib/components/ui/button/index.js";
</script>
<Button variant="outline" size="sm">
  <GitBranchIcon />
  Login with Email
</Button>
<Button variant="secondary" size="icon" class="size-8">
  <ChevronRightIcon />
</Button>
```

### Disabled State

Disable buttons with the `disabled` attribute. Commonly used with loading indicators:

```svelte
<script lang="ts">
  import Loader2Icon from "@lucide/svelte/icons/loader-2";
  import { Button } from "$lib/components/ui/button/index.js";
</script>
<Button disabled>
  <Loader2Icon class="animate-spin" />
  Please wait
</Button>
```

See Bits UI Button documentation for full API reference.

### calendar
Date selection component with single/multi-month display, dropdown caption layouts, timezone support, and examples for popover pickers, date+time, and natural language parsing.

## Calendar Component

A date selection component built on Bits UI Calendar using @internationalized/date for date handling.

### Basic Usage
```svelte
<script lang="ts">
  import { getLocalTimeZone, today } from "@internationalized/date";
  import { Calendar } from "$lib/components/ui/calendar/index.js";
  let value = today(getLocalTimeZone());
</script>
<Calendar type="single" bind:value class="rounded-md border shadow-sm" captionLayout="dropdown" />
```

### Installation
```bash
npx shadcn-svelte@latest add calendar -y -o
```
Flags: `-y` skips confirmation, `-o` overwrites existing files.

### Key Features
- Single date selection with `type="single"`
- Multiple month display with `numberOfMonths` prop
- Caption layout options: `"dropdown"` (month/year), `"dropdown-months"` (month only), `"dropdown-years"` (year only)
- Date constraints with `maxValue` and `minValue` props
- Event handling with `onValueChange` callback
- Timezone support via @internationalized/date

### Examples

**Multiple Months:**
```svelte
<Calendar type="single" bind:value numberOfMonths={2} />
```

**Month/Year Selector with Dropdown:**
```svelte
<script lang="ts">
  import Calendar from "$lib/components/ui/calendar/calendar.svelte";
  import * as Select from "$lib/components/ui/select/index.js";
  let value = $state(new CalendarDate(2025, 6, 12));
  let dropdown = $state("dropdown");
</script>
<Calendar type="single" bind:value captionLayout={dropdown} />
<Select.Root type="single" bind:value={dropdown}>
  <Select.Trigger>
    {selectedDropdown}
  </Select.Trigger>
  <Select.Content>
    <Select.Item value="dropdown">Month and Year</Select.Item>
    <Select.Item value="dropdown-months">Month Only</Select.Item>
    <Select.Item value="dropdown-years">Year Only</Select.Item>
  </Select.Content>
</Select.Root>
```

**Date of Birth Picker (with Popover):**
```svelte
<script lang="ts">
  import Calendar from "$lib/components/ui/calendar/calendar.svelte";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { today } from "@internationalized/date";
  let open = $state(false);
  let value = $state();
</script>
<Popover.Root bind:open>
  <Popover.Trigger>
    {#snippet child({ props })}
      <Button {...props} variant="outline">
        {value ? value.toDate(getLocalTimeZone()).toLocaleDateString() : "Select date"}
      </Button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content class="w-auto p-0">
    <Calendar type="single" bind:value maxValue={today(getLocalTimeZone())} 
      onValueChange={() => { open = false; }} />
  </Popover.Content>
</Popover.Root>
```

**Date and Time Picker:**
```svelte
<div class="flex gap-4">
  <Popover.Root bind:open>
    <Popover.Trigger>
      {#snippet child({ props })}
        <Button {...props} variant="outline">
          {value ? value.toDate(getLocalTimeZone()).toLocaleDateString() : "Select date"}
        </Button>
      {/snippet}
    </Popover.Trigger>
    <Popover.Content class="w-auto p-0">
      <Calendar type="single" bind:value onValueChange={() => { open = false; }} />
    </Popover.Content>
  </Popover.Root>
  <Input type="time" value="10:30:00" />
</div>
```

**Natural Language Date Picker (using chrono-node):**
```svelte
<script lang="ts">
  import { Calendar } from "$lib/components/ui/calendar/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { parseDate } from "chrono-node";
  import { CalendarDate, getLocalTimeZone } from "@internationalized/date";
  
  let open = $state(false);
  let inputValue = $state("In 2 days");
  let value = $state(parseDate(inputValue) ? new CalendarDate(...) : undefined);
</script>
<Input bind:value={inputValue} placeholder="Tomorrow or next week" 
  onkeydown={(e) => { if (e.key === "ArrowDown") open = true; }} />
<Popover.Root bind:open>
  <Popover.Trigger>Calendar Icon</Popover.Trigger>
  <Popover.Content class="w-auto p-0">
    <Calendar type="single" bind:value 
      onValueChange={(v) => { inputValue = formatDate(v); open = false; }} />
  </Popover.Content>
</Popover.Root>
```

### Related Components
- Range Calendar: for date range selection
- Date Picker: higher-level date selection component
- 30+ calendar blocks available in Blocks Library

### Upgrade
```bash
npx shadcn-svelte@latest add calendar -y -o
```
If you've customized the component, manually merge changes. After upgrading, add new blocks:
```bash
npx shadcn-svelte@latest add calendar-02 -y -o
```

### card
Composable card component with Root, Header, Title, Description, Action, Content, Footer sub-components; supports Tailwind styling.

## Card Component

A composable card component for displaying structured content with header, content, and footer sections.

### Installation

```bash
npx shadcn-svelte@latest add card -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Structure

The Card component is composed of several sub-components:

- **Card.Root**: Container wrapper
- **Card.Header**: Top section, typically contains title and description
- **Card.Title**: Heading text within header
- **Card.Description**: Subtitle or descriptive text within header
- **Card.Action**: Optional action area within header (e.g., buttons)
- **Card.Content**: Main content area
- **Card.Footer**: Bottom section, typically for actions

### Basic Usage

```svelte
<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
</script>

<Card.Root>
  <Card.Header>
    <Card.Title>Card Title</Card.Title>
    <Card.Description>Card Description</Card.Description>
  </Card.Header>
  <Card.Content>
    <p>Card Content</p>
  </Card.Content>
  <Card.Footer>
    <p>Card Footer</p>
  </Card.Footer>
</Card.Root>
```

### Example: Login Form Card

```svelte
<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
</script>

<Card.Root class="w-full max-w-sm">
  <Card.Header>
    <Card.Title>Login to your account</Card.Title>
    <Card.Description>Enter your email below to login to your account</Card.Description>
    <Card.Action>
      <Button variant="link">Sign Up</Button>
    </Card.Action>
  </Card.Header>
  <Card.Content>
    <form>
      <div class="flex flex-col gap-6">
        <div class="grid gap-2">
          <Label for="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required />
        </div>
        <div class="grid gap-2">
          <div class="flex items-center">
            <Label for="password">Password</Label>
            <a href="##" class="ml-auto inline-block text-sm underline-offset-4 hover:underline">
              Forgot your password?
            </a>
          </div>
          <Input id="password" type="password" required />
        </div>
      </div>
    </form>
  </Card.Content>
  <Card.Footer class="flex-col gap-2">
    <Button type="submit" class="w-full">Login</Button>
    <Button variant="outline" class="w-full">Login with Google</Button>
  </Card.Footer>
</Card.Root>
```

All sub-components accept standard HTML class attributes for styling via Tailwind CSS.

### carousel
Embla Carousel component with sizing, spacing, vertical/horizontal orientation, options, reactive API for state/events, and plugin support.

## Carousel

A carousel component built on Embla Carousel with motion and swipe support.

### Installation

```bash
npx shadcn-svelte@latest add carousel -y -o
```

The `-y` flag skips the confirmation prompt and `-o` overwrites existing files.

### Basic Usage

```svelte
<script lang="ts">
  import * as Carousel from "$lib/components/ui/carousel/index.js";
</script>

<Carousel.Root>
  <Carousel.Content>
    <Carousel.Item>...</Carousel.Item>
    <Carousel.Item>...</Carousel.Item>
    <Carousel.Item>...</Carousel.Item>
  </Carousel.Content>
  <Carousel.Previous />
  <Carousel.Next />
</Carousel.Root>
```

### Sizing Items

Use the `basis` utility class on `<Carousel.Item />` to control item size:

```svelte
<Carousel.Root>
  <Carousel.Content>
    <Carousel.Item class="basis-1/3">...</Carousel.Item>
    <Carousel.Item class="md:basis-1/2 lg:basis-1/3">...</Carousel.Item>
  </Carousel.Content>
</Carousel.Root>
```

### Spacing Between Items

Use `pl-[VALUE]` on `<Carousel.Item />` and `-ml-[VALUE]` on `<Carousel.Content />`:

```svelte
<Carousel.Root>
  <Carousel.Content class="-ml-4 md:-ml-6">
    <Carousel.Item class="pl-4 md:pl-6">...</Carousel.Item>
    <Carousel.Item class="pl-4 md:pl-6">...</Carousel.Item>
  </Carousel.Content>
</Carousel.Root>
```

### Orientation

Set carousel direction with the `orientation` prop:

```svelte
<Carousel.Root orientation="vertical" class="h-[200px]">
  <Carousel.Content class="-mt-1">
    <Carousel.Item class="pt-1">...</Carousel.Item>
  </Carousel.Content>
</Carousel.Root>
```

Accepts `"vertical"` or `"horizontal"`.

### Options

Pass Embla Carousel options via the `opts` prop:

```svelte
<Carousel.Root opts={{ align: "start", loop: true }}>
  <Carousel.Content>
    <Carousel.Item>...</Carousel.Item>
  </Carousel.Content>
</Carousel.Root>
```

### API & State Management

Use the `setApi` callback to access the carousel API instance:

```svelte
<script lang="ts">
  import type { CarouselAPI } from "$lib/components/ui/carousel/context.js";
  import * as Carousel from "$lib/components/ui/carousel/index.js";
  
  let api = $state<CarouselAPI>();
  const count = $derived(api ? api.scrollSnapList().length : 0);
  let current = $state(0);
  
  $effect(() => {
    if (api) {
      current = api.selectedScrollSnap() + 1;
      api.on("select", () => {
        current = api!.selectedScrollSnap() + 1;
      });
    }
  });
</script>

<Carousel.Root setApi={(emblaApi) => (api = emblaApi)}>
  <Carousel.Content>
    <Carousel.Item>...</Carousel.Item>
  </Carousel.Content>
</Carousel.Root>

<div>Slide {current} of {count}</div>
```

Available API methods: `scrollSnapList()`, `selectedScrollSnap()`, and event listeners via `api.on()`.

### Events

Listen to carousel events using the API instance:

```svelte
<script lang="ts">
  let api = $state<CarouselAPI>();
  
  $effect(() => {
    if (api) {
      api.on("select", () => {
        // Handle selection change
      });
    }
  });
</script>

<Carousel.Root setApi={(emblaApi) => (api = emblaApi)}>
  ...
</Carousel.Root>
```

### Plugins

Add Embla Carousel plugins via the `plugins` prop:

```svelte
<script lang="ts">
  import Autoplay from "embla-carousel-autoplay";
  import * as Carousel from "$lib/components/ui/carousel/index.js";
  
  const plugin = Autoplay({ delay: 2000, stopOnInteraction: true });
</script>

<Carousel.Root
  plugins={[plugin]}
  onmouseenter={plugin.stop}
  onmouseleave={plugin.reset}
>
  <Carousel.Content>
    <Carousel.Item>...</Carousel.Item>
  </Carousel.Content>
</Carousel.Root>
```

Refer to Embla Carousel documentation for available plugins and options.

### chart
Beautiful, composable charts built on LayerChart with customizable config, theming via CSS variables or direct colors, and flexible tooltips with custom keys.

## Chart

Beautiful, customizable charts built on LayerChart. Copy and paste into your apps.

**Important:** LayerChart v2 is in pre-release and actively evolving. Only use if comfortable with potential breaking changes. Track development status on GitHub.

### Installation

```bash
npx shadcn-svelte@latest add chart -y -o
```

Flags: `-y` skips confirmation prompt, `-o` overwrites existing files.

### Component Design

Charts use composition with LayerChart components. You build charts using LayerChart components and only bring in custom components like `ChartTooltip` when needed. LayerChart is not wrapped, so you're not locked into an abstraction and can follow official upgrade paths.

```svelte
<script lang="ts">
  import * as Chart from "$lib/components/ui/chart/index.js";
  import { BarChart } from "layerchart";
  const data = [/* ... */];
</script>
<Chart.Container>
  <BarChart {data} x="date" y="value">
    {#snippet tooltip()}
      <Chart.Tooltip />
    {/snippet}
  </BarChart>
</Chart.Container>
```

### Building Your First Chart

Define data in any shape using `dataKey` prop to map to the chart:

```ts
const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  // ...
];
```

Define chart config with labels, icons, and colors:

```ts
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies Chart.ChartConfig;
```

Build chart using LayerChart's simplified components (e.g., `BarChart`):

```svelte
<Chart.Container config={chartConfig} class="min-h-[200px] w-full">
  <BarChart
    data={chartData}
    xScale={scaleBand().padding(0.25)}
    x="month"
    axis="x"
    seriesLayout="group"
    series={[
      { key: "desktop", label: chartConfig.desktop.label, color: chartConfig.desktop.color },
      { key: "mobile", label: chartConfig.mobile.label, color: chartConfig.mobile.color }
    ]}
  />
</Chart.Container>
```

### Customizing Axis Ticks

Use `props` prop to pass custom props to chart components. Format x-axis ticks:

```svelte
<BarChart
  {data}
  {/* ... */}
  props={{
    xAxis: {
      format: (d) => d.slice(0, 3),
    },
  }}
/>
```

### Adding Tooltip

Replace `tooltip={false}` with `tooltip` snippet containing `Chart.Tooltip`:

```svelte
<BarChart {data} {/* ... */}>
  {#snippet tooltip()}
    <Chart.Tooltip />
  {/snippet}
</BarChart>
```

### Adding Legend

Set `legend` prop to `true`:

```svelte
<BarChart {data} {/* ... */} legend>
  {#snippet tooltip()}
    <Chart.Tooltip />
  {/snippet}
</BarChart>
```

## Chart Config

Chart config holds labels, icons, and colors. Intentionally decoupled from chart data to share config and color tokens between charts.

```ts
const chartConfig = {
  desktop: {
    label: "Desktop",
    icon: MonitorIcon,
    color: "#2563eb",
    // OR theme object with 'light' and 'dark' keys
    theme: {
      light: "#2563eb",
      dark: "#dc2626",
    },
  },
} satisfies Chart.ChartConfig;
```

## Theming

### CSS Variables (Recommended)

Define colors in CSS:

```css
:root {
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
}
.dark {
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
}
```

Add to chart config:

```ts
const chartConfig = {
  desktop: { label: "Desktop", color: "var(--chart-1)" },
  mobile: { label: "Mobile", color: "var(--chart-2)" },
} satisfies Chart.ChartConfig;
```

### Direct Color Values

Use hex, hsl, or oklch directly:

```ts
const chartConfig = {
  desktop: { label: "Desktop", color: "#2563eb" },
} satisfies Chart.ChartConfig;
```

### Using Colors

Reference colors using `var(--color-KEY)` format:

In components: `<Bar fill="var(--color-desktop)" />`

In chart data: `{ browser: "chrome", visitors: 275, color: "var(--color-chrome)" }`

In Tailwind: `<Label class="fill-(--color-desktop)" />`

## Tooltip

Chart tooltip contains label, name, indicator, and value. Customize using `hideLabel`, `hideIndicator` props and `indicator` prop (values: `dot`, `line`, `dashed`).

Use `labelKey` and `nameKey` to use custom keys for tooltip label and name.

### Chart.Tooltip Props

| Prop | Type | Description |
|------|------|-------------|
| `labelKey` | string | Config or data key for label |
| `nameKey` | string | Config or data key for name |
| `indicator` | `dot` \| `line` \| `dashed` | Indicator style |
| `hideLabel` | boolean | Hide label |
| `hideIndicator` | boolean | Hide indicator |
| `label` | string | Custom label |
| `labelFormatter` | function | Format label |
| `formatter` | Snippet | Flexible tooltip rendering |

Colors automatically reference chart config.

### Custom Tooltip Keys

```ts
const chartData = [
  { browser: "chrome", visitors: 187 },
  { browser: "safari", visitors: 200 },
];
const chartConfig = {
  visitors: { label: "Total Visitors" },
  chrome: { label: "Chrome", color: "var(--chart-1)" },
  safari: { label: "Safari", color: "var(--chart-2)" },
} satisfies ChartConfig;
```

```svelte
<Chart.Tooltip labelKey="visitors" nameKey="browser" />
```

Uses "Total Visitors" for label and "Chrome"/"Safari" for names.

### checkbox
Checkbox component with checked/disabled states, data-[state=checked] styling, and sveltekit-superforms integration via onCheckedChange callback.

## Checkbox

A control that allows users to toggle between checked and not checked states.

### Installation

```bash
npx shadcn-svelte@latest add checkbox -y -o
```

The `-y` flag skips the confirmation prompt and `-o` overwrites existing files.

### Basic Usage

```svelte
<script lang="ts">
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
</script>

<div class="flex items-center gap-3">
  <Checkbox id="terms" />
  <Label for="terms">Accept terms and conditions</Label>
</div>
```

### States

- **Unchecked**: Default state
- **Checked**: Pass `checked` prop
- **Disabled**: Pass `disabled` prop

```svelte
<Checkbox id="terms-2" checked />
<Checkbox id="toggle" disabled />
```

### Styling

Customize appearance with the `class` prop:

```svelte
<Checkbox
  id="toggle-2"
  checked
  class="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white"
/>
```

Use `data-[state=checked]` selector for checked state styling and `has-[[aria-checked=true]]` on parent elements for container-level styling.

### Form Integration

Use with sveltekit-superforms for form handling:

```svelte
<script lang="ts" module>
  import { z } from "zod/v4";
  const formSchema = z.object({
    items: z.array(z.string()).refine((value) => value.some((item) => item), {
      message: "You have to select at least one item."
    })
  });
</script>

<script lang="ts">
  import { defaults, superForm } from "sveltekit-superforms";
  import { zod4 } from "sveltekit-superforms/adapters";
  import * as Form from "$lib/components/ui/form/index.js";
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";

  const form = superForm(defaults(zod4(formSchema)), {
    SPA: true,
    validators: zod4(formSchema)
  });
  const { form: formData, enhance } = form;

  function addItem(id: string) {
    $formData.items = [...$formData.items, id];
  }
  function removeItem(id: string) {
    $formData.items = $formData.items.filter((i) => i !== id);
  }
</script>

<form method="POST" use:enhance>
  <Form.Fieldset {form} name="items">
    <Form.Legend>Sidebar</Form.Legend>
    <Form.Description>Select items to display in sidebar</Form.Description>
    <div class="space-y-2">
      {#each items as item (item.id)}
        {@const checked = $formData.items.includes(item.id)}
        <div class="flex items-start space-x-3">
          <Form.Control>
            {#snippet children({ props })}
              <Checkbox
                {...props}
                {checked}
                value={item.id}
                onCheckedChange={(v) => {
                  if (v) addItem(item.id);
                  else removeItem(item.id);
                }}
              />
              <Form.Label class="font-normal">{item.label}</Form.Label>
            {/snippet}
          </Form.Control>
        </div>
      {/each}
      <Form.FieldErrors />
    </div>
  </Form.Fieldset>
  <Form.Button>Update display</Form.Button>
</form>
```

Handle checked state changes with `onCheckedChange` callback. Integrate with Form components for validation and error handling.

### collapsible
Collapsible component with Root, Trigger, and Content parts; install with `npx shadcn-svelte@latest add collapsible -y -o`; trigger toggles content visibility.

## Collapsible

Interactive component that expands/collapses a panel to show/hide content.

### Installation

```bash
npx shadcn-svelte@latest add collapsible -y -o
```

The `-y` flag skips the confirmation prompt and `-o` overwrites existing files.

### Usage

Import the component:
```svelte
<script lang="ts">
  import * as Collapsible from "$lib/components/ui/collapsible/index.js";
</script>
```

Basic structure with three main parts:
- `Collapsible.Root`: Container wrapper
- `Collapsible.Trigger`: Button that toggles the collapsed state
- `Collapsible.Content`: Panel that expands/collapses

Minimal example:
```svelte
<Collapsible.Root>
  <Collapsible.Trigger>Can I use this in my project?</Collapsible.Trigger>
  <Collapsible.Content>
    Yes. Free to use for personal and commercial projects. No attribution required.
  </Collapsible.Content>
</Collapsible.Root>
```

Full example with styling and icon:
```svelte
<script lang="ts">
  import ChevronsUpDownIcon from "@lucide/svelte/icons/chevrons-up-down";
  import * as Collapsible from "$lib/components/ui/collapsible/index.js";
  import { buttonVariants } from "$lib/components/ui/button/index.js";
</script>

<Collapsible.Root class="w-[350px] space-y-2">
  <div class="flex items-center justify-between space-x-4 px-4">
    <h4 class="text-sm font-semibold">@huntabyte starred 3 repositories</h4>
    <Collapsible.Trigger
      class={buttonVariants({ variant: "ghost", size: "sm", class: "w-9 p-0" })}
    >
      <ChevronsUpDownIcon />
      <span class="sr-only">Toggle</span>
    </Collapsible.Trigger>
  </div>
  <div class="rounded-md border px-4 py-3 font-mono text-sm">
    @huntabyte/bits-ui
  </div>
  <Collapsible.Content class="space-y-2">
    <div class="rounded-md border px-4 py-3 font-mono text-sm">
      @melt-ui/melt-ui
    </div>
    <div class="rounded-md border px-4 py-3 font-mono text-sm">
      @sveltejs/svelte
    </div>
  </Collapsible.Content>
</Collapsible.Root>
```

The Trigger can be styled with button variants and icons. Content is hidden by default and shown when trigger is clicked. Supports custom classes on Root and Content for layout and spacing.

### combobox
Autocomplete input and command palette composed from Popover and Command; supports basic selection, status indicators with icons, dropdown menu integration, and form submission with proper accessibility attributes.

## Combobox

Autocomplete input and command palette with a list of suggestions. Built by composing Popover and Command components.

### Installation

Install via CLI with confirmation and overwrite flags:
```
npx shadcn-svelte@latest add combobox -y -o
```
(-y: skip confirmation, -o: overwrite existing files)

Requires Popover and Command components to be installed.

### Basic Usage

```svelte
<script lang="ts">
  import CheckIcon from "@lucide/svelte/icons/check";
  import ChevronsUpDownIcon from "@lucide/svelte/icons/chevrons-up-down";
  import { tick } from "svelte";
  import * as Command from "$lib/components/ui/command/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { cn } from "$lib/utils.js";

  const frameworks = [
    { value: "sveltekit", label: "SvelteKit" },
    { value: "next.js", label: "Next.js" },
    { value: "nuxt.js", label: "Nuxt.js" },
    { value: "remix", label: "Remix" },
    { value: "astro", label: "Astro" }
  ];

  let open = $state(false);
  let value = $state("");
  let triggerRef = $state<HTMLButtonElement>(null!);

  const selectedValue = $derived(
    frameworks.find((f) => f.value === value)?.label
  );

  function closeAndFocusTrigger() {
    open = false;
    tick().then(() => {
      triggerRef.focus();
    });
  }
</script>

<Popover.Root bind:open>
  <Popover.Trigger bind:ref={triggerRef}>
    {#snippet child({ props })}
      <Button
        {...props}
        variant="outline"
        class="w-[200px] justify-between"
        role="combobox"
        aria-expanded={open}
      >
        {selectedValue || "Select a framework..."}
        <ChevronsUpDownIcon class="ml-2 size-4 shrink-0 opacity-50" />
      </Button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content class="w-[200px] p-0">
    <Command.Root>
      <Command.Input placeholder="Search framework..." />
      <Command.List>
        <Command.Empty>No framework found.</Command.Empty>
        <Command.Group>
          {#each frameworks as framework}
            <Command.Item
              value={framework.value}
              onSelect={() => {
                value = framework.value;
                closeAndFocusTrigger();
              }}
            >
              <CheckIcon
                class={cn(
                  "mr-2 size-4",
                  value !== framework.value && "text-transparent"
                )}
              />
              {framework.label}
            </Command.Item>
          {/each}
        </Command.Group>
      </Command.List>
    </Command.Root>
  </Popover.Content>
</Popover.Root>
```

### Status Selector Example

```svelte
<script lang="ts">
  import CircleIcon from "@lucide/svelte/icons/circle";
  import CircleArrowUpIcon from "@lucide/svelte/icons/circle-arrow-up";
  import CircleCheckIcon from "@lucide/svelte/icons/circle-check";
  import CircleHelpIcon from "@lucide/svelte/icons/circle-help";
  import CircleXIcon from "@lucide/svelte/icons/circle-x";
  import { type Component, tick } from "svelte";
  import { useId } from "bits-ui";
  import { cn } from "$lib/utils.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import * as Command from "$lib/components/ui/command/index.js";
  import { buttonVariants } from "$lib/components/ui/button/index.js";

  type Status = {
    value: string;
    label: string;
    icon: Component;
  };

  const statuses: Status[] = [
    { value: "backlog", label: "Backlog", icon: CircleHelpIcon },
    { value: "todo", label: "Todo", icon: CircleIcon },
    { value: "in progress", label: "In Progress", icon: CircleArrowUpIcon },
    { value: "done", label: "Done", icon: CircleCheckIcon },
    { value: "canceled", label: "Canceled", icon: CircleXIcon }
  ];

  let open = $state(false);
  let value = $state("");
  const selectedStatus = $derived(statuses.find((s) => s.value === value));

  function closeAndFocusTrigger(triggerId: string) {
    open = false;
    tick().then(() => {
      document.getElementById(triggerId)?.focus();
    });
  }

  const triggerId = useId();
</script>

<div class="flex items-center space-x-4">
  <p class="text-muted-foreground text-sm">Status</p>
  <Popover.Root bind:open>
    <Popover.Trigger
      id={triggerId}
      class={buttonVariants({
        variant: "outline",
        size: "sm",
        class: "w-[150px] justify-start"
      })}
    >
      {#if selectedStatus}
        {@const Icon = selectedStatus.icon}
        <Icon class="mr-2 size-4 shrink-0" />
        {selectedStatus.label}
      {:else}
        + Set status
      {/if}
    </Popover.Trigger>
    <Popover.Content class="w-[200px] p-0" side="right" align="start">
      <Command.Root>
        <Command.Input placeholder="Change status..." />
        <Command.List>
          <Command.Empty>No results found.</Command.Empty>
          <Command.Group>
            {#each statuses as status (status.value)}
              <Command.Item
                value={status.value}
                onSelect={() => {
                  value = status.value;
                  closeAndFocusTrigger(triggerId);
                }}
              >
                {@const Icon = status.icon}
                <Icon
                  class={cn(
                    "mr-2 size-4",
                    status.value !== selectedStatus?.value &&
                      "text-foreground/40"
                  )}
                />
                <span>{status.label}</span>
              </Command.Item>
            {/each}
          </Command.Group>
        </Command.List>
      </Command.Root>
    </Popover.Content>
  </Popover.Root>
</div>
```

### Dropdown Menu with Combobox

```svelte
<script lang="ts">
  import CalendarIcon from "@lucide/svelte/icons/calendar";
  import EllipsisIcon from "@lucide/svelte/icons/ellipsis";
  import TagsIcon from "@lucide/svelte/icons/tags";
  import TrashIcon from "@lucide/svelte/icons/trash";
  import UserIcon from "@lucide/svelte/icons/user";
  import { tick } from "svelte";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import * as Command from "$lib/components/ui/command/index.js";
  import { Button } from "$lib/components/ui/button/index.js";

  const labels = [
    "feature",
    "bug",
    "enhancement",
    "documentation",
    "design",
    "question",
    "maintenance"
  ];

  let open = $state(false);
  let selectedLabel = $state("feature");
  let triggerRef = $state<HTMLButtonElement>(null!);

  function closeAndFocusTrigger() {
    open = false;
    tick().then(() => {
      triggerRef.focus();
    });
  }
</script>

<div
  class="flex w-full flex-col items-start justify-between rounded-md border px-4 py-3 sm:flex-row sm:items-center"
>
  <p class="text-sm font-medium leading-none">
    <span
      class="bg-primary text-primary-foreground mr-2 rounded-lg px-2 py-1 text-xs"
    >
      {selectedLabel}
    </span>
    <span class="text-muted-foreground">Create a new project</span>
  </p>
  <DropdownMenu.Root bind:open>
    <DropdownMenu.Trigger bind:ref={triggerRef}>
      {#snippet child({ props })}
        <Button variant="ghost" size="sm" {...props} aria-label="Open menu">
          <EllipsisIcon />
        </Button>
      {/snippet}
    </DropdownMenu.Trigger>
    <DropdownMenu.Content class="w-[200px]" align="end">
      <DropdownMenu.Group>
        <DropdownMenu.Label>Actions</DropdownMenu.Label>
        <DropdownMenu.Item>
          <UserIcon class="mr-2 size-4" />
          Assign to...
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <CalendarIcon class="mr-2 size-4" />
          Set due date...
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger>
            <TagsIcon class="mr-2 size-4" />
            Apply label
          </DropdownMenu.SubTrigger>
          <DropdownMenu.SubContent class="p-0">
            <Command.Root value={selectedLabel}>
              <Command.Input autofocus placeholder="Filter label..." />
              <Command.List>
                <Command.Empty>No label found.</Command.Empty>
                <Command.Group>
                  {#each labels as label (label)}
                    <Command.Item
                      value={label}
                      onSelect={() => {
                        selectedLabel = label;
                        closeAndFocusTrigger();
                      }}
                    >
                      {label}
                    </Command.Item>
                  {/each}
                </Command.Group>
              </Command.List>
            </Command.Root>
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>
        <DropdownMenu.Separator />
        <DropdownMenu.Item class="text-red-600">
          <TrashIcon class="mr-2 size-4" />
          Delete
          <DropdownMenu.Shortcut></DropdownMenu.Shortcut>
        </DropdownMenu.Item>
      </DropdownMenu.Group>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
</div>
```

### Form Integration

Use Form.Control to apply proper aria attributes and hidden input for form submission. Requires formsnap version 0.5.0 or higher.

```svelte
<script lang="ts" module>
  import { z } from "zod/v4";
  const languages = [
    { label: "English", value: "en" },
    { label: "French", value: "fr" },
    { label: "German", value: "de" },
    { label: "Spanish", value: "es" },
    { label: "Portuguese", value: "pt" },
    { label: "Russian", value: "ru" },
    { label: "Japanese", value: "ja" },
    { label: "Korean", value: "ko" },
    { label: "Chinese", value: "zh" }
  ] as const;
  const formSchema = z.object({
    language: z.enum(["en", "fr", "de", "es", "pt", "ru", "ja", "ko", "zh"])
  });
</script>

<script lang="ts">
  import { defaults, superForm } from "sveltekit-superforms";
  import { tick } from "svelte";
  import CheckIcon from "@lucide/svelte/icons/check";
  import ChevronsUpDownIcon from "@lucide/svelte/icons/chevrons-up-down";
  import { zod4 } from "sveltekit-superforms/adapters";
  import { toast } from "svelte-sonner";
  import { useId } from "bits-ui";
  import * as Form from "$lib/components/ui/form/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import * as Command from "$lib/components/ui/command/index.js";
  import { cn } from "$lib/utils.js";
  import { buttonVariants } from "$lib/components/ui/button/index.js";

  const form = superForm(defaults(zod4(formSchema)), {
    validators: zod4(formSchema),
    SPA: true,
    onUpdate: ({ form: f }) => {
      if (f.valid) {
        toast.success(`You submitted ${JSON.stringify(f.data, null, 2)}`);
      } else {
        toast.error("Please fix the errors in the form.");
      }
    }
  });

  const { form: formData, enhance } = form;
  let open = false;

  function closeAndFocusTrigger(triggerId: string) {
    open = false;
    tick().then(() => {
      document.getElementById(triggerId)?.focus();
    });
  }

  const triggerId = useId();
</script>

<form method="POST" class="space-y-6" use:enhance>
  <Form.Field {form} name="language" class="flex flex-col">
    <Popover.Root bind:open>
      <Form.Control id={triggerId}>
        {#snippet children({ props })}
          <Form.Label>Language</Form.Label>
          <Popover.Trigger
            class={cn(
              buttonVariants({ variant: "outline" }),
              "w-[200px] justify-between",
              !$formData.language && "text-muted-foreground"
            )}
            role="combobox"
            {...props}
          >
            {languages.find((f) => f.value === $formData.language)?.label ??
              "Select language"}
            <ChevronsUpDownIcon class="opacity-50" />
          </Popover.Trigger>
          <input hidden value={$formData.language} name={props.name} />
        {/snippet}
      </Form.Control>
      <Popover.Content class="w-[200px] p-0">
        <Command.Root>
          <Command.Input
            autofocus
            placeholder="Search language..."
            class="h-9"
          />
          <Command.Empty>No language found.</Command.Empty>
          <Command.Group value="languages">
            {#each languages as language (language.value)}
              <Command.Item
                value={language.label}
                onSelect={() => {
                  $formData.language = language.value;
                  closeAndFocusTrigger(triggerId);
                }}
              >
                {language.label}
                <CheckIcon
                  class={cn(
                    "ml-auto",
                    language.value !== $formData.language && "text-transparent"
                  )}
                />
              </Command.Item>
            {/each}
          </Command.Group>
        </Command.Root>
      </Popover.Content>
    </Popover.Root>
    <Form.Description>
      This is the language that will be used in the dashboard.
    </Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Button>Submit</Form.Button>
</form>
```

### Key Implementation Details

- Combobox is a composition of Popover and Command components
- Use `$state` for reactive state management (open, value, triggerRef)
- Use `$derived` to compute selectedValue from the current value
- Call `closeAndFocusTrigger()` after selection to refocus trigger button for keyboard navigation
- Use `tick()` to ensure DOM updates before focusing
- Apply `role="combobox"` and `aria-expanded={open}` to trigger button for accessibility
- Use CheckIcon with conditional `text-transparent` class to show/hide checkmarks
- For form integration, wrap Popover.Trigger in Form.Control and add hidden input with form field name


### command
Unstyled command menu component with Root/Input/List/Group/Item/Separator/Shortcut subcomponents; supports dialog mode with keyboard shortcuts (Cmd/Ctrl+K); auto-styles icons in items.

## Command Component

Fast, composable, unstyled command menu for Svelte. Built on Bits UI.

### Installation

```bash
npx shadcn-svelte@latest add command -y -o
```

The `-y` flag skips the confirmation prompt and `-o` overwrites existing files.

### Basic Usage

Import and use the Command component with its subcomponents:

```svelte
<script lang="ts">
  import * as Command from "$lib/components/ui/command/index.js";
</script>

<Command.Root>
  <Command.Input placeholder="Type a command or search..." />
  <Command.List>
    <Command.Empty>No results found.</Command.Empty>
    <Command.Group heading="Suggestions">
      <Command.Item>Calendar</Command.Item>
      <Command.Item>Search Emoji</Command.Item>
      <Command.Item>Calculator</Command.Item>
    </Command.Group>
    <Command.Separator />
    <Command.Group heading="Settings">
      <Command.Item>Profile</Command.Item>
      <Command.Item>Billing</Command.Item>
      <Command.Item>Settings</Command.Item>
    </Command.Group>
  </Command.List>
</Command.Root>
```

### Component Structure

- `<Command.Root>` - Container component, accepts styling classes
- `<Command.Input>` - Search/filter input field
- `<Command.List>` - Scrollable list container
- `<Command.Empty>` - Message shown when no results match
- `<Command.Group>` - Groups items with an optional heading
- `<Command.Item>` - Individual command item (can be disabled)
- `<Command.Separator>` - Visual divider between groups
- `<Command.Shortcut>` - Display keyboard shortcut hint within an item

### Dialog Example

Use `<Command.Dialog>` to display the command menu in a modal dialog:

```svelte
<script lang="ts">
  import * as Command from "$lib/components/ui/command/index.js";
  
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
      <Command.Item>Search Emoji</Command.Item>
      <Command.Item>Calculator</Command.Item>
    </Command.Group>
  </Command.List>
</Command.Dialog>
```

`<Command.Dialog>` accepts props for both Dialog.Root and Command.Root components. Bind the `open` state to control visibility.

### Icon Styling

As of 2024-10-30, `<Command.Item>` automatically applies icon styling: `gap-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0`. Icons placed inside items are automatically sized and spaced correctly.

### API Reference

Full API documentation available in Bits UI docs for the Command component.

### context-menu
Right-click context menu with items, submenus, checkboxes, radio buttons, separators, and keyboard shortcuts; install with `npx shadcn-svelte@latest add context-menu -y -o`.

## Context Menu

A component that displays a menu triggered by right-click, containing actions, functions, or options.

### Installation

```bash
npx shadcn-svelte@latest add context-menu -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Basic Usage

```svelte
<script lang="ts">
  import * as ContextMenu from "$lib/components/ui/context-menu/index.js";
</script>

<ContextMenu.Root>
  <ContextMenu.Trigger>Right click</ContextMenu.Trigger>
  <ContextMenu.Content>
    <ContextMenu.Item>Profile</ContextMenu.Item>
    <ContextMenu.Item>Billing</ContextMenu.Item>
    <ContextMenu.Item>Team</ContextMenu.Item>
    <ContextMenu.Item>Subscription</ContextMenu.Item>
  </ContextMenu.Content>
</ContextMenu.Root>
```

### Components

- **Root**: Container for the context menu
- **Trigger**: Element that triggers the menu on right-click
- **Content**: Menu container with optional `class` prop for styling (e.g., `w-52`)
- **Item**: Menu item with optional `inset` and `disabled` props
- **Shortcut**: Displays keyboard shortcut text within an item
- **Sub/SubTrigger/SubContent**: Nested submenu structure
- **Separator**: Visual divider between menu sections
- **CheckboxItem**: Menu item with checkbox state, use `bind:checked` for reactivity
- **RadioGroup/RadioItem**: Radio button group within menu, use `bind:value` for selection
- **Group/GroupHeading**: Groups related items with optional heading

### Example with All Features

```svelte
<ContextMenu.Root>
  <ContextMenu.Trigger class="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
    Right click here
  </ContextMenu.Trigger>
  <ContextMenu.Content class="w-52">
    <ContextMenu.Item inset>
      Back
      <ContextMenu.Shortcut>[</ContextMenu.Shortcut>
    </ContextMenu.Item>
    <ContextMenu.Item inset disabled>
      Forward
      <ContextMenu.Shortcut>]</ContextMenu.Shortcut>
    </ContextMenu.Item>
    <ContextMenu.Sub>
      <ContextMenu.SubTrigger inset>More Tools</ContextMenu.SubTrigger>
      <ContextMenu.SubContent class="w-48">
        <ContextMenu.Item>Save Page As...<ContextMenu.Shortcut>S</ContextMenu.Shortcut></ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Item>Developer Tools</ContextMenu.Item>
      </ContextMenu.SubContent>
    </ContextMenu.Sub>
    <ContextMenu.Separator />
    <ContextMenu.CheckboxItem bind:checked={showBookmarks}>Show Bookmarks</ContextMenu.CheckboxItem>
    <ContextMenu.RadioGroup bind:value>
      <ContextMenu.Group>
        <ContextMenu.GroupHeading inset>People</ContextMenu.GroupHeading>
        <ContextMenu.RadioItem value="pedro">Pedro Duarte</ContextMenu.RadioItem>
        <ContextMenu.RadioItem value="colm">Colm Tuite</ContextMenu.RadioItem>
      </ContextMenu.Group>
    </ContextMenu.RadioGroup>
  </ContextMenu.Content>
</ContextMenu.Root>
```

### State Management

Use reactive state variables with `$state()` for checkbox and radio items:

```svelte
<script lang="ts">
  let showBookmarks = $state(false);
  let value = $state("pedro");
</script>
```

### Documentation

Full API reference available at bits-ui documentation for context-menu component.

### data-table
TanStack Table v8 integration with Svelte 5: define columns with ColumnDef, create table with createSvelteTable, render with FlexRender, add pagination/sorting/filtering/visibility/selection via state managers and row models.

## Data Table

Powerful table and datagrids built using TanStack Table v8.

### Installation

```bash
npm i @tanstack/table-core
npx shadcn-svelte@latest add table data-table -y -o
```

The `-y` flag skips confirmation prompts, `-o` overwrites existing files.

### Basic Setup

Define column types and column definitions:

```ts
// columns.ts
import type { ColumnDef } from "@tanstack/table-core";

export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
];
```

Create a reusable DataTable component:

```svelte
<script lang="ts" generics="TData, TValue">
  import { type ColumnDef, getCoreRowModel } from "@tanstack/table-core";
  import { createSvelteTable, FlexRender } from "$lib/components/ui/data-table/index.js";
  import * as Table from "$lib/components/ui/table/index.js";

  type DataTableProps<TData, TValue> = {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
  };

  let { data, columns }: DataTableProps<TData, TValue> = $props();

  const table = createSvelteTable({
    get data() {
      return data;
    },
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
</script>

<div class="rounded-md border">
  <Table.Root>
    <Table.Header>
      {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
        <Table.Row>
          {#each headerGroup.headers as header (header.id)}
            <Table.Head colspan={header.colSpan}>
              {#if !header.isPlaceholder}
                <FlexRender
                  content={header.column.columnDef.header}
                  context={header.getContext()}
                />
              {/if}
            </Table.Head>
          {/each}
        </Table.Row>
      {/each}
    </Table.Header>
    <Table.Body>
      {#each table.getRowModel().rows as row (row.id)}
        <Table.Row data-state={row.getIsSelected() && "selected"}>
          {#each row.getVisibleCells() as cell (cell.id)}
            <Table.Cell>
              <FlexRender
                content={cell.column.columnDef.cell}
                context={cell.getContext()}
              />
            </Table.Cell>
          {/each}
        </Table.Row>
      {:else}
        <Table.Row>
          <Table.Cell colspan={columns.length} class="h-24 text-center">
            No results.
          </Table.Cell>
        </Table.Row>
      {/each}
    </Table.Body>
  </Table.Root>
</div>
```

### Cell Formatting

Format cells using `createRawSnippet` and `renderSnippet`:

```ts
import { createRawSnippet } from "svelte";
import { renderSnippet } from "$lib/components/ui/data-table/index.js";

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "amount",
    header: () => {
      const amountHeaderSnippet = createRawSnippet(() => ({
        render: () => `<div class="text-right">Amount</div>`,
      }));
      return renderSnippet(amountHeaderSnippet);
    },
    cell: ({ row }) => {
      const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      });
      const amountCellSnippet = createRawSnippet<[{ amount: number }]>(
        (getAmount) => {
          const { amount } = getAmount();
          const formatted = formatter.format(amount);
          return {
            render: () => `<div class="text-right font-medium">${formatted}</div>`,
          };
        }
      );
      return renderSnippet(amountCellSnippet, {
        amount: row.original.amount,
      });
    },
  },
];
```

### Row Actions

Create an actions dropdown component:

```svelte
<!-- data-table-actions.svelte -->
<script lang="ts">
  import EllipsisIcon from "@lucide/svelte/icons/ellipsis";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";

  let { id }: { id: string } = $props();
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      <Button {...props} variant="ghost" size="icon" class="relative size-8 p-0">
        <span class="sr-only">Open menu</span>
        <EllipsisIcon />
      </Button>
    {/snippet}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Group>
      <DropdownMenu.Label>Actions</DropdownMenu.Label>
      <DropdownMenu.Item onclick={() => navigator.clipboard.writeText(id)}>
        Copy payment ID
      </DropdownMenu.Item>
    </DropdownMenu.Group>
    <DropdownMenu.Separator />
    <DropdownMenu.Item>View customer</DropdownMenu.Item>
    <DropdownMenu.Item>View payment details</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
```

Add to columns using `renderComponent`:

```ts
import { renderComponent } from "$lib/components/ui/data-table/index.js";
import DataTableActions from "./data-table-actions.svelte";

export const columns: ColumnDef<Payment>[] = [
  {
    id: "actions",
    cell: ({ row }) =>
      renderComponent(DataTableActions, { id: row.original.id }),
  },
];
```

### Pagination

Add pagination state and row models:

```svelte
<script lang="ts" generics="TData, TValue">
  import {
    type ColumnDef,
    type PaginationState,
    getCoreRowModel,
    getPaginationRowModel,
  } from "@tanstack/table-core";
  import { Button } from "$lib/components/ui/button/index.js";

  let { data, columns }: DataTableProps<TData, TValue> = $props();
  let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });

  const table = createSvelteTable({
    get data() {
      return data;
    },
    columns,
    state: {
      get pagination() {
        return pagination;
      },
    },
    onPaginationChange: (updater) => {
      pagination = typeof updater === "function" ? updater(pagination) : updater;
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
</script>

<div class="flex items-center justify-end space-x-2 py-4">
  <Button
    variant="outline"
    size="sm"
    onclick={() => table.previousPage()}
    disabled={!table.getCanPreviousPage()}
  >
    Previous
  </Button>
  <Button
    variant="outline"
    size="sm"
    onclick={() => table.nextPage()}
    disabled={!table.getCanNextPage()}
  >
    Next
  </Button>
</div>
```

### Sorting

Create a sortable header button component:

```svelte
<!-- data-table-email-button.svelte -->
<script lang="ts">
  import type { ComponentProps } from "svelte";
  import ArrowUpDownIcon from "@lucide/svelte/icons/arrow-up-down";
  import { Button } from "$lib/components/ui/button/index.js";

  let { variant = "ghost", ...restProps }: ComponentProps<typeof Button> = $props();
</script>

<Button {variant} {...restProps}>
  Email
  <ArrowUpDownIcon class="ml-2" />
</Button>
```

Add sorting to table and column:

```ts
import { type SortingState, getSortedRowModel } from "@tanstack/table-core";
import { renderComponent } from "$lib/components/ui/data-table/index.js";
import DataTableEmailButton from "./data-table-email-button.svelte";

// In DataTable component:
let sorting = $state<SortingState>([]);

const table = createSvelteTable({
  // ...
  state: {
    get sorting() {
      return sorting;
    },
  },
  onSortingChange: (updater) => {
    sorting = typeof updater === "function" ? updater(sorting) : updater;
  },
  getSortedRowModel: getSortedRowModel(),
});

// In columns:
export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "email",
    header: ({ column }) =>
      renderComponent(DataTableEmailButton, {
        onclick: column.getToggleSortingHandler(),
      }),
  },
];
```

### Filtering

Add filtering state and row model:

```svelte
<script lang="ts" generics="TData, TValue">
  import {
    type ColumnFiltersState,
    getFilteredRowModel,
  } from "@tanstack/table-core";
  import { Input } from "$lib/components/ui/input/index.js";

  let columnFilters = $state<ColumnFiltersState>([]);

  const table = createSvelteTable({
    // ...
    state: {
      get columnFilters() {
        return columnFilters;
      },
    },
    onColumnFiltersChange: (updater) => {
      columnFilters = typeof updater === "function" ? updater(columnFilters) : updater;
    },
    getFilteredRowModel: getFilteredRowModel(),
  });
</script>

<div class="flex items-center py-4">
  <Input
    placeholder="Filter emails..."
    value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
    oninput={(e) => table.getColumn("email")?.setFilterValue(e.currentTarget.value)}
    class="max-w-sm"
  />
</div>
```

### Column Visibility

Add visibility state and toggle dropdown:

```svelte
<script lang="ts" generics="TData, TValue">
  import {
    type VisibilityState,
  } from "@tanstack/table-core";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";

  let columnVisibility = $state<VisibilityState>({});

  const table = createSvelteTable({
    // ...
    state: {
      get columnVisibility() {
        return columnVisibility;
      },
    },
    onColumnVisibilityChange: (updater) => {
      columnVisibility = typeof updater === "function" ? updater(columnVisibility) : updater;
    },
  });
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      <Button {...props} variant="outline" class="ml-auto">
        Columns <ChevronDownIcon class="ml-2 size-4" />
      </Button>
    {/snippet}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content align="end">
    {#each table.getAllColumns().filter((col) => col.getCanHide()) as column (column.id)}
      <DropdownMenu.CheckboxItem
        class="capitalize"
        bind:checked={() => column.getIsVisible(), (v) => column.toggleVisibility(!!v)}
      >
        {column.id}
      </DropdownMenu.CheckboxItem>
    {/each}
  </DropdownMenu.Content>
</DropdownMenu.Root>
```

### Row Selection

Create a checkbox component:

```svelte
<!-- data-table-checkbox.svelte -->
<script lang="ts">
  import type { ComponentProps } from "svelte";
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";

  let {
    checked = false,
    onCheckedChange = (v) => (checked = v),
    ...restProps
  }: ComponentProps<typeof Checkbox> = $props();
</script>

<Checkbox bind:checked={() => checked, onCheckedChange} {...restProps} />
```

Add row selection state and checkbox column:

```ts
import { type RowSelectionState } from "@tanstack/table-core";
import { renderComponent } from "$lib/components/ui/data-table/index.js";
import DataTableCheckbox from "./data-table-checkbox.svelte";

// In DataTable component:
let rowSelection = $state<RowSelectionState>({});

const table = createSvelteTable({
  // ...
  state: {
    get rowSelection() {
      return rowSelection;
    },
  },
  onRowSelectionChange: (updater) => {
    rowSelection = typeof updater === "function" ? updater(rowSelection) : updater;
  },
});

// In columns:
export const columns: ColumnDef<Payment>[] = [
  {
    id: "select",
    header: ({ table }) =>
      renderComponent(DataTableCheckbox, {
        checked: table.getIsAllPageRowsSelected(),
        indeterminate:
          table.getIsSomePageRowsSelected() &&
          !table.getIsAllPageRowsSelected(),
        onCheckedChange: (value) => table.toggleAllPageRowsSelected(!!value),
        "aria-label": "Select all",
      }),
    cell: ({ row }) =>
      renderComponent(DataTableCheckbox, {
        checked: row.getIsSelected(),
        onCheckedChange: (value) => row.toggleSelected(!!value),
        "aria-label": "Select row",
      }),
    enableSorting: false,
    enableHiding: false,
  },
];
```

Display selected row count:

```svelte
<div class="text-muted-foreground flex-1 text-sm">
  {table.getFilteredSelectedRowModel().rows.length} of
  {table.getFilteredRowModel().rows.length} row(s) selected.
</div>
```

### Key APIs

- `createSvelteTable()`: Initialize table with data, columns, and state
- `getCoreRowModel()`: Required for basic table rendering
- `getPaginationRowModel()`: Enable pagination
- `getSortedRowModel()`: Enable sorting
- `getFilteredRowModel()`: Enable filtering
- `FlexRender`: Render column definitions (headers/cells)
- `renderComponent()`: Render Svelte components in cells/headers
- `renderSnippet()`: Render Svelte snippets in cells/headers
- `row.original`: Access row data in cell definitions
- `table.getColumn(name)`: Get column by accessor key for filtering/sorting
- `table.getFilteredSelectedRowModel()`: Get selected rows after filtering
- `table.getFilteredRowModel()`: Get rows after filtering

### date-picker
Date picker component composition using Popover + Calendar/RangeCalendar; supports single/range selection, presets, and form integration with date constraints.

## Date Picker

A composable date picker component built from Popover and Calendar/RangeCalendar components.

### Installation

The Date Picker is a composition of `<Popover />` and either `<Calendar />` or `<RangeCalendar />` components. Install dependencies via the Popover, Calendar, and Range Calendar component installation instructions.

### Basic Usage

```svelte
<script lang="ts">
  import CalendarIcon from "@lucide/svelte/icons/calendar";
  import { DateFormatter, type DateValue, getLocalTimeZone } from "@internationalized/date";
  import { cn } from "$lib/utils.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Calendar } from "$lib/components/ui/calendar/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  
  const df = new DateFormatter("en-US", { dateStyle: "long" });
  let value = $state<DateValue>();
</script>

<Popover.Root>
  <Popover.Trigger>
    {#snippet child({ props })}
      <Button variant="outline" class={cn("w-[280px] justify-start text-left font-normal", !value && "text-muted-foreground")} {...props}>
        <CalendarIcon class="mr-2 size-4" />
        {value ? df.format(value.toDate(getLocalTimeZone())) : "Select a date"}
      </Button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content class="w-auto p-0">
    <Calendar bind:value type="single" initialFocus />
  </Popover.Content>
</Popover.Root>
```

### Date Range Picker

```svelte
<script lang="ts">
  import CalendarIcon from "@lucide/svelte/icons/calendar";
  import type { DateRange } from "bits-ui";
  import { CalendarDate, DateFormatter, type DateValue, getLocalTimeZone } from "@internationalized/date";
  import { cn } from "$lib/utils.js";
  import { buttonVariants } from "$lib/components/ui/button/index.js";
  import { RangeCalendar } from "$lib/components/ui/range-calendar/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  
  const df = new DateFormatter("en-US", { dateStyle: "medium" });
  let value: DateRange = $state({
    start: new CalendarDate(2022, 1, 20),
    end: new CalendarDate(2022, 1, 20).add({ days: 20 })
  });
  let startValue: DateValue | undefined = $state(undefined);
</script>

<div class="grid gap-2">
  <Popover.Root>
    <Popover.Trigger class={cn(buttonVariants({ variant: "outline" }), !value && "text-muted-foreground")}>
      <CalendarIcon class="mr-2 size-4" />
      {#if value && value.start}
        {#if value.end}
          {df.format(value.start.toDate(getLocalTimeZone()))} - {df.format(value.end.toDate(getLocalTimeZone()))}
        {:else}
          {df.format(value.start.toDate(getLocalTimeZone()))}
        {/if}
      {:else if startValue}
        {df.format(startValue.toDate(getLocalTimeZone()))}
      {:else}
        Pick a date
      {/if}
    </Popover.Trigger>
    <Popover.Content class="w-auto p-0" align="start">
      <RangeCalendar bind:value onStartValueChange={(v) => { startValue = v; }} numberOfMonths={2} />
    </Popover.Content>
  </Popover.Root>
</div>
```

### With Presets

```svelte
<script lang="ts">
  import CalendarIcon from "@lucide/svelte/icons/calendar";
  import { DateFormatter, type DateValue, getLocalTimeZone, today } from "@internationalized/date";
  import { cn } from "$lib/utils.js";
  import { buttonVariants } from "$lib/components/ui/button/index.js";
  import { Calendar } from "$lib/components/ui/calendar/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import * as Select from "$lib/components/ui/select/index.js";
  
  const df = new DateFormatter("en-US", { dateStyle: "long" });
  let value: DateValue | undefined = $state();
  const valueString = $derived(value ? df.format(value.toDate(getLocalTimeZone())) : "");
  const items = [
    { value: 0, label: "Today" },
    { value: 1, label: "Tomorrow" },
    { value: 3, label: "In 3 days" },
    { value: 7, label: "In a week" }
  ];
</script>

<Popover.Root>
  <Popover.Trigger class={cn(buttonVariants({ variant: "outline", class: "w-[280px] justify-start text-left font-normal" }), !value && "text-muted-foreground")}>
    <CalendarIcon class="mr-2 size-4" />
    {value ? df.format(value.toDate(getLocalTimeZone())) : "Pick a date"}
  </Popover.Trigger>
  <Popover.Content class="flex w-auto flex-col space-y-2 p-2">
    <Select.Root type="single" bind:value={() => valueString, (v) => { if (!v) return; value = today(getLocalTimeZone()).add({ days: Number.parseInt(v) }); }}>
      <Select.Trigger>{valueString}</Select.Trigger>
      <Select.Content>
        {#each items as item (item.value)}
          <Select.Item value={`${item.value}`}>{item.label}</Select.Item>
        {/each}
      </Select.Content>
    </Select.Root>
    <div class="rounded-md border">
      <Calendar type="single" bind:value />
    </div>
  </Popover.Content>
</Popover.Root>
```

### Form Integration

```svelte
<script lang="ts" module>
  import { z } from "zod/v4";
  const formSchema = z.object({
    dob: z.string().refine((v) => v, { message: "A date of birth is required." })
  });
</script>

<script lang="ts">
  import CalendarIcon from "@lucide/svelte/icons/calendar";
  import { CalendarDate, DateFormatter, type DateValue, getLocalTimeZone, parseDate, today } from "@internationalized/date";
  import { defaults, superForm } from "sveltekit-superforms";
  import { zod4 } from "sveltekit-superforms/adapters";
  import { toast } from "svelte-sonner";
  import { cn } from "$lib/utils.js";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import { Calendar } from "$lib/components/ui/calendar/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import * as Form from "$lib/components/ui/form/index.js";
  
  const form = superForm(defaults(zod4(formSchema)), {
    validators: zod4(formSchema),
    SPA: true,
    onUpdate: ({ form: f }) => {
      if (f.valid) {
        toast.success(`You submitted ${JSON.stringify(f.data, null, 2)}`);
      } else {
        toast.error("Please fix the errors in the form.");
      }
    }
  });
  
  const { form: formData, enhance } = form;
  const df = new DateFormatter("en-US", { dateStyle: "long" });
  let value = $derived($formData.dob ? parseDate($formData.dob) : undefined);
  let placeholder = $state<DateValue>(today(getLocalTimeZone()));
</script>

<form method="POST" class="space-y-8" use:enhance>
  <Form.Field {form} name="dob" class="flex flex-col">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Date of birth</Form.Label>
        <Popover.Root>
          <Popover.Trigger {...props} class={cn(buttonVariants({ variant: "outline" }), "w-[280px] justify-start pl-4 text-left font-normal", !value && "text-muted-foreground")}>
            {value ? df.format(value.toDate(getLocalTimeZone())) : "Pick a date"}
            <CalendarIcon class="ml-auto size-4 opacity-50" />
          </Popover.Trigger>
          <Popover.Content class="w-auto p-0" side="top">
            <Calendar type="single" value={value as DateValue} bind:placeholder minValue={new CalendarDate(1900, 1, 1)} maxValue={today(getLocalTimeZone())} calendarLabel="Date of birth" onValueChange={(v) => { if (v) { $formData.dob = v.toString(); } else { $formData.dob = ""; } }} />
          </Popover.Content>
        </Popover.Root>
        <Form.Description>Your date of birth is used to calculate your age</Form.Description>
        <Form.FieldErrors />
        <input hidden value={$formData.dob} name={props.name} />
      {/snippet}
    </Form.Control>
  </Form.Field>
  <Button type="submit">Submit</Button>
</form>
```

### dialog
Modal overlay component with Root, Trigger, Content, Header, Title, Description, and Footer subcomponents; install with `npx shadcn-svelte@latest add dialog -y -o`.

## Dialog

A modal window overlaid on the primary window or another dialog, rendering underlying content inert.

### Installation

```bash
npx shadcn-svelte@latest add dialog -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Usage

Import and compose dialog components:

```svelte
<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog/index.js";
</script>

<Dialog.Root>
  <Dialog.Trigger>Open</Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Are you sure absolutely sure?</Dialog.Title>
      <Dialog.Description>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </Dialog.Description>
    </Dialog.Header>
  </Dialog.Content>
</Dialog.Root>
```

### Components

- `Dialog.Root` - Container for the dialog
- `Dialog.Trigger` - Button or element that opens the dialog
- `Dialog.Content` - Main dialog container with styling
- `Dialog.Header` - Header section wrapper
- `Dialog.Title` - Dialog title
- `Dialog.Description` - Dialog description text
- `Dialog.Footer` - Footer section wrapper

### Example with Form

```svelte
<Dialog.Root>
  <Dialog.Trigger class={buttonVariants({ variant: "outline" })}>
    Edit Profile
  </Dialog.Trigger>
  <Dialog.Content class="sm:max-w-[425px]">
    <Dialog.Header>
      <Dialog.Title>Edit profile</Dialog.Title>
      <Dialog.Description>
        Make changes to your profile here. Click save when you're done.
      </Dialog.Description>
    </Dialog.Header>
    <div class="grid gap-4 py-4">
      <div class="grid grid-cols-4 items-center gap-4">
        <Label for="name" class="text-right">Name</Label>
        <Input id="name" value="Pedro Duarte" class="col-span-3" />
      </div>
      <div class="grid grid-cols-4 items-center gap-4">
        <Label for="username" class="text-right">Username</Label>
        <Input id="username" value="@peduarte" class="col-span-3" />
      </div>
    </div>
    <Dialog.Footer>
      <Button type="submit">Save changes</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
```

Built on Bits UI dialog component. See Bits UI documentation for full API reference and advanced options.

### drawer
Drawer component for slide-out panels; built on Vaul Svelte; supports responsive Dialog/Drawer pattern with MediaQuery for desktop/mobile.

## Drawer Component

A slide-out panel component built on Vaul Svelte (Svelte port of Vaul by Emil Kowalski).

### Installation

```bash
npx shadcn-svelte@latest add drawer -y -o
```

Flags: `-y` skips confirmation prompt, `-o` overwrites existing files.

### Basic Usage

```svelte
<script lang="ts">
  import * as Drawer from "$lib/components/ui/drawer/index.js";
</script>

<Drawer.Root>
  <Drawer.Trigger>Open</Drawer.Trigger>
  <Drawer.Content>
    <Drawer.Header>
      <Drawer.Title>Title</Drawer.Title>
      <Drawer.Description>Description</Drawer.Description>
    </Drawer.Header>
    <Drawer.Footer>
      <Button>Submit</Button>
      <Drawer.Close>Cancel</Drawer.Close>
    </Drawer.Footer>
  </Drawer.Content>
</Drawer.Root>
```

### Components

- `Drawer.Root` - Container
- `Drawer.Trigger` - Opens drawer
- `Drawer.Content` - Main content area
- `Drawer.Header` - Header section
- `Drawer.Title` - Title text
- `Drawer.Description` - Description text
- `Drawer.Footer` - Footer section
- `Drawer.Close` - Closes drawer

### Responsive Dialog/Drawer

Combine Dialog and Drawer to render Dialog on desktop (min-width: 768px) and Drawer on mobile:

```svelte
<script lang="ts">
  import { MediaQuery } from "svelte/reactivity";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import * as Drawer from "$lib/components/ui/drawer/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  
  let open = $state(false);
  const isDesktop = new MediaQuery("(min-width: 768px)");
  const id = $props.id();
</script>

{#if isDesktop.current}
  <Dialog.Root bind:open>
    <Dialog.Trigger class={buttonVariants({ variant: "outline" })}>
      Edit Profile
    </Dialog.Trigger>
    <Dialog.Content class="sm:max-w-[425px]">
      <Dialog.Header>
        <Dialog.Title>Edit profile</Dialog.Title>
        <Dialog.Description>
          Make changes to your profile here. Click save when you're done.
        </Dialog.Description>
      </Dialog.Header>
      <form class="grid items-start gap-4">
        <div class="grid gap-2">
          <Label for="email-{id}">Email</Label>
          <Input type="email" id="email-{id}" value="shadcn@example.com" />
        </div>
        <div class="grid gap-2">
          <Label for="username-{id}">Username</Label>
          <Input id="username-{id}" value="@shadcn" />
        </div>
        <Button type="submit">Save changes</Button>
      </form>
    </Dialog.Content>
  </Dialog.Root>
{:else}
  <Drawer.Root bind:open>
    <Drawer.Trigger class={buttonVariants({ variant: "outline" })}>
      Edit Profile
    </Drawer.Trigger>
    <Drawer.Content>
      <Drawer.Header class="text-left">
        <Drawer.Title>Edit profile</Drawer.Title>
        <Drawer.Description>
          Make changes to your profile here. Click save when you're done.
        </Drawer.Description>
      </Drawer.Header>
      <form class="grid items-start gap-4 px-4">
        <div class="grid gap-2">
          <Label for="email-{id}">Email</Label>
          <Input type="email" id="email-{id}" value="shadcn@example.com" />
        </div>
        <div class="grid gap-2">
          <Label for="username-{id}">Username</Label>
          <Input id="username-{id}" value="@shadcn" />
        </div>
        <Button type="submit">Save changes</Button>
      </form>
      <Drawer.Footer class="pt-2">
        <Drawer.Close class={buttonVariants({ variant: "outline" })}>
          Cancel
        </Drawer.Close>
      </Drawer.Footer>
    </Drawer.Content>
  </Drawer.Root>
{/if}
```

### Full Example with Chart

The documentation includes a complete example showing a drawer with interactive controls (plus/minus buttons) and an animated bar chart displaying goal data. The example demonstrates state management with `$state`, event handling, and integration with the layerchart library for data visualization.

### dropdown_menu
Dropdown menu component with Root/Trigger/Content structure; supports items, groups, separators, shortcuts, submenus, checkboxes (bind:checked), and radio groups (bind:value); install with `npx shadcn-svelte@latest add dropdown-menu -y -o`.

## Dropdown Menu

A menu component that displays a set of actions or functions triggered by a button.

### Installation

```bash
npx shadcn-svelte@latest add dropdown-menu -y -o
```

The `-y` flag skips the confirmation prompt and `-o` overwrites existing files.

### Basic Usage

```svelte
<script lang="ts">
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      <Button {...props} variant="outline">Open</Button>
    {/snippet}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content class="w-56" align="start">
    <DropdownMenu.Label>My Account</DropdownMenu.Label>
    <DropdownMenu.Group>
      <DropdownMenu.Item>
        Profile
        <DropdownMenu.Shortcut>P</DropdownMenu.Shortcut>
      </DropdownMenu.Item>
      <DropdownMenu.Item>Billing</DropdownMenu.Item>
      <DropdownMenu.Item>Settings</DropdownMenu.Item>
    </DropdownMenu.Group>
    <DropdownMenu.Separator />
    <DropdownMenu.Item disabled>API</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
```

### Components

- **Root**: Container for the dropdown menu
- **Trigger**: Button that opens the menu (accepts snippet with props)
- **Content**: Menu container with optional `align` and `class` props
- **Label**: Section label
- **Group**: Groups related items
- **Item**: Menu item (supports `disabled` prop)
- **Shortcut**: Keyboard shortcut display
- **Separator**: Visual divider
- **Sub/SubTrigger/SubContent**: Nested submenu support
- **CheckboxItem**: Menu item with checkbox (bind:checked for state)
- **RadioGroup/RadioItem**: Radio button group in menu

### Examples

**Checkboxes with state binding:**
```svelte
<script lang="ts">
  let showStatusBar = $state(true);
</script>

<DropdownMenu.CheckboxItem bind:checked={showStatusBar}>
  Status Bar
</DropdownMenu.CheckboxItem>
```

**Radio group:**
```svelte
<script lang="ts">
  let position = $state("bottom");
</script>

<DropdownMenu.RadioGroup bind:value={position}>
  <DropdownMenu.RadioItem value="top">Top</DropdownMenu.RadioItem>
  <DropdownMenu.RadioItem value="bottom">Bottom</DropdownMenu.RadioItem>
</DropdownMenu.RadioGroup>
```

### Changelog

**2024-10-30**: Added automatic styling for `DropdownMenu.SubTrigger` with `gap-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0` classes to style icons. Icon `size-4` class removed from manual implementation as it's now handled by parent.

### empty
Empty state component with Root, Header (Media/Title/Description), and Content sections; supports icon/avatar variants and Tailwind styling for borders and gradients.

## Empty Component

Display empty states with customizable content structure.

### Installation

```bash
npx shadcn-svelte@latest add empty -y -o
```

Use `-y` to skip confirmation and `-o` to overwrite existing files.

### Basic Usage

```svelte
<script lang="ts">
  import * as Empty from "$lib/components/ui/empty/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import FolderCodeIcon from "@tabler/icons-svelte/icons/folder-code";
</script>

<Empty.Root>
  <Empty.Header>
    <Empty.Media variant="icon">
      <FolderCodeIcon />
    </Empty.Media>
    <Empty.Title>No Projects Yet</Empty.Title>
    <Empty.Description>
      You haven't created any projects yet. Get started by creating your first project.
    </Empty.Description>
  </Empty.Header>
  <Empty.Content>
    <Button>Create Project</Button>
  </Empty.Content>
</Empty.Root>
```

### Component Structure

- `Empty.Root` - Container wrapper
- `Empty.Header` - Header section containing media, title, and description
- `Empty.Media` - Media container with `variant="icon"` (default) or `variant="default"` for custom content
- `Empty.Title` - Title text
- `Empty.Description` - Description text
- `Empty.Content` - Content area for buttons, forms, or other interactive elements

### Examples

**Outline variant** - Add dashed border:
```svelte
<Empty.Root class="border border-dashed">
  <Empty.Header>
    <Empty.Media variant="icon">
      <CloudIcon />
    </Empty.Media>
    <Empty.Title>Cloud Storage Empty</Empty.Title>
    <Empty.Description>Upload files to your cloud storage to access them anywhere.</Empty.Description>
  </Empty.Header>
  <Empty.Content>
    <Button variant="outline" size="sm">Upload Files</Button>
  </Empty.Content>
</Empty.Root>
```

**Background variant** - Add gradient background:
```svelte
<Empty.Root class="from-muted/50 to-background h-full bg-gradient-to-b from-30%">
  <Empty.Header>
    <Empty.Media variant="icon">
      <BellIcon />
    </Empty.Media>
    <Empty.Title>No Notifications</Empty.Title>
    <Empty.Description>You're all caught up. New notifications will appear here.</Empty.Description>
  </Empty.Header>
  <Empty.Content>
    <Button variant="outline" size="sm">
      <RefreshCcwIcon />
      Refresh
    </Button>
  </Empty.Content>
</Empty.Root>
```

**Avatar** - Display single avatar in media:
```svelte
<Empty.Root>
  <Empty.Header>
    <Empty.Media variant="default">
      <Avatar.Root class="size-12">
        <Avatar.Image src="https://github.com/shadcn.png" class="grayscale" />
        <Avatar.Fallback>LR</Avatar.Fallback>
      </Avatar.Root>
    </Empty.Media>
    <Empty.Title>User Offline</Empty.Title>
    <Empty.Description>This user is currently offline. You can leave a message to notify them or try again later.</Empty.Description>
  </Empty.Header>
  <Empty.Content>
    <Button size="sm">Leave Message</Button>
  </Empty.Content>
</Empty.Root>
```

**Avatar Group** - Display multiple overlapping avatars:
```svelte
<Empty.Root>
  <Empty.Header>
    <Empty.Media>
      <div class="*:ring-background flex -space-x-2 *:size-12 *:ring-2 *:grayscale">
        <Avatar.Root>
          <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
          <Avatar.Fallback>CN</Avatar.Fallback>
        </Avatar.Root>
        <Avatar.Root>
          <Avatar.Image src="https://github.com/maxleiter.png" alt="@maxleiter" />
          <Avatar.Fallback>ML</Avatar.Fallback>
        </Avatar.Root>
        <Avatar.Root>
          <Avatar.Image src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
          <Avatar.Fallback>ER</Avatar.Fallback>
        </Avatar.Root>
      </div>
    </Empty.Media>
    <Empty.Title>No Team Members</Empty.Title>
    <Empty.Description>Invite your team to collaborate on this project.</Empty.Description>
  </Empty.Header>
  <Empty.Content>
    <Button size="sm">
      <PlusIcon />
      Invite Members
    </Button>
  </Empty.Content>
</Empty.Root>
```

**With InputGroup** - Add search input to empty state:
```svelte
<Empty.Root>
  <Empty.Header>
    <Empty.Title>404 - Not Found</Empty.Title>
    <Empty.Description>The page you're looking for doesn't exist. Try searching for what you need below.</Empty.Description>
  </Empty.Header>
  <Empty.Content>
    <InputGroup.Root class="sm:w-3/4">
      <InputGroup.Input placeholder="Try searching for pages..." />
      <InputGroup.Addon>
        <SearchIcon />
      </InputGroup.Addon>
      <InputGroup.Addon align="inline-end">
        <Kbd.Root>/</Kbd.Root>
      </InputGroup.Addon>
    </InputGroup.Root>
    <Empty.Description>
      Need help? <a href="#/">Contact support</a>
    </Empty.Description>
  </Empty.Content>
</Empty.Root>
```

### Styling

Use Tailwind utility classes on `Empty.Root` to customize appearance:
- `border border-dashed` - Add dashed border outline
- `bg-gradient-to-b from-muted/50 to-background from-30%` - Add gradient background
- `h-full` - Full height container

### field
Composable form field components with labels, descriptions, errors, and validation; supports vertical/horizontal/responsive layouts; works with inputs, textareas, selects, sliders, checkboxes, radios, and switches.

## Field Component

Composable form field components for building accessible forms with labels, controls, help text, and validation states.

### Core Components

- `Field.Set`: Wrapper for a group of related fields with optional legend and description
- `Field.Group`: Container to stack multiple fields vertically
- `Field.Field`: Individual field wrapper with `orientation` prop ("vertical" default, "horizontal", or "responsive")
- `Field.Label`: Label element with `for` attribute linking to input
- `Field.Description`: Helper text displayed below the control
- `Field.Error`: Validation error message
- `Field.Legend`: Semantic heading for fieldsets
- `Field.Content`: Flex column grouping label and description
- `Field.Separator`: Visual divider between field groups
- `Field.Title`: Title within choice cards

### Installation

```bash
npx shadcn-svelte@latest add field -y -o
```

The `-y` flag skips the confirmation prompt and `-o` overwrites existing files.

### Basic Usage

```svelte
<script lang="ts">
  import * as Field from "$lib/components/ui/field/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
</script>

<Field.Set>
  <Field.Legend>Profile</Field.Legend>
  <Field.Description>This appears on invoices and emails.</Field.Description>
  <Field.Group>
    <Field.Field>
      <Field.Label for="name">Full name</Field.Label>
      <Input id="name" placeholder="Evil Rabbit" />
      <Field.Description>This appears on invoices and emails.</Field.Description>
    </Field.Field>
    <Field.Field>
      <Field.Label for="username">Username</Field.Label>
      <Input id="username" aria-invalid />
      <Field.Error>Choose another username.</Field.Error>
    </Field.Field>
  </Field.Group>
</Field.Set>
```

### Input Fields

```svelte
<Field.Set>
  <Field.Group>
    <Field.Field>
      <Field.Label for="username">Username</Field.Label>
      <Input id="username" type="text" placeholder="Max Leiter" />
      <Field.Description>Choose a unique username for your account.</Field.Description>
    </Field.Field>
    <Field.Field>
      <Field.Label for="password">Password</Field.Label>
      <Field.Description>Must be at least 8 characters long.</Field.Description>
      <Input id="password" type="password" placeholder="********" />
    </Field.Field>
  </Field.Group>
</Field.Set>
```

### Textarea

```svelte
<Field.Set>
  <Field.Group>
    <Field.Field>
      <Field.Label for="feedback">Feedback</Field.Label>
      <Textarea id="feedback" placeholder="Your feedback helps us improve..." rows={4} />
      <Field.Description>Share your thoughts about our service.</Field.Description>
    </Field.Field>
  </Field.Group>
</Field.Set>
```

### Select

```svelte
<script lang="ts">
  let department = $state<string>();
  const departments = [
    { value: "engineering", label: "Engineering" },
    { value: "design", label: "Design" },
    { value: "marketing", label: "Marketing" }
  ];
  const departmentLabel = $derived(
    departments.find((d) => d.value === department)?.label ?? "Choose department"
  );
</script>

<Field.Field>
  <Field.Label for="department">Department</Field.Label>
  <Select.Root type="single" bind:value={department}>
    <Select.Trigger id="department">{departmentLabel}</Select.Trigger>
    <Select.Content>
      {#each departments as dept (dept.value)}
        <Select.Item {...dept} />
      {/each}
    </Select.Content>
  </Select.Root>
  <Field.Description>Select your department or area of work.</Field.Description>
</Field.Field>
```

### Slider

```svelte
<script lang="ts">
  let value = $state([200, 800]);
</script>

<Field.Field>
  <Field.Label>Price Range</Field.Label>
  <Field.Description>
    Set your budget range ($<span class="font-medium">{value[0]}</span> - <span class="font-medium">{value[1]}</span>).
  </Field.Description>
  <Slider type="multiple" bind:value max={1000} min={0} step={10} class="mt-2 w-full" aria-label="Price Range" />
</Field.Field>
```

### Checkbox

```svelte
<Field.Group>
  <Field.Set>
    <Field.Legend variant="label">Show these items on the desktop</Field.Legend>
    <Field.Description>Select the items you want to show on the desktop.</Field.Description>
    <Field.Group class="gap-3">
      <Field.Field orientation="horizontal">
        <Checkbox id="hard-disks" checked />
        <Field.Label for="hard-disks" class="font-normal">Hard disks</Field.Label>
      </Field.Field>
      <Field.Field orientation="horizontal">
        <Checkbox id="external-disks" />
        <Field.Label for="external-disks" class="font-normal">External disks</Field.Label>
      </Field.Field>
    </Field.Group>
  </Field.Set>
  <Field.Separator />
  <Field.Field orientation="horizontal">
    <Checkbox id="sync-folders" checked />
    <Field.Content>
      <Field.Label for="sync-folders">Sync Desktop & Documents folders</Field.Label>
      <Field.Description>Your folders are being synced with iCloud Drive.</Field.Description>
    </Field.Content>
  </Field.Field>
</Field.Group>
```

### Radio

```svelte
<script lang="ts">
  let plan = $state("monthly");
</script>

<Field.Set>
  <Field.Label>Subscription Plan</Field.Label>
  <Field.Description>Yearly and lifetime plans offer significant savings.</Field.Description>
  <RadioGroup.Root bind:value={plan}>
    <Field.Field orientation="horizontal">
      <RadioGroup.Item value="monthly" id="plan-monthly" />
      <Field.Label for="plan-monthly" class="font-normal">Monthly ($9.99/month)</Field.Label>
    </Field.Field>
    <Field.Field orientation="horizontal">
      <RadioGroup.Item value="yearly" id="plan-yearly" />
      <Field.Label for="plan-yearly" class="font-normal">Yearly ($99.99/year)</Field.Label>
    </Field.Field>
  </RadioGroup.Root>
</Field.Set>
```

### Switch

```svelte
<Field.Field orientation="horizontal">
  <Field.Content>
    <Field.Label for="2fa">Multi-factor authentication</Field.Label>
    <Field.Description>Enable multi-factor authentication. If you do not have a two-factor device, you can use a one-time code sent to your email.</Field.Description>
  </Field.Content>
  <Switch id="2fa" />
</Field.Field>
```

### Choice Card (Selectable Field Groups)

Wrap Field components inside FieldLabel to create selectable field groups. Works with RadioItem, Checkbox, and Switch components.

```svelte
<script lang="ts">
  let computeEnvironment = $state("kubernetes");
</script>

<Field.Group>
  <Field.Set>
    <Field.Label for="compute-environment">Compute Environment</Field.Label>
    <Field.Description>Select the compute environment for your cluster.</Field.Description>
    <RadioGroup.Root bind:value={computeEnvironment}>
      <Field.Label for="kubernetes">
        <Field.Field orientation="horizontal">
          <Field.Content>
            <Field.Title>Kubernetes</Field.Title>
            <Field.Description>Run GPU workloads on a K8s configured cluster.</Field.Description>
          </Field.Content>
          <RadioGroup.Item value="kubernetes" id="kubernetes" />
        </Field.Field>
      </Field.Label>
      <Field.Label for="vm">
        <Field.Field orientation="horizontal">
          <Field.Content>
            <Field.Title>Virtual Machine</Field.Title>
            <Field.Description>Access a VM configured cluster to run GPU workloads.</Field.Description>
          </Field.Content>
          <RadioGroup.Item value="vm" id="vm" />
        </Field.Field>
      </Field.Label>
    </RadioGroup.Root>
  </Field.Set>
</Field.Group>
```

### Field Groups with Separators

```svelte
<Field.Group>
  <Field.Set>
    <Field.Label>Responses</Field.Label>
    <Field.Description>Get notified when ChatGPT responds to requests that take time.</Field.Description>
    <Field.Group data-slot="checkbox-group">
      <Field.Field orientation="horizontal">
        <Checkbox id="push" checked disabled />
        <Field.Label for="push" class="font-normal">Push notifications</Field.Label>
      </Field.Field>
    </Field.Group>
  </Field.Set>
  <Field.Separator />
  <Field.Set>
    <Field.Label>Tasks</Field.Label>
    <Field.Description>Get notified when tasks you've created have updates.</Field.Description>
    <Field.Group data-slot="checkbox-group">
      <Field.Field orientation="horizontal">
        <Checkbox id="push-tasks" />
        <Field.Label for="push-tasks" class="font-normal">Push notifications</Field.Label>
      </Field.Field>
      <Field.Field orientation="horizontal">
        <Checkbox id="email-tasks" />
        <Field.Label for="email-tasks" class="font-normal">Email notifications</Field.Label>
      </Field.Field>
    </Field.Group>
  </Field.Set>
</Field.Group>
```

### Responsive Layout

- **Vertical fields** (default): Stacks label, control, and helper text vertically—ideal for mobile-first layouts
- **Horizontal fields**: Set `orientation="horizontal"` on Field to align label and control side-by-side. Pair with FieldContent to keep descriptions aligned
- **Responsive fields**: Set `orientation="responsive"` for automatic column layouts inside container-aware parents. Apply `@container/field-group` classes on FieldGroup to switch orientations at specific breakpoints

```svelte
<Field.Set>
  <Field.Legend>Profile</Field.Legend>
  <Field.Description>Fill in your profile information.</Field.Description>
  <Field.Separator />
  <Field.Group>
    <Field.Field orientation="responsive">
      <Field.Content>
        <Field.Label for="name">Name</Field.Label>
        <Field.Description>Provide your full name for identification</Field.Description>
      </Field.Content>
      <Input id="name" placeholder="Evil Rabbit" required />
    </Field.Field>
    <Field.Separator />
    <Field.Field orientation="responsive">
      <Field.Content>
        <Field.Label for="message">Message</Field.Label>
        <Field.Description>Keep it short, preferably under 100 characters.</Field.Description>
      </Field.Content>
      <Textarea id="message" placeholder="Hello, world!" required class="min-h-[100px] resize-none sm:min-w-[300px]" />
    </Field.Field>
    <Field.Separator />
    <Field.Field orientation="responsive">
      <Button type="submit">Submit</Button>
      <Button type="button" variant="outline">Cancel</Button>
    </Field.Field>
  </Field.Group>
</Field.Set>
```

### Validation and Errors

Add `data-invalid` to Field to switch the entire block into an error state. Add `aria-invalid` on the input itself for assistive technologies. Render FieldError immediately after the control or inside FieldContent to keep error messages aligned with the field.

```svelte
<Field.Field data-invalid>
  <Field.Label for="email">Email</Field.Label>
  <Input id="email" type="email" aria-invalid />
  <Field.Error>Enter a valid email address.</Field.Error>
</Field.Field>
```

### Accessibility

- FieldSet and FieldLegend keep related controls grouped for keyboard and assistive tech users
- Field outputs `role="group"` so nested controls inherit labeling from FieldLabel and FieldLegend when combined
- Apply FieldSeparator sparingly to ensure screen readers encounter clear section boundaries

### form
Composable form components with Formsnap/Superforms/Zod integration for type-safe, accessible forms with client/server validation.

## Building Forms with Formsnap, Superforms & Zod

The Form components in shadcn-svelte wrap Formsnap and Superforms to provide composable form building with:
- Semantic HTML structure with proper ARIA attributes
- Client and server-side validation using Zod
- Integration with shadcn-svelte components (Select, RadioGroup, Switch, Checkbox, etc.)
- Type-safe form handling

### Component Anatomy
```
<form>
  <Form.Field>
    <Form.Control>
      <Form.Label />
    </Form.Control>
    <Form.Description />
    <Form.FieldErrors />
  </Form.Field>
</form>
```

### Setup Steps

1. **Define schema** (src/routes/settings/schema.ts):
```ts
import { z } from "zod";
export const formSchema = z.object({
  username: z.string().min(2).max(50),
});
export type FormSchema = typeof formSchema;
```

2. **Setup load function** (src/routes/settings/+page.server.ts):
```ts
import type { PageServerLoad } from "./$types.js";
import { superValidate } from "sveltekit-superforms";
import { formSchema } from "./schema";
import { zod4 } from "sveltekit-superforms/adapters";

export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(zod4(formSchema)),
  };
};
```

3. **Create form component** (src/routes/settings/settings-form.svelte):
```svelte
<script lang="ts">
  import * as Form from "$lib/components/ui/form/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { formSchema, type FormSchema } from "./schema";
  import { type SuperValidated, type Infer, superForm } from "sveltekit-superforms";
  import { zod4Client } from "sveltekit-superforms/adapters";

  let { data }: { data: { form: SuperValidated<Infer<FormSchema>> } } = $props();
  const form = superForm(data.form, {
    validators: zod4Client(formSchema),
  });
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
    <Form.Description>This is your public display name.</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Button>Submit</Form.Button>
</form>
```

4. **Use component** (src/routes/settings/+page.svelte):
```svelte
<script lang="ts">
  import type { PageData } from "./$types.js";
  import SettingsForm from "./settings-form.svelte";
  let { data }: { data: PageData } = $props();
</script>

<SettingsForm {data} />
```

5. **Create server action** (src/routes/settings/+page.server.ts):
```ts
import type { PageServerLoad, Actions } from "./$types.js";
import { fail } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import { formSchema } from "./schema";

export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(zod4(formSchema)),
  };
};

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, zod4(formSchema));
    if (!form.valid) {
      return fail(400, { form });
    }
    return { form };
  },
};
```

### SPA Example with Client-Side Validation
```svelte
<script lang="ts" module>
  import { z } from "zod";
  const formSchema = z.object({
    username: z.string().min(2).max(50)
  });
</script>

<script lang="ts">
  import { defaults, superForm } from "sveltekit-superforms";
  import { zod4 } from "sveltekit-superforms/adapters";
  import { toast } from "svelte-sonner";
  import * as Form from "$lib/components/ui/form/index.js";
  import { Input } from "$lib/components/ui/input/index.js";

  const form = superForm(defaults(zod4(formSchema)), {
    validators: zod4(formSchema),
    SPA: true,
    onUpdate: ({ form: f }) => {
      if (f.valid) {
        toast.success(`You submitted ${JSON.stringify(f.data, null, 2)}`);
      } else {
        toast.error("Please fix the errors in the form.");
      }
    }
  });
  const { form: formData, enhance } = form;
</script>

<form method="POST" class="w-2/3 space-y-6" use:enhance>
  <Form.Field {form} name="username">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Username</Form.Label>
        <Input {...props} bind:value={$formData.username} />
      {/snippet}
    </Form.Control>
    <Form.Description>This is your public display name.</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Button>Submit</Form.Button>
</form>
```

### Installation
```bash
npx shadcn-svelte@latest add form -y -o
```
(-y: skip confirmation, -o: overwrite existing files)

### Integration Examples
Form components work with: Checkbox, Date Picker, Input, Radio Group, Select, Switch, Textarea. See component-specific documentation for examples.

### hover-card
Hover card component for displaying link preview content on hover; composed of Root, Trigger (link element), and Content (preview) subcomponents.

## Hover Card

A component that displays preview content when users hover over a link, useful for showing additional information without navigation.

### Installation

```bash
npx shadcn-svelte@latest add hover-card -y -o
```

The `-y` flag skips the confirmation prompt and `-o` overwrites existing files.

### Basic Usage

```svelte
<script lang="ts">
  import * as HoverCard from "$lib/components/ui/hover-card/index.js";
</script>

<HoverCard.Root>
  <HoverCard.Trigger>Hover</HoverCard.Trigger>
  <HoverCard.Content>
    SvelteKit - Web development, streamlined
  </HoverCard.Content>
</HoverCard.Root>
```

### Complete Example with Avatar

```svelte
<script lang="ts">
  import CalendarDaysIcon from "@lucide/svelte/icons/calendar-days";
  import * as Avatar from "$lib/components/ui/avatar/index.js";
  import * as HoverCard from "$lib/components/ui/hover-card/index.js";
</script>

<HoverCard.Root>
  <HoverCard.Trigger
    href="https://github.com/sveltejs"
    target="_blank"
    rel="noreferrer noopener"
    class="rounded-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-black"
  >
    @sveltejs
  </HoverCard.Trigger>
  <HoverCard.Content class="w-80">
    <div class="flex justify-between space-x-4">
      <Avatar.Root>
        <Avatar.Image src="https://github.com/sveltejs.png" />
        <Avatar.Fallback>SK</Avatar.Fallback>
      </Avatar.Root>
      <div class="space-y-1">
        <h4 class="text-sm font-semibold">@sveltejs</h4>
        <p class="text-sm">Cybernetically enhanced web apps.</p>
        <div class="flex items-center pt-2">
          <CalendarDaysIcon class="mr-2 size-4 opacity-70" />
          <span class="text-muted-foreground text-xs">
            Joined September 2022
          </span>
        </div>
      </div>
    </div>
  </HoverCard.Content>
</HoverCard.Root>
```

### Structure

- `HoverCard.Root`: Container component
- `HoverCard.Trigger`: The element that triggers the hover preview (can be a link with href, target, rel attributes)
- `HoverCard.Content`: The preview content displayed on hover (supports custom styling with class prop)

The component is built on Bits UI's link-preview component. See Bits UI documentation for full API reference.

### input_group
Component for attaching icons, text, buttons, and other UI elements to input/textarea fields with flexible alignment (inline-end, block-start, block-end) and integration with tooltips, dropdowns, and custom inputs.

## Input Group

Display additional information or actions adjacent to input or textarea elements.

### Installation

```bash
npx shadcn-svelte@latest add input-group -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Basic Usage

```svelte
<script lang="ts">
  import * as InputGroup from "$lib/components/ui/input-group/index.js";
  import SearchIcon from "@lucide/svelte/icons/search";
</script>

<InputGroup.Root>
  <InputGroup.Input placeholder="Search..." />
  <InputGroup.Addon>
    <SearchIcon />
  </InputGroup.Addon>
  <InputGroup.Addon align="inline-end">
    <InputGroup.Button>Search</InputGroup.Button>
  </InputGroup.Addon>
</InputGroup.Root>
```

### Core Components

- **InputGroup.Root**: Container wrapper
- **InputGroup.Input**: Text input field
- **InputGroup.Textarea**: Multi-line text input
- **InputGroup.Addon**: Container for additional content (icons, text, buttons)
- **InputGroup.Text**: Display text content
- **InputGroup.Button**: Action buttons within addons

### Addon Alignment

The `align` prop on `InputGroup.Addon` controls positioning:
- `inline-end`: Right side (default for inline content)
- `block-end`: Bottom (for textarea)
- `block-start`: Top (for textarea)

### Icon Addon

```svelte
<InputGroup.Root>
  <InputGroup.Input type="email" placeholder="Enter your email" />
  <InputGroup.Addon>
    <MailIcon />
  </InputGroup.Addon>
</InputGroup.Root>
```

### Text Addon

Display currency, domain prefixes, or status information:

```svelte
<InputGroup.Root>
  <InputGroup.Addon>
    <InputGroup.Text>$</InputGroup.Text>
  </InputGroup.Addon>
  <InputGroup.Input placeholder="0.00" />
  <InputGroup.Addon align="inline-end">
    <InputGroup.Text>USD</InputGroup.Text>
  </InputGroup.Addon>
</InputGroup.Root>
```

### Button Addon

```svelte
<InputGroup.Root>
  <InputGroup.Input placeholder="https://x.com/shadcn" readonly />
  <InputGroup.Addon align="inline-end">
    <InputGroup.Button size="icon-xs" onclick={() => clipboard.copy(...)}>
      <CopyIcon />
    </InputGroup.Button>
  </InputGroup.Addon>
</InputGroup.Root>
```

### Tooltip Integration

```svelte
<InputGroup.Root>
  <InputGroup.Input placeholder="Enter password" type="password" />
  <InputGroup.Addon align="inline-end">
    <Tooltip.Root>
      <Tooltip.Trigger>
        {#snippet child({ props })}
          <InputGroup.Button {...props} variant="ghost" size="icon-xs">
            <InfoIcon />
          </InputGroup.Button>
        {/snippet}
      </Tooltip.Trigger>
      <Tooltip.Content>
        <p>Password must be at least 8 characters</p>
      </Tooltip.Content>
    </Tooltip.Root>
  </InputGroup.Addon>
</InputGroup.Root>
```

### Textarea with Block Addons

Use `block-start` and `block-end` alignment for textarea:

```svelte
<InputGroup.Root>
  <InputGroup.Addon align="block-start" class="border-b">
    <InputGroup.Text>script.js</InputGroup.Text>
    <InputGroup.Button class="ml-auto" size="icon-xs">
      <RefreshCwIcon />
    </InputGroup.Button>
  </InputGroup.Addon>
  <InputGroup.Textarea placeholder="console.log('Hello, world!');" />
  <InputGroup.Addon align="block-end" class="border-t">
    <InputGroup.Text>Line 1, Column 1</InputGroup.Text>
    <InputGroup.Button size="sm" class="ml-auto">Run</InputGroup.Button>
  </InputGroup.Addon>
</InputGroup.Root>
```

### Loading State

```svelte
<InputGroup.Root data-disabled>
  <InputGroup.Input placeholder="Searching..." disabled />
  <InputGroup.Addon align="inline-end">
    <Spinner />
  </InputGroup.Addon>
</InputGroup.Root>
```

### Dropdown Integration

```svelte
<InputGroup.Root>
  <InputGroup.Input placeholder="Enter search query" />
  <InputGroup.Addon align="inline-end">
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        {#snippet child({ props })}
          <InputGroup.Button {...props} variant="ghost">
            Search In... <ChevronDownIcon class="size-3" />
          </InputGroup.Button>
        {/snippet}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end">
        <DropdownMenu.Item>Documentation</DropdownMenu.Item>
        <DropdownMenu.Item>Blog Posts</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </InputGroup.Addon>
</InputGroup.Root>
```

### Label Integration

```svelte
<InputGroup.Root>
  <InputGroup.Input id="email" placeholder="shadcn" />
  <InputGroup.Addon>
    <Label.Root for="email">@</Label.Root>
  </InputGroup.Addon>
</InputGroup.Root>
```

### Button Group Wrapper

Combine with ButtonGroup for complex layouts:

```svelte
<ButtonGroup.Root>
  <ButtonGroup.Text>
    <Label.Root for="url">https://</Label.Root>
  </ButtonGroup.Text>
  <InputGroup.Root>
    <InputGroup.Input id="url" />
    <InputGroup.Addon align="inline-end">
      <Link2Icon />
    </InputGroup.Addon>
  </InputGroup.Root>
  <ButtonGroup.Text>.com</ButtonGroup.Text>
</ButtonGroup.Root>
```

### Custom Input

Add `data-slot="input-group-control"` to custom input elements for automatic behavior and focus state handling:

```svelte
<InputGroup.Root>
  <textarea
    data-slot="input-group-control"
    class="field-sizing-content flex min-h-16 w-full resize-none rounded-md bg-transparent px-3 py-2.5 text-base outline-none transition-[color,box-shadow]"
    placeholder="Autoresize textarea..."
  ></textarea>
  <InputGroup.Addon align="block-end">
    <InputGroup.Button class="ml-auto" size="sm" variant="default">
      Submit
    </InputGroup.Button>
  </InputGroup.Addon>
</InputGroup.Root>
```

No styles are applied to custom inputs; apply your own using the `class` prop.

### input-otp
Accessible OTP input component with configurable length, pattern validation, separators, and form integration support.

## Input OTP

Accessible one-time password component with copy-paste functionality, built on Bits UI's PinInput component.

### Installation

```bash
npx shadcn-svelte@latest add input-otp -y -o
```

The `-y` flag skips the confirmation prompt and `-o` overwrites existing files.

### Basic Usage

```svelte
<script lang="ts">
  import * as InputOTP from "$lib/components/ui/input-otp/index.js";
</script>

<InputOTP.Root maxlength={6}>
  {#snippet children({ cells })}
    <InputOTP.Group>
      {#each cells.slice(0, 3) as cell (cell)}
        <InputOTP.Slot {cell} />
      {/each}
    </InputOTP.Group>
    <InputOTP.Separator />
    <InputOTP.Group>
      {#each cells.slice(3, 6) as cell (cell)}
        <InputOTP.Slot {cell} />
      {/each}
    </InputOTP.Group>
  {/snippet}
</InputOTP.Root>
```

### Components

- **InputOTP.Root**: Container with `maxlength` prop to set OTP length
- **InputOTP.Group**: Groups cells together
- **InputOTP.Slot**: Individual input cell that receives `{cell}` prop
- **InputOTP.Separator**: Visual separator between groups

### Pattern Validation

Use the `pattern` prop to restrict input characters:

```svelte
<script lang="ts">
  import * as InputOTP from "$lib/components/ui/input-otp/index.js";
  import { REGEXP_ONLY_DIGITS_AND_CHARS } from "bits-ui";
</script>

<InputOTP.Root maxlength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS}>
  {#snippet children({ cells })}
    <InputOTP.Group>
      {#each cells as cell (cell)}
        <InputOTP.Slot {cell} />
      {/each}
    </InputOTP.Group>
  {/snippet}
</InputOTP.Root>
```

### Invalid State

Mark slots as invalid using the `aria-invalid` attribute:

```svelte
<InputOTP.Root maxlength={6}>
  {#snippet children({ cells })}
    <InputOTP.Group>
      {#each cells.slice(0, 3) as cell (cell)}
        <InputOTP.Slot aria-invalid {cell} />
      {/each}
    </InputOTP.Group>
    <InputOTP.Separator />
    <InputOTP.Group>
      {#each cells.slice(3, 6) as cell (cell)}
        <InputOTP.Slot aria-invalid {cell} />
      {/each}
    </InputOTP.Group>
  {/snippet}
</InputOTP.Root>
```

### Form Integration

Integrate with sveltekit-superforms for validation:

```svelte
<script lang="ts" module>
  import { z } from "zod/v4";
  const formSchema = z.object({
    pin: z.string().min(6, {
      message: "Your one-time password must be at least 6 characters."
    })
  });
</script>

<script lang="ts">
  import { defaults, superForm } from "sveltekit-superforms";
  import { zod4 } from "sveltekit-superforms/adapters";
  import { toast } from "svelte-sonner";
  import * as InputOTP from "$lib/components/ui/input-otp/index.js";
  import * as Form from "$lib/components/ui/form/index.js";

  const form = superForm(defaults(zod4(formSchema)), {
    validators: zod4(formSchema),
    SPA: true,
    onUpdate: ({ form: f }) => {
      if (f.valid) {
        toast.success(`You submitted ${JSON.stringify(f.data, null, 2)}`);
      } else {
        toast.error("Please fix the errors in the form.");
      }
    }
  });
  const { form: formData, enhance } = form;
</script>

<form method="POST" class="w-2/3 space-y-6" use:enhance>
  <Form.Field {form} name="pin">
    <Form.Control>
      {#snippet children({ props })}
        <InputOTP.Root maxlength={6} {...props} bind:value={$formData.pin}>
          {#snippet children({ cells })}
            <InputOTP.Group>
              {#each cells as cell (cell)}
                <InputOTP.Slot {cell} />
              {/each}
            </InputOTP.Group>
          {/snippet}
        </InputOTP.Root>
      {/snippet}
    </Form.Control>
    <Form.Description>Please enter the one-time password sent to your phone.</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Button>Submit</Form.Button>
</form>
```

### input
Form input component supporting multiple types (text, email, file), disabled/invalid states, labels, helper text, and sveltekit-superforms integration.

## Input Component

A form input field component for text, email, file, and other input types.

### Installation

```bash
npx shadcn-svelte@latest add input -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Basic Usage

```svelte
<script lang="ts">
  import { Input } from "$lib/components/ui/input/index.js";
</script>
<Input type="email" placeholder="email" class="max-w-xs" />
```

### Examples

**Default input:**
```svelte
<Input type="email" placeholder="email" class="max-w-xs" />
```

**Disabled state:**
```svelte
<Input disabled type="email" placeholder="email" class="max-w-sm" />
```

**With label:**
```svelte
<script lang="ts">
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  const id = $props.id();
</script>
<div class="flex w-full max-w-sm flex-col gap-1.5">
  <Label for="email-{id}">Email</Label>
  <Input type="email" id="email-{id}" placeholder="email" />
</div>
```

**With helper text:**
```svelte
<div class="flex w-full max-w-sm flex-col gap-1.5">
  <Label for="email">Email</Label>
  <Input type="email" id="email" placeholder="Email" />
  <p class="text-muted-foreground text-sm">Enter your email address.</p>
</div>
```

**With button (subscribe form):**
```svelte
<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
</script>
<form class="flex w-full max-w-sm items-center space-x-2">
  <Input type="email" placeholder="email" />
  <Button type="submit">Subscribe</Button>
</form>
```

**Invalid state:**
```svelte
<Input aria-invalid type="email" placeholder="email" value="shadcn@example" class="max-w-sm" />
```

**File input:**
```svelte
<div class="grid w-full max-w-sm items-center gap-1.5">
  <Label for="picture">Picture</Label>
  <Input id="picture" type="file" />
</div>
```

**With form validation (using sveltekit-superforms and zod):**
```svelte
<script lang="ts" module>
  import { z } from "zod/v4";
  const formSchema = z.object({
    username: z.string().min(2).max(50)
  });
</script>
<script lang="ts">
  import { defaults, superForm } from "sveltekit-superforms";
  import { zod4 } from "sveltekit-superforms/adapters";
  import { toast } from "svelte-sonner";
  import * as Form from "$lib/components/ui/form/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  
  const form = superForm(defaults(zod4(formSchema)), {
    validators: zod4(formSchema),
    SPA: true,
    onUpdate: ({ form: f }) => {
      if (f.valid) {
        toast.success(`You submitted ${JSON.stringify(f.data, null, 2)}`);
      } else {
        toast.error("Please fix the errors in the form.");
      }
    }
  });
  const { form: formData, enhance } = form;
</script>
<form method="POST" class="w-2/3 space-y-6" use:enhance>
  <Form.Field {form} name="username">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Username</Form.Label>
        <Input {...props} bind:value={$formData.username} />
      {/snippet}
    </Form.Control>
    <Form.Description>This is your public display name.</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Button>Submit</Form.Button>
</form>
```

The component supports standard HTML input attributes (type, placeholder, disabled, aria-invalid) and integrates with other shadcn-svelte components like Label, Button, and Form for building complete form interfaces.

### item
Flex container component for displaying content (title, description, media, actions); supports variants (default/outline/muted), sizes (default/sm), media types (icon/avatar/image), grouping with separators, link rendering via child snippet, and dropdown integration.

## Item Component

A flex container component for displaying content with optional title, description, media, and actions. Use when displaying content-only layouts; use Field component instead for form inputs.

### Installation

```bash
npx shadcn-svelte@latest add item -y -o
```

The `-y` flag skips the confirmation prompt and `-o` overwrites existing files.

### Basic Usage

```svelte
<script lang="ts">
  import * as Item from "$lib/components/ui/item/index.js";
</script>

<Item.Root>
  <Item.Header>Item Header</Item.Header>
  <Item.Media />
  <Item.Content>
    <Item.Title>Item</Item.Title>
    <Item.Description>Item</Item.Description>
  </Item.Content>
  <Item.Actions />
  <Item.Footer>Item Footer</Item.Footer>
</Item.Root>
```

### Variants

Three variants available: default (subtle background and borders), `outline` (clear borders, transparent background), and `muted` (subdued appearance for secondary content).

```svelte
<Item.Root variant="outline">
  <Item.Content>
    <Item.Title>Outline Variant</Item.Title>
    <Item.Description>Outlined style with clear borders.</Item.Description>
  </Item.Content>
  <Item.Actions>
    <Button variant="outline" size="sm">Open</Button>
  </Item.Actions>
</Item.Root>
```

### Sizes

Default and `sm` (compact) sizes available.

```svelte
<Item.Root variant="outline" size="sm">
  {#snippet child({ props })}
    <a href="#/" {...props}>
      <Item.Media>
        <BadgeCheckIcon class="size-5" />
      </Item.Media>
      <Item.Content>
        <Item.Title>Your profile has been verified.</Item.Title>
      </Item.Content>
      <Item.Actions>
        <ChevronRightIcon class="size-4" />
      </Item.Actions>
    </a>
  {/snippet}
</Item.Root>
```

### Media Variants

**Icon**: Display icons in media slot with `variant="icon"`.

```svelte
<Item.Root variant="outline">
  <Item.Media variant="icon">
    <ShieldAlertIcon />
  </Item.Media>
  <Item.Content>
    <Item.Title>Security Alert</Item.Title>
    <Item.Description>New login detected from unknown device.</Item.Description>
  </Item.Content>
  <Item.Actions>
    <Button size="sm" variant="outline">Review</Button>
  </Item.Actions>
</Item.Root>
```

**Avatar**: Use Avatar component in media slot.

```svelte
<Item.Root variant="outline">
  <Item.Media>
    <Avatar.Root class="size-10">
      <Avatar.Image src="https://github.com/evilrabbit.png" />
      <Avatar.Fallback>ER</Avatar.Fallback>
    </Avatar.Root>
  </Item.Media>
  <Item.Content>
    <Item.Title>Evil Rabbit</Item.Title>
    <Item.Description>Last seen 5 months ago</Item.Description>
  </Item.Content>
  <Item.Actions>
    <Button size="icon" variant="outline" class="rounded-full">
      <Plus />
    </Button>
  </Item.Actions>
</Item.Root>
```

**Image**: Use `variant="image"` for image media.

```svelte
<Item.Root variant="outline">
  {#snippet child({ props })}
    <a href="#/" {...props}>
      <Item.Media variant="image">
        <img src="..." alt="..." class="size-8 rounded object-cover" />
      </Item.Media>
      <Item.Content>
        <Item.Title>Song Title</Item.Title>
        <Item.Description>Artist Name</Item.Description>
      </Item.Content>
    </a>
  {/snippet}
</Item.Root>
```

### Grouping Items

Use `Item.Group` to create a list of items. Add `Item.Separator` between items.

```svelte
<Item.Group>
  {#each people as person, index (person.username)}
    <Item.Root>
      <Item.Media>
        <Avatar.Root>
          <Avatar.Image src={person.avatar} />
          <Avatar.Fallback>{person.username.charAt(0)}</Avatar.Fallback>
        </Avatar.Root>
      </Item.Media>
      <Item.Content class="gap-1">
        <Item.Title>{person.username}</Item.Title>
        <Item.Description>{person.email}</Item.Description>
      </Item.Content>
      <Item.Actions>
        <Button variant="ghost" size="icon" class="rounded-full">
          <Plus />
        </Button>
      </Item.Actions>
    </Item.Root>
    {#if index !== people.length - 1}
      <Item.Separator />
    {/if}
  {/each}
</Item.Group>
```

### Header Section

Use `Item.Header` for full-width content like images at the top.

```svelte
<Item.Root variant="outline">
  <Item.Header>
    <img src="..." alt="..." class="aspect-square w-full rounded-sm object-cover" />
  </Item.Header>
  <Item.Content>
    <Item.Title>Model Name</Item.Title>
    <Item.Description>Model description</Item.Description>
  </Item.Content>
</Item.Root>
```

### Link Items

Use the `child` snippet to render items as links. Hover and focus states apply to the anchor element.

```svelte
<Item.Root>
  {#snippet child({ props })}
    <a href="#/" {...props}>
      <Item.Content>
        <Item.Title>Visit our documentation</Item.Title>
        <Item.Description>Learn how to get started.</Item.Description>
      </Item.Content>
      <Item.Actions>
        <ChevronRightIcon class="size-4" />
      </Item.Actions>
    </a>
  {/snippet}
</Item.Root>
```

### Dropdown Integration

Items work well inside dropdown menus.

```svelte
<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      <Button {...props} variant="outline" size="sm">
        Select <ChevronDown />
      </Button>
    {/snippet}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content class="w-72">
    {#each people as person (person.username)}
      <DropdownMenu.Item class="p-0">
        <Item.Root size="sm" class="w-full p-2">
          <Item.Media>
            <Avatar.Root class="size-8">
              <Avatar.Image src={person.avatar} />
              <Avatar.Fallback>{person.username.charAt(0)}</Avatar.Fallback>
            </Avatar.Root>
          </Item.Media>
          <Item.Content class="gap-0.5">
            <Item.Title>{person.username}</Item.Title>
            <Item.Description>{person.email}</Item.Description>
          </Item.Content>
        </Item.Root>
      </DropdownMenu.Item>
    {/each}
  </DropdownMenu.Content>
</DropdownMenu.Root>
```

### Component Structure

- `Item.Root`: Main container with `variant` and `size` props
- `Item.Header`: Full-width top section
- `Item.Media`: Left-side media container (icon, avatar, or image)
- `Item.Content`: Main content area with title and description
- `Item.Title`: Item title text
- `Item.Description`: Item description text
- `Item.Actions`: Right-side action buttons/icons
- `Item.Footer`: Full-width bottom section
- `Item.Group`: Container for multiple items
- `Item.Separator`: Visual divider between grouped items

### kbd
Kbd component for displaying keyboard keys; use Kbd.Root for individual keys and Kbd.Group to combine multiple keys; integrates with Button, Tooltip, and InputGroup components.

## Kbd Component

Displays textual user input from keyboard.

### Installation

```bash
npx shadcn-svelte@latest add kbd -y -o
```

Use `-y` to skip confirmation prompt and `-o` to overwrite existing files.

### Basic Usage

```svelte
<script lang="ts">
  import * as Kbd from "$lib/components/ui/kbd/index.js";
</script>
<Kbd.Root>B</Kbd.Root>
```

### Components

- `Kbd.Root`: Individual keyboard key display
- `Kbd.Group`: Groups multiple keyboard keys together

### Examples

**Group keys together:**
```svelte
<Kbd.Group>
  <Kbd.Root>Ctrl</Kbd.Root>
  <span>+</span>
  <Kbd.Root>B</Kbd.Root>
</Kbd.Group>
```

**Inside Button:**
```svelte
<Button variant="outline" size="sm" class="pr-2">
  Accept <Kbd.Root></Kbd.Root>
</Button>
<Button variant="outline" size="sm" class="pr-2">
  Cancel <Kbd.Root>Esc</Kbd.Root>
</Button>
```

**Inside Tooltip:**
```svelte
<Tooltip.Root>
  <Tooltip.Trigger>
    {#snippet child({ props })}
      <Button size="sm" variant="outline" {...props}>Save</Button>
    {/snippet}
  </Tooltip.Trigger>
  <Tooltip.Content>
    <div class="flex items-center gap-2">
      Save Changes <Kbd.Root>S</Kbd.Root>
    </div>
  </Tooltip.Content>
</Tooltip.Root>
<Tooltip.Root>
  <Tooltip.Trigger>
    {#snippet child({ props })}
      <Button size="sm" variant="outline" {...props}>Print</Button>
    {/snippet}
  </Tooltip.Trigger>
  <Tooltip.Content>
    <div class="flex items-center gap-2">
      Print Document
      <Kbd.Group>
        <Kbd.Root>Ctrl</Kbd.Root>
        <Kbd.Root>P</Kbd.Root>
      </Kbd.Group>
    </div>
  </Tooltip.Content>
</Tooltip.Root>
```

**Inside InputGroup:**
```svelte
<InputGroup.Root>
  <InputGroup.Input placeholder="Search..." />
  <InputGroup.Addon>
    <SearchIcon />
  </InputGroup.Addon>
  <InputGroup.Addon align="inline-end">
    <Kbd.Root></Kbd.Root>
    <Kbd.Root>K</Kbd.Root>
  </InputGroup.Addon>
</InputGroup.Root>
```

### label
Accessible label component with for attribute to associate with form controls; install with `npx shadcn-svelte@latest add label -y -o`

## Label Component

Renders an accessible label associated with form controls.

### Installation

```bash
npx shadcn-svelte@latest add label -y -o
```

The `-y` flag skips the confirmation prompt and `-o` overwrites existing files.

### Usage

Import the Label component:

```svelte
<script lang="ts">
  import { Label } from "$lib/components/ui/label/index.js";
</script>

<Label for="email">Your email address</Label>
```

### Example with Checkbox

```svelte
<script lang="ts">
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
</script>

<div class="flex items-center space-x-2">
  <Checkbox id="terms" />
  <Label for="terms">Accept terms and conditions</Label>
</div>
```

The `for` attribute associates the label with a form control by matching the control's `id`.

For full API reference and additional documentation, see the Bits UI Label documentation.

### menubar
Desktop menubar with File/Edit/View menus, submenus, checkboxes, radio groups, shortcuts, and separators.

## Menubar

A persistent menu component common in desktop applications providing quick access to a consistent set of commands.

### Installation

```bash
npx shadcn-svelte@latest add menubar -y -o
```

The `-y` flag skips the confirmation prompt and `-o` overwrites existing files.

### Basic Usage

```svelte
<script lang="ts">
  import * as Menubar from "$lib/components/ui/menubar/index.js";
</script>

<Menubar.Root>
  <Menubar.Menu>
    <Menubar.Trigger>File</Menubar.Trigger>
    <Menubar.Content>
      <Menubar.Item>
        New Tab
        <Menubar.Shortcut>T</Menubar.Shortcut>
      </Menubar.Item>
      <Menubar.Item>New Window</Menubar.Item>
      <Menubar.Separator />
      <Menubar.Item>Share</Menubar.Item>
      <Menubar.Separator />
      <Menubar.Item>Print</Menubar.Item>
    </Menubar.Content>
  </Menubar.Menu>
</Menubar.Root>
```

### Component Structure

- **Menubar.Root**: Container for all menus
- **Menubar.Menu**: Individual menu group
- **Menubar.Trigger**: Menu label/button
- **Menubar.Content**: Menu dropdown container
- **Menubar.Item**: Menu item
- **Menubar.Shortcut**: Keyboard shortcut display
- **Menubar.Separator**: Visual divider between items
- **Menubar.Sub / Menubar.SubTrigger / Menubar.SubContent**: Nested submenu
- **Menubar.CheckboxItem**: Checkbox menu item with `bind:checked` binding
- **Menubar.RadioGroup / Menubar.RadioItem**: Radio button group with `bind:value` binding
- **Menubar.Item inset**: Item with inset styling (typically for secondary actions)

### Advanced Example

```svelte
<script lang="ts">
  let bookmarks = $state(false);
  let profileValue = $state("benoit");
</script>

<Menubar.Root>
  <Menubar.Menu>
    <Menubar.Trigger>View</Menubar.Trigger>
    <Menubar.Content>
      <Menubar.CheckboxItem bind:checked={bookmarks}>
        Always Show Bookmarks Bar
      </Menubar.CheckboxItem>
      <Menubar.Separator />
      <Menubar.Item inset>
        Reload <Menubar.Shortcut>R</Menubar.Shortcut>
      </Menubar.Item>
    </Menubar.Content>
  </Menubar.Menu>
  <Menubar.Menu>
    <Menubar.Trigger>Profiles</Menubar.Trigger>
    <Menubar.Content>
      <Menubar.RadioGroup bind:value={profileValue}>
        <Menubar.RadioItem value="andy">Andy</Menubar.RadioItem>
        <Menubar.RadioItem value="benoit">Benoit</Menubar.RadioItem>
      </Menubar.RadioGroup>
      <Menubar.Separator />
      <Menubar.Item inset>Edit...</Menubar.Item>
    </Menubar.Content>
  </Menubar.Menu>
  <Menubar.Menu>
    <Menubar.Trigger>Edit</Menubar.Trigger>
    <Menubar.Content>
      <Menubar.Sub>
        <Menubar.SubTrigger>Find</Menubar.SubTrigger>
        <Menubar.SubContent>
          <Menubar.Item>Search the web</Menubar.Item>
          <Menubar.Separator />
          <Menubar.Item>Find...</Menubar.Item>
        </Menubar.SubContent>
      </Menubar.Sub>
    </Menubar.Content>
  </Menubar.Menu>
</Menubar.Root>
```

### Features

- Multiple independent menus in a single menubar
- Nested submenus with SubTrigger and SubContent
- Checkbox items with reactive state binding
- Radio button groups with reactive value binding
- Keyboard shortcuts display
- Visual separators
- Inset styling for secondary menu items
- Full keyboard navigation support (via underlying Bits UI component)

### native-select
Native HTML select wrapper with styling, grouping (OptGroup), disabled/invalid states, and full accessibility support.

## Native Select

A styled wrapper around the native HTML select element with consistent design system integration.

### Installation

```bash
npx shadcn-svelte@latest add native-select -y -o
```

The `-y` flag skips the confirmation prompt and `-o` overwrites existing files.

### Basic Usage

```svelte
<script lang="ts">
  import * as NativeSelect from "$lib/components/ui/native-select/index.js";
</script>

<NativeSelect.Root>
  <NativeSelect.Option value="">Select status</NativeSelect.Option>
  <NativeSelect.Option value="todo">Todo</NativeSelect.Option>
  <NativeSelect.Option value="in-progress">In Progress</NativeSelect.Option>
  <NativeSelect.Option value="done">Done</NativeSelect.Option>
</NativeSelect.Root>
```

### Grouped Options

Use `NativeSelect.OptGroup` to organize related options:

```svelte
<NativeSelect.Root>
  <NativeSelect.Option value="">Select department</NativeSelect.Option>
  <NativeSelect.OptGroup label="Engineering">
    <NativeSelect.Option value="frontend">Frontend</NativeSelect.Option>
    <NativeSelect.Option value="backend">Backend</NativeSelect.Option>
  </NativeSelect.OptGroup>
  <NativeSelect.OptGroup label="Sales">
    <NativeSelect.Option value="sales-rep">Sales Rep</NativeSelect.Option>
  </NativeSelect.OptGroup>
</NativeSelect.Root>
```

### Disabled State

Disable individual options or the entire select:

```svelte
<NativeSelect.Root disabled>
  <NativeSelect.Option value="">Select priority</NativeSelect.Option>
  <NativeSelect.Option value="low">Low</NativeSelect.Option>
  <NativeSelect.Option value="high">High</NativeSelect.Option>
</NativeSelect.Root>
```

Or disable specific options:

```svelte
<NativeSelect.Option value="grapes" disabled>Grapes</NativeSelect.Option>
```

### Invalid State

Use `aria-invalid="true"` to show validation errors:

```svelte
<NativeSelect.Root aria-invalid="true">
  <NativeSelect.Option value="">Select role</NativeSelect.Option>
  <NativeSelect.Option value="admin">Admin</NativeSelect.Option>
  <NativeSelect.Option value="editor">Editor</NativeSelect.Option>
</NativeSelect.Root>
```

### API Reference

**NativeSelect.Root** - Main select component wrapping native HTML select
- `class`: string - Custom CSS classes
- All other props pass through to the underlying `<select>` element

**NativeSelect.Option** - Individual option element
- `value`: string - Option value
- `disabled`: boolean (default: false) - Disable this option
- `class`: string - Custom CSS classes
- All other props pass through to the underlying `<option>` element

**NativeSelect.OptGroup** - Groups related options
- `label`: string - Group label
- `disabled`: boolean (default: false) - Disable entire group
- `class`: string - Custom CSS classes
- All other props pass through to the underlying `<optgroup>` element

### When to Use

Use `NativeSelect` for native browser behavior, better performance, and mobile-optimized dropdowns. Use the `Select` component instead when you need custom styling, animations, or complex interactions.

### Accessibility

- Maintains all native HTML select accessibility features
- Screen readers navigate through options using arrow keys
- Chevron icon marked as `aria-hidden="true"` to avoid duplication
- Use `aria-label` or `aria-labelledby` for additional context:

```svelte
<NativeSelect.Root aria-label="Choose your preferred language">
  <NativeSelect.Option value="en">English</NativeSelect.Option>
  <NativeSelect.Option value="es">Spanish</NativeSelect.Option>
</NativeSelect.Root>
```

### navigation-menu
Navigation menu component with Root/List/Item/Trigger/Content/Link subcomponents; supports grid layouts, descriptions, icons, and snippet-based children; install with `npx shadcn-svelte@latest add navigation-menu -y -o`.

## Navigation Menu

A collection of links for navigating websites. Built on Bits UI with Tailwind CSS styling.

### Installation

```bash
npx shadcn-svelte@latest add navigation-menu -y -o
```

The `-y` flag skips the confirmation prompt and `-o` overwrites existing files.

### Basic Usage

```svelte
<script lang="ts">
  import * as NavigationMenu from "$lib/components/ui/navigation-menu/index.js";
</script>

<NavigationMenu.Root>
  <NavigationMenu.List>
    <NavigationMenu.Item>
      <NavigationMenu.Trigger>Item One</NavigationMenu.Trigger>
      <NavigationMenu.Content>
        <NavigationMenu.Link>Link</NavigationMenu.Link>
      </NavigationMenu.Content>
    </NavigationMenu.Item>
  </NavigationMenu.List>
</NavigationMenu.Root>
```

### Component Structure

- `NavigationMenu.Root` - Container with optional `viewport={false}` prop
- `NavigationMenu.List` - Wrapper for menu items
- `NavigationMenu.Item` - Individual menu item
- `NavigationMenu.Trigger` - Clickable trigger that opens content
- `NavigationMenu.Content` - Dropdown content container
- `NavigationMenu.Link` - Link element with snippet-based child content

### Advanced Examples

**Grid Layout with Descriptions:**
```svelte
<NavigationMenu.Item>
  <NavigationMenu.Trigger>Components</NavigationMenu.Trigger>
  <NavigationMenu.Content>
    <ul class="grid w-[400px] gap-2 p-2 md:w-[500px] md:grid-cols-2">
      <li>
        <NavigationMenu.Link>
          {#snippet child()}
            <a href="/docs/components/alert-dialog" class="block p-3 rounded-md hover:bg-accent">
              <div class="text-sm font-medium">Alert Dialog</div>
              <p class="text-muted-foreground text-sm">A modal dialog that interrupts the user with important content.</p>
            </a>
          {/snippet}
        </NavigationMenu.Link>
      </li>
    </ul>
  </NavigationMenu.Content>
</NavigationMenu.Item>
```

**Featured Item with Grid:**
```svelte
<ul class="grid gap-2 p-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
  <li class="row-span-3">
    <NavigationMenu.Link class="bg-linear-to-b from-muted/50 to-muted flex h-full flex-col justify-end rounded-md p-6">
      {#snippet child({ props })}
        <a {...props} href="/">
          <div class="text-lg font-medium">shadcn-svelte</div>
          <p class="text-muted-foreground text-sm">Beautifully designed components built with Tailwind CSS.</p>
        </a>
      {/snippet}
    </NavigationMenu.Link>
  </li>
</ul>
```

**With Icons:**
```svelte
<NavigationMenu.Link href="##" class="flex-row items-center gap-2">
  <CircleCheckIcon />
  Done
</NavigationMenu.Link>
```

### Styling

- Use `navigationMenuTriggerStyle()` utility for consistent trigger styling
- Use `cn()` utility to combine classes
- Supports Tailwind CSS classes for customization (hover states, colors, spacing, etc.)
- Supports snippet-based child content for flexible rendering

### Key Props

- `NavigationMenu.Root`: `viewport` - boolean to control viewport behavior
- `NavigationMenu.Link`: `href` - link destination, `class` - custom styling
- All components support standard HTML attributes and Svelte event handlers

### Related Documentation

See Bits UI documentation for full API reference and additional configuration options.

### pagination
Pagination component with page navigation, prev/next buttons, and ellipsis; configure via count, perPage, siblingCount props; render pages with Pagination.Link and highlight active page.

## Pagination Component

A UI component for navigating through paginated content with page numbers, previous/next buttons, and ellipsis for skipped pages.

### Installation

```bash
npx shadcn-svelte@latest add pagination -y -o
```

The `-y` flag skips the confirmation prompt and `-o` overwrites existing files.

### Basic Usage

Import and use the Pagination component:

```svelte
<script lang="ts">
  import * as Pagination from "$lib/components/ui/pagination/index.js";
</script>

<Pagination.Root count={100} perPage={10}>
  {#snippet children({ pages, currentPage })}
    <Pagination.Content>
      <Pagination.Item>
        <Pagination.PrevButton />
      </Pagination.Item>
      {#each pages as page (page.key)}
        {#if page.type === "ellipsis"}
          <Pagination.Item>
            <Pagination.Ellipsis />
          </Pagination.Item>
        {:else}
          <Pagination.Item>
            <Pagination.Link {page} isActive={currentPage === page.value}>
              {page.value}
            </Pagination.Link>
          </Pagination.Item>
        {/if}
      {/each}
      <Pagination.Item>
        <Pagination.NextButton />
      </Pagination.Item>
    </Pagination.Content>
  {/snippet}
</Pagination.Root>
```

### Component Structure

- **Pagination.Root**: Container that accepts `count` (total items), `perPage` (items per page), and optional `siblingCount` (page numbers shown around current page)
- **Pagination.Content**: Wrapper for pagination items
- **Pagination.Item**: Individual pagination element container
- **Pagination.Link**: Clickable page number link with `isActive` prop to highlight current page
- **Pagination.PrevButton**: Previous page button
- **Pagination.NextButton**: Next page button
- **Pagination.Ellipsis**: Ellipsis indicator for skipped pages

### Advanced Example with Responsive Behavior

```svelte
<script lang="ts">
  import ChevronLeftIcon from "@lucide/svelte/icons/chevron-left";
  import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";
  import { MediaQuery } from "svelte/reactivity";
  import * as Pagination from "$lib/components/ui/pagination/index.js";
  
  const isDesktop = new MediaQuery("(min-width: 768px)");
  const count = 20;
  const perPage = $derived(isDesktop.current ? 3 : 8);
  const siblingCount = $derived(isDesktop.current ? 1 : 0);
</script>

<Pagination.Root {count} {perPage} {siblingCount}>
  {#snippet children({ pages, currentPage })}
    <Pagination.Content>
      <Pagination.Item>
        <Pagination.PrevButton>
          <ChevronLeftIcon class="size-4" />
          <span class="hidden sm:block">Previous</span>
        </Pagination.PrevButton>
      </Pagination.Item>
      {#each pages as page (page.key)}
        {#if page.type === "ellipsis"}
          <Pagination.Item>
            <Pagination.Ellipsis />
          </Pagination.Item>
        {:else}
          <Pagination.Item>
            <Pagination.Link {page} isActive={currentPage === page.value}>
              {page.value}
            </Pagination.Link>
          </Pagination.Item>
        {/if}
      {/each}
      <Pagination.Item>
        <Pagination.NextButton>
          <span class="hidden sm:block">Next</span>
          <ChevronRightIcon class="size-4" />
        </Pagination.NextButton>
      </Pagination.Item>
    </Pagination.Content>
  {/snippet}
</Pagination.Root>
```

This example shows responsive pagination that adjusts `perPage` and `siblingCount` based on screen size, and adds icons and conditional text labels to navigation buttons.

### popover
Portal component displaying rich content triggered by button; compose with Root, Trigger, and Content subcomponents.

## Popover

A component that displays rich content in a portal, triggered by a button.

### Basic Usage

```svelte
<script lang="ts">
  import * as Popover from "$lib/components/ui/popover/index.js";
</script>

<Popover.Root>
  <Popover.Trigger>Open</Popover.Trigger>
  <Popover.Content>Place content for the popover here.</Popover.Content>
</Popover.Root>
```

### Installation

```bash
npx shadcn-svelte@latest add popover -y -o
```

The `-y` flag skips the confirmation prompt and `-o` overwrites existing files.

### Complete Example

```svelte
<script lang="ts">
  import { buttonVariants } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
</script>

<Popover.Root>
  <Popover.Trigger class={buttonVariants({ variant: "outline" })}>
    Open
  </Popover.Trigger>
  <Popover.Content class="w-80">
    <div class="grid gap-4">
      <div class="space-y-2">
        <h4 class="font-medium leading-none">Dimensions</h4>
        <p class="text-muted-foreground text-sm">
          Set the dimensions for the layer.
        </p>
      </div>
      <div class="grid gap-2">
        <div class="grid grid-cols-3 items-center gap-4">
          <Label for="width">Width</Label>
          <Input id="width" value="100%" class="col-span-2 h-8" />
        </div>
        <div class="grid grid-cols-3 items-center gap-4">
          <Label for="maxWidth">Max. width</Label>
          <Input id="maxWidth" value="300px" class="col-span-2 h-8" />
        </div>
        <div class="grid grid-cols-3 items-center gap-4">
          <Label for="height">Height</Label>
          <Input id="height" value="25px" class="col-span-2 h-8" />
        </div>
        <div class="grid grid-cols-3 items-center gap-4">
          <Label for="maxHeight">Max. height</Label>
          <Input id="maxHeight" value="none" class="col-span-2 h-8" />
        </div>
      </div>
    </div>
  </Popover.Content>
</Popover.Root>
```

### API Reference

See the Bits UI documentation for the complete API reference.

### progress
Progress bar component with reactive value binding, max prop, and class styling support.

## Progress Component

Displays a visual indicator showing task completion progress, typically as a progress bar.

### Installation

```bash
npx shadcn-svelte@latest add progress -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Basic Usage

```svelte
<script lang="ts">
  import { Progress } from "$lib/components/ui/progress/index.js";
</script>

<Progress value={33} />
```

### With Dynamic Value

```svelte
<script lang="ts">
  import { onMount } from "svelte";
  import { Progress } from "$lib/components/ui/progress/index.js";
  
  let value = $state(13);
  
  onMount(() => {
    const timer = setTimeout(() => (value = 66), 500);
    return () => clearTimeout(timer);
  });
</script>

<Progress {value} max={100} class="w-[60%]" />
```

### Props

- `value`: Current progress value (number)
- `max`: Maximum value (default: 100)
- `class`: CSS classes for styling

The component is built on Bits UI's progress component (see Bits UI docs for full API reference).

### radio-group
Mutually exclusive radio button component; install with `npx shadcn-svelte@latest add radio-group -y -o`; use `RadioGroup.Root` with `RadioGroup.Item` elements; bind to form data with `bind:value`; integrates with sveltekit-superforms for validation.

## Radio Group

A set of mutually exclusive radio buttons where only one button can be checked at a time.

### Installation

```bash
npx shadcn-svelte@latest add radio-group -y -o
```

The `-y` flag skips the confirmation prompt and `-o` overwrites existing files.

### Basic Usage

Import the RadioGroup components and Label:

```svelte
<script lang="ts">
  import { Label } from "$lib/components/ui/label/index.js";
  import * as RadioGroup from "$lib/components/ui/radio-group/index.js";
</script>

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

The `RadioGroup.Root` component wraps the radio buttons and manages the selected value. Each `RadioGroup.Item` represents a single radio button option with a corresponding label.

### Form Integration

RadioGroup integrates with sveltekit-superforms for form handling:

```svelte
<script lang="ts" module>
  import { z } from "zod/v4";
  const formSchema = z.object({
    type: z.enum(["all", "mentions", "none"])
  });
</script>

<script lang="ts">
  import { defaults, superForm } from "sveltekit-superforms";
  import { zod4 } from "sveltekit-superforms/adapters";
  import { toast } from "svelte-sonner";
  import * as Form from "$lib/components/ui/form/index.js";
  import * as RadioGroup from "$lib/components/ui/radio-group/index.js";

  const form = superForm(defaults(zod4(formSchema)), {
    validators: zod4(formSchema),
    SPA: true,
    onUpdate: ({ form: f }) => {
      if (f.valid) {
        toast.success(`You submitted ${JSON.stringify(f.data, null, 2)}`);
      } else {
        toast.error("Please fix the errors in the form.");
      }
    }
  });
  const { form: formData, enhance } = form;
</script>

<form method="POST" class="w-2/3 space-y-6" use:enhance>
  <Form.Fieldset {form} name="type" class="space-y-3">
    <Form.Legend>Notify me about...</Form.Legend>
    <RadioGroup.Root
      bind:value={$formData.type}
      class="flex flex-col space-y-1"
      name="type"
    >
      <div class="flex items-center space-x-3 space-y-0">
        <Form.Control>
          {#snippet children({ props })}
            <RadioGroup.Item value="all" {...props} />
            <Form.Label class="font-normal">All new messages</Form.Label>
          {/snippet}
        </Form.Control>
      </div>
      <div class="flex items-center space-x-3 space-y-0">
        <Form.Control>
          {#snippet children({ props })}
            <RadioGroup.Item value="mentions" {...props} />
            <Form.Label class="font-normal">Direction messages and mentions</Form.Label>
          {/snippet}
        </Form.Control>
      </div>
      <div class="flex items-center space-x-3 space-y-0">
        <Form.Control>
          {#snippet children({ props })}
            <RadioGroup.Item value="none" {...props} />
            <Form.Label class="font-normal">Nothing</Form.Label>
          {/snippet}
        </Form.Control>
      </div>
    </RadioGroup.Root>
    <Form.FieldErrors />
  </Form.Fieldset>
  <Form.Button>Submit</Form.Button>
</form>
```

Bind the RadioGroup value to form data using `bind:value={$formData.fieldName}`. Wrap items with `Form.Control` and `Form.Label` for proper form integration. Use `Form.FieldErrors` to display validation errors.

### range-calendar
Date range picker component built on Bits UI, uses @internationalized/date for date handling, bind value object with start/end properties.

## Range Calendar

A calendar component for selecting a date range.

### Basic Usage

```svelte
<script lang="ts">
  import { getLocalTimeZone, today } from "@internationalized/date";
  import { RangeCalendar } from "$lib/components/ui/range-calendar/index.js";
  const start = today(getLocalTimeZone());
  const end = start.add({ days: 7 });
  let value = $state({
    start,
    end
  });
</script>
<RangeCalendar bind:value class="rounded-md border" />
```

### Implementation Details

- Built on top of Bits Range Calendar component
- Uses `@internationalized/date` package for date handling
- Accepts `value` object with `start` and `end` date properties
- Supports standard HTML class binding for styling

### Installation

```bash
npx shadcn-svelte@latest add range-calendar -y -o
```

Use `-y` to skip confirmation prompt and `-o` to overwrite existing files.

### Related Resources

- Bits UI Range Calendar documentation and API reference available
- 30+ Calendar Blocks available showcasing the component in action

### resizable
Resizable panel groups with horizontal/vertical directions, defaultSize prop, withHandle indicator, and nested layout support.

## Resizable

Accessible resizable panel groups and layouts with keyboard support, built on PaneForge.

### Installation

```bash
npx shadcn-svelte@latest add resizable -y -o
```

The `-y` flag skips the confirmation prompt and `-o` overwrites existing files.

### Basic Usage

Import and use the Resizable components:

```svelte
<script lang="ts">
  import * as Resizable from "$lib/components/ui/resizable/index.js";
</script>

<Resizable.PaneGroup direction="horizontal">
  <Resizable.Pane>One</Resizable.Pane>
  <Resizable.Handle />
  <Resizable.Pane>Two</Resizable.Pane>
</Resizable.PaneGroup>
```

### Components

- **PaneGroup**: Container for resizable panes with `direction` prop ("horizontal" or "vertical")
- **Pane**: Individual resizable panel with optional `defaultSize` prop (percentage)
- **Handle**: Divider between panes, can show visual indicator with `withHandle` prop

### Vertical Layout

```svelte
<Resizable.PaneGroup direction="vertical" class="min-h-[200px] max-w-md rounded-lg border">
  <Resizable.Pane defaultSize={25}>
    <div class="flex h-full items-center justify-center p-6">
      <span class="font-semibold">Header</span>
    </div>
  </Resizable.Pane>
  <Resizable.Handle />
  <Resizable.Pane defaultSize={75}>
    <div class="flex h-full items-center justify-center p-6">
      <span class="font-semibold">Content</span>
    </div>
  </Resizable.Pane>
</Resizable.PaneGroup>
```

### Nested Layouts

Combine horizontal and vertical pane groups:

```svelte
<Resizable.PaneGroup direction="horizontal" class="max-w-md rounded-lg border">
  <Resizable.Pane defaultSize={50}>
    <div class="flex h-[200px] items-center justify-center p-6">
      <span class="font-semibold">One</span>
    </div>
  </Resizable.Pane>
  <Resizable.Handle />
  <Resizable.Pane defaultSize={50}>
    <Resizable.PaneGroup direction="vertical">
      <Resizable.Pane defaultSize={25}>
        <div class="flex h-full items-center justify-center p-6">
          <span class="font-semibold">Two</span>
        </div>
      </Resizable.Pane>
      <Resizable.Handle />
      <Resizable.Pane defaultSize={75}>
        <div class="flex h-full items-center justify-center p-6">
          <span class="font-semibold">Three</span>
        </div>
      </Resizable.Pane>
    </Resizable.PaneGroup>
  </Resizable.Pane>
</Resizable.PaneGroup>
```

### Handle Visibility

Use `withHandle` prop on Handle to display a visual indicator:

```svelte
<Resizable.PaneGroup direction="horizontal" class="min-h-[200px] max-w-md rounded-lg border">
  <Resizable.Pane defaultSize={25}>
    <div class="flex h-full items-center justify-center p-6">
      <span class="font-semibold">Sidebar</span>
    </div>
  </Resizable.Pane>
  <Resizable.Handle withHandle />
  <Resizable.Pane defaultSize={75}>
    <div class="flex h-full items-center justify-center p-6">
      <span class="font-semibold">Content</span>
    </div>
  </Resizable.Pane>
</Resizable.PaneGroup>
```

For all available props and features, see the PaneForge documentation.

### scroll-area
ScrollArea component for custom cross-browser scrollable containers with vertical, horizontal, or bidirectional scrolling via orientation prop.

## Scroll Area

Augments native scroll functionality for custom, cross-browser styling.

### Installation

```bash
npx shadcn-svelte@latest add scroll-area -y -o
```

The `-y` flag skips the confirmation prompt and `-o` overwrites existing files.

### Basic Usage

```svelte
<script lang="ts">
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
</script>

<ScrollArea class="h-[200px] w-[350px] rounded-md border p-4">
  Content that exceeds the container dimensions will be scrollable.
</ScrollArea>
```

### Horizontal Scrolling

Set `orientation="horizontal"` to enable horizontal scrolling:

```svelte
<script lang="ts">
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
</script>

<ScrollArea class="w-96 whitespace-nowrap rounded-md border" orientation="horizontal">
  <div class="flex w-max space-x-4 p-4">
    {#each items as item}
      <div class="shrink-0">
        {item}
      </div>
    {/each}
  </div>
</ScrollArea>
```

### Horizontal and Vertical Scrolling

Set `orientation="both"` to enable scrolling in both directions:

```svelte
<ScrollArea class="h-[200px] w-[350px] rounded-md border p-4" orientation="both">
  <div class="w-[400px]">
    Content wider than container with vertical overflow.
  </div>
</ScrollArea>
```

### Props

- `orientation`: Controls scroll direction - `"vertical"` (default), `"horizontal"`, or `"both"`
- `class`: Tailwind classes for styling (dimensions, borders, padding, etc.)

The component wraps native scroll functionality with custom styling capabilities that work consistently across browsers.

### select
Dropdown select component with single selection, dynamic options, grouping, and form integration via sveltekit-superforms.

## Select Component

Displays a dropdown list of options for users to pick from, triggered by a button.

### Installation

```bash
npx shadcn-svelte@latest add select -y -o
```

The `-y` flag skips the confirmation prompt and `-o` overwrites existing files.

### Basic Usage

```svelte
<script lang="ts">
  import * as Select from "$lib/components/ui/select/index.js";
</script>

<Select.Root type="single">
  <Select.Trigger class="w-[180px]">Select an option</Select.Trigger>
  <Select.Content>
    <Select.Item value="light">Light</Select.Item>
    <Select.Item value="dark">Dark</Select.Item>
    <Select.Item value="system">System</Select.Item>
  </Select.Content>
</Select.Root>
```

### Key Components

- `Select.Root`: Container with `type="single"` for single selection, accepts `name` and `bind:value` for form binding
- `Select.Trigger`: Button that opens the dropdown
- `Select.Content`: Container for dropdown items
- `Select.Group`: Groups related items
- `Select.Label`: Labels for item groups
- `Select.Item`: Individual selectable item with `value`, `label`, and optional `disabled` props

### Dynamic Options Example

```svelte
<script lang="ts">
  import * as Select from "$lib/components/ui/select/index.js";
  
  const fruits = [
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "blueberry", label: "Blueberry" },
    { value: "grapes", label: "Grapes" },
    { value: "pineapple", label: "Pineapple" }
  ];
  
  let value = $state("");
  const triggerContent = $derived(
    fruits.find((f) => f.value === value)?.label ?? "Select a fruit"
  );
</script>

<Select.Root type="single" name="favoriteFruit" bind:value>
  <Select.Trigger class="w-[180px]">
    {triggerContent}
  </Select.Trigger>
  <Select.Content>
    <Select.Group>
      <Select.Label>Fruits</Select.Label>
      {#each fruits as fruit (fruit.value)}
        <Select.Item
          value={fruit.value}
          label={fruit.label}
          disabled={fruit.value === "grapes"}
        >
          {fruit.label}
        </Select.Item>
      {/each}
    </Select.Group>
  </Select.Content>
</Select.Root>
```

### Form Integration

Integrate with sveltekit-superforms and Zod validation:

```svelte
<script lang="ts" module>
  import { z } from "zod/v4";
  const formSchema = z.object({
    email: z.email({ message: "Please select an email to display" })
  });
</script>

<script lang="ts">
  import { defaults, superForm } from "sveltekit-superforms";
  import { zod4 } from "sveltekit-superforms/adapters";
  import { toast } from "svelte-sonner";
  import * as Form from "$lib/components/ui/form/index.js";
  import * as Select from "$lib/components/ui/select/index.js";
  
  const form = superForm(defaults(zod4(formSchema)), {
    validators: zod4(formSchema),
    SPA: true,
    onUpdate: ({ form: f }) => {
      if (f.valid) {
        toast.success(`You submitted ${JSON.stringify(f.data, null, 2)}`);
      } else {
        toast.error("Please fix the errors in the form.");
      }
    }
  });
  
  const { form: formData, enhance } = form;
</script>

<form method="POST" class="w-2/3 space-y-6" use:enhance>
  <Form.Field {form} name="email">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Email</Form.Label>
        <Select.Root
          type="single"
          bind:value={$formData.email}
          name={props.name}
        >
          <Select.Trigger {...props}>
            {$formData.email ?? "Select a verified email to display"}
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="m@example.com" label="m@example.com" />
            <Select.Item value="m@google.com" label="m@google.com" />
            <Select.Item value="m@support.com" label="m@support.com" />
          </Select.Content>
        </Select.Root>
      {/snippet}
    </Form.Control>
    <Form.Description>
      You can manage email addresses in your email settings.
    </Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Button>Submit</Form.Button>
</form>
```

Reference the Bits UI documentation for full API reference and additional options.

### separator
Separator component for horizontal/vertical content division; supports orientation prop and custom styling via class.

## Separator

A component that visually or semantically separates content.

### Installation

```bash
npx shadcn-svelte@latest add separator -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Usage

Import and use the Separator component:

```svelte
<script lang="ts">
  import { Separator } from "$lib/components/ui/separator/index.js";
</script>

<Separator />
```

### Examples

**Horizontal separator with text content:**
```svelte
<div class="space-y-1">
  <h4 class="text-sm font-medium leading-none">Bits UI Primitives</h4>
  <p class="text-muted-foreground text-sm">An open-source UI component library.</p>
</div>
<Separator class="my-4" />
```

**Vertical separators between inline items:**
```svelte
<div class="flex h-5 items-center space-x-4 text-sm">
  <div>Blog</div>
  <Separator orientation="vertical" />
  <div>Docs</div>
  <Separator orientation="vertical" />
  <div>Source</div>
</div>
```

The component supports an `orientation` prop that accepts `"vertical"` for vertical separators (default is horizontal). Custom styling can be applied via the `class` prop.

### sheet
Sheet component extends Dialog to display complementary content sliding from screen edges (top/right/bottom/left); configure with side prop and size via CSS classes.

## Sheet Component

A dialog-based component that displays complementary content sliding in from screen edges.

### Installation

```bash
npx shadcn-svelte@latest add sheet -y -o
```

The `-y` flag skips the confirmation prompt and `-o` overwrites existing files.

### Basic Usage

```svelte
<script lang="ts">
  import * as Sheet from "$lib/components/ui/sheet/index.js";
</script>

<Sheet.Root>
  <Sheet.Trigger>Open</Sheet.Trigger>
  <Sheet.Content>
    <Sheet.Header>
      <Sheet.Title>Title</Sheet.Title>
      <Sheet.Description>Description text</Sheet.Description>
    </Sheet.Header>
  </Sheet.Content>
</Sheet.Root>
```

### Structure

- `Sheet.Root` - Container
- `Sheet.Trigger` - Button to open the sheet
- `Sheet.Content` - Main content area
- `Sheet.Header` - Header section
- `Sheet.Title` - Title text
- `Sheet.Description` - Description text
- `Sheet.Footer` - Footer section (optional)
- `Sheet.Close` - Close button

### Side Property

Control which edge the sheet slides from using the `side` prop on `Sheet.Content`:

```svelte
<Sheet.Content side="right">
  <!-- content -->
</Sheet.Content>
```

Valid values: `top`, `right`, `bottom`, `left`

### Sizing

Adjust sheet width using CSS classes on `Sheet.Content`:

```svelte
<Sheet.Content class="w-[400px] sm:w-[540px]">
  <!-- content -->
</Sheet.Content>
```

### Complete Example

```svelte
<script lang="ts">
  import * as Sheet from "$lib/components/ui/sheet/index.js";
  import { buttonVariants } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
</script>

<Sheet.Root>
  <Sheet.Trigger class={buttonVariants({ variant: "outline" })}>
    Open
  </Sheet.Trigger>
  <Sheet.Content side="right">
    <Sheet.Header>
      <Sheet.Title>Edit profile</Sheet.Title>
      <Sheet.Description>
        Make changes to your profile here. Click save when you're done.
      </Sheet.Description>
    </Sheet.Header>
    <div class="grid flex-1 auto-rows-min gap-6 px-4">
      <div class="grid gap-3">
        <Label for="name" class="text-right">Name</Label>
        <Input id="name" value="Pedro Duarte" />
      </div>
      <div class="grid gap-3">
        <Label for="username" class="text-right">Username</Label>
        <Input id="username" value="@peduarte" />
      </div>
    </div>
    <Sheet.Footer>
      <Sheet.Close class={buttonVariants({ variant: "outline" })}>
        Save changes
      </Sheet.Close>
    </Sheet.Footer>
  </Sheet.Content>
</Sheet.Root>
```

Extends the Dialog component from bits-ui. See bits-ui Dialog documentation for full API reference.

### sidebar
Composable sidebar component with collapse-to-icons, multiple variants (sidebar/floating/inset), collapsible modes (offcanvas/icon/none), menu system, header/footer, groups, badges, skeletons, separators, and theming via CSS variables.

## Sidebar Component

A composable, themeable, and customizable sidebar component that collapses to icons. Sidebars are complex with many moving parts; this component provides a solid foundation built from 30+ configurations.

### Installation

```bash
npx shadcn-svelte@latest add sidebar -y -o
```

Add CSS variables to `src/app.css`:
```css
:root {
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);
}
.dark {
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.439 0 0);
}
```

### Structure

- `Sidebar.Provider` - Handles collapsible state
- `Sidebar.Root` - Sidebar container
- `Sidebar.Header` / `Sidebar.Footer` - Sticky at top/bottom
- `Sidebar.Content` - Scrollable content
- `Sidebar.Group` - Section within content
- `Sidebar.Trigger` - Toggle button

### Basic Setup

`src/routes/+layout.svelte`:
```svelte
<script lang="ts">
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import AppSidebar from "$lib/components/app-sidebar.svelte";
  let { children } = $props();
</script>
<Sidebar.Provider>
  <AppSidebar />
  <main>
    <Sidebar.Trigger />
    {@render children?.()}
  </main>
</Sidebar.Provider>
```

`src/lib/components/app-sidebar.svelte`:
```svelte
<script lang="ts">
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
</script>
<Sidebar.Root>
  <Sidebar.Header />
  <Sidebar.Content>
    <Sidebar.Group />
  </Sidebar.Content>
  <Sidebar.Footer />
</Sidebar.Root>
```

### First Sidebar with Menu

```svelte
<script lang="ts">
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import HouseIcon from "@lucide/svelte/icons/house";
  import InboxIcon from "@lucide/svelte/icons/inbox";
  
  const items = [
    { title: "Home", url: "#", icon: HouseIcon },
    { title: "Inbox", url: "#", icon: InboxIcon },
  ];
</script>
<Sidebar.Root>
  <Sidebar.Content>
    <Sidebar.Group>
      <Sidebar.GroupLabel>Application</Sidebar.GroupLabel>
      <Sidebar.GroupContent>
        <Sidebar.Menu>
          {#each items as item (item.title)}
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
  </Sidebar.Content>
</Sidebar.Root>
```

### Sidebar.Provider

Provides sidebar context. Wrap your application in it.

**Props:**
- `open` (boolean, bindable) - Open state
- `onOpenChange` ((open: boolean) => void) - Callback fired after state changes

**Width Configuration:**

Use `SIDEBAR_WIDTH` and `SIDEBAR_WIDTH_MOBILE` constants in `src/lib/components/ui/sidebar/constants.ts` (default: `16rem` and `18rem`).

For multiple sidebars, use CSS variables:
```svelte
<Sidebar.Provider style="--sidebar-width: 20rem; --sidebar-width-mobile: 20rem;">
  <Sidebar.Root />
</Sidebar.Provider>
```

**Keyboard Shortcut:**

Change `SIDEBAR_KEYBOARD_SHORTCUT` in constants file (default: `"b"` for cmd+b on Mac, ctrl+b on Windows).

### Sidebar.Root

Main sidebar component.

**Props:**
- `side` - `"left"` or `"right"` (default: left)
- `variant` - `"sidebar"`, `"floating"`, or `"inset"`
- `collapsible` - `"offcanvas"`, `"icon"`, or `"none"`

For `inset` variant, wrap main content in `Sidebar.Inset`:
```svelte
<Sidebar.Provider>
  <Sidebar.Root variant="inset">
    <Sidebar.Inset>
      <main></main>
    </Sidebar.Inset>
  </Sidebar.Root>
</Sidebar.Provider>
```

### useSidebar Hook

Access sidebar context (cannot be destructured, must be called during component lifecycle):

```svelte
<script lang="ts">
  import { useSidebar } from "$lib/components/ui/sidebar/index.js";
  const sidebar = useSidebar();
  sidebar.state; // "expanded" or "collapsed"
  sidebar.open; // boolean
  sidebar.setOpen(boolean);
  sidebar.openMobile; // boolean on mobile
  sidebar.setOpenMobile(boolean);
  sidebar.isMobile; // boolean
  sidebar.toggle(); // toggle desktop and mobile
</script>
```

### Sidebar.Header / Sidebar.Footer

Sticky header and footer. Example with dropdown menu:

```svelte
<Sidebar.Header>
  <Sidebar.Menu>
    <Sidebar.MenuItem>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          {#snippet child({ props })}
            <Sidebar.MenuButton {...props}>
              Select Workspace
              <ChevronDown class="ml-auto" />
            </Sidebar.MenuButton>
          {/snippet}
        </DropdownMenu.Trigger>
        <DropdownMenu.Content class="w-(--bits-dropdown-menu-anchor-width)">
          <DropdownMenu.Item><span>Acme Inc</span></DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Sidebar.MenuItem>
  </Sidebar.Menu>
</Sidebar.Header>
```

### Sidebar.Content

Scrollable container for `Sidebar.Group` components.

### Sidebar.Group

Section within sidebar. Contains `GroupLabel`, `GroupContent`, and optional `GroupAction`:

```svelte
<Sidebar.Group>
  <Sidebar.GroupLabel>Application</Sidebar.GroupLabel>
  <Sidebar.GroupAction title="Add Project">
    <Plus /> <span class="sr-only">Add Project</span>
  </Sidebar.GroupAction>
  <Sidebar.GroupContent></Sidebar.GroupContent>
</Sidebar.Group>
```

**Collapsible Group:**

Wrap in `Collapsible.Root`:
```svelte
<Collapsible.Root open class="group/collapsible">
  <Sidebar.Group>
    <Sidebar.GroupLabel>
      {#snippet child({ props })}
        <Collapsible.Trigger {...props}>
          Help
          <ChevronDown class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
        </Collapsible.Trigger>
      {/snippet}
    </Sidebar.GroupLabel>
    <Collapsible.Content>
      <Sidebar.GroupContent />
    </Collapsible.Content>
  </Sidebar.Group>
</Collapsible.Root>
```

### Sidebar.Menu

Menu component composed of `MenuItem`, `MenuButton`, `MenuAction`, and `MenuSub`.

**MenuButton:**

Renders a button by default, use `child` snippet for custom elements:
```svelte
<Sidebar.MenuButton isActive>
  {#snippet child({ props })}
    <a href="/home" {...props}>
      <House />
      <span>Home</span>
    </a>
  {/snippet}
</Sidebar.MenuButton>
```

Props: `isActive` (boolean) - marks item as active

**MenuAction:**

Independent button within menu item, works with `DropdownMenu`:
```svelte
<Sidebar.MenuItem>
  <Sidebar.MenuButton>
    {#snippet child({ props })}
      <a href="/home" {...props}>
        <House />
        <span>Home</span>
      </a>
    {/snippet}
  </Sidebar.MenuButton>
  <DropdownMenu.Root>
    <DropdownMenu.Trigger>
      {#snippet child({ props })}
        <Sidebar.MenuAction {...props}>
          <Ellipsis />
        </Sidebar.MenuAction>
      {/snippet}
    </DropdownMenu.Trigger>
    <DropdownMenu.Content side="right" align="start">
      <DropdownMenu.Item><span>Edit</span></DropdownMenu.Item>
      <DropdownMenu.Item><span>Delete</span></DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
</Sidebar.MenuItem>
```

**MenuSub:**

Submenu using `MenuSubItem` and `MenuSubButton`:
```svelte
<Sidebar.MenuItem>
  <Sidebar.MenuButton />
  <Sidebar.MenuSub>
    <Sidebar.MenuSubItem>
      <Sidebar.MenuSubButton />
    </Sidebar.MenuSubItem>
  </Sidebar.MenuSub>
</Sidebar.MenuItem>
```

**Collapsible Menu:**

Wrap in `Collapsible.Root`:
```svelte
<Sidebar.Menu>
  <Collapsible.Root open class="group/collapsible">
    <Sidebar.MenuItem>
      <Collapsible.Trigger>
        {#snippet child({ props })}
          <Sidebar.MenuButton {...props} />
        {/snippet}
      </Collapsible.Trigger>
      <Collapsible.Content>
        <Sidebar.MenuSub>
          <Sidebar.MenuSubItem />
        </Sidebar.MenuSub>
      </Collapsible.Content>
    </Sidebar.MenuItem>
  </Collapsible.Root>
</Sidebar.Menu>
```

### Sidebar.MenuBadge

Badge within menu item:
```svelte
<Sidebar.MenuItem>
  <Sidebar.MenuButton />
  <Sidebar.MenuBadge>24</Sidebar.MenuBadge>
</Sidebar.MenuItem>
```

### Sidebar.MenuSkeleton

Loading skeleton for menu items:
```svelte
<Sidebar.Menu>
  {#each Array.from({ length: 5 }) as _, index (index)}
    <Sidebar.MenuItem>
      <Sidebar.MenuSkeleton />
    </Sidebar.MenuItem>
  {/each}
</Sidebar.Menu>
```

### Sidebar.Separator

Separator within sidebar:
```svelte
<Sidebar.Root>
  <Sidebar.Header />
  <Sidebar.Separator />
  <Sidebar.Content>
    <Sidebar.Group />
    <Sidebar.Separator />
    <Sidebar.Group />
  </Sidebar.Content>
</Sidebar.Root>
```

### Sidebar.Trigger

Toggle button (must be within `Sidebar.Provider`):
```svelte
<Sidebar.Provider>
  <Sidebar.Root />
  <main>
    <Sidebar.Trigger />
  </main>
</Sidebar.Provider>
```

**Custom Trigger:**

Use `useSidebar` hook:
```svelte
<script lang="ts">
  import { useSidebar } from "$lib/components/ui/sidebar/index.js";
  const sidebar = useSidebar();
</script>
<button onclick={() => sidebar.toggle()}>Toggle Sidebar</button>
```

### Sidebar.Rail

Rail component for toggling sidebar:
```svelte
<Sidebar.Root>
  <Sidebar.Header />
  <Sidebar.Content>
    <Sidebar.Group />
  </Sidebar.Content>
  <Sidebar.Footer />
  <Sidebar.Rail />
</Sidebar.Root>
```

### Controlled Sidebar

Use Svelte's function binding:
```svelte
<script lang="ts">
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  let myOpen = $state(true);
</script>
<Sidebar.Provider bind:open={() => myOpen, (newOpen) => (myOpen = newOpen)}>
  <Sidebar.Root />
</Sidebar.Provider>
```

Or simpler:
```svelte
<Sidebar.Provider bind:open>
  <Sidebar.Root />
</Sidebar.Provider>
```

### Theming

CSS variables (use different variables from main app for distinct styling):
```css
:root {
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);
}
.dark {
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.439 0 0);
}
```

### Styling Tips

Hide element in icon mode:
```svelte
<Sidebar.Root collapsible="icon">
  <Sidebar.Content>
    <Sidebar.Group class="group-data-[collapsible=icon]:hidden" />
  </Sidebar.Content>
</Sidebar.Root>
```

Show menu action when button is active:
```svelte
<Sidebar.MenuItem>
  <Sidebar.MenuButton />
  <Sidebar.MenuAction class="peer-data-[active=true]/menu-button:opacity-100" />
</Sidebar.MenuItem>
```

### skeleton
Placeholder component for loading states; import from $lib/components/ui/skeleton and style with Tailwind classes.

## Skeleton

A placeholder component for displaying loading states while content is being fetched.

### Installation

```bash
npx shadcn-svelte@latest add skeleton -y -o
```

The `-y` flag skips the confirmation prompt and `-o` overwrites existing files.

### Usage

Import the Skeleton component:

```svelte
<script lang="ts">
  import { Skeleton } from "$lib/components/ui/skeleton/index.js";
</script>
```

Apply to elements with custom dimensions and styling:

```svelte
<div class="flex items-center space-x-4">
  <Skeleton class="size-12 rounded-full" />
  <div class="space-y-2">
    <Skeleton class="h-4 w-[250px]" />
    <Skeleton class="h-4 w-[200px]" />
  </div>
</div>
```

Use Skeleton to create placeholder layouts matching your content structure. Style with Tailwind classes for sizing (`h-`, `w-`, `size-`) and shape (`rounded-full`, etc.).

### slider
Range input with single/multiple thumbs, vertical/horizontal orientation, configurable max and step values.

## Slider

An input component where users select a value from a given range.

### Installation

```bash
npx shadcn-svelte@latest add slider -y -o
```

The `-y` flag skips the confirmation prompt and `-o` overwrites existing files.

### Basic Usage

Single value slider:

```svelte
<script lang="ts">
  import { Slider } from "$lib/components/ui/slider/index.js";
  let value = $state(33);
</script>
<Slider type="single" bind:value max={100} step={1} />
```

### Multiple Thumbs

Range slider with two handles:

```svelte
<script lang="ts">
  import { Slider } from "$lib/components/ui/slider/index.js";
  let value = $state([25, 75]);
</script>
<Slider type="multiple" bind:value max={100} step={1} />
```

### Vertical Orientation

```svelte
<script lang="ts">
  import { Slider } from "$lib/components/ui/slider/index.js";
  let value = $state(50);
</script>
<Slider type="single" orientation="vertical" bind:value max={100} step={1} />
```

### Props

- `type`: "single" or "multiple" - determines if one or multiple thumbs are used
- `bind:value`: reactive binding to the selected value(s)
- `max`: maximum value of the range
- `step`: increment step size
- `orientation`: "vertical" for vertical layout (default is horizontal)
- `class`: CSS classes for styling

Reference: Bits UI Slider documentation and API reference available in external docs.

### sonner
Toast notifications with success/error types, descriptions, and action buttons; dark mode support via system preference or mode-watcher.

## Sonner

Toast notification component for Svelte, ported from the React Sonner library by Emil Kowalski.

### Installation

Install via CLI:
```bash
npx shadcn-svelte@latest add sonner -y -o
```

The `-y` flag skips the confirmation prompt and `-o` overwrites existing files.

### Setup

Add the Toaster component to your root layout file (+layout.svelte):
```svelte
<script lang="ts">
  import { Toaster } from "$lib/components/ui/sonner/index.js";
  let { children } = $props();
</script>
<Toaster />
{@render children?.()}
```

### Dark Mode

By default, Sonner uses the system's theme preference. To customize theme behavior, either:
- Pass a custom `theme` prop to the Toaster component
- Use mode-watcher to hardcode `dark` or `light` mode

If you don't want dark mode support, uninstall mode-watcher and remove the `theme` prop from the component.

### Usage

Import the `toast` function and call it with a message:
```svelte
<script lang="ts">
  import { toast } from "svelte-sonner";
  import { Button } from "$lib/components/ui/button/index.js";
</script>
<Button onclick={() => toast("Hello world")}>Show toast</Button>
```

Toast types include `toast.success()`, `toast.error()`, etc. Options include:
- `description`: Additional text below the message
- `action`: Object with `label` and `onClick` callback for action buttons

Example with success toast and action:
```svelte
<Button
  variant="outline"
  onclick={() =>
    toast.success("Event has been created", {
      description: "Sunday, December 03, 2023 at 9:00 AM",
      action: {
        label: "Undo",
        onClick: () => console.info("Undo")
      }
    })}
>
  Show Toast
</Button>
```

See the svelte-sonner documentation for complete API reference.

### spinner
Spinner component for loading states; customize size/color with utility classes; works in Button, Badge, InputGroup, Empty, and Item components.

## Spinner

A loading state indicator component.

### Installation

```bash
npx shadcn-svelte@latest add spinner -y -o
```

The `-y` flag skips the confirmation prompt and `-o` overwrites existing files.

### Basic Usage

```svelte
<script lang="ts">
  import { Spinner } from "$lib/components/ui/spinner/index.js";
</script>
<Spinner />
```

### Customization

Replace the default spinner icon by editing the component. The default uses a `LoaderIcon` with `animate-spin` class:

```svelte
<script lang="ts">
  import { cn } from "$lib/utils.js";
  import LoaderIcon from "@lucide/svelte/icons/loader";
  import type { ComponentProps } from "svelte";
  type Props = ComponentProps<typeof LoaderIcon>;
  let { class: className, ...restProps }: Props = $props();
</script>
<LoaderIcon
  role="status"
  aria-label="Loading"
  class={cn("size-4 animate-spin", className)}
  {...restProps}
/>
```

### Examples

**Size**: Use `size-*` utility classes to adjust spinner size:
```svelte
<Spinner class="size-3" />
<Spinner class="size-4" />
<Spinner class="size-6" />
<Spinner class="size-8" />
```

**Color**: Use `text-*` utility classes to change color:
```svelte
<Spinner class="size-6 text-red-500" />
<Spinner class="size-6 text-green-500" />
<Spinner class="size-6 text-blue-500" />
```

**Button**: Add spinner to buttons to indicate loading state. Button component handles spacing:
```svelte
<Button disabled size="sm">
  <Spinner />
  Loading...
</Button>
```

**Badge**: Use inside Badge component:
```svelte
<Badge>
  <Spinner />
  Syncing
</Badge>
```

**Input Group**: Place spinners in `<InputGroup.Addon>`:
```svelte
<InputGroup.Root>
  <InputGroup.Input placeholder="Send a message..." disabled />
  <InputGroup.Addon align="inline-end">
    <Spinner />
  </InputGroup.Addon>
</InputGroup.Root>
```

**Empty State**: Use in Empty component's Media slot:
```svelte
<Empty.Root>
  <Empty.Header>
    <Empty.Media variant="icon">
      <Spinner />
    </Empty.Media>
    <Empty.Title>Processing your request</Empty.Title>
  </Empty.Header>
</Empty.Root>
```

**Item**: Use in Item.Media to show loading state with progress:
```svelte
<Item.Root variant="outline">
  <Item.Media variant="icon">
    <Spinner />
  </Item.Media>
  <Item.Content>
    <Item.Title>Downloading...</Item.Title>
    <Item.Description>129 MB / 1000 MB</Item.Description>
  </Item.Content>
  <Item.Footer>
    <Progress value={75} />
  </Item.Footer>
</Item.Root>
```

### switch
Toggle control for checked/unchecked states; install with `npx shadcn-svelte@latest add switch -y -o`; bind to form data with `bind:checked`; supports disabled and aria-readonly.

## Switch Component

A toggle control for binary states (checked/unchecked).

### Installation

```bash
npx shadcn-svelte@latest add switch -y -o
```

Use `-y` to skip confirmation and `-o` to overwrite existing files.

### Basic Usage

```svelte
<script lang="ts">
  import { Switch } from "$lib/components/ui/switch/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
</script>

<div class="flex items-center space-x-2">
  <Switch id="airplane-mode" />
  <Label for="airplane-mode">Airplane Mode</Label>
</div>
```

### Form Integration

Use with sveltekit-superforms and Zod validation:

```svelte
<script lang="ts" module>
  import { z } from "zod/v4";
  const formSchema = z.object({
    marketing_emails: z.boolean().default(false),
    security_emails: z.boolean().default(true)
  });
</script>

<script lang="ts">
  import { defaults, superForm } from "sveltekit-superforms";
  import { zod4 } from "sveltekit-superforms/adapters";
  import { toast } from "svelte-sonner";
  import * as Form from "$lib/components/ui/form/index.js";
  import { Switch } from "$lib/components/ui/switch/index.js";

  const form = superForm(defaults(zod4(formSchema)), {
    validators: zod4(formSchema),
    SPA: true,
    onUpdate: ({ form: f }) => {
      if (f.valid) {
        toast.success(`You submitted ${JSON.stringify(f.data, null, 2)}`);
      } else {
        toast.error("Please fix the errors in the form.");
      }
    }
  });
  const { form: formData, enhance } = form;
</script>

<form method="POST" class="w-full space-y-6" use:enhance>
  <fieldset>
    <legend class="mb-4 text-lg font-medium">Email Notifications</legend>
    <div class="space-y-4">
      <Form.Field
        {form}
        name="marketing_emails"
        class="flex flex-row items-center justify-between rounded-lg border p-4"
      >
        <Form.Control>
          {#snippet children({ props })}
            <div class="space-y-0.5">
              <Form.Label>Marketing emails</Form.Label>
              <Form.Description>
                Receive emails about new products, features, and more.
              </Form.Description>
            </div>
            <Switch {...props} bind:checked={$formData.marketing_emails} />
          {/snippet}
        </Form.Control>
      </Form.Field>
      <Form.Field
        {form}
        name="security_emails"
        class="flex flex-row items-center justify-between rounded-lg border p-4"
      >
        <Form.Control>
          {#snippet children({ props })}
            <div class="space-y-0.5">
              <Form.Label>Security emails</Form.Label>
              <Form.Description>
                Receive emails about your account security.
              </Form.Description>
            </div>
            <Switch
              {...props}
              aria-readonly
              disabled
              bind:checked={$formData.security_emails}
            />
          {/snippet}
        </Form.Control>
      </Form.Field>
    </div>
  </fieldset>
  <Form.Button>Submit</Form.Button>
</form>
```

Switches support `disabled` and `aria-readonly` attributes for accessibility.

### table
Responsive table component with Root, Header, Body, Footer, Row, Head, and Cell subcomponents; supports colspan and custom styling via classes.

## Table Component

A responsive table component for displaying tabular data.

### Installation

```bash
npx shadcn-svelte@latest add table -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Usage

Import the table components:

```svelte
<script lang="ts">
  import * as Table from "$lib/components/ui/table/index.js";
</script>
```

Build tables using the following structure:

```svelte
<Table.Root>
  <Table.Caption>A list of your recent invoices.</Table.Caption>
  <Table.Header>
    <Table.Row>
      <Table.Head class="w-[100px]">Invoice</Table.Head>
      <Table.Head>Status</Table.Head>
      <Table.Head>Method</Table.Head>
      <Table.Head class="text-right">Amount</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {#each invoices as invoice (invoice)}
      <Table.Row>
        <Table.Cell class="font-medium">{invoice.invoice}</Table.Cell>
        <Table.Cell>{invoice.paymentStatus}</Table.Cell>
        <Table.Cell>{invoice.paymentMethod}</Table.Cell>
        <Table.Cell class="text-right">{invoice.totalAmount}</Table.Cell>
      </Table.Row>
    {/each}
  </Table.Body>
  <Table.Footer>
    <Table.Row>
      <Table.Cell colspan={3}>Total</Table.Cell>
      <Table.Cell class="text-right">$2,500.00</Table.Cell>
    </Table.Row>
  </Table.Footer>
</Table.Root>
```

### Components

- `Table.Root`: Container for the entire table
- `Table.Caption`: Optional caption/title for the table
- `Table.Header`: Header section containing column definitions
- `Table.Body`: Body section containing data rows
- `Table.Footer`: Optional footer section for totals or summary
- `Table.Row`: Individual row container
- `Table.Head`: Header cell
- `Table.Cell`: Data cell (supports `colspan` attribute and custom classes for alignment/styling)

### tabs
Tabbed interface component with Tabs.Root, Tabs.List, Tabs.Trigger, and Tabs.Content; install with `npx shadcn-svelte@latest add tabs -y -o`; set active tab via Root's value prop matching Trigger/Content values.

## Tabs Component

A tabbed interface component that displays multiple sections of content (tab panels) with only one visible at a time.

### Installation

```bash
npx shadcn-svelte@latest add tabs -y -o
```

The `-y` flag skips the confirmation prompt and `-o` overwrites existing files.

### Basic Usage

Import the Tabs component:

```svelte
<script lang="ts">
  import * as Tabs from "$lib/components/ui/tabs/index.js";
</script>

<Tabs.Root value="account" class="w-[400px]">
  <Tabs.List>
    <Tabs.Trigger value="account">Account</Tabs.Trigger>
    <Tabs.Trigger value="password">Password</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="account">
    Make changes to your account here.
  </Tabs.Content>
  <Tabs.Content value="password">Change your password here.</Tabs.Content>
</Tabs.Root>
```

### Component Structure

- **Tabs.Root**: Container component that accepts a `value` prop to set the active tab
- **Tabs.List**: Container for tab triggers
- **Tabs.Trigger**: Individual tab button with a `value` prop that must match a corresponding Tabs.Content
- **Tabs.Content**: Panel content that displays when its corresponding trigger is active

### Complete Example with Card Integration

```svelte
<script lang="ts">
  import * as Tabs from "$lib/components/ui/tabs/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
</script>

<div class="flex w-full max-w-sm flex-col gap-6">
  <Tabs.Root value="account">
    <Tabs.List>
      <Tabs.Trigger value="account">Account</Tabs.Trigger>
      <Tabs.Trigger value="password">Password</Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content value="account">
      <Card.Root>
        <Card.Header>
          <Card.Title>Account</Card.Title>
          <Card.Description>
            Make changes to your account here. Click save when you're done.
          </Card.Description>
        </Card.Header>
        <Card.Content class="grid gap-6">
          <div class="grid gap-3">
            <Label for="tabs-demo-name">Name</Label>
            <Input id="tabs-demo-name" value="Pedro Duarte" />
          </div>
          <div class="grid gap-3">
            <Label for="tabs-demo-username">Username</Label>
            <Input id="tabs-demo-username" value="@peduarte" />
          </div>
        </Card.Content>
        <Card.Footer>
          <Button>Save changes</Button>
        </Card.Footer>
      </Card.Root>
    </Tabs.Content>
    <Tabs.Content value="password">
      <Card.Root>
        <Card.Header>
          <Card.Title>Password</Card.Title>
          <Card.Description>
            Change your password here. After saving, you'll be logged out.
          </Card.Description>
        </Card.Header>
        <Card.Content class="grid gap-6">
          <div class="grid gap-3">
            <Label for="tabs-demo-current">Current password</Label>
            <Input id="tabs-demo-current" type="password" />
          </div>
          <div class="grid gap-3">
            <Label for="tabs-demo-new">New password</Label>
            <Input id="tabs-demo-new" type="password" />
          </div>
        </Card.Content>
        <Card.Footer>
          <Button>Save password</Button>
        </Card.Footer>
      </Card.Root>
    </Tabs.Content>
  </Tabs.Root>
</div>
```

### API Reference

Full API documentation available in the Bits UI Tabs documentation and API reference.

### textarea
Textarea form component supporting disabled state, labels, and sveltekit-superforms validation integration.

## Textarea Component

A form textarea component for shadcn-svelte.

### Installation

```bash
npx shadcn-svelte@latest add textarea -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Basic Usage

```svelte
<script lang="ts">
  import { Textarea } from "$lib/components/ui/textarea/index.js";
</script>

<Textarea placeholder="Type your message here." />
```

### Examples

**Disabled state:**
```svelte
<Textarea disabled placeholder="Type your message here." />
```

**With Label:**
```svelte
<script lang="ts">
  import { Label } from "$lib/components/ui/label/index.js";
  import { Textarea } from "$lib/components/ui/textarea/index.js";
</script>

<div class="grid w-full gap-1.5">
  <Label for="message">Your message</Label>
  <Textarea placeholder="Type your message here." id="message" />
</div>
```

**With descriptive text:**
```svelte
<div class="grid w-full gap-1.5">
  <Label for="message-2">Your Message</Label>
  <Textarea placeholder="Type your message here." id="message-2" />
  <p class="text-muted-foreground text-sm">
    Your message will be copied to the support team.
  </p>
</div>
```

**With Button:**
```svelte
<div class="grid w-full gap-2">
  <Textarea placeholder="Type your message here." />
  <Button>Send message</Button>
</div>
```

**Form integration with validation:**
```svelte
<script lang="ts" module>
  import { z } from "zod/v4";
  const formSchema = z.object({
    bio: z
      .string()
      .min(10, "Bio must be at least 10 characters.")
      .max(160, "Bio must be at most 160 characters.")
  });
</script>

<script lang="ts">
  import { defaults, superForm } from "sveltekit-superforms";
  import { zod4 } from "sveltekit-superforms/adapters";
  import { toast } from "svelte-sonner";
  import * as Form from "$lib/components/ui/form/index.js";
  import { Textarea } from "$lib/components/ui/textarea/index.js";
  
  const form = superForm(defaults(zod4(formSchema)), {
    validators: zod4(formSchema),
    SPA: true,
    onUpdate: ({ form: f }) => {
      if (f.valid) {
        toast.success(`You submitted ${JSON.stringify(f.data, null, 2)}`);
      } else {
        toast.error("Please fix the errors in the form.");
      }
    }
  });
  const { form: formData, enhance } = form;
</script>

<form method="POST" class="w-2/3 space-y-6" use:enhance>
  <Form.Field {form} name="bio">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Bio</Form.Label>
        <Textarea
          {...props}
          placeholder="Tell us a little bit about yourself"
          class="resize-none"
          bind:value={$formData.bio}
        />
        <Form.Description>
          You can <span>@mention</span> other users and organizations.
        </Form.Description>
      {/snippet}
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Button>Submit</Form.Button>
</form>
```

Supports standard HTML textarea attributes like `placeholder`, `disabled`, and `id`. Can be combined with Label component for accessibility and with Form component for validation.

### toggle-group
Toggle group component with single/multiple selection modes, outline variant, sm/lg sizes, and disabled state.

## Toggle Group

A set of two-state buttons that can be toggled on or off. Supports single or multiple selection modes.

### Installation

```bash
npx shadcn-svelte@latest add toggle-group -y -o
```

The `-y` flag skips the confirmation prompt and `-o` overwrites existing files.

### Basic Usage

```svelte
<script lang="ts">
  import * as ToggleGroup from "$lib/components/ui/toggle-group/index.js";
</script>

<ToggleGroup.Root type="single">
  <ToggleGroup.Item value="a">A</ToggleGroup.Item>
  <ToggleGroup.Item value="b">B</ToggleGroup.Item>
  <ToggleGroup.Item value="c">C</ToggleGroup.Item>
</ToggleGroup.Root>
```

### Key Props

- `type`: "single" (only one item can be selected) or "multiple" (multiple items can be selected)
- `variant`: "outline" for outlined style
- `size`: "sm" or "lg" for different sizes (default is medium)
- `disabled`: disables all items in the group

### Examples

**Multiple selection with outline variant:**
```svelte
<ToggleGroup.Root variant="outline" type="multiple">
  <ToggleGroup.Item value="bold" aria-label="Toggle bold">
    <BoldIcon class="size-4" />
  </ToggleGroup.Item>
  <ToggleGroup.Item value="italic" aria-label="Toggle italic">
    <ItalicIcon class="size-4" />
  </ToggleGroup.Item>
  <ToggleGroup.Item value="strikethrough" aria-label="Toggle strikethrough">
    <UnderlineIcon class="size-4" />
  </ToggleGroup.Item>
</ToggleGroup.Root>
```

**Single selection:**
```svelte
<ToggleGroup.Root type="single">
  <ToggleGroup.Item value="bold" aria-label="Toggle bold">
    <BoldIcon class="size-4" />
  </ToggleGroup.Item>
  <ToggleGroup.Item value="italic" aria-label="Toggle italic">
    <ItalicIcon class="size-4" />
  </ToggleGroup.Item>
  <ToggleGroup.Item value="strikethrough" aria-label="Toggle strikethrough">
    <UnderlineIcon class="size-4" />
  </ToggleGroup.Item>
</ToggleGroup.Root>
```

**Size variants:**
```svelte
<ToggleGroup.Root size="sm" type="multiple">
  <!-- items -->
</ToggleGroup.Root>

<ToggleGroup.Root size="lg" type="multiple">
  <!-- items -->
</ToggleGroup.Root>
```

**Disabled state:**
```svelte
<ToggleGroup.Root disabled type="single">
  <!-- items -->
</ToggleGroup.Root>
```

Each `ToggleGroup.Item` accepts a `value` prop and should include an `aria-label` for accessibility. Icons can be nested inside items.

### toggle
Two-state toggle button with variants (default/outline), sizes (sm/md/lg), icon/text support, and disabled state.

## Toggle

A two-state button component that toggles between on and off states.

### Installation

```bash
npx shadcn-svelte@latest add toggle -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Basic Usage

```svelte
<script lang="ts">
  import { Toggle } from "$lib/components/ui/toggle/index.js";
</script>

<Toggle>Toggle</Toggle>
```

### Examples

**Default with icon:**
```svelte
<script lang="ts">
  import BoldIcon from "@lucide/svelte/icons/bold";
  import { Toggle } from "$lib/components/ui/toggle/index.js";
</script>

<Toggle aria-label="toggle bold">
  <BoldIcon class="size-4" />
</Toggle>
```

**Outline variant:**
```svelte
<Toggle variant="outline" aria-label="Toggle italic">
  <ItalicIcon class="size-4" />
</Toggle>
```

**With text and icon:**
```svelte
<Toggle aria-label="Toggle italic">
  <ItalicIcon class="mr-2 size-4" />
  Italic
</Toggle>
```

**Size variants (small and large):**
```svelte
<Toggle size="sm" aria-label="Toggle italic">
  <ItalicIcon class="size-4" />
</Toggle>

<Toggle size="lg" aria-label="Toggle italic">
  <ItalicIcon class="size-4" />
</Toggle>
```

**Disabled state:**
```svelte
<Toggle aria-label="Toggle underline" disabled>
  <UnderlineIcon class="size-4" />
</Toggle>
```

### Props

- `variant`: "default" or "outline" - controls button styling
- `size`: "sm", "md" (default), or "lg" - controls button size
- `disabled`: boolean - disables the toggle button
- `aria-label`: string - accessibility label for the button

### tooltip
Tooltip component with Provider/Root/Trigger/Content structure; displays on hover or focus; install with `npx shadcn-svelte@latest add tooltip -y -o`

## Tooltip Component

A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.

### Installation

```bash
npx shadcn-svelte@latest add tooltip -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Usage

```svelte
<script lang="ts">
  import * as Tooltip from "$lib/components/ui/tooltip/index.js";
</script>

<Tooltip.Provider>
  <Tooltip.Root>
    <Tooltip.Trigger>Hover</Tooltip.Trigger>
    <Tooltip.Content>
      <p>Add to library</p>
    </Tooltip.Content>
  </Tooltip.Root>
</Tooltip.Provider>
```

The component structure consists of:
- `Tooltip.Provider`: Wraps the tooltip context
- `Tooltip.Root`: The root container for the tooltip
- `Tooltip.Trigger`: The element that triggers the tooltip on hover or focus
- `Tooltip.Content`: The popup content displayed when triggered

The trigger element can accept styling through class bindings, such as button variants.

### typography
Utility class examples for styling headings (h1-h4), paragraphs (standard, lead, large, small, muted), blockquotes, inline code, lists, and tables using Tailwind CSS.

## Overview
Typography documentation provides utility class examples for styling text elements. No typography styles are shipped by default; this page demonstrates how to use Tailwind utility classes to style headings, paragraphs, lists, blockquotes, tables, and other text elements.

## Heading Styles

**h1** - Large primary heading with scroll margin, 4xl text, extra bold weight, and tight tracking. Responsive: lg:text-5xl
```svelte
<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
  Taxing Laughter: The Joke Tax Chronicles
</h1>
```

**h2** - Medium heading with bottom border, 3xl text, semibold weight, tight tracking, and transition effects
```svelte
<h2 class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
  The People of the Kingdom
</h2>
```

**h3** - Smaller heading with 2xl text and semibold weight
```svelte
<h3 class="scroll-m-20 text-2xl font-semibold tracking-tight">The Joke Tax</h3>
```

**h4** - Extra small heading with xl text and semibold weight
```svelte
<h4 class="scroll-m-20 text-xl font-semibold tracking-tight">
  People stopped telling jokes
</h4>
```

## Paragraph Styles

**Standard paragraph** - 7 line height with top margin on non-first children
```svelte
<p class="leading-7 [&:not(:first-child)]:mt-6">
  The king, seeing how much happier his subjects were, realized the error of his ways and repealed the joke tax.
</p>
```

**Lead paragraph** - Muted foreground color, xl text size, used for introductory text
```svelte
<p class="text-muted-foreground text-xl">
  A modal dialog that interrupts the user with important content and expects a response.
</p>
```

**Large text** - lg font size with semibold weight
```svelte
<div class="text-lg font-semibold">Are you sure absolutely sure?</div>
```

**Small text** - sm font size with medium weight and no leading
```svelte
<small class="text-sm font-medium leading-none">Email address</small>
```

**Muted text** - Muted foreground color with sm font size
```svelte
<p class="text-muted-foreground text-sm">Enter your email address.</p>
```

## Other Elements

**Blockquote** - Left border (2px), left padding, and italic styling
```svelte
<blockquote class="mt-6 border-l-2 pl-6 italic">
  "After all," he said, "everyone enjoys a good joke, so it's only fair that they should pay for the privilege."
</blockquote>
```

**Inline code** - Muted background, rounded corners, horizontal padding, monospace font, sm size, semibold weight
```svelte
<code class="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
  @lucide/svelte
</code>
```

**Unordered list** - Disc bullets with top margin between items
```svelte
<ul class="my-6 ml-6 list-disc [&>li]:mt-2">
  <li>1st level of puns: 5 gold coins</li>
  <li>2nd level of jokes: 10 gold coins</li>
  <li>3rd level of one-liners: 20 gold coins</li>
</ul>
```

**Table** - Wrapped in overflow container, full width with bordered cells, bold headers, alternating row backgrounds
```svelte
<div class="my-6 w-full overflow-y-auto">
  <table class="w-full">
    <thead>
      <tr class="even:bg-muted m-0 border-t p-0">
        <th class="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
          King's Treasury
        </th>
        <th class="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
          People's happiness
        </th>
      </tr>
    </thead>
    <tbody>
      <tr class="even:bg-muted m-0 border-t p-0">
        <td class="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">Empty</td>
        <td class="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">Overflowing</td>
      </tr>
    </tbody>
  </table>
</div>
```

