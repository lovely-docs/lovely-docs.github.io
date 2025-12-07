

## Pages

### accordion
Accordion component with single/multiple expand modes, WAI-ARIA accessible, installed via `npx shadcn-svelte@latest add accordion -y -o`.

## Accordion

A vertically stacked set of interactive headings that each reveal a section of content.

### Installation

```bash
npx shadcn-svelte@latest add accordion -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Usage

```svelte
<script lang="ts">
  import * as Accordion from "$lib/components/ui/accordion/index.js";
</script>

<!-- Single type (only one item open at a time) -->
<Accordion.Root type="single" class="w-full sm:max-w-[70%]" value="item-1">
  <Accordion.Item value="item-1">
    <Accordion.Trigger>Is it accessible?</Accordion.Trigger>
    <Accordion.Content>
      Yes. It adheres to the WAI-ARIA design pattern.
    </Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-2">
    <Accordion.Trigger>Product Information</Accordion.Trigger>
    <Accordion.Content class="flex flex-col gap-4 text-balance">
      <p>Our flagship product combines cutting-edge technology with sleek design.</p>
      <p>Key features include advanced processing capabilities and an intuitive user interface.</p>
    </Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
```

**Key props:**
- `Accordion.Root`: `type="single"` (only one item open) or `type="multiple"` (multiple items can be open), `value` (initial open item), `class` (styling)
- `Accordion.Item`: `value` (unique identifier)
- `Accordion.Trigger`: clickable heading
- `Accordion.Content`: revealed content section

Adheres to WAI-ARIA design patterns for accessibility.

### alert-dialog
Modal dialog component with Root, Trigger, Content, Header, Title, Description, Footer, Cancel, and Action subcomponents.

## Alert Dialog

Modal dialog component that interrupts the user with important content and expects a response.

### Installation

```bash
npx shadcn-svelte@latest add alert-dialog -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Usage

```svelte
<script lang="ts">
  import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
  import { buttonVariants } from "$lib/components/ui/button/index.js";
</script>

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

See Bits UI documentation for full API reference.

### alert
Alert component for callouts with optional icon, title, description; supports default and destructive variants.

## Alert

Displays a callout for user attention.

### Installation

```bash
npx shadcn-svelte@latest add alert -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Usage

```svelte
<script lang="ts">
  import * as Alert from "$lib/components/ui/alert/index.js";
  import CheckCircle2Icon from "@lucide/svelte/icons/check-circle-2";
  import AlertCircleIcon from "@lucide/svelte/icons/alert-circle";
</script>

<!-- Basic alert with title and description -->
<Alert.Root>
  <Alert.Title>Heads up!</Alert.Title>
  <Alert.Description>
    You can add components to your app using the cli.
  </Alert.Description>
</Alert.Root>

<!-- Alert with icon -->
<Alert.Root>
  <CheckCircle2Icon />
  <Alert.Title>Success! Your changes have been saved</Alert.Title>
  <Alert.Description>This is an alert with icon, title and description.</Alert.Description>
</Alert.Root>

<!-- Alert with title and icon only (no description) -->
<Alert.Root>
  <CheckCircle2Icon />
  <Alert.Title>This Alert has a title and an icon. No description.</Alert.Title>
</Alert.Root>

<!-- Destructive variant -->
<Alert.Root variant="destructive">
  <AlertCircleIcon />
  <Alert.Title>Unable to process your payment.</Alert.Title>
  <Alert.Description>
    <p>Please verify your billing information and try again.</p>
    <ul class="list-inside list-disc text-sm">
      <li>Check your card details</li>
      <li>Ensure sufficient funds</li>
      <li>Verify billing address</li>
    </ul>
  </Alert.Description>
</Alert.Root>

<!-- Error variant example -->
<Alert.Root variant="destructive">
  <AlertCircleIcon class="size-4" />
  <Alert.Title>Error</Alert.Title>
  <Alert.Description>Your session has expired. Please login again.</Alert.Description>
</Alert.Root>
```

### Components

- `Alert.Root`: Container for the alert
- `Alert.Title`: Alert title
- `Alert.Description`: Alert description (optional)

### Variants

- Default: Standard alert styling
- `destructive`: Error/warning styling for destructive actions or errors

### aspect-ratio
AspectRatio component maintains content at specified ratio (e.g., 16/9); install with `npx shadcn-svelte@latest add aspect-ratio -y -o`

## Aspect Ratio

Displays content within a desired ratio.

### Installation

```bash
npx shadcn-svelte@latest add aspect-ratio -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Usage

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

The `AspectRatio` component wraps content and maintains a specified aspect ratio. Pass the desired ratio as a number (e.g., `16 / 9` for widescreen). Content inside scales to fill the container while preserving the ratio.

### avatar
Avatar component: image with fallback text, composed of Root/Image/Fallback subcomponents, styleable via class prop.

## Avatar

Image element with fallback for user representation.

### Installation

```bash
npx shadcn-svelte@latest add avatar -y -o
```

Use `-y` to skip confirmation prompt and `-o` to overwrite existing files.

### Usage

```svelte
<script lang="ts">
  import * as Avatar from "$lib/components/ui/avatar/index.js";
</script>

<!-- Basic avatar -->
<Avatar.Root>
  <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
  <Avatar.Fallback>CN</Avatar.Fallback>
</Avatar.Root>

<!-- Rounded variant -->
<Avatar.Root class="rounded-lg">
  <Avatar.Image src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
  <Avatar.Fallback>ER</Avatar.Fallback>
</Avatar.Root>

<!-- Multiple avatars with styling -->
<div class="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
  <Avatar.Root>
    <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
    <Avatar.Fallback>CN</Avatar.Fallback>
  </Avatar.Root>
  <Avatar.Root>
    <Avatar.Image src="https://github.com/leerob.png" alt="@leerob" />
    <Avatar.Fallback>LR</Avatar.Fallback>
  </Avatar.Root>
  <Avatar.Root>
    <Avatar.Image src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
    <Avatar.Fallback>ER</Avatar.Fallback>
  </Avatar.Root>
</div>
```

Structure: `Avatar.Root` wraps `Avatar.Image` (with src and alt) and `Avatar.Fallback` (text shown if image fails to load). Supports custom styling via class prop.

### badge
Badge component with variants (default, secondary, destructive, outline); supports icons, custom styling, and badgeVariants helper for link badges.

## Badge

Displays a badge or badge-like component.

### Installation

```bash
npx shadcn-svelte@latest add badge -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Usage

Basic badge with variants:

```svelte
<script lang="ts">
  import { Badge } from "$lib/components/ui/badge/index.js";
  import BadgeCheckIcon from "@lucide/svelte/icons/badge-check";
</script>

<Badge>Badge</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>

<!-- With icon -->
<Badge variant="secondary" class="bg-blue-500 text-white dark:bg-blue-600">
  <BadgeCheckIcon />
  Verified
</Badge>

<!-- Circular badges with numbers -->
<Badge class="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">8</Badge>
<Badge class="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums" variant="destructive">99</Badge>
<Badge class="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums" variant="outline">20+</Badge>
```

Available variants: `default`, `secondary`, `destructive`, `outline`.

### Link Badge

Use `badgeVariants` helper to style a link as a badge:

```svelte
<script lang="ts">
  import { badgeVariants } from "$lib/components/ui/badge/index.js";
</script>

<a href="/dashboard" class={badgeVariants({ variant: "outline" })}>Badge</a>
```

### breadcrumb
Navigation breadcrumb component with Root/List/Item/Link/Page/Separator/Ellipsis subcomponents; supports custom separators, dropdowns, collapsing, and responsive desktop/mobile variants.

## Breadcrumb

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

### Components

- `<Breadcrumb.Root>` - Root container
- `<Breadcrumb.List>` - List wrapper
- `<Breadcrumb.Item>` - Individual breadcrumb item
- `<Breadcrumb.Link href="...">` - Clickable link in breadcrumb
- `<Breadcrumb.Page>` - Current page (non-clickable)
- `<Breadcrumb.Separator>` - Separator between items (default: forward slash)
- `<Breadcrumb.Ellipsis>` - Collapsed state indicator

### Examples

**Custom separator** - Pass a custom component to `<Breadcrumb.Separator>` slot:
```svelte
<Breadcrumb.Separator>
  <SlashIcon />
</Breadcrumb.Separator>
```

**Dropdown** - Compose with `<DropdownMenu>` to create collapsible breadcrumb sections:
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

**Collapsed** - Use `<Breadcrumb.Ellipsis />` to show collapsed state for long breadcrumbs:
```svelte
<Breadcrumb.Item>
  <Breadcrumb.Ellipsis />
</Breadcrumb.Item>
```

**Custom link component** - Use `asChild` prop on `<Breadcrumb.Link>` to integrate with routing libraries.

**Responsive** - Compose with `<DropdownMenu>` for desktop and `<Drawer>` for mobile using `MediaQuery`:
```svelte
<script lang="ts">
  import { MediaQuery } from "svelte/reactivity";
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
ButtonGroup component for grouping related buttons with consistent styling, supporting vertical/horizontal orientation, separators, nesting, and composition with other UI components.

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

- Component has `role="group"` attribute
- Use `tabindex` to navigate between buttons
- Use `aria-label` or `aria-labelledby` to label the group:
  ```svelte
  <ButtonGroup.Root aria-label="Button group">
    <Button>Button 1</Button>
    <Button>Button 2</Button>
  </ButtonGroup.Root>
  ```

### ButtonGroup vs ToggleGroup

- **ButtonGroup**: Group buttons that perform an action
- **ToggleGroup**: Group buttons that toggle a state

### Examples

**Orientation** - Set `orientation="vertical"` for vertical layout:
```svelte
<ButtonGroup.Root orientation="vertical" aria-label="Media controls" class="h-fit">
  <Button variant="outline" size="icon"><Plus /></Button>
  <Button variant="outline" size="icon"><Minus /></Button>
</ButtonGroup.Root>
```

**Size** - Control button sizes with `size` prop on individual buttons (sm, default, lg, icon-sm, icon, icon-lg):
```svelte
<ButtonGroup.Root>
  <Button variant="outline" size="sm">Small</Button>
  <Button variant="outline">Default</Button>
  <Button variant="outline" size="lg">Large</Button>
</ButtonGroup.Root>
```

**Nested** - Nest ButtonGroup components for spacing:
```svelte
<ButtonGroup.Root>
  <ButtonGroup.Root>
    <Button variant="outline" size="sm">1</Button>
    <Button variant="outline" size="sm">2</Button>
  </ButtonGroup.Root>
  <ButtonGroup.Root>
    <Button variant="outline" size="icon-sm" aria-label="Previous"><ArrowLeft /></Button>
    <Button variant="outline" size="icon-sm" aria-label="Next"><ArrowRight /></Button>
  </ButtonGroup.Root>
</ButtonGroup.Root>
```

**Separator** - Use `ButtonGroup.Separator` to visually divide buttons. Recommended for non-outline variants:
```svelte
<ButtonGroup.Root>
  <Button variant="secondary" size="sm">Copy</Button>
  <ButtonGroup.Separator />
  <Button variant="secondary" size="sm">Paste</Button>
</ButtonGroup.Root>
```

**Split Button** - Separator with two buttons:
```svelte
<ButtonGroup.Root>
  <Button variant="secondary">Button</Button>
  <ButtonGroup.Separator />
  <Button variant="secondary" size="icon"><Plus /></Button>
</ButtonGroup.Root>
```

**With Input**:
```svelte
<ButtonGroup.Root>
  <Input placeholder="Search..." />
  <Button variant="outline" size="icon" aria-label="Search"><Search /></Button>
</ButtonGroup.Root>
```

**With InputGroup** - Complex input layouts with nested ButtonGroups and InputGroup components:
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

**With DropdownMenu** - Split button with dropdown:
```svelte
<ButtonGroup.Root>
  <Button variant="outline">Follow</Button>
  <DropdownMenu.Root>
    <DropdownMenu.Trigger>
      {#snippet child({ props })}
        <Button {...props} variant="outline" class="!pl-2"><ChevronDown /></Button>
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

**With Select**:
```svelte
<ButtonGroup.Root>
  <ButtonGroup.Root>
    <Select.Root type="single" bind:value={currency}>
      <Select.Trigger class="font-mono">{currency}</Select.Trigger>
      <Select.Content class="min-w-24">
        {#each CURRENCIES as currencyOption (currencyOption.value)}
          <Select.Item value={currencyOption.value}>{currencyOption.value}</Select.Item>
        {/each}
      </Select.Content>
    </Select.Root>
    <Input placeholder="10.00" pattern="[0-9]*" />
  </ButtonGroup.Root>
  <ButtonGroup.Root>
    <Button aria-label="Send" size="icon" variant="outline"><ArrowRight /></Button>
  </ButtonGroup.Root>
</ButtonGroup.Root>
```

**With Popover**:
```svelte
<ButtonGroup.Root>
  <Button variant="outline"><Bot />Copilot</Button>
  <Popover.Root>
    <Popover.Trigger>
      {#snippet child({ props })}
        <Button {...props} variant="outline" size="icon" aria-label="Open Popover"><ChevronDown /></Button>
      {/snippet}
    </Popover.Trigger>
    <Popover.Content align="end" class="rounded-xl p-0 text-sm">
      <div class="px-4 py-3"><div class="text-sm font-medium">Agent Tasks</div></div>
      <Separator />
      <div class="p-4 text-sm">
        <Textarea placeholder="Describe your task..." class="mb-4 resize-none" />
        <p class="font-medium">Start a new task with Copilot</p>
      </div>
    </Popover.Content>
  </Popover.Root>
</ButtonGroup.Root>
```

### button
Button component with variants (default, secondary, destructive, outline, ghost, link), icon support, size prop, and href for link conversion.

## Button Component

A reusable button component that can render as `<button>` or `<a>` element with multiple style variants.

### Installation

```bash
npx shadcn-svelte@latest add button -y -o
```

Flags: `-y` skips confirmation prompt, `-o` overwrites existing files.

### Basic Usage

```svelte
<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
</script>

<!-- Default button -->
<Button>Button</Button>

<!-- With variant -->
<Button variant="outline">Button</Button>

<!-- As link -->
<Button href="/dashboard">Dashboard</Button>
```

Alternatively, use `buttonVariants` helper to style links as buttons:
```svelte
<a href="/dashboard" class={buttonVariants({ variant: "outline" })}>
  Dashboard
</a>
```

### Variants

- `default` (primary): Default button style
- `secondary`: Secondary button style
- `destructive`: Red/danger button style
- `outline`: Outlined button style
- `ghost`: Minimal button style
- `link`: Link-styled button

### Examples

```svelte
<Button>Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

<!-- With icon -->
<Button variant="outline" size="sm">
  <GitBranchIcon />
  Login with Email
</Button>

<!-- Icon only -->
<Button variant="secondary" size="icon" class="size-8">
  <ChevronRightIcon />
</Button>

<!-- Loading state -->
<Button disabled>
  <Loader2Icon class="animate-spin" />
  Please wait
</Button>
```

Supports `size` prop (e.g., `sm`, `icon`) and standard HTML button attributes.

### calendar
Date selection component with single/range modes, dropdown month/year selectors, popover integration, natural language parsing, and 30+ block variants.

## Calendar Component

A date selection component built on Bits UI Calendar using @internationalized/date for date handling.

### Basic Usage
```svelte
import { getLocalTimeZone, today } from "@internationalized/date";
import { Calendar } from "$lib/components/ui/calendar/index.js";

let value = today(getLocalTimeZone());
```
```svelte
<Calendar
  type="single"
  bind:value
  class="rounded-md border shadow-sm"
  captionLayout="dropdown"
/>
```

### Installation
```bash
npx shadcn-svelte@latest add calendar -y -o
```
(-y: skip confirmation, -o: overwrite existing files)

### Examples

**Multiple Months Display**
```svelte
let value = new CalendarDate(2025, 6, 12);
<Calendar type="single" bind:value numberOfMonths={2} />
```

**Month/Year Selector with Dropdown Options**
```svelte
let dropdown = "dropdown"; // or "dropdown-months", "dropdown-years"
<Calendar type="single" bind:value captionLayout={dropdown} />
```
Pair with Select component to switch between "Month and Year", "Month Only", "Year Only" layouts.

**Date of Birth Picker (in Popover)**
```svelte
let open = false;
let value;
<Popover.Root bind:open>
  <Popover.Trigger>
    <Button variant="outline">
      {value ? value.toDate(getLocalTimeZone()).toLocaleDateString() : "Select date"}
    </Button>
  </Popover.Trigger>
  <Popover.Content class="w-auto p-0">
    <Calendar
      type="single"
      bind:value
      captionLayout="dropdown"
      onValueChange={() => { open = false; }}
      maxValue={today(getLocalTimeZone())}
    />
  </Popover.Content>
</Popover.Root>
```

**Date and Time Picker**
Combine Calendar in Popover with time Input:
```svelte
<Calendar type="single" bind:value captionLayout="dropdown" />
<Input type="time" step="1" value="10:30:00" />
```

**Natural Language Date Input**
Uses chrono-node to parse text like "In 2 days", "Tomorrow", "next week":
```svelte
import { parseDate } from "chrono-node";
import { CalendarDate } from "@internationalized/date";

let inputValue = "In 2 days";
let value = parseDate(inputValue) 
  ? new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate())
  : undefined;

<Input
  bind:value={inputValue}
  placeholder="Tomorrow or next week"
  onkeydown={(e) => { if (e.key === "ArrowDown") open = true; }}
/>
<Calendar type="single" bind:value onValueChange={(v) => { inputValue = formatDate(v); }} />
```

### Related Components
- Range Calendar: for date range selection
- Date Picker: wrapper component using Calendar
- 30+ calendar blocks available in Blocks Library

### Upgrade
```bash
npx shadcn-svelte@latest add calendar -y -o
```
Then add new blocks: `npx shadcn-svelte@latest add calendar-02 -y -o`

### card
Composable card component with Root, Header, Title, Description, Action, Content, Footer sub-components; supports Tailwind styling.

## Card Component

A composable card component with header, content, and footer sections for displaying structured information.

### Installation

```bash
npx shadcn-svelte@latest add card -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Components

- `Card.Root` - Main container
- `Card.Header` - Header section
- `Card.Title` - Title text
- `Card.Description` - Description text
- `Card.Action` - Action area (optional)
- `Card.Content` - Main content area
- `Card.Footer` - Footer section

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

Supports Tailwind classes for styling and layout customization.

### carousel
Embla-based carousel with sizing (basis classes), spacing (pl-/ml- utilities), vertical/horizontal orientation, configurable options, API access via setApi callback, and plugin support (Autoplay).

## Carousel

A carousel component built on Embla Carousel with motion and swipe support.

### Installation

```bash
npx shadcn-svelte@latest add carousel -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Basic Usage

```svelte
<script lang="ts">
  import * as Carousel from "$lib/components/ui/carousel/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
</script>

<Carousel.Root>
  <Carousel.Content>
    {#each Array(5) as _, i (i)}
      <Carousel.Item>
        <Card.Root>
          <Card.Content class="flex aspect-square items-center justify-center p-6">
            <span class="text-4xl font-semibold">{i + 1}</span>
          </Card.Content>
        </Card.Root>
      </Carousel.Item>
    {/each}
  </Carousel.Content>
  <Carousel.Previous />
  <Carousel.Next />
</Carousel.Root>
```

### Sizing Items

Use `basis` utility classes on `<Carousel.Item />`:

```svelte
<Carousel.Root class="w-full max-w-sm">
  <Carousel.Content>
    <Carousel.Item class="basis-1/3">...</Carousel.Item>
    <Carousel.Item class="md:basis-1/2 lg:basis-1/3">...</Carousel.Item>
  </Carousel.Content>
</Carousel.Root>
```

### Spacing Between Items

Use `pl-[VALUE]` on items and `-ml-[VALUE]` on content:

```svelte
<Carousel.Root>
  <Carousel.Content class="-ml-4 md:-ml-6">
    <Carousel.Item class="pl-4 md:pl-6">...</Carousel.Item>
  </Carousel.Content>
</Carousel.Root>
```

### Orientation

```svelte
<Carousel.Root orientation="vertical" class="w-full max-w-xs">
  <Carousel.Content class="-mt-1 h-[200px]">
    <Carousel.Item class="pt-1">...</Carousel.Item>
  </Carousel.Content>
</Carousel.Root>
```

Use `orientation="vertical | horizontal"`.

### Options

Pass options via the `opts` prop (see Embla Carousel docs for full list):

```svelte
<Carousel.Root opts={{ align: "start", loop: true }}>
  <Carousel.Content>
    <Carousel.Item>...</Carousel.Item>
  </Carousel.Content>
</Carousel.Root>
```

### API & Events

Get carousel instance via `setApi` callback:

```svelte
<script lang="ts">
  import type { CarouselAPI } from "$lib/components/ui/carousel/context.js";
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

Listen to events with `api.on("select", callback)`.

### Plugins

Add plugins via the `plugins` prop:

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

See Embla Carousel docs for available plugins.

### chart
Composable chart components built on LayerChart; define data, config (labels/colors), build with LayerChart components; supports CSS variable theming and customizable tooltips.

## Chart Component

Beautiful, composable charts built on LayerChart. Copy-paste components into your apps.

**Important:** LayerChart v2 is in pre-release with potential breaking changes. Track development at the LayerChart PR #449.

### Installation

```bash
npx shadcn-svelte@latest add chart -y -o
```

Flags: `-y` skips confirmation, `-o` overwrites existing files.

### Core Concept

Charts use composition with LayerChart components. You build charts using LayerChart's components and only import custom components like `ChartTooltip` when needed. LayerChart is not wrapped, so you're not locked into an abstraction and can follow official upgrade paths.

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

**1. Define data** (any shape; use `dataKey` prop to map):
```ts
const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  // ...
];
```

**2. Define chart config** (labels, icons, colors):
```ts
const chartConfig = {
  desktop: { label: "Desktop", color: "#2563eb" },
  mobile: { label: "Mobile", color: "#60a5fa" },
} satisfies Chart.ChartConfig;
```

**3. Build chart with LayerChart components**:
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
    props={{
      xAxis: { format: (d) => d.slice(0, 3) }
    }}
  >
    {#snippet tooltip()}
      <Chart.Tooltip />
    {/snippet}
  </BarChart>
</Chart.Container>
```

### Chart Config

Decoupled from chart data. Holds labels, icons, and colors. Supports theme objects with light/dark variants:

```ts
const chartConfig = {
  desktop: {
    label: "Desktop",
    icon: MonitorIcon,
    color: "#2563eb",
    // OR theme object:
    theme: { light: "#2563eb", dark: "#dc2626" }
  }
} satisfies Chart.ChartConfig;
```

### Theming

**CSS Variables (recommended)**:
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

Reference in config:
```ts
const chartConfig = {
  desktop: { label: "Desktop", color: "var(--chart-1)" },
  mobile: { label: "Mobile", color: "var(--chart-2)" }
} satisfies Chart.ChartConfig;
```

Use in components: `<Bar fill="var(--color-desktop)" />`

Use in data: `{ browser: "chrome", visitors: 275, color: "var(--color-chrome)" }`

Use in Tailwind: `<Label class="fill-(--color-desktop)" />`

Also supports hex, hsl, oklch directly in config.

### Tooltip Component

`<Chart.Tooltip>` customizes tooltips with label, name, indicator, and value.

**Props**:
- `labelKey` (string): Config/data key for label
- `nameKey` (string): Config/data key for name
- `indicator` (`dot` | `line` | `dashed`): Indicator style
- `hideLabel` (boolean): Hide label
- `hideIndicator` (boolean): Hide indicator
- `label` (string): Custom label
- `labelFormatter` (function): Format label
- `formatter` (Snippet): Custom tooltip rendering

**Example with custom keys**:
```svelte
<script lang="ts">
  const chartData = [
    { browser: "chrome", visitors: 187 },
    { browser: "safari", visitors: 200 }
  ];
  const chartConfig = {
    visitors: { label: "Total Visitors" },
    chrome: { label: "Chrome", color: "var(--chart-1)" },
    safari: { label: "Safari", color: "var(--chart-2)" }
  } satisfies ChartConfig;
</script>
<Chart.Tooltip labelKey="visitors" nameKey="browser" />
```

Colors are automatically referenced from chart config.

### checkbox
Toggle control with checked/disabled states, data-[state=checked] styling, onCheckedChange event, sveltekit-superforms integration.

## Checkbox

A control that allows the user to toggle between checked and not checked.

### Installation

```bash
npx shadcn-svelte@latest add checkbox -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Basic Usage

```svelte
<script lang="ts">
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
</script>

<Checkbox />

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

Customize appearance with class prop:

```svelte
<Checkbox
  id="toggle-2"
  checked
  class="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white"
/>
```

Use `has-[[aria-checked=true]]` selector on parent Label for conditional styling:

```svelte
<Label class="has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50">
  <Checkbox id="toggle-2" checked />
</Label>
```

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
    validators: zod4(formSchema),
    onUpdate: ({ form: f }) => {
      if (f.valid) {
        toast.success(`Submitted: ${JSON.stringify(f.data, null, 2)}`);
      }
    }
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
    <Form.Description>Select items to display</Form.Description>
    {#each items as item (item.id)}
      {@const checked = $formData.items.includes(item.id)}
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
          <Form.Label>{item.label}</Form.Label>
        {/snippet}
      </Form.Control>
    {/each}
    <Form.FieldErrors />
  </Form.Fieldset>
  <Form.Button>Update</Form.Button>
</form>
```

Checkbox emits `onCheckedChange` event when toggled. Use with form libraries for validation and submission handling.

### collapsible
Collapsible component with Root, Trigger, and Content subcomponents for expandable panels.

## Collapsible

Interactive component that expands/collapses a panel.

### Installation

```bash
npx shadcn-svelte@latest add collapsible -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Usage

Import the component:
```svelte
<script lang="ts">
  import * as Collapsible from "$lib/components/ui/collapsible/index.js";
</script>
```

Basic example:
```svelte
<Collapsible.Root>
  <Collapsible.Trigger>Can I use this in my project?</Collapsible.Trigger>
  <Collapsible.Content>
    Yes. Free to use for personal and commercial projects. No attribution required.
  </Collapsible.Content>
</Collapsible.Root>
```

Advanced example with icon and styling:
```svelte
<script lang="ts">
  import ChevronsUpDownIcon from "@lucide/svelte/icons/chevrons-up-down";
  import { buttonVariants } from "$lib/components/ui/button/index.js";
</script>

<Collapsible.Root class="w-[350px] space-y-2">
  <div class="flex items-center justify-between space-x-4 px-4">
    <h4 class="text-sm font-semibold">@huntabyte starred 3 repositories</h4>
    <Collapsible.Trigger class={buttonVariants({ variant: "ghost", size: "sm", class: "w-9 p-0" })}>
      <ChevronsUpDownIcon />
      <span class="sr-only">Toggle</span>
    </Collapsible.Trigger>
  </div>
  <div class="rounded-md border px-4 py-3 font-mono text-sm">@huntabyte/bits-ui</div>
  <Collapsible.Content class="space-y-2">
    <div class="rounded-md border px-4 py-3 font-mono text-sm">@melt-ui/melt-ui</div>
    <div class="rounded-md border px-4 py-3 font-mono text-sm">@sveltejs/svelte</div>
  </Collapsible.Content>
</Collapsible.Root>
```

### Components

- `Collapsible.Root`: Container for the collapsible component
- `Collapsible.Trigger`: Button that toggles the collapsed state
- `Collapsible.Content`: Content that expands/collapses

See the Bits UI documentation for full API reference.

### combobox
Searchable dropdown/autocomplete built from Popover + Command; use $state/$derived for open/value, closeAndFocusTrigger() after selection, Form.Control for form integration.

## Combobox

Autocomplete input and command palette with a list of suggestions. Built by composing Popover and Command components.

### Installation

Install Popover and Command components:
```
npx shadcn-svelte@latest add popover -y -o
npx shadcn-svelte@latest add command -y -o
```

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
    tick().then(() => triggerRef.focus());
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

### Examples

**Status Selector with Icons:**
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
  const triggerId = useId();

  function closeAndFocusTrigger(triggerId: string) {
    open = false;
    tick().then(() => document.getElementById(triggerId)?.focus());
  }
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

**Dropdown Menu with Submenu:**
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
    "feature", "bug", "enhancement", "documentation", "design", "question", "maintenance"
  ];

  let open = $state(false);
  let selectedLabel = $state("feature");
  let triggerRef = $state<HTMLButtonElement>(null!);

  function closeAndFocusTrigger() {
    open = false;
    tick().then(() => triggerRef.focus());
  }
</script>

<div class="flex w-full flex-col items-start justify-between rounded-md border px-4 py-3 sm:flex-row sm:items-center">
  <p class="text-sm font-medium leading-none">
    <span class="bg-primary text-primary-foreground mr-2 rounded-lg px-2 py-1 text-xs">
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

**Form Integration:**
Use Form.Control to apply aria attributes and hidden input for form submission. Requires formsnap v0.5.0+.

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
  const triggerId = useId();

  function closeAndFocusTrigger(triggerId: string) {
    open = false;
    tick().then(() => document.getElementById(triggerId)?.focus());
  }
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

**Key patterns:**
- Use `$state` for open/value, `$derived` for computed selections
- Call `closeAndFocusTrigger()` after selection to refocus trigger button for keyboard navigation
- Use `Command.Root`, `Command.Input`, `Command.List`, `Command.Group`, `Command.Item` for searchable lists
- Wrap in `Popover.Root` with `Popover.Trigger` and `Popover.Content`
- For forms, use `Form.Control` with hidden input to ensure proper submission


### command
Unstyled command menu component with Root/Input/List/Group/Item/Separator/Shortcut/Dialog variants; supports keyboard shortcuts, disabled items, and automatic icon styling.

## Command

Fast, composable, unstyled command menu component for Svelte.

### Installation

```bash
npx shadcn-svelte@latest add command -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Basic Usage

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
      <Command.Item disabled>Calculator</Command.Item>
    </Command.Group>
    <Command.Separator />
    <Command.Group heading="Settings">
      <Command.Item>
        <span>Profile</span>
        <Command.Shortcut>P</Command.Shortcut>
      </Command.Item>
      <Command.Item>
        <span>Billing</span>
        <Command.Shortcut>B</Command.Shortcut>
      </Command.Item>
      <Command.Item>
        <span>Settings</span>
        <Command.Shortcut>S</Command.Shortcut>
      </Command.Item>
    </Command.Group>
  </Command.List>
</Command.Root>
```

### Components

- `<Command.Root>` - Container for the command menu
- `<Command.Input>` - Search/input field
- `<Command.List>` - Container for command items
- `<Command.Empty>` - Message shown when no results match
- `<Command.Group>` - Groups items with an optional heading
- `<Command.Item>` - Individual command item (supports `disabled` prop)
- `<Command.Separator>` - Visual separator between groups
- `<Command.Shortcut>` - Displays keyboard shortcut hint
- `<Command.Dialog>` - Dialog variant that wraps Command.Root with Dialog.Root

### Dialog Example

Use `<Command.Dialog>` to display the command menu in a modal dialog. It accepts props for both Dialog and Command components.

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
    <Command.Group heading="Settings">
      <Command.Item>Profile</Command.Item>
      <Command.Item>Billing</Command.Item>
      <Command.Item>Settings</Command.Item>
    </Command.Group>
  </Command.List>
</Command.Dialog>
```

### Styling

- Icons inside `<Command.Item>` are automatically styled with `gap-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0` classes
- Component is unstyled by default; apply custom classes to `<Command.Root>` (e.g., `rounded-lg border shadow-md`)
- Use Lucide Svelte icons for consistent iconography

### context-menu
Right-click context menu with items, checkboxes, radio groups, separators, nested submenus, and keyboard shortcuts.

## Context Menu

A component that displays a menu triggered by right-click, containing actions, functions, and interactive elements.

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

### Features

**Structure:**
- `ContextMenu.Root` - wrapper component
- `ContextMenu.Trigger` - element that triggers the menu on right-click
- `ContextMenu.Content` - container for menu items

**Item Types:**
- `ContextMenu.Item` - basic menu item with optional `inset` and `disabled` props
- `ContextMenu.Shortcut` - displays keyboard shortcut text within items
- `ContextMenu.Separator` - divider between item groups
- `ContextMenu.CheckboxItem` - toggleable item with `bind:checked` for state binding
- `ContextMenu.RadioItem` - radio button item within `ContextMenu.RadioGroup`
- `ContextMenu.Group` - groups related items
- `ContextMenu.GroupHeading` - label for item groups

**Nested Menus:**
- `ContextMenu.Sub` - container for submenu
- `ContextMenu.SubTrigger` - opens submenu on hover/click
- `ContextMenu.SubContent` - submenu content container

### Complete Example

```svelte
<script lang="ts">
  import * as ContextMenu from "$lib/components/ui/context-menu/index.js";
  let showBookmarks = $state(false);
  let showFullURLs = $state(true);
  let value = $state("pedro");
</script>

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
    <ContextMenu.Item inset>
      Reload
      <ContextMenu.Shortcut>R</ContextMenu.Shortcut>
    </ContextMenu.Item>
    <ContextMenu.Sub>
      <ContextMenu.SubTrigger inset>More Tools</ContextMenu.SubTrigger>
      <ContextMenu.SubContent class="w-48">
        <ContextMenu.Item>Save Page As... <ContextMenu.Shortcut>S</ContextMenu.Shortcut></ContextMenu.Item>
        <ContextMenu.Item>Create Shortcut...</ContextMenu.Item>
        <ContextMenu.Item>Name Window...</ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Item>Developer Tools</ContextMenu.Item>
      </ContextMenu.SubContent>
    </ContextMenu.Sub>
    <ContextMenu.Separator />
    <ContextMenu.CheckboxItem bind:checked={showBookmarks}>
      Show Bookmarks
    </ContextMenu.CheckboxItem>
    <ContextMenu.CheckboxItem bind:checked={showFullURLs}>
      Show Full URLs
    </ContextMenu.CheckboxItem>
    <ContextMenu.Separator />
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

### data-table
TanStack Table v8 integration for building customizable data tables with pagination, sorting, filtering, column visibility, row selection, and cell formatting using Svelte 5 snippets and components.

## Data Table

Build powerful tables and datagrids using TanStack Table v8 with Svelte 5 snippets and components.

### Installation

```bash
npm i @tanstack/table-core
npx shadcn-svelte@latest add table data-table -y -o
```

The `-y` flag skips confirmation prompts and `-o` overwrites existing files.

### Basic Setup

Define your data type and column definitions:

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
  { accessorKey: "status", header: "Status" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "amount", header: "Amount" },
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
    get data() { return data; },
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
                <FlexRender content={header.column.columnDef.header} context={header.getContext()} />
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
              <FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
            </Table.Cell>
          {/each}
        </Table.Row>
      {:else}
        <Table.Row>
          <Table.Cell colspan={columns.length} class="h-24 text-center">No results.</Table.Cell>
        </Table.Row>
      {/each}
    </Table.Body>
  </Table.Root>
</div>
```

### Cell Formatting

Use `createRawSnippet` and `renderSnippet` for custom cell rendering:

```ts
import { createRawSnippet } from "svelte";
import { renderSnippet } from "$lib/components/ui/data-table/index.js";

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "amount",
    header: () => {
      const snippet = createRawSnippet(() => ({
        render: () => `<div class="text-right">Amount</div>`,
      }));
      return renderSnippet(snippet);
    },
    cell: ({ row }) => {
      const formatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
      const snippet = createRawSnippet<[{ amount: number }]>((getAmount) => {
        const { amount } = getAmount();
        return { render: () => `<div class="text-right font-medium">${formatter.format(amount)}</div>` };
      });
      return renderSnippet(snippet, { amount: row.original.amount });
    },
  },
];
```

### Row Actions

Create an actions dropdown component:

```svelte
// data-table-actions.svelte
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
      <DropdownMenu.Item onclick={() => navigator.clipboard.writeText(id)}>Copy payment ID</DropdownMenu.Item>
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
    cell: ({ row }) => renderComponent(DataTableActions, { id: row.original.id }),
  },
];
```

### Pagination

```ts
import { type PaginationState, getPaginationRowModel } from "@tanstack/table-core";

let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });

const table = createSvelteTable({
  // ... other config
  state: { get pagination() { return pagination; } },
  onPaginationChange: (updater) => {
    pagination = typeof updater === "function" ? updater(pagination) : updater;
  },
  getPaginationRowModel: getPaginationRowModel(),
});
```

Add pagination controls:

```svelte
<div class="flex items-center justify-end space-x-2 py-4">
  <Button variant="outline" size="sm" onclick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
    Previous
  </Button>
  <Button variant="outline" size="sm" onclick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
    Next
  </Button>
</div>
```

### Sorting

Create a sortable header button component:

```svelte
// data-table-email-button.svelte
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

Enable sorting in DataTable:

```ts
import { type SortingState, getSortedRowModel } from "@tanstack/table-core";

let sorting = $state<SortingState>([]);

const table = createSvelteTable({
  // ... other config
  state: { get sorting() { return sorting; } },
  onSortingChange: (updater) => {
    sorting = typeof updater === "function" ? updater(sorting) : updater;
  },
  getSortedRowModel: getSortedRowModel(),
});
```

Update column definition:

```ts
import { renderComponent } from "$lib/components/ui/data-table/index.js";
import DataTableEmailButton from "./data-table-email-button.svelte";

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "email",
    header: ({ column }) => renderComponent(DataTableEmailButton, { onclick: column.getToggleSortingHandler() }),
  },
];
```

### Filtering

```ts
import { type ColumnFiltersState, getFilteredRowModel } from "@tanstack/table-core";
import { Input } from "$lib/components/ui/input/index.js";

let columnFilters = $state<ColumnFiltersState>([]);

const table = createSvelteTable({
  // ... other config
  state: { get columnFilters() { return columnFilters; } },
  onColumnFiltersChange: (updater) => {
    columnFilters = typeof updater === "function" ? updater(columnFilters) : updater;
  },
  getFilteredRowModel: getFilteredRowModel(),
});
```

Add filter input:

```svelte
<Input
  placeholder="Filter emails..."
  value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
  oninput={(e) => table.getColumn("email")?.setFilterValue(e.currentTarget.value)}
  class="max-w-sm"
/>
```

### Column Visibility

```ts
import { type VisibilityState } from "@tanstack/table-core";
import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";

let columnVisibility = $state<VisibilityState>({});

const table = createSvelteTable({
  // ... other config
  state: { get columnVisibility() { return columnVisibility; } },
  onColumnVisibilityChange: (updater) => {
    columnVisibility = typeof updater === "function" ? updater(columnVisibility) : updater;
  },
});
```

Add visibility toggle dropdown:

```svelte
<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      <Button {...props} variant="outline" class="ml-auto">Columns</Button>
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

Create checkbox component:

```svelte
// data-table-checkbox.svelte
<script lang="ts">
  import type { ComponentProps } from "svelte";
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";

  let { checked = false, onCheckedChange = (v) => (checked = v), ...restProps }: ComponentProps<typeof Checkbox> = $props();
</script>

<Checkbox bind:checked={() => checked, onCheckedChange} {...restProps} />
```

Enable row selection in DataTable:

```ts
import { type RowSelectionState } from "@tanstack/table-core";

let rowSelection = $state<RowSelectionState>({});

const table = createSvelteTable({
  // ... other config
  state: { get rowSelection() { return rowSelection; } },
  onRowSelectionChange: (updater) => {
    rowSelection = typeof updater === "function" ? updater(rowSelection) : updater;
  },
});
```

Add select column:

```ts
import { renderComponent } from "$lib/components/ui/data-table/index.js";
import DataTableCheckbox from "./data-table-checkbox.svelte";

export const columns: ColumnDef<Payment>[] = [
  {
    id: "select",
    header: ({ table }) =>
      renderComponent(DataTableCheckbox, {
        checked: table.getIsAllPageRowsSelected(),
        indeterminate: table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected(),
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
  {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
</div>
```

### Project Structure

```
routes/payments/
  columns.ts                    # Column definitions
  data-table.svelte             # Main DataTable component
  data-table-actions.svelte     # Row actions dropdown
  data-table-checkbox.svelte    # Row selection checkbox
  data-table-email-button.svelte # Sortable email header
  +page.svelte                  # Page component
```

Extract DataTable into a reusable component at `components/ui/data-table.svelte` if used in multiple places. See Tasks example for advanced patterns.

### date-picker
Date picker component using Popover + Calendar/RangeCalendar; supports single dates, ranges, presets, and form integration with date constraints.

## Date Picker

A date picker component combining Popover and Calendar (or RangeCalendar) components for selecting single dates, date ranges, or dates with presets.

### Installation

Install via the CLI (skip confirmation and overwrite existing files):
```
npx shadcn-svelte@latest add date-picker -y -o
```

Requires Popover, Calendar, and RangeCalendar components.

### Basic Usage

```svelte
<script lang="ts">
  import CalendarIcon from "@lucide/svelte/icons/calendar";
  import { DateFormatter, type DateValue, getLocalTimeZone } from "@internationalized/date";
  import { cn } from "$lib/utils.js";
  import { buttonVariants } from "$lib/components/ui/button/index.js";
  import { Calendar } from "$lib/components/ui/calendar/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  
  const df = new DateFormatter("en-US", { dateStyle: "long" });
  let value = $state<DateValue | undefined>();
</script>

<Popover.Root>
  <Popover.Trigger class={cn(buttonVariants({ variant: "outline", class: "w-[280px] justify-start text-left font-normal" }), !value && "text-muted-foreground")}>
    <CalendarIcon />
    {value ? df.format(value.toDate(getLocalTimeZone())) : "Pick a date"}
  </Popover.Trigger>
  <Popover.Content class="w-auto p-0">
    <Calendar type="single" bind:value />
  </Popover.Content>
</Popover.Root>
```

### Date Range Picker

```svelte
<script lang="ts">
  import { CalendarDate, DateFormatter, type DateValue, getLocalTimeZone } from "@internationalized/date";
  import type { DateRange } from "bits-ui";
  import { RangeCalendar } from "$lib/components/ui/range-calendar/index.js";
  
  const df = new DateFormatter("en-US", { dateStyle: "medium" });
  let value: DateRange = $state({
    start: new CalendarDate(2022, 1, 20),
    end: new CalendarDate(2022, 1, 20).add({ days: 20 })
  });
  let startValue: DateValue | undefined = $state(undefined);
</script>

<Popover.Root>
  <Popover.Trigger class={cn(buttonVariants({ variant: "outline" }), !value && "text-muted-foreground")}>
    <CalendarIcon class="mr-2 size-4" />
    {#if value?.start}
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
```

### With Presets

```svelte
<script lang="ts">
  import { DateFormatter, type DateValue, getLocalTimeZone, today } from "@internationalized/date";
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
    <Select.Root type="single" bind:value={() => valueString, (v) => { if (v) value = today(getLocalTimeZone()).add({ days: Number.parseInt(v) }); }}>
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
  import { CalendarDate, DateFormatter, type DateValue, getLocalTimeZone, parseDate, today } from "@internationalized/date";
  import { defaults, superForm } from "sveltekit-superforms";
  import { zod4 } from "sveltekit-superforms/adapters";
  import { toast } from "svelte-sonner";
  import { Button } from "$lib/components/ui/button/index.js";
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
            <Calendar type="single" value={value as DateValue} bind:placeholder minValue={new CalendarDate(1900, 1, 1)} maxValue={today(getLocalTimeZone())} calendarLabel="Date of birth" onValueChange={(v) => { $formData.dob = v ? v.toString() : ""; }} />
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
Modal dialog overlay component with composable subcomponents (Root, Trigger, Content, Header, Title, Description, Footer); install via CLI with -y -o flags.

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
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
</script>

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

**Components:**
- `Dialog.Root`: Container for the dialog
- `Dialog.Trigger`: Button or element that opens the dialog
- `Dialog.Content`: Modal content wrapper with optional `class` for sizing (e.g., `sm:max-w-[425px]`)
- `Dialog.Header`: Header section
- `Dialog.Title`: Dialog title
- `Dialog.Description`: Dialog description text
- `Dialog.Footer`: Footer section for actions

Minimal example:

```svelte
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

Full API reference available in the Bits UI documentation.

### drawer
Slide-out panel component (Vaul Svelte-based) with Root/Trigger/Content/Header/Title/Description/Footer/Close subcomponents; supports responsive Dialog/Drawer switching via MediaQuery.

## Drawer

A slide-out panel component built on Vaul Svelte (Svelte port of Vaul by Emil Kowalski).

### Installation

```bash
npx shadcn-svelte@latest add drawer -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

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
      <Drawer.Description>Description text</Drawer.Description>
    </Drawer.Header>
    <Drawer.Footer>
      <Button>Submit</Button>
      <Drawer.Close>Cancel</Drawer.Close>
    </Drawer.Footer>
  </Drawer.Content>
</Drawer.Root>
```

### Example: Interactive Goal Setter

Drawer with interactive controls and animated bar chart:

```svelte
<script lang="ts">
  import MinusIcon from "@lucide/svelte/icons/minus";
  import PlusIcon from "@lucide/svelte/icons/plus";
  import * as Drawer from "$lib/components/ui/drawer/index.js";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import { BarChart } from "layerchart";
  import { scaleBand } from "d3-scale";
  import { cubicInOut } from "svelte/easing";

  const data = Array.from({ length: 13 }, (_, i) => ({ goal: [400, 300, 200, 300, 200, 278, 189, 239, 300, 200, 278, 189, 349][i] }));
  let goal = $state(350);

  function handleClick(adjustment: number) {
    goal = Math.max(200, Math.min(400, goal + adjustment));
  }

  let context = $state();
</script>

<Drawer.Root>
  <Drawer.Trigger class={buttonVariants({ variant: "outline" })}>Open Drawer</Drawer.Trigger>
  <Drawer.Content>
    <div class="mx-auto w-full max-w-sm">
      <Drawer.Header>
        <Drawer.Title>Move Goal</Drawer.Title>
        <Drawer.Description>Set your daily activity goal.</Drawer.Description>
      </Drawer.Header>
      <div class="p-4 pb-0">
        <div class="flex items-center justify-center space-x-2">
          <Button variant="outline" size="icon" class="size-8 shrink-0 rounded-full" onclick={() => handleClick(-10)} disabled={goal <= 200}>
            <MinusIcon />
          </Button>
          <div class="flex-1 text-center">
            <div class="text-7xl font-bold">{goal}</div>
            <div class="text-muted-foreground text-[0.70rem] uppercase">Calories/day</div>
          </div>
          <Button variant="outline" size="icon" class="size-8 shrink-0 rounded-full" onclick={() => handleClick(10)} disabled={goal >= 400}>
            <PlusIcon />
          </Button>
        </div>
        <div class="mt-3 h-[120px]">
          <BarChart
            bind:context
            data={data.map((d, i) => ({ goal: d.goal, index: i }))}
            y="goal"
            x="index"
            xScale={scaleBand().padding(0.25)}
            axis={false}
            tooltip={false}
            props={{
              bars: {
                stroke: "none",
                rounded: "all",
                radius: 4,
                initialY: context?.height,
                initialHeight: 0,
                motion: { x: { type: "tween", duration: 500, easing: cubicInOut }, width: { type: "tween", duration: 500, easing: cubicInOut }, height: { type: "tween", duration: 500, easing: cubicInOut }, y: { type: "tween", duration: 500, easing: cubicInOut } },
                fill: "var(--color-foreground)",
                fillOpacity: 0.9
              },
              highlight: { area: { fill: "none" } }
            }}
          />
        </div>
      </div>
      <Drawer.Footer>
        <Button>Submit</Button>
        <Drawer.Close class={buttonVariants({ variant: "outline" })}>Cancel</Drawer.Close>
      </Drawer.Footer>
    </div>
  </Drawer.Content>
</Drawer.Root>
```

### Responsive Dialog/Drawer

Combine Dialog and Drawer to render Dialog on desktop (≥768px) and Drawer on mobile:

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
    <Dialog.Trigger class={buttonVariants({ variant: "outline" })}>Edit Profile</Dialog.Trigger>
    <Dialog.Content class="sm:max-w-[425px]">
      <Dialog.Header>
        <Dialog.Title>Edit profile</Dialog.Title>
        <Dialog.Description>Make changes to your profile here. Click save when you're done.</Dialog.Description>
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
    <Drawer.Trigger class={buttonVariants({ variant: "outline" })}>Edit Profile</Drawer.Trigger>
    <Drawer.Content>
      <Drawer.Header class="text-left">
        <Drawer.Title>Edit profile</Drawer.Title>
        <Drawer.Description>Make changes to your profile here. Click save when you're done.</Drawer.Description>
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
        <Drawer.Close class={buttonVariants({ variant: "outline" })}>Cancel</Drawer.Close>
      </Drawer.Footer>
    </Drawer.Content>
  </Drawer.Root>
{/if}
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

### dropdown-menu
Dropdown menu with Root/Trigger/Content/Item/Group/Separator/Sub/CheckboxItem/RadioGroup components; supports disabled items, shortcuts, and nested submenus.

## Dropdown Menu

A menu component triggered by a button that displays a set of actions or functions.

### Installation

```bash
npx shadcn-svelte@latest add dropdown-menu -y -o
```

Use `-y` to skip confirmation and `-o` to overwrite existing files.

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
    <DropdownMenu.Group>
      <DropdownMenu.Item>Team</DropdownMenu.Item>
      <DropdownMenu.Sub>
        <DropdownMenu.SubTrigger>Invite users</DropdownMenu.SubTrigger>
        <DropdownMenu.SubContent>
          <DropdownMenu.Item>Email</DropdownMenu.Item>
          <DropdownMenu.Item>Message</DropdownMenu.Item>
        </DropdownMenu.SubContent>
      </DropdownMenu.Sub>
    </DropdownMenu.Group>
    <DropdownMenu.Separator />
    <DropdownMenu.Item disabled>API</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
```

### Components

- `Root`: Container for the dropdown menu
- `Trigger`: Button that opens the menu (accepts snippet with `props`)
- `Content`: Menu container with optional `align` and `class` props
- `Label`: Section label
- `Group`: Groups related items
- `Item`: Menu item (supports `disabled` prop)
- `Shortcut`: Keyboard shortcut display
- `Separator`: Visual divider
- `Sub`/`SubTrigger`/`SubContent`: Nested submenu

### Checkboxes Example

```svelte
<script lang="ts">
  let showStatusBar = $state(true);
  let showActivityBar = $state(false);
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      <Button {...props} variant="outline">Open</Button>
    {/snippet}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content class="w-56">
    <DropdownMenu.Group>
      <DropdownMenu.Label>Appearance</DropdownMenu.Label>
      <DropdownMenu.Separator />
      <DropdownMenu.CheckboxItem bind:checked={showStatusBar}>
        Status Bar
      </DropdownMenu.CheckboxItem>
      <DropdownMenu.CheckboxItem bind:checked={showActivityBar} disabled>
        Activity Bar
      </DropdownMenu.CheckboxItem>
    </DropdownMenu.Group>
  </DropdownMenu.Content>
</DropdownMenu.Root>
```

### Radio Group Example

```svelte
<script lang="ts">
  let position = $state("bottom");
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      <Button {...props} variant="outline">Open</Button>
    {/snippet}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content class="w-56">
    <DropdownMenu.Group>
      <DropdownMenu.Label>Panel Position</DropdownMenu.Label>
      <DropdownMenu.Separator />
      <DropdownMenu.RadioGroup bind:value={position}>
        <DropdownMenu.RadioItem value="top">Top</DropdownMenu.RadioItem>
        <DropdownMenu.RadioItem value="bottom">Bottom</DropdownMenu.RadioItem>
        <DropdownMenu.RadioItem value="right">Right</DropdownMenu.RadioItem>
      </DropdownMenu.RadioGroup>
    </DropdownMenu.Group>
  </DropdownMenu.Content>
</DropdownMenu.Root>
```

### Changelog

**2024-10-30**: Added automatic icon styling to `SubTrigger` with classes `gap-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0`. Removed manual `size-4` from icons inside `SubTrigger`.

### empty
Empty state component with Root, Header (Media/Title/Description), and Content sections; supports icon/avatar variants, borders, gradients, and input groups.

## Empty State Component

Display empty states with customizable content structure.

### Installation

```bash
npx shadcn-svelte@latest add empty -y -o
```

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
    <Button variant="outline">Import Project</Button>
  </Empty.Content>
</Empty.Root>
```

### Component Structure

- `Empty.Root`: Container
- `Empty.Header`: Header section containing media, title, and description
- `Empty.Media`: Media container with `variant="icon"` (for icons) or `variant="default"` (for custom content like avatars)
- `Empty.Title`: Title text
- `Empty.Description`: Description text
- `Empty.Content`: Action content area (buttons, forms, etc.)

### Examples

**Outline variant** - Add `class="border border-dashed"` to `Empty.Root` for a bordered empty state.

**Background variant** - Use Tailwind utilities like `class="from-muted/50 to-background h-full bg-gradient-to-b from-30%"` on `Empty.Root` for gradient backgrounds.

**Avatar** - Use `Empty.Media variant="default"` with `Avatar.Root` component:
```svelte
<Empty.Media variant="default">
  <Avatar.Root class="size-12">
    <Avatar.Image src="..." class="grayscale" />
    <Avatar.Fallback>LR</Avatar.Fallback>
  </Avatar.Root>
</Empty.Media>
```

**Avatar Group** - Multiple avatars in `Empty.Media` with negative margin and ring styling:
```svelte
<Empty.Media>
  <div class="*:ring-background flex -space-x-2 *:size-12 *:ring-2 *:grayscale">
    <Avatar.Root>...</Avatar.Root>
    <Avatar.Root>...</Avatar.Root>
    <Avatar.Root>...</Avatar.Root>
  </div>
</Empty.Media>
```

**With InputGroup** - Add search/input functionality to `Empty.Content`:
```svelte
<Empty.Content>
  <InputGroup.Root class="sm:w-3/4">
    <InputGroup.Input placeholder="Try searching..." />
    <InputGroup.Addon>
      <SearchIcon />
    </InputGroup.Addon>
    <InputGroup.Addon align="inline-end">
      <Kbd.Root>/</Kbd.Root>
    </InputGroup.Addon>
  </InputGroup.Root>
</Empty.Content>
```

### field
Composable form field components with labels, descriptions, errors, and validation; supports vertical/horizontal/responsive orientations and choice cards.

# Field Component

Composable form field components for building accessible forms with labels, controls, help text, and validation states.

## Installation

```bash
npx shadcn-svelte@latest add field -y -o
```

## Core Components

- `Field` - wrapper for a single field with `role="group"`
- `FieldSet` - semantic grouping with `<fieldset>`
- `FieldLegend` - legend for fieldsets
- `FieldGroup` - flex column container for related fields
- `FieldLabel` - label element, can wrap fields for choice cards
- `FieldDescription` - helper text
- `FieldError` - validation error message
- `FieldContent` - flex column grouping label and description
- `FieldSeparator` - divider between field groups
- `FieldTitle` - title for choice cards

## Orientation

- Default (vertical): stacks label, control, helper text
- `orientation="horizontal"`: aligns label and control side-by-side with `FieldContent` for aligned descriptions
- `orientation="responsive"`: automatic column layouts with container queries using `@container/field-group`

## Examples

**Input fields:**
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

**Textarea:**
```svelte
<Field.Field>
  <Field.Label for="feedback">Feedback</Field.Label>
  <Textarea id="feedback" placeholder="Your feedback helps us improve..." rows={4} />
  <Field.Description>Share your thoughts about our service.</Field.Description>
</Field.Field>
```

**Select:**
```svelte
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

**Slider:**
```svelte
<Field.Field>
  <Field.Label>Price Range</Field.Label>
  <Field.Description>Set your budget range (${value[0]} - ${value[1]}).</Field.Description>
  <Slider type="multiple" bind:value max={1000} min={0} step={10} class="mt-2 w-full" />
</Field.Field>
```

**Fieldset with legend:**
```svelte
<Field.Set>
  <Field.Legend>Address Information</Field.Legend>
  <Field.Description>We need your address to deliver your order.</Field.Description>
  <Field.Group>
    <Field.Field>
      <Field.Label for="street">Street Address</Field.Label>
      <Input id="street" type="text" placeholder="123 Main St" />
    </Field.Field>
    <div class="grid grid-cols-2 gap-4">
      <Field.Field>
        <Field.Label for="city">City</Field.Label>
        <Input id="city" type="text" placeholder="New York" />
      </Field.Field>
      <Field.Field>
        <Field.Label for="zip">Postal Code</Field.Label>
        <Input id="zip" type="text" placeholder="90502" />
      </Field.Field>
    </div>
  </Field.Group>
</Field.Set>
```

**Checkbox group:**
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

**Radio group:**
```svelte
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

**Switch:**
```svelte
<Field.Field orientation="horizontal">
  <Field.Content>
    <Field.Label for="2fa">Multi-factor authentication</Field.Label>
    <Field.Description>Enable multi-factor authentication for added security.</Field.Description>
  </Field.Content>
  <Switch id="2fa" />
</Field.Field>
```

**Choice card (selectable field groups):**
```svelte
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

**Responsive layout:**
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
  </Field.Group>
</Field.Set>
```

## Validation

Add `data-invalid` to `Field` to switch into error state. Add `aria-invalid` on the input for assistive technologies. Render `FieldError` after the control or inside `FieldContent`:

```svelte
<Field.Field data-invalid>
  <Field.Label for="email">Email</Field.Label>
  <Input id="email" type="email" aria-invalid />
  <Field.Error>Enter a valid email address.</Field.Error>
</Field.Field>
```

## Accessibility

- `FieldSet` and `FieldLegend` group related controls for keyboard and assistive tech users
- `Field` outputs `role="group"` so nested controls inherit labeling from `FieldLabel` and `FieldLegend`
- Use `FieldSeparator` sparingly to ensure screen readers encounter clear section boundaries


### form
Form components wrapping Formsnap & Superforms with Zod validation, ARIA attributes, and composable field structure (Field/Control/Label/Description/FieldErrors); install with `npx shadcn-svelte@latest add form -y -o`; define schema, load via superValidate, create component with superForm hook, handle via server action.

## Building Forms with Formsnap, Superforms & Zod

Well-designed forms must be semantically correct, keyboard-navigable, accessible with ARIA attributes, support client/server validation, and styled consistently.

The Form components wrap Formsnap & Superforms to provide:
- Composable form field components for scoping state
- Zod validation (or other Superforms-supported validators)
- Automatic ARIA attributes based on field states
- Integration with Select, RadioGroup, Switch, Checkbox, and other UI components

### Anatomy
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

### Installation
```bash
npx shadcn-svelte@latest add form -y -o
```
(-y: skip confirmation, -o: overwrite existing files)

### Usage

**1. Create a form schema** (src/routes/settings/schema.ts):
```ts
import { z } from "zod";
export const formSchema = z.object({
  username: z.string().min(2).max(50),
});
export type FormSchema = typeof formSchema;
```

**2. Setup the load function** (src/routes/settings/+page.server.ts):
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

**3. Create form component** (src/routes/settings/settings-form.svelte):
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

The `name`, `id`, and accessibility attributes are applied via spreading `props` from Form.Control. Form.Label automatically associates with input via `for` attribute.

**4. Use the component** (src/routes/settings/+page.svelte):
```svelte
<script lang="ts">
  import type { PageData } from "./$types.js";
  import SettingsForm from "./settings-form.svelte";
  let { data }: { data: PageData } = $props();
</script>
<SettingsForm {data} />
```

**5. Create an Action** (src/routes/settings/+page.server.ts):
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

**SPA Example** (client-side only):
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

### Related Components
Form examples also available for: Checkbox, Date Picker, Input, Radio Group, Select, Switch, Textarea

### hover-card
Hover card component for displaying link preview content on hover; install with `add hover-card -y -o`; use Root/Trigger/Content structure with optional href on Trigger.

## Hover Card

A component that displays preview content when hovering over a link, useful for showing additional information to sighted users.

### Installation

```bash
npx shadcn-svelte@latest add hover-card -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

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

### Example with Avatar and Metadata

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

### Components

- `HoverCard.Root`: Container component
- `HoverCard.Trigger`: The element that triggers the hover card (can be a link with href)
- `HoverCard.Content`: The content displayed on hover

See Bits UI documentation for full API reference.

### input-group
Input/textarea wrapper component with configurable addons for icons, text, buttons, tooltips, dropdowns, and loading indicators; supports inline and block alignment.

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

### Components

- `InputGroup.Root`: Container wrapper
- `InputGroup.Input`: Text input element
- `InputGroup.Textarea`: Multi-line text input
- `InputGroup.Addon`: Container for additional content (icons, text, buttons)
- `InputGroup.Text`: Text content within addons
- `InputGroup.Button`: Button element within addons

### Addon Alignment

The `align` prop on `InputGroup.Addon` controls positioning:
- `inline-end`: Right side (default for most cases)
- `block-end`: Bottom (for textarea)
- `block-start`: Top (for textarea)

### Examples

**Icons:**
```svelte
<InputGroup.Root>
  <InputGroup.Input placeholder="Search..." />
  <InputGroup.Addon>
    <SearchIcon />
  </InputGroup.Addon>
</InputGroup.Root>

<InputGroup.Root>
  <InputGroup.Input type="email" placeholder="Enter your email" />
  <InputGroup.Addon>
    <MailIcon />
  </InputGroup.Addon>
</InputGroup.Root>

<InputGroup.Root>
  <InputGroup.Input placeholder="Card number" />
  <InputGroup.Addon align="inline-end">
    <StarIcon />
    <InfoIcon />
  </InputGroup.Addon>
</InputGroup.Root>
```

**Text:**
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

<InputGroup.Root>
  <InputGroup.Addon>
    <InputGroup.Text>https://</InputGroup.Text>
  </InputGroup.Addon>
  <InputGroup.Input placeholder="example.com" />
  <InputGroup.Addon align="inline-end">
    <InputGroup.Text>.com</InputGroup.Text>
  </InputGroup.Addon>
</InputGroup.Root>

<InputGroup.Root>
  <InputGroup.Input placeholder="Enter your username" />
  <InputGroup.Addon align="inline-end">
    <InputGroup.Text>@company.com</InputGroup.Text>
  </InputGroup.Addon>
</InputGroup.Root>

<InputGroup.Root>
  <InputGroup.Textarea placeholder="Enter your message" />
  <InputGroup.Addon align="block-end">
    <InputGroup.Text class="text-muted-foreground text-xs">
      120 characters left
    </InputGroup.Text>
  </InputGroup.Addon>
</InputGroup.Root>
```

**Buttons with Actions:**
```svelte
<script lang="ts">
  import { UseClipboard } from "$lib/hooks/use-clipboard.svelte.js";
  let isFavorite = $state(false);
  const clipboard = new UseClipboard();
</script>

<InputGroup.Root>
  <InputGroup.Input placeholder="https://x.com/shadcn" readonly />
  <InputGroup.Addon align="inline-end">
    <InputGroup.Button
      size="icon-xs"
      onclick={() => clipboard.copy("https://x.com/shadcn")}
    >
      {#if clipboard.copied}
        <CheckIcon />
      {:else}
        <CopyIcon />
      {/if}
    </InputGroup.Button>
  </InputGroup.Addon>
</InputGroup.Root>

<InputGroup.Root>
  <InputGroup.Input placeholder="Type to search..." />
  <InputGroup.Addon align="inline-end">
    <InputGroup.Button variant="secondary">Search</InputGroup.Button>
  </InputGroup.Addon>
</InputGroup.Root>

<InputGroup.Root>
  <InputGroup.Input placeholder="@shadcn" />
  <InputGroup.Addon align="inline-end">
    <div class="bg-primary text-primary-foreground flex size-4 items-center justify-center rounded-full">
      <CheckIcon class="size-3" />
    </div>
  </InputGroup.Addon>
</InputGroup.Root>
```

**Tooltips:**
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

<InputGroup.Root>
  <InputGroup.Input placeholder="Your email address" />
  <InputGroup.Addon align="inline-end">
    <Tooltip.Root>
      <Tooltip.Trigger>
        {#snippet child({ props })}
          <InputGroup.Button {...props} variant="ghost" size="icon-xs">
            <HelpCircleIcon />
          </InputGroup.Button>
        {/snippet}
      </Tooltip.Trigger>
      <Tooltip.Content>
        <p>We'll use this to send you notifications</p>
      </Tooltip.Content>
    </Tooltip.Root>
  </InputGroup.Addon>
</InputGroup.Root>
```

**Textarea with Block Alignment:**
```svelte
<InputGroup.Root>
  <InputGroup.Addon align="block-start" class="border-b">
    <InputGroup.Text class="font-mono font-medium">script.js</InputGroup.Text>
    <InputGroup.Button class="ml-auto" size="icon-xs">
      <RefreshCwIcon />
    </InputGroup.Button>
  </InputGroup.Addon>
  <InputGroup.Textarea placeholder="console.log('Hello, world!');" class="min-h-[200px]" />
  <InputGroup.Addon align="block-end" class="border-t">
    <InputGroup.Text>Line 1, Column 1</InputGroup.Text>
    <InputGroup.Button size="sm" class="ml-auto" variant="default">
      Run <CornerDownLeftIcon />
    </InputGroup.Button>
  </InputGroup.Addon>
</InputGroup.Root>
```

**Loading Indicators:**
```svelte
<InputGroup.Root data-disabled>
  <InputGroup.Input placeholder="Searching..." disabled />
  <InputGroup.Addon align="inline-end">
    <Spinner />
  </InputGroup.Addon>
</InputGroup.Root>

<InputGroup.Root data-disabled>
  <InputGroup.Input placeholder="Processing..." disabled />
  <InputGroup.Addon>
    <Spinner />
  </InputGroup.Addon>
</InputGroup.Root>

<InputGroup.Root data-disabled>
  <InputGroup.Input placeholder="Saving changes..." disabled />
  <InputGroup.Addon align="inline-end">
    <InputGroup.Text>Saving...</InputGroup.Text>
    <Spinner />
  </InputGroup.Addon>
</InputGroup.Root>
```

**Labels:**
```svelte
<InputGroup.Root>
  <InputGroup.Input id="email" placeholder="shadcn" />
  <InputGroup.Addon>
    <Label.Root for="email">@</Label.Root>
  </InputGroup.Addon>
</InputGroup.Root>

<InputGroup.Root>
  <InputGroup.Input id="email-2" placeholder="shadcn@vercel.com" />
  <InputGroup.Addon align="block-start">
    <Label.Root for="email-2" class="text-foreground">Email</Label.Root>
    <Tooltip.Root>
      <Tooltip.Trigger>
        {#snippet child({ props })}
          <InputGroup.Button {...props} variant="ghost" class="ml-auto rounded-full" size="icon-xs">
            <InfoIcon />
          </InputGroup.Button>
        {/snippet}
      </Tooltip.Trigger>
      <Tooltip.Content>
        <p>We'll use this to send you notifications</p>
      </Tooltip.Content>
    </Tooltip.Root>
  </InputGroup.Addon>
</InputGroup.Root>
```

**Dropdown Menus:**
```svelte
<InputGroup.Root>
  <InputGroup.Input placeholder="Enter file name" />
  <InputGroup.Addon align="inline-end">
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        {#snippet child({ props })}
          <InputGroup.Button {...props} variant="ghost" size="icon-xs">
            <MoreHorizontalIcon />
          </InputGroup.Button>
        {/snippet}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end">
        <DropdownMenu.Item>Settings</DropdownMenu.Item>
        <DropdownMenu.Item>Copy path</DropdownMenu.Item>
        <DropdownMenu.Item>Open location</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </InputGroup.Addon>
</InputGroup.Root>

<InputGroup.Root class="[--radius:1rem]">
  <InputGroup.Input placeholder="Enter search query" />
  <InputGroup.Addon align="inline-end">
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        {#snippet child({ props })}
          <InputGroup.Button {...props} variant="ghost" class="!pr-1.5 text-xs">
            Search In... <ChevronDownIcon class="size-3" />
          </InputGroup.Button>
        {/snippet}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" class="[--radius:0.95rem]">
        <DropdownMenu.Item>Documentation</DropdownMenu.Item>
        <DropdownMenu.Item>Blog Posts</DropdownMenu.Item>
        <DropdownMenu.Item>Changelog</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </InputGroup.Addon>
</InputGroup.Root>
```

**Button Group Integration:**
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

**Custom Input:**

Add the `data-slot="input-group-control"` attribute to custom input elements for automatic behavior and focus state handling. No styles are applied; use the `class` prop for styling.

```svelte
<InputGroup.Root>
  <textarea
    data-slot="input-group-control"
    class="field-sizing-content flex min-h-16 w-full resize-none rounded-md bg-transparent px-3 py-2.5 text-base outline-none transition-[color,box-shadow] md:text-sm"
    placeholder="Autoresize textarea..."
  ></textarea>
  <InputGroup.Addon align="block-end">
    <InputGroup.Button class="ml-auto" size="sm" variant="default">
      Submit
    </InputGroup.Button>
  </InputGroup.Addon>
</InputGroup.Root>
```

### input-otp
Accessible OTP input component with configurable length, pattern validation, separators, and form integration support.

## Input OTP

Accessible one-time password component with copy-paste functionality, built on Bits UI's PinInput.

### Installation

```bash
npx shadcn-svelte@latest add input-otp -y -o
```

(-y: skip confirmation, -o: overwrite existing files)

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

- `InputOTP.Root` - Container with `maxlength` prop
- `InputOTP.Group` - Groups cells together
- `InputOTP.Slot` - Individual cell, accepts `{cell}` prop
- `InputOTP.Separator` - Visual separator between groups

### Examples

**Pattern validation:**
```svelte
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "bits-ui";

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

**Multiple separators:**
```svelte
<InputOTP.Root maxlength={6}>
  {#snippet children({ cells })}
    <InputOTP.Group>
      {#each cells.slice(0, 2) as cell (cell)}
        <InputOTP.Slot {cell} />
      {/each}
    </InputOTP.Group>
    <InputOTP.Separator />
    <InputOTP.Group>
      {#each cells.slice(2, 4) as cell (cell)}
        <InputOTP.Slot {cell} />
      {/each}
    </InputOTP.Group>
    <InputOTP.Separator />
    <InputOTP.Group>
      {#each cells.slice(4, 6) as cell (cell)}
        <InputOTP.Slot {cell} />
      {/each}
    </InputOTP.Group>
  {/snippet}
</InputOTP.Root>
```

**Invalid state:**
```svelte
<InputOTP.Root maxlength={6}>
  {#snippet children({ cells })}
    <InputOTP.Group>
      {#each cells as cell (cell)}
        <InputOTP.Slot aria-invalid {cell} />
      {/each}
    </InputOTP.Group>
  {/snippet}
</InputOTP.Root>
```

**Form integration with validation:**
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
Form input component supporting email, file, disabled, invalid states, labels, descriptions, buttons, and sveltekit-superforms validation integration.

## Input Component

Form input field component.

### Installation

```bash
npx shadcn-svelte@latest add input -y -o
```

### Usage

```svelte
<script lang="ts">
  import { Input } from "$lib/components/ui/input/index.js";
</script>
<Input type="email" placeholder="email" class="max-w-xs" />
```

### Examples

**Default & Disabled:**
```svelte
<Input type="email" placeholder="email" class="max-w-xs" />
<Input disabled type="email" placeholder="email" class="max-w-sm" />
```

**With Label:**
```svelte
<script lang="ts">
  import { Label } from "$lib/components/ui/label/index.js";
  const id = $props.id();
</script>
<div class="flex w-full max-w-sm flex-col gap-1.5">
  <Label for="email-{id}">Email</Label>
  <Input type="email" id="email-{id}" placeholder="email" />
</div>
```

**With Description Text:**
```svelte
<div class="flex w-full max-w-sm flex-col gap-1.5">
  <Label for="email">Email</Label>
  <Input type="email" id="email" placeholder="Email" />
  <p class="text-muted-foreground text-sm">Enter your email address.</p>
</div>
```

**With Button:**
```svelte
<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
</script>
<form class="flex w-full max-w-sm items-center space-x-2">
  <Input type="email" placeholder="email" />
  <Button type="submit">Subscribe</Button>
</form>
```

**Invalid State:**
```svelte
<Input
  aria-invalid
  type="email"
  placeholder="email"
  value="shadcn@example"
  class="max-w-sm"
/>
```

**File Input:**
```svelte
<div class="grid w-full max-w-sm items-center gap-1.5">
  <Label for="picture">Picture</Label>
  <Input id="picture" type="file" />
</div>
```

**Form Integration with Validation:**
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

### item
Flex container for content display with variants, sizes, media types, grouping, and link/dropdown integration.

## Item Component

A flex container for displaying content with title, description, and actions. Can be grouped with `ItemGroup` to create lists.

### Installation

```bash
npx shadcn-svelte@latest add item -y -o
```

(-y: skip confirmation, -o: overwrite existing files)

### Basic Usage

```svelte
<script lang="ts">
  import * as Item from "$lib/components/ui/item/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
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

Three variants available: default (subtle background/borders), `outline` (clear borders, transparent background), `muted` (subdued appearance).

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

<Item.Root variant="muted">
  <Item.Content>
    <Item.Title>Muted Variant</Item.Title>
    <Item.Description>Subdued appearance for secondary content.</Item.Description>
  </Item.Content>
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

**Icon**: Display icons in media slot.

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

**Avatar**: Display single or multiple avatars.

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

**Image**: Display images in media slot.

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
      <Item.Content class="flex-none text-center">
        <Item.Description>3:45</Item.Description>
      </Item.Content>
    </a>
  {/snippet}
</Item.Root>
```

### Grouping

Use `Item.Group` to create lists of items with separators.

```svelte
<Item.Group>
  {#each people as person, index (person.username)}
    <Item.Root>
      <Item.Media>
        <Avatar.Root>
          <Avatar.Image src={person.avatar} class="grayscale" />
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

### Header

Use `Item.Header` for full-width content like images.

```svelte
<Item.Group class="grid grid-cols-3 gap-4">
  {#each models as model (model.name)}
    <Item.Root variant="outline">
      <Item.Header>
        <img src={model.image} alt={model.name} class="aspect-square w-full rounded-sm object-cover" />
      </Item.Header>
      <Item.Content>
        <Item.Title>{model.name}</Item.Title>
        <Item.Description>{model.description}</Item.Description>
      </Item.Content>
    </Item.Root>
  {/each}
</Item.Group>
```

### Links

Use the `child` snippet to render as a link. Hover and focus states apply to the anchor element.

```svelte
<Item.Root>
  {#snippet child({ props })}
    <a href="#/" {...props}>
      <Item.Content>
        <Item.Title>Visit our documentation</Item.Title>
        <Item.Description>Learn how to get started with our components.</Item.Description>
      </Item.Content>
      <Item.Actions>
        <ChevronRightIcon class="size-4" />
      </Item.Actions>
    </a>
  {/snippet}
</Item.Root>

<Item.Root variant="outline">
  {#snippet child({ props })}
    <a href="#/" target="_blank" rel="noopener noreferrer" {...props}>
      <Item.Content>
        <Item.Title>External resource</Item.Title>
        <Item.Description>Opens in a new tab with security attributes.</Item.Description>
      </Item.Content>
      <Item.Actions>
        <ExternalLinkIcon class="size-4" />
      </Item.Actions>
    </a>
  {/snippet}
</Item.Root>
```

### Dropdown Integration

Use Item within dropdown menus for styled list items.

```svelte
<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      <Button {...props} variant="outline" size="sm" class="w-fit">
        Select <ChevronDown />
      </Button>
    {/snippet}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content class="w-72 [--radius:0.65rem]" align="end">
    {#each people as person (person.username)}
      <DropdownMenu.Item class="p-0">
        <Item.Root size="sm" class="w-full p-2">
          <Item.Media>
            <Avatar.Root class="size-8">
              <Avatar.Image src={person.avatar} class="grayscale" />
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

### Item vs Field

Use Field for form inputs (checkbox, input, radio, select). Use Item for displaying content (title, description, actions).

### kbd
Kbd component displays keyboard input; supports grouping and nesting in buttons, tooltips, and input groups.

## Kbd Component

Displays textual user input from keyboard.

### Installation

```bash
npx shadcn-svelte@latest add kbd -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Usage

```svelte
<script lang="ts">
  import * as Kbd from "$lib/components/ui/kbd/index.js";
</script>
<Kbd.Root>B</Kbd.Root>
```

### Examples

**Group**: Use `Kbd.Group` to group multiple keyboard keys together:
```svelte
<Kbd.Group>
  <Kbd.Root>Ctrl</Kbd.Root>
  <span>+</span>
  <Kbd.Root>B</Kbd.Root>
</Kbd.Group>
```

**Button**: Embed `Kbd.Root` inside a `Button` component:
```svelte
<Button variant="outline" size="sm" class="pr-2">
  Accept <Kbd.Root>Enter</Kbd.Root>
</Button>
```

**Tooltip**: Use `Kbd.Root` inside `Tooltip.Content`:
```svelte
<Tooltip.Content>
  <div class="flex items-center gap-2">
    Save Changes <Kbd.Root>S</Kbd.Root>
  </div>
</Tooltip.Content>
```

**Input Group**: Use `Kbd.Root` inside `InputGroup.Addon`:
```svelte
<InputGroup.Root>
  <InputGroup.Input placeholder="Search..." />
  <InputGroup.Addon align="inline-end">
    <Kbd.Root>Ctrl</Kbd.Root>
    <Kbd.Root>K</Kbd.Root>
  </InputGroup.Addon>
</InputGroup.Root>
```

### label
Accessible label component; use `for` attribute to link to form control `id`

## Label

Renders an accessible label associated with form controls.

### Installation

```bash
npx shadcn-svelte@latest add label -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Usage

```svelte
<script lang="ts">
  import { Label } from "$lib/components/ui/label/index.js";
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";
</script>

<div class="flex items-center space-x-2">
  <Checkbox id="terms" />
  <Label for="terms">Accept terms and conditions</Label>
</div>

<Label for="email">Your email address</Label>
```

The `for` attribute associates the label with a form control by its `id`.

See the Bits UI documentation for the full API reference.

### menubar
Desktop menubar with Root/Menu/Trigger/Content/Item/Shortcut/Separator/Sub/CheckboxItem/RadioGroup components; supports nested submenus, keyboard shortcuts, checkboxes, and radio selections.

## Menubar

A persistent menu component common in desktop applications providing quick access to commands.

### Installation

```bash
npx shadcn-svelte@latest add menubar -y -o
```

Use `-y` to skip confirmation and `-o` to overwrite existing files.

### Basic Usage

```svelte
<script lang="ts">
  import * as Menubar from "$lib/components/ui/menubar/index.js";
</script>

<Menubar.Root>
  <Menubar.Menu>
    <Menubar.Trigger>File</Menubar.Trigger>
    <Menubar.Content>
      <Menubar.Item>New Tab <Menubar.Shortcut>T</Menubar.Shortcut></Menubar.Item>
      <Menubar.Item>New Window <Menubar.Shortcut>N</Menubar.Shortcut></Menubar.Item>
      <Menubar.Separator />
      <Menubar.Sub>
        <Menubar.SubTrigger>Share</Menubar.SubTrigger>
        <Menubar.SubContent>
          <Menubar.Item>Email link</Menubar.Item>
          <Menubar.Item>Messages</Menubar.Item>
        </Menubar.SubContent>
      </Menubar.Sub>
    </Menubar.Content>
  </Menubar.Menu>
</Menubar.Root>
```

### Components

- **Menubar.Root**: Container for all menus
- **Menubar.Menu**: Individual menu group
- **Menubar.Trigger**: Menu label/button
- **Menubar.Content**: Menu dropdown container
- **Menubar.Item**: Menu item with optional `inset` prop for alignment
- **Menubar.Shortcut**: Keyboard shortcut display
- **Menubar.Separator**: Visual divider
- **Menubar.Sub / Menubar.SubTrigger / Menubar.SubContent**: Nested submenu
- **Menubar.CheckboxItem**: Checkbox menu item with `bind:checked` for state
- **Menubar.RadioGroup / Menubar.RadioItem**: Radio button group with `bind:value` for selection

### Advanced Example

```svelte
<script lang="ts">
  let bookmarks = $state(false);
  let fullUrls = $state(true);
  let profileRadioValue = $state("benoit");
</script>

<Menubar.Root>
  <Menubar.Menu>
    <Menubar.Trigger>View</Menubar.Trigger>
    <Menubar.Content>
      <Menubar.CheckboxItem bind:checked={bookmarks}>
        Always Show Bookmarks Bar
      </Menubar.CheckboxItem>
      <Menubar.CheckboxItem bind:checked={fullUrls}>
        Always Show Full URLs
      </Menubar.CheckboxItem>
      <Menubar.Separator />
      <Menubar.Item inset>Reload <Menubar.Shortcut>R</Menubar.Shortcut></Menubar.Item>
    </Menubar.Content>
  </Menubar.Menu>
  <Menubar.Menu>
    <Menubar.Trigger>Profiles</Menubar.Trigger>
    <Menubar.Content>
      <Menubar.RadioGroup bind:value={profileRadioValue}>
        <Menubar.RadioItem value="andy">Andy</Menubar.RadioItem>
        <Menubar.RadioItem value="benoit">Benoit</Menubar.RadioItem>
        <Menubar.RadioItem value="luis">Luis</Menubar.RadioItem>
      </Menubar.RadioGroup>
    </Menubar.Content>
  </Menubar.Menu>
</Menubar.Root>
```

### native-select
Native HTML select component with design system styling, option groups, disabled/invalid states, and accessibility features.

## Native Select

A styled wrapper around the native HTML `<select>` element with design system integration.

### Installation

```bash
npx shadcn-svelte@latest add native-select -y -o
```

Use `-y` to skip confirmation and `-o` to overwrite existing files.

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
  <NativeSelect.Option value="cancelled">Cancelled</NativeSelect.Option>
</NativeSelect.Root>
```

### Option Groups

Organize options with `NativeSelect.OptGroup`:

```svelte
<NativeSelect.Root>
  <NativeSelect.Option value="">Select department</NativeSelect.Option>
  <NativeSelect.OptGroup label="Engineering">
    <NativeSelect.Option value="frontend">Frontend</NativeSelect.Option>
    <NativeSelect.Option value="backend">Backend</NativeSelect.Option>
    <NativeSelect.Option value="devops">DevOps</NativeSelect.Option>
  </NativeSelect.OptGroup>
  <NativeSelect.OptGroup label="Sales">
    <NativeSelect.Option value="sales-rep">Sales Rep</NativeSelect.Option>
    <NativeSelect.Option value="account-manager">Account Manager</NativeSelect.Option>
    <NativeSelect.Option value="sales-director">Sales Director</NativeSelect.Option>
  </NativeSelect.OptGroup>
</NativeSelect.Root>
```

### States

**Disabled:**
```svelte
<NativeSelect.Root disabled>
  <NativeSelect.Option value="">Select priority</NativeSelect.Option>
  <NativeSelect.Option value="low">Low</NativeSelect.Option>
  <NativeSelect.Option value="medium">Medium</NativeSelect.Option>
  <NativeSelect.Option value="high">High</NativeSelect.Option>
</NativeSelect.Root>
```

**Invalid (with aria-invalid):**
```svelte
<NativeSelect.Root aria-invalid="true">
  <NativeSelect.Option value="">Select role</NativeSelect.Option>
  <NativeSelect.Option value="admin">Admin</NativeSelect.Option>
  <NativeSelect.Option value="editor">Editor</NativeSelect.Option>
  <NativeSelect.Option value="viewer">Viewer</NativeSelect.Option>
</NativeSelect.Root>
```

**Individual option disabled:**
```svelte
<NativeSelect.Option value="grapes" disabled>Grapes</NativeSelect.Option>
```

### API Reference

**NativeSelect.Root** - Main select wrapper
- `class`: string (optional)
- All other props passed to native `<select>`

**NativeSelect.Option** - Individual option
- `value`: string (required)
- `disabled`: boolean (default: false)
- `class`: string (optional)
- All other props passed to native `<option>`

**NativeSelect.OptGroup** - Option grouping
- `label`: string (required)
- `disabled`: boolean (default: false)
- `class`: string (optional)
- All other props passed to native `<optgroup>`

### Accessibility

- Maintains native HTML select accessibility
- Screen readers navigate with arrow keys
- Chevron icon marked `aria-hidden="true"`
- Use `aria-label` or `aria-labelledby` for context:

```svelte
<NativeSelect.Root aria-label="Choose your preferred language">
  <NativeSelect.Option value="en">English</NativeSelect.Option>
  <NativeSelect.Option value="es">Spanish</NativeSelect.Option>
  <NativeSelect.Option value="fr">French</NativeSelect.Option>
</NativeSelect.Root>
```

### NativeSelect vs Select

Use `NativeSelect` for native browser behavior, better performance, or mobile-optimized dropdowns. Use `Select` for custom styling, animations, or complex interactions.

### navigation-menu
Navigation menu component with triggers, dropdowns, and links; supports grid layouts, icons, and Tailwind styling.

## Navigation Menu

A collection of links for navigating websites. Built on Bits UI.

### Installation

```bash
npx shadcn-svelte@latest add navigation-menu -y -o
```

Use `-y` to skip confirmation prompt and `-o` to overwrite existing files.

### Basic Usage

```svelte
<script lang="ts">
  import * as NavigationMenu from "$lib/components/ui/navigation-menu/index.js";
</script>

<NavigationMenu.Root viewport={false}>
  <NavigationMenu.List>
    <NavigationMenu.Item>
      <NavigationMenu.Trigger>Item One</NavigationMenu.Trigger>
      <NavigationMenu.Content>
        <NavigationMenu.Link href="/">Link</NavigationMenu.Link>
      </NavigationMenu.Content>
    </NavigationMenu.Item>
  </NavigationMenu.List>
</NavigationMenu.Root>
```

### Components

- `NavigationMenu.Root` - Container with optional `viewport` prop
- `NavigationMenu.List` - Wrapper for menu items
- `NavigationMenu.Item` - Individual menu item
- `NavigationMenu.Trigger` - Clickable trigger text
- `NavigationMenu.Content` - Dropdown content container
- `NavigationMenu.Link` - Link element with optional `href` prop and `child` snippet

### Examples

**Grid layout with descriptions:**
```svelte
<NavigationMenu.Root viewport={false}>
  <NavigationMenu.List>
    <NavigationMenu.Item>
      <NavigationMenu.Trigger>Components</NavigationMenu.Trigger>
      <NavigationMenu.Content>
        <ul class="grid w-[400px] gap-2 p-2 md:w-[500px] md:grid-cols-2">
          <li>
            <NavigationMenu.Link>
              {#snippet child()}
                <a href="/docs/components/alert-dialog" class="block p-3 rounded-md hover:bg-accent">
                  <div class="font-medium">Alert Dialog</div>
                  <p class="text-sm text-muted-foreground">A modal dialog that interrupts the user...</p>
                </a>
              {/snippet}
            </NavigationMenu.Link>
          </li>
        </ul>
      </NavigationMenu.Content>
    </NavigationMenu.Item>
  </NavigationMenu.List>
</NavigationMenu.Root>
```

**With icons:**
```svelte
<NavigationMenu.Item>
  <NavigationMenu.Trigger>With Icon</NavigationMenu.Trigger>
  <NavigationMenu.Content>
    <ul class="grid w-[200px] gap-4 p-2">
      <li>
        <NavigationMenu.Link href="##" class="flex-row items-center gap-2">
          <CircleHelpIcon />
          Backlog
        </NavigationMenu.Link>
        <NavigationMenu.Link href="##" class="flex-row items-center gap-2">
          <CircleCheckIcon />
          Done
        </NavigationMenu.Link>
      </li>
    </ul>
  </NavigationMenu.Content>
</NavigationMenu.Item>
```

**Simple list:**
```svelte
<NavigationMenu.Item>
  <NavigationMenu.Trigger>Simple</NavigationMenu.Trigger>
  <NavigationMenu.Content>
    <ul class="grid w-[200px] gap-4 p-2">
      <li>
        <NavigationMenu.Link href="##">Components</NavigationMenu.Link>
        <NavigationMenu.Link href="##">Documentation</NavigationMenu.Link>
      </li>
    </ul>
  </NavigationMenu.Content>
</NavigationMenu.Item>
```

Use `navigationMenuTriggerStyle()` utility for consistent trigger styling. Use `cn()` utility to combine classes. Customize with Tailwind CSS classes on any component.

### pagination
Pagination component with configurable page count, items per page, and sibling count; renders page links, prev/next buttons, and ellipsis for skipped pages.

## Pagination Component

A UI component for navigating through paginated content with page numbers, previous/next buttons, and ellipsis for skipped pages.

### Installation

```bash
npx shadcn-svelte@latest add pagination -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Basic Usage

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

### Configuration

- `count`: Total number of items to paginate
- `perPage`: Items per page
- `siblingCount`: Number of page links to show on either side of the current page (useful for responsive design)

### Responsive Example

Use `MediaQuery` to adjust pagination behavior on different screen sizes:

```svelte
<script lang="ts">
  import { MediaQuery } from "svelte/reactivity";
  import ChevronLeftIcon from "@lucide/svelte/icons/chevron-left";
  import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";
  import * as Pagination from "$lib/components/ui/pagination/index.js";
  
  const isDesktop = new MediaQuery("(min-width: 768px)");
  const perPage = $derived(isDesktop.current ? 3 : 8);
  const siblingCount = $derived(isDesktop.current ? 1 : 0);
</script>

<Pagination.Root count={20} {perPage} {siblingCount}>
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

### Components

- `Pagination.Root`: Container with `count`, `perPage`, and `siblingCount` props
- `Pagination.Content`: Wrapper for pagination items
- `Pagination.Item`: Individual pagination element wrapper
- `Pagination.Link`: Clickable page number with `page` and `isActive` props
- `Pagination.PrevButton`: Previous page button
- `Pagination.NextButton`: Next page button
- `Pagination.Ellipsis`: Ellipsis indicator for skipped pages

The snippet receives `pages` (array of page objects with `type`, `key`, and `value` properties) and `currentPage` (current page number).

### popover
Popover component with Root, Trigger, and Content subcomponents; displays portal content on button click.

## Popover

A component that displays rich content in a portal, triggered by a button.

### Installation

```bash
npx shadcn-svelte@latest add popover -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

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

### Example with Form Controls

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

### API

Refer to the Bits UI Popover documentation for complete API reference and additional configuration options.

### progress
Progress bar component with value and max props; install via CLI with -y -o flags

## Progress

Displays a progress bar indicator showing task completion.

### Installation

```bash
npx shadcn-svelte@latest add progress -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Usage

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

The component accepts:
- `value`: current progress value (number)
- `max`: maximum value (default: 100)
- `class`: CSS classes for styling

Reference: Bits UI Progress component documentation and API reference available in upstream docs.

### radio-group
Radio button group component for single-selection from multiple options; install with -y -o flags; use RadioGroup.Root/Item with Label; integrates with sveltekit-superforms for form validation.

## Radio Group

Mutually exclusive selection component where only one option can be selected at a time.

### Installation

```bash
npx shadcn-svelte@latest add radio-group -y -o
```

Use `-y` to skip confirmation prompt and `-o` to overwrite existing files.

### Basic Usage

```svelte
<script lang="ts">
  import * as RadioGroup from "$lib/components/ui/radio-group/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
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

### Form Integration

Use with sveltekit-superforms for form handling:

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
    <RadioGroup.Root bind:value={$formData.type} class="flex flex-col space-y-1" name="type">
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

### API

- `RadioGroup.Root`: Container component with `value` prop for controlled selection
- `RadioGroup.Item`: Individual radio button with `value` and `id` props
- Bind to form data with `bind:value={$formData.fieldName}`
- Integrate with Form component for validation and error handling

### range-calendar
Date range picker calendar component built on Bits UI, uses @internationalized/date, binds {start, end} value object.

## Range Calendar

A calendar component for selecting a date range.

Built on Bits UI's Range Calendar component using the @internationalized/date package for date handling.

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

The component accepts a `value` object with `start` and `end` date properties and supports standard HTML class binding for styling.

### Installation

```bash
npx shadcn-svelte@latest add range-calendar -y -o
```

Use `-y` to skip confirmation and `-o` to overwrite existing files.

### Related Resources

30+ Calendar Blocks are available showcasing the component in action.

### resizable
Resizable panel component with horizontal/vertical direction, defaultSize percentages, nested pane support, and optional handle indicators.

## Resizable

Accessible resizable panel groups and layouts with keyboard support, built on PaneForge.

### Installation

```bash
npx shadcn-svelte@latest add resizable -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Basic Usage

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

### Key Components

- **PaneGroup**: Container with `direction` prop (`"horizontal"` or `"vertical"`)
- **Pane**: Individual resizable panel with optional `defaultSize` prop (percentage)
- **Handle**: Divider between panes, accepts `withHandle` prop to show/hide visual indicator

### Examples

**Vertical layout:**
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

**Nested panes with visible handle:**
```svelte
<Resizable.PaneGroup direction="horizontal" class="min-h-[200px] max-w-md rounded-lg border">
  <Resizable.Pane defaultSize={25}>
    <div class="flex h-full items-center justify-center p-6">
      <span class="font-semibold">Sidebar</span>
    </div>
  </Resizable.Pane>
  <Resizable.Handle withHandle />
  <Resizable.Pane defaultSize={75}>
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

For all available props and advanced features, see PaneForge documentation.

### scroll-area
Custom-styled scroll area component with configurable orientation (vertical/horizontal/both) via prop.

## Scroll Area

Augments native scroll functionality for custom, cross-browser styling.

### Installation

```bash
npx shadcn-svelte@latest add scroll-area -y -o
```

Use `-y` to skip confirmation prompt and `-o` to overwrite existing files.

### Basic Usage

```svelte
<script lang="ts">
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
</script>

<ScrollArea class="h-[200px] w-[350px] rounded-md border p-4">
  Content that overflows the container will be scrollable.
</ScrollArea>
```

### Orientation Prop

Control scrolling direction with the `orientation` prop:

- `"vertical"` (default): Vertical scrolling only
- `"horizontal"`: Horizontal scrolling only
- `"both"`: Both horizontal and vertical scrolling

**Horizontal example:**
```svelte
<ScrollArea class="w-96 rounded-md border" orientation="horizontal">
  <div class="flex w-max space-x-4 p-4">
    {#each items as item}
      <div class="shrink-0">{item}</div>
    {/each}
  </div>
</ScrollArea>
```

**Both directions example:**
```svelte
<ScrollArea class="h-[200px] w-[350px] rounded-md border p-4" orientation="both">
  <div class="w-[400px]">
    Content wider than container with vertical overflow.
  </div>
</ScrollArea>
```

### Styling

Apply Tailwind classes directly to the ScrollArea component for sizing and appearance (e.g., `h-72`, `w-48`, `rounded-md`, `border`).

### select
Dropdown select component with single selection, grouping, state binding, and form integration support.

## Select Component

Displays a dropdown list of options for users to pick from, triggered by a button.

### Installation

```bash
npx shadcn-svelte@latest add select -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

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

### With State Management

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
  <Select.Trigger class="w-[180px]">{triggerContent}</Select.Trigger>
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
        <Select.Root type="single" bind:value={$formData.email} name={props.name}>
          <Select.Trigger {...props}>
            {$formData.email ? $formData.email : "Select a verified email to display"}
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
      You can manage email address in your email settings.
    </Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Button>Submit</Form.Button>
</form>
```

### Key Features

- **Root component**: `Select.Root` with `type="single"` for single selection
- **Trigger**: `Select.Trigger` displays the selected value
- **Content**: `Select.Content` wraps the dropdown options
- **Items**: `Select.Item` with `value`, `label`, and optional `disabled` props
- **Grouping**: `Select.Group` and `Select.Label` for organizing items
- **Binding**: Use `bind:value` to connect to reactive state
- **Form integration**: Works with sveltekit-superforms for validation and submission

### separator
Separator component with horizontal/vertical orientation support; install via shadcn-svelte CLI.

## Separator

A component that visually or semantically separates content.

### Installation

```bash
npx shadcn-svelte@latest add separator -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Usage

```svelte
<script lang="ts">
  import { Separator } from "$lib/components/ui/separator/index.js";
</script>

<!-- Horizontal separator (default) -->
<div class="space-y-1">
  <h4 class="text-sm font-medium leading-none">Bits UI Primitives</h4>
  <p class="text-muted-foreground text-sm">An open-source UI component library.</p>
</div>
<Separator class="my-4" />

<!-- Vertical separator -->
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
Dialog-based sheet component with configurable side positioning (top/right/bottom/left) and CSS-customizable sizing.

## Sheet

A dialog-based component that displays complementary content sliding in from screen edges.

**Installation:**
```bash
npx shadcn-svelte@latest add sheet -y -o
```
(-y: skip confirmation, -o: overwrite existing files)

**Basic usage:**
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

**Side positioning:** Pass `side` prop to `<Sheet.Content />` with values: `top`, `right`, `bottom`, or `left`.

**Size customization:** Use CSS classes on `<Sheet.Content />`:
```svelte
<Sheet.Content class="w-[400px] sm:w-[540px]">
```

**Complete example with form:**
```svelte
<Sheet.Root>
  <Sheet.Trigger class={buttonVariants({ variant: "outline" })}>Open</Sheet.Trigger>
  <Sheet.Content side="right">
    <Sheet.Header>
      <Sheet.Title>Edit profile</Sheet.Title>
      <Sheet.Description>Make changes to your profile here.</Sheet.Description>
    </Sheet.Header>
    <div class="grid flex-1 auto-rows-min gap-6 px-4">
      <div class="grid gap-3">
        <Label for="name">Name</Label>
        <Input id="name" value="Pedro Duarte" />
      </div>
      <div class="grid gap-3">
        <Label for="username">Username</Label>
        <Input id="username" value="@peduarte" />
      </div>
    </div>
    <Sheet.Footer>
      <Sheet.Close class={buttonVariants({ variant: "outline" })}>Save changes</Sheet.Close>
    </Sheet.Footer>
  </Sheet.Content>
</Sheet.Root>
```

Extends Dialog component. See bits-ui Dialog docs for full API reference.

### sidebar
Composable sidebar component with Provider/Root/Header/Content/Group/Menu/Footer/Trigger subcomponents; supports left/right, sidebar/floating/inset variants, offcanvas/icon/none collapse modes; useSidebar() hook for state control; theming via CSS variables; integrates with Collapsible and DropdownMenu.

## Sidebar Component

A composable, themeable, customizable sidebar component that collapses to icons. Built from 30+ configurations extracted into reusable `sidebar-*.svelte` files.

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
- `Sidebar.Header` / `Sidebar.Footer` - Sticky top/bottom
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
  import CalendarIcon from "@lucide/svelte/icons/calendar";
  import SearchIcon from "@lucide/svelte/icons/search";
  import SettingsIcon from "@lucide/svelte/icons/settings";
  
  const items = [
    { title: "Home", url: "#", icon: HouseIcon },
    { title: "Inbox", url: "#", icon: InboxIcon },
    { title: "Calendar", url: "#", icon: CalendarIcon },
    { title: "Search", url: "#", icon: SearchIcon },
    { title: "Settings", url: "#", icon: SettingsIcon },
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

Provides sidebar context. Wrap application in this component.

**Props:**
- `open: boolean` - Open state (bindable)
- `onOpenChange: (open: boolean) => void` - Callback on state change

**Width Configuration:**

Default constants in `src/lib/components/ui/sidebar/constants.ts`:
```ts
export const SIDEBAR_WIDTH = "16rem";
export const SIDEBAR_WIDTH_MOBILE = "18rem";
```

For multiple sidebars, use CSS variables:
```svelte
<Sidebar.Provider style="--sidebar-width: 20rem; --sidebar-width-mobile: 20rem;">
  <Sidebar.Root />
</Sidebar.Provider>
```

**Keyboard Shortcut:**

Default: `cmd+b` (Mac) / `ctrl+b` (Windows). Change in constants:
```ts
export const SIDEBAR_KEYBOARD_SHORTCUT = "b";
```

### Sidebar.Root

Main sidebar component.

**Props:**
- `side: "left" | "right"` - Sidebar position
- `variant: "sidebar" | "floating" | "inset"` - Visual variant
- `collapsible: "offcanvas" | "icon" | "none"` - Collapse behavior

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

Access sidebar context (cannot be destructured):
```svelte
<script lang="ts">
  import { useSidebar } from "$lib/components/ui/sidebar/index.js";
  const sidebar = useSidebar();
  sidebar.state;        // "expanded" | "collapsed"
  sidebar.open;         // boolean
  sidebar.setOpen(bool);
  sidebar.openMobile;   // boolean
  sidebar.setOpenMobile(bool);
  sidebar.isMobile;     // boolean
  sidebar.toggle();     // toggle desktop and mobile
</script>
```

### Sidebar.Header & Sidebar.Footer

Sticky header/footer components. Example with dropdown menu:

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
          <DropdownMenu.Item><span>Acme Corp.</span></DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Sidebar.MenuItem>
  </Sidebar.Menu>
</Sidebar.Header>
```

### Sidebar.Content

Scrollable content wrapper. Contains `Sidebar.Group` components.

```svelte
<Sidebar.Root>
  <Sidebar.Content>
    <Sidebar.Group />
    <Sidebar.Group />
  </Sidebar.Content>
</Sidebar.Root>
```

### Sidebar.Group

Section within sidebar with label, content, and optional action.

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

### Sidebar.Menu Components

**Sidebar.MenuButton:**

Renders button/link in menu. Use `child` snippet for custom elements:
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

Props: `isActive: boolean` - Mark as active

**Sidebar.MenuAction:**

Independent button in menu item. Works with `DropdownMenu`:
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
      <DropdownMenu.Item><span>Edit Project</span></DropdownMenu.Item>
      <DropdownMenu.Item><span>Delete Project</span></DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
</Sidebar.MenuItem>
```

**Sidebar.MenuSub:**

Submenu within menu:
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

Badge in menu item:
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

Separator line:
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

### Styling

**Hide element in icon mode:**
```svelte
<Sidebar.Root collapsible="icon">
  <Sidebar.Content>
    <Sidebar.Group class="group-data-[collapsible=icon]:hidden" />
  </Sidebar.Content>
</Sidebar.Root>
```

**Style action based on button active state:**
```svelte
<Sidebar.MenuItem>
  <Sidebar.MenuButton />
  <Sidebar.MenuAction class="peer-data-[active=true]/menu-button:opacity-100" />
</Sidebar.MenuItem>
```

### Theming

CSS variables (light/dark):
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

Sidebar uses separate variables from main app to allow different styling (e.g., darker sidebar).

### skeleton
Skeleton loader component; customize dimensions and shape via Tailwind classes

## Skeleton

Placeholder component for displaying loading states.

### Installation

```bash
npx shadcn-svelte@latest add skeleton -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Usage

```svelte
<script lang="ts">
  import { Skeleton } from "$lib/components/ui/skeleton/index.js";
</script>

<!-- Circular skeleton (e.g., avatar) -->
<Skeleton class="size-12 rounded-full" />

<!-- Text skeleton placeholders -->
<Skeleton class="h-4 w-[250px]" />
<Skeleton class="h-4 w-[200px]" />

<!-- Custom dimensions -->
<Skeleton class="h-[20px] w-[100px] rounded-full" />
```

Use the `class` prop to customize dimensions and styling with Tailwind utilities.

### slider
Range input with single/multiple thumbs, configurable max/step/orientation

## Slider

An input component where users select a value from a given range.

### Installation

```bash
npx shadcn-svelte@latest add slider -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Usage

Single value slider:
```svelte
<script lang="ts">
  import { Slider } from "$lib/components/ui/slider/index.js";
  let value = $state(33);
</script>
<Slider type="single" bind:value max={100} step={1} />
```

Multiple thumbs (range slider):
```svelte
<script lang="ts">
  import { Slider } from "$lib/components/ui/slider/index.js";
  let value = $state([25, 75]);
</script>
<Slider type="multiple" bind:value max={100} step={1} />
```

Vertical orientation:
```svelte
<script lang="ts">
  import { Slider } from "$lib/components/ui/slider/index.js";
  let value = $state(50);
</script>
<Slider type="vertical" orientation="vertical" bind:value max={100} step={1} />
```

### Props

- `type`: "single" or "multiple" - determines if one or multiple values can be selected
- `bind:value`: reactive binding to the selected value(s)
- `max`: maximum value of the range
- `step`: increment between selectable values
- `orientation`: "vertical" for vertical layout (default is horizontal)
- `class`: CSS classes for styling

### sonner
Svelte toast component; install via CLI, add Toaster to layout, call toast() with message and optional description/action callback.

## Sonner

Toast component for Svelte, ported from the React Sonner library by Emil Kowalski.

### Installation

Install via CLI:
```bash
npx shadcn-svelte@latest add sonner -y -o
```
(-y: skip confirmation, -o: overwrite existing files)

Add the Toaster component to your root layout:
```svelte
<script lang="ts">
  import { Toaster } from "$lib/components/ui/sonner/index.js";
  let { children } = $props();
</script>
<Toaster />
{@render children?.()}
```

### Theme Support

By default, Sonner uses system preferences for light/dark theme. To customize, pass a `theme` prop to the Toaster component, or use mode-watcher to hardcode a theme. See Dark Mode documentation for setup details.

To opt out of Dark Mode support, uninstall mode-watcher and remove the `theme` prop from the component.

### Usage

Import `toast` from "svelte-sonner" and call it with a message:
```svelte
<script lang="ts">
  import { toast } from "svelte-sonner";
  import { Button } from "$lib/components/ui/button/index.js";
</script>
<Button onclick={() => toast("Hello world")}>Show toast</Button>
```

Toast types and options:
```svelte
toast.success("Event has been created", {
  description: "Sunday, December 03, 2023 at 9:00 AM",
  action: {
    label: "Undo",
    onClick: () => console.info("Undo")
  }
})
```

Supports `toast.success()`, `toast.error()`, and other variants. Options include `description` for additional text and `action` object with `label` and `onClick` callback.

### spinner
Loading indicator component; install with `add spinner -y -o`; customize size/color with utility classes; works in buttons, badges, input groups, items, empty states; replace icon by editing component.

## Spinner

A loading state indicator component.

### Installation

```bash
npx shadcn-svelte@latest add spinner -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Usage

```svelte
<script lang="ts">
  import { Spinner } from "$lib/components/ui/spinner/index.js";
</script>
<Spinner />
```

### Customization

Replace the default spinner icon by editing the component. Example with a custom loader icon:

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

**Size**: Use `size-*` utility classes to adjust spinner size.
```svelte
<Spinner class="size-3" />
<Spinner class="size-4" />
<Spinner class="size-6" />
<Spinner class="size-8" />
```

**Color**: Use `text-*` utility classes to change color.
```svelte
<Spinner class="size-6 text-red-500" />
<Spinner class="size-6 text-green-500" />
<Spinner class="size-6 text-blue-500" />
```

**Button**: Add spinner to buttons to indicate loading state. The Button component handles spacing.
```svelte
<Button disabled size="sm">
  <Spinner />
  Loading...
</Button>
<Button variant="outline" disabled size="sm">
  <Spinner />
  Please wait
</Button>
```

**Badge**: Use spinner inside badges.
```svelte
<Badge>
  <Spinner />
  Syncing
</Badge>
<Badge variant="secondary">
  <Spinner />
  Updating
</Badge>
```

**Input Group**: Place spinners in `<InputGroup.Addon>`.
```svelte
<InputGroup.Root>
  <InputGroup.Input placeholder="Send a message..." disabled />
  <InputGroup.Addon align="inline-end">
    <Spinner />
  </InputGroup.Addon>
</InputGroup.Root>
<InputGroup.Root>
  <InputGroup.Textarea placeholder="Send a message..." disabled />
  <InputGroup.Addon align="block-end">
    <Spinner /> Validating...
    <InputGroup.Button class="ml-auto" variant="default">
      <ArrowUpIcon />
    </InputGroup.Button>
  </InputGroup.Addon>
</InputGroup.Root>
```

**Empty State**: Use in empty state components.
```svelte
<Empty.Root class="w-full">
  <Empty.Header>
    <Empty.Media variant="icon">
      <Spinner />
    </Empty.Media>
    <Empty.Title>Processing your request</Empty.Title>
    <Empty.Description>
      Please wait while we process your request. Do not refresh the page.
    </Empty.Description>
  </Empty.Header>
  <Empty.Content>
    <Button variant="outline" size="sm">Cancel</Button>
  </Empty.Content>
</Empty.Root>
```

**Item**: Use in `<Item.Media>` to show loading state.
```svelte
<Item.Root variant="outline">
  <Item.Media variant="icon">
    <Spinner />
  </Item.Media>
  <Item.Content>
    <Item.Title>Downloading...</Item.Title>
    <Item.Description>129 MB / 1000 MB</Item.Description>
  </Item.Content>
  <Item.Actions class="hidden sm:flex">
    <Button variant="outline" size="sm">Cancel</Button>
  </Item.Actions>
  <Item.Footer>
    <Progress value={75} />
  </Item.Footer>
</Item.Root>
```

**Item with Payment**: Example combining Item, Spinner, and text.
```svelte
<Item.Root variant="muted">
  <Item.Media>
    <Spinner />
  </Item.Media>
  <Item.Content>
    <Item.Title class="line-clamp-1">Processing payment...</Item.Title>
  </Item.Content>
  <Item.Content class="flex-none justify-end">
    <span class="text-sm tabular-nums">$100.00</span>
  </Item.Content>
</Item.Root>
```

### switch
Toggle switch component; install via CLI; bind to checked property; supports disabled/aria-readonly states; integrates with form libraries.

## Switch

A toggle control for checked/unchecked states.

### Installation

```bash
npx shadcn-svelte@latest add switch -y -o
```

Flags: `-y` skips confirmation prompt, `-o` overwrites existing files.

### Basic Usage

```svelte
<script lang="ts">
  import { Label } from "$lib/components/ui/label/index.js";
  import { Switch } from "$lib/components/ui/switch/index.js";
</script>

<div class="flex items-center space-x-2">
  <Switch id="airplane-mode" />
  <Label for="airplane-mode">Airplane Mode</Label>
</div>
```

### Form Integration

Use with sveltekit-superforms and zod validation:

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
        toast.success(`Submitted: ${JSON.stringify(f.data, null, 2)}`);
      } else {
        toast.error("Please fix errors.");
      }
    }
  });
  const { form: formData, enhance } = form;
</script>

<form method="POST" class="w-full space-y-6" use:enhance>
  <fieldset>
    <legend class="mb-4 text-lg font-medium">Email Notifications</legend>
    <div class="space-y-4">
      <Form.Field {form} name="marketing_emails" class="flex flex-row items-center justify-between rounded-lg border p-4">
        <Form.Control>
          {#snippet children({ props })}
            <div class="space-y-0.5">
              <Form.Label>Marketing emails</Form.Label>
              <Form.Description>Receive emails about new products, features, and more.</Form.Description>
            </div>
            <Switch {...props} bind:checked={$formData.marketing_emails} />
          {/snippet}
        </Form.Control>
      </Form.Field>
      
      <Form.Field {form} name="security_emails" class="flex flex-row items-center justify-between rounded-lg border p-4">
        <Form.Control>
          {#snippet children({ props })}
            <div class="space-y-0.5">
              <Form.Label>Security emails</Form.Label>
              <Form.Description>Receive emails about your account security.</Form.Description>
            </div>
            <Switch {...props} aria-readonly disabled bind:checked={$formData.security_emails} />
          {/snippet}
        </Form.Control>
      </Form.Field>
    </div>
  </fieldset>
  <Form.Button>Submit</Form.Button>
</form>
```

Supports `disabled` and `aria-readonly` attributes. Bind to `checked` property for reactive state.

### table
Responsive table component with Root, Caption, Header, Body, Footer, Row, Head, Cell elements; supports colspan and custom styling via classes.

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

Basic table structure with header, body, and footer:
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

Components available:
- `Table.Root` - wrapper element
- `Table.Caption` - table caption
- `Table.Header` - header section
- `Table.Body` - body section
- `Table.Footer` - footer section
- `Table.Row` - table row
- `Table.Head` - header cell
- `Table.Cell` - data cell (supports `colspan` attribute and custom classes for styling)

### tabs
Tabbed interface component with Root, List, Trigger, and Content sub-components; install with `npx shadcn-svelte@latest add tabs -y -o`.

## Tabs Component

A tabbed interface component that displays multiple sections of content (tab panels) with only one visible at a time.

### Installation

```bash
npx shadcn-svelte@latest add tabs -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Basic Usage

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
  <Tabs.Content value="password">
    Change your password here.
  </Tabs.Content>
</Tabs.Root>
```

### Component Structure

- `Tabs.Root`: Container component that accepts a `value` prop for the active tab
- `Tabs.List`: Wrapper for tab triggers
- `Tabs.Trigger`: Individual tab button with a `value` prop that must match a corresponding `Tabs.Content`
- `Tabs.Content`: Content panel that displays when its `value` matches the active tab

### Example with Card Integration

```svelte
<Tabs.Root value="account">
  <Tabs.List>
    <Tabs.Trigger value="account">Account</Tabs.Trigger>
    <Tabs.Trigger value="password">Password</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="account">
    <Card.Root>
      <Card.Header>
        <Card.Title>Account</Card.Title>
        <Card.Description>Make changes to your account here.</Card.Description>
      </Card.Header>
      <Card.Content class="grid gap-6">
        <div class="grid gap-3">
          <Label for="name">Name</Label>
          <Input id="name" value="Pedro Duarte" />
        </div>
        <div class="grid gap-3">
          <Label for="username">Username</Label>
          <Input id="username" value="@peduarte" />
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
        <Card.Description>Change your password here.</Card.Description>
      </Card.Header>
      <Card.Content class="grid gap-6">
        <div class="grid gap-3">
          <Label for="current">Current password</Label>
          <Input id="current" type="password" />
        </div>
        <div class="grid gap-3">
          <Label for="new">New password</Label>
          <Input id="new" type="password" />
        </div>
      </Card.Content>
      <Card.Footer>
        <Button>Save password</Button>
      </Card.Footer>
    </Card.Root>
  </Tabs.Content>
</Tabs.Root>
```

Built on Bits UI tabs component. See Bits UI documentation for full API reference.

### textarea
Textarea component for form text input; supports disabled state, labels, validation with zod/superforms, and integration with form components.

## Textarea

A form textarea component for text input.

### Installation

```bash
npx shadcn-svelte@latest add textarea -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Usage

```svelte
import { Textarea } from "$lib/components/ui/textarea/index.js";

<Textarea placeholder="Type your message here." />
```

### Examples

**Default & Disabled:**
```svelte
<Textarea placeholder="Type your message here." />
<Textarea disabled placeholder="Type your message here." />
```

**With Label:**
```svelte
import { Label } from "$lib/components/ui/label/index.js";

<div class="grid w-full gap-1.5">
  <Label for="message">Your message</Label>
  <Textarea placeholder="Type your message here." id="message" />
</div>
```

**With Label, Text, and Button:**
```svelte
import { Button } from "$lib/components/ui/button/index.js";

<div class="grid w-full gap-1.5">
  <Label for="message">Your Message</Label>
  <Textarea placeholder="Type your message here." id="message" />
  <p class="text-muted-foreground text-sm">Your message will be copied to the support team.</p>
</div>

<div class="grid w-full gap-2">
  <Textarea placeholder="Type your message here." />
  <Button>Send message</Button>
</div>
```

**Form with Validation:**
```svelte
<script lang="ts" module>
  import { z } from "zod/v4";
  const formSchema = z.object({
    bio: z.string().min(10, "Bio must be at least 10 characters.").max(160, "Bio must be at most 160 characters.")
  });
</script>

import { defaults, superForm } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import { toast } from "svelte-sonner";
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
        <Form.Description>You can <span>@mention</span> other users and organizations.</Form.Description>
      {/snippet}
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Button>Submit</Form.Button>
</form>
```

### toggle-group
Toggle group component with single/multiple selection modes, size variants (sm/lg), outline styling, and disabled state support.

## Toggle Group

A set of two-state buttons that can be toggled on or off. Built on Bits UI.

### Installation

```bash
npx shadcn-svelte@latest add toggle-group -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

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

### Examples

**Default/Multiple with icons:**
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
  <!-- ... more items ... -->
</ToggleGroup.Root>
```

**Size variants:**
```svelte
<!-- Small -->
<ToggleGroup.Root size="sm" type="multiple">
  <!-- items -->
</ToggleGroup.Root>

<!-- Large -->
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

### Props

- `type`: "single" (only one item can be selected) or "multiple" (multiple items can be selected)
- `variant`: "outline" (and others available)
- `size`: "sm", default, "lg"
- `disabled`: boolean to disable all items

### toggle
Two-state button component with variants (default/outline), sizes (sm/default/lg), disabled state, and icon/text support

## Toggle

A two-state button component that can be toggled on or off.

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

**Variants and sizes:**
```svelte
<!-- Outline variant -->
<Toggle variant="outline" aria-label="Toggle italic">
  <ItalicIcon class="size-4" />
</Toggle>

<!-- With text -->
<Toggle aria-label="Toggle italic">
  <ItalicIcon class="mr-2 size-4" />
  Italic
</Toggle>

<!-- Size small -->
<Toggle size="sm" aria-label="Toggle italic">
  <ItalicIcon class="size-4" />
</Toggle>

<!-- Size large -->
<Toggle size="lg" aria-label="Toggle italic">
  <ItalicIcon class="size-4" />
</Toggle>

<!-- Disabled -->
<Toggle aria-label="Toggle underline" disabled>
  <UnderlineIcon class="size-4" />
</Toggle>
```

### Props

- `variant`: "default" | "outline" (default: "default")
- `size`: "sm" | "default" | "lg" (default: "default")
- `disabled`: boolean (default: false)
- `aria-label`: string (recommended for accessibility)

### tooltip
Tooltip component: popup on hover/focus with Provider/Root/Trigger/Content structure

## Tooltip

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
  import { buttonVariants } from "../ui/button/index.js";
</script>

<Tooltip.Provider>
  <Tooltip.Root>
    <Tooltip.Trigger class={buttonVariants({ variant: "outline" })}>
      Hover
    </Tooltip.Trigger>
    <Tooltip.Content>
      <p>Add to library</p>
    </Tooltip.Content>
  </Tooltip.Root>
</Tooltip.Provider>
```

Wrap content in `Tooltip.Provider`, then use `Tooltip.Root` with `Tooltip.Trigger` (the element that activates the tooltip) and `Tooltip.Content` (the popup content). The trigger can accept any styling classes.

### typography
Typography styling examples using Tailwind utility classes for headings (h1-h4), paragraphs, blockquotes, code, lists, and tables with no default styles provided.

## Typography

No default typography styles are shipped. Use utility classes to style text elements.

### Heading Styles

**h1** - Large primary heading:
```svelte
<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
  Title
</h1>
```

**h2** - Secondary heading with bottom border:
```svelte
<h2 class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
  Subtitle
</h2>
```

**h3** - Tertiary heading:
```svelte
<h3 class="scroll-m-20 text-2xl font-semibold tracking-tight">Heading</h3>
```

**h4** - Quaternary heading:
```svelte
<h4 class="scroll-m-20 text-xl font-semibold tracking-tight">Small heading</h4>
```

### Paragraph & Text

**p** - Standard paragraph with margin between siblings:
```svelte
<p class="leading-7 [&:not(:first-child)]:mt-6">Text content</p>
```

**Lead** - Emphasized introductory text:
```svelte
<p class="text-muted-foreground text-xl">Important intro text</p>
```

**Large** - Large bold text:
```svelte
<div class="text-lg font-semibold">Large text</div>
```

**Small** - Small text for labels:
```svelte
<small class="text-sm font-medium leading-none">Label</small>
```

**Muted** - Subtle secondary text:
```svelte
<p class="text-muted-foreground text-sm">Secondary text</p>
```

### Other Elements

**blockquote** - Quoted text with left border:
```svelte
<blockquote class="mt-6 border-l-2 pl-6 italic">
  "Quote text"
</blockquote>
```

**Inline code** - Code snippets within text:
```svelte
<code class="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
  code
</code>
```

**list** - Unordered list with disc bullets:
```svelte
<ul class="my-6 ml-6 list-disc [&>li]:mt-2">
  <li>Item 1</li>
  <li>Item 2</li>
</ul>
```

**table** - Responsive table with borders:
```svelte
<div class="my-6 w-full overflow-y-auto">
  <table class="w-full">
    <thead>
      <tr class="even:bg-muted m-0 border-t p-0">
        <th class="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
          Header
        </th>
      </tr>
    </thead>
    <tbody>
      <tr class="even:bg-muted m-0 border-t p-0">
        <td class="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
          Cell
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

