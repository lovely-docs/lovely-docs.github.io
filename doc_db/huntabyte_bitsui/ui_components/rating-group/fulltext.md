# Rating Group Documentation

Enables users to provide ratings using customizable items (like stars).

This is a documentation section that potentially contains examples, demos, and other useful information related to a specific part of Bits UI. When helping users with this documentation, you can ignore the classnames applied to the demos unless they are relevant to the user's issue.

Copy Page

```svelte
<script lang="ts">
  import { RatingGroup } from "bits-ui";
  import Star from "phosphor-svelte/lib/Star";
  let value = $state(3);
</script>
<RatingGroup.Root bind:value max={5} class="flex gap-1">
  {#snippet children({ items })}
    {#each items as item (item.index)}
      <RatingGroup.Item
        index={item.index}
        class="text-foreground hover:text-foreground data-[state=inactive]:text-muted-foreground group size-10 cursor-pointer transition-colors md:size-8"
      >
        <Star class="size-full" weight="fill" />
      </RatingGroup.Item>
    {/each}
  {/snippet}
</RatingGroup.Root>
```

## Structure

```svelte
<script lang="ts">
  import { RatingGroup } from "bits-ui";
</script>
<RatingGroup.Root max={5}>
  {#snippet children({ items })}
    {#each items as item (item.index)}
      <RatingGroup.Item index={item.index}>
        {#if item.state === "active"}
          ⭐
        {:else}
          ☆
        {/if}
      </RatingGroup.Item>
    {/each}
  {/snippet}
</RatingGroup.Root>
```

## Reusable Components

It's recommended to use the `RatingGroup` primitives to create your own custom rating components that can be used throughout your application.

In the example below, we're creating a custom `MyRatingGroup` component that renders a rating group with configurable maximum rating and styling.

MyRatingGroup.svelte

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

You can then use the `MyRatingGroup` component in your application like so:

+page.svelte

```svelte
<script lang="ts">
  import MyRatingGroup from "$lib/components/MyRatingGroup.svelte";
  let productRating = $state(4);
</script>
<MyRatingGroup bind:value={productRating} max={5} allowHalf />
```

## Managing Value State

This section covers how to manage the `value` state of the component.

### Two-Way Binding

Use `bind:value` for simple, automatic state synchronization:

```svelte
<script lang="ts">
  import { RatingGroup } from "bits-ui";
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

### Fully Controlled

Use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) for complete control over the state's reads and writes.

```svelte
<script lang="ts">
  import { RatingGroup } from "bits-ui";
  let myRating = $state(0);
  function getValue() {
    return myRating;
  }
  function setValue(newValue: number) {
    // Add custom logic here, like validation or analytics
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

## HTML Forms

If you set the `name` prop on the `RatingGroup.Root` component, a hidden input element will be rendered to submit the rating value to a form.

```svelte
<RatingGroup.Root name="productRating" max={5}>
  <!-- ... -->
</RatingGroup.Root>
```

### Required

To make the hidden input element `required` you can set the `required` prop on the `RatingGroup.Root` component.

```svelte
<RatingGroup.Root required max={5}>
  <!-- ... -->
</RatingGroup.Root>
```

## Half Ratings

The rating group supports half ratings when you set the `allowHalf` prop to `true`. This allows for more precise ratings like 3.5 stars.

```svelte
<RatingGroup.Root allowHalf>
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

Expand Code

```svelte
<script lang="ts">
  import { RatingGroup } from "bits-ui";
  import Star from "phosphor-svelte/lib/Star";
  import StarHalf from "phosphor-svelte/lib/StarHalf";
  let value = $state(3);
</script>
<RatingGroup.Root bind:value max={5} allowHalf={true} class="flex gap-1">
  {#snippet children({ items })}
    {#each items as item (item.index)}
      <RatingGroup.Item
        index={item.index}
        class="text-foreground data-[state=inactive]:text-muted-foreground size-10 cursor-pointer transition-colors data-[readonly]:cursor-default md:size-8"
      >
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

## Readonly Mode

You can make the rating group readonly by setting the `readonly` prop to `true`. This is useful for displaying existing ratings without allowing user interaction.

```svelte
<RatingGroup.Root readonly value={4.5}>
  <!-- ... -->
</RatingGroup.Root>
```

## Disabled State

You can disable the entire rating group by setting the `disabled` prop to `true`.

```svelte
<RatingGroup.Root disabled max={5}>
  <!-- ... -->
</RatingGroup.Root>
```

## Hover Preview

By default, the rating group shows a preview of the potential rating when hovering over items. You can disable this behavior by setting `hoverPreview` to `false`.

```svelte
<RatingGroup.Root hoverPreview={false} max={5}>
  {#snippet children({ items })}
    {#each items as item (item.index)}
      <RatingGroup.Item index={item.index}>
        {#if item.state === "active"}⭐{:else}☆{/if}
      </RatingGroup.Item>
    {/each}
  {/snippet}
</RatingGroup.Root>
```

When disabled, only the currently selected rating will be highlighted, and hovering over items won't show a preview of the potential selection.

Expand Code

```svelte
<script lang="ts">
  import { RatingGroup } from "bits-ui";
  import Star from "phosphor-svelte/lib/Star";
  let value = $state(2);
</script>
<div class="flex select-none flex-col gap-4">
  <div class="flex flex-col gap-2">
    <h3 class="text-sm font-medium">Hover preview disabled</h3>
    <p class="text-muted-foreground text-sm">
      Only shows selected rating on hover, no preview of potential selection.
    </p>
  </div>
  <RatingGroup.Root bind:value max={5} hoverPreview={false} class="flex gap-1">
    {#snippet children({ items })}
      {#each items as item (item.index)}
        <RatingGroup.Item
          index={item.index}
          class="text-muted-foreground data-[state=active]:text-foreground group size-8 cursor-pointer transition-colors md:size-6"
        >
          <Star
            class="size-full group-data-[state=active]:fill-current"
            weight="fill"
          />
        </RatingGroup.Item>
      {/each}
    {/snippet}
  </RatingGroup.Root>
  <p class="text-muted-foreground text-sm">
    Rating: {value} out of 5 stars
  </p>
</div>
```

## RTL Support

The rating group automatically adapts to right-to-left (RTL) text direction. Simply set the `dir="rtl"` attribute on a parent element:

```svelte
<div dir="rtl">
  <RatingGroup.Root max={5}>
    {#snippet children({ items })}
      {#each items as item (item.index)}
        <RatingGroup.Item index={item.index}>
          {#if item.state === "active"}⭐{:else}☆{/if}
        </RatingGroup.Item>
      {/each}
    {/snippet}
  </RatingGroup.Root>
</div>
```

In RTL mode, the arrow key navigation is automatically reversed to match the visual direction.

Expand Code

```svelte
<script lang="ts">
  import { RatingGroup } from "bits-ui";
  import Star from "phosphor-svelte/lib/Star";
  import StarHalf from "phosphor-svelte/lib/StarHalf";
  let value = $state(3);
</script>
<div class="flex flex-col gap-4" dir="rtl">
  <div class="flex flex-col gap-2">
    <h3 class="text-sm font-medium">تقييم بالنجوم (RTL)</h3>
    <p class="text-muted-foreground text-sm">
      Rating group with right-to-left text direction.
    </p>
  </div>
  <RatingGroup.Root bind:value max={5} class="flex gap-1" allowHalf>
    {#snippet children({ items })}
      {#each items as item (item.index)}
        <RatingGroup.Item
          index={item.index}
          class="text-muted-foreground data-[state=active]:text-foreground data-[state=partial]:text-foreground size-8 cursor-pointer transition-colors md:size-6"
        >
          {#if item.state === "partial"}
            <StarHalf
              class="size-full fill-current rtl:scale-x-[-1]"
              weight="fill"
            />
          {:else if item.state === "active"}
            <Star class="size-full fill-current" weight="fill" />
          {:else}
            <Star class="size-full" />
          {/if}
        </RatingGroup.Item>
      {/each}
    {/snippet}
  </RatingGroup.Root>
  <p class="text-muted-foreground text-sm">
    التقييم: {value} من 5 نجوم
  </p>
</div>
```

## Maximum Rating

The `max` prop determines the maximum rating value and the number of rating items rendered. (defaults to `5`)

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

## Minimum Rating

The `min` prop sets a minimum required rating value. When set, users cannot select a rating below this value, and the rating will not go below the minimum when cleared. (defaults to `0`)

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

This is useful for scenarios where you require at least a certain rating, such as feedback forms that must have a minimum 1-star rating.

## Accessibility

The `RatingGroup` component implements comprehensive accessibility features following WAI-ARIA best practices for rating interfaces.

### ARIA Implementation

The component uses the **slider pattern** rather than a radiogroup pattern, which provides better screen reader support for rating interfaces:

- **Root element**: `role="slider"` with complete ARIA slider attributes
- **Rating items**: `role="presentation"` to avoid redundant announcements
- **Value communication**: `aria-valuenow`, `aria-valuemin`, `aria-valuemax` for current state
- **Custom descriptions**: `aria-valuetext` for contextual rating descriptions
- **State indicators**: `aria-disabled`, `aria-required`, `aria-orientation`

When users navigate with arrow keys, screen readers announce the new rating value immediately, providing real-time feedback.

### Keyboard Navigation Strategy

The keyboard implementation follows platform conventions while adding rating-specific enhancements:

#### Direct Number Input

The most efficient way to set ratings - users can type the exact rating they want:

- **Integer ratings**: Type `3` to set rating to 3 stars
- **Half ratings**: Type `2.5` to set 2.5 stars (when `allowHalf` is enabled)
- **Clear rating**: Type `0` to remove rating (respects minimum constraints)
- **Input validation**: Invalid numbers are ignored, values are clamped to min/max range

#### Arrow Key Navigation

Navigation adapts to both rating precision and text direction:

- **Standard mode**: Arrow keys increment/decrement by 1
- **Half rating mode**: Arrow keys increment/decrement by 0.5 for finer control
- **RTL support**: Left/right arrows automatically reverse in right-to-left layouts
- **Bounds respect**: Navigation stops at min/max values

#### Quick Navigation

- **`Home`**: Jump to minimum rating (or 1 if no minimum set)
- **`End`**: Jump to maximum rating
- **`PageUp`/`PageDown`**: Increment/decrement by 1 (alternative to arrows)

### Focus Management

The component handles focus intelligently:

- **Mouse interactions**: Clicking a rating item automatically focuses the root slider
- **Keyboard focus**: Single tab stop - the entire rating group acts as one focusable unit
- **Visual feedback**: Focus styling applied to the root container
- **Disabled state**: Component becomes non-focusable when disabled

### Customizing Accessibility

You can enhance the accessibility experience with custom `aria-valuetext`:

```svelte
<RatingGroup.Root
	"aria-valuetext"={(value, max) => {
		if (value === 0) return "No rating selected";
		return `${value} out of ${max} stars. ${value >= 4 ? "Excellent" : value >= 3 ? "Good" : "Fair"} rating.`;
	}}
>
	<!-- ... -->
</RatingGroup.Root>
```

## API Reference

### RatingGroup.Root

The rating group component used to group rating items under a common name for form submission.

| Property          | Type                                                                                                                                                                                                                                                                               | Description                                                                                                                                                                 | Details |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `value` $bindable | `number`                                                                                                                                                                                                                                                                           | The value of the rating group. You can bind to this value to control the rating group's value from outside the component.`Default: 0`                                       |         |
| `onValueChange`   | `function` - (value: number) => void                                                                                                                                                                                                                                               | A callback that is fired when the rating group's value changes.`Default:  —— undefined`                                                                                     |         |
| `disabled`        | `boolean`                                                                                                                                                                                                                                                                          | Whether or not the radio group is disabled. This prevents the user from interacting with it.`Default: false`                                                                |         |
| `required`        | `boolean`                                                                                                                                                                                                                                                                          | Whether or not the radio group is required.`Default: false`                                                                                                                 |         |
| `name`            | `string`                                                                                                                                                                                                                                                                           | The name of the rating group used in form submission. If provided, a hidden input element will be rendered to submit the value of the rating group.`Default:  —— undefined` |         |
| `min`             | `number`                                                                                                                                                                                                                                                                           | The minimum value of the rating group.`Default: 0`                                                                                                                          |         |
| `max`             | `number`                                                                                                                                                                                                                                                                           | The maximum value of the rating group.`Default: 5`                                                                                                                          |         |
| `allowHalf`       | `boolean`                                                                                                                                                                                                                                                                          | Whether or not the rating group allows half values.`Default: false`                                                                                                         |         |
| `readonly`        | `boolean`                                                                                                                                                                                                                                                                          | Whether or not the rating group is readonly.`Default: false`                                                                                                                |         |
| `orientation`     | `enum` - 'vertical' \| 'horizontal'                                                                                                                                                                                                                                                | The orientation of the rating group. This will determine how keyboard navigation will work within the component.`Default: 'horizontal'`                                     |         |
| `hoverPreview`    | `boolean`                                                                                                                                                                                                                                                                          | Whether or not the rating group shows a preview of the rating when hovering over the items.`Default: false`                                                                 |         |
| `aria-valuetext`  | `union` - string \| (value: number, max: number) => string                                                                                                                                                                                                                         | The text that describes the rating group's value.`` Default: `${value} out of ${max}` ``                                                                                    |         |
| `ref` $bindable   | `HTMLDivElement`                                                                                                                                                                                                                                                                   | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                                                           |         |
| `children`        | `Snippet` - type RatingGroupItemState = "active" \| "partial" \| "inactive"; type RatingGroupItemData = { index: number; state: RatingGroupItemState; }; type ChildrenSnippetProps = { items: RatingGroupItemData\[]; value: number; max: number; };                               | The children content to render.`Default:  —— undefined`                                                                                                                     |         |
| `child`           | `Snippet` - type RatingGroupItemState = "active" \| "partial" \| "inactive"; type RatingGroupItemData = { index: number; state: RatingGroupItemState; }; type ChildSnippetProps = { items: RatingGroupItemData\[]; value: number; max: number; props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined`                               |         |

| Data Attribute           | Value                               | Description                                | Details |
| ------------------------ | ----------------------------------- | ------------------------------------------ | ------- |
| `data-orientation`       | `enum` - 'vertical' \| 'horizontal' | The orientation of the rating group.       |         |
| `data-disabled`          | `''`                                | Present when the rating group is disabled. |         |
| `data-readonly`          | `''`                                | Present when the rating group is readonly. |         |
| `data-rating-group-root` | `''`                                | Present on the root element.               |         |

### RatingGroup.Item

An rating item, which must be a child of the `RatingGroup.Root` component.

| Property         | Type                                                                                                                                                                     | Description                                                                                                                                   | Details |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `index` required | `number`                                                                                                                                                                 | The index of the rating item.`Default:  —— undefined`                                                                                         |         |
| `disabled`       | `boolean`                                                                                                                                                                | Whether the rating item is disabled.`Default: false`                                                                                          |         |
| `ref` $bindable  | `HTMLDivElement`                                                                                                                                                         | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`       | `Snippet` - type RatingGroupItemState = "active" \| "partial" \| "inactive"; type ChildrenSnippetProps = { state: RatingGroupItemState; };                               | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`          | `Snippet` - type RatingGroupItemState = "active" \| "partial" \| "inactive"; type ChildSnippetProps = { state: RatingGroupItemState; props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute           | Value                               | Description                                 | Details |
| ------------------------ | ----------------------------------- | ------------------------------------------- | ------- |
| `data-disabled`          | `''`                                | Present when the rating group is disabled.  |         |
| `data-readonly`          | `''`                                | Present when the rating group is readonly.  |         |
| `data-value`             | `''`                                | The value of the rating item.               |         |
| `data-state`             | `enum` - 'checked' \| 'unchecked'   | The rating item's checked state.            |         |
| `data-orientation`       | `enum` - 'vertical' \| 'horizontal' | The orientation of the parent rating group. |         |
| `data-rating-group-item` | `''`                                | Present on the rating item element.         |         |

[Previous Range Calendar](/docs/components/range-calendar) [Next Scroll Area](/docs/components/scroll-area)