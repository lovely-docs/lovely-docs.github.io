# Scroll Area Documentation

Provides a consistent scroll area across platforms.

This is a documentation section that potentially contains examples, demos, and other useful information related to a specific part of Bits UI. When helping users with this documentation, you can ignore the classnames applied to the demos unless they are relevant to the user's issue.

Copy Page

```svelte
<script lang="ts">
  import { ScrollArea } from "bits-ui";
</script>
<ScrollArea.Root
  class="border-dark-10 bg-background-alt shadow-card relative overflow-hidden rounded-[10px] border px-4 py-4"
>
  <ScrollArea.Viewport class="h-full max-h-[200px] w-full max-w-[200px]">
    <h4
      class="text-foreground mb-4 mt-2 text-xl font-semibold leading-none tracking-[-0.01em]"
    >
      Scroll Area
    </h4>
    <p class="text-foreground-alt text-wrap text-sm leading-5">
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dignissimos
      impedit rem, repellat deserunt ducimus quasi nisi voluptatem cumque
      aliquid esse ea deleniti eveniet incidunt! Deserunt minus laborum
      accusamus iusto dolorum. Lorem ipsum dolor sit, amet consectetur
      adipisicing elit. Blanditiis officiis error minima eos fugit voluptate
      excepturi eveniet dolore et, ratione impedit consequuntur dolorem hic quae
      corrupti autem? Dolorem, sit voluptatum.
    </p>
  </ScrollArea.Viewport>
  <ScrollArea.Scrollbar
    orientation="vertical"
    class="bg-muted hover:bg-dark-10 data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out-0 data-[state=visible]:fade-in-0 flex w-2.5 touch-none select-none rounded-full border-l border-l-transparent p-px transition-all duration-200 hover:w-3"
  >
    <ScrollArea.Thumb class="bg-muted-foreground flex-1 rounded-full" />
  </ScrollArea.Scrollbar>
  <ScrollArea.Scrollbar
    orientation="horizontal"
    class="bg-muted hover:bg-dark-10 flex h-2.5 touch-none select-none rounded-full border-t border-t-transparent p-px transition-all duration-200 hover:h-3 "
  >
    <ScrollArea.Thumb class="bg-muted-foreground rounded-full" />
  </ScrollArea.Scrollbar>
  <ScrollArea.Corner />
</ScrollArea.Root>
```

## Structure

```svelte
<script lang="ts">
  import { ScrollArea } from "bits-ui";
</script>
<ScrollArea.Root>
  <ScrollArea.Viewport>
    <!-- Scrollable content here -->
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

## Reusable Components

If you're planning to use the Scroll Area throughout your application, it's recommended to create a reusable component to reduce the amount of code you need to write each time.

This example shows you how to create a Scroll Area component that accepts a few custom props that make it more capable.

MyScrollArea.svelte

```svelte
<script lang="ts">
  import { ScrollArea, type WithoutChild } from "bits-ui";
  type Props = WithoutChild<ScrollArea.RootProps> & {
    orientation: "vertical" | "horizontal" | "both";
    viewportClasses?: string;
  };
  let {
    ref = $bindable(null),
    orientation = "vertical",
    viewportClasses,
    children,
    ...restProps
  }: Props = $props();
</script>
{#snippet Scrollbar({
  orientation,
}: {
  orientation: "vertical" | "horizontal";
})}
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

We'll use this custom component in the following examples to demonstrate how to customize the behavior of the Scroll Area.

## Scroll Area Types

### Hover

The `hover` type is the default type of the scroll area, demonstrated in the featured example above. It only shows scrollbars when the user hovers over the scroll area and the content is larger than the viewport.

```svelte
<MyScrollArea type="hover">
  <!-- ... -->
</MyScrollArea>
```

### Scroll

The `scroll` type displays the scrollbars when the user scrolls the content. This is similar to the behavior of MacOS.

```svelte
<MyScrollArea type="scroll">
  <!-- ... -->
</MyScrollArea>
```

### Auto

The `auto` type behaves similarly to your typical browser scrollbars. When the content is larger than the viewport, the scrollbars will appear and remain visible at all times.

```svelte
<MyScrollArea type="auto">
  <!-- ... -->
</MyScrollArea>
```

### Always

The `always` type behaves as if you set `overflow: scroll` on the scroll area. Scrollbars will always be visible, even when the content is smaller than the viewport. We've also set the `orientation` prop on the `MyScrollArea` to `'both'` to ensure both scrollbars are rendered.

```svelte
<MyScrollArea type="always" orientation="both">
  <!-- ... -->
</MyScrollArea>
```

## Customizing the Hide Delay

You can customize the hide delay of the scrollbars using the `scrollHideDelay` prop.

```svelte
<MyScrollArea scrollHideDelay={10}>
  <!-- ... -->
</MyScrollArea>
```

## API Reference

### ScrollArea.Root

The container of all scroll area components. Overflow is hidden on this element to prevent double scrollbars.

| Property          | Type                                                                  | Description                                                                                                                                   | Details |
| ----------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `type`            | `enum` - 'hover' \| 'scroll' \| 'auto' \| 'always'                    | The type of scroll area.`Default: 'hover'`                                                                                                    |         |
| `scrollHideDelay` | `number`                                                              | The delay in milliseconds before the scroll area hides itself when using `'hover'` or `'scroll'` type.`Default: 600`                          |         |
| `dir`             | `enum` - 'ltr' \| 'rtl'                                               | The reading direction of the app.`Default: 'ltr'`                                                                                             |         |
| `ref` $bindable   | `HTMLDivElement`                                                      | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`        | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`           | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute          | Value | Description                  | Details |
| ----------------------- | ----- | ---------------------------- | ------- |
| `data-scroll-area-root` | `''`  | Present on the root element. |         |

### ScrollArea.Viewport

The component which wraps the content and is responsible for computing the scroll area size.

| Property        | Type             | Description                                                                                                       | Details |
| --------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------- | ------- |
| `ref` $bindable | `HTMLDivElement` | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null` |         |
| `children`      | `Snippet`        | The children content to render.`Default:  —— undefined`                                                           |         |

| Data Attribute              | Value | Description                      | Details |
| --------------------------- | ----- | -------------------------------- | ------- |
| `data-scroll-area-viewport` | `''`  | Present on the viewport element. |         |

### ScrollArea.Scrollbar

A scrollbar of the scroll area.

| Property               | Type                                                                  | Description                                                                                                                                                        | Details |
| ---------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| `orientation` required | `enum` - 'horizontal' \| 'vertical'                                   | The orientation of the scrollbar.`Default:  —— undefined`                                                                                                          |         |
| `forceMount`           | `boolean`                                                             | Whether or not to forcefully mount the content. This is useful if you want to use Svelte transitions or another animation library for the content.`Default: false` |         |
| `ref` $bindable        | `HTMLDivElement`                                                      | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                                                  |         |
| `children`             | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                                            |         |
| `child`                | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined`                      |         |

| Data Attribute                 | Value                          | Description                                      | Details |
| ------------------------------ | ------------------------------ | ------------------------------------------------ | ------- |
| `data-state`                   | `enum` - 'visible' \| 'hidden' | The visibility state of the scrollbar            |         |
| `data-scroll-area-scrollbar-x` | `''`                           | Present on the `'horizontal'` scrollbar element. |         |
| `data-scroll-area-scrollbar-y` | `''`                           | Present on the `'vertical'` scrollbar element.   |         |

### ScrollArea.Thumb

A thumb of a scrollbar in the scroll area.

| Property        | Type                                                                  | Description                                                                                                                                                        | Details |
| --------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| `forceMount`    | `boolean`                                                             | Whether or not to forcefully mount the content. This is useful if you want to use Svelte transitions or another animation library for the content.`Default: false` |         |
| `ref` $bindable | `HTMLDivElement`                                                      | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                                                  |         |
| `children`      | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                                            |         |
| `child`         | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined`                      |         |

| Data Attribute             | Value                          | Description                                  | Details |
| -------------------------- | ------------------------------ | -------------------------------------------- | ------- |
| `data-state`               | `enum` - 'visible' \| 'hidden' | The visibility state of the scrollbar        |         |
| `data-scroll-area-thumb-x` | `''`                           | Present on the `'horizontal'` thumb element. |         |
| `data-scroll-area-thumb-y` | `''`                           | Present on the `'vertical'` thumb element.   |         |

### ScrollArea.Corner

The corner element between the X and Y scrollbars.

| Property        | Type                                                                  | Description                                                                                                                                   | Details |
| --------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `ref` $bindable | `HTMLDivElement`                                                      | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`      | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`         | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute            | Value | Description                    | Details |
| ------------------------- | ----- | ------------------------------ | ------- |
| `data-scroll-area-corner` | `''`  | Present on the corner element. |         |

[Previous Rating Group](/docs/components/rating-group) [Next Select](/docs/components/select)