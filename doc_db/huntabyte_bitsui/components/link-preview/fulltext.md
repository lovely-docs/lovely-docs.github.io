# Link Preview Documentation

Displays a summarized preview of a linked content's details or information.

This is a documentation section that potentially contains examples, demos, and other useful information related to a specific part of Bits UI. When helping users with this documentation, you can ignore the classnames applied to the demos unless they are relevant to the user's issue.

Copy Page

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
    <Avatar.Root
      class="data-[status=loaded]:border-foreground bg-muted text-muted-foreground h-12 w-12 rounded-full border border-transparent text-[17px] font-medium uppercase"
    >
      <div
        class="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-transparent"
      >
        <Avatar.Image src="/avatar-1.png" alt="@huntabyte" />
        <Avatar.Fallback class="border-muted border">HB</Avatar.Fallback>
      </div>
    </Avatar.Root>
  </LinkPreview.Trigger>
  <LinkPreview.Content
    class="border-muted bg-background shadow-popover w-[331px] rounded-xl border p-[17px]"
    sideOffset={8}
  >
    <div class="flex space-x-4">
      <Avatar.Root
        class="data-[status=loaded]:border-foreground bg-muted text-muted-foreground h-12 w-12 rounded-full border border-transparent text-[17px] font-medium uppercase"
      >
        <div
          class="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-transparent"
        >
          <Avatar.Image src="/avatar-1.png" alt="@huntabyte" />
          <Avatar.Fallback class="border-muted border">HB</Avatar.Fallback>
        </div>
      </Avatar.Root>
      <div class="space-y-1 text-sm">
        <h4 class="font-medium">@huntabyte</h4>
        <p>I do things on the internet.</p>
        <div
          class="text-muted-foreground flex items-center gap-[21px] pt-2 text-xs"
        >
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

## Overview

A component that lets users preview a link before they decide to follow it. This is useful for providing non-essential context or additional information about a link without having to navigate away from the current page.

##### A note about mobile devices!

This component is only intended to be used with a mouse or other pointing device. It doesn't respond to touch events, and the preview content cannot be accessed via the keyboard. On touch devices, the link will be followed immediately. As it is not accessible to all users, the preview should not contain vital information.

## Structure

```svelte
<script lang="ts">
  import { LinkPreview } from "bits-ui";
</script>
<LinkPreview.Root>
  <LinkPreview.Trigger />
  <LinkPreview.Content />
</LinkPreview.Root>
```

## Managing Open State

This section covers how to manage the `open` state of the component.

### Two-Way Binding

Use `bind:open` for simple, automatic state synchronization:

```svelte
<script lang="ts">
  import { LinkPreview } from "bits-ui";
  let isOpen = $state(false);
</script>
<button onclick={() => (isOpen = true)}>Open Link Preview</button>
<LinkPreview.Root bind:open={isOpen}>
  <!-- ... -->
</LinkPreview.Root>
```

### Fully Controlled

Use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) for complete control over the state's reads and writes.

```svelte
<script lang="ts">
  import { LinkPreview } from "bits-ui";
  let myOpen = $state(false);
  function getOpen() {
    return myOpen;
  }
  function setOpen(newOpen: boolean) {
    myOpen = newOpen;
  }
</script>
<LinkPreview.Root bind:open={getOpen, setOpen}>
  <!-- ... -->
</LinkPreview.Root>
```

## Opt-out of Floating UI

When you use the `LinkPreview.Content` component, Bits UI uses [Floating UI](https://floating-ui.com/) to position the content relative to the trigger, similar to other popover-like components.

You can opt-out of this behavior by instead using the `LinkPreview.ContentStatic` component. This component does not use Floating UI and leaves positioning the content entirely up to you.

```svelte
<LinkPreview.Root>
  <LinkPreview.Trigger />
  <LinkPreview.ContentStatic>
    <!-- ... -->
  </LinkPreview.ContentStatic>
</LinkPreview.Root>
```

##### Heads up!

The `LinkPreview.Arrow` component is designed to be used with Floating UI and `LinkPreview.Content`, so you may experience unexpected behavior if you attempt to use it with `LinkPreview.ContentStatic`.

## Custom Anchor

By default, the `LinkPreview.Content` is anchored to the `LinkPreview.Trigger` component, which determines where the content is positioned.

If you wish to instead anchor the content to a different element, you can pass either a selector `string` or an `HTMLElement` to the `customAnchor` prop of the `LinkPreview.Content` component.

```svelte
<script lang="ts">
  import { LinkPreview } from "bits-ui";
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

## Svelte Transitions

You can use the `forceMount` prop along with the `child` snippet to forcefully mount the `LinkPreview.Content` component to use Svelte Transitions or another animation library that requires more control.

```svelte
<script lang="ts">
  import { LinkPreview } from "bits-ui";
  import { fly } from "svelte/transition";
</script>
<LinkPreview.Content forceMount>
  {#snippet child({ wrapperProps, props, open })}
    {#if open}
      <div {...wrapperProps}>
        <div {...props} transition:fly>
          <!-- ... -->
        </div>
      </div>
    {/if}
  {/snippet}
</LinkPreview.Content>
```

Of course, this isn't the prettiest syntax, so it's recommended to create your own reusable content component that handles this logic if you intend to use this approach. For more information on using transitions with Bits UI components, see the [Transitions](/docs/transitions) documentation.

Expand Code

```svelte
<script lang="ts">
  import { Avatar, LinkPreview } from "bits-ui";
  import CalendarBlank from "phosphor-svelte/lib/CalendarBlank";
  import MapPin from "phosphor-svelte/lib/MapPin";
  import { fly } from "svelte/transition";
  let loadingStatusTrigger: Avatar.RootProps["loadingStatus"] =
    $state("loading");
  let loadingStatusContent: Avatar.RootProps["loadingStatus"] =
    $state("loading");
</script>
<LinkPreview.Root>
  <LinkPreview.Trigger
    href="https://github.com/sveltejs"
    target="_blank"
    rel="noreferrer noopener"
    class="rounded-xs underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-black"
  >
    <Avatar.Root
      bind:loadingStatus={loadingStatusTrigger}
      class="h-12 w-12 rounded-full border {loadingStatusTrigger === 'loaded'
        ? 'border-foreground'
        : 'border-transparent'} bg-muted text-muted-foreground text-[17px] font-medium uppercase"
    >
      <div
        class="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-transparent"
      >
        <Avatar.Image src="/avatar-1.png" alt="@huntabyte" />
        <Avatar.Fallback class="border-muted border">HB</Avatar.Fallback>
      </div>
    </Avatar.Root>
  </LinkPreview.Trigger>
  <LinkPreview.Content
    class="border-muted bg-background shadow-popover w-[331px] rounded-xl border p-[17px]"
    sideOffset={8}
    forceMount
  >
    {#snippet child({ open, props, wrapperProps })}
      {#if open}
        <div {...wrapperProps}>
          <div {...props} transition:fly={{ duration: 300 }}>
            <div class="flex space-x-4">
              <Avatar.Root
                bind:loadingStatus={loadingStatusContent}
                class="h-12 w-12 rounded-full border {loadingStatusContent ===
                'loaded'
                  ? 'border-foreground'
                  : 'border-transparent'} bg-muted text-muted-foreground text-[17px] font-medium uppercase"
              >
                <div
                  class="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-transparent"
                >
                  <Avatar.Image src="/avatar-1.png" alt="@huntabyte" />
                  <Avatar.Fallback class="border-muted border"
                    >HB</Avatar.Fallback
                  >
                </div>
              </Avatar.Root>
              <div class="space-y-1 text-sm">
                <h4 class="font-medium">@huntabyte</h4>
                <p>I do things on the internet.</p>
                <div
                  class="text-muted-foreground flex items-center gap-[21px] pt-2 text-xs"
                >
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
          </div>
        </div>
      {/if}
    {/snippet}
  </LinkPreview.Content>
</LinkPreview.Root>
```

## API Reference

### LinkPreview\.Root

The root component used to manage the state of the state of the link preview.

| Property                 | Type                                 | Description                                                                                                        | Details |
| ------------------------ | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------ | ------- |
| `open` $bindable         | `boolean`                            | The open state of the link preview component.`Default: false`                                                      |         |
| `onOpenChange`           | `function` - (open: boolean) => void | A callback function called when the open state changes.`Default:  —— undefined`                                    |         |
| `onOpenChangeComplete`   | `function` - (open: boolean) => void | A callback function called after the open state changes and all animations have completed.`Default:  —— undefined` |         |
| `openDelay`              | `number`                             | The amount of time in milliseconds to delay opening the preview when hovering over the trigger.`Default: 700`      |         |
| `closeDelay`             | `number`                             | The amount of time in milliseconds to delay closing the preview when the mouse leaves the trigger.`Default: 300`   |         |
| `disabled`               | `boolean`                            | Whether or not the link preview is disabled.`Default: false`                                                       |         |
| `ignoreNonKeyboardFocus` | `boolean`                            | Whether the link preview should ignore non-keyboard focus.`Default: false`                                         |         |
| `children`               | `Snippet`                            | The children content to render.`Default:  —— undefined`                                                            |         |

### LinkPreview\.Trigger

A component which triggers the opening and closing of the link preview on hover or focus.

| Property        | Type                                                                  | Description                                                                                                                                   | Details |
| --------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `ref` $bindable | `HTMLAnchorElement`                                                   | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`      | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`         | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute              | Value                       | Description                                   | Details |
| --------------------------- | --------------------------- | --------------------------------------------- | ------- |
| `data-state`                | `enum` - 'open' \| 'closed' | Whether the accordion item is open or closed. |         |
| `data-link-preview-trigger` | `''`                        | Present on the trigger element.               |         |

### LinkPreview\.Content

The contents of the link preview which are displayed when the preview is open.

| Property                  | Type                                                                                | Description                                                                                                                                                                                                                                                                                                                                                                                                                          | Details |
| ------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| `side`                    | `enum` - 'top' \| 'bottom' \| 'left' \| 'right'                                     | The preferred side of the anchor to render the floating element against when open. Will be reversed when collisions occur.`Default: 'bottom'`                                                                                                                                                                                                                                                                                        |         |
| `sideOffset`              | `number`                                                                            | The distance in pixels from the anchor to the floating element.`Default: 0`                                                                                                                                                                                                                                                                                                                                                          |         |
| `align`                   | `enum` - 'start' \| 'center' \| 'end'                                               | The preferred alignment of the anchor to render the floating element against when open. This may change when collisions occur.`Default: 'start'`                                                                                                                                                                                                                                                                                     |         |
| `alignOffset`             | `number`                                                                            | The distance in pixels from the anchor to the floating element.`Default: 0`                                                                                                                                                                                                                                                                                                                                                          |         |
| `arrowPadding`            | `number`                                                                            | The amount in pixels of virtual padding around the viewport edges to check for overflow which will cause a collision.`Default: 0`                                                                                                                                                                                                                                                                                                    |         |
| `avoidCollisions`         | `boolean`                                                                           | When `true`, overrides the `side` and `align` options to prevent collisions with the boundary edges.`Default: true`                                                                                                                                                                                                                                                                                                                  |         |
| `collisionBoundary`       | `union` - Element \| null                                                           | A boundary element or array of elements to check for collisions against.`Default:  —— undefined`                                                                                                                                                                                                                                                                                                                                     |         |
| `collisionPadding`        | `union` - number \| Partial\<Record\<Side, number>>                                 | The amount in pixels of virtual padding around the viewport edges to check for overflow which will cause a collision.`Default: 0`                                                                                                                                                                                                                                                                                                    |         |
| `sticky`                  | `enum` - 'partial' \| 'always'                                                      | The sticky behavior on the align axis. `'partial'` will keep the content in the boundary as long as the trigger is at least partially in the boundary whilst `'always'` will keep the content in the boundary regardless.`Default: 'partial'`                                                                                                                                                                                        |         |
| `hideWhenDetached`        | `boolean`                                                                           | When `true`, hides the content when it is detached from the DOM. This is useful for when you want to hide the content when the user scrolls away.`Default: true`                                                                                                                                                                                                                                                                     |         |
| `updatePositionStrategy`  | `enum` - 'optimized' \| 'always'                                                    | The strategy to use when updating the position of the content. When `'optimized'` the content will only be repositioned when the trigger is in the viewport. When `'always'` the content will be repositioned whenever the position changes.`Default: 'optimized'`                                                                                                                                                                   |         |
| `strategy`                | `enum` - 'fixed' \| 'absolute'                                                      | The positioning strategy to use for the floating element. When `'fixed'` the element will be positioned relative to the viewport. When `'absolute'` the element will be positioned relative to the nearest positioned ancestor.`Default: 'fixed'`                                                                                                                                                                                    |         |
| `preventScroll`           | `boolean`                                                                           | When `true`, prevents the body from scrolling when the content is open. This is useful when you want to use the content as a modal.`Default: true`                                                                                                                                                                                                                                                                                   |         |
| `customAnchor`            | `union` - string \| HTMLElement \| Measurable \| null                               | Use an element other than the trigger to anchor the content to. If provided, the content will be anchored to the provided element instead of the trigger.`Default: null`                                                                                                                                                                                                                                                             |         |
| `onInteractOutside`       | `function` - (event: PointerEvent) => void                                          | Callback fired when an outside interaction event occurs, which is a `pointerdown` event. You can call `event.preventDefault()` to prevent the default behavior of handling the outside interaction.`Default:  —— undefined`                                                                                                                                                                                                          |         |
| `onFocusOutside`          | `function` - (event: FocusEvent) => void                                            | Callback fired when focus leaves the dismissible layer. You can call `event.preventDefault()` to prevent the default behavior on focus leaving the layer.`Default:  —— undefined`                                                                                                                                                                                                                                                    |         |
| `interactOutsideBehavior` | `enum` - 'close' \| 'ignore' \| 'defer-otherwise-close' \| 'defer-otherwise-ignore' | The behavior to use when an interaction occurs outside of the floating content. `'close'` will close the content immediately. `'ignore'` will prevent the content from closing. `'defer-otherwise-close'` will defer to the parent element if it exists, otherwise it will close the content. `'defer-otherwise-ignore'` will defer to the parent element if it exists, otherwise it will ignore the interaction.`Default: 'close'`  |         |
| `onEscapeKeydown`         | `function` - (event: KeyboardEvent) => void                                         | Callback fired when an escape keydown event occurs in the floating content. You can call `event.preventDefault()` to prevent the default behavior of handling the escape keydown event.`Default:  —— undefined`                                                                                                                                                                                                                      |         |
| `escapeKeydownBehavior`   | `enum` - 'close' \| 'ignore' \| 'defer-otherwise-close' \| 'defer-otherwise-ignore' | The behavior to use when an escape keydown event occurs in the floating content. `'close'` will close the content immediately. `'ignore'` will prevent the content from closing. `'defer-otherwise-close'` will defer to the parent element if it exists, otherwise it will close the content. `'defer-otherwise-ignore'` will defer to the parent element if it exists, otherwise it will ignore the interaction.`Default: 'close'` |         |
| `onOpenAutoFocus`         | `function` - (event: Event) => void                                                 | Event handler called when auto-focusing the content as it is opened. Can be prevented.`Default:  —— undefined`                                                                                                                                                                                                                                                                                                                       |         |
| `onCloseAutoFocus`        | `function` - (event: Event) => void                                                 | Event handler called when auto-focusing the content as it is closed. Can be prevented.`Default:  —— undefined`                                                                                                                                                                                                                                                                                                                       |         |
| `trapFocus`               | `boolean`                                                                           | Whether or not to trap the focus within the content when open.`Default: true`                                                                                                                                                                                                                                                                                                                                                        |         |
| `dir`                     | `enum` - 'ltr' \| 'rtl'                                                             | The reading direction of the app.`Default: 'ltr'`                                                                                                                                                                                                                                                                                                                                                                                    |         |
| `forceMount`              | `boolean`                                                                           | Whether or not to forcefully mount the content. This is useful if you want to use Svelte transitions or another animation library for the content.`Default: false`                                                                                                                                                                                                                                                                   |         |
| `ref` $bindable           | `HTMLDivElement`                                                                    | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                                                                                                                                                                                                                                                                                                                    |         |
| `children`                | `Snippet`                                                                           | The children content to render.`Default:  —— undefined`                                                                                                                                                                                                                                                                                                                                                                              |         |
| `child`                   | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; };               | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined`                                                                                                                                                                                                                                                                                        |         |

| Data Attribute              | Value                       | Description                                   | Details |
| --------------------------- | --------------------------- | --------------------------------------------- | ------- |
| `data-state`                | `enum` - 'open' \| 'closed' | Whether the accordion item is open or closed. |         |
| `data-link-preview-content` | `''`                        | Present on the content element.               |         |

| CSS Variable                                   | Description                                  | Details |
| ---------------------------------------------- | -------------------------------------------- | ------- |
| `--bits-link-preview-content-transform-origin` | The transform origin of the content element. |         |
| `--bits-link-preview-content-available-width`  | The available width of the content element.  |         |
| `--bits-link-preview-content-available-height` | The available height of the content element. |         |
| `--bits-link-preview-anchor-width`             | The width of the anchor element.             |         |
| `--bits-link-preview-anchor-height`            | The height of the anchor element.            |         |

### LinkPreview\.ContentStatic

The contents of the link preview which are displayed when the preview is open. (Static/No Floating UI)

| Property                  | Type                                                                                | Description                                                                                                                                                                                                                                                                                                                                                                                                                          | Details |
| ------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| `onInteractOutside`       | `function` - (event: PointerEvent) => void                                          | Callback fired when an outside interaction event occurs, which is a `pointerdown` event. You can call `event.preventDefault()` to prevent the default behavior of handling the outside interaction.`Default:  —— undefined`                                                                                                                                                                                                          |         |
| `onFocusOutside`          | `function` - (event: FocusEvent) => void                                            | Callback fired when focus leaves the dismissible layer. You can call `event.preventDefault()` to prevent the default behavior on focus leaving the layer.`Default:  —— undefined`                                                                                                                                                                                                                                                    |         |
| `interactOutsideBehavior` | `enum` - 'close' \| 'ignore' \| 'defer-otherwise-close' \| 'defer-otherwise-ignore' | The behavior to use when an interaction occurs outside of the floating content. `'close'` will close the content immediately. `'ignore'` will prevent the content from closing. `'defer-otherwise-close'` will defer to the parent element if it exists, otherwise it will close the content. `'defer-otherwise-ignore'` will defer to the parent element if it exists, otherwise it will ignore the interaction.`Default: 'close'`  |         |
| `onEscapeKeydown`         | `function` - (event: KeyboardEvent) => void                                         | Callback fired when an escape keydown event occurs in the floating content. You can call `event.preventDefault()` to prevent the default behavior of handling the escape keydown event.`Default:  —— undefined`                                                                                                                                                                                                                      |         |
| `escapeKeydownBehavior`   | `enum` - 'close' \| 'ignore' \| 'defer-otherwise-close' \| 'defer-otherwise-ignore' | The behavior to use when an escape keydown event occurs in the floating content. `'close'` will close the content immediately. `'ignore'` will prevent the content from closing. `'defer-otherwise-close'` will defer to the parent element if it exists, otherwise it will close the content. `'defer-otherwise-ignore'` will defer to the parent element if it exists, otherwise it will ignore the interaction.`Default: 'close'` |         |
| `onOpenAutoFocus`         | `function` - (event: Event) => void                                                 | Event handler called when auto-focusing the content as it is opened. Can be prevented.`Default:  —— undefined`                                                                                                                                                                                                                                                                                                                       |         |
| `onCloseAutoFocus`        | `function` - (event: Event) => void                                                 | Event handler called when auto-focusing the content as it is closed. Can be prevented.`Default:  —— undefined`                                                                                                                                                                                                                                                                                                                       |         |
| `trapFocus`               | `boolean`                                                                           | Whether or not to trap the focus within the content when open.`Default: true`                                                                                                                                                                                                                                                                                                                                                        |         |
| `dir`                     | `enum` - 'ltr' \| 'rtl'                                                             | The reading direction of the app.`Default: 'ltr'`                                                                                                                                                                                                                                                                                                                                                                                    |         |
| `forceMount`              | `boolean`                                                                           | Whether or not to forcefully mount the content. This is useful if you want to use Svelte transitions or another animation library for the content.`Default: false`                                                                                                                                                                                                                                                                   |         |
| `ref` $bindable           | `HTMLDivElement`                                                                    | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                                                                                                                                                                                                                                                                                                                    |         |
| `children`                | `Snippet`                                                                           | The children content to render.`Default:  —— undefined`                                                                                                                                                                                                                                                                                                                                                                              |         |
| `child`                   | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; };               | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined`                                                                                                                                                                                                                                                                                        |         |

| Data Attribute              | Value                       | Description                                   | Details |
| --------------------------- | --------------------------- | --------------------------------------------- | ------- |
| `data-state`                | `enum` - 'open' \| 'closed' | Whether the accordion item is open or closed. |         |
| `data-link-preview-content` | `''`                        | Present on the content element.               |         |

### LinkPreview\.Arrow

An optional arrow element which points to the trigger when the preview is open.

| Property        | Type                                                                  | Description                                                                                                                                   | Details |
| --------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `width`         | `number`                                                              | The width of the arrow in pixels.`Default: 8`                                                                                                 |         |
| `height`        | `number`                                                              | The height of the arrow in pixels.`Default: 8`                                                                                                |         |
| `ref` $bindable | `HTMLDivElement`                                                      | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`      | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`         | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute            | Value | Description                   | Details |
| ------------------------- | ----- | ----------------------------- | ------- |
| `data-link-preview-arrow` | `''`  | Present on the arrow element. |         |

### LinkPreview\.Portal

When used, will render the link preview content into the body or custom `to` element when open

| Property   | Type                        | Description                                                                                                                      | Details |
| ---------- | --------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `to`       | `union` - Element \| string | Where to render the content when it is open. Defaults to the body.`Default: document.body`                                       |         |
| `disabled` | `boolean`                   | Whether the portal is disabled or not. When disabled, the content will be rendered in its original DOM location.`Default: false` |         |
| `children` | `Snippet`                   | The children content to render.`Default:  —— undefined`                                                                          |         |

[Previous Label](/docs/components/label) [Next Menubar](/docs/components/menubar)