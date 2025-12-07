

## Pages

### accordion
Collapsible sections component supporting single/multiple open items, keyboard navigation, smooth transitions, and browser search within collapsed content.

## Accordion Component

Organizes content into collapsible sections. Supports single or multiple open items simultaneously.

### Structure
- `Accordion.Root`: Container managing overall state
- `Accordion.Item`: Individual collapsible section
- `Accordion.Header`: Contains visible heading
- `Accordion.Trigger`: Clickable element toggling visibility
- `Accordion.Content`: Collapsible body content

### Basic Usage
```svelte
<script lang="ts">
  import { Accordion } from "bits-ui";
</script>
<Accordion.Root type="single">
  <Accordion.Item value="item-1">
    <Accordion.Header>
      <Accordion.Trigger>Item 1 Title</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content>Collapsible content</Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-2">
    <Accordion.Header>
      <Accordion.Trigger>Item 2 Title</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content>Collapsible content</Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
```

### Key Features
- **Single or Multiple Mode**: `type="single"` allows one open section; `type="multiple"` allows multiple
- **Accessible**: Built-in ARIA attributes and keyboard navigation
- **Smooth Transitions**: CSS variables or Svelte transitions support
- **Flexible State**: Uncontrolled defaults or full control with bound values
- **Disabled Items**: Set `disabled` prop on items
- **Hidden Until Found**: `hiddenUntilFound` prop enables browser search within collapsed content
- **Horizontal Orientation**: `orientation="horizontal"` for horizontal layouts

### State Management

Two-way binding:
```svelte
<script lang="ts">
  let myValue = $state<string[]>([]);
</script>
<Accordion.Root type="multiple" bind:value={myValue}>
  <!-- items -->
</Accordion.Root>
```

Fully controlled with function binding:
```svelte
<script lang="ts">
  let myValue = $state("");
  function getValue() { return myValue; }
  function setValue(newValue: string) { myValue = newValue; }
</script>
<Accordion.Root type="single" bind:value={getValue, setValue}>
  <!-- items -->
</Accordion.Root>
```

### Reusable Components

Item wrapper combining Item, Header, Trigger, and Content:
```svelte
<script lang="ts">
  import { Accordion, type WithoutChildrenOrChild } from "bits-ui";
  type Props = WithoutChildrenOrChild<Accordion.ItemProps> & {
    title: string;
    content: string;
  };
  let { title, content, ...restProps }: Props = $props();
</script>
<Accordion.Item {...restProps}>
  <Accordion.Header>
    <Accordion.Trigger>{title}</Accordion.Trigger>
  </Accordion.Header>
  <Accordion.Content>{content}</Accordion.Content>
</Accordion.Item>
```

Root wrapper rendering multiple items:
```svelte
<script lang="ts">
  import { Accordion, type WithoutChildrenOrChild } from "bits-ui";
  import MyAccordionItem from "$lib/components/MyAccordionItem.svelte";
  type Item = { value?: string; title: string; content: string; disabled?: boolean; };
  let { value = $bindable(), ref = $bindable(null), items, ...restProps }: WithoutChildrenOrChild<Accordion.RootProps> & { items: Item[]; } = $props();
</script>
<Accordion.Root bind:value bind:ref {...restProps as any}>
  {#each items as item, i (item.title + i)}
    <MyAccordionItem {...item} />
  {/each}
</Accordion.Root>
```

Usage:
```svelte
<script lang="ts">
  import MyAccordion from "$lib/components/MyAccordion.svelte";
  const items = [
    { title: "Item 1", content: "Content 1" },
    { title: "Item 2", content: "Content 2" },
  ];
</script>
<MyAccordion type="single" {items} />
```

### Svelte Transitions

Using `forceMount` and `child` snippet:
```svelte
<script lang="ts">
  import { Accordion } from "bits-ui";
  import { slide } from "svelte/transition";
</script>
<Accordion.Content forceMount={true}>
  {#snippet child({ props, open })}
    {#if open}
      <div {...props} transition:slide={{ duration: 1000 }}>
        Content with transition
      </div>
    {/if}
  {/snippet}
</Accordion.Content>
```

Reusable transition wrapper:
```svelte
<script lang="ts">
  import { Accordion, type WithoutChildrenOrChild } from "bits-ui";
  import type { Snippet } from "svelte";
  import { fade } from "svelte/transition";
  let { ref = $bindable(null), duration = 200, children, ...restProps }: WithoutChildrenOrChild<Accordion.ContentProps> & { duration?: number; children: Snippet; } = $props();
</script>
<Accordion.Content forceMount bind:ref {...restProps}>
  {#snippet child({ props, open })}
    {#if open}
      <div {...props} transition:fade={{ duration }}>
        {@render children?.()}
      </div>
    {/if}
  {/snippet}
</Accordion.Content>
```

### Examples

**Horizontal Cards** with image backgrounds and descriptions:
```svelte
<script lang="ts">
  import { Accordion } from "bits-ui";
  let value = $state("item-1");
  const items = [
    { id: "item-1", title: "Mountain Range", image: "...", description: "..." },
    { id: "item-2", title: "Ocean Views", image: "...", description: "..." },
    { id: "item-3", title: "Forest Retreats", image: "...", description: "..." }
  ];
</script>
<Accordion.Root type="single" orientation="horizontal" class="flex h-[400px] w-full gap-2" bind:value>
  {#each items as item (item.id)}
    <Accordion.Item value={item.id} class="relative cursor-pointer overflow-hidden rounded-lg transition-all duration-500 data-[state=closed]:w-[20%] data-[state=open]:w-[100%]" onclick={() => (value = item.id)}>
      <img src={item.image} alt={item.title} class="h-[400px] w-full object-cover" />
      <div class="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent p-4">
        <Accordion.Header>
          <Accordion.Trigger class="text-left font-bold text-white data-[state=open]:mb-2 data-[state=closed]:text-sm data-[state=open]:text-base">
            {item.title}
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content forceMount class="max-h-0 overflow-hidden text-white/90 transition-all data-[state=open]:max-h-[100px]">
          {item.description}
        </Accordion.Content>
      </div>
    </Accordion.Item>
  {/each}
</Accordion.Root>
```

**Checkout Steps** with multi-step form:
```svelte
<script lang="ts">
  import { Accordion, Button } from "bits-ui";
  let activeStep = $state("");
  let completedSteps = new SvelteSet<string>();
</script>
<Accordion.Root bind:value={activeStep} type="single">
  <Accordion.Item value="1">
    <Accordion.Header>
      <Accordion.Trigger>Shipping Information</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content>
      <div class="flex flex-col gap-4 pb-6">
        <input placeholder="First Name" />
        <input placeholder="Last Name" />
        <input placeholder="Address" />
        <Button.Root onclick={() => { completedSteps.add("1"); activeStep = "2"; }}>
          Continue to Payment
        </Button.Root>
      </div>
    </Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="2">
    <Accordion.Header>
      <Accordion.Trigger>Payment Method</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content>
      <div class="flex flex-col gap-4 pb-6">
        <input placeholder="Card Number" />
        <input placeholder="Exp. Month" />
        <input placeholder="Exp. Year" />
        <input placeholder="CVC" />
        <Button.Root onclick={() => { completedSteps.add("2"); activeStep = "3"; }}>
          Continue to Review
        </Button.Root>
      </div>
    </Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="3">
    <Accordion.Header>
      <Accordion.Trigger>Review Order</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content>
      <div class="rounded-lg border p-4">
        <h4 class="mb-2 font-medium">Order Summary</h4>
        <div class="flex justify-between">Product 1: $29.99</div>
        <div class="flex justify-between">Product 2: $49.99</div>
        <div class="flex justify-between">Shipping: $4.99</div>
        <div class="mt-2 flex justify-between border-t pt-2 font-medium">Total: $84.97</div>
        <Button.Root onclick={() => { completedSteps.add("3"); activeStep = ""; }}>
          Place Order
        </Button.Root>
      </div>
    </Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
```

### API Reference

**Accordion.Root**
- `type` (required): 'single' | 'multiple'
- `value` ($bindable): string[] | string - currently active item(s)
- `onValueChange`: callback when value changes
- `disabled`: boolean (default: false)
- `loop`: boolean - loop through items (default: false)
- `orientation`: 'vertical' | 'horizontal' (default: 'vertical')
- `ref` ($bindable): HTMLDivElement
- `children`: Snippet
- `child`: Snippet with props

Data attributes: `data-orientation`, `data-disabled`, `data-accordion-root`

**Accordion.Item**
- `disabled`: boolean (default: false)
- `value`: string - unique identifier (auto-generated if not provided)
- `ref` ($bindable): HTMLDivElement
- `children`: Snippet
- `child`: Snippet with props

Data attributes: `data-state` ('open' | 'closed'), `data-disabled`, `data-orientation`, `data-accordion-item`

**Accordion.Header**
- `level`: 1 | 2 | 3 | 4 | 5 | 6 - heading level (default: 3)
- `ref` ($bindable): HTMLDivElement
- `children`: Snippet
- `child`: Snippet with props

Data attributes: `data-orientation`, `data-disabled`, `data-heading-level`, `data-accordion-header`

**Accordion.Trigger**
- `ref` ($bindable): HTMLButtonElement
- `children`: Snippet
- `child`: Snippet with props

Data attributes: `data-orientation`, `data-disabled`, `data-accordion-trigger`

**Accordion.Content**
- `forceMount`: boolean - always mount in DOM (default: false)
- `hiddenUntilFound`: boolean - use `hidden="until-found"` for browser search (default: false)
- `ref` ($bindable): HTMLDivElement
- `children`: Snippet
- `child`: Snippet with props and `open` state

Data attributes: `data-orientation`, `data-disabled`, `data-accordion-content`
CSS variables: `--bits-accordion-content-height`, `--bits-accordion-content-width`

### alert-dialog
Modal dialog component with compound sub-components; supports state binding, focus management, scroll locking, escape/outside interaction customization, and nested dialogs with depth tracking.

## Alert Dialog

Modal window for presenting content or seeking user input without navigation. Built from compound sub-components.

### Structure
- **Root**: Manages state and context
- **Trigger**: Opens/closes dialog
- **Portal**: Renders outside DOM hierarchy
- **Overlay**: Backdrop behind dialog
- **Content**: Main dialog content
- **Title**: Dialog title
- **Description**: Additional context
- **Cancel**: Closes without action
- **Action**: Confirms action

### Basic Usage
```svelte
<script lang="ts">
  import { AlertDialog } from "bits-ui";
</script>
<AlertDialog.Root>
  <AlertDialog.Trigger>Open Dialog</AlertDialog.Trigger>
  <AlertDialog.Portal>
    <AlertDialog.Overlay />
    <AlertDialog.Content>
      <AlertDialog.Title>Confirm Action</AlertDialog.Title>
      <AlertDialog.Description>Are you sure?</AlertDialog.Description>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action>Confirm</AlertDialog.Action>
    </AlertDialog.Content>
  </AlertDialog.Portal>
</AlertDialog.Root>
```

### Reusable Component Pattern
```svelte
<script lang="ts">
  import type { Snippet } from "svelte";
  import { AlertDialog, type WithoutChild } from "bits-ui";
  type Props = AlertDialog.RootProps & {
    buttonText: string;
    title: Snippet;
    description: Snippet;
    contentProps?: WithoutChild<AlertDialog.ContentProps>;
  };
  let { open = $bindable(false), children, buttonText, contentProps, title, description, ...restProps }: Props = $props();
</script>
<AlertDialog.Root bind:open {...restProps}>
  <AlertDialog.Trigger>{buttonText}</AlertDialog.Trigger>
  <AlertDialog.Portal>
    <AlertDialog.Overlay />
    <AlertDialog.Content {...contentProps}>
      <AlertDialog.Title>{@render title()}</AlertDialog.Title>
      <AlertDialog.Description>{@render description()}</AlertDialog.Description>
      {@render children?.()}
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action>Confirm</AlertDialog.Action>
    </AlertDialog.Content>
  </AlertDialog.Portal>
</AlertDialog.Root>
```

Usage:
```svelte
<MyAlertDialog buttonText="Open Dialog">
  {#snippet title()}Delete your account{/snippet}
  {#snippet description()}This action cannot be undone.{/snippet}
</MyAlertDialog>
```

### State Management

**Two-way binding:**
```svelte
<script lang="ts">
  let isOpen = $state(false);
</script>
<button onclick={() => (isOpen = true)}>Open Dialog</button>
<AlertDialog.Root bind:open={isOpen}><!-- ... --></AlertDialog.Root>
```

**Fully controlled (function binding):**
```svelte
<script lang="ts">
  let myOpen = $state(false);
  function getOpen() { return myOpen; }
  function setOpen(newOpen: boolean) { myOpen = newOpen; }
</script>
<AlertDialog.Root bind:open={getOpen, setOpen}><!-- ... --></AlertDialog.Root>
```

### Focus Management

**Focus trap** (enabled by default):
```svelte
<AlertDialog.Content trapFocus={false}><!-- ... --></AlertDialog.Content>
```

**Open auto-focus** (defaults to Content):
```svelte
<script lang="ts">
  let nameInput = $state<HTMLInputElement>();
</script>
<AlertDialog.Content onOpenAutoFocus={(e) => { e.preventDefault(); nameInput?.focus(); }}>
  <input type="text" bind:this={nameInput} />
</AlertDialog.Content>
```

**Close auto-focus** (defaults to trigger):
```svelte
<input type="text" bind:this={nameInput} />
<AlertDialog.Root>
  <AlertDialog.Trigger>Open</AlertDialog.Trigger>
  <AlertDialog.Content onCloseAutoFocus={(e) => { e.preventDefault(); nameInput?.focus(); }}>
    <!-- ... -->
  </AlertDialog.Content>
</AlertDialog.Root>
```

### Advanced Behaviors

**Scroll lock** (enabled by default):
```svelte
<AlertDialog.Content preventScroll={false}><!-- ... --></AlertDialog.Content>
```

**Escape key handling:**
- `escapeKeydownBehavior`: `'close'` (default), `'ignore'`, `'defer-otherwise-close'`, `'defer-otherwise-ignore'`
- `onEscapeKeydown`: Custom callback

```svelte
<AlertDialog.Content escapeKeydownBehavior="ignore"><!-- ... --></AlertDialog.Content>
<AlertDialog.Content onEscapeKeydown={(e) => { e.preventDefault(); /* custom logic */ }}><!-- ... --></AlertDialog.Content>
```

**Outside interaction handling:**
- `interactOutsideBehavior`: `'ignore'` (default), `'close'`, `'defer-otherwise-close'`, `'defer-otherwise-ignore'`
- `onInteractOutside`: Custom callback

```svelte
<AlertDialog.Content interactOutsideBehavior="close"><!-- ... --></AlertDialog.Content>
<AlertDialog.Content onInteractOutside={(e) => { e.preventDefault(); /* custom logic */ }}><!-- ... --></AlertDialog.Content>
```

### Nested Dialogs

Data attributes for styling:
- `data-nested-open`: Present when nested dialogs are open
- `data-nested`: Present on nested dialog itself

CSS variables:
- `--bits-dialog-depth`: Nesting depth (0 for root, 1 for first nested, etc.)
- `--bits-dialog-nested-count`: Number of open nested dialogs

```svelte
<AlertDialog.Content style="transform: scale(calc(1 - var(--dialog-nested-count) * 0.05));">
  <!-- Alert dialog content -->
</AlertDialog.Content>
```

### Form Submission

```svelte
<script lang="ts">
  function wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  let open = $state(false);
</script>
<AlertDialog.Root bind:open>
  <AlertDialog.Portal>
    <AlertDialog.Overlay />
    <AlertDialog.Content>
      <AlertDialog.Title>Confirm your action</AlertDialog.Title>
      <AlertDialog.Description>Are you sure?</AlertDialog.Description>
      <form method="POST" action="?/someAction" onsubmit={() => { wait(1000).then(() => (open = false)); }}>
        <AlertDialog.Cancel type="button">No, cancel</AlertDialog.Cancel>
        <AlertDialog.Action type="submit">Yes, submit</AlertDialog.Action>
      </form>
    </AlertDialog.Content>
  </AlertDialog.Portal>
</AlertDialog.Root>
```

**Note:** If using AlertDialog within a form, disable Portal to keep content inside form element.

### Key Features
- Compound component structure for flexibility
- ARIA-compliant with keyboard navigation
- Portal support for proper stacking
- Managed focus with customization
- Controlled and uncontrolled state support
- Scroll locking, escape key handling, outside interaction customization
- Nested dialog support with depth tracking

### API Reference

**AlertDialog.Root**
- `open` ($bindable): boolean, default false
- `onOpenChange`: (open: boolean) => void
- `onOpenChangeComplete`: (open: boolean) => void
- `children`: Snippet

**AlertDialog.Trigger**
- `ref` ($bindable): HTMLButtonElement
- `children`: Snippet
- `child`: Snippet with props
- Data: `data-state` ('open'|'closed'), `data-alert-dialog-trigger`

**AlertDialog.Content**
- `onInteractOutside`: (event: PointerEvent) => void
- `onFocusOutside`: (event: FocusEvent) => void
- `interactOutsideBehavior`: 'close'|'ignore'|'defer-otherwise-close'|'defer-otherwise-ignore', default 'close'
- `onEscapeKeydown`: (event: KeyboardEvent) => void
- `escapeKeydownBehavior`: 'close'|'ignore'|'defer-otherwise-close'|'defer-otherwise-ignore', default 'close'
- `onOpenAutoFocus`: (event: Event) => void
- `onCloseAutoFocus`: (event: Event) => void
- `trapFocus`: boolean, default true
- `forceMount`: boolean, default false
- `preventOverflowTextSelection`: boolean, default true
- `preventScroll`: boolean, default true
- `restoreScrollDelay`: number, default 0
- `ref` ($bindable): HTMLDivElement
- `children`: Snippet
- `child`: Snippet with props and open state
- Data: `data-state`, `data-alert-dialog-content`, `data-nested-open`, `data-nested`
- CSS: `--bits-dialog-depth`, `--bits-dialog-nested-count`

**AlertDialog.Overlay**
- `forceMount`: boolean, default false
- `ref` ($bindable): HTMLDivElement
- `children`: Snippet
- `child`: Snippet with props and open state
- Data: `data-state`, `data-alert-dialog-overlay`, `data-nested-open`, `data-nested`
- CSS: `--bits-dialog-depth`, `--bits-dialog-nested-count`

**AlertDialog.Portal**
- `to`: Element|string, default document.body
- `disabled`: boolean, default false
- `children`: Snippet

**AlertDialog.Action**
- `ref` ($bindable): HTMLButtonElement
- `children`: Snippet
- `child`: Snippet with props
- Data: `data-alert-dialog-action`
- Note: Does not close dialog by default

**AlertDialog.Cancel**
- `ref` ($bindable): HTMLButtonElement
- `children`: Snippet
- `child`: Snippet with props
- Data: `data-alert-dialog-cancel`

**AlertDialog.Title**
- `level`: 1|2|3|4|5|6, default 3 (sets aria-level)
- `ref` ($bindable): HTMLDivElement
- `children`: Snippet
- `child`: Snippet with props
- Data: `data-alert-dialog-title`

**AlertDialog.Description**
- `ref` ($bindable): HTMLDivElement
- `children`: Snippet
- `child`: Snippet with props
- Data: `data-alert-dialog-description`


### aspect-ratio
AspectRatio.Root component with ratio prop (number, default 1), bindable ref, children/child snippets, data-aspect-ratio-root attribute.

## Aspect Ratio Component

Maintains a specified aspect ratio for content.

### Basic Usage
```svelte
import { AspectRatio } from "bits-ui";

<AspectRatio.Root ratio={14 / 9}>
  <img src="/abstract.png" alt="an abstract painting" />
</AspectRatio.Root>
```

### Architecture
- **Root**: Contains the aspect ratio logic

### Reusable Component Pattern
```svelte
// MyAspectRatio.svelte
import { AspectRatio, type WithoutChildrenOrChild } from "bits-ui";

let {
  src,
  alt,
  ref = $bindable(null),
  imageRef = $bindable(null),
  ...restProps
}: WithoutChildrenOrChild<AspectRatio.RootProps> & {
  src: string;
  alt: string;
  imageRef?: HTMLImageElement | null;
} = $props();

<AspectRatio.Root {...restProps} bind:ref>
  <img {src} {alt} bind:this={imageRef} />
</AspectRatio.Root>
```

Usage:
```svelte
<MyAspectRatio src="https://example.com/image.jpg" alt="painting" ratio={4 / 3} />
```

### API Reference

**AspectRatio.Root**

| Property | Type | Description |
|----------|------|-------------|
| `ratio` | `number` | The desired aspect ratio. Default: 1 |
| `ref` $bindable | `HTMLDivElement` | Reference to the underlying DOM element. Default: null |
| `children` | `Snippet` | The children content to render. Default: undefined |
| `child` | `Snippet` | Render delegation for custom elements. Default: undefined |

Data Attributes:
- `data-aspect-ratio-root`: Present on the root element

### avatar
Avatar component with Root/Image/Fallback primitives; handles image loading states, supports delayMs, loadingStatus binding, and fallback display on load failure.

## Avatar Component

Displays user/entity images with automatic loading state handling and fallback placeholders.

### Features
- Smart image loading detection
- Fallback system for unavailable/slow images
- Compound component structure (Root, Image, Fallback)
- Customizable loading behavior

### Architecture
Three-part compound component:
- **Avatar.Root**: Container managing image state and fallback display
- **Avatar.Image**: Displays the image
- **Avatar.Fallback**: Shows during loading or on failure

### Basic Usage
```svelte
<script lang="ts">
  import { Avatar } from "bits-ui";
</script>
<Avatar.Root>
  <Avatar.Image src="https://github.com/huntabyte.png" alt="Huntabyte's avatar" />
  <Avatar.Fallback>HB</Avatar.Fallback>
</Avatar.Root>
```

### Reusable Component Pattern
```svelte
<script lang="ts">
  import { Avatar, type WithoutChildrenOrChild } from "bits-ui";
  let {
    src,
    alt,
    fallback,
    ref = $bindable(null),
    imageRef = $bindable(null),
    fallbackRef = $bindable(null),
    ...restProps
  }: WithoutChildrenOrChild<Avatar.RootProps> & {
    src: string;
    alt: string;
    fallback: string;
    imageRef?: HTMLImageElement | null;
    fallbackRef?: HTMLElement | null;
  } = $props();
</script>
<Avatar.Root {...restProps} bind:ref>
  <Avatar.Image {src} {alt} bind:ref={imageRef} />
  <Avatar.Fallback bind:ref={fallbackRef}>{fallback}</Avatar.Fallback>
</Avatar.Root>
```

Usage:
```svelte
<script lang="ts">
  import UserAvatar from "$lib/components/UserAvatar.svelte";
  const users = [
    { handle: "huntabyte", initials: "HJ" },
    { handle: "pavelstianko", initials: "PS" },
    { handle: "adriangonz97", initials: "AG" },
  ];
</script>
{#each users as user}
  <UserAvatar
    src="https://github.com/{user.handle}.png"
    alt="{user.name}'s avatar"
    fallback={user.initials}
  />
{/each}
```

### Skip Loading Check
For guaranteed-available images (local assets), bypass the loading check:
```svelte
<Avatar.Root loadingStatus="loaded">
  <Avatar.Image src={localAvatar} alt="User avatar" />
  <Avatar.Fallback>HB</Avatar.Fallback>
</Avatar.Root>
```

### Clickable with Link Preview Example
```svelte
<script lang="ts">
  import { Avatar, LinkPreview } from "bits-ui";
  import CalendarBlank from "phosphor-svelte/lib/CalendarBlank";
  import MapPin from "phosphor-svelte/lib/MapPin";
</script>
<LinkPreview.Root>
  <LinkPreview.Trigger
    href="https://x.com/huntabyte"
    target="_blank"
    rel="noreferrer noopener"
    class="rounded-xs underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-black"
  >
    <Avatar.Root class="data-[status=loaded]:border-foreground bg-muted text-muted-foreground h-12 w-12 rounded-full border border-transparent text-[17px] font-medium uppercase">
      <div class="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-transparent">
        <Avatar.Image src="/avatar-1.png" alt="@huntabyte" />
        <Avatar.Fallback class="border-muted border">HB</Avatar.Fallback>
      </div>
    </Avatar.Root>
  </LinkPreview.Trigger>
  <LinkPreview.Content class="border-muted bg-background shadow-popover w-[331px] rounded-xl border p-[17px]" sideOffset={8}>
    <div class="flex space-x-4">
      <Avatar.Root class="data-[status=loaded]:border-foreground bg-muted text-muted-foreground h-12 w-12 rounded-full border border-transparent text-[17px] font-medium uppercase">
        <div class="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-transparent">
          <Avatar.Image src="/avatar-1.png" alt="@huntabyte" />
          <Avatar.Fallback class="border-muted border">HB</Avatar.Fallback>
        </div>
      </Avatar.Root>
      <div class="space-y-1 text-sm">
        <h4 class="font-medium">@huntabyte</h4>
        <p>I do things on the internet.</p>
        <div class="text-muted-foreground flex items-center gap-[21px] pt-2 text-xs">
          <div class="flex items-center text-xs">
            <MapPin class="mr-1 size-4" />
            <span> FL, USA </span>
          </div>
          <div class="flex items-center text-xs">
            <CalendarBlank class="mr-1 size-4" />
            <span> Joined May 2020</span>
          </div>
        </div>
      </div>
    </div>
  </LinkPreview.Content>
</LinkPreview.Root>
```

### API Reference

**Avatar.Root**
| Property | Type | Description |
|----------|------|-------------|
| `loadingStatus` $bindable | 'loading' \| 'loaded' \| 'error' | Image loading status; bindable to track outside component |
| `onLoadingStatusChange` | (status: LoadingStatus) => void | Callback when loading status changes |
| `delayMs` | number | Delay (ms) before showing image after load; prevents flickering (default: 0) |
| `ref` $bindable | HTMLDivElement | DOM element reference |
| `children` | Snippet | Content to render |
| `child` | Snippet | Render delegation snippet |

Data attributes: `data-status` ('loading' \| 'loaded' \| 'error'), `data-avatar-root`

**Avatar.Image**
| Property | Type | Description |
|----------|------|-------------|
| `ref` $bindable | HTMLImageElement | DOM element reference |
| `children` | Snippet | Content to render |
| `child` | Snippet | Render delegation snippet |

Data attributes: `data-status` ('loading' \| 'loaded' \| 'error'), `data-avatar-image`

**Avatar.Fallback**
| Property | Type | Description |
|----------|------|-------------|
| `ref` $bindable | HTMLSpanElement | DOM element reference |
| `children` | Snippet | Content to render |
| `child` | Snippet | Render delegation snippet |

Data attributes: `data-status` ('loading' \| 'loaded' \| 'error'), `data-avatar-fallback`

### button
Button/anchor hybrid component; renders as button by default, anchor when href provided; supports disabled state and DOM ref binding.

## Button Component

A flexible component that renders as either a `<button>` or `<a>` tag depending on whether the `href` prop is provided.

### Basic Usage

```svelte
<script lang="ts">
  import { Button } from "bits-ui";
</script>

<Button.Root>
  Unlimited
</Button.Root>
```

With href (renders as anchor):
```svelte
<Button.Root href="/path">Link Button</Button.Root>
```

### API Reference

**Button.Root Props:**
- `href` (string, optional): Converts button to anchor tag when provided. Default: undefined
- `disabled` (boolean): Disables interaction. Default: false
- `ref` (bindable HTMLButtonElement): Reference to underlying DOM element. Default: null
- `children` (Snippet): Content to render

**Data Attributes:**
- `data-button-root`: Present on the button element

### calendar
Date picker component with single/multiple selection, validation (min/max/disabled/unavailable dates), localization, customizable appearance (fixed weeks, multiple months, paged navigation), and month/year selectors; uses @internationalized/date for date handling.

## Calendar Component

A date picker component that displays dates and days of the week, facilitating date-related interactions. Uses `@internationalized/date` for date handling.

### Basic Structure
```svelte
<script lang="ts">
  import { Calendar } from "bits-ui";
  import { today, getLocalTimeZone } from "@internationalized/date";
  let value = $state(today(getLocalTimeZone()));
</script>

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
          <Calendar.GridRow>
            {#each weekdays as day}
              <Calendar.HeadCell>{day}</Calendar.HeadCell>
            {/each}
          </Calendar.GridRow>
        </Calendar.GridHead>
        <Calendar.GridBody>
          {#each month.weeks as weekDates}
            <Calendar.GridRow>
              {#each weekDates as date}
                <Calendar.Cell {date} month={month.value}>
                  <Calendar.Day />
                </Calendar.Cell>
              {/each}
            </Calendar.GridRow>
          {/each}
        </Calendar.GridBody>
      </Calendar.Grid>
    {/each}
  {/snippet}
</Calendar.Root>
```

### State Management

**Two-way binding:**
```svelte
<script lang="ts">
  import { CalendarDateTime } from "@internationalized/date";
  let myValue = $state(new CalendarDateTime(2024, 8, 3, 12, 30));
</script>
<Calendar.Root type="single" bind:value={myValue}>
```

**Fully controlled with function bindings:**
```svelte
<script lang="ts">
  let myValue = $state();
  function getValue() { return myValue; }
  function setValue(newValue) { myValue = newValue; }
</script>
<Calendar.Root type="single" bind:value={getValue, setValue}>
```

**Placeholder state** (determines initial month view, updates as user navigates):
```svelte
<script lang="ts">
  let myPlaceholder = $state(new CalendarDateTime(2024, 8, 3, 12, 30));
</script>
<Calendar.Root bind:placeholder={myPlaceholder}>
```

### Default Values & Parsing

```svelte
<script lang="ts">
  import { parseDate } from "@internationalized/date";
  const date = "2024-08-03"; // from database
  let value = $state(parseDate(date));
</script>
<Calendar.Root {value}>
```

### Validation

**Minimum/Maximum values:**
```svelte
<script lang="ts">
  import { today, getLocalTimeZone } from "@internationalized/date";
  const todayDate = today(getLocalTimeZone());
</script>
<Calendar.Root minValue={todayDate} value={yesterday}>
<Calendar.Root maxValue={todayDate} value={tomorrow}>
```

**Unavailable dates:**
```svelte
<script lang="ts">
  function isDateUnavailable(date) {
    return date.day === 1;
  }
</script>
<Calendar.Root {isDateUnavailable} value={tomorrow}>
```

**Disabled dates:**
```svelte
<script lang="ts">
  function isDateDisabled(date) {
    return date.day === 1;
  }
</script>
<Calendar.Root {isDateDisabled} value={tomorrow}>
```

**Max days for multiple selection:**
```svelte
<Calendar.Root type="multiple" maxDays={3}>
```

### Appearance & Behavior

**Fixed weeks** (always render 6 weeks):
```svelte
<Calendar.Root fixedWeeks>
```

**Multiple months:**
```svelte
<Calendar.Root numberOfMonths={2}>
```

**Paged navigation** (navigate by number of displayed months instead of 1):
```svelte
<Calendar.Root pagedNavigation>
```

**Localization:**
```svelte
<Calendar.Root locale="fr-FR">
```

**Week starts on** (0=Sunday, 6=Saturday):
```svelte
<Calendar.Root weekStartsOn={1}>
```

**Multiple selection:**
```svelte
<Calendar.Root type="multiple">
```

**Weekday format** ('narrow', 'short', 'long'):
```svelte
<Calendar.Root weekdayFormat="short">
```

### Custom Composition

**Month selector via placeholder:**
```svelte
<script lang="ts">
  import { CalendarDate } from "@internationalized/date";
  let placeholder = $state(new CalendarDate(2024, 8, 3));
</script>
<button onclick={() => { placeholder = placeholder.set({ month: 8 }); }}>
  Set month to August
</button>
<Calendar.Root bind:placeholder>
```

### Examples

**Month and Year Selects:**
```svelte
<Calendar.Root type="single" bind:value>
  {#snippet children({ months, weekdays })}
    <Calendar.Header class="flex items-center justify-between gap-3">
      <Calendar.MonthSelect aria-label="Select month" class="w-full" />
      <Calendar.YearSelect aria-label="Select year" />
    </Calendar.Header>
    <!-- grid rendering -->
  {/snippet}
</Calendar.Root>
```

**Preset Dates:**
```svelte
<script lang="ts">
  const currentDate = today(getLocalTimeZone());
  let value = $state(currentDate);
  const presets = [
    { label: "Today", onclick: () => { value = currentDate; } },
    { label: "Tomorrow", onclick: () => { value = currentDate.add({ days: 1 }); } },
    { label: "In 3 days", onclick: () => { value = currentDate.add({ days: 3 }); } },
    { label: "In a week", onclick: () => { value = currentDate.add({ days: 7 }); } },
    { label: "In a month", onclick: () => { value = currentDate.add({ months: 1 }); } },
    { label: "In a year", onclick: () => { value = currentDate.add({ years: 1 }); } }
  ];
</script>
<Calendar.Root type="single" bind:value>
  <!-- render calendar and preset buttons -->
</Calendar.Root>
```

### API Reference

**Calendar.Root** props:
- `type` (required): 'single' | 'multiple'
- `value` ($bindable): DateValue | DateValue[]
- `onValueChange`: callback when value changes
- `placeholder`: DateValue for initial month view
- `onPlaceholderChange`: callback when placeholder changes
- `pagedNavigation`: boolean (default: false)
- `preventDeselect`: boolean (default: false)
- `weekStartsOn`: 0-6 (default: locale-based)
- `weekdayFormat`: 'narrow' | 'short' | 'long' (default: 'narrow')
- `calendarLabel`: string
- `fixedWeeks`: boolean (default: false)
- `isDateDisabled`: (date: DateValue) => boolean
- `isDateUnavailable`: (date: DateValue) => boolean
- `maxValue`: DateValue
- `minValue`: DateValue
- `locale`: string (default: 'en')
- `numberOfMonths`: number (default: 1)
- `disabled`: boolean (default: false)
- `readonly`: boolean (default: false)
- `initialFocus`: boolean (default: false)
- `disableDaysOutsideMonth`: boolean (default: false)
- `maxDays`: number (for multiple type)
- `monthFormat`: 'short' | 'long' | 'narrow' | 'numeric' | '2-digit' | function (default: 'long')
- `yearFormat`: 'numeric' | '2-digit' | function (default: 'numeric')
- `ref` ($bindable): HTMLDivElement
- `children`: Snippet with { months: Month<DateValue>[], weekdays: string[] }

**Calendar.Root** data attributes:
- `data-invalid`: when calendar is invalid
- `data-disabled`: when calendar is disabled
- `data-readonly`: when calendar is readonly
- `data-calendar-root`: always present

**Other components:**
- `Calendar.Header`, `Calendar.Heading`, `Calendar.NextButton`, `Calendar.PrevButton`
- `Calendar.Grid`, `Calendar.GridHead`, `Calendar.GridBody`, `Calendar.GridRow`
- `Calendar.Cell`, `Calendar.Day`, `Calendar.HeadCell`
- `Calendar.MonthSelect`, `Calendar.YearSelect`

**Calendar.Cell** data attributes:
- `data-disabled`, `data-unavailable`, `data-today`, `data-outside-month`, `data-outside-visible-months`, `data-focused`, `data-selected`
- `data-value`: date in "YYYY-MM-DD" format
- `data-calendar-cell`: always present

**Calendar.Day** data attributes:
- Same as Calendar.Cell, with `data-calendar-day` instead of `data-calendar-cell`

### checkbox
Tri-state checkbox component with checked/unchecked/indeterminate states, form integration, groups, accessibility, and flexible state management (two-way binding or fully controlled).

## Checkbox Component

Enables users to select or deselect options with support for indeterminate states.

### Key Features
- **Tri-State Support**: Checked, unchecked, and indeterminate states
- **Accessibility**: WAI-ARIA guidelines, keyboard navigation, screen reader support
- **Flexible State Management**: Controlled and uncontrolled state support

### Basic Usage

```svelte
<script lang="ts">
  import { Checkbox, Label } from "bits-ui";
  import Check from "phosphor-svelte/lib/Check";
  import Minus from "phosphor-svelte/lib/Minus";
</script>

<Checkbox.Root id="terms" aria-labelledby="terms-label" indeterminate>
  {#snippet children({ checked, indeterminate })}
    <div>
      {#if indeterminate}
        <Minus class="size-[15px]" weight="bold" />
      {:else if checked}
        <Check class="size-[15px]" weight="bold" />
      {/if}
    </div>
  {/snippet}
</Checkbox.Root>
<Label.Root id="terms-label" for="terms">
  Accept terms and conditions
</Label.Root>
```

### Reusable Component Pattern

```svelte
<script lang="ts">
  import { Checkbox, Label, useId, type WithoutChildrenOrChild } from "bits-ui";
  let {
    id = useId(),
    checked = $bindable(false),
    ref = $bindable(null),
    labelRef = $bindable(null),
    labelText,
    ...restProps
  }: WithoutChildrenOrChild<Checkbox.RootProps> & {
    labelText: string;
    labelRef?: HTMLLabelElement | null;
  } = $props();
</script>

<Checkbox.Root {id} bind:checked bind:ref {...restProps}>
  {#snippet children({ checked, indeterminate })}
    {#if indeterminate}-{:else if checked}✅{:else}❌{/if}
  {/snippet}
</Checkbox.Root>
<Label.Root for={id} bind:ref={labelRef}>{labelText}</Label.Root>
```

Usage: `<MyCheckbox labelText="Enable notifications" />`

### Managing Checked State

**Two-Way Binding:**
```svelte
<script lang="ts">
  let myChecked = $state(false);
</script>
<button onclick={() => (myChecked = false)}>uncheck</button>
<Checkbox.Root bind:checked={myChecked} />
```

**Fully Controlled (Function Binding):**
```svelte
<script lang="ts">
  let myChecked = $state(false);
  function getChecked() { return myChecked; }
  function setChecked(newChecked: boolean) { myChecked = newChecked; }
</script>
<Checkbox.Root bind:checked={getChecked, setChecked} />
```

### Managing Indeterminate State

**Two-Way Binding:**
```svelte
<script lang="ts">
  let myIndeterminate = $state(true);
</script>
<button onclick={() => (myIndeterminate = false)}>clear indeterminate</button>
<MyCheckbox bind:indeterminate={myIndeterminate} />
```

**Fully Controlled:**
```svelte
<script lang="ts">
  let myIndeterminate = $state(true);
  function getIndeterminate() { return myIndeterminate; }
  function setIndeterminate(newIndeterminate: boolean) { myIndeterminate = newIndeterminate; }
</script>
<Checkbox.Root bind:indeterminate={getIndeterminate, setIndeterminate} />
```

### Disabled State
```svelte
<MyCheckbox disabled labelText="Enable notifications" />
```

### HTML Forms

**Basic form submission** (submits `'on'` by default when checked):
```svelte
<MyCheckbox name="notifications" labelText="Enable notifications" />
```

**Custom value:**
```svelte
<MyCheckbox value="hello" name="notifications" labelText="Enable notifications" />
```

**Required:**
```svelte
<Checkbox.Root required><!-- ... --></Checkbox.Root>
```

### Checkbox Groups

```svelte
<script lang="ts">
  let myValue = $state<string[]>(["marketing", "news"]);
</script>

<Checkbox.Group bind:value={myValue} name="notifications" onValueChange={console.log}>
  <Checkbox.GroupLabel>Notifications</Checkbox.GroupLabel>
  <Checkbox.Root value="marketing" />
  <Checkbox.Root value="promotions" />
  <Checkbox.Root value="news" />
</Checkbox.Group>
```

**Managing Group Value - Two-Way Binding:**
```svelte
<script lang="ts">
  let myValue = $state<string[]>([]);
</script>
<button onclick={() => { myValue = ["item-1", "item-2"]; }}>Open Items 1 and 2</button>
<Checkbox.Group name="myItems" bind:value={myValue}>
  <Checkbox.GroupLabel>Items</Checkbox.GroupLabel>
  <Checkbox.Root value="item-1" />
  <Checkbox.Root value="item-2" />
  <Checkbox.Root value="item-3" />
</Checkbox.Group>
```

**Fully Controlled:**
```svelte
<script lang="ts">
  let myValue = $state<string[]>([]);
  function getValue() { return myValue; }
  function setValue(newValue: string[]) { myValue = newValue; }
</script>
<Checkbox.Group bind:value={getValue, setValue}><!-- ... --></Checkbox.Group>
```

**Group Form Submission:**
```svelte
<Checkbox.Group name="notifications"><!-- ... --></Checkbox.Group>
```
When a name is provided to `Checkbox.Group`, hidden `<input />` elements are rendered for each checkbox. Descendant checkboxes inherit `name`, `required`, and `disabled` from the group.

### API Reference

**Checkbox.Root Properties:**
- `checked` $bindable: `boolean` (default: false) - The checkbox's checked state
- `onCheckedChange`: `(checked: boolean) => void` - Callback when checked state changes
- `indeterminate` $bindable: `boolean` (default: false) - Whether checkbox is indeterminate
- `onIndeterminateChange`: `(indeterminate: boolean) => void` - Callback when indeterminate changes
- `disabled`: `boolean` (default: false) - Prevents user interaction
- `required`: `boolean` (default: false) - Makes checkbox required
- `name`: `string` - Name for form submission; renders hidden input if provided
- `value`: `string` - Value submitted with form when checked
- `readonly`: `boolean` (default: false) - Focusable but not checkable/uncheckable
- `ref` $bindable: `HTMLButtonElement` - Reference to underlying DOM element
- `children`: `Snippet<{ checked: boolean; indeterminate: boolean }>` - Content to render
- `child`: `Snippet<{ props: Record<string, unknown>; checked: boolean; indeterminate: boolean }>` - Render delegation

**Checkbox.Root Data Attributes:**
- `data-state`: `'checked' | 'unchecked' | 'indeterminate'` - Current state
- `data-disabled`: `''` - Present when disabled
- `data-readonly`: `''` - Present when read only
- `data-checkbox-root`: `''` - Present on root element

**Checkbox.Group Properties:**
- `value` $bindable: `string[]` (default: []) - Array of checked checkbox values
- `onValueChange`: `(value: string[]) => void` - Callback when value changes
- `disabled`: `boolean` (default: false) - Disables all checkboxes in group
- `required`: `boolean` (default: false) - Makes group required for form submission
- `name`: `string` - Name for form submission; renders hidden inputs if provided
- `readonly`: `boolean` (default: false) - Focusable but not checkable/uncheckable
- `ref` $bindable: `HTMLDivElement` - Reference to underlying DOM element
- `children`: `Snippet` - Content to render
- `child`: `Snippet<{ props: Record<string, unknown> }>` - Render delegation

**Checkbox.Group Data Attributes:**
- `data-disabled`: `''` - Present when disabled
- `data-checkbox-group`: `''` - Present on group element
- `data-readonly`: `''` - Present when read only

**Checkbox.GroupLabel Properties:**
- `ref` $bindable: `HTMLLabelElement` - Reference to underlying DOM element
- `children`: `Snippet` - Content to render
- `child`: `Snippet<{ props: Record<string, unknown> }>` - Render delegation

**Checkbox.GroupLabel Data Attributes:**
- `data-disabled`: `''` - Present when group is disabled
- `data-checkbox-group-label`: `''` - Present on label element


### collapsible
Collapsible component with Root/Trigger/Content sub-components; supports controlled/uncontrolled state, Svelte transitions via forceMount+child snippet, and hiddenUntilFound for browser search integration.

## Overview
Collapsible component for expandable/collapsible content sections. Manages space and organizes information with show/hide functionality.

## Key Features
- ARIA attributes for accessibility and keyboard navigation
- CSS variables and data attributes for smooth transitions
- Controlled and uncontrolled state support
- Compound component structure (Root, Trigger, Content)
- `hidden="until-found"` support for browser search integration

## Architecture
Three sub-components:
- **Root**: Parent container managing state and context
- **Trigger**: Interactive element toggling expanded/collapsed state
- **Content**: Container for shown/hidden content

## Basic Structure
```svelte
<script lang="ts">
  import { Collapsible } from "bits-ui";
  import CaretUpDown from "phosphor-svelte/lib/CaretUpDown";
</script>
<Collapsible.Root class="w-[327px] space-y-3">
  <div class="flex items-center justify-between space-x-10">
    <h4 class="text-[15px] font-medium">@huntabyte starred 3 repositories</h4>
    <Collapsible.Trigger
      class="rounded-9px border-border-input bg-background-alt text-foreground shadow-btn hover:bg-muted inline-flex h-10 w-10 items-center justify-center border transition-all active:scale-[0.98]"
      aria-label="Show starred repositories"
    >
      <CaretUpDown class="size-4" weight="bold" />
    </Collapsible.Trigger>
  </div>
  <Collapsible.Content
    hiddenUntilFound
    class="data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up space-y-2 overflow-hidden font-mono text-[15px] tracking-[0.01em]"
  >
    <div class="rounded-9px bg-muted inline-flex h-12 w-full items-center px-[18px] py-3">
      @huntabyte/bits-ui
    </div>
    <div class="rounded-9px bg-muted inline-flex h-12 w-full items-center px-[18px] py-3">
      @huntabyte/shadcn-svelte
    </div>
    <div class="rounded-9px bg-muted inline-flex h-12 w-full items-center px-[18px] py-3">
      @svecosystem/runed
    </div>
  </Collapsible.Content>
</Collapsible.Root>
```

## Reusable Component Pattern
```svelte
<script lang="ts">
  import { Collapsible, type WithoutChild } from "bits-ui";
  type Props = WithoutChild<Collapsible.RootProps> & {
    buttonText: string;
  };
  let {
    open = $bindable(false),
    ref = $bindable(null),
    buttonText,
    children,
    ...restProps
  }: Props = $props();
</script>
<Collapsible.Root bind:open bind:ref {...restProps}>
  <Collapsible.Trigger>{buttonText}</Collapsible.Trigger>
  <Collapsible.Content>
    {@render children?.()}
  </Collapsible.Content>
</Collapsible.Root>
```

Usage:
```svelte
<MyCollapsible buttonText="Open Collapsible">
  Here is my collapsible content.
</MyCollapsible>
```

## State Management

### Two-Way Binding
```svelte
<script lang="ts">
  import { Collapsible } from "bits-ui";
  let isOpen = $state(false);
</script>
<button onclick={() => (isOpen = true)}>Open Collapsible</button>
<Collapsible.Root bind:open={isOpen}>
  <!-- ... -->
</Collapsible.Root>
```

### Fully Controlled (Function Binding)
```svelte
<script lang="ts">
  import { Collapsible } from "bits-ui";
  let myOpen = $state(false);
  function getOpen() {
    return myOpen;
  }
  function setOpen(newOpen: boolean) {
    myOpen = newOpen;
  }
</script>
<Collapsible.Root bind:open={getOpen, setOpen}>
  <!-- ... -->
</Collapsible.Root>
```

## Svelte Transitions

### Using `forceMount` and `child` Snippets
```svelte
<script lang="ts">
  import { Collapsible } from "bits-ui";
  import { fade } from "svelte/transition";
</script>
<Collapsible.Root>
  <Collapsible.Trigger>Open</Collapsible.Trigger>
  <Collapsible.Content forceMount>
    {#snippet child({ props, open })}
      {#if open}
        <div {...props} transition:fade>
          <!-- ... -->
        </div>
      {/if}
    {/snippet}
  </Collapsible.Content>
</Collapsible.Root>
```

- `forceMount` ensures content always in DOM
- `child` snippet provides access to open state and props
- `#if` block controls visibility
- Transition directive applies animations

### Reusable Transition Component
```svelte
<script lang="ts">
  import { Collapsible, type WithoutChildrenOrChild } from "bits-ui";
  import { fade } from "svelte/transition";
  import type { Snippet } from "svelte";
  let {
    ref = $bindable(null),
    duration = 200,
    children,
    ...restProps
  }: WithoutChildrenOrChild<Collapsible.ContentProps> & {
    duration?: number;
    children?: Snippet;
  } = $props();
</script>
<Collapsible.Content forceMount bind:ref {...restProps}>
  {#snippet child({ props, open })}
    {#if open}
      <div {...props} transition:fade={{ duration }}>
        {@render children?.()}
      </div>
    {/if}
  {/snippet}
</Collapsible.Content>
```

Usage:
```svelte
<Collapsible.Root>
  <Collapsible.Trigger>Open</Collapsible.Trigger>
  <MyCollapsibleContent duration={300}>
    <!-- ... -->
  </MyCollapsibleContent>
</Collapsible.Root>
```

## Hidden Until Found
The `hiddenUntilFound` prop enables browser find-in-page integration. When enabled, content is marked with `hidden="until-found"`, allowing browsers to automatically expand collapsed content when users search for text.

```svelte
<Collapsible.Root>
  <Collapsible.Trigger>Show More Details</Collapsible.Trigger>
  <Collapsible.Content hiddenUntilFound={true}>
    <p>
      This content will be automatically revealed when users search for text
      within it using Ctrl+F (Cmd+F on Mac).
    </p>
  </Collapsible.Content>
</Collapsible.Root>
```

## API Reference

### Collapsible.Root
| Property | Type | Description | Default |
|----------|------|-------------|---------|
| `open` $bindable | `boolean` | Open state; content visible when true | `false` |
| `onOpenChange` | `(open: boolean) => void` | Callback when open state changes | `undefined` |
| `onOpenChangeComplete` | `(open: boolean) => void` | Callback after state change and animations complete | `undefined` |
| `disabled` | `boolean` | Prevents user interaction | `false` |
| `ref` $bindable | `HTMLDivElement` | DOM element reference | `null` |
| `children` | `Snippet` | Children content | `undefined` |
| `child` | `Snippet` | Render delegation snippet | `undefined` |

Data Attributes:
- `data-state`: `'open'` \| `'closed'`
- `data-disabled`: Present when disabled
- `data-collapsible-root`: Present on root

### Collapsible.Trigger
| Property | Type | Description | Default |
|----------|------|-------------|---------|
| `ref` $bindable | `HTMLButtonElement` | DOM element reference | `null` |
| `children` | `Snippet` | Children content | `undefined` |
| `child` | `Snippet` | Render delegation snippet | `undefined` |

Data Attributes:
- `data-state`: `'open'` \| `'closed'`
- `data-disabled`: Present when disabled
- `data-collapsible-trigger`: Present on trigger

### Collapsible.Content
| Property | Type | Description | Default |
|----------|------|-------------|---------|
| `forceMount` | `boolean` | Force mount for transitions/animations | `false` |
| `hiddenUntilFound` | `boolean` | Mark with `hidden="until-found"` for search integration | `false` |
| `ref` $bindable | `HTMLDivElement` | DOM element reference | `null` |
| `children` | `Snippet` | Children content | `undefined` |
| `child` | `Snippet` - `{ open: boolean; props: Record<string, unknown> }` | Render delegation snippet | `undefined` |

Data Attributes:
- `data-state`: `'open'` \| `'closed'`
- `data-disabled`: Present when disabled
- `data-collapsible-content`: Present on content

CSS Variables:
- `--bits-collapsible-content-height`: Height of content element
- `--bits-collapsible-content-width`: Width of content element

### combobox
Searchable dropdown with single/multiple selection, keyboard navigation, Floating UI positioning, scroll buttons, item grouping, and Svelte transitions support.

## Overview
Combobox combines an input field with a dropdown list, enabling users to search, filter, and select from predefined options. Supports both single and multiple selection modes.

## Key Features
- Full keyboard navigation with ARIA attributes
- Customizable rendering with grouped items support
- Portal support for complex UI structures
- Floating UI positioning (with opt-out option)

## Architecture
Sub-components:
- **Root**: Main container managing state and context
- **Input**: Search query field
- **Trigger**: Opens dropdown
- **Portal**: Renders content to body or custom target
- **Content**: Dropdown container using Floating UI
- **ContentStatic**: Alternative without Floating UI
- **Viewport**: Visible area for scroll behavior
- **ScrollUpButton/ScrollDownButton**: Scroll controls
- **Item**: Individual selectable item
- **Group/GroupHeading**: Item grouping
- **Arrow**: Pointer element

## Basic Structure
```svelte
<Combobox.Root type="single|multiple">
  <Combobox.Input />
  <Combobox.Trigger />
  <Combobox.Portal>
    <Combobox.Content>
      <Combobox.Group>
        <Combobox.GroupHeading />
        <Combobox.Item />
      </Combobox.Group>
    </Combobox.Content>
  </Combobox.Portal>
</Combobox.Root>
```

## Complete Example
```svelte
<script lang="ts">
  import { Combobox } from "bits-ui";
  import CaretUpDown from "phosphor-svelte/lib/CaretUpDown";
  import Check from "phosphor-svelte/lib/Check";
  
  const fruits = [
    { value: "mango", label: "Mango" },
    { value: "apple", label: "Apple" },
  ];
  
  let searchValue = $state("");
  const filteredFruits = $derived(
    searchValue === ""
      ? fruits
      : fruits.filter((f) => f.label.toLowerCase().includes(searchValue.toLowerCase()))
  );
</script>

<Combobox.Root type="multiple" onOpenChangeComplete={(o) => { if (!o) searchValue = ""; }}>
  <div class="relative">
    <Combobox.Input
      oninput={(e) => (searchValue = e.currentTarget.value)}
      placeholder="Search a fruit"
    />
    <Combobox.Trigger>
      <CaretUpDown />
    </Combobox.Trigger>
  </div>
  <Combobox.Portal>
    <Combobox.Content sideOffset={10}>
      <Combobox.ScrollUpButton>↑</Combobox.ScrollUpButton>
      <Combobox.Viewport>
        {#each filteredFruits as fruit}
          <Combobox.Item value={fruit.value} label={fruit.label}>
            {#snippet children({ selected })}
              {fruit.label}
              {#if selected}<Check />{/if}
            {/snippet}
          </Combobox.Item>
        {:else}
          <span>No results found</span>
        {/each}
      </Combobox.Viewport>
      <Combobox.ScrollDownButton>↓</Combobox.ScrollDownButton>
    </Combobox.Content>
  </Combobox.Portal>
</Combobox.Root>
```

## Reusable Component Pattern
```svelte
<script lang="ts">
  import { Combobox, type WithoutChildrenOrChild, mergeProps } from "bits-ui";
  
  type Props = Combobox.RootProps & {
    items?: Array<{ value: string; label: string; disabled?: boolean }>;
    inputProps?: WithoutChildrenOrChild<Combobox.InputProps>;
    contentProps?: WithoutChildrenOrChild<Combobox.ContentProps>;
  };
  
  let { items = [], value = $bindable(), open = $bindable(false), inputProps, contentProps, type, ...restProps }: Props = $props();
  
  let searchValue = $state("");
  const filteredItems = $derived.by(() => {
    if (searchValue === "") return items;
    return items.filter((item) => item.label.toLowerCase().includes(searchValue.toLowerCase()));
  });
  
  function handleInput(e: Event & { currentTarget: HTMLInputElement }) {
    searchValue = e.currentTarget.value;
  }
  
  function handleOpenChange(newOpen: boolean) {
    if (!newOpen) searchValue = "";
  }
  
  const mergedRootProps = $derived(mergeProps(restProps, { onOpenChange: handleOpenChange }));
  const mergedInputProps = $derived(mergeProps(inputProps, { oninput: handleInput }));
</script>

<Combobox.Root {type} {items} bind:value={value as never} bind:open {...mergedRootProps}>
  <Combobox.Input {...mergedInputProps} />
  <Combobox.Trigger>Open</Combobox.Trigger>
  <Combobox.Portal>
    <Combobox.Content {...contentProps}>
      {#each filteredItems as item}
        <Combobox.Item {...item}>
          {#snippet children({ selected })}
            {item.label}
            {selected ? "✅" : ""}
          {/snippet}
        </Combobox.Item>
      {:else}
        <span>No results found</span>
      {/each}
    </Combobox.Content>
  </Combobox.Portal>
</Combobox.Root>
```

## State Management

### Value Binding
Two-way: `bind:value={myValue}`
Fully controlled: `bind:value={getValue, setValue}`

### Open State
Two-way: `bind:open={myOpen}`
Fully controlled: `bind:open={getOpen, setOpen}`

## Floating UI
By default uses Floating UI for positioning. Opt-out with `Combobox.ContentStatic` and position manually.

## Custom Anchor
Anchor content to different element:
```svelte
<script>
  let customAnchor = $state<HTMLElement>(null!);
</script>
<div bind:this={customAnchor}></div>
<Combobox.Content {customAnchor}>...</Combobox.Content>
```

## Viewport & Scrolling
`Combobox.Viewport` determines content size for scroll button rendering. Set min/max height on viewport.

Scroll buttons auto-scroll with configurable delay:
```svelte
<Combobox.ScrollUpButton delay={(tick) => 50}>↑</Combobox.ScrollUpButton>
```

For native scrolling, omit scroll buttons and viewport, set height and overflow on Content.

## Scroll Lock
Prevent body scroll when open: `<Combobox.Content preventScroll={true}>`

## Highlighted Items
Follows WAI-ARIA descendant pattern - input retains focus during keyboard navigation, items highlighted as navigated.

Style with `data-highlighted` attribute:
```svelte
<Combobox.Item class="data-highlighted:bg-muted">...</Combobox.Item>
```

Callbacks: `onHighlight` and `onUnhighlight` props on Item.

## Svelte Transitions
Use `forceMount` with `child` snippet for transition control:
```svelte
<Combobox.Content forceMount>
  {#snippet child({ wrapperProps, props, open })}
    {#if open}
      <div {...wrapperProps}>
        <div {...props} transition:fly>...</div>
      </div>
    {/if}
  {/snippet}
</Combobox.Content>
```

## API Reference

### Combobox.Root
- `type` (required): 'single' | 'multiple'
- `value` ($bindable): string | string[]
- `onValueChange`: callback on value change
- `open` ($bindable): boolean
- `onOpenChange`: callback on open change
- `onOpenChangeComplete`: callback after animations complete
- `disabled`: boolean
- `name`: string (for form submission)
- `required`: boolean
- `scrollAlignment`: 'nearest' | 'center' (default: 'nearest')
- `loop`: boolean (default: false)
- `allowDeselect`: boolean (default: true)
- `items`: Array<{value: string; label: string; disabled?: boolean}>
- `inputValue`: string (read-only, syncs with selection)

### Combobox.Trigger
- `ref` ($bindable): HTMLButtonElement
- Data attributes: `data-state`, `data-disabled`, `data-combobox-trigger`

### Combobox.Input
- `defaultValue`: string
- `clearOnDeselect`: boolean (default: false)
- `ref` ($bindable): HTMLInputElement
- Data attributes: `data-state`, `data-disabled`, `data-combobox-input`

### Combobox.Content
Floating UI positioning options:
- `side`: 'top' | 'bottom' | 'left' | 'right' (default: 'bottom')
- `sideOffset`: number (default: 0)
- `align`: 'start' | 'center' | 'end' (default: 'start')
- `alignOffset`: number (default: 0)
- `avoidCollisions`: boolean (default: true)
- `collisionBoundary`: Element | null
- `collisionPadding`: number | Partial<Record<Side, number>> (default: 0)
- `sticky`: 'partial' | 'always' (default: 'partial')
- `hideWhenDetached`: boolean (default: true)
- `updatePositionStrategy`: 'optimized' | 'always' (default: 'optimized')
- `strategy`: 'fixed' | 'absolute' (default: 'fixed')
- `preventScroll`: boolean (default: false)
- `customAnchor`: string | HTMLElement | Measurable | null
- `onEscapeKeydown`: callback
- `escapeKeydownBehavior`: 'close' | 'ignore' | 'defer-otherwise-close' | 'defer-otherwise-ignore' (default: 'close')
- `onInteractOutside`: callback
- `onFocusOutside`: callback
- `interactOutsideBehavior`: 'close' | 'ignore' | 'defer-otherwise-close' | 'defer-otherwise-ignore' (default: 'close')
- `preventOverflowTextSelection`: boolean (default: true)
- `dir`: 'ltr' | 'rtl' (default: 'ltr')
- `loop`: boolean (default: false)
- `forceMount`: boolean (default: false)
- `ref` ($bindable): HTMLDivElement
- CSS variables: `--bits-combobox-content-transform-origin`, `--bits-combobox-content-available-width`, `--bits-combobox-content-available-height`, `--bits-combobox-anchor-width`, `--bits-combobox-anchor-height`
- Data attributes: `data-state`, `data-combobox-content`

### Combobox.ContentStatic
Similar to Content but without Floating UI:
- `onEscapeKeydown`, `escapeKeydownBehavior`, `onInteractOutside`, `onFocusOutside`, `interactOutsideBehavior`
- `onOpenAutoFocus`, `onCloseAutoFocus`
- `trapFocus`: boolean (default: true)
- `preventScroll`: boolean (default: true)
- `preventOverflowTextSelection`: boolean (default: true)
- `dir`: 'ltr' | 'rtl' (default: 'ltr')
- `loop`: boolean (default: false)
- `forceMount`: boolean (default: false)

### Combobox.Portal
- `to`: Element | string (default: document.body)
- `disabled`: boolean (default: false)

### Combobox.Item
- `value` (required): string
- `label`: string
- `disabled`: boolean (default: false)
- `onHighlight`: callback
- `onUnhighlight`: callback
- `ref` ($bindable): HTMLDivElement
- Data attributes: `data-value`, `data-label`, `data-disabled`, `data-highlighted`, `data-selected`, `data-combobox-item`

### Combobox.Viewport
- `ref` ($bindable): HTMLDivElement
- Data attributes: `data-combobox-viewport`

### Combobox.ScrollUpButton / ScrollDownButton
- `delay`: (tick: number) => number (default: () => 50)
- `ref` ($bindable): HTMLDivElement
- Data attributes: `data-combobox-scroll-up-button` / `data-combobox-scroll-down-button`

### Combobox.Group
- `ref` ($bindable): HTMLDivElement
- Data attributes: `data-combobox-group`

### Combobox.GroupHeading
- `ref` ($bindable): HTMLDivElement
- Data attributes: `data-combobox-group-heading`

### Combobox.Arrow
- `width`: number (default: 8)
- `height`: number (default: 8)
- `ref` ($bindable): HTMLDivElement
- Data attributes: `data-arrow`

### command
Searchable command menu with keyboard navigation, custom filtering, grouping, grid layout, modal support, and imperative API for programmatic control.

## Command Component

A searchable, filterable command menu for quick navigation and action execution.

### Key Features
- Dynamic filtering with customizable scoring algorithm
- Full keyboard navigation support (including vim bindings: ctrl+n/j/p/k)
- Grouped commands with headers
- Empty/loading states
- Accessibility with ARIA attributes
- Grid layout support via `columns` prop

### Architecture
Sub-components: `Root` (state manager), `Input` (search field), `List` (container), `Viewport` (visible area with CSS variables), `Empty`, `Loading`, `Group`, `GroupHeading`, `GroupItems`, `Item`, `LinkItem`, `Separator`

### State Management

**Two-way binding:**
```svelte
<script>
  let myValue = $state("");
</script>
<Command.Root bind:value={myValue}>
  <!-- ... -->
</Command.Root>
```

**Change handler:**
```svelte
<Command.Root onValueChange={(value) => console.log(value)}>
  <!-- ... -->
</Command.Root>
```

**Fully controlled (function binding):**
```svelte
<Command.Root bind:value={() => myValue, (newValue) => (myValue = newValue)}>
  <!-- ... -->
</Command.Root>
```

### Basic Example
```svelte
<Command.Root>
  <Command.Input placeholder="Search..." />
  <Command.List>
    <Command.Viewport>
      <Command.Empty>No results found.</Command.Empty>
      <Command.Group>
        <Command.GroupHeading>Suggestions</Command.GroupHeading>
        <Command.GroupItems>
          <Command.Item keywords={["getting started"]}>
            Introduction
          </Command.Item>
        </Command.GroupItems>
      </Command.Group>
      <Command.Separator />
    </Command.Viewport>
  </Command.List>
</Command.Root>
```

### Modal Integration
Combine with `Dialog` component. Listen for keyboard shortcut (e.g., Cmd+J) to open:
```svelte
<Dialog.Root bind:open={dialogOpen}>
  <Dialog.Trigger>Open Command Menu ⌘J</Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content>
      <Command.Root><!-- ... --></Command.Root>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

### Grid Layout
Set `columns` prop for grid display. Example with emoji picker showing 8-column grid with navigation between views:
```svelte
<Command.Root columns={8}>
  <Command.Input bind:value={search} />
  <Command.List>
    <Command.Viewport>
      <Command.Group>
        <Command.GroupItems class="grid grid-cols-8 gap-2">
          <Command.Item>🎉</Command.Item>
          <!-- ... -->
        </Command.GroupItems>
      </Command.Group>
    </Command.Viewport>
  </Command.List>
</Command.Root>
```

### Filtering

**Custom filter function** (returns 0-1 score):
```svelte
<Command.Root filter={(value, search, keywords) => {
  return value.includes(search) ? 1 : 0;
}}>
```

**Extend default filter:**
```svelte
<Command.Root filter={(value, search, keywords) => {
  const score = computeCommandScore(value, search, keywords);
  // custom logic
  return score;
}}>
```

**Disable filtering:**
```svelte
<Command.Root shouldFilter={false}>
```

### Item Selection
```svelte
<Command.Item onSelect={() => console.log("selected!")}>Item</Command.Item>
```

### Links
Use `Command.LinkItem` for anchor elements with preloading:
```svelte
<Command.LinkItem href="/path" keywords={["nav"]}>Link</Command.LinkItem>
```

### Imperative API
Bind to `Command.Root` for programmatic control:
```svelte
<script>
  let command;
</script>
<Command.Root bind:this={command}>
  <!-- ... -->
</Command.Root>
```

**Methods:**
- `getValidItems()` - returns array of selectable items
- `updateSelectedToIndex(index)` - select item at index
- `updateSelectedByGroup(1 | -1)` - move to next/previous group
- `updateSelectedByItem(1 | -1)` - move to next/previous item

**Example:**
```svelte
<script>
  let command;
  function jumpToLastItem() {
    const items = command.getValidItems();
    if (items.length) command.updateSelectedToIndex(items.length - 1);
  }
</script>
<svelte:window onkeydown={(e) => e.key === "o" && jumpToLastItem()} />
<Command.Root bind:this={command}><!-- ... --></Command.Root>
```

### Common Mistakes
- **Duplicate values**: Each `Command.Item` must have unique `value`. If text content is identical, use `value` prop to differentiate:
```svelte
<Command.Item value="item-1">My Item</Command.Item>
<Command.Item value="item-2">My Item</Command.Item>
```

### Props Reference

**Command.Root:**
- `value` (bindable, string) - selected value
- `onValueChange` (function) - fires on value change
- `label` (string) - accessible label for screen readers
- `filter` (function) - custom filter returning 0-1 score
- `shouldFilter` (boolean, default true) - enable/disable filtering
- `columns` (number) - grid column count
- `onStateChange` (function) - fires on state changes (debounced)
- `loop` (boolean, default false) - wrap around when navigating
- `disablePointerSelection` (boolean) - prevent hover selection
- `vimBindings` (boolean, default true) - enable vim keybindings
- `disableInitialScroll` (boolean) - prevent scroll on mount
- `ref` (bindable, HTMLDivElement)

**Command.Input:**
- `value` (bindable, string) - search query
- `ref` (bindable, HTMLInputElement)

**Command.List, Command.Viewport, Command.Group, Command.GroupHeading, Command.GroupItems, Command.Empty, Command.Loading, Command.Separator:**
- `ref` (bindable, HTMLDivElement)
- `forceMount` (boolean) - always mount regardless of filtering

**Command.Item / Command.LinkItem:**
- `value` (required, string)
- `keywords` (string[]) - additional search terms
- `forceMount` (boolean)
- `onSelect` (function)
- `disabled` (boolean)
- `ref` (bindable, HTMLDivElement)

**Command.Loading:**
- `progress` (number, default 0)

**Data attributes:** `data-command-root`, `data-command-input`, `data-command-list`, `data-command-viewport`, `data-command-group`, `data-command-group-heading`, `data-command-group-items`, `data-command-item`, `data-command-empty`, `data-command-loading`, `data-command-separator`, `data-selected`, `data-disabled`

**CSS variable:** `--bits-command-list-height` (set by Viewport)

### context-menu
Right-click context menu with nested submenus, checkbox/radio items, state binding, floating UI positioning, keyboard nav, and Svelte transition support.

## Context Menu

Right-click triggered menu component with support for nested submenus, checkbox items, radio groups, and keyboard navigation.

### Basic Structure
```svelte
<ContextMenu.Root>
  <ContextMenu.Trigger>Right click me</ContextMenu.Trigger>
  <ContextMenu.Portal>
    <ContextMenu.Content>
      <ContextMenu.Item>Edit</ContextMenu.Item>
      <ContextMenu.Separator />
      <ContextMenu.Item>Delete</ContextMenu.Item>
    </ContextMenu.Content>
  </ContextMenu.Portal>
</ContextMenu.Root>
```

### State Management
- **Two-way binding**: `let isOpen = $state(false); <ContextMenu.Root bind:open={isOpen}>`
- **Fully controlled**: Use function bindings with getter/setter for complete control

### Nested Menus (Submenus)
```svelte
<ContextMenu.Sub>
  <ContextMenu.SubTrigger>Add</ContextMenu.SubTrigger>
  <ContextMenu.SubContent sideOffset={10}>
    <ContextMenu.Item>Header</ContextMenu.Item>
    <ContextMenu.Item>Paragraph</ContextMenu.Item>
  </ContextMenu.SubContent>
</ContextMenu.Sub>
```

### Checkbox Items
```svelte
<ContextMenu.CheckboxItem bind:checked={notifications}>
  {#snippet children({ checked, indeterminate })}
    {#if indeterminate}-{:else if checked}✅{/if}
    Notifications
  {/snippet}
</ContextMenu.CheckboxItem>
```

### Checkbox Groups
```svelte
<ContextMenu.CheckboxGroup bind:value={colors}>
  <ContextMenu.GroupHeading>Favorite color</ContextMenu.GroupHeading>
  <ContextMenu.CheckboxItem value="red">
    {#snippet children({ checked })}
      {#if checked}✅{/if}
      Red
    {/snippet}
  </ContextMenu.CheckboxItem>
  <!-- more items -->
</ContextMenu.CheckboxGroup>
```
Note: `value` state does not persist between open/close cycles; store in `$state` variable.

### Radio Groups
```svelte
<ContextMenu.RadioGroup bind:value>
  {#each values as val}
    <ContextMenu.RadioItem {value: val}>
      {#snippet children({ checked })}
        {#if checked}✅{/if}
        {val}
      {/snippet}
    </ContextMenu.RadioItem>
  {/each}
</ContextMenu.RadioGroup>
```

### Svelte Transitions
Use `forceMount` prop with `child` snippet to enable transitions:
```svelte
<ContextMenu.Content forceMount>
  {#snippet child({ wrapperProps, props, open })}
    {#if open}
      <div {...wrapperProps}>
        <div {...props} transition:fly>
          <ContextMenu.Item>Item 1</ContextMenu.Item>
        </div>
      </div>
    {/if}
  {/snippet}
</ContextMenu.Content>
```

### Reusable Component Pattern
Create wrapper component accepting `trigger` snippet, `items` array, and `contentProps`:
```svelte
<ContextMenu.Root bind:open {...restProps}>
  <ContextMenu.Trigger>{@render trigger()}</ContextMenu.Trigger>
  <ContextMenu.Portal>
    <ContextMenu.Content {...contentProps}>
      <ContextMenu.Group>
        <ContextMenu.GroupHeading>Select an Office</ContextMenu.GroupHeading>
        {#each items as item}
          <ContextMenu.Item textValue={item}>{item}</ContextMenu.Item>
        {/each}
      </ContextMenu.Group>
    </ContextMenu.Content>
  </ContextMenu.Portal>
</ContextMenu.Root>
```

### Key Components
- **Root**: Manages menu state, accepts `open` (bindable), `onOpenChange`, `onOpenChangeComplete`, `dir`
- **Trigger**: Right-click target, `disabled` prop, emits `data-state` and `data-context-menu-trigger`
- **Portal**: Renders content to body or custom target, `to` and `disabled` props
- **Content**: Menu container with floating UI positioning (side, align, collision handling), `forceMount`, `loop`, `trapFocus`, `preventScroll`
- **ContentStatic**: Non-floating alternative
- **Item**: Menu item with `disabled`, `textValue`, `onSelect`, `closeOnSelect` props
- **CheckboxItem**: Checkbox menu item with `checked`, `indeterminate`, `value` (for groups)
- **CheckboxGroup**: Container for checkbox items, `value` is array of selected
- **RadioItem**: Radio button menu item, requires `value` prop
- **RadioGroup**: Container for radio items, `value` is single selected
- **Separator**: Visual divider
- **Arrow**: Optional pointer to anchor
- **Group**: Item grouping with optional heading
- **GroupHeading**: Label for group (skipped in keyboard nav)
- **Sub/SubTrigger/SubContent**: Submenu structure with `openDelay` prop on trigger

### Data Attributes
- `data-state`: 'open' | 'closed'
- `data-highlighted`: Present when item highlighted
- `data-disabled`: Present when disabled
- `data-context-menu-*`: Component identifiers
- `data-orientation`: 'vertical'

### CSS Variables
- `--bits-context-menu-content-transform-origin`
- `--bits-context-menu-content-available-width/height`
- `--bits-context-menu-anchor-width/height`

### date-field
DateField: customizable date input component with segment-based editing (day/month/year/hour/minute/second/timezone), validation (min/max/custom), granularity control, localization, bindable state, and readonly segment support.

## DateField Component

A customizable alternative to the native `<input type="date">` element that provides flexible date selection with segment-based input.

### Structure
```svelte
<DateField.Root>
  <DateField.Label>Check-in date</DateField.Label>
  <DateField.Input>
    {#snippet children({ segments })}
      {#each segments as { part, value }}
        <DateField.Segment {part}>{value}</DateField.Segment>
      {/each}
    {/snippet}
  </DateField.Input>
</DateField.Root>
```

### Reusable Component Pattern
Create a `MyDateField` wrapper component that encapsulates styling and structure for reuse throughout the application. The component accepts `value`, `placeholder`, `name`, and `labelText` props with bindable state management.

### Segments
Segments represent individual parts of a date (day, month, year, hour, minute, second) plus "literal" separators. Styling can differ between literal and editable segments.

### Placeholder
The `placeholder` prop determines the starting date when cycling through segments and sets the date granularity. Defaults to the closest allowed date to today as a `CalendarDate`. Use `CalendarDateTime` for time selection or `ZonedDateTime` for timezone support. For birthday fields, set placeholder in a leap year so users born on Feb 29 can select correctly.

**State Management:**
- Two-way binding: `bind:placeholder={myPlaceholder}`
- Fully controlled: `bind:placeholder={getPlaceholder, setPlaceholder}`

### Value State
The selected date value.

**State Management:**
- Two-way binding: `bind:value={myValue}`
- Fully controlled: `bind:value={getValue, setValue}`

### Default Value
Parse ISO 8601 strings using `parseDate()`, `parseDateTime()`, or `parseZonedDateTime()` from `@internationalized/date`:
```svelte
import { parseDate } from "@internationalized/date";
let value = $state(parseDate("2024-08-03"));
<DateField.Root {value}>...</DateField.Root>
```

### Validation

**Minimum Value:**
```svelte
import { today, getLocalTimeZone } from "@internationalized/date";
const todayDate = today(getLocalTimeZone());
<MyDateField minValue={todayDate} value={todayDate.subtract({ days: 1 })} />
```
Marks field invalid if selected date is less than `minValue`.

**Maximum Value:**
```svelte
const todayDate = today(getLocalTimeZone());
<MyDateField maxValue={todayDate} value={todayDate.add({ days: 1 })} />
```
Marks field invalid if selected date is greater than `maxValue`.

**Custom Validation:**
```svelte
function validate(date: DateValue) {
  return date.day === 1 ? "Date cannot be the first day of the month" : undefined;
}
function onInvalid(reason: "min" | "max" | "custom", msg?: string | string[]) {
  if (reason === "custom") {
    console.log(msg); // string or string[]
  } else if (reason === "min") {
    console.log("The date is too early.");
  } else if (reason === "max") {
    console.log("The date is too late.");
  }
}
<MyDateField {validate} {value} {onInvalid} />
```

### Granularity
Controls which segments render. Options: `'day'` (default), `'hour'`, `'minute'`, `'second'`.
```svelte
<MyDateField granularity="second" value={new CalendarDateTime(2024, 8, 2, 12, 30)} />
```

### Localization
```svelte
<MyDateField locale="de" />
```
Affects segment formatting and placeholders.

### API Reference

**DateField.Root Props:**
- `value: DateValue` - Selected date (CalendarDate | CalendarDateTime | ZonedDateTime)
- `onValueChange: (date: DateValue) => void`
- `placeholder: DateValue` (bindable) - Starting date for segments
- `onPlaceholderChange: (date: DateValue) => void`
- `required: boolean` (default: false)
- `validate: (date: DateValue) => string[] | string | void`
- `onInvalid: (reason: 'min' | 'max' | 'custom', msg?: string | string[]) => void`
- `errorMessageId: string` - ID of error message element
- `hourCycle: '12' | '24'` - Hour format preference
- `granularity: 'day' | 'hour' | 'minute' | 'second'` - Segment detail level
- `hideTimeZone: boolean` (default: false)
- `maxValue: DateValue` - Maximum valid date
- `minValue: DateValue` - Minimum valid date
- `locale: string` (default: 'en-US')
- `disabled: boolean` (default: false)
- `readonly: boolean` (default: false)
- `readonlySegments: EditableSegmentPart[]` - Segments to prevent input on
- `children: Snippet`

**DateField.Input Props:**
- `name: string` - Form submission name; renders hidden input if provided
- `ref: HTMLDivElement` (bindable)
- `children: Snippet<{ segments: Array<{ part: SegmentPart; value: string }> }>`
- `child: Snippet` - Render delegation

**Data Attributes on Input:**
- `data-invalid` - Present when field is invalid
- `data-disabled` - Present when field is disabled
- `data-date-field-input`

**DateField.Segment Props:**
- `part: SegmentPart` (required) - 'day' | 'month' | 'year' | 'hour' | 'minute' | 'second' | 'dayPeriod' | 'timeZoneName' | 'literal'
- `ref: HTMLDivElement` (bindable)
- `children: Snippet`
- `child: Snippet`

**Data Attributes on Segment:**
- `data-invalid` - Present when field is invalid
- `data-disabled` - Present when field is disabled
- `data-readonly` - Present when field or segment is readonly
- `data-segment` - The segment type being rendered
- `data-date-field-segment`

**DateField.Label Props:**
- `ref: HTMLSpanElement` (bindable)
- `children: Snippet`
- `child: Snippet`

**Data Attributes on Label:**
- `data-invalid` - Present when field is invalid
- `data-disabled` - Present when field is disabled
- `data-date-field-label`

### date-picker
DatePicker component combining Date Field + Calendar + Popover; supports value/placeholder/open state binding; validation via isDateUnavailable/isDateDisabled/validate; configurable via weekStartsOn, granularity, locale, minValue/maxValue, numberOfMonths, closeOnDateSelect, preventDeselect; extensive data attributes for styling selected/disabled/readonly/today/outside-month dates.

## DatePicker Component

Enables users to select dates using an input field and calendar interface. Composed of three sub-components: Date Field, Calendar, and Popover.

### Structure
```svelte
<DatePicker.Root>
  <DatePicker.Label />
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
            <DatePicker.GridHead>
              <DatePicker.GridRow>
                {#each weekdays as day}
                  <DatePicker.HeadCell>{day}</DatePicker.HeadCell>
                {/each}
              </DatePicker.GridRow>
            </DatePicker.GridHead>
            <DatePicker.GridBody>
              {#each month.weeks as weekDates}
                <DatePicker.GridRow>
                  {#each weekDates as date}
                    <DatePicker.Cell {date} month={month.value}>
                      <DatePicker.Day />
                    </DatePicker.Cell>
                  {/each}
                </DatePicker.GridRow>
              {/each}
            </DatePicker.GridBody>
          </DatePicker.Grid>
        {/each}
      {/snippet}
    </DatePicker.Calendar>
  </DatePicker.Content>
</DatePicker.Root>
```

### State Management

**Placeholder** (controls which month displays when no date selected):
```svelte
<script>
  import { CalendarDateTime } from "@internationalized/date";
  let myPlaceholder = $state();
</script>
<button onclick={() => myPlaceholder = new CalendarDateTime(2024, 8, 3, 12, 30)}>
  Set placeholder
</button>
<DatePicker.Root bind:placeholder={myPlaceholder}>
```

Or fully controlled:
```svelte
let myPlaceholder = $state();
function getPlaceholder() { return myPlaceholder; }
function setPlaceholder(newPlaceholder) { myPlaceholder = newPlaceholder; }
<DatePicker.Root bind:placeholder={getPlaceholder, setPlaceholder}>
```

**Value** (selected date):
```svelte
let myValue = $state(new CalendarDateTime(2024, 8, 3, 12, 30));
<button onclick={() => myValue = myValue.add({ days: 1 })}>Add 1 day</button>
<DatePicker.Root bind:value={myValue}>
```

Or fully controlled:
```svelte
let myValue = $state();
function getValue() { return myValue; }
function setValue(newValue) { myValue = newValue; }
<DatePicker.Root bind:value={getValue, setValue}>
```

**Open state**:
```svelte
let isOpen = $state(false);
<button onclick={() => isOpen = true}>Open DatePicker</button>
<DatePicker.Root bind:open={isOpen}>
```

Or fully controlled:
```svelte
let myOpen = $state(false);
function getOpen() { return myOpen; }
function setOpen(newOpen) { myOpen = newOpen; }
<DatePicker.Root bind:open={getOpen, setOpen}>
```

### API Reference

**DatePicker.Root** properties:
- `value`: DateValue (CalendarDate | CalendarDateTime | ZonedDateTime)
- `onValueChange`: (value: DateValue) => void
- `open` $bindable: boolean (default: false)
- `onOpenChange`: (open: boolean) => void
- `onOpenChangeComplete`: (open: boolean) => void
- `placeholder`: DateValue - determines which month displays when no date selected
- `onPlaceholderChange`: (date: DateValue) => void
- `isDateUnavailable`: (date: DateValue) => boolean
- `isDateDisabled`: (date: DateValue) => boolean
- `validate`: (date: DateValue) => string[] | string | void
- `onInvalid`: (reason: 'min' | 'max' | 'custom', msg?: string | string[]) => void
- `required`: boolean (default: false)
- `errorMessageId`: string - id of error message element
- `readonlySegments`: EditableSegmentPart[] - segments that prevent user input
- `disableDaysOutsideMonth`: boolean (default: false)
- `closeOnDateSelect`: boolean (default: true)
- `pagedNavigation`: boolean (default: false) - navigate by number of displayed months instead of one
- `preventDeselect`: boolean (default: false)
- `weekStartsOn`: number (0=Sunday, 1=Monday, etc.)
- `weekdayFormat`: 'narrow' | 'short' | 'long' (default: 'narrow')
- `calendarLabel`: string
- `fixedWeeks`: boolean (default: false) - always display 6 weeks
- `maxValue`: DateValue
- `minValue`: DateValue
- `locale`: string (default: 'en')
- `numberOfMonths`: number (default: 1)
- `disabled`: boolean (default: false)
- `readonly`: boolean (default: false)
- `hourCycle`: '12' | '24'
- `granularity`: 'day' | 'hour' | 'minute' | 'second' (default: 'day' for CalendarDate, 'minute' otherwise)
- `hideTimeZone`: boolean (default: false)
- `initialFocus`: boolean (default: false) - focus selected day, today, or first day of month
- `monthFormat`: short | long | narrow | numeric | 2-digit | (month: number) => string (default: 'long')
- `yearFormat`: numeric | 2-digit | (year: number) => string (default: 'numeric')

**DatePicker.Label**: renders label for date field
- `ref` $bindable: HTMLSpanElement
- Data attributes: `data-invalid`, `data-disabled`, `data-date-field-label`

**DatePicker.Input**: contains date field segments
- `ref` $bindable: HTMLDivElement
- `name`: string - for form submission
- Data attributes: `data-invalid`, `data-disabled`, `data-date-field-input`

**DatePicker.Segment**: individual date segment (day, month, year, etc.)
- `part` required: SegmentPart ('day' | 'month' | 'year' | 'hour' | 'minute' | 'second' | 'dayPeriod' | 'timeZoneName' | 'literal')
- `ref` $bindable: HTMLDivElement
- Data attributes: `data-invalid`, `data-disabled`, `data-readonly`, `data-segment`, `data-date-field-segment`

**DatePicker.Trigger**: toggles popover open/close
- `ref` $bindable: HTMLButtonElement
- Data attributes: `data-state` ('open' | 'closed'), `data-popover-trigger`

**DatePicker.Content**: popover content (positioning options from Popover component)
- `side`: 'top' | 'bottom' | 'left' | 'right' (default: 'bottom')
- `sideOffset`: number (default: 0)
- `align`: 'start' | 'center' | 'end' (default: 'start')
- `alignOffset`: number (default: 0)
- `avoidCollisions`: boolean (default: true)
- `collisionBoundary`: Element | null
- `collisionPadding`: number | Partial<Record<Side, number>> (default: 0)
- `sticky`: 'partial' | 'always' (default: 'partial')
- `hideWhenDetached`: boolean (default: true)
- `updatePositionStrategy`: 'optimized' | 'always' (default: 'optimized')
- `strategy`: 'fixed' | 'absolute' (default: 'fixed')
- `preventScroll`: boolean (default: false)
- `customAnchor`: string | HTMLElement | Measurable | null
- `onInteractOutside`: (event: PointerEvent) => void
- `onFocusOutside`: (event: FocusEvent) => void
- `interactOutsideBehavior`: 'close' | 'ignore' | 'defer-otherwise-close' | 'defer-otherwise-ignore' (default: 'close')
- `onEscapeKeydown`: (event: KeyboardEvent) => void
- `escapeKeydownBehavior`: 'close' | 'ignore' | 'defer-otherwise-close' | 'defer-otherwise-ignore' (default: 'close')
- `onOpenAutoFocus`: (event: Event) => void
- `onCloseAutoFocus`: (event: Event) => void
- `trapFocus`: boolean (default: true)
- `preventOverflowTextSelection`: boolean (default: true)
- `forceMount`: boolean (default: false)
- `dir`: 'ltr' | 'rtl' (default: 'ltr')
- CSS variables: `--bits-popover-content-transform-origin`, `--bits-popover-content-available-width`, `--bits-popover-content-available-height`, `--bits-popover-anchor-width`, `--bits-popover-anchor-height`

**DatePicker.Portal**: renders content into body or custom element
- `to`: Element | string (default: document.body)
- `disabled`: boolean (default: false)

**DatePicker.Calendar**: calendar grid container
- Data attributes: `data-invalid`, `data-disabled`, `data-readonly`, `data-calendar-root`

**DatePicker.Header**: calendar header
- Data attributes: `data-disabled`, `data-readonly`, `data-calendar-header`

**DatePicker.PrevButton**: previous month button
- Data attributes: `data-disabled`, `data-calendar-prev-button`

**DatePicker.Heading**: month/year heading
- Data attributes: `data-disabled`, `data-readonly`, `data-calendar-heading`

**DatePicker.NextButton**: next month button
- Data attributes: `data-disabled`, `data-calendar-next-button`

**DatePicker.Grid**: month grid (table)
- Data attributes: `data-disabled`, `data-readonly`, `data-calendar-grid`

**DatePicker.GridRow**: row in grid
- Data attributes: `data-disabled`, `data-readonly`, `data-calendar-grid-row`

**DatePicker.GridHead**: grid header section
- Data attributes: `data-disabled`, `data-readonly`, `data-calendar-grid-head`

**DatePicker.HeadCell**: weekday header cell
- Data attributes: `data-disabled`, `data-readonly`, `data-calendar-head-cell`

**DatePicker.GridBody**: grid body section
- Data attributes: `data-disabled`, `data-readonly`, `data-calendar-grid-body`

**DatePicker.Cell**: date cell
- `date` required: DateValue
- `month` required: DateValue
- Data attributes: `data-disabled`, `data-unavailable`, `data-today`, `data-outside-month`, `data-outside-visible-months`, `data-focused`, `data-selected`, `data-value` (YYYY-MM-DD), `data-calendar-cell`

**DatePicker.Day**: day element in cell
- Data attributes: `data-disabled`, `data-unavailable`, `data-today`, `data-outside-month`, `data-outside-visible-months`, `data-focused`, `data-selected`, `data-value` (YYYY-MM-DD), `data-calendar-day`

**DatePicker.MonthSelect**: select for month navigation
- `months`: number[] (default: [1-12])
- `monthFormat`: 'narrow' | 'short' | 'long' | 'numeric' | '2-digit' | (month: number) => string (default: 'narrow')
- Data attributes: `data-disabled`, `data-calendar-month-select`

**DatePicker.YearSelect**: select for year navigation
- `years`: number[] (default: current year ±100, constrained by minValue/maxValue if provided)
- `yearFormat`: 'numeric' | '2-digit' | (year: number) => string (default: 'numeric')
- Data attributes: `data-disabled`, `data-calendar-year-select`

Note: Read the Dates documentation to understand how dates/times work in Bits UI. Component can be customized via Date Field, Calendar, and Popover sub-components.

### date-range-field
DateRangeField: dual date field component with start/end inputs, bindable value/placeholder, granularity/validation/min-max/locale/hourCycle/readonly options, segment-based rendering.

## DateRangeField Component

Combines two Date Field components to create a date range input with separate start and end date segments.

### Basic Structure
```svelte
<DateRangeField.Root>
  <DateRangeField.Label>Check-in date</DateRangeField.Label>
  {#each ["start", "end"] as const as type}
    <DateRangeField.Input {type}>
      {#snippet children({ segments })}
        {#each segments as { part, value }}
          <DateRangeField.Segment {part}>
            {value}
          </DateRangeField.Segment>
        {/each}
      {/snippet}
    </DateRangeField.Input>
  {/each}
</DateRangeField.Root>
```

### State Management

**Placeholder (two-way binding):**
```svelte
<script>
  import { DateRangeField } from "bits-ui";
  import { CalendarDateTime } from "@internationalized/date";
  let myPlaceholder = $state(new CalendarDateTime(2024, 8, 3, 12, 30));
</script>
<DateRangeField.Root bind:placeholder={myPlaceholder}>
```

**Placeholder (fully controlled):**
```svelte
<script>
  let myPlaceholder = $state(new CalendarDateTime(2024, 8, 3, 12, 30));
  function getPlaceholder() { return myPlaceholder; }
  function setPlaceholder(newPlaceholder) { myPlaceholder = newPlaceholder; }
</script>
<DateRangeField.Root bind:placeholder={getPlaceholder, setPlaceholder}>
```

**Value (two-way binding):**
```svelte
<script>
  import { DateRangeField, type DateRange } from "bits-ui";
  import { CalendarDateTime } from "@internationalized/date";
  let myValue = $state<DateRange>({
    start: new CalendarDateTime(2024, 8, 3, 12, 30),
    end: new CalendarDateTime(2024, 8, 4, 12, 30),
  });
</script>
<button onclick={() => {
  myValue = {
    start: myValue.start.add({ days: 1 }),
    end: myValue.end.add({ days: 1 }),
  };
}}>Add 1 day</button>
<DateRangeField.Root bind:value={myValue}>
```

**Value (fully controlled):**
```svelte
<script>
  let myValue = $state<DateRange>({
    start: undefined,
    end: undefined,
  });
  function getValue() { return myValue; }
  function setValue(newValue) { myValue = newValue; }
</script>
<DateRangeField.Root bind:value={getValue, setValue}>
```

### DateRangeField.Root Props
- `value` $bindable: `DateRange` - { start: DateValue; end: DateValue }
- `onValueChange`: (value: DateRange) => void
- `placeholder` $bindable: DateValue (CalendarDate | CalendarDateTime | ZonedDateTime)
- `onPlaceholderChange`: (date: DateValue) => void
- `errorMessageId`: string - id of error message element
- `validate`: (date: DateValue) => string[] | string | void
- `onInvalid`: (reason: 'min' | 'max' | 'custom', msg?: string | string[]) => void
- `minValue`: DateValue
- `maxValue`: DateValue
- `granularity`: 'day' | 'hour' | 'minute' | 'second' (defaults to 'day' for CalendarDate, 'minute' otherwise)
- `hideTimeZone`: boolean (default: false)
- `hourCycle`: '12' | '24' (defaults to locale preference)
- `locale`: string (default: en-US)
- `disabled`: boolean (default: false)
- `readonly`: boolean (default: false)
- `readonlySegments`: EditableSegmentPart[] - segments that prevent user input
- `required`: boolean (default: false)
- `onStartValueChange`: (value: DateValue) => void
- `onEndValueChange`: (value: DateValue) => void
- `ref` $bindable: HTMLDivElement
- `children`: Snippet
- `child`: Snippet

Data attribute: `data-date-range-field-root`

### DateRangeField.Input Props
- `type` required: 'start' | 'end'
- `name`: string - for form submission, renders hidden input
- `ref` $bindable: HTMLDivElement
- `children`: Snippet with { segments: Array<{ part: SegmentPart; value: string }> }
- `child`: Snippet

Data attributes: `data-invalid`, `data-disabled`, `data-date-field-input`

### DateRangeField.Segment Props
- `part` required: SegmentPart - "month" | "day" | "year" | "hour" | "minute" | "second" | "dayPeriod" | "timeZoneName" | "literal"
- `ref` $bindable: HTMLSpanElement
- `children`: Snippet
- `child`: Snippet

Data attributes: `data-invalid`, `data-disabled`, `data-segment`, `data-date-field-segment`

### DateRangeField.Label Props
- `ref` $bindable: HTMLSpanElement
- `children`: Snippet
- `child`: Snippet

Data attributes: `data-invalid`, `data-date-field-label`

**Note:** Requires understanding of date/time handling in Bits UI (see Dates documentation).

### date-range-picker
DateRangePicker: composite date range selector with segmented input field and calendar popup; supports two-way/controlled binding, date constraints (min/max/unavailable/disabled), range constraints (minDays/maxDays), granularity control (day/hour/minute/second), locale/formatting options, and extensive customization via sub-components (Label, Input, Segment, Trigger, Content, Calendar, Header, Grid, Cell, Day, MonthSelect, YearSelect) with data attributes for styling.

## DateRangePicker Component

A composite component for selecting date ranges using an input field and calendar interface. Combines DateRangeField, RangeCalendar, and Popover components.

### Basic Structure
```svelte
<DateRangePicker.Root>
  <DateRangePicker.Label />
  {#each ["start", "end"] as type}
    <DateRangePicker.Input {type}>
      {#snippet children({ segments })}
        {#each segments as { part, value }}
          <DateRangePicker.Segment {part}>{value}</DateRangePicker.Segment>
        {/each}
      {/snippet}
    </DateRangePicker.Input>
  {/each}
  <DateRangePicker.Trigger />
  <DateRangePicker.Content>
    <DateRangePicker.Calendar>
      {#snippet children({ months, weekdays })}
        <DateRangePicker.Header>
          <DateRangePicker.PrevButton />
          <DateRangePicker.Heading />
          <DateRangePicker.NextButton />
        </DateRangePicker.Header>
        {#each months as month}
          <DateRangePicker.Grid>
            <DateRangePicker.GridHead>
              <DateRangePicker.GridRow>
                {#each weekdays as day}
                  <DateRangePicker.HeadCell>{day}</DateRangePicker.HeadCell>
                {/each}
              </DateRangePicker.GridRow>
            </DateRangePicker.GridHead>
            <DateRangePicker.GridBody>
              {#each month.weeks as weekDates}
                <DateRangePicker.GridRow>
                  {#each weekDates as date}
                    <DateRangePicker.Cell {date} month={month.value}>
                      <DateRangePicker.Day>{date.day}</DateRangePicker.Day>
                    </DateRangePicker.Cell>
                  {/each}
                </DateRangePicker.GridRow>
              {/each}
            </DateRangePicker.GridBody>
          </DateRangePicker.Grid>
        {/each}
      {/snippet}
    </DateRangePicker.Calendar>
  </DateRangePicker.Content>
</DateRangePicker.Root>
```

### State Management

**Placeholder** (determines segment starting point when no value exists):
```svelte
<script>
  import { CalendarDateTime } from "@internationalized/date";
  let myPlaceholder = $state(new CalendarDateTime(2024, 8, 3, 12, 30));
</script>
<DateRangePicker.Root bind:placeholder={myPlaceholder}>
```

Or fully controlled:
```svelte
let myPlaceholder = $state();
function getPlaceholder() { return myPlaceholder; }
function setPlaceholder(newPlaceholder) { myPlaceholder = newPlaceholder; }
<DateRangePicker.Root bind:placeholder={getPlaceholder, setPlaceholder}>
```

**Value** (selected date range):
```svelte
let myValue = $state({
  start: new CalendarDateTime(2024, 8, 3, 12, 30),
  end: new CalendarDateTime(2024, 8, 4, 12, 30),
});
<DateRangePicker.Root bind:value={myValue}>
```

Or fully controlled:
```svelte
let myValue = $state();
function getValue() { return myValue; }
function setValue(newValue) { myValue = newValue; }
<DateRangePicker.Root bind:value={getValue, setValue}>
```

**Open state**:
```svelte
let isOpen = $state(false);
<button onclick={() => (isOpen = true)}>Open</button>
<DateRangePicker.Root bind:open={isOpen}>
```

Or fully controlled:
```svelte
let myOpen = $state(false);
function getOpen() { return myOpen; }
function setOpen(newOpen) { myOpen = newOpen; }
<DateRangePicker.Root bind:open={getOpen, setOpen}>
```

### Root Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `value` $bindable | `{ start: DateValue; end: DateValue }` | undefined | Selected date range |
| `onValueChange` | `(value: DateRange) => void` | undefined | Callback when value changes |
| `placeholder` $bindable | `DateValue` | undefined | Placeholder date for segments |
| `onPlaceholderChange` | `(date: DateValue) => void` | undefined | Callback when placeholder changes |
| `readonlySegments` | `EditableSegmentPart[]` | undefined | Segments that prevent user input |
| `isDateUnavailable` | `(date: DateValue) => boolean` | undefined | Function to mark dates unavailable |
| `minValue` | `DateValue` | undefined | Minimum valid date |
| `maxValue` | `DateValue` | undefined | Maximum valid date |
| `validate` | `(date: DateValue) => string[] \| string \| void` | undefined | Custom validation function |
| `onInvalid` | `(reason: 'min' \| 'max' \| 'custom', msg?: string \| string[]) => void` | undefined | Callback when value is invalid |
| `granularity` | `'day' \| 'hour' \| 'minute' \| 'second'` | 'day' for CalendarDate, 'minute' otherwise | Date segment precision |
| `hideTimeZone` | `boolean` | false | Hide timezone segment |
| `errorMessageId` | `string` | undefined | ID of error message element |
| `hourCycle` | `'12' \| '24'` | locale preference | Hour format |
| `locale` | `string` | 'en-US' | Locale for formatting |
| `disabled` | `boolean` | false | Disable field |
| `readonly` | `boolean` | false | Make field readonly |
| `required` | `boolean` | false | Require date selection |
| `closeOnRangeSelect` | `boolean` | true | Close popover after range selected |
| `disableDaysOutsideMonth` | `boolean` | false | Disable days outside current month |
| `pagedNavigation` | `boolean` | false | Navigate by number of displayed months |
| `preventDeselect` | `boolean` | false | Prevent deselecting without selecting another |
| `weekdayFormat` | `'narrow' \| 'short' \| 'long'` | 'narrow' | Weekday label format |
| `weekStartsOn` | `number` | locale default | Day to start week (0=Sunday) |
| `calendarLabel` | `string` | undefined | Accessible calendar label |
| `fixedWeeks` | `boolean` | false | Always display 6 weeks |
| `isDateDisabled` | `(date: DateValue) => boolean` | undefined | Function to disable specific dates |
| `numberOfMonths` | `number` | 1 | Months to display simultaneously |
| `open` $bindable | `boolean` | false | Popover open state |
| `onOpenChange` | `(open: boolean) => void` | undefined | Callback when open state changes |
| `onOpenChangeComplete` | `(open: boolean) => void` | undefined | Callback after animations complete |
| `onEndValueChange` | `(value: DateValue) => void` | undefined | Callback when end date changes |
| `onStartValueChange` | `(value: DateValue) => void` | undefined | Callback when start date changes |
| `minDays` | `number` | undefined | Minimum days in range |
| `maxDays` | `number` | undefined | Maximum days in range |
| `excludeDisabled` | `boolean` | false | Reset range if any date becomes disabled |
| `monthFormat` | `'short' \| 'long' \| 'narrow' \| 'numeric' \| '2-digit' \| (month: number) => string` | 'long' | Month label format |
| `yearFormat` | `'numeric' \| '2-digit' \| (year: number) => string` | 'numeric' | Year label format |

### Data Attributes on Root
- `data-invalid` - Present when calendar is invalid
- `data-disabled` - Present when calendar is disabled
- `data-readonly` - Present when calendar is readonly
- `data-calendar-root` - Always present

### Sub-components

**Label**: Renders span with `data-date-field-label`, `data-invalid`

**Input**: Contains date segments. Props: `type` (required, 'start' | 'end'), `name` (for form submission)

**Segment**: Individual date part. Props: `part` (required, 'month' | 'day' | 'year' | 'hour' | 'minute' | 'second' | 'dayPeriod' | 'literal'). Data attributes: `data-segment`, `data-date-field-segment`, `data-invalid`, `data-disabled`

**Trigger**: Button to toggle popover. Data attributes: `data-state` ('open' | 'closed'), `data-popover-trigger`

**Content**: Popover content container. Props include floating UI options (side, sideOffset, align, alignOffset, avoidCollisions, etc.), focus management (trapFocus, onOpenAutoFocus, onCloseAutoFocus), interaction handling (onInteractOutside, onEscapeKeydown, interactOutsideBehavior, escapeKeydownBehavior), and rendering (forceMount, dir). CSS variables: `--bits-popover-content-transform-origin`, `--bits-popover-content-available-width`, `--bits-popover-content-available-height`, `--bits-popover-anchor-width`, `--bits-popover-anchor-height`

**Portal**: Renders content into body or custom element. Props: `to` (target element, default body), `disabled` (disable portal)

**Calendar**: Calendar grid container. Data attributes: `data-invalid`, `data-disabled`, `data-readonly`, `data-calendar-root`

**Header**: Calendar header. Data attributes: `data-disabled`, `data-readonly`, `data-range-calendar-header`

**PrevButton/NextButton**: Navigation buttons. Data attributes: `data-disabled`, `data-range-calendar-prev-button` / `data-range-calendar-next-button`

**Heading**: Month/year display. Data attributes: `data-disabled`, `data-readonly`, `data-range-calendar-heading`

**Grid**: Month grid (table). Data attributes: `data-disabled`, `data-readonly`, `data-range-calendar-grid`

**GridRow**: Table row. Data attributes: `data-disabled`, `data-readonly`, `data-range-calendar-grid-row`

**GridHead**: Table head. Data attributes: `data-disabled`, `data-readonly`, `data-range-calendar-grid-head`

**HeadCell**: Weekday header cell. Data attributes: `data-disabled`, `data-readonly`, `data-range-calendar-head-cell`

**GridBody**: Table body. Data attributes: `data-disabled`, `data-readonly`, `data-range-calendar-grid-body`

**Cell**: Date cell. Props: `date` (required), `month` (required). Data attributes: `data-disabled`, `data-unavailable`, `data-today`, `data-outside-month`, `data-outside-visible-months`, `data-focused`, `data-selected`, `data-value` (YYYY-MM-DD), `data-range-calendar-cell`, `data-range-start`, `data-range-end`, `data-range-middle`, `data-highlighted`

**Day**: Day element inside cell. Data attributes: same as Cell plus `data-range-calendar-day`

**MonthSelect**: Select for month navigation. Props: `months` (number[], default 1-12), `monthFormat`. Snippet props: `monthItems`, `selectedMonthItem`. Data attributes: `data-disabled`, `data-range-calendar-month-select`

**YearSelect**: Select for year navigation. Props: `years` (number[], default current±100), `yearFormat`. Snippet props: `yearItems`, `selectedYearItem`. Data attributes: `data-disabled`, `data-range-calendar-year-select`

### Notes
- Requires understanding of dates/times in Bits UI (see Dates documentation)
- Composed of DateRangeField, RangeCalendar, and Popover components
- All components support `ref` binding and child/children snippets for customization

### dialog
Modal dialog component with compound structure, focus management, customizable escape/outside-click behavior, nested dialog support with CSS variables, Svelte transition support via forceMount, and form integration patterns.

# Dialog Component

Modal window for displaying content or requesting user input using a compound component pattern.

## Architecture

Composed of sub-components: `Root` (state management), `Trigger` (toggle button), `Portal` (renders outside DOM), `Overlay` (backdrop), `Content` (main container), `Title`, `Description`, `Close`.

```svelte
<Dialog.Root>
  <Dialog.Trigger>Open</Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content>
      <Dialog.Title>Title</Dialog.Title>
      <Dialog.Description>Description</Dialog.Description>
      <Dialog.Close>Close</Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

## State Management

**Two-way binding:**
```svelte
<script>
  let isOpen = $state(false);
</script>
<button onclick={() => (isOpen = true)}>Open</button>
<Dialog.Root bind:open={isOpen}>...</Dialog.Root>
```

**Fully controlled with function binding:**
```svelte
<Dialog.Root bind:open={getOpen, setOpen}>...</Dialog.Root>
```

## Focus Management

- **Focus trap** (default): Keyboard focus stays within dialog. Disable with `trapFocus={false}` on `Dialog.Content`.
- **Open focus**: Automatically focuses first focusable element. Customize with `onOpenAutoFocus`:
```svelte
<Dialog.Content onOpenAutoFocus={(e) => { e.preventDefault(); nameInput?.focus(); }}>
```
- **Close focus**: Returns focus to trigger. Customize with `onCloseAutoFocus`.

## Advanced Behaviors

**Scroll lock** (default enabled): Disable body scrolling when dialog opens. Customize with `preventScroll={false}` on `Dialog.Content`.

**Escape key handling:**
- `escapeKeydownBehavior`: `'close'` (default), `'ignore'`, `'defer-otherwise-close'`, `'defer-otherwise-ignore'`
- `onEscapeKeydown`: Custom handler with `event.preventDefault()`

**Outside interaction:**
- `interactOutsideBehavior`: `'close'` (default), `'ignore'`, `'defer-otherwise-close'`, `'defer-otherwise-ignore'`
- `onInteractOutside`: Custom handler with `event.preventDefault()`

## Nested Dialogs

Dialogs can nest within each other. Use data attributes and CSS variables for styling:
- `data-nested-open`: Present when nested dialogs are open
- `data-nested`: Present on nested dialog
- `--bits-dialog-depth`: Nesting depth (0 for root)
- `--bits-dialog-nested-count`: Number of open nested dialogs

```svelte
<Dialog.Content
  style="transform: scale(calc(1 - var(--bits-dialog-nested-count) * 0.05));
         filter: blur(calc(var(--bits-dialog-nested-count) * 2px));"
>
```

## Svelte Transitions

Use `forceMount` with `child` snippet for animations:
```svelte
<Dialog.Overlay forceMount>
  {#snippet child({ props, open })}
    {#if open}
      <div {...props} transition:fade>...</div>
    {/if}
  {/snippet}
</Dialog.Overlay>
```

Reusable wrapper:
```svelte
<script>
  import { Dialog } from "bits-ui";
  import { fade } from "svelte/transition";
  let { duration = 200, children, ...restProps } = $props();
</script>
<Dialog.Overlay forceMount {...restProps}>
  {#snippet child({ props, open })}
    {#if open}
      <div {...props} transition:fade={{ duration }}>
        {@render children?.()}
      </div>
    {/if}
  {/snippet}
</Dialog.Overlay>
```

## Reusable Components

Create custom wrapper:
```svelte
<script>
  import { Dialog } from "bits-ui";
  let { open = $bindable(false), buttonText, title, description, contentProps, children, ...restProps } = $props();
</script>
<Dialog.Root bind:open {...restProps}>
  <Dialog.Trigger>{buttonText}</Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content {...contentProps}>
      <Dialog.Title>{@render title()}</Dialog.Title>
      <Dialog.Description>{@render description()}</Dialog.Description>
      {@render children?.()}
      <Dialog.Close>Close</Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

Usage:
```svelte
<MyDialog buttonText="Open">
  {#snippet title()}Account settings{/snippet}
  {#snippet description()}Manage settings{/snippet}
</MyDialog>
```

## Form Submission

Close dialog after async action:
```svelte
<form onsubmit={() => { wait(1000).then(() => (open = false)); }}>
  <button type="submit">Submit</button>
</form>
```

When dialog is *inside* a form, disable `Portal` to keep content in form context.

## API Reference

**Dialog.Root**: `open` (bindable boolean), `onOpenChange`, `onOpenChangeComplete`, `children`

**Dialog.Trigger**: `ref` (bindable HTMLButtonElement), `children`, `child` snippet

**Dialog.Portal**: `to` (Element|string, default body), `disabled` (boolean), `children`

**Dialog.Content**: 
- Focus: `onOpenAutoFocus`, `onCloseAutoFocus`, `trapFocus` (default true)
- Escape: `onEscapeKeydown`, `escapeKeydownBehavior` (default 'close')
- Outside: `onInteractOutside`, `interactOutsideBehavior` (default 'close')
- Scroll: `preventScroll` (default true), `restoreScrollDelay`
- Rendering: `forceMount`, `preventOverflowTextSelection` (default true)
- `ref` (bindable HTMLDivElement), `children`, `child` snippet
- Data attributes: `data-state` ('open'|'closed'), `data-dialog-content`, `data-nested-open`, `data-nested`
- CSS variables: `--bits-dialog-depth`, `--bits-dialog-nested-count`

**Dialog.Overlay**: `forceMount`, `ref` (bindable HTMLDivElement), `children`, `child` snippet, same data attributes and CSS variables as Content

**Dialog.Close**: `ref` (bindable HTMLButtonElement), `children`, `child` snippet

**Dialog.Title**: `level` (1-6, default 3), `ref` (bindable HTMLDivElement), `children`, `child` snippet

**Dialog.Description**: `ref` (bindable HTMLDivElement), `children`, `child` snippet

### dropdown-menu
Dropdown menu with items, groups, checkboxes, radio buttons, nested submenus, keyboard navigation, state binding, transitions, and floating UI positioning.

## Dropdown Menu Component

A menu component that displays selectable items when triggered. Supports groups, checkboxes, radio buttons, nested submenus, and keyboard navigation.

### Basic Structure
```svelte
<DropdownMenu.Root>
  <DropdownMenu.Trigger />
  <DropdownMenu.Portal>
    <DropdownMenu.Content>
      <DropdownMenu.Item />
      <DropdownMenu.CheckboxItem />
      <DropdownMenu.RadioGroup>
        <DropdownMenu.RadioItem />
      </DropdownMenu.RadioGroup>
      <DropdownMenu.Separator />
    </DropdownMenu.Content>
  </DropdownMenu.Portal>
</DropdownMenu.Root>
```

### State Management

**Two-way binding:**
```svelte
<script>
  let isOpen = $state(false);
</script>
<DropdownMenu.Root bind:open={isOpen}>
  <!-- ... -->
</DropdownMenu.Root>
```

**Fully controlled with function bindings:**
```svelte
<script>
  let myOpen = $state(false);
  function getOpen() { return myOpen; }
  function setOpen(newOpen) { myOpen = newOpen; }
</script>
<DropdownMenu.Root bind:open={getOpen, setOpen}>
  <!-- ... -->
</DropdownMenu.Root>
```

### Groups
Group related items with `DropdownMenu.Group` and either `DropdownMenu.GroupHeading` or `aria-label`:
```svelte
<DropdownMenu.Group>
  <DropdownMenu.GroupHeading>File</DropdownMenu.GroupHeading>
  <DropdownMenu.Item>New</DropdownMenu.Item>
  <DropdownMenu.Item>Open</DropdownMenu.Item>
</DropdownMenu.Group>
<!-- or -->
<DropdownMenu.Group aria-label="file">
  <DropdownMenu.Item>New</DropdownMenu.Item>
</DropdownMenu.Group>
```

### Radio Groups
Only one item can be selected at a time. State persists in `$state` variable:
```svelte
<script>
  let value = $state("one");
</script>
<DropdownMenu.RadioGroup bind:value>
  <DropdownMenu.GroupHeading>Favorite number</DropdownMenu.GroupHeading>
  {#each ["one", "two", "three"] as val}
    <DropdownMenu.RadioItem {value: val}>
      {#snippet children({ checked })}
        {#if checked}✅{/if}
        {val}
      {/snippet}
    </DropdownMenu.RadioItem>
  {/each}
</DropdownMenu.RadioGroup>
```

### Checkbox Items
Individual checkboxes or checkbox groups:
```svelte
<script>
  let notifications = $state(true);
</script>
<DropdownMenu.CheckboxItem bind:checked={notifications}>
  {#snippet children({ checked, indeterminate })}
    {#if indeterminate}-{:else if checked}✅{/if}
    Notifications
  {/snippet}
</DropdownMenu.CheckboxItem>
```

**Checkbox groups** (multiple selections):
```svelte
<script>
  let colors = $state<string[]>([]);
</script>
<DropdownMenu.CheckboxGroup bind:value={colors}>
  <DropdownMenu.GroupHeading>Favorite color</DropdownMenu.GroupHeading>
  <DropdownMenu.CheckboxItem value="red">
    {#snippet children({ checked })}
      {#if checked}✅{/if}
      Red
    {/snippet}
  </DropdownMenu.CheckboxItem>
  <!-- more items -->
</DropdownMenu.CheckboxGroup>
```

### Nested Menus
Use `DropdownMenu.Sub` for submenus:
```svelte
<DropdownMenu.Content>
  <DropdownMenu.Item>Item 1</DropdownMenu.Item>
  <DropdownMenu.Sub>
    <DropdownMenu.SubTrigger>Open Sub Menu</DropdownMenu.SubTrigger>
    <DropdownMenu.SubContent>
      <DropdownMenu.Item>Sub Item 1</DropdownMenu.Item>
    </DropdownMenu.SubContent>
  </DropdownMenu.Sub>
</DropdownMenu.Content>
```

### Svelte Transitions
Use `forceMount` with child snippet for transition control:
```svelte
<script>
  import { fly } from "svelte/transition";
</script>
<DropdownMenu.Content forceMount>
  {#snippet child({ wrapperProps, props, open })}
    {#if open}
      <div {...wrapperProps}>
        <div {...props} transition:fly>
          <DropdownMenu.Item>Item 1</DropdownMenu.Item>
        </div>
      </div>
    {/if}
  {/snippet}
</DropdownMenu.Content>
```

### Custom Anchor
Anchor content to a different element:
```svelte
<script>
  let customAnchor = $state<HTMLElement>(null!);
</script>
<div bind:this={customAnchor}></div>
<DropdownMenu.Root>
  <DropdownMenu.Trigger />
  <DropdownMenu.Content {customAnchor}>
    <!-- ... -->
  </DropdownMenu.Content>
</DropdownMenu.Root>
```

### Reusable Component Example
```svelte
<!-- MyDropdownMenu.svelte -->
<script lang="ts">
  import { DropdownMenu, type WithoutChild } from "bits-ui";
  type Props = DropdownMenu.RootProps & {
    buttonText: string;
    items: string[];
    contentProps?: WithoutChild<DropdownMenu.ContentProps>;
  };
  let { open = $bindable(false), buttonText, items, contentProps, ...restProps } = $props();
</script>
<DropdownMenu.Root bind:open {...restProps}>
  <DropdownMenu.Trigger>{buttonText}</DropdownMenu.Trigger>
  <DropdownMenu.Portal>
    <DropdownMenu.Content {...contentProps}>
      <DropdownMenu.Group aria-label={buttonText}>
        {#each items as item}
          <DropdownMenu.Item textValue={item}>{item}</DropdownMenu.Item>
        {/each}
      </DropdownMenu.Group>
    </DropdownMenu.Content>
  </DropdownMenu.Portal>
</DropdownMenu.Root>
```

Usage: `<MyDropdownMenu buttonText="Select a manager" items={["Michael Scott", "Dwight Schrute", "Jim Halpert"]} />`

### Key Props

**Root:** `open` (bindable), `onOpenChange`, `onOpenChangeComplete`, `dir`

**Trigger:** `disabled`, `ref` (bindable)

**Content:** `side` (top/bottom/left/right), `sideOffset`, `align` (start/center/end), `alignOffset`, `avoidCollisions`, `sticky` (partial/always), `hideWhenDetached`, `strategy` (fixed/absolute), `preventScroll`, `customAnchor`, `trapFocus`, `forceMount`, `loop`, `dir`

**Item:** `disabled`, `textValue`, `onSelect`, `closeOnSelect`

**CheckboxItem:** `disabled`, `checked` (bindable), `onCheckedChange`, `indeterminate` (bindable), `value`, `textValue`, `onSelect`, `closeOnSelect`

**RadioItem:** `value` (required), `disabled`, `textValue`, `onSelect`, `closeOnSelect`

**Sub:** `open` (bindable), `onOpenChange`, `onOpenChangeComplete`

**SubTrigger:** `disabled`, `openDelay` (100ms default), `textValue`, `onSelect`

### Data Attributes
- `data-state`: 'open' | 'closed' (on Trigger, Content, SubTrigger, SubContent, Arrow)
- `data-highlighted`: present when item is highlighted
- `data-disabled`: present when item is disabled
- `data-dropdown-menu-*`: various elements have specific attributes

### CSS Variables
- `--bits-dropdown-menu-content-transform-origin`
- `--bits-dropdown-menu-content-available-width`
- `--bits-dropdown-menu-content-available-height`
- `--bits-dropdown-menu-anchor-width`
- `--bits-dropdown-menu-anchor-height`

### label
Label component for associating text with form inputs; supports bindable ref, snippet children, render delegation, and data-label-root attribute.

## Label Component

Enhanced label element for associating with form inputs.

### Basic Usage

```svelte
<script lang="ts">
  import { Label } from "bits-ui";
</script>

<Label.Root id="terms-label" for="terms">
  Accept terms and conditions
</Label.Root>
```

### With Checkbox Example

```svelte
<script lang="ts">
  import { Checkbox, Label } from "bits-ui";
  import Check from "phosphor-svelte/lib/Check";
  import Minus from "phosphor-svelte/lib/Minus";
</script>

<div class="flex items-center space-x-3">
  <Checkbox.Root
    id="terms"
    aria-labelledby="terms-label"
    class="border-muted bg-foreground data-[state=unchecked]:border-border-input data-[state=unchecked]:bg-background data-[state=unchecked]:hover:border-dark-40 peer inline-flex size-[25px] items-center justify-center rounded-md border transition-all duration-150 ease-in-out active:scale-[0.98]"
    name="hello"
  >
    {#snippet children({ checked, indeterminate })}
      <div class="text-background inline-flex items-center justify-center">
        {#if indeterminate}
          <Minus class="size-[15px]" weight="bold" />
        {:else if checked}
          <Check class="size-[15px]" weight="bold" />
        {/if}
      </div>
    {/snippet}
  </Checkbox.Root>
  <Label.Root
    id="terms-label"
    for="terms"
    class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
  >
    Accept terms and conditions
  </Label.Root>
</div>
```

### API Reference

**Label.Root** - Enhanced label component

| Property | Type | Description |
|----------|------|-------------|
| `ref` $bindable | `HTMLLabelElement` | Bindable reference to the underlying DOM element |
| `children` | `Snippet` | Content to render inside the label |
| `child` | `Snippet<{ props: Record<string, unknown> }>` | Render delegation snippet for custom element rendering (see Child Snippet docs) |

**Data Attributes**

| Attribute | Value | Description |
|-----------|-------|-------------|
| `data-label-root` | `''` | Present on the root element |

### link-preview
LinkPreview component for displaying content previews on hover/focus with Floating UI positioning, state management, transitions, custom anchoring, and configurable interaction behavior.

## LinkPreview Component

A component that displays a summarized preview of linked content on hover/focus without navigating away. Only works with mouse/pointing devices; on touch devices the link is followed immediately. Preview content should not contain vital information since it's not accessible to all users.

### Structure
```svelte
<LinkPreview.Root>
  <LinkPreview.Trigger />
  <LinkPreview.Content />
</LinkPreview.Root>
```

### Basic Example
```svelte
<LinkPreview.Root>
  <LinkPreview.Trigger href="https://x.com/huntabyte" target="_blank" rel="noreferrer noopener">
    <Avatar.Root>
      <Avatar.Image src="/avatar-1.png" alt="@huntabyte" />
      <Avatar.Fallback>HB</Avatar.Fallback>
    </Avatar.Root>
  </LinkPreview.Trigger>
  <LinkPreview.Content sideOffset={8}>
    <div class="flex space-x-4">
      <Avatar.Root>
        <Avatar.Image src="/avatar-1.png" alt="@huntabyte" />
        <Avatar.Fallback>HB</Avatar.Fallback>
      </Avatar.Root>
      <div class="space-y-1 text-sm">
        <h4>@huntabyte</h4>
        <p>I do things on the internet.</p>
        <div class="flex items-center gap-[21px] pt-2 text-xs">
          <div><MapPin class="mr-1 size-4" /> FL, USA</div>
          <div><CalendarBlank class="mr-1 size-4" /> Joined May 2020</div>
        </div>
      </div>
    </div>
  </LinkPreview.Content>
</LinkPreview.Root>
```

### State Management

**Two-way binding:**
```svelte
<script>
  let isOpen = $state(false);
</script>
<button onclick={() => (isOpen = true)}>Open Link Preview</button>
<LinkPreview.Root bind:open={isOpen}>
  <!-- ... -->
</LinkPreview.Root>
```

**Fully controlled with function binding:**
```svelte
<script>
  let myOpen = $state(false);
  function getOpen() { return myOpen; }
  function setOpen(newOpen: boolean) { myOpen = newOpen; }
</script>
<LinkPreview.Root bind:open={getOpen, setOpen}>
  <!-- ... -->
</LinkPreview.Root>
```

### Floating UI

By default, `LinkPreview.Content` uses Floating UI for positioning. To opt-out, use `LinkPreview.ContentStatic` instead:
```svelte
<LinkPreview.Root>
  <LinkPreview.Trigger />
  <LinkPreview.ContentStatic>
    <!-- ... -->
  </LinkPreview.ContentStatic>
</LinkPreview.Root>
```

Note: `LinkPreview.Arrow` is designed for Floating UI and may behave unexpectedly with `ContentStatic`.

### Custom Anchor

Anchor content to a different element instead of the trigger:
```svelte
<script>
  let customAnchor = $state<HTMLElement>(null!);
</script>
<div bind:this={customAnchor}></div>
<LinkPreview.Root>
  <LinkPreview.Trigger />
  <LinkPreview.Content {customAnchor}>
    <!-- ... -->
  </LinkPreview.Content>
</LinkPreview.Root>
```

### Svelte Transitions

Use `forceMount` with the `child` snippet to enable transitions:
```svelte
<LinkPreview.Content forceMount>
  {#snippet child({ wrapperProps, props, open })}
    {#if open}
      <div {...wrapperProps}>
        <div {...props} transition:fly={{ duration: 300 }}>
          <!-- content -->
        </div>
      </div>
    {/if}
  {/snippet}
</LinkPreview.Content>
```

### API Reference

**LinkPreview.Root**
- `open` (bindable): boolean, default false
- `onOpenChange`: (open: boolean) => void
- `onOpenChangeComplete`: (open: boolean) => void
- `openDelay`: number, default 700ms
- `closeDelay`: number, default 300ms
- `disabled`: boolean, default false
- `ignoreNonKeyboardFocus`: boolean, default false

**LinkPreview.Trigger**
- `ref` (bindable): HTMLAnchorElement
- `children`: Snippet
- `child`: Snippet with props
- Data attributes: `data-state` ('open' | 'closed'), `data-link-preview-trigger`

**LinkPreview.Content** (with Floating UI)
- `side`: 'top' | 'bottom' | 'left' | 'right', default 'bottom'
- `sideOffset`: number, default 0
- `align`: 'start' | 'center' | 'end', default 'start'
- `alignOffset`: number, default 0
- `arrowPadding`: number, default 0
- `avoidCollisions`: boolean, default true
- `collisionBoundary`: Element | null
- `collisionPadding`: number | Partial<Record<Side, number>>, default 0
- `sticky`: 'partial' | 'always', default 'partial'
- `hideWhenDetached`: boolean, default true
- `updatePositionStrategy`: 'optimized' | 'always', default 'optimized'
- `strategy`: 'fixed' | 'absolute', default 'fixed'
- `preventScroll`: boolean, default true
- `customAnchor`: string | HTMLElement | Measurable | null, default null
- `onInteractOutside`: (event: PointerEvent) => void
- `onFocusOutside`: (event: FocusEvent) => void
- `interactOutsideBehavior`: 'close' | 'ignore' | 'defer-otherwise-close' | 'defer-otherwise-ignore', default 'close'
- `onEscapeKeydown`: (event: KeyboardEvent) => void
- `escapeKeydownBehavior`: 'close' | 'ignore' | 'defer-otherwise-close' | 'defer-otherwise-ignore', default 'close'
- `onOpenAutoFocus`: (event: Event) => void
- `onCloseAutoFocus`: (event: Event) => void
- `trapFocus`: boolean, default true
- `dir`: 'ltr' | 'rtl', default 'ltr'
- `forceMount`: boolean, default false
- `ref` (bindable): HTMLDivElement
- `children`: Snippet
- `child`: Snippet with props
- Data attributes: `data-state` ('open' | 'closed'), `data-link-preview-content`
- CSS variables: `--bits-link-preview-content-transform-origin`, `--bits-link-preview-content-available-width`, `--bits-link-preview-content-available-height`, `--bits-link-preview-anchor-width`, `--bits-link-preview-anchor-height`

**LinkPreview.ContentStatic** (without Floating UI)
- `onInteractOutside`, `onFocusOutside`, `interactOutsideBehavior`, `onEscapeKeydown`, `escapeKeydownBehavior`, `onOpenAutoFocus`, `onCloseAutoFocus`, `trapFocus`, `dir`, `forceMount`, `ref`, `children`, `child`
- Data attributes: `data-state`, `data-link-preview-content`

**LinkPreview.Arrow**
- `width`: number, default 8
- `height`: number, default 8
- `ref` (bindable): HTMLDivElement
- `children`: Snippet
- `child`: Snippet with props
- Data attribute: `data-link-preview-arrow`

**LinkPreview.Portal**
- `to`: Element | string, default document.body
- `disabled`: boolean, default false
- `children`: Snippet

### menubar
Menubar component with nested menus, radio/checkbox items, keyboard navigation, floating UI positioning, and state management via two-way or function bindings.

## Menubar Component

A horizontal bar containing a collection of menus with support for nested submenus, radio groups, checkbox items, and keyboard navigation.

### Basic Structure

```svelte
<Menubar.Root>
  <Menubar.Menu>
    <Menubar.Trigger>File</Menubar.Trigger>
    <Menubar.Portal>
      <Menubar.Content>
        <Menubar.Item>Item 1</Menubar.Item>
        <Menubar.CheckboxItem bind:checked={value}>
          {#snippet children({ checked })}
            {checked ? "✅" : ""} Label
          {/snippet}
        </Menubar.CheckboxItem>
        <Menubar.RadioGroup bind:value={selected}>
          <Menubar.RadioItem value="option1">
            {#snippet children({ checked })}
              {checked ? "✅" : ""} Option 1
            {/snippet}
          </Menubar.RadioItem>
        </Menubar.RadioGroup>
        <Menubar.Sub>
          <Menubar.SubTrigger>Submenu</Menubar.SubTrigger>
          <Menubar.SubContent>
            <Menubar.Item>Sub Item</Menubar.Item>
          </Menubar.SubContent>
        </Menubar.Sub>
        <Menubar.Separator />
      </Menubar.Content>
    </Menubar.Portal>
  </Menubar.Menu>
</Menubar.Root>
```

### State Management

**Two-way binding:**
```svelte
<script>
  let activeValue = $state("");
</script>
<Menubar.Root bind:value={activeValue}>
  <Menubar.Menu value="menu-1">...</Menubar.Menu>
</Menubar.Root>
```

**Fully controlled with function bindings:**
```svelte
<script>
  let activeValue = $state("");
  function getValue() { return activeValue; }
  function setValue(newValue) { activeValue = newValue; }
</script>
<Menubar.Root bind:value={getValue, setValue}>
  <Menubar.Menu value="menu-1">...</Menubar.Menu>
</Menubar.Root>
```

### Checkbox Items

```svelte
<script>
  let notifications = $state(true);
</script>
<Menubar.CheckboxItem bind:checked={notifications}>
  {#snippet children({ checked, indeterminate })}
    {#if indeterminate}-{:else if checked}✅{/if}
    Notifications
  {/snippet}
</Menubar.CheckboxItem>
```

### Checkbox Groups

```svelte
<script>
  let colors = $state<string[]>([]);
</script>
<Menubar.CheckboxGroup bind:value={colors}>
  <Menubar.GroupHeading>Favorite color</Menubar.GroupHeading>
  <Menubar.CheckboxItem value="red">
    {#snippet children({ checked })}
      {checked ? "✅" : ""} Red
    {/snippet}
  </Menubar.CheckboxItem>
  <Menubar.CheckboxItem value="blue">
    {#snippet children({ checked })}
      {checked ? "✅" : ""} Blue
    {/snippet}
  </Menubar.CheckboxItem>
</Menubar.CheckboxGroup>
```

### Radio Groups

```svelte
<script>
  let value = $state("one");
</script>
<Menubar.RadioGroup bind:value>
  {#each ["one", "two", "three"] as val}
    <Menubar.RadioItem value={val}>
      {#snippet children({ checked })}
        {checked ? "✅" : ""} {val}
      {/snippet}
    </Menubar.RadioItem>
  {/each}
</Menubar.RadioGroup>
```

### Nested Menus

```svelte
<Menubar.Content>
  <Menubar.Item>Item 1</Menubar.Item>
  <Menubar.Sub>
    <Menubar.SubTrigger>Open Sub Menu</Menubar.SubTrigger>
    <Menubar.SubContent>
      <Menubar.Item>Sub Item 1</Menubar.Item>
      <Menubar.Item>Sub Item 2</Menubar.Item>
    </Menubar.SubContent>
  </Menubar.Sub>
</Menubar.Content>
```

### Reusable Components

```svelte
<!-- MyMenubarMenu.svelte -->
<script lang="ts">
  import { Menubar, type WithoutChildrenOrChild } from "bits-ui";
  type Props = WithoutChildrenOrChild<Menubar.MenuProps> & {
    triggerText: string;
    items: { label: string; value: string; onSelect?: () => void }[];
    contentProps?: WithoutChildrenOrChild<Menubar.ContentProps>;
  };
  let { triggerText, items, contentProps, ...restProps }: Props = $props();
</script>
<Menubar.Menu {...restProps}>
  <Menubar.Trigger>{triggerText}</Menubar.Trigger>
  <Menubar.Content {...contentProps}>
    <Menubar.Group aria-label={triggerText}>
      {#each items as item}
        <Menubar.Item textValue={item.label} onSelect={item.onSelect}>
          {item.label}
        </Menubar.Item>
      {/each}
    </Menubar.Group>
  </Menubar.Content>
</Menubar.Menu>
```

Usage:
```svelte
<script>
  import { Menubar } from "bits-ui";
  import MyMenubarMenu from "./MyMenubarMenu.svelte";
  const menubarMenus = [
    { title: "Sales", items: [{label: "Michael Scott", value: "michael"}] },
    { title: "HR", items: [{label: "Toby Flenderson", value: "toby"}] },
  ];
</script>
<Menubar.Root>
  {#each menubarMenus as { title, items }}
    <MyMenubarMenu triggerText={title} {items} />
  {/each}
</Menubar.Root>
```

### Svelte Transitions

Use `forceMount` with the `child` snippet to enable transitions:

```svelte
<script>
  import { fly } from "svelte/transition";
</script>
<Menubar.Content forceMount>
  {#snippet child({ wrapperProps, props, open })}
    {#if open}
      <div {...wrapperProps}>
        <div {...props} transition:fly>
          <Menubar.Item>Item 1</Menubar.Item>
          <Menubar.Item>Item 2</Menubar.Item>
        </div>
      </div>
    {/if}
  {/snippet}
</Menubar.Content>
```

### API Reference

**Menubar.Root** - Root menubar component managing state
- `value` $bindable: `string` - Currently active menu value
- `onValueChange`: `(value: string) => void` - Callback when active menu changes
- `dir`: `'ltr' | 'rtl'` - Reading direction (default: 'ltr')
- `loop`: `boolean` - Loop through triggers with keyboard (default: true)
- `ref` $bindable: `HTMLDivElement`

**Menubar.Menu** - Menu within the menubar
- `value`: `string` - Menu identifier
- `onOpenChange`: `(open: boolean) => void` - Callback when open state changes

**Menubar.Trigger** - Button toggling dropdown menu
- `disabled`: `boolean` (default: false)
- `ref` $bindable: `HTMLButtonElement`
- Data attributes: `data-state` ('open' | 'closed'), `data-menubar-trigger`

**Menubar.Portal** - Portals content to body or custom target
- `to`: `Element | string` - Portal target (default: document.body)
- `disabled`: `boolean` - Disable portal (default: false)

**Menubar.Content** - Content displayed when menu is open
- `side`: `'top' | 'bottom' | 'left' | 'right'` (default: 'bottom')
- `sideOffset`: `number` - Distance from anchor (default: 0)
- `align`: `'start' | 'center' | 'end'` (default: 'start')
- `alignOffset`: `number` (default: 0)
- `avoidCollisions`: `boolean` - Prevent boundary collisions (default: true)
- `sticky`: `'partial' | 'always'` - Sticky behavior (default: 'partial')
- `hideWhenDetached`: `boolean` (default: true)
- `strategy`: `'fixed' | 'absolute'` - Positioning strategy (default: 'fixed')
- `preventScroll`: `boolean` - Prevent body scroll (default: true)
- `trapFocus`: `boolean` - Trap focus in content (default: true)
- `forceMount`: `boolean` - Force mount for transitions (default: false)
- `loop`: `boolean` - Loop through items with keyboard (default: false)
- `dir`: `'ltr' | 'rtl'` (default: 'ltr')
- `ref` $bindable: `HTMLDivElement`
- Data attributes: `data-state`, `data-menubar-content`
- CSS variables: `--bits-menubar-menu-content-transform-origin`, `--bits-menubar-menu-content-available-width`, `--bits-menubar-menu-content-available-height`, `--bits-menubar-menu-anchor-width`, `--bits-menubar-menu-anchor-height`

**Menubar.Item** - Menu item
- `disabled`: `boolean` (default: false)
- `textValue`: `string` - For typeahead
- `onSelect`: `() => void` - Selection callback
- `closeOnSelect`: `boolean` (default: true)
- `ref` $bindable: `HTMLDivElement`
- Data attributes: `data-orientation` ('vertical'), `data-highlighted`, `data-disabled`, `data-menubar-item`

**Menubar.CheckboxGroup** - Group of checkbox items
- `value` $bindable: `string[]` - Selected values (default: [])
- `onValueChange`: `(value: string[]) => void` - Change callback
- `ref` $bindable: `HTMLDivElement`
- Data attribute: `data-menubar-checkbox-group`

**Menubar.CheckboxItem** - Checkbox menu item
- `disabled`: `boolean` (default: false)
- `checked` $bindable: `boolean` (default: false)
- `onCheckedChange`: `(checked: boolean) => void`
- `indeterminate` $bindable: `boolean` (default: false)
- `onIndeterminateChange`: `(indeterminate: boolean) => void`
- `value`: `string` - For use in CheckboxGroup
- `textValue`: `string` - For typeahead
- `onSelect`: `() => void`
- `closeOnSelect`: `boolean` (default: true)
- `ref` $bindable: `HTMLDivElement`
- Children snippet: `{ checked: boolean; indeterminate: boolean; }`
- Data attributes: `data-orientation`, `data-highlighted`, `data-disabled`, `data-state` ('checked' | 'unchecked' | 'indeterminate'), `data-menubar-checkbox-item`

**Menubar.RadioGroup** - Group of radio items
- `value` $bindable: `string` - Currently checked value
- `onValueChange`: `(value: string) => void`
- `ref` $bindable: `HTMLDivElement`
- Data attribute: `data-menubar-radio-group`

**Menubar.RadioItem** - Radio button menu item (must be child of RadioGroup)
- `value` required: `string` - Item value
- `disabled`: `boolean` (default: false)
- `textValue`: `string` - For typeahead
- `onSelect`: `() => void`
- `closeOnSelect`: `boolean` (default: true)
- `ref` $bindable: `HTMLDivElement`
- Children snippet: `{ checked: boolean; }`
- Data attributes: `data-orientation`, `data-highlighted`, `data-disabled`, `data-state` ('checked' | 'unchecked'), `data-value`, `data-menubar-radio-item`

**Menubar.Separator** - Visual separator
- `ref` $bindable: `HTMLDivElement`
- Data attributes: `data-orientation` ('vertical'), `data-menu-separator`, `data-menubar-separator`

**Menubar.Arrow** - Optional arrow pointing to trigger
- `width`: `number` - Arrow width in pixels (default: 8)
- `height`: `number` - Arrow height in pixels (default: 8)
- `ref` $bindable: `HTMLDivElement`
- Data attributes: `data-state`, `data-menubar-arrow`

**Menubar.Group** - Group of menu items
- `ref` $bindable: `HTMLDivElement`
- Data attribute: `data-menubar-group`

**Menubar.GroupHeading** - Heading for a group (skipped in keyboard navigation)
- `ref` $bindable: `HTMLDivElement`
- Data attribute: `data-menubar-group-heading`

**Menubar.Sub** - Submenu
- `open` $bindable: `boolean` (default: false)
- `onOpenChange`: `(open: boolean) => void`
- `onOpenChangeComplete`: `(open: boolean) => void` - After animations complete

**Menubar.SubTrigger** - Menu item opening submenu
- `disabled`: `boolean` (default: false)
- `openDelay`: `number` - Delay before submenu opens in ms (default: 100)
- `textValue`: `string` - For typeahead
- `onSelect`: `() => void`
- `ref` $bindable: `HTMLDivElement`
- Data attributes: `data-orientation`, `data-highlighted`, `data-disabled`, `data-state`, `data-menubar-sub-trigger`

**Menubar.SubContent** - Submenu content (with Floating UI)
- Same positioning options as Menubar.Content (side, sideOffset, align, alignOffset, avoidCollisions, etc.)
- Data attributes: `data-state`, `data-menubar-sub-content`

**Menubar.SubContentStatic** - Submenu content (without Floating UI)
- `trapFocus`: `boolean` (default: true)
- `forceMount`: `boolean` (default: false)
- `loop`: `boolean` - Loop through items (default: true)
- `dir`: `'ltr' | 'rtl'` (default: 'ltr')
- Data attributes: `data-state`, `data-menubar-sub-content`

Note: Checkbox group values do not persist between menu open/close cycles; store in `$state` variable and pass to `value` prop to persist.

### meter
Meter component for displaying static measurements within a range; props: value/min/max, data attributes for styling, accessibility via aria-labelledby/aria-label/aria-valuetext.

## Meter Component

Displays a static measurement within a known range. Unlike progress bars which show task completion, meters show current state relative to capacity (e.g., CPU usage, battery level, sound volume).

### Basic Usage

```svelte
<script lang="ts">
  import { Meter, useId } from "bits-ui";
  let value = $state(2000);
  const labelId = useId();
  const max = 4000;
  const min = 0;
</script>

<Meter.Root
  aria-labelledby={labelId}
  aria-valuetext="{value} out of {max}"
  {value}
  {min}
  {max}
>
  <div style="transform: translateX(-{100 - (100 * value) / max}%)"></div>
</Meter.Root>
```

### Reusable Component Pattern

```svelte
<script lang="ts">
  import { Meter, useId } from "bits-ui";
  import type { ComponentProps } from "svelte";
  let {
    max = 100,
    value = 0,
    min = 0,
    label,
    valueLabel,
  }: ComponentProps<typeof Meter.Root> & {
    label: string;
    valueLabel: string;
  } = $props();
  const labelId = useId();
</script>

<div>
  <span id={labelId}>{label}</span>
  <span>{valueLabel}</span>
</div>
<Meter.Root
  aria-labelledby={labelId}
  aria-valuetext={valueLabel}
  {value}
  {min}
  {max}
/>
```

Usage: `<MyMeter label="Tokens used" valueLabel="{value} / {max}" {value} {max} />`

### Meter vs Progress Bar

- **Meter**: Static measurement within range, value fluctuates based on real-time state
- **Progress**: Completion status of task, value only increases

### Accessibility

- Use `aria-labelledby` if visual label exists, otherwise use `aria-label`
- Set `aria-valuetext` to make value understandable (e.g., "50% (6 hours) remaining")

### API Reference - Meter.Root

**Props:**
- `max` (number, default: 100): Maximum value
- `min` (number, default: 0): Minimum value
- `value` (number, default: 0): Current value
- `ref` (bindable HTMLDivElement): DOM element reference
- `children` (Snippet): Content to render
- `child` (Snippet): Render delegation for custom elements

**Data Attributes:**
- `data-value`: Current value
- `data-min`: Minimum value
- `data-max`: Maximum value
- `data-meter-root`: Present on root element

### navigation-menu
Accessible navigation menu with dropdowns, submenus, Viewport for smooth transitions, Indicator for active state, force mounting, and configurable hover/click behavior.

## Navigation Menu

A menu component for navigating between pages of a website. Provides a hierarchical, accessible navigation structure with support for dropdowns, submenus, and animations.

### Components

- **NavigationMenu.Root**: Root container managing menu state. Props: `value` (bindable), `onValueChange`, `dir` ('ltr'|'rtl'), `skipDelayDuration` (300ms), `delayDuration` (200ms), `orientation` ('horizontal'|'vertical')
- **NavigationMenu.List**: Menu list container (renders as `<ul>`)
- **NavigationMenu.Item**: List item with optional trigger and content. Props: `value`, `openOnHover` (default true)
- **NavigationMenu.Trigger**: Button that toggles content visibility. Props: `disabled`
- **NavigationMenu.Content**: Dropdown content shown when trigger is active. Props: `forceMount`, `onInteractOutside`, `onFocusOutside`, `interactOutsideBehavior`, `onEscapeKeydown`, `escapeKeydownBehavior`
- **NavigationMenu.Link**: Navigation link element. Props: `active`, `onSelect`
- **NavigationMenu.Viewport**: Optional container for rendering content with smooth transitions between items. Exposes CSS variables `--bits-navigation-menu-viewport-width` and `--bits-navigation-menu-viewport-height`
- **NavigationMenu.Indicator**: Optional visual indicator for active trigger (e.g., arrow or highlight)
- **NavigationMenu.Sub**: Submenu root for nested menus

### Basic Structure

```svelte
<NavigationMenu.Root>
  <NavigationMenu.List>
    <NavigationMenu.Item>
      <NavigationMenu.Trigger>Menu Item</NavigationMenu.Trigger>
      <NavigationMenu.Content>Content here</NavigationMenu.Content>
    </NavigationMenu.Item>
    <NavigationMenu.Item>
      <NavigationMenu.Link href="/path">Direct Link</NavigationMenu.Link>
    </NavigationMenu.Item>
    <NavigationMenu.Indicator />
  </NavigationMenu.List>
  <NavigationMenu.Viewport />
</NavigationMenu.Root>
```

### Key Features

**Orientation**: Use `orientation="vertical"` on Root for vertical menus (default is horizontal)

**Viewport**: Optional component that renders Content in a dedicated container. Useful for advanced layouts and animations. Content is rendered in place if Viewport is absent.

**Indicator**: Optional visual element highlighting the active trigger. Useful with Viewport for animated arrows/highlights.

**Submenus**: Nest menus using `NavigationMenu.Sub` instead of Root inside Content:
```svelte
<NavigationMenu.Content>
  <NavigationMenu.Sub>
    <NavigationMenu.List>
      <NavigationMenu.Item>
        <NavigationMenu.Trigger>Submenu Item</NavigationMenu.Trigger>
        <NavigationMenu.Content>Submenu content</NavigationMenu.Content>
      </NavigationMenu.Item>
    </NavigationMenu.List>
    <NavigationMenu.Viewport />
  </NavigationMenu.Sub>
</NavigationMenu.Content>
```

**Advanced Animations**: Use `data-motion` attribute ('from-start'|'from-end'|'to-start'|'to-end') on Content and CSS variables on Viewport for smooth directional animations:
```css
.NavigationMenuContent[data-motion="from-start"] {
  animation-name: enter-from-left;
}
.NavigationMenuViewport {
  width: var(--bits-navigation-menu-viewport-width);
  height: var(--bits-navigation-menu-viewport-height);
}
```

**Force Mounting**: Use `forceMount` on Content and Viewport to keep elements in DOM (useful for SEO). Manage visibility with `data-state` attribute ('open'|'closed'):
```svelte
<NavigationMenu.Content forceMount class="data-[state=closed]:hidden">
```

**Open on Hover**: Default behavior opens Content on trigger hover. Disable with `openOnHover={false}` on Item (requires click/escape to close instead).

**Full Example** (with Viewport and Indicator):
```svelte
<script>
  import { NavigationMenu } from "bits-ui";
  import CaretDown from "phosphor-svelte/lib/CaretDown";
  
  const items = [
    { title: "Alert Dialog", href: "/docs/alert-dialog", desc: "Modal dialog..." },
    { title: "Tooltip", href: "/docs/tooltip", desc: "Popup on hover..." }
  ];
</script>

<NavigationMenu.Root class="relative z-10 flex w-full justify-center">
  <NavigationMenu.List class="flex items-center justify-center p-1">
    <NavigationMenu.Item value="getting-started">
      <NavigationMenu.Trigger class="inline-flex items-center px-4 py-2 rounded">
        Getting started
        <CaretDown class="ml-1 size-3 group-data-[state=open]:rotate-180" />
      </NavigationMenu.Trigger>
      <NavigationMenu.Content class="absolute left-0 top-0 w-full sm:w-auto">
        <ul class="grid gap-x-2.5 p-3 sm:w-[600px] sm:grid-cols-3">
          <li class="row-span-3">
            <NavigationMenu.Link href="/" class="flex flex-col justify-end p-6 rounded">
              <div class="text-lg font-medium">Bits UI</div>
              <p>Headless components for Svelte</p>
            </NavigationMenu.Link>
          </li>
          <li>
            <NavigationMenu.Link href="/docs" class="block p-3 rounded">
              <div class="font-medium">Introduction</div>
              <p class="text-sm">Headless components for Svelte and SvelteKit</p>
            </NavigationMenu.Link>
          </li>
        </ul>
      </NavigationMenu.Content>
    </NavigationMenu.Item>
    <NavigationMenu.Item>
      <NavigationMenu.Trigger class="inline-flex items-center px-4 py-2 rounded">
        Components
        <CaretDown class="ml-1 size-3 group-data-[state=open]:rotate-180" />
      </NavigationMenu.Trigger>
      <NavigationMenu.Content class="absolute left-0 top-0 w-full sm:w-auto">
        <ul class="grid gap-3 p-3 sm:w-[500px] md:grid-cols-2">
          {#each items as item}
            <li>
              <NavigationMenu.Link href={item.href} class="block p-3 rounded">
                <div class="font-medium">{item.title}</div>
                <p class="text-sm">{item.desc}</p>
              </NavigationMenu.Link>
            </li>
          {/each}
        </ul>
      </NavigationMenu.Content>
    </NavigationMenu.Item>
    <NavigationMenu.Item>
      <NavigationMenu.Link href="/docs" class="inline-flex px-4 py-2 rounded">
        Documentation
      </NavigationMenu.Link>
    </NavigationMenu.Item>
    <NavigationMenu.Indicator class="top-full flex h-2.5 items-end justify-center">
      <div class="size-2.5 rotate-45 rounded-tl" />
    </NavigationMenu.Indicator>
  </NavigationMenu.List>
  <div class="absolute left-0 top-full flex w-full justify-center">
    <NavigationMenu.Viewport class="relative mt-2.5 rounded-md border shadow-lg" />
  </div>
</NavigationMenu.Root>
```

### pagination
Pagination component with Root, Page, PrevButton, NextButton; supports bindable page state, configurable items-per-page and sibling count, ellipsis rendering, keyboard navigation with optional looping, and data attributes for styling.

## Pagination Component

Enables users to navigate through a series of pages.

### Basic Usage

```svelte
<script lang="ts">
  import { Pagination } from "bits-ui";
  import CaretLeft from "phosphor-svelte/lib/CaretLeft";
  import CaretRight from "phosphor-svelte/lib/CaretRight";
</script>

<Pagination.Root count={100} perPage={10}>
  {#snippet children({ pages, range })}
    <div class="flex items-center">
      <Pagination.PrevButton>
        <CaretLeft />
      </Pagination.PrevButton>
      <div class="flex gap-2.5">
        {#each pages as page (page.key)}
          {#if page.type === "ellipsis"}
            <div>...</div>
          {:else}
            <Pagination.Page {page}>
              {page.value}
            </Pagination.Page>
          {/if}
        {/each}
      </div>
      <Pagination.NextButton>
        <CaretRight />
      </Pagination.NextButton>
    </div>
    <p>Showing {range.start} - {range.end}</p>
  {/snippet}
</Pagination.Root>
```

### Structure

```svelte
<Pagination.Root let:pages>
  <Pagination.PrevButton />
  {#each pages as page (page.key)}
    <Pagination.Page {page} />
  {/each}
  <Pagination.NextButton />
</Pagination.Root>
```

### State Management

**Two-way binding:**
```svelte
<script lang="ts">
  let myPage = $state(1);
</script>
<button onclick={() => (myPage = 2)}>Go to page 2</button>
<Pagination.Root bind:page={myPage}>
  <!-- ... -->
</Pagination.Root>
```

**Fully controlled with function binding:**
```svelte
<script lang="ts">
  let myPage = $state(1);
  function getPage() { return myPage; }
  function setPage(newPage: number) { myPage = newPage; }
</script>
<Pagination.Root bind:page={getPage, setPage}>
  <!-- ... -->
</Pagination.Root>
```

### Pages Snippet

The `pages` snippet prop contains items of type `'page'` (actual page number) or `'ellipsis'` (placeholder between pages). Each item has a `key` property for use in `#each` blocks.

### API Reference

**Pagination.Root**
- `count` (required, number): Total number of items
- `page` ($bindable, number): Selected page
- `onPageChange` (function): Called when page changes
- `perPage` (number, default: 1): Items per page
- `siblingCount` (number, default: 1): Page triggers shown on either side of current page
- `loop` (boolean, default: false): Loop through items when reaching end with keyboard navigation
- `orientation` (enum: 'horizontal' | 'vertical', default: 'horizontal'): Determines keyboard navigation behavior
- `ref` ($bindable, HTMLDivElement): Underlying DOM element
- `children` (Snippet): Receives `{ pages: PageItem[], range: { start, end }, currentPage }`
- `child` (Snippet): Render delegation alternative

**Pagination.Page**
- `page` (PageItem): The page item this component represents
- `ref` ($bindable, HTMLButtonElement): Underlying DOM element
- `children` (Snippet): Content to render
- `child` (Snippet): Render delegation alternative
- Data attributes: `data-selected` (on current page), `data-pagination-page`

**Pagination.PrevButton**
- `ref` ($bindable, HTMLButtonElement): Underlying DOM element
- `children` (Snippet): Content to render
- `child` (Snippet): Render delegation alternative
- Data attribute: `data-pagination-prev-button`

**Pagination.NextButton**
- `ref` ($bindable, HTMLButtonElement): Underlying DOM element
- `children` (Snippet): Content to render
- `child` (Snippet): Render delegation alternative
- Data attribute: `data-pagination-next-button`

### pin-input
PIN input component for OTP/2FA/MFA with invisible input, customizable cells, state binding, paste transformation, input patterns, form integration, and accessibility.

## PIN Input

Customizable component for One-Time Password (OTP), Two-Factor Authentication (2FA), or Multi-Factor Authentication (MFA) input fields. Uses an invisible input element for seamless form submission and browser autofill, with customizable visual cells for each character.

### Key Features
- Invisible input technique for form integration and autofill
- Customizable appearance with full control over visual representation
- Keyboard navigation and screen reader accessibility
- Flexible PIN length and input type support (numeric, alphanumeric)

### Architecture
- Root container (relatively positioned)
- Hidden input field managing actual value
- Visual cells as customizable siblings to the invisible input

### Basic Structure
```svelte
<script lang="ts">
  import { PinInput } from "bits-ui";
</script>
<PinInput.Root maxlength={6}>
  {#snippet children({ cells })}
    {#each cells as cell}
      <PinInput.Cell {cell} />
    {/each}
  {/snippet}
</PinInput.Root>
```

### State Management

**Two-way binding:**
```svelte
<script lang="ts">
  import { PinInput } from "bits-ui";
  let myValue = $state("");
</script>
<button onclick={() => (myValue = "123456")}> Set value to 123456 </button>
<PinInput.Root bind:value={myValue}>
  <!-- -->
</PinInput.Root>
```

**Fully controlled with function binding:**
```svelte
<script lang="ts">
  let myValue = $state("");
  function getValue() { return myValue; }
  function setValue(newValue: string) { myValue = newValue; }
</script>
<PinInput.Root bind:value={getValue, setValue}>
  <!-- ... -->
</PinInput.Root>
```

### Paste Transformation
Sanitize/transform pasted text (e.g., remove hyphens):
```svelte
<PinInput.Root pasteTransformer={(text) => text.replace(/-/g, "")}>
  <!-- ... -->
</PinInput.Root>
```

### HTML Forms
```svelte
<script lang="ts">
  let form = $state<HTMLFormElement>(null!);
</script>
<form method="POST" bind:this={form}>
  <PinInput.Root name="mfaCode" onComplete={() => form.submit()}>
    <!-- ... -->
  </PinInput.Root>
</form>
```

### Input Patterns
Restrict characters using built-in patterns:
```svelte
<script lang="ts">
  import { PinInput, REGEXP_ONLY_DIGITS } from "bits-ui";
</script>
<PinInput.Root pattern={REGEXP_ONLY_DIGITS}>
  <!-- ... -->
</PinInput.Root>
```

Available patterns: `REGEXP_ONLY_DIGITS`, `REGEXP_ONLY_CHARS`, `REGEXP_ONLY_DIGITS_AND_CHARS`

### Complete Example
```svelte
<script lang="ts">
  import { PinInput, REGEXP_ONLY_DIGITS, type PinInputRootSnippetProps } from "bits-ui";
  import { toast } from "svelte-sonner";
  import cn from "clsx";
  let value = $state("");
  type CellProps = PinInputRootSnippetProps["cells"][0];
  function onComplete() {
    toast.success(`Completed with value ${value}`);
    value = "";
  }
</script>
<PinInput.Root
  bind:value
  class="group/pininput text-foreground has-disabled:opacity-30 flex items-center"
  maxlength={6}
  {onComplete}
  pattern={REGEXP_ONLY_DIGITS}
>
  {#snippet children({ cells })}
    <div class="flex">
      {#each cells.slice(0, 3) as cell, i (i)}
        {@render Cell(cell)}
      {/each}
    </div>
    <div class="flex w-10 items-center justify-center">
      <div class="bg-border h-1 w-3 rounded-full"></div>
    </div>
    <div class="flex">
      {#each cells.slice(3, 6) as cell, i (i)}
        {@render Cell(cell)}
      {/each}
    </div>
  {/snippet}
</PinInput.Root>
{#snippet Cell(cell: CellProps)}
  <PinInput.Cell
    {cell}
    class={cn(
      "focus-override",
      "relative h-14 w-10 text-[2rem]",
      "flex items-center justify-center",
      "transition-all duration-75",
      "border-foreground/20 border-y border-r first:rounded-l-md first:border-l last:rounded-r-md",
      "text-foreground group-focus-within/pininput:border-foreground/40 group-hover/pininput:border-foreground/40",
      "outline-0",
      "data-active:outline-1 data-active:outline-white"
    )}
  >
    {#if cell.char !== null}
      <div>{cell.char}</div>
    {/if}
    {#if cell.hasFakeCaret}
      <div class="animate-caret-blink pointer-events-none absolute inset-0 flex items-center justify-center">
        <div class="h-8 w-px bg-white"></div>
      </div>
    {/if}
  </PinInput.Cell>
{/snippet}
```

### API Reference

**PinInput.Root**
| Property | Type | Description |
|----------|------|-------------|
| `value` $bindable | `string` | The input value |
| `onValueChange` | `(value: string) => void` | Callback on value change |
| `disabled` | `boolean` | Disable the input (default: false) |
| `textalign` | `'left' \| 'center' \| 'right'` | Text alignment, affects long-press behavior (default: 'left') |
| `maxlength` | `number` | Maximum PIN length (default: 6) |
| `onComplete` | `(...args: any[]) => void` | Callback when input is completely filled |
| `pasteTransformer` | `(text: string) => string` | Transform pasted text |
| `inputId` | `string` | ID for the hidden input element |
| `pushPasswordManagerStrategy` | `'increase-width' \| 'none'` | Strategy for password manager badge positioning |
| `ref` $bindable | `HTMLDivElement` | Reference to root element |
| `children` | `Snippet<{ cells: PinInputCell[] }>` | Render content |

**PinInput.Cell**
| Property | Type | Description |
|----------|------|-------------|
| `cell` | `{ char: string \| null; isActive: boolean; hasFakeCaret: boolean }` | Cell data from parent |
| `ref` $bindable | `HTMLDivElement` | Reference to cell element |
| `children` | `Snippet` | Render content |

**Data Attributes**
- `data-pin-input-root` on root
- `data-pin-input-cell` on cells
- `data-active` when cell is active
- `data-inactive` when cell is inactive

### popover
Floating panel component with positioning, focus management, scroll lock, escape/outside-click handling, custom anchoring, and transition support.

## Popover Component

Displays rich content in a floating panel anchored to a trigger element.

### Basic Structure
```svelte
<Popover.Root>
  <Popover.Trigger />
  <Popover.Portal>
    <Popover.Overlay />
    <Popover.Content>
      <Popover.Close />
      <Popover.Arrow />
    </Popover.Content>
  </Popover.Portal>
</Popover.Root>
```

### State Management

**Two-way binding:**
```svelte
<script>
  let isOpen = $state(false);
</script>
<button onclick={() => (isOpen = true)}>Open</button>
<Popover.Root bind:open={isOpen}>
```

**Fully controlled with function binding:**
```svelte
<script>
  let myOpen = $state(false);
</script>
<Popover.Root bind:open={() => myOpen, (v) => (myOpen = v)}>
```

### Focus Management

**Trap focus** (default enabled): Set `trapFocus={false}` on `Popover.Content` to disable.

**Open auto-focus** (default focuses first focusable element):
```svelte
<Popover.Content onOpenAutoFocus={(e) => {
  e.preventDefault();
  nameInput?.focus();
}}>
```

**Close auto-focus** (default focuses trigger):
```svelte
<Popover.Content onCloseAutoFocus={(e) => {
  e.preventDefault();
  nameInput?.focus();
}}>
```

### Scroll Lock

Prevent body scroll when popover is open:
```svelte
<Popover.Content preventScroll={true}>
```

### Escape Key Behavior

**Ignore escape:**
```svelte
<Popover.Content escapeKeydownBehavior="ignore">
```

**Custom escape handling:**
```svelte
<Popover.Content onEscapeKeydown={(e) => e.preventDefault()}>
```

### Interact Outside Behavior

**Ignore outside interactions:**
```svelte
<Popover.Content interactOutsideBehavior="ignore">
```

**Custom outside handling:**
```svelte
<Popover.Content onInteractOutside={(e) => e.preventDefault()}>
```

### Custom Anchor

Anchor content to element other than trigger:
```svelte
<script>
  let customAnchor = $state<HTMLElement>(null!);
</script>
<div bind:this={customAnchor}></div>
<Popover.Root>
  <Popover.Trigger />
  <Popover.Content {customAnchor}>
```

### Svelte Transitions

Use `forceMount` with `child` snippet for animation control:
```svelte
<Popover.Content forceMount>
  {#snippet child({ wrapperProps, props, open })}
    {#if open}
      <div {...wrapperProps}>
        <div {...props} transition:fly={{ duration: 300 }}>
          <!-- content -->
        </div>
      </div>
    {/if}
  {/snippet}
</Popover.Content>
```

### Overlay Component

Optional overlay behind popover:
```svelte
<Popover.Portal>
  <Popover.Overlay class="fixed inset-0 z-50 bg-black/80" />
  <Popover.Content>
```

### API Reference

**Popover.Root**
- `open` (bindable): boolean, default false
- `onOpenChange`: (open: boolean) => void
- `onOpenChangeComplete`: (open: boolean) => void

**Popover.Trigger**
- `ref` (bindable): HTMLButtonElement
- Data attributes: `data-state` ('open'|'closed'), `data-popover-trigger`

**Popover.Content**
- `side`: 'top'|'bottom'|'left'|'right', default 'bottom'
- `sideOffset`: number, default 0
- `align`: 'start'|'center'|'end', default 'start'
- `alignOffset`: number, default 0
- `arrowPadding`: number, default 0
- `avoidCollisions`: boolean, default true
- `collisionBoundary`: Element | null
- `collisionPadding`: number | Partial<Record<Side, number>>, default 0
- `sticky`: 'partial'|'always', default 'partial'
- `hideWhenDetached`: boolean, default true
- `updatePositionStrategy`: 'optimized'|'always', default 'optimized'
- `strategy`: 'fixed'|'absolute', default 'fixed'
- `preventScroll`: boolean, default false
- `customAnchor`: string | HTMLElement | Measurable | null, default null
- `onInteractOutside`: (event: PointerEvent) => void
- `onFocusOutside`: (event: FocusEvent) => void
- `interactOutsideBehavior`: 'close'|'ignore'|'defer-otherwise-close'|'defer-otherwise-ignore', default 'close'
- `onEscapeKeydown`: (event: KeyboardEvent) => void
- `escapeKeydownBehavior`: 'close'|'ignore'|'defer-otherwise-close'|'defer-otherwise-ignore', default 'close'
- `onOpenAutoFocus`: (event: Event) => void
- `onCloseAutoFocus`: (event: Event) => void
- `trapFocus`: boolean, default true
- `preventOverflowTextSelection`: boolean, default true
- `forceMount`: boolean, default false
- `dir`: 'ltr'|'rtl', default 'ltr'
- `ref` (bindable): HTMLDivElement
- CSS variables: `--bits-popover-content-transform-origin`, `--bits-popover-content-available-width`, `--bits-popover-content-available-height`, `--bits-popover-anchor-width`, `--bits-popover-anchor-height`
- Data attributes: `data-state`, `data-popover-content`

**Popover.ContentStatic** (no floating UI)
- Same as Popover.Content except: no positioning props (side, sideOffset, align, alignOffset, arrowPadding, avoidCollisions, collisionBoundary, collisionPadding, sticky, hideWhenDetached, updatePositionStrategy, strategy, customAnchor)

**Popover.Overlay**
- `forceMount`: boolean, default false
- `ref` (bindable): HTMLDivElement
- Data attributes: `data-popover-overlay`, `data-state`

**Popover.Close**
- `ref` (bindable): HTMLButtonElement
- Data attribute: `data-popover-close`

**Popover.Arrow**
- `width`: number, default 8
- `height`: number, default 8
- `ref` (bindable): HTMLDivElement
- Data attributes: `data-arrow`, `data-popover-arrow`

**Popover.Portal**
- `to`: Element | string, default document.body
- `disabled`: boolean, default false

### progress
Progress component for task completion tracking with value/min/max props, indeterminate state support, and accessibility attributes.

## Progress Component

Shows the completion status of a task. Value only increases as task progresses.

### Distinction from Meter
- **Progress**: Shows completion status of a task, value only increases. Examples: file upload, installation, form completion.
- **Meter**: Displays static measurement within known range, value can fluctuate. Examples: CPU usage, battery level, volume.

### Basic Usage

```svelte
<script lang="ts">
  import { Progress } from "bits-ui";
  import { onMount } from "svelte";
  import { cubicInOut } from "svelte/easing";
  import { Tween } from "svelte/motion";
  
  const tween = new Tween(13, { duration: 1000, easing: cubicInOut });
  const labelId = $props.id();
  
  onMount(() => {
    const timer = setTimeout(() => tween.set(66), 500);
    return () => clearTimeout(timer);
  });
</script>

<div class="flex w-[60%] flex-col gap-2">
  <div class="flex items-center justify-between text-sm font-medium">
    <span id={labelId}>Uploading file...</span>
    <span>{Math.round(tween.current)}%</span>
  </div>
  <Progress.Root
    aria-labelledby={labelId}
    value={Math.round(tween.current)}
    max={100}
    class="bg-dark-10 shadow-mini-inset relative h-[15px] w-full overflow-hidden rounded-full"
  >
    <div
      class="bg-foreground shadow-mini-inset h-full w-full flex-1 rounded-full"
      style={`transform: translateX(-${100 - (100 * (tween.current ?? 0)) / 100}%)`}
    ></div>
  </Progress.Root>
</div>
```

### Reusable Component Pattern

```svelte
<script lang="ts">
  import { Progress, useId } from "bits-ui";
  import type { ComponentProps } from "svelte";
  
  let {
    max = 100,
    value = 0,
    min = 0,
    label,
    valueLabel,
  }: ComponentProps<typeof Progress.Root> & {
    label: string;
    valueLabel: string;
  } = $props();
  
  const labelId = useId();
</script>

<div>
  <span id={labelId}>{label}</span>
  <span>{valueLabel}</span>
</div>
<Progress.Root
  aria-labelledby={labelId}
  aria-valuetext={valueLabel}
  {value}
  {min}
  {max}
/>
```

Usage:
```svelte
<script lang="ts">
  import MyProgress from "$lib/components/MyProgress.svelte";
  let value = $state(50);
</script>

<MyProgress label="Loading images..." valueLabel="{value}%" {value} />
```

### Accessibility

Use `aria-labelledby` prop with ID of visual label, or `aria-label` prop for text description when no visual label is present.

### API Reference

**Progress.Root** properties:
- `max` (number, default: 100): Maximum value
- `min` (number, default: 0): Minimum value
- `value` (number | null, default: 0): Current value; `null` makes it indeterminate
- `ref` ($bindable HTMLDivElement): Reference to underlying DOM element
- `children` (Snippet): Content to render
- `child` (Snippet): Render delegation for custom elements

**Data attributes**:
- `data-value`: Current value
- `data-state`: 'indeterminate' | 'determinate'
- `data-min`: Minimum value
- `data-max`: Maximum value
- `data-indeterminate`: Present when value is null
- `data-progress-root`: Present on root element

### radio-group
Radio group component for selecting one value from multiple options; supports form submission, two-way binding, disabled/readonly states, vertical/horizontal orientation with arrow-key navigation, and looping.

## Radio Group

Groups multiple radio items under a common name for form submission.

### Basic Usage

```svelte
<script lang="ts">
  import { Label, RadioGroup } from "bits-ui";
</script>
<RadioGroup.Root class="flex flex-col gap-4">
  <div class="flex items-center">
    <RadioGroup.Item id="amazing" value="amazing" class="size-5 rounded-full border" />
    <Label.Root for="amazing" class="pl-3">Amazing</Label.Root>
  </div>
  <div class="flex items-center">
    <RadioGroup.Item id="average" value="average" class="size-5 rounded-full border" />
    <Label.Root for="average" class="pl-3">Average</Label.Root>
  </div>
</RadioGroup.Root>
```

### Structure with Snippets

```svelte
<RadioGroup.Root>
  <RadioGroup.Item>
    {#snippet children({ checked })}
      {#if checked}✅{/if}
    {/snippet}
  </RadioGroup.Item>
</RadioGroup.Root>
```

### Reusable Component Pattern

Create a custom component accepting an array of items:

```svelte
<script lang="ts">
  import { RadioGroup, Label, useId } from "bits-ui";
  type Item = { value: string; label: string; disabled?: boolean };
  type Props = RadioGroup.RootProps & { items: Item[] };
  let { value = $bindable(""), items, ...restProps }: Props = $props();
</script>
<RadioGroup.Root bind:value {...restProps}>
  {#each items as item}
    {@const id = useId()}
    <div>
      <RadioGroup.Item {id} value={item.value} disabled={item.disabled}>
        {#snippet children({ checked })}
          {#if checked}✅{/if}
        {/snippet}
      </RadioGroup.Item>
      <Label.Root for={id}>{item.label}</Label.Root>
    </div>
  {/each}
</RadioGroup.Root>
```

Usage:
```svelte
<MyRadioGroup items={[
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "coconut", label: "Coconut", disabled: true }
]} name="favoriteFruit" />
```

### State Management

**Two-way binding:**
```svelte
<script lang="ts">
  let myValue = $state("");
</script>
<button onclick={() => (myValue = "A")}>Select A</button>
<RadioGroup.Root bind:value={myValue}><!-- ... --></RadioGroup.Root>
```

**Fully controlled with function binding:**
```svelte
<script lang="ts">
  let myValue = $state("");
  function getValue() { return myValue; }
  function setValue(newValue: string) { myValue = newValue; }
</script>
<RadioGroup.Root bind:value={getValue, setValue}><!-- ... --></RadioGroup.Root>
```

### HTML Forms

Set `name` prop to render hidden input for form submission:
```svelte
<RadioGroup.Root name="favoriteFruit" required><!-- ... --></RadioGroup.Root>
```

### Disabling & Readonly

```svelte
<RadioGroup.Item value="apple" disabled>Apple</RadioGroup.Item>
<RadioGroup.Root readonly><!-- ... --></RadioGroup.Root>
<RadioGroup.Root disabled><!-- ... --></RadioGroup.Root>
```

### Orientation & Navigation

```svelte
<RadioGroup.Root orientation="vertical"><!-- ArrowUp/Down --></RadioGroup.Root>
<RadioGroup.Root orientation="horizontal"><!-- ArrowLeft/Right --></RadioGroup.Root>
<RadioGroup.Root loop><!-- Loops through items --></RadioGroup.Root>
```

### API Reference

**RadioGroup.Root props:**
- `value` ($bindable): string - currently selected value
- `onValueChange`: (value: string) => void
- `disabled`: boolean (default: false)
- `required`: boolean (default: false)
- `name`: string - for form submission
- `loop`: boolean (default: false) - keyboard navigation loops
- `orientation`: 'vertical' | 'horizontal' (default: 'vertical')
- `readonly`: boolean (default: false) - focusable but not changeable
- `ref` ($bindable): HTMLDivElement
- `children`: Snippet
- `child`: Snippet for render delegation

**Data attributes on Root:**
- `data-orientation`: 'vertical' | 'horizontal'
- `data-disabled`: present when disabled
- `data-readonly`: present when readonly
- `data-radio-group-root`: always present

**RadioGroup.Item props:**
- `value` (required): string - unique identifier
- `disabled`: boolean (default: false)
- `ref` ($bindable): HTMLButtonElement
- `children`: Snippet
- `child`: Snippet for render delegation

**Data attributes on Item:**
- `data-disabled`: present when disabled
- `data-readonly`: present when parent is readonly
- `data-value`: the item's value
- `data-state`: 'checked' | 'unchecked'
- `data-orientation`: parent's orientation
- `data-radio-group-item`: always present

### range-calendar
Date range calendar with min/max day constraints, disabled date handling, multi-month display, and comprehensive data attributes for styling range states.

## RangeCalendar Component

A calendar component for selecting date ranges with a calendar interface.

### Basic Structure
```svelte
<RangeCalendar.Root bind:value>
  {#snippet children({ months, weekdays })}
    <RangeCalendar.Header>
      <RangeCalendar.PrevButton />
      <RangeCalendar.Heading />
      <RangeCalendar.NextButton />
    </RangeCalendar.Header>
    {#each months as month}
      <RangeCalendar.Grid>
        <RangeCalendar.GridHead>
          <RangeCalendar.GridRow>
            {#each weekdays as day}
              <RangeCalendar.HeadCell>{day}</RangeCalendar.HeadCell>
            {/each}
          </RangeCalendar.GridRow>
        </RangeCalendar.GridHead>
        <RangeCalendar.GridBody>
          {#each month.weeks as weekDates}
            <RangeCalendar.GridRow>
              {#each weekDates as date}
                <RangeCalendar.Cell {date} month={month.value}>
                  <RangeCalendar.Day />
                </RangeCalendar.Cell>
              {/each}
            </RangeCalendar.GridRow>
          {/each}
        </RangeCalendar.GridBody>
      </RangeCalendar.Grid>
    {/each}
  {/snippet}
</RangeCalendar.Root>
```

### Key Props on RangeCalendar.Root
- `value` (bindable): `{ start: DateValue | undefined; end: DateValue | undefined }`
- `minDays`: minimum days in range
- `maxDays`: maximum days in range
- `excludeDisabled`: auto-reset range if any date becomes disabled
- `isDateDisabled(date)`: function to disable specific dates
- `isDateUnavailable(date)`: function to mark dates unavailable
- `minValue`/`maxValue`: date bounds
- `numberOfMonths`: display multiple months (default 1)
- `fixedWeeks`: always show 6 weeks
- `pagedNavigation`: navigate by number of displayed months
- `preventDeselect`: prevent deselecting without selecting another date
- `weekdayFormat`: 'narrow' | 'short' | 'long'
- `weekStartsOn`: day of week to start on (0=Sunday)
- `disabled`, `readonly`: disable/readonly states
- `locale`: locale for formatting
- `monthFormat`, `yearFormat`: formatting options

### Examples

**Min Days (3 day minimum):**
```svelte
<RangeCalendar.Root minDays={3} bind:value>
  <!-- ... -->
</RangeCalendar.Root>
```

**Max Days (7 day maximum):**
```svelte
<RangeCalendar.Root maxDays={7} bind:value>
  <!-- ... -->
</RangeCalendar.Root>
```

**Min and Max Days (3-10 day range):**
```svelte
<RangeCalendar.Root minDays={3} maxDays={10} bind:value>
  <!-- ... -->
</RangeCalendar.Root>
```

**Exclude Disabled (disable weekends, auto-reset if range includes weekend):**
```svelte
<RangeCalendar.Root 
  excludeDisabled 
  isDateDisabled={(date) => isWeekend(date, "en-US")}
  bind:value
>
  <!-- ... -->
</RangeCalendar.Root>
```

### Data Attributes
- Root: `data-invalid`, `data-disabled`, `data-readonly`, `data-range-calendar-root`
- Cell: `data-selected`, `data-range-start`, `data-range-end`, `data-range-middle`, `data-highlighted`, `data-disabled`, `data-unavailable`, `data-today`, `data-outside-month`, `data-focused`, `data-value`
- Day: same as Cell plus `data-range-calendar-day`

### Callbacks
- `onValueChange(range)`: called when range changes
- `onStartValueChange(value)`: called when start date changes
- `onEndValueChange(value)`: called when end date changes
- `onPlaceholderChange(date)`: called when placeholder changes

### Additional Components
- `RangeCalendar.MonthSelect`: select to navigate to specific month
- `RangeCalendar.YearSelect`: select to navigate to specific year

Note: Read the Dates documentation to understand how dates/times work in Bits UI.

### rating-group
Star rating component with customizable items, half-ratings, form integration, keyboard navigation (direct number input, arrows, Home/End), RTL support, and ARIA slider pattern.

## Rating Group

Enables users to provide ratings using customizable items (like stars).

### Basic Usage

```svelte
<script lang="ts">
  import { RatingGroup } from "bits-ui";
  import Star from "phosphor-svelte/lib/Star";
  let value = $state(3);
</script>
<RatingGroup.Root bind:value max={5} class="flex gap-1">
  {#snippet children({ items })}
    {#each items as item (item.index)}
      <RatingGroup.Item index={item.index}>
        <Star class="size-full" weight="fill" />
      </RatingGroup.Item>
    {/each}
  {/snippet}
</RatingGroup.Root>
```

### Reusable Components

Create custom rating components:

```svelte
<script lang="ts">
  import { RatingGroup, type WithoutChildrenOrChild } from "bits-ui";
  import Star from "phosphor-svelte/lib/Star";
  import StarHalf from "phosphor-svelte/lib/StarHalf";
  let {
    value = $bindable(0),
    ref = $bindable(null),
    showLabel = true,
    max = 5,
    ...restProps
  }: WithoutChildrenOrChild<RatingGroup.RootProps> & {
    showLabel?: boolean;
  } = $props();
</script>
<div class="flex flex-col gap-2">
  <RatingGroup.Root bind:value bind:ref {max} {...restProps}>
    {#snippet children({ items })}
      {#each items as item (item.index)}
        <RatingGroup.Item index={item.index}>
          {#if item.state === "inactive"}
            <Star />
          {:else if item.state === "active"}
            <Star weight="fill" />
          {:else if item.state === "partial"}
            <StarHalf weight="fill" />
          {/if}
        </RatingGroup.Item>
      {/each}
    {/snippet}
  </RatingGroup.Root>
  {#if showLabel}
    <p class="text-muted-foreground text-sm">
      Rating: {value} out of {max} stars
    </p>
  {/if}
</div>
```

### State Management

Two-way binding:
```svelte
<script lang="ts">
  let myRating = $state(3);
</script>
<button onclick={() => (myRating = 5)}> Give 5 stars </button>
<RatingGroup.Root bind:value={myRating} max={5}>
  {#snippet children({ items })}
    {#each items as item (item.index)}
      <RatingGroup.Item index={item.index}>
        {#if item.state === "active"}⭐{:else}☆{/if}
      </RatingGroup.Item>
    {/each}
  {/snippet}
</RatingGroup.Root>
```

Fully controlled with function binding:
```svelte
<script lang="ts">
  let myRating = $state(0);
  function getValue() {
    return myRating;
  }
  function setValue(newValue: number) {
    if (newValue >= 0 && newValue <= 5) {
      myRating = newValue;
    }
  }
</script>
<RatingGroup.Root bind:value={getValue, setValue} max={5}>
  {#snippet children({ items })}
    {#each items as item (item.index)}
      <RatingGroup.Item index={item.index}>
        {#if item.state === "active"}⭐{:else}☆{/if}
      </RatingGroup.Item>
    {/each}
  {/snippet}
</RatingGroup.Root>
```

### HTML Forms

Set `name` prop to render hidden input for form submission:
```svelte
<RatingGroup.Root name="productRating" max={5} required>
  <!-- ... -->
</RatingGroup.Root>
```

### Half Ratings

Enable with `allowHalf` prop:
```svelte
<RatingGroup.Root bind:value max={5} allowHalf={true} class="flex gap-1">
  {#snippet children({ items })}
    {#each items as item (item.index)}
      <RatingGroup.Item index={item.index}>
        {#if item.state === "inactive"}
          <Star class="size-full" />
        {:else if item.state === "active"}
          <Star class="size-full fill-current" weight="fill" />
        {:else if item.state === "partial"}
          <StarHalf class="size-full fill-current" weight="fill" />
        {/if}
      </RatingGroup.Item>
    {/each}
  {/snippet}
</RatingGroup.Root>
```

### Readonly Mode

```svelte
<RatingGroup.Root readonly value={4.5}>
  <!-- ... -->
</RatingGroup.Root>
```

### Disabled State

```svelte
<RatingGroup.Root disabled max={5}>
  <!-- ... -->
</RatingGroup.Root>
```

### Hover Preview

Disable with `hoverPreview={false}`:
```svelte
<RatingGroup.Root bind:value max={5} hoverPreview={false} class="flex gap-1">
  {#snippet children({ items })}
    {#each items as item (item.index)}
      <RatingGroup.Item index={item.index}>
        <Star class="size-full group-data-[state=active]:fill-current" weight="fill" />
      </RatingGroup.Item>
    {/each}
  {/snippet}
</RatingGroup.Root>
```

### RTL Support

Set `dir="rtl"` on parent element. Arrow key navigation automatically reverses:
```svelte
<div dir="rtl">
  <RatingGroup.Root bind:value max={5} allowHalf class="flex gap-1">
    {#snippet children({ items })}
      {#each items as item (item.index)}
        <RatingGroup.Item index={item.index}>
          {#if item.state === "partial"}
            <StarHalf class="size-full fill-current rtl:scale-x-[-1]" weight="fill" />
          {:else if item.state === "active"}
            <Star class="size-full fill-current" weight="fill" />
          {:else}
            <Star class="size-full" />
          {/if}
        </RatingGroup.Item>
      {/each}
    {/snippet}
  </RatingGroup.Root>
</div>
```

### Min/Max Rating

```svelte
<RatingGroup.Root max={3}>
  {#snippet children({ items })}
    {#each items as item (item.index)}
      <RatingGroup.Item index={item.index}>
        {item.index + 1}
      </RatingGroup.Item>
    {/each}
  {/snippet}
</RatingGroup.Root>
```

```svelte
<RatingGroup.Root min={3} value={3}>
  {#snippet children({ items })}
    {#each items as item (item.index)}
      <RatingGroup.Item index={item.index}>
        {#if item.state === "active"}⭐{:else}☆{/if}
      </RatingGroup.Item>
    {/each}
  {/snippet}
</RatingGroup.Root>
```

### Accessibility

Uses slider pattern with ARIA attributes: `role="slider"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-valuetext`, `aria-disabled`, `aria-required`, `aria-orientation`.

Keyboard navigation:
- **Direct number input**: Type `3` for 3 stars, `2.5` for half ratings (when `allowHalf` enabled), `0` to clear
- **Arrow keys**: Increment/decrement by 1 (or 0.5 in half-rating mode), reversed in RTL
- **Home/End**: Jump to min/max
- **PageUp/PageDown**: Increment/decrement by 1

Single tab stop - entire rating group is one focusable unit. Clicking focuses root slider.

Custom `aria-valuetext`:
```svelte
<RatingGroup.Root
  aria-valuetext={(value, max) => {
    if (value === 0) return "No rating selected";
    return `${value} out of ${max} stars. ${value >= 4 ? "Excellent" : value >= 3 ? "Good" : "Fair"} rating.`;
  }}
>
  <!-- ... -->
</RatingGroup.Root>
```

### API Reference

**RatingGroup.Root**

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value` $bindable | `number` | `0` | Rating value |
| `onValueChange` | `(value: number) => void` | — | Change callback |
| `disabled` | `boolean` | `false` | Disable interaction |
| `required` | `boolean` | `false` | Required for form |
| `name` | `string` | — | Form submission name (renders hidden input) |
| `min` | `number` | `0` | Minimum rating |
| `max` | `number` | `5` | Maximum rating |
| `allowHalf` | `boolean` | `false` | Allow 0.5 increments |
| `readonly` | `boolean` | `false` | Readonly mode |
| `orientation` | `'vertical' \| 'horizontal'` | `'horizontal'` | Layout direction |
| `hoverPreview` | `boolean` | `false` | Show preview on hover |
| `aria-valuetext` | `string \| (value: number, max: number) => string` | `${value} out of ${max}` | ARIA description |
| `ref` $bindable | `HTMLDivElement` | `null` | DOM reference |
| `children` | `Snippet<{ items: RatingGroupItemData[]; value: number; max: number; }>` | — | Content |

Data attributes: `data-orientation`, `data-disabled`, `data-readonly`, `data-rating-group-root`

**RatingGroup.Item**

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `index` required | `number` | — | Item index |
| `disabled` | `boolean` | `false` | Disable item |
| `ref` $bindable | `HTMLDivElement` | `null` | DOM reference |
| `children` | `Snippet<{ state: 'active' \| 'partial' \| 'inactive'; }>` | — | Content |

Data attributes: `data-disabled`, `data-readonly`, `data-value`, `data-state` ('checked' \| 'unchecked'), `data-orientation`, `data-rating-group-item`

### scroll-area
Scroll area component with four visibility types (hover/scroll/auto/always), customizable hide delay, and orientation control; compose from Root, Viewport, Scrollbar, Thumb, Corner subcomponents.

## Scroll Area

Provides a consistent scroll area component across platforms with customizable scrollbar behavior.

### Basic Structure

```svelte
import { ScrollArea } from "bits-ui";

<ScrollArea.Root>
  <ScrollArea.Viewport>
    <!-- Scrollable content -->
  </ScrollArea.Viewport>
  <ScrollArea.Scrollbar orientation="vertical">
    <ScrollArea.Thumb />
  </ScrollArea.Scrollbar>
  <ScrollArea.Scrollbar orientation="horizontal">
    <ScrollArea.Thumb />
  </ScrollArea.Scrollbar>
  <ScrollArea.Corner />
</ScrollArea.Root>
```

### Reusable Component Pattern

Create a custom `MyScrollArea.svelte` that accepts `orientation` ('vertical' | 'horizontal' | 'both') and `viewportClasses` props to reduce boilerplate:

```svelte
<script lang="ts">
  import { ScrollArea, type WithoutChild } from "bits-ui";
  type Props = WithoutChild<ScrollArea.RootProps> & {
    orientation: "vertical" | "horizontal" | "both";
    viewportClasses?: string;
  };
  let { ref = $bindable(null), orientation = "vertical", viewportClasses, children, ...restProps } = $props();
</script>

{#snippet Scrollbar({ orientation }) }
  <ScrollArea.Scrollbar {orientation}>
    <ScrollArea.Thumb />
  </ScrollArea.Scrollbar>
{/snippet}

<ScrollArea.Root bind:ref {...restProps}>
  <ScrollArea.Viewport class={viewportClasses}>
    {@render children?.()}
  </ScrollArea.Viewport>
  {#if orientation === "vertical" || orientation === "both"}
    {@render Scrollbar({ orientation: "vertical" })}
  {/if}
  {#if orientation === "horizontal" || orientation === "both"}
    {@render Scrollbar({ orientation: "horizontal" })}
  {/if}
  <ScrollArea.Corner />
</ScrollArea.Root>
```

### Scroll Area Types

- **hover** (default): Shows scrollbars only on hover when content exceeds viewport
- **scroll**: Shows scrollbars while scrolling (macOS-like behavior)
- **auto**: Shows scrollbars when content exceeds viewport, remains visible
- **always**: Always shows scrollbars, even if content fits viewport

```svelte
<MyScrollArea type="hover" />
<MyScrollArea type="scroll" />
<MyScrollArea type="auto" />
<MyScrollArea type="always" orientation="both" />
```

### Customization

Hide delay for scrollbars (default 600ms):
```svelte
<MyScrollArea scrollHideDelay={10} />
```

### API Reference

**ScrollArea.Root**
- `type`: 'hover' | 'scroll' | 'auto' | 'always' (default: 'hover')
- `scrollHideDelay`: number in ms (default: 600)
- `dir`: 'ltr' | 'rtl' (default: 'ltr')
- `ref` $bindable: HTMLDivElement
- `children`: Snippet
- `child`: Snippet for render delegation
- Data attribute: `data-scroll-area-root`

**ScrollArea.Viewport**
- `ref` $bindable: HTMLDivElement
- `children`: Snippet
- Data attribute: `data-scroll-area-viewport`

**ScrollArea.Scrollbar**
- `orientation` (required): 'horizontal' | 'vertical'
- `forceMount`: boolean (default: false)
- `ref` $bindable: HTMLDivElement
- `children`: Snippet
- `child`: Snippet for render delegation
- Data attributes: `data-state` ('visible' | 'hidden'), `data-scroll-area-scrollbar-x`, `data-scroll-area-scrollbar-y`

**ScrollArea.Thumb**
- `forceMount`: boolean (default: false)
- `ref` $bindable: HTMLDivElement
- `children`: Snippet
- `child`: Snippet for render delegation
- Data attributes: `data-state` ('visible' | 'hidden'), `data-scroll-area-thumb-x`, `data-scroll-area-thumb-y`

**ScrollArea.Corner**
- `ref` $bindable: HTMLDivElement
- `children`: Snippet
- `child`: Snippet for render delegation
- Data attribute: `data-scroll-area-corner`

### select
Dropdown select component with single/multiple selection, typeahead search, keyboard navigation, Floating UI positioning, scroll buttons, grouping, and full customization via sub-components.

## Select Component

Dropdown component for selecting from a list of options with typeahead search, keyboard navigation, and customizable grouping.

### Key Features
- Typeahead search for quick option finding
- Full keyboard navigation (arrow keys, enter to select)
- Grouped options support
- Scroll management with up/down buttons
- ARIA attributes and screen reader support
- Portal rendering to prevent layout issues

### Architecture

Sub-components:
- **Root**: Main container managing state and context
- **Trigger**: Button that opens the dropdown
- **Portal**: Renders dropdown content to body or custom target
- **Content**: Dropdown container using Floating UI for positioning
- **ContentStatic**: Alternative without Floating UI (manual positioning)
- **Viewport**: Visible area determining size and scroll behavior
- **ScrollUpButton/ScrollDownButton**: Scroll controls for large lists
- **Item**: Individual selectable item
- **Group/GroupHeading**: Organize related items
- **Arrow**: Optional pointer to trigger

### Basic Structure
```svelte
<Select.Root type="single" bind:value>
  <Select.Trigger>Select option</Select.Trigger>
  <Select.Portal>
    <Select.Content>
      <Select.ScrollUpButton />
      <Select.Viewport>
        <Select.Item value="a" label="Option A" />
      </Select.Viewport>
      <Select.ScrollDownButton />
    </Select.Content>
  </Select.Portal>
</Select.Root>
```

### State Management

**Two-way binding:**
```svelte
<script>
  let value = $state("");
</script>
<Select.Root type="single" bind:value>...</Select.Root>
```

**Fully controlled with function binding:**
```svelte
<script>
  let value = $state("");
  function getValue() { return value; }
  function setValue(v) { value = v; }
</script>
<Select.Root type="single" bind:value={getValue, setValue}>...</Select.Root>
```

**Open state:**
```svelte
<script>
  let open = $state(false);
</script>
<Select.Root bind:open>...</Select.Root>
```

### Multiple Selection
```svelte
<script>
  let value = $state<string[]>([]);
</script>
<Select.Root type="multiple" bind:value>
  <Select.Trigger>
    {value.length ? value.join(", ") : "Select items"}
  </Select.Trigger>
  <!-- ... -->
</Select.Root>
```

### Reusable Component Pattern
```svelte
<!-- MySelect.svelte -->
<script lang="ts">
  import { Select, type WithoutChildren } from "bits-ui";
  type Props = WithoutChildren<Select.RootProps> & {
    placeholder?: string;
    items: { value: string; label: string; disabled?: boolean }[];
  };
  let { value = $bindable(), items, placeholder, ...rest }: Props = $props();
  const selectedLabel = $derived(items.find(i => i.value === value)?.label);
</script>
<Select.Root bind:value={value as never} {...rest}>
  <Select.Trigger>{selectedLabel ?? placeholder}</Select.Trigger>
  <Select.Portal>
    <Select.Content>
      <Select.ScrollUpButton>up</Select.ScrollUpButton>
      <Select.Viewport>
        {#each items as { value, label, disabled }}
          <Select.Item {value} {label} {disabled}>
            {#snippet children({ selected })}
              {selected ? "✅" : ""} {label}
            {/snippet}
          </Select.Item>
        {/each}
      </Select.Viewport>
      <Select.ScrollDownButton>down</Select.ScrollDownButton>
    </Select.Content>
  </Select.Portal>
</Select.Root>
```

Usage:
```svelte
<script>
  import MySelect from "$lib/components/MySelect.svelte";
  let fruit = $state("apple");
  const items = [
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
  ];
</script>
<MySelect {items} bind:value={fruit} />
```

### Floating UI Positioning

By default, `Select.Content` uses Floating UI to position relative to trigger. Opt-out with `Select.ContentStatic` for manual positioning:
```svelte
<Select.Root>
  <Select.Trigger />
  <Select.Portal>
    <Select.ContentStatic>
      <!-- position yourself -->
    </Select.ContentStatic>
  </Select.Portal>
</Select.Root>
```

### Custom Anchor
```svelte
<script>
  let customAnchor = $state<HTMLElement>(null!);
</script>
<div bind:this={customAnchor}></div>
<Select.Root>
  <Select.Trigger />
  <Select.Content {customAnchor}>...</Select.Content>
</Select.Root>
```

### Viewport & Scrolling

`Select.Viewport` determines content size for scroll button visibility. Set min/max height on viewport:
```svelte
<Select.Viewport class="max-h-96">...</Select.Viewport>
```

Scroll buttons auto-hide when content fits. Custom scroll delay with `delay` prop:
```svelte
<script>
  import { cubicOut } from "svelte/easing";
  function autoScrollDelay(tick: number) {
    const maxDelay = 200, minDelay = 25, steps = 30;
    const progress = Math.min(tick / steps, 1);
    return maxDelay - (maxDelay - minDelay) * cubicOut(progress);
  }
</script>
<Select.ScrollUpButton delay={autoScrollDelay} />
```

For native scrollbar instead of buttons, omit scroll buttons and set height/overflow on Content:
```svelte
<Select.Content class="max-h-96 overflow-y-auto">
  <Select.Viewport><!-- no scroll buttons --></Select.Viewport>
</Select.Content>
```

### Scroll Lock
Prevent body scroll when select open:
```svelte
<Select.Content preventScroll={true}>...</Select.Content>
```

### Highlighted Items

Follows WAI-ARIA descendant pattern: trigger retains focus during keyboard navigation, items highlight as user navigates.

Style highlighted items with `data-highlighted`:
```svelte
<Select.Item class="data-highlighted:bg-blue-100">...</Select.Item>
```

Callbacks:
```svelte
<Select.Item 
  onHighlight={() => console.log('highlighted')}
  onUnhighlight={() => console.log('unhighlighted')}
/>
```

### Svelte Transitions

Use `forceMount` with `child` snippet for transition control:
```svelte
<script>
  import { fly } from "svelte/transition";
</script>
<Select.Content forceMount>
  {#snippet child({ wrapperProps, props, open })}
    {#if open}
      <div {...wrapperProps}>
        <div {...props} transition:fly={{ duration: 300 }}>
          <!-- content -->
        </div>
      </div>
    {/if}
  {/snippet}
</Select.Content>
```

### API Reference

**Select.Root**
- `type` (required): 'single' | 'multiple'
- `value` ($bindable): string | string[]
- `onValueChange`: callback on value change
- `open` ($bindable): boolean
- `onOpenChange`: callback on open change
- `onOpenChangeComplete`: callback after animations complete
- `disabled`: boolean
- `name`: string (for form submission)
- `required`: boolean
- `scrollAlignment`: 'nearest' | 'center' (default: 'nearest')
- `loop`: boolean (default: false)
- `allowDeselect`: boolean (default: false)
- `items`: { value: string; label: string; disabled?: boolean }[]
- `autocomplete`: string

**Select.Trigger**
- `ref` ($bindable): HTMLButtonElement
- Data attributes: `data-state`, `data-placeholder`, `data-disabled`, `data-select-trigger`

**Select.Content**
- `side`: 'top' | 'bottom' | 'left' | 'right' (default: 'bottom')
- `sideOffset`: number (default: 0)
- `align`: 'start' | 'center' | 'end' (default: 'start')
- `alignOffset`: number (default: 0)
- `avoidCollisions`: boolean (default: true)
- `collisionBoundary`: Element | null
- `collisionPadding`: number | Partial<Record<Side, number>> (default: 0)
- `sticky`: 'partial' | 'always' (default: 'partial')
- `hideWhenDetached`: boolean (default: true)
- `updatePositionStrategy`: 'optimized' | 'always' (default: 'optimized')
- `strategy`: 'fixed' | 'absolute' (default: 'fixed')
- `preventScroll`: boolean (default: false)
- `customAnchor`: string | HTMLElement | Measurable | null
- `onEscapeKeydown`: callback
- `escapeKeydownBehavior`: 'close' | 'ignore' | 'defer-otherwise-close' | 'defer-otherwise-ignore' (default: 'close')
- `onInteractOutside`: callback
- `onFocusOutside`: callback
- `interactOutsideBehavior`: 'close' | 'ignore' | 'defer-otherwise-close' | 'defer-otherwise-ignore' (default: 'close')
- `preventOverflowTextSelection`: boolean (default: true)
- `dir`: 'ltr' | 'rtl' (default: 'ltr')
- `loop`: boolean (default: false)
- `forceMount`: boolean (default: false)
- `ref` ($bindable): HTMLDivElement
- Data attributes: `data-state`, `data-select-content`
- CSS variables: `--bits-select-content-transform-origin`, `--bits-select-content-available-width`, `--bits-select-content-available-height`, `--bits-select-anchor-width`, `--bits-select-anchor-height`

**Select.ContentStatic** (no Floating UI)
- Similar to Content but without positioning props
- `onEscapeKeydown`, `escapeKeydownBehavior`, `onInteractOutside`, `onFocusOutside`, `interactOutsideBehavior`
- `onOpenAutoFocus`, `onCloseAutoFocus`
- `trapFocus`: boolean (default: true)
- `preventScroll`: boolean (default: true)
- `preventOverflowTextSelection`: boolean (default: true)
- `dir`: 'ltr' | 'rtl' (default: 'ltr')
- `loop`: boolean (default: false)
- `forceMount`: boolean (default: false)

**Select.Portal**
- `to`: Element | string (default: document.body)
- `disabled`: boolean (default: false)

**Select.Item**
- `value` (required): string
- `label`: string
- `disabled`: boolean (default: false)
- `onHighlight`: callback
- `onUnhighlight`: callback
- `ref` ($bindable): HTMLDivElement
- Data attributes: `data-value`, `data-label`, `data-disabled`, `data-highlighted`, `data-selected`, `data-select-item`

**Select.Viewport**
- `ref` ($bindable): HTMLDivElement
- Data attribute: `data-select-viewport`

**Select.ScrollUpButton / Select.ScrollDownButton**
- `delay`: (tick: number) => number (default: () => 50)
- `ref` ($bindable): HTMLDivElement
- Data attributes: `data-select-scroll-up-button` / `data-select-scroll-down-button`

**Select.Group**
- `ref` ($bindable): HTMLDivElement
- Data attribute: `data-select-group`

**Select.GroupHeading**
- `ref` ($bindable): HTMLDivElement
- Data attribute: `data-select-group-heading`

**Select.Arrow**
- `width`: number (default: 8)
- `height`: number (default: 8)
- `ref` ($bindable): HTMLDivElement
- Data attribute: `data-arrow`

### separator
Headless separator component with horizontal/vertical orientation, decorative flag for a11y, and data attributes for styling.

## Separator

A headless UI component for visually separating content or UI elements.

### Basic Usage

```svelte
import { Separator } from "bits-ui";

<Separator.Root />
```

### Examples

Horizontal separator (default):
```svelte
<div class="space-y-1">
  <h4>Bits UI</h4>
  <p>Headless UI components for Svelte.</p>
</div>
<Separator.Root class="bg-border my-4 shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full" />
```

Vertical separators in a row:
```svelte
<div class="flex h-5 items-center space-x-4 text-sm">
  <div>Blog</div>
  <Separator.Root orientation="vertical" class="bg-border data-[orientation=vertical]:h-full data-[orientation=vertical]:w-[1px]" />
  <div>Docs</div>
  <Separator.Root orientation="vertical" class="bg-border data-[orientation=vertical]:h-full data-[orientation=vertical]:w-[1px]" />
  <div>Source</div>
</div>
```

### API

**Separator.Root** - The separator element.

Props:
- `orientation` (enum: 'horizontal' | 'vertical', default: 'horizontal') - The orientation of the separator
- `decorative` (boolean, default: false) - Whether the separator is decorative; affects screen reader announcement
- `ref` (bindable HTMLDivElement, default: null) - Reference to the underlying DOM element
- `children` (Snippet) - Child content to render
- `child` (Snippet with SnippetProps) - Render delegation for custom elements

Data attributes:
- `data-orientation` - 'horizontal' or 'vertical'
- `data-separator-root` - Present on the root element

### slider
Slider component for selecting values from continuous ranges; supports single/multiple thumbs, vertical/horizontal, discrete steps, ticks, labels, RTL, and form integration.

## Slider Component

Enables users to select a value from a continuous range. Supports single or multiple thumbs, vertical/horizontal orientation, discrete steps, and RTL.

### Basic Usage

```svelte
<script lang="ts">
  import { Slider } from "bits-ui";
  let value = $state(50);
</script>

<Slider.Root type="single" bind:value>
  <span class="track">
    <Slider.Range />
  </span>
  <Slider.Thumb index={0} />
</Slider.Root>
```

### Structure
- `Slider.Root` - container
- `Slider.Range` - filled portion of track
- `Slider.Thumb` - draggable handle
- `Slider.Tick` - tick marks
- `Slider.TickLabel` - labels for ticks
- `Slider.ThumbLabel` - labels for thumbs

### State Management

**Two-way binding:**
```svelte
let myValue = $state(0);
<Slider.Root bind:value={myValue} type="single" />
```

**Fully controlled with function binding:**
```svelte
let myValue = $state(0);
<Slider.Root type="single" bind:value={() => myValue, (v) => myValue = v} />
```

### Callbacks
- `onValueChange` - fires continuously while dragging
- `onValueCommit` - fires when user stops dragging

### Types

**Single thumb:**
```svelte
<Slider.Root type="single" bind:value={50} />
```

**Multiple thumbs:**
```svelte
<Slider.Root type="multiple" bind:value={[25, 75]}>
  {#snippet children({ thumbItems })}
    {#each thumbItems as { index } (index)}
      <Slider.Thumb {index} />
    {/each}
  {/snippet}
</Slider.Root>
```

### Orientation

```svelte
<Slider.Root type="single" orientation="vertical">
  <!-- vertical slider -->
</Slider.Root>
```

### Steps

**Continuous step:**
```svelte
<Slider.Root type="single" step={1} min={0} max={10} />
```

**Discrete steps (snap to values):**
```svelte
<Slider.Root type="single" step={[0, 4, 8, 16, 24]} />
```

### Ticks and Labels

```svelte
<Slider.Root type="single" step={1} min={0} max={10}>
  {#snippet children({ tickItems })}
    {#each tickItems as { index, value } (index)}
      <Slider.Tick {index} />
      <Slider.TickLabel {index} position="top">{value}</Slider.TickLabel>
    {/each}
  {/snippet}
</Slider.Root>
```

### Thumb Labels

```svelte
<Slider.Root type="multiple" value={[10, 50]}>
  <Slider.Range />
  {#snippet children({ thumbItems })}
    {#each thumbItems as { index, value } (index)}
      <Slider.Thumb {index} />
      <Slider.ThumbLabel {index} position="top">
        {index === 0 ? "Min" : "Max"}: {value}
      </Slider.ThumbLabel>
    {/each}
  {/snippet}
</Slider.Root>
```

### Reusable Component

```svelte
<!-- MySlider.svelte -->
<script lang="ts">
  import type { ComponentProps } from "svelte";
  import { Slider } from "bits-ui";
  type Props = WithoutChildren<ComponentProps<typeof Slider.Root>>;
  let { value = $bindable(), ref = $bindable(null), ...restProps }: Props = $props();
</script>

<Slider.Root bind:value bind:ref {...restProps as any}>
  {#snippet children({ thumbs, ticks })}
    <Slider.Range />
    {#each thumbs as index}
      <Slider.Thumb {index} />
    {/each}
    {#each ticks as index}
      <Slider.Tick {index} />
    {/each}
  {/snippet}
</Slider.Root>
```

### HTML Forms

Since slider values are continuous, render hidden inputs manually:

```svelte
<form method="POST">
  <MySlider type="multiple" bind:value={[50, 100]} />
  <input type="hidden" name="start" value={value[0]} />
  <input type="hidden" name="end" value={value[1]} />
  <button type="submit">Submit</button>
</form>
```

### Configuration

- `type` (required) - 'single' | 'multiple'
- `value` - current value(s), bindable
- `min` - minimum value (default: 0)
- `max` - maximum value (default: 100)
- `step` - number or array of numbers for discrete steps
- `orientation` - 'horizontal' | 'vertical' (default: 'horizontal')
- `dir` - 'ltr' | 'rtl' (default: 'ltr')
- `disabled` - disable interaction
- `autoSort` - auto-sort values when thumbs cross (default: true, multiple only)
- `thumbPositioning` - 'exact' | 'contain' (default: 'contain')
- `trackPadding` - percentage padding at track edges (SSR-friendly alternative to thumbPositioning)

### Data Attributes

**Slider.Root:** `data-orientation`, `data-disabled`, `data-slider-root`

**Slider.Range:** `data-orientation`, `data-disabled`, `data-slider-range`

**Slider.Thumb:** `data-orientation`, `data-disabled`, `data-active`, `data-slider-thumb`

**Slider.Tick:** `data-orientation`, `data-disabled`, `data-bounded`, `data-value`, `data-selected`, `data-slider-tick`

**Slider.TickLabel:** `data-orientation`, `data-disabled`, `data-position`, `data-selected`, `data-value`, `data-bounded`, `data-slider-tick-label`

**Slider.ThumbLabel:** `data-orientation`, `data-disabled`, `data-position`, `data-active`, `data-value`, `data-slider-thumb-label`

### switch
Toggle switch component with state binding, form support, data attributes for styling, and WAI-ARIA accessibility.

## Switch Component

A toggle control for binary on/off states, commonly used for settings and feature toggles.

### Basic Usage

```svelte
<script lang="ts">
  import { Switch, Label } from "bits-ui";
</script>

<Switch.Root id="dnd" name="hello">
  <Switch.Thumb />
</Switch.Root>
<Label.Root for="dnd">Do not disturb</Label.Root>
```

### Architecture

Two-part component:
- **Root**: Manages state and behavior
- **Thumb**: Visual indicator of current state

### Creating Reusable Components

```svelte
<script lang="ts">
  import { Switch, Label, useId } from "bits-ui";
  let {
    id = useId(),
    checked = $bindable(false),
    ref = $bindable(null),
    labelText,
    ...restProps
  } = $props();
</script>

<Switch.Root bind:checked bind:ref {id} {...restProps}>
  <Switch.Thumb />
</Switch.Root>
<Label.Root for={id}>{labelText}</Label.Root>
```

Usage: `<MySwitch bind:checked={notifications} labelText="Enable notifications" />`

### State Management

**Two-way binding:**
```svelte
<script lang="ts">
  let myChecked = $state(true);
</script>
<Switch.Root bind:checked={myChecked} />
```

**Fully controlled with function binding:**
```svelte
<script lang="ts">
  let myChecked = $state(false);
  function getChecked() { return myChecked; }
  function setChecked(newChecked: boolean) { myChecked = newChecked; }
</script>
<Switch.Root bind:checked={getChecked, setChecked} />
```

### Disabled State

```svelte
<Switch.Root disabled />
```

### HTML Forms

Hidden input submission with `name` prop:
```svelte
<Switch.Root name="dnd" />
```

Default value is `'on'` when checked. Custom value:
```svelte
<Switch.Root name="dnd" value="hello" />
```

Required switch:
```svelte
<Switch.Root required />
```

### API Reference

**Switch.Root Props:**
- `checked` ($bindable): boolean, default false
- `onCheckedChange`: (checked: boolean) => void callback
- `disabled`: boolean, default false
- `name`: string for form submission
- `required`: boolean, default false
- `value`: string for hidden input value
- `ref` ($bindable): HTMLButtonElement reference
- `children`: Snippet with { checked: boolean }
- `child`: Snippet for render delegation

**Switch.Root Data Attributes:**
- `data-state`: 'checked' | 'unchecked'
- `data-checked`: present when checked
- `data-disabled`: present when disabled
- `data-switch-root`: always present

**Switch.Thumb Props:**
- `ref` ($bindable): HTMLSpanElement reference
- `children`: Snippet with { checked: boolean }
- `child`: Snippet for render delegation

**Switch.Thumb Data Attributes:**
- `data-state`: 'checked' | 'unchecked'
- `data-checked`: present when checked
- `data-switch-thumb`: always present

### Key Features

- WAI-ARIA compliant with keyboard navigation and screen reader support
- Controlled and uncontrolled state management
- Data attributes for styling state transitions
- Form integration with hidden input element

### tabs
Tabbed content organizer with horizontal/vertical orientation, automatic/manual activation modes, bindable value state, and keyboard navigation with looping.

## Tabs Component

Organizes content into tabbed sections.

### Basic Structure
```svelte
<Tabs.Root>
  <Tabs.List>
    <Tabs.Trigger />
  </Tabs.List>
  <Tabs.Content />
</Tabs.Root>
```

### State Management

**Two-way binding:**
```svelte
<script lang="ts">
  import { Tabs } from "bits-ui";
  let myValue = $state("");
</script>
<button onclick={() => (myValue = "tab-1")}> Activate tab 1 </button>
<Tabs.Root bind:value={myValue}>
  <!-- -->
</Tabs.Root>
```

**Fully controlled with function binding:**
```svelte
<script lang="ts">
  let myValue = $state("");
  function getValue() { return myValue; }
  function setValue(newValue: string) { myValue = newValue; }
</script>
<Tabs.Root bind:value={getValue, setValue}>
  <!-- ... -->
</Tabs.Root>
```

### Orientation & Activation

- `orientation` prop: `'horizontal'` (default, uses ArrowLeft/Right) or `'vertical'` (uses ArrowUp/Down)
- `activationMode` prop: `'automatic'` (default, activates on focus) or `'manual'` (requires pressing trigger)

```svelte
<Tabs.Root orientation="vertical" activationMode="manual">
  <!-- ... -->
</Tabs.Root>
```

### API Reference

**Tabs.Root**
- `value` (bindable): string - active tab value
- `onValueChange`: (value: string) => void callback
- `activationMode`: 'automatic' | 'manual' (default: 'automatic')
- `disabled`: boolean (default: false)
- `loop`: boolean - keyboard navigation loops (default: true)
- `orientation`: 'horizontal' | 'vertical' (default: 'horizontal')
- `ref` (bindable): HTMLDivElement
- Data attributes: `data-orientation`, `data-tabs-root`

**Tabs.List**
- `ref` (bindable): HTMLDivElement
- Data attributes: `data-orientation`, `data-tabs-list`

**Tabs.Trigger**
- `value` (required): string - tab value this trigger represents
- `disabled`: boolean (default: false)
- `ref` (bindable): HTMLButtonElement
- Data attributes: `data-state` ('active' | 'inactive'), `data-value`, `data-orientation`, `data-disabled`, `data-tabs-trigger`

**Tabs.Content**
- `value` (required): string - tab value this content represents
- `ref` (bindable): HTMLDivElement
- Data attributes: `data-tabs-content`

### time-field
TimeField: customizable time input with segments (hour/minute/second/dayPeriod/timeZoneName), validation (min/max/custom), granularity control, localization, state binding, readonly segments, form submission support.

## TimeField Component

Alternative to native `<input type="time">` with customizable segments for hour, minute, second, dayPeriod, and timeZoneName.

### Basic Structure
```svelte
<TimeField.Root>
  <TimeField.Label>Check-in time</TimeField.Label>
  <TimeField.Input>
    {#snippet children({ segments })}
      {#each segments as { part, value }}
        <TimeField.Segment {part}>{value}</TimeField.Segment>
      {/each}
    {/snippet}
  </TimeField.Input>
</TimeField.Root>
```

### Reusable Component Pattern
Create a `MyTimeField` wrapper that accepts `value`, `placeholder`, `labelText`, and spreads remaining props to `TimeField.Root`. Bind both `value` and `placeholder` for state management.

### Segments
Each segment represents a time part (hour, minute, second, dayPeriod, timeZoneName) or "literal" (separator). Style literals differently from editable segments.

### Placeholder
The `placeholder` prop sets the starting time when cycling through segments, not the empty-state display. Defaults to `12:00 AM` or `00:00` depending on hour cycle.

```svelte
<MyTimeField placeholder={new Time(12, 30)} />
<MyTimeField placeholder={now("America/New_York")} />
```

### State Management

**Two-way binding:**
```svelte
let myValue = $state(new Time(12, 30));
<TimeField.Root bind:value={myValue} />
```

**Fully controlled:**
```svelte
let myValue = $state<TimeValue>();
<TimeField.Root bind:value={() => myValue, (v) => myValue = v} />
```

Same pattern applies to `placeholder` with `bind:placeholder`.

### Default Value
Parse ISO 8601 strings using `parseDateTime()` or `parseZonedDateTime()`:
```svelte
const date = "2024-08-03T15:15";
let value = $state(parseDateTime(date));
<TimeField.Root {value} />
```

### Validation

**Min/Max values:**
```svelte
<MyTimeField minValue={new Time(9, 0)} value={new Time(8, 0)} />
<MyTimeField maxValue={new Time(17, 0)} value={new Time(18, 0)} />
```

**Custom validation:**
```svelte
function validate(time: TimeValue) {
  return time.hour === 12 ? "Time cannot be 12:00 PM" : undefined;
}
function onInvalid(reason: "min" | "max" | "custom", msg?: string | string[]) {
  if (reason === "custom") toast.error(typeof msg === "string" ? msg : msg.join(", "));
  else if (reason === "min") toast.error("The time is too early.");
  else if (reason === "max") toast.error("The time is too late.");
}
<MyTimeField {validate} {value} {onInvalid} />
```

### Granularity
Controls which segments render. Options: `'hour'`, `'minute'` (default), `'second'`.
```svelte
<MyTimeField granularity="second" value={new Time(12, 30)} />
```

### Localization
```svelte
<MyTimeField locale="de" value={new Time(13, 30, 0)} />
```
Affects segment formatting and placeholders. German locale uses 24-hour format without day period.

### API Reference

**TimeField.Root props:**
- `value` $bindable: `TimeValue` (Time | CalendarDateTime | ZonedDateTime)
- `onValueChange`: callback when value changes
- `placeholder` $bindable: starting time for segment cycling
- `onPlaceholderChange`: callback when placeholder changes
- `required`: boolean, default false
- `validate`: (time: TimeValue) => string[] | string | void
- `onInvalid`: (reason: 'min' | 'max' | 'custom', msg?: string | string[]) => void
- `errorMessageId`: id of error message element
- `hourCycle`: '12' | '24', defaults to locale preference
- `granularity`: 'hour' | 'minute' | 'second', default 'minute'
- `hideTimeZone`: boolean, default false (hides timezone segment for ZonedDateTime)
- `maxValue`, `minValue`: TimeValue constraints
- `locale`: string, default 'en-US'
- `disabled`: boolean, default false
- `readonly`: boolean, default false
- `readonlySegments`: EditableTimeSegmentPart[] to make specific segments readonly
- `children`: Snippet

**TimeField.Input props:**
- `name`: string for form submission (renders hidden input)
- `ref` $bindable: HTMLDivElement
- `children`: Snippet with `{ segments: Array<{ part: TimeSegmentPart; value: string }> }`
- `child`: render delegation snippet
- Data attributes: `data-invalid`, `data-disabled`, `data-time-field-input`

**TimeField.Segment props:**
- `part` required: 'hour' | 'minute' | 'second' | 'dayPeriod' | 'timeZoneName' | 'literal'
- `ref` $bindable: HTMLDivElement
- `children`: Snippet
- `child`: render delegation snippet
- Data attributes: `data-invalid`, `data-disabled`, `data-readonly`, `data-segment`, `data-time-field-segment`

**TimeField.Label props:**
- `ref` $bindable: HTMLSpanElement
- `children`: Snippet
- `child`: render delegation snippet
- Data attributes: `data-invalid`, `data-disabled`, `data-time-field-label`

### time-range-field
TimeRangeField combines two Time Fields for start/end time input with bindable value/placeholder (TimeRange/TimeValue), validation, min/max constraints, granularity/hourCycle/locale config, and segment-level control.

## TimeRangeField Component

Combines two Time Field components to create a time range input field with start and end times.

### Basic Structure
```svelte
<script lang="ts">
  import { TimeRangeField } from "bits-ui";
</script>
<TimeRangeField.Root>
  <TimeRangeField.Label>Working Hours</TimeRangeField.Label>
  {#each ["start", "end"] as const as type}
    <TimeRangeField.Input {type}>
      {#snippet children({ segments })}
        {#each segments as { part, value }}
          <TimeRangeField.Segment {part}>
            {value}
          </TimeRangeField.Segment>
        {/each}
      {/snippet}
    </TimeRangeField.Input>
  {/each}
</TimeRangeField.Root>
```

### Managing Placeholder State

Two-way binding:
```svelte
<script lang="ts">
  import { TimeRangeField } from "bits-ui";
  import { Time } from "@internationalized/date";
  let myPlaceholder = $state(new Time(12, 30));
</script>
<TimeRangeField.Root bind:placeholder={myPlaceholder}>
  <!-- ... -->
</TimeRangeField.Root>
```

Fully controlled with function binding:
```svelte
let myPlaceholder = $state(new Time(12, 30));
function getPlaceholder() { return myPlaceholder; }
function setPlaceholder(newPlaceholder: TimeValue) { myPlaceholder = newPlaceholder; }
<TimeRangeField.Root bind:placeholder={getPlaceholder, setPlaceholder}>
```

### Managing Value State

Two-way binding:
```svelte
<script lang="ts">
  import { TimeRangeField, type TimeRange } from "bits-ui";
  import { Time } from "@internationalized/date";
  let myValue = $state<TimeRange>({
    start: new Time(12, 30),
    end: new Time(12, 30),
  });
</script>
<button onclick={() => {
  myValue = {
    start: myValue.start.add({ hours: 1 }),
    end: myValue.end.add({ hours: 1 }),
  };
}}>Add 1 hour</button>
<TimeRangeField.Root bind:value={myValue}>
```

Fully controlled:
```svelte
let myValue = $state<TimeRange | undefined>({
  start: undefined,
  end: undefined,
});
function getValue() { return myValue; }
function setValue(newValue: TimeRange | undefined) { myValue = newValue; }
<TimeRangeField.Root bind:value={getValue, setValue}>
```

### API Reference

**TimeRangeField.Root** - Root component with properties:
- `value` $bindable: `TimeRange` - { start: TimeValue | undefined; end: TimeValue | undefined }
- `onValueChange`: callback when time range changes
- `placeholder` $bindable: `TimeValue` (Time | CalendarDateTime | ZonedDateTime)
- `onPlaceholderChange`: callback when placeholder changes
- `errorMessageId`: id of error message element
- `validate`: function returning validation errors
- `onInvalid`: callback with reason ('min' | 'max' | 'custom') and optional message
- `minValue`, `maxValue`: TimeValue constraints
- `granularity`: 'hour' | 'minute' | 'second' (default: 'minute')
- `hideTimeZone`: boolean (default: false)
- `hourCycle`: '12' | '24'
- `locale`: string (default: 'en-US')
- `disabled`, `readonly`, `required`: boolean flags
- `readonlySegments`: EditableTimeSegmentPart[] - segments that prevent user input
- `onStartValueChange`, `onEndValueChange`: callbacks for individual time changes
- `ref` $bindable: HTMLDivElement
- `children`, `child`: Snippet for content
- Data attribute: `data-time-range-field-root`

**TimeRangeField.Input** - Container for segments:
- `type` required: 'start' | 'end'
- `name`: string for form submission (renders hidden input)
- `ref` $bindable: HTMLDivElement
- `children`: Snippet with segments array { part: TimeSegmentPart; value: string }[]
- `child`: Snippet for render delegation
- Data attributes: `data-invalid`, `data-disabled`, `data-time-field-input`

**TimeRangeField.Segment** - Individual time segment:
- `part` required: "hour" | "minute" | "second" | "dayPeriod" | "timeZoneName" | "literal"
- `ref` $bindable: HTMLSpanElement
- `children`, `child`: Snippet for content
- Data attributes: `data-invalid`, `data-disabled`, `data-segment`, `data-time-field-segment`

**TimeRangeField.Label** - Label component:
- `ref` $bindable: HTMLSpanElement
- `children`, `child`: Snippet for content
- Data attributes: `data-invalid`, `data-time-field-label`

### toggle
Toggle button with bindable pressed state, onPressedChange callback, disabled prop, and data-state attribute for styling.

## Toggle Component

A button control that switches between two states (pressed/unpressed).

### Basic Usage

```svelte
<script lang="ts">
  import { Toggle } from "bits-ui";
</script>
<Toggle.Root />
```

### Managing Pressed State

**Two-way binding:**
```svelte
<script lang="ts">
  import { Toggle } from "bits-ui";
  let myPressed = $state(true);
</script>
<button onclick={() => (myPressed = false)}>un-press</button>
<Toggle.Root bind:pressed={myPressed} />
```

**Fully controlled with function binding:**
```svelte
<script lang="ts">
  import { Toggle } from "bits-ui";
  let myPressed = $state(false);
</script>
<Toggle.Root bind:pressed={() => myPressed, (newPressed) => (myPressed = newPressed)}>
  <!-- ... -->
</Toggle.Root>
```

### API Reference

**Toggle.Root properties:**
- `pressed` (bindable, boolean, default: false) - Whether the toggle is pressed
- `onPressedChange` (function) - Callback when pressed state changes
- `disabled` (boolean, default: false) - Disables the toggle
- `ref` (bindable, HTMLButtonElement) - Reference to underlying DOM element
- `children` (Snippet) - Content to render
- `child` (Snippet) - For render delegation

**Data attributes:**
- `data-state` - 'on' or 'off'
- `data-disabled` - Present when disabled
- `data-toggle-root` - Present on root element

### Example

Lock/unlock code display toggle:
```svelte
<script lang="ts">
  import { Toggle } from "bits-ui";
  import LockKeyOpen from "phosphor-svelte/lib/LockKeyOpen";
  let unlocked = $state(false);
  const code = $derived(unlocked ? "B1T5" : "••••");
</script>
<div class="flex items-center gap-2">
  <div>{code}</div>
  <Toggle.Root aria-label="toggle code visibility" bind:pressed={unlocked}>
    <LockKeyOpen class="size-6" />
  </Toggle.Root>
</div>
```

### toggle-group
Toggle group component supporting single or multiple selection modes with roving focus navigation, state binding, and orientation control.

## Toggle Group

Groups multiple toggle controls, allowing users to enable one or multiple options.

### Basic Structure
```svelte
<script lang="ts">
  import { ToggleGroup } from "bits-ui";
</script>
<ToggleGroup.Root>
  <ToggleGroup.Item value="bold">bold</ToggleGroup.Item>
  <ToggleGroup.Item value="italic">italic</ToggleGroup.Item>
</ToggleGroup.Root>
```

### Single & Multiple Modes
- `type="single"`: Only one item selected at a time, `value` is a string
- `type="multiple"`: Multiple items can be selected, `value` is a string array

### State Management

**Two-way binding:**
```svelte
<script lang="ts">
  let myValue = $state("");
</script>
<ToggleGroup.Root type="single" bind:value={myValue}>
  <!-- -->
</ToggleGroup.Root>
```

**Fully controlled with function binding:**
```svelte
<script lang="ts">
  let myValue = $state("");
  function getValue() { return myValue; }
  function setValue(newValue: string) { myValue = newValue; }
</script>
<ToggleGroup.Root type="single" bind:value={getValue, setValue}>
  <!-- ... -->
</ToggleGroup.Root>
```

### ToggleGroup.Root Props
- `type` (required): `'single'` | `'multiple'` - determines value type
- `value` ($bindable): `string` | `string[]` - current selection
- `onValueChange`: callback when value changes
- `disabled`: boolean (default: false)
- `loop`: boolean (default: true) - loop when navigating
- `orientation`: `'horizontal'` | `'vertical'` (default: 'horizontal')
- `rovingFocus`: boolean (default: true) - use roving focus navigation
- `ref` ($bindable): `HTMLDivElement`
- `children`: Snippet
- `child`: Snippet for render delegation

**Data attributes:**
- `data-orientation`: 'horizontal' | 'vertical'
- `data-toggle-group-root`: present on root

### ToggleGroup.Item Props
- `value` (required): `string` - item identifier
- `disabled`: boolean (default: false)
- `ref` ($bindable): `HTMLButtonElement`
- `children`: Snippet
- `child`: Snippet for render delegation

**Data attributes:**
- `data-state`: 'on' | 'off'
- `data-value`: item value
- `data-orientation`: 'horizontal' | 'vertical'
- `data-disabled`: present when disabled
- `data-toggle-group-item`: present on item

### Example with Icons
```svelte
<script lang="ts">
  import { ToggleGroup } from "bits-ui";
  import TextB from "phosphor-svelte/lib/TextB";
  import TextItalic from "phosphor-svelte/lib/TextItalic";
  import TextStrikethrough from "phosphor-svelte/lib/TextStrikethrough";
  let value = $state(["bold"]);
</script>
<ToggleGroup.Root bind:value type="multiple">
  <ToggleGroup.Item aria-label="toggle bold" value="bold">
    <TextB />
  </ToggleGroup.Item>
  <ToggleGroup.Item aria-label="toggle italic" value="italic">
    <TextItalic />
  </ToggleGroup.Item>
  <ToggleGroup.Item aria-label="toggle strikethrough" value="strikethrough">
    <TextStrikethrough />
  </ToggleGroup.Item>
</ToggleGroup.Root>
```

### toolbar
Toolbar with toggle groups (single/multiple), buttons, and links; state via bind:value or function binding; data attributes for styling state.

## Toolbar Component

Displays frequently used actions or tools in a compact and easily accessible bar.

### Basic Structure
```svelte
<script lang="ts">
  import { Toolbar } from "bits-ui";
</script>
<Toolbar.Root>
  <Toolbar.Group>
    <Toolbar.GroupItem />
  </Toolbar.Group>
  <Toolbar.Link />
  <Toolbar.Button />
</Toolbar.Root>
```

### Complete Example
```svelte
<script lang="ts">
  import { Separator, Toolbar } from "bits-ui";
  import Sparkle from "phosphor-svelte/lib/Sparkle";
  import TextAlignCenter from "phosphor-svelte/lib/TextAlignCenter";
  import TextAlignLeft from "phosphor-svelte/lib/TextAlignLeft";
  import TextAlignRight from "phosphor-svelte/lib/TextAlignRight";
  import TextB from "phosphor-svelte/lib/TextB";
  import TextItalic from "phosphor-svelte/lib/TextItalic";
  import TextStrikethrough from "phosphor-svelte/lib/TextStrikethrough";
  let text = $state(["bold"]);
  let align = $state("");
</script>
<Toolbar.Root class="rounded-10px border-border bg-background-alt shadow-mini flex h-12 min-w-max items-center justify-center border px-[4px] py-1">
  <Toolbar.Group bind:value={text} type="multiple" class="flex items-center gap-x-0.5">
    <Toolbar.GroupItem aria-label="toggle bold" value="bold" class="...">
      <TextB class="size-6" />
    </Toolbar.GroupItem>
    <Toolbar.GroupItem aria-label="toggle italic" value="italic" class="...">
      <TextItalic class="size-6" />
    </Toolbar.GroupItem>
    <Toolbar.GroupItem aria-label="toggle strikethrough" value="strikethrough" class="...">
      <TextStrikethrough class="size-6" />
    </Toolbar.GroupItem>
  </Toolbar.Group>
  <Separator.Root class="bg-dark-10 -my-1 mx-1 w-[1px] self-stretch" />
  <Toolbar.Group bind:value={align} type="single" class="flex items-center gap-x-0.5">
    <Toolbar.GroupItem aria-label="align left" value="left" class="...">
      <TextAlignLeft class="size-6" />
    </Toolbar.GroupItem>
    <Toolbar.GroupItem aria-label="align center" value="center" class="...">
      <TextAlignCenter class="size-6" />
    </Toolbar.GroupItem>
    <Toolbar.GroupItem aria-label="align right" value="right" class="...">
      <TextAlignRight class="size-6" />
    </Toolbar.GroupItem>
  </Toolbar.Group>
  <Separator.Root class="bg-dark-10 -my-1 mx-1 w-[1px] self-stretch" />
  <div class="flex items-center">
    <Toolbar.Button class="...">
      <Sparkle class="mr-2 size-6" />
      <span>Ask AI</span>
    </Toolbar.Button>
  </div>
</Toolbar.Root>
```

### State Management

**Two-Way Binding:**
```svelte
<script lang="ts">
  let myValue = $state("");
</script>
<button onclick={() => (myValue = "item-1")}>Press item 1</button>
<Toolbar.Root>
  <Toolbar.Group type="single" bind:value={myValue}>
    <!-- ... -->
  </Toolbar.Group>
</Toolbar.Root>
```

**Fully Controlled (Function Binding):**
```svelte
<script lang="ts">
  let myValue = $state("");
  function getValue() { return myValue; }
  function setValue(newValue: string) { myValue = newValue; }
</script>
<Toolbar.Root>
  <Toolbar.Group type="single" bind:value={getValue, setValue}>
    <!-- ... -->
  </Toolbar.Group>
</Toolbar.Root>
```

### API Reference

**Toolbar.Root**
- `loop` (boolean, default: true): Whether toolbar should loop when navigating
- `orientation` ('horizontal' | 'vertical', default: 'horizontal'): Toolbar orientation
- `ref` ($bindable HTMLDivElement): Reference to underlying DOM element
- `children` (Snippet): Content to render
- `child` (Snippet): Render delegation snippet
- Data attributes: `data-orientation`, `data-toolbar-root`

**Toolbar.Button**
- `disabled` (boolean, default: false): Whether button is disabled
- `ref` ($bindable HTMLButtonElement): Reference to underlying DOM element
- `children` (Snippet): Content to render
- `child` (Snippet): Render delegation snippet
- Data attribute: `data-toolbar-button`

**Toolbar.Link**
- `ref` ($bindable HTMLAnchorElement): Reference to underlying DOM element
- `children` (Snippet): Content to render
- `child` (Snippet): Render delegation snippet
- Data attribute: `data-toolbar-link`

**Toolbar.Group**
- `type` (required, 'single' | 'multiple'): Determines value type (string or string array)
- `value` ($bindable string | string[]): Current value
- `onValueChange` (function): Callback when value changes
- `disabled` (boolean, default: false): Whether group is disabled
- `ref` ($bindable HTMLDivElement): Reference to underlying DOM element
- `children` (Snippet): Content to render
- `child` (Snippet): Render delegation snippet
- Data attribute: `data-toolbar-group`

**Toolbar.GroupItem**
- `value` (required, string): Item value; sets group value in single mode or pushes to array in multiple mode
- `disabled` (boolean, default: false): Whether item is disabled
- `ref` ($bindable HTMLButtonElement): Reference to underlying DOM element
- `children` (Snippet): Content to render
- `child` (Snippet): Render delegation snippet
- Data attributes: `data-state` ('on' | 'off'), `data-value`, `data-disabled`, `data-toolbar-item`

### tooltip
Tooltip component for hover-triggered supplementary info; requires Provider wrapper; supports state binding, custom positioning via Floating UI or static, transitions with forceMount, custom anchors; not mobile-compatible; non-essential content only.

## Tooltip Component

Displays supplementary information when users hover over or interact with an element.

### Basic Structure
```svelte
<Tooltip.Provider>
  <Tooltip.Root delayDuration={200}>
    <Tooltip.Trigger>Hover me</Tooltip.Trigger>
    <Tooltip.Portal>
      <Tooltip.Content sideOffset={8}>
        <Tooltip.Arrow />
        Tooltip content here
      </Tooltip.Content>
    </Tooltip.Portal>
  </Tooltip.Root>
</Tooltip.Provider>
```

### Provider Component
`Tooltip.Provider` is required as an ancestor. It provides shared state for all tooltips within it. Set `delayDuration` (default 700ms) and `disableHoverableContent` on the provider to apply to all child tooltips. Only one tooltip per provider can be open at once. Recommended to wrap root layout:

```svelte
<Tooltip.Provider>
  {@render children()}
</Tooltip.Provider>
```

### Managing Open State

**Two-way binding:**
```svelte
<script>
  let isOpen = $state(false);
</script>
<button onclick={() => (isOpen = true)}>Open</button>
<Tooltip.Root bind:open={isOpen}>...</Tooltip.Root>
```

**Fully controlled with function binding:**
```svelte
<script>
  let myOpen = $state(false);
</script>
<Tooltip.Root bind:open={() => myOpen, (v) => (myOpen = v)}>...</Tooltip.Root>
```

### Mobile Tooltips
Tooltips are **not supported on mobile** - there is no hover state. If using tooltip on a button without action, consider using Popover instead. Tooltip content should be non-essential; assume it may never be read.

### Reusable Component Example
```svelte
<!-- MyTooltip.svelte -->
<script lang="ts">
  import { Tooltip } from "bits-ui";
  type Props = Tooltip.RootProps & {
    trigger: Snippet;
    triggerProps?: Tooltip.TriggerProps;
  };
  let { open = $bindable(false), children, trigger, triggerProps = {}, ...restProps } = $props();
</script>
<Tooltip.Root bind:open {...restProps}>
  <Tooltip.Trigger {...triggerProps}>{@render trigger()}</Tooltip.Trigger>
  <Tooltip.Portal>
    <Tooltip.Content>
      <Tooltip.Arrow />
      {@render children?.()}
    </Tooltip.Content>
  </Tooltip.Portal>
</Tooltip.Root>
```

Usage:
```svelte
<MyTooltip triggerProps={{ onclick: () => alert("action") }}>
  {#snippet trigger()}
    <BoldIcon />
  {/snippet}
  Change font to bold
</MyTooltip>
```

### Configuration Options

**Delay Duration:** Control hover delay before tooltip appears (default 700ms):
```svelte
<Tooltip.Root delayDuration={200}>...</Tooltip.Root>
```

**Close on Trigger Click:** By default closes when trigger clicked. Disable with:
```svelte
<Tooltip.Root disableCloseOnTriggerClick>...</Tooltip.Root>
```

**Hoverable Content:** By default tooltip stays open when hovering content. Disable with:
```svelte
<Tooltip.Root disableHoverableContent>...</Tooltip.Root>
```

**Non-Keyboard Focus:** Prevent opening on non-keyboard focus:
```svelte
<Tooltip.Root ignoreNonKeyboardFocus>...</Tooltip.Root>
```

### Svelte Transitions
Use `forceMount` with child snippet for Svelte transitions:
```svelte
<Tooltip.Content forceMount>
  {#snippet child({ wrapperProps, props, open })}
    {#if open}
      <div {...wrapperProps}>
        <div {...props} transition:fly={{ duration: 300 }}>
          Content
        </div>
      </div>
    {/if}
  {/snippet}
</Tooltip.Content>
```

### Floating UI Opt-out
Use `Tooltip.ContentStatic` instead of `Tooltip.Content` to opt-out of Floating UI positioning. You handle positioning entirely. `Tooltip.Arrow` won't work with `ContentStatic`.

```svelte
<Tooltip.Root>
  <Tooltip.Trigger>Hello</Tooltip.Trigger>
  <Tooltip.ContentStatic>Content</Tooltip.ContentStatic>
</Tooltip.Root>
```

### Custom Anchor
Anchor content to different element instead of trigger:
```svelte
<script>
  let customAnchor = $state<HTMLElement>(null!);
</script>
<div bind:this={customAnchor}>Custom Anchor</div>
<Tooltip.Root>
  <Tooltip.Trigger />
  <Tooltip.Content customAnchor={customAnchor}>...</Tooltip.Content>
</Tooltip.Root>
```

### API Reference

**Tooltip.Provider Props:**
- `delayDuration` (number, default 700): Hover delay in ms
- `disableHoverableContent` (boolean, default false): Disable hoverable content
- `disabled` (boolean, default false): Disable tooltip
- `disableCloseOnTriggerClick` (boolean, default false): Don't close on trigger click
- `skipDelayDuration` (number, default 300): Delay after first hover
- `ignoreNonKeyboardFocus` (boolean, default false): Ignore non-keyboard focus

**Tooltip.Root Props:**
- `open` (boolean, $bindable, default false): Open state
- `onOpenChange` (function): Called when open state changes
- `onOpenChangeComplete` (function): Called after animations complete
- `disabled`, `delayDuration`, `disableHoverableContent`, `disableCloseOnTriggerClick`, `ignoreNonKeyboardFocus`: Same as Provider

**Tooltip.Trigger Props:**
- `disabled` (boolean, default false): Disable trigger
- `ref` (HTMLButtonElement, $bindable): DOM reference
- Data attributes: `data-state` ('delayed-open' | 'instant-open' | 'closed'), `data-tooltip-trigger`

**Tooltip.Content Props:**
- `side` (enum: 'top' | 'bottom' | 'left' | 'right', default 'bottom'): Preferred side
- `sideOffset` (number, default 0): Distance from anchor in px
- `align` (enum: 'start' | 'center' | 'end', default 'start'): Preferred alignment
- `alignOffset` (number, default 0): Alignment offset in px
- `arrowPadding` (number, default 0): Virtual padding around viewport
- `avoidCollisions` (boolean, default true): Prevent collisions
- `collisionBoundary` (Element | null): Boundary to check collisions against
- `collisionPadding` (number | Partial<Record<Side, number>>, default 0): Virtual padding for collisions
- `sticky` ('partial' | 'always', default 'partial'): Sticky behavior on align axis
- `hideWhenDetached` (boolean, default true): Hide when detached from DOM
- `updatePositionStrategy` ('optimized' | 'always', default 'optimized'): Position update strategy
- `strategy` ('fixed' | 'absolute', default 'fixed'): Positioning strategy
- `preventScroll` (boolean, default true): Prevent body scroll when open
- `customAnchor` (string | HTMLElement | Measurable | null, default null): Custom anchor element
- `onInteractOutside` (function): Callback for outside pointer interactions
- `onFocusOutside` (function): Callback for focus leaving
- `interactOutsideBehavior` ('close' | 'ignore' | 'defer-otherwise-close' | 'defer-otherwise-ignore', default 'close'): Outside interaction behavior
- `onEscapeKeydown` (function): Callback for escape key
- `escapeKeydownBehavior` ('close' | 'ignore' | 'defer-otherwise-close' | 'defer-otherwise-ignore', default 'close'): Escape key behavior
- `forceMount` (boolean, default false): Force mount for transitions
- `dir` ('ltr' | 'rtl', default 'ltr'): Reading direction
- `ref` (HTMLDivElement, $bindable): DOM reference
- Data attributes: `data-state`, `data-tooltip-content`
- CSS variables: `--bits-tooltip-content-transform-origin`, `--bits-tooltip-content-available-width`, `--bits-tooltip-content-available-height`, `--bits-tooltip-anchor-width`, `--bits-tooltip-anchor-height`

**Tooltip.ContentStatic Props:**
- Same as Tooltip.Content except no Floating UI positioning props (side, sideOffset, align, alignOffset, arrowPadding, avoidCollisions, collisionBoundary, collisionPadding, sticky, hideWhenDetached, updatePositionStrategy, strategy, preventScroll, customAnchor)
- `onInteractOutside`, `onFocusOutside`, `interactOutsideBehavior`, `onEscapeKeydown`, `escapeKeydownBehavior`, `forceMount`, `dir`, `ref`

**Tooltip.Arrow Props:**
- `width` (number, default 8): Arrow width in px
- `height` (number, default 8): Arrow height in px
- `ref` (HTMLDivElement, $bindable): DOM reference
- Data attributes: `data-arrow`, `data-tooltip-arrow`, `data-side` ('top' | 'right' | 'bottom' | 'left')

**Tooltip.Portal Props:**
- `to` (Element | string, default document.body): Where to render content
- `disabled` (boolean, default false): Disable portal rendering

