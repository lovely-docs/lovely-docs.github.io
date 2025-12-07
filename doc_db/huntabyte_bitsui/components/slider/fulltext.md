# Slider Documentation

Enables users to select a value from a continuous range.

This is a documentation section that potentially contains examples, demos, and other useful information related to a specific part of Bits UI. When helping users with this documentation, you can ignore the classnames applied to the demos unless they are relevant to the user's issue.

Copy Page

```svelte
<script lang="ts">
  import { Slider } from "bits-ui";
  import cn from "clsx";
  let value = $state(50);
</script>
<div class="w-full md:max-w-[280px]">
  <Slider.Root
    type="single"
    bind:value
    class="relative flex w-full touch-none select-none items-center"
  >
    <span
      class="bg-dark-10 relative h-2 w-full grow cursor-pointer overflow-hidden rounded-full"
    >
      <Slider.Range class="bg-foreground absolute h-full" />
    </span>
    <Slider.Thumb
      index={0}
      class={cn(
        "border-border-input bg-background hover:border-dark-40 focus-visible:ring-foreground dark:bg-foreground dark:shadow-card data-active:border-dark-40 focus-visible:outline-hidden data-active:scale-[0.98] block size-[25px] cursor-pointer rounded-full border shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      )}
    />
  </Slider.Root>
</div>
```

## Structure

```svelte
<script lang="ts">
  import { Slider } from "bits-ui";
</script>
<Slider.Root>
  <Slider.Range />
  <Slider.Thumb />
  <Slider.Tick />
</Slider.Root>
```

## Reusable Components

Bits UI provides primitives that enable you to build your own custom slider component that can be reused throughout your application.

Here's an example of how you might create a reusable `MySlider` component.

MyMultiSlider.svelte

```svelte
<script lang="ts">
  import type { ComponentProps } from "svelte";
  import { Slider } from "bits-ui";
  type Props = WithoutChildren<ComponentProps<typeof Slider.Root>>;
  let {
    value = $bindable(),
    ref = $bindable(null),
    ...restProps
  }: Props = $props();
</script>
<!--
 Since we have to destructure the `value` to make it `$bindable`, we need to use `as any` here to avoid
 type errors from the discriminated union of `"single" | "multiple"`.
 (an unfortunate consequence of having to destructure bindable values)
  -->
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

You can then use the `MySlider` component in your application like so:

```svelte
<script lang="ts">
  import MySlider from "$lib/components/MySlider.svelte";
  let multiValue = $state([5, 10]);
  let singleValue = $state(50);
</script>
<MySlider bind:value={multiValue} type="multiple" />
<MySlider bind:value={singleValue} type="single" />
```

## Managing Value State

This section covers how to manage the `value` state of the component.

### Two-Way Binding

Use `bind:value` for simple, automatic state synchronization:

```svelte
<script lang="ts">
  import { Slider } from "bits-ui";
  let myValue = $state(0);
</script>
<button onclick={() => (myValue = 20)}> Set value to 20 </button>
<Slider.Root bind:value={myValue} type="single">
  <!-- ... -->
</Slider.Root>
```

### Fully Controlled

Use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) for complete control over the state's reads and writes.

```svelte
<script lang="ts">
  import { Slider } from "bits-ui";
  let myValue = $state(0);
  function getValue() {
    return myValue;
  }
  function setValue(newValue: number) {
    myValue = newValue;
  }
</script>
<Slider.Root type="single" bind:value={getValue, setValue}>
  <!-- ... -->
</Slider.Root>
```

## Value Commit

You can use the `onValueCommit` prop to be notified when the user finishes dragging the thumb and the value changes. This is different than the `onValueChange` callback because it waits until the user stops dragging before calling the callback, where the `onValueChange` callback is called as the user dragging.

```svelte
<Slider.Root
  onValueCommit={(v) => {
    console.log("user is done sliding!", v);
  }}
/>
```

## RTL Support

You can use the `dir` prop to change the reading direction of the slider, which defaults to `"ltr"`.

```svelte
<Slider.Root type="single" dir="rtl">
  <!-- ... -->
</Slider.Root>
```

## Auto Sort

By default, the slider will sort the values from smallest to largest, so if you drag a smaller thumb to a larger value, the value of that thumb will be updated to the larger value.

You can disable this behavior by setting the `autoSort` prop to `false`.

```svelte
<Slider.Root type="multiple" autoSort={false}>
  <!-- ... -->
</Slider.Root>
```

## HTML Forms

Since there is a near endless number of possible values that a user can select, the slider does not render a hidden input element by default.

You'll need to determine how you want to submit the value(s) of the slider with a form.

Here's an example of how you might do that:

```svelte
<script lang="ts">
  import MySlider from "$lib/components/MySlider.svelte";
  let expectedIncome = $state([50, 100]);
  let desiredIncome = $state(50);
</script>
<form method="POST">
  <MySlider type="multiple" bind:value={expectedIncome} />
  <input type="hidden" name="expectedIncomeStart" value={expectedIncome[0]} />
  <input type="hidden" name="expectedIncomeEnd" value={expectedIncome[1]} />
  <MySlider type="single" bind:value={desiredIncome} />
  <input type="hidden" name="expectedIncomeEnd" value={desiredIncome} />
  <button type="submit">Submit</button>
</form>
```

## Examples

### Multiple Thumbs and Ticks

If the `value` prop has more than one value, the slider will render multiple thumbs. You can also use the `tickItems` and `thumbItems` snippet props to render ticks and thumbs at specific intervals.

```svelte
<script lang="ts">
  import { Slider } from "bits-ui";
  // we have two numbers in the array, so the slider will render two thumbs
  let value = $state([5, 7]);
</script>
<Slider.Root type="multiple" min={0} max={10} step={1} bind:value>
  {#snippet children({ tickItems, thumbItems })}
    <Slider.Range />
    {#each thumbItems as { index } (index)}
      <Slider.Thumb {index} />
    {/each}
    {#each tickItems as { index } (index)}
      <Slider.Tick {index} />
    {/each}
  {/snippet}
</Slider.Root>
```

To determine the number of ticks that will be rendered, you can simply divide the `max` value by the `step` value.

Expand Code

```svelte
<script lang="ts">
  import { Slider } from "bits-ui";
  let value = $state([5, 7]);
</script>
<div class="w-full md:max-w-[280px]">
  <Slider.Root
    step={1}
    min={0}
    max={10}
    type="multiple"
    bind:value
    class="relative flex w-full touch-none select-none items-center"
  >
    {#snippet children({ tickItems, thumbs })}
      <span
        class="bg-dark-10 relative h-2 w-full grow cursor-pointer overflow-hidden rounded-full"
      >
        <Slider.Range class="bg-foreground absolute h-full" />
      </span>
      {#each thumbs as thumb (thumb)}
        <Slider.Thumb
          index={thumb}
          class="border-border-input bg-background hover:border-dark-40 focus-visible:ring-foreground dark:bg-foreground dark:shadow-card data-active:border-dark-40 z-5 focus-visible:outline-hidden data-active:scale-[0.98] block size-[25px] cursor-pointer rounded-full border shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        />
      {/each}
      {#each tickItems as { index } (index)}
        <Slider.Tick
          {index}
          class="dark:bg-background/20 bg-background z-1 h-2 w-[1px]"
        />
      {/each}
    {/snippet}
  </Slider.Root>
</div>
```

### Single Type

Set the `type` prop to `"single"` to allow only one slider handle.

```svelte
<Slider.Root type="single" />
```

Expand Code

```svelte
<script lang="ts">
  import { Slider } from "bits-ui";
  import cn from "clsx";
  let value = $state(50);
</script>
<div class="w-full md:max-w-[280px]">
  <Slider.Root
    type="single"
    bind:value
    class="relative flex w-full touch-none select-none items-center"
  >
    <span
      class="bg-dark-10 relative h-2 w-full grow cursor-pointer overflow-hidden rounded-full"
    >
      <Slider.Range class="bg-foreground absolute h-full" />
    </span>
    <Slider.Thumb
      index={0}
      class={cn(
        "border-border-input bg-background hover:border-dark-40 focus-visible:ring-foreground dark:bg-foreground dark:shadow-card data-active:border-dark-40 focus-visible:outline-hidden data-active:scale-[0.98] block size-[25px] cursor-pointer rounded-full border shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      )}
    />
  </Slider.Root>
</div>
```

### Multiple Type

Set the `type` prop to `"multiple"` to allow multiple slider handles.

```svelte
<Slider.Root type="multiple" />
```

Expand Code

```svelte
<script lang="ts">
  import { Slider } from "bits-ui";
  import cn from "clsx";
  let value = $state([25, 75]);
</script>
<div class="w-full md:max-w-[280px]">
  <Slider.Root
    type="multiple"
    bind:value
    class="relative flex w-full touch-none select-none items-center"
  >
    {#snippet children({ thumbItems })}
      <span
        class="bg-dark-10 relative h-2 w-full grow cursor-pointer overflow-hidden rounded-full"
      >
        <Slider.Range class="bg-foreground absolute h-full" />
      </span>
      {#each thumbItems as { index } (index)}
        <Slider.Thumb
          {index}
          class={cn(
            "border-border-input bg-background hover:border-dark-40 focus-visible:ring-foreground dark:bg-foreground dark:shadow-card data-active:border-dark-40 focus-visible:outline-hidden data-active:scale-[0.98] block size-[25px] cursor-pointer rounded-full border shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          )}
        />
      {/each}
    {/snippet}
  </Slider.Root>
</div>
```

### Vertical Orientation

You can use the `orientation` prop to change the orientation of the slider, which defaults to `"horizontal"`.

```svelte
<Slider.Root type="single" orientation="vertical">
  <!-- ... -->
</Slider.Root>
```

Expand Code

```svelte
<script lang="ts">
  import { Slider } from "bits-ui";
  let value = $state(50);
</script>
<div class="flex h-[320px] w-full justify-center">
  <Slider.Root
    type="single"
    step={1}
    bind:value
    orientation="vertical"
    class="relative flex h-full touch-none select-none flex-col items-center"
    trackPadding={3}
  >
    <span
      class="bg-dark-10 relative h-full w-2 cursor-pointer overflow-hidden rounded-full"
    >
      <Slider.Range class="bg-foreground absolute w-full" />
    </span>
    <Slider.Thumb
      index={0}
      class="border-border-input bg-background hover:border-dark-40 focus-visible:ring-foreground dark:bg-foreground dark:shadow-card data-active:border-dark-40 z-5 focus-visible:outline-hidden data-active:scale-[0.98] block size-[25px] cursor-pointer rounded-full border shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
    />
  </Slider.Root>
</div>
```

### Tick Labels

You can use the `tickItems` snippet prop in combination with the `Slider.TickLabel` to render labels at specific intervals.

```svelte
<Slider.Root type="single" step={[0, 4, 8, 16, 24]}>
  {#snippet children({ tickItems })}
    {#each tickItems as { value, index } (index)}
      <Slider.Tick {index} />
      <Slider.TickLabel {index} position="top">
        {value}
      </Slider.TickLabel>
    {/each}
  {/snippet}
</Slider.Root>
```

Expand Code

```svelte
<script lang="ts">
  import { Slider } from "bits-ui";
  let value = $state([5, 7]);
</script>
<div class="w-full md:max-w-[280px]">
  <Slider.Root
    step={1}
    min={0}
    max={10}
    type="multiple"
    bind:value
    class="relative flex w-full touch-none select-none items-center"
    trackPadding={2}
  >
    {#snippet children({ tickItems, thumbItems })}
      <span
        class="bg-dark-10 relative h-2 w-full grow cursor-pointer overflow-hidden rounded-full"
      >
        <Slider.Range class="bg-foreground absolute h-full" />
      </span>
      {#each thumbItems as { index } (index)}
        <Slider.Thumb
          {index}
          class="border-border-input bg-background hover:border-dark-40 focus-visible:ring-foreground dark:bg-foreground dark:shadow-card data-active:border-dark-40 z-5 focus-visible:outline-hidden data-active:scale-[0.98] block size-[25px] cursor-pointer rounded-full border shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        />
      {/each}
      {#each tickItems as { index, value } (index)}
        <Slider.Tick
          {index}
          class="dark:bg-background/20 bg-background z-1 h-2 w-[1px]"
        />
        <Slider.TickLabel
          {index}
          class="text-muted-foreground data-bounded:text-foreground mb-5 text-sm font-medium leading-none"
          position="top"
        >
          {value}
        </Slider.TickLabel>
      {/each}
    {/snippet}
  </Slider.Root>
</div>
```

### Discrete Steps

Instead of passing a single value to the `step` prop, you can pass an array of discrete values that the slider will snap to.

```svelte
<Slider.Root type="single" step={[0, 4, 8, 16, 24]}>
  <!-- ... -->
</Slider.Root>
```

Expand Code

```svelte
<script lang="ts">
  import { Slider } from "bits-ui";
  let fontSize = $state(16);
  const fontSizes = [0, 4, 8, 16, 24];
</script>
<div class="w-full md:max-w-[320px]">
  <Slider.Root
    type="single"
    step={fontSizes}
    bind:value={fontSize}
    class="relative flex w-full touch-none select-none items-center"
    trackPadding={3}
  >
    {#snippet children({ tickItems })}
      <span
        class="bg-dark-10 relative h-2 w-full grow cursor-pointer overflow-hidden rounded-full"
      >
        <Slider.Range class="bg-foreground absolute h-full" />
      </span>
      <Slider.Thumb
        index={0}
        class="border-border-input bg-background hover:border-dark-40 focus-visible:ring-foreground dark:bg-foreground dark:shadow-card data-active:border-dark-40 z-5 focus-visible:outline-hidden data-active:scale-[0.98] block size-[25px] cursor-pointer rounded-full border shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      />
      {#each tickItems as { index, value } (index)}
        <Slider.Tick
          {index}
          class="dark:bg-background bg-background z-1 h-2 w-[1px]"
        />
        <Slider.TickLabel
          {index}
          class="text-muted-foreground data-selected:text-foreground mb-5 text-sm font-medium leading-none"
        >
          {value}px
        </Slider.TickLabel>
      {/each}
    {/snippet}
  </Slider.Root>
</div>
<div class="flex h-[320px] w-full justify-center">
  <Slider.Root
    type="single"
    step={fontSizes}
    bind:value={fontSize}
    orientation="vertical"
    class="relative flex h-full touch-none select-none flex-col items-center"
    trackPadding={3}
  >
    {#snippet children({ tickItems })}
      <span
        class="bg-dark-10 relative h-full w-2 cursor-pointer overflow-hidden rounded-full"
      >
        <Slider.Range class="bg-foreground absolute w-full" />
      </span>
      <Slider.Thumb
        index={0}
        class="border-border-input bg-background hover:border-dark-40 focus-visible:ring-foreground dark:bg-foreground dark:shadow-card data-active:border-dark-40 z-5 focus-visible:outline-hidden data-active:scale-[0.98] block size-[25px] cursor-pointer rounded-full border shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      />
      {#each tickItems as { index, value } (index)}
        <Slider.Tick {index} class="dark:bg-background z-1 h-[1px] w-4" />
        <Slider.TickLabel
          {index}
          class="text-muted-foreground data-selected:text-foreground mr-5 text-sm font-medium leading-none"
        >
          {value}px
        </Slider.TickLabel>
      {/each}
    {/snippet}
  </Slider.Root>
</div>
```

### Thumb Labels

Use the `Slider.ThumbLabel` component to render a label that is positioned relative to the thumb.

You can manually specify the index like so:

```svelte
<Slider.Root type="multiple" autoSort={false} step={10} value={[10, 50]}>
  <Slider.Range />
  <Slider.Thumb index={0} />
  <Slider.ThumbLabel index={0} position="top">Min</Slider.ThumbLabel>
  <Slider.Thumb index={1} />
  <Slider.ThumbLabel index={1} position="top">Max</Slider.ThumbLabel>
</Slider.Root>
```

or use the `thumbItems` snippet prop to render a label for each thumb:

```svelte
<Slider.Root type="multiple" autoSort={false} step={10} value={[10, 50]}>
  <Slider.Range />
  {#snippet children({ thumbItems })}
    {#each thumbItems as { index, value } (index)}
      <Slider.Thumb {index} />
      <Slider.ThumbLabel {index} position="top">
        {index === 0 ? "Min" : "Max"}:{value}
      </Slider.ThumbLabel>
    {/each}
  {/snippet}
</Slider.Root>
```

Expand Code

```svelte
<script lang="ts">
  import { Slider } from "bits-ui";
  let value = $state([5, 7, 10]);
</script>
<div class="w-full md:max-w-[400px]">
  <Slider.Root
    step={1}
    min={4}
    max={11}
    type="multiple"
    bind:value
    class="relative flex w-full touch-none select-none items-center"
    trackPadding={2}
    autoSort={false}
  >
    {#snippet children({ tickItems })}
      <span
        class="bg-dark-10 relative h-2 w-full grow cursor-pointer overflow-hidden rounded-full"
      >
        <Slider.Range class="bg-foreground absolute h-full" />
      </span>
      <Slider.Thumb
        index={0}
        class="border-border-input bg-background hover:border-dark-40 focus-visible:ring-foreground dark:bg-foreground dark:shadow-card data-active:border-dark-40 z-5 focus-visible:outline-hidden data-active:scale-[0.98] block size-[25px] cursor-pointer rounded-full border shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      />
      <Slider.ThumbLabel
        index={0}
        class="bg-muted text-foreground mb-5 text-nowrap rounded-md px-2 py-1 text-sm"
      >
        Check in
      </Slider.ThumbLabel>
      <Slider.Thumb
        index={1}
        class="border-border-input bg-background hover:border-dark-40 focus-visible:ring-foreground dark:bg-foreground dark:shadow-card data-active:border-dark-40 z-5 focus-visible:outline-hidden data-active:scale-[0.98] block size-[25px] cursor-pointer rounded-full border shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      />
      <Slider.ThumbLabel
        index={1}
        class="bg-muted text-foreground mb-5 text-nowrap rounded-md px-2 py-1 text-sm"
      >
        Dinner
      </Slider.ThumbLabel>
      <Slider.Thumb
        index={2}
        class="border-border-input bg-background hover:border-dark-40 focus-visible:ring-foreground dark:bg-foreground dark:shadow-card data-active:border-dark-40 z-5 focus-visible:outline-hidden data-active:scale-[0.98] block size-[25px] cursor-pointer rounded-full border shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      />
      <Slider.ThumbLabel
        index={2}
        class="bg-muted text-foreground mb-5 text-nowrap rounded-md px-2 py-1 text-sm"
      >
        Sleep
      </Slider.ThumbLabel>
      {#each tickItems as { index, value } (index)}
        <Slider.Tick
          {index}
          class="dark:bg-background/20 bg-background z-1 h-2 w-[1px]"
        />
        <Slider.TickLabel
          {index}
          class="text-muted-foreground data-selected:text-foreground mt-5 text-xs font-medium leading-none"
          position="bottom"
        >
          {value}pm
        </Slider.TickLabel>
      {/each}
    {/snippet}
  </Slider.Root>
</div>
```

## API Reference

### Slider.Root

The root slider component which contains the remaining slider components.

| Property           | Type                                                                                                                                                                                                                                                                                                                                                                                     | Description                                                                                                                                                                                                                                                                                                                                                                                                     | Details |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `type` required    | `enum` - 'single' \| 'multiple'                                                                                                                                                                                                                                                                                                                                                          | The type of the slider. If set to `'multiple'`, the slider will allow multiple thumbs and the `value` will be an array of numbers.`Default:  —— undefined`                                                                                                                                                                                                                                                      |         |
| `value` $bindable  | `number`                                                                                                                                                                                                                                                                                                                                                                                 | The current value of the slider. If the `type` is set to `'multiple'`, this should be an array of numbers and will default to an empty array.`Default: 0`                                                                                                                                                                                                                                                       |         |
| `onValueChange`    | `function` - (value: number) => void \| (value: number\[]) => void                                                                                                                                                                                                                                                                                                                       | A callback function called when the value state of the slider changes.`Default:  —— undefined`                                                                                                                                                                                                                                                                                                                  |         |
| `onValueCommit`    | `function` - (value: number) => void \| (value: number\[]) => void                                                                                                                                                                                                                                                                                                                       | A callback function called when the user finishes dragging the thumb and the value changes. This is different than the `onValueChange` callback because it waits until the user stops dragging before calling the callback, where the `onValueChange` callback is called immediately after the user starts dragging.`Default:  —— undefined`                                                                    |         |
| `disabled`         | `boolean`                                                                                                                                                                                                                                                                                                                                                                                | Whether or not the switch is disabled.`Default: false`                                                                                                                                                                                                                                                                                                                                                          |         |
| `max`              | `number`                                                                                                                                                                                                                                                                                                                                                                                 | The maximum value of the slider.`Default: 100`                                                                                                                                                                                                                                                                                                                                                                  |         |
| `min`              | `number`                                                                                                                                                                                                                                                                                                                                                                                 | The minimum value of the slider.`Default: 0`                                                                                                                                                                                                                                                                                                                                                                    |         |
| `orientation`      | `enum` - 'horizontal' \| 'vertical'                                                                                                                                                                                                                                                                                                                                                      | The orientation of the slider.`Default: 'horizontal'`                                                                                                                                                                                                                                                                                                                                                           |         |
| `step` $bindable   | `union` - number\[] \| number                                                                                                                                                                                                                                                                                                                                                            | The step value of the slider. If a single number is provided, the slider will step by that number and use that number to generate the ticks (e.g. `step={1}` will generate ticks at `0, 1, 2, 3, ...`). If an array of numbers is provided, the slider will snap to those values (e.g. `step={[0, 4, 8, 16, 24]}`) and ticks will be generated at those values.`Default:  —— undefined`                         |         |
| `dir`              | `enum` - 'ltr' \| 'rtl'                                                                                                                                                                                                                                                                                                                                                                  | The reading direction of the app.`Default: 'ltr'`                                                                                                                                                                                                                                                                                                                                                               |         |
| `autoSort`         | `boolean`                                                                                                                                                                                                                                                                                                                                                                                | Whether to automatically sort the values in the array when moving thumbs past one another. This is only applicable to the `'multiple'` type.`Default: true`                                                                                                                                                                                                                                                     |         |
| `thumbPositioning` | `enum` - 'exact' \| 'contain'                                                                                                                                                                                                                                                                                                                                                            | The positioning of the slider thumb. `'contain'` will ensure that the thumb is always visible within the track, while `'exact'` will ensure that the thumb is always at the same position relative to the track. For an SSR-friendly alternative to `thumbPositioning='contain'`, use the `trackPadding` prop to set the padding between the thumbs/first ticks and the edges of the track.`Default: 'contain'` |         |
| `trackPadding`     | `number`                                                                                                                                                                                                                                                                                                                                                                                 | A percentage of the full track length to pad the start and end of the track. This is useful for creating a visual buffer between the thumbs or beginning/end ticks and the edges of the track. This is an SSR-friendly alternative to `thumbPositioning='contain'`.`Default:  —— undefined`                                                                                                                     |         |
| `ref` $bindable    | `HTMLSpanElement`                                                                                                                                                                                                                                                                                                                                                                        | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                                                                                                                                                                                                                                                                                               |         |
| `children`         | `Snippet` - type TickItem = { /\*\* The value this tick represents \*/ value: number; /\*\* The index of this tick \*/ index: number; }; type ChildrenSnippetProps = { /\*\* The tick items to iterate over and render \*/ tickItems: TickItem\[]; /\*\* The currently active thumb \*/ thumbs: number\[]; };                                                                            | The children content to render.`Default:  —— undefined`                                                                                                                                                                                                                                                                                                                                                         |         |
| `child`            | `Snippet` - type TickItem = { /\*\* The value this tick represents \*/ value: number; /\*\* The index of this tick \*/ index: number; }; type ChildSnippetProps = { /\*\* The tick items to iterate over and render \*/ tickItems: TickItem\[]; /\*\* The currently active thumb \*/ thumbs: number\[]; /\*\* Props to apply to the root element \*/ props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined`                                                                                                                                                                                                                                                                   |         |

| Data Attribute     | Value                               | Description                          | Details |
| ------------------ | ----------------------------------- | ------------------------------------ | ------- |
| `data-orientation` | `enum` - 'horizontal' \| 'vertical' | The orientation of the slider.       |         |
| `data-disabled`    | `''`                                | Present when the slider is disabled. |         |
| `data-slider-root` | `''`                                | Present on the root element.         |         |

### Slider.Range

The range of the slider.

| Property        | Type                                                                  | Description                                                                                                                                   | Details |
| --------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `ref` $bindable | `HTMLSpanElement`                                                     | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`      | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`         | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute      | Value                               | Description                          | Details |
| ------------------- | ----------------------------------- | ------------------------------------ | ------- |
| `data-orientation`  | `enum` - 'horizontal' \| 'vertical' | The orientation of the slider.       |         |
| `data-disabled`     | `''`                                | Present when the slider is disabled. |         |
| `data-slider-range` | `''`                                | Present on the range elements.       |         |

### Slider.Thumb

A thumb on the slider.

| Property         | Type                                                                  | Description                                                                                                                                   | Details |
| ---------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `index` required | `number`                                                              | The index of the value this thumb represents.`Default:  —— undefined`                                                                         |         |
| `disabled`       | `boolean`                                                             | Whether or not the thumb is disabled.`Default: false`                                                                                         |         |
| `ref` $bindable  | `HTMLSpanElement`                                                     | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`       | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`          | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute      | Value                               | Description                                              | Details |
| ------------------- | ----------------------------------- | -------------------------------------------------------- | ------- |
| `data-orientation`  | `enum` - 'horizontal' \| 'vertical' | The orientation of the slider.                           |         |
| `data-disabled`     | `''`                                | Present when either the thumb or the slider is disabled. |         |
| `data-active`       | `''`                                | Present when the thumb is active/grabbed.                |         |
| `data-slider-thumb` | `''`                                | Present on the thumb elements.                           |         |

### Slider.ThumbLabel

A label for a thumb on the slider.

| Property         | Type                                                                  | Description                                                                                                                                   | Details |
| ---------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `index` required | `number`                                                              | The index of the thumb this label represents.`Default:  —— undefined`                                                                         |         |
| `position`       | `enum` - 'top' \| 'bottom' \| 'left' \| 'right'                       | The position of the label relative to the thumb.``Default: '`'top'` for horizontal sliders and `'left'` for vertical sliders'``               |         |
| `ref` $bindable  | `HTMLSpanElement`                                                     | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`       | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`          | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute            | Value                                           | Description                                                                    | Details |
| ------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------ | ------- |
| `data-orientation`        | `enum` - 'horizontal' \| 'vertical'             | The orientation of the slider.                                                 |         |
| `data-disabled`           | `''`                                            | Present when either the thumb this label represents or the slider is disabled. |         |
| `data-position`           | `enum` - 'top' \| 'bottom' \| 'left' \| 'right' | The position of the label relative to the thumb.                               |         |
| `data-active`             | `''`                                            | Present when the thumb this label represents is active.                        |         |
| `data-value`              | `''`                                            | The value of the thumb this label represents.                                  |         |
| `data-slider-thumb-label` | `''`                                            | Present on the thumb label elements.                                           |         |

### Slider.Tick

A tick mark on the slider.

| Property         | Type                                                                  | Description                                                                                                                                   | Details |
| ---------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `index` required | `number`                                                              | The index of the tick in the array of ticks provided by the `ticks` `children` snippet prop.`Default:  —— undefined`                          |         |
| `ref` $bindable  | `HTMLSpanElement`                                                     | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`       | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`          | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute     | Value                               | Description                                                                                  | Details |
| ------------------ | ----------------------------------- | -------------------------------------------------------------------------------------------- | ------- |
| `data-orientation` | `enum` - 'horizontal' \| 'vertical' | The orientation of the slider.                                                               |         |
| `data-disabled`    | `''`                                | Present when the slider is disabled.                                                         |         |
| `data-bounded`     | `''`                                | Present when the tick is bounded (i.e. the tick is less than or equal to the current value). |         |
| `data-value`       | `''`                                | The value the tick represents.                                                               |         |
| `data-selected`    | `''`                                | Present when the tick is the same value as one of the thumbs.                                |         |
| `data-slider-tick` | `''`                                | Present on the tick elements.                                                                |         |

### Slider.TickLabel

A label for a tick on the slider.

| Property         | Type                                                                  | Description                                                                                                                                   | Details |
| ---------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `index` required | `number`                                                              | The index of the tick in the array of ticks provided by the `ticks` `children` snippet prop.`Default:  —— undefined`                          |         |
| `position`       | `enum` - 'top' \| 'bottom' \| 'left' \| 'right'                       | The position of the tick label.`Default:  —— undefined`                                                                                       |         |
| `ref` $bindable  | `HTMLSpanElement`                                                     | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`       | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`          | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute           | Value                                           | Description                                                                                                                                                 | Details |
| ------------------------ | ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `data-orientation`       | `enum` - 'horizontal' \| 'vertical'             | The orientation of the slider.                                                                                                                              |         |
| `data-disabled`          | `''`                                            | Present when the slider is disabled.                                                                                                                        |         |
| `data-position`          | `enum` - 'top' \| 'bottom' \| 'left' \| 'right' | The position of the tick label.                                                                                                                             |         |
| `data-selected`          | `''`                                            | Present when the tick this label represents is the same value as one of the thumbs.                                                                         |         |
| `data-value`             | `''`                                            | The value of the tick this label represents.                                                                                                                |         |
| `data-bounded`           | `''`                                            | Present when the tick this label represents is bounded (i.e. the tick is less than or equal to the current value or within the range of a multiple slider). |         |
| `data-slider-tick-label` | `''`                                            | Present on the tick label elements.                                                                                                                         |         |

[Previous Separator](/docs/components/separator) [Next Switch](/docs/components/switch)