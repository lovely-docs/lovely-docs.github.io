# Accordion Documentation

Organizes content into collapsible sections.

This is a documentation section that potentially contains examples, demos, and other useful information related to a specific part of Bits UI. When helping users with this documentation, you can ignore the classnames applied to the demos unless they are relevant to the user's issue.

Copy Page

```svelte
<script lang="ts">
  import { Accordion } from "bits-ui";
  import CaretDown from "phosphor-svelte/lib/CaretDown";
  const items = [
    {
      value: "1",
      title: "What is the meaning of life?",
      content:
        "To become a better person, to help others, and to leave the world a better place than you found it."
    },
    {
      value: "2",
      title: "How do I become a better person?",
      content:
        "Read books, listen to podcasts, and surround yourself with people who inspire you."
    },
    {
      value: "3",
      title: "What is the best way to help others?",
      content: "Give them your time, attention, and love."
    }
  ];
</script>
<Accordion.Root class="w-full sm:max-w-[70%]" type="multiple">
  {#each items as item (item.value)}
    <Accordion.Item
      value={item.value}
      class="border-dark-10 group border-b px-1.5"
    >
      <Accordion.Header>
        <Accordion.Trigger
          class="flex w-full flex-1 select-none items-center justify-between py-5 text-[15px] font-medium transition-all [&[data-state=open]>span>svg]:rotate-180"
        >
          <span class="w-full text-left">
            {item.title}
          </span>
          <span
            class="hover:bg-dark-10 inline-flex size-8 items-center justify-center rounded-[7px] bg-transparent"
          >
            <CaretDown class="size-[18px] transition-transform duration-200" />
          </span>
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content
        class="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm tracking-[-0.01em]"
      >
        <div class="pb-[25px]">
          {item.content}
        </div>
      </Accordion.Content>
    </Accordion.Item>
  {/each}
</Accordion.Root>
```

## Overview

The Accordion component is a versatile UI element designed to organize content into collapsible sections, helping users focus on specific information without being overwhelmed by visual clutter.

## Quick Start

```svelte
<script lang="ts">
  import { Accordion } from "bits-ui";
</script>
<Accordion.Root type="single">
  <Accordion.Item value="item-1">
    <Accordion.Header>
      <Accordion.Trigger>Item 1 Title</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content
      >This is the collapsible content for this section.</Accordion.Content
    >
  </Accordion.Item>
  <Accordion.Item value="item-2">
    <Accordion.Header>
      <Accordion.Trigger>Item 2 Title</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content
      >This is the collapsible content for this section.</Accordion.Content
    >
  </Accordion.Item>
</Accordion.Root>
```

## Key Features

- **Single or Multiple Mode**: Toggle between allowing one open section or multiple sections at once.
- **Accessible by Default**: Built-in ARIA attributes and keyboard navigation support.
- **Smooth Transitions**: Leverage CSS variables or Svelte transitions for animated open/close effects.
- **Flexible State**: Use uncontrolled defaults or take full control with bound values.

## Structure

The Accordion is a compound component made up of several parts:

- `Accordion.Root`: Container that manages overall state
- `Accordion.Item`: Individual collapsible section
- `Accordion.Header`: Contains the visible heading
- `Accordion.Trigger`: The clickable element that toggles content visibility
- `Accordion.Content`: The collapsible body content

## Reusable Components

To streamline usage in larger applications, create custom wrapper components for repeated patterns. Below is an example of a reusable `MyAccordionItem` and `MyAccordion`.

### Item Wrapper

Combines `Item`, `Header`, `Trigger`, and `Content` into a single component:

MyAccordionItem.svelte

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
  <Accordion.Content>
    {content}
  </Accordion.Content>
</Accordion.Item>
```

### Accordion Wrapper

Wraps `Root` and renders multiple `MyAccordionItem` components:

MyAccordion.svelte

```svelte
<script lang="ts">
  import { Accordion, type WithoutChildrenOrChild } from "bits-ui";
  import MyAccordionItem from "$lib/components/MyAccordionItem.svelte";
  type Item = {
    value?: string;
    title: string;
    content: string;
    disabled?: boolean;
  };
  let {
    value = $bindable(),
    ref = $bindable(null),
    items,
    ...restProps
  }: WithoutChildrenOrChild<Accordion.RootProps> & {
    items: Item[];
  } = $props();
</script>
<!--
 Since we have to destructure the `value` to make it `$bindable`, we need to use `as any` here to avoid
 type errors from the discriminated union of `"single" | "multiple"`.
 (an unfortunate consequence of having to destructure bindable values)
  -->
<Accordion.Root bind:value bind:ref {...restProps as any}>
  {#each items as item, i (item.title + i)}
    <MyAccordionItem {...item} />
  {/each}
</Accordion.Root>
```

### Usage Example

+page.svelte

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

##### Tip

Use unique `value` props for each `Item` if you plan to control the state programatically.

## Managing Value State

This section covers how to manage the `value` state of the Accordion.

### Two-Way Binding

Use `bind:value` for simple, automatic state synchronization:

```svelte
<script lang="ts">
  import { Accordion } from "bits-ui";
  let myValue = $state<string[]>([]);
  const numberOfItemsOpen = $derived(myValue.length);
</script>
<button
  onclick={() => {
    myValue = ["item-1", "item-2"];
  }}
>
  Open Items 1 and 2
</button>
<Accordion.Root type="multiple" bind:value={myValue}>
  <Accordion.Item value="item-1">
    <!-- ... -->
  </Accordion.Item>
  <Accordion.Item value="item-2">
    <!-- ... -->
  </Accordion.Item>
  <Accordion.Item value="item-3">
    <!-- ... -->
  </Accordion.Item>
</Accordion.Root>
```

### Fully Controlled

Use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) for complete control over the state's reads and writes.

```svelte
<script lang="ts">
  import { Accordion } from "bits-ui";
  let myValue = $state("");
  function getValue() {
    return myValue;
  }
  function setValue(newValue: string) {
    myValue = newValue;
  }
</script>
<Accordion.Root type="single" bind:value={getValue, setValue}>
  <!-- ... -->
</Accordion.Root>
```

See the [State Management](/docs/state-management) documentation for more information.

## Customization

### Single vs. Multiple

Set the `type` prop to `"single"` to allow only one accordion item to be open at a time.

```svelte
<MyAccordion
  type="single"
  items={[
    { title: "Title A", content: "Content A" },
    { title: "Title B", content: "Content B" },
    { title: "Title C", content: "Content C" },
  ]}
/>
```

Set the `type` prop to `"multiple"` to allow multiple accordion items to be open at the same time.

```svelte
<MyAccordion
  type="multiple"
  items={[
    { title: "Title A", content: "Content A" },
    { title: "Title B", content: "Content B" },
    { title: "Title C", content: "Content C" },
  ]}
/>
```

### Default Open Items

Set the `value` prop to pre-open items:

```svelte
<MyAccordion value={["A", "C"]} type="multiple" />
```

### Disable Items

Disable specific items with the `disabled` prop:

```svelte
<Accordion.Root type="single">
  <Accordion.Item value="item-1" disabled>
    <!-- ... -->
  </Accordion.Item>
</Accordion.Root>
```

### Hidden Until Found

The `hiddenUntilFound` prop enables browser search functionality within collapsed accordion content. When enabled, collapsed content is marked with `hidden="until-found"`, allowing browsers to automatically expand accordion items when users search for text within them.

```svelte
<Accordion.Root type="single">
  <Accordion.Item value="item-1">
    <Accordion.Header>
      <Accordion.Trigger>Search Demo</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content hiddenUntilFound>
      This content can be found by browser search (Ctrl+F/CMD+F) even when the
      accordion is closed. The accordion will automatically open when the
      browser finds matching text.
    </Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
```

### Svelte Transitions

The Accordion component can be enhanced with Svelte's built-in transition effects or other animation libraries.

#### Using `forceMount` and `child` Snippets

To apply Svelte transitions to Accordion components, use the `forceMount` prop in combination with the `child` snippet. This approach gives you full control over the mounting behavior and animation of the `Accordion.Content`.

```svelte
<Accordion.Content forceMount={true}>
  {#snippet child({ props, open })}
    {#if open}
      <div {...props} transition:slide={{ duration: 1000 }}>
        This is the accordion content that will transition in and out.
      </div>
    {/if}
  {/snippet}
</Accordion.Content>
```

In this example:

- The `forceMount` prop ensures the components are always in the DOM.
- The `child` snippet provides access to the open state and component props.
- Svelte's `#if` block controls when the content is visible.
- Transition directives (`transition:fade` and `transition:fly`) apply the animations.

Expand Code

```svelte
<script lang="ts">
  import { Accordion } from "bits-ui";
  import CaretDown from "phosphor-svelte/lib/CaretDown";
  import { slide } from "svelte/transition";
  const items = [
    {
      title: "What is the meaning of life?",
      content:
        "To become a better person, to help others, and to leave the world a better place than you found it."
    },
    {
      title: "How do I become a better person?",
      content:
        "Read books, listen to podcasts, and surround yourself with people who inspire you."
    },
    {
      title: "What is the best way to help others?",
      content: "Give them your time, attention, and love."
    }
  ];
  let value = $state<string[]>([]);
</script>
<Accordion.Root class="w-full sm:max-w-[70%]" type="multiple" bind:value>
  {#each items as item, i (item.title)}
    <Accordion.Item value={`${i}`} class="border-dark-10 group border-b px-1.5">
      <Accordion.Header>
        <Accordion.Trigger
          class="flex w-full flex-1 items-center justify-between py-5 text-left text-[15px] font-medium transition-all [&[data-state=open]>span>svg]:rotate-180"
        >
          {item.title}
          <span
            class="hover:bg-dark-10 inline-flex size-8 items-center justify-center rounded-[7px] bg-transparent transition-all"
          >
            <CaretDown class="size-[18px] transition-all duration-200" />
          </span>
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content
        forceMount={true}
        class="overflow-hidden text-sm tracking-[-0.01em]"
      >
        {#snippet child({ props, open })}
          {#if open}
            <div {...props} transition:slide={{ duration: 1000 }}>
              <div class="pb-[25px]">
                {item.content}
              </div>
            </div>
          {/if}
        {/snippet}
      </Accordion.Content>
    </Accordion.Item>
  {/each}
</Accordion.Root>
```

#### Best Practices

For cleaner code and better maintainability, consider creating custom reusable components that encapsulate this transition logic.

MyAccordionContent.svelte

```svelte
<script lang="ts">
  import { Accordion, type WithoutChildrenOrChild } from "bits-ui";
  import type { Snippet } from "svelte";
  import { fade } from "svelte/transition";
  let {
    ref = $bindable(null),
    duration = 200,
    children,
    ...restProps
  }: WithoutChildrenOrChild<Accordion.ContentProps> & {
    duration?: number;
    children: Snippet;
  } = $props();
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

You can then use the `MyAccordionContent` component alongside the other `Accordion` primitives throughout your application:

```svelte
<Accordion.Root>
  <Accordion.Item value="A">
    <Accordion.Header>
      <Accordion.Trigger>A</Accordion.Trigger>
    </Accordion.Header>
    <MyAccordionContent duration={300}>
      <!-- ... -->
    </MyAccordionContent>
  </Accordion.Item>
</Accordion.Root>
```

## Examples

The following examples demonstrate different ways to use the Accordion component.

### Horizontal Cards

Use the Accordion component to create a horizontal card layout with collapsible sections.

Expand Code

```svelte
<script lang="ts">
  import { Accordion } from "bits-ui";
  let value = $state("item-1");
  const items = [
    {
      id: "item-1",
      title: "Mountain Range",
      image:
        "https://images.unsplash.com/photo-1586589058841-f1264894a260?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3",
      description:
        "Majestic mountain ranges with snow-capped peaks and lush valleys."
    },
    {
      id: "item-2",
      title: "Ocean Views",
      image:
        "https://images.unsplash.com/photo-1650300874827-7d39bc9276ea?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3",
      description:
        "Serene ocean scenes with crashing waves, beautiful sunsets, and sandy beaches."
    },
    {
      id: "item-3",
      title: "Forest Retreats",
      image:
        "https://images.unsplash.com/photo-1693297490324-37ee6301f6c8?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3",
      description:
        "Dense forests with towering trees, abundant wildlife, and peaceful streams."
    }
  ];
</script>
<Accordion.Root
  type="single"
  orientation="horizontal"
  class="flex h-[400px] w-full gap-2 sm:flex-row"
  bind:value
>
  {#each items as item (item.id)}
    <Accordion.Item
      value={item.id}
      class="ring-primary/70 relative cursor-pointer overflow-hidden rounded-lg transition-all duration-500 ease-in-out data-[state=closed]:w-[20%] data-[state=open]:w-[100%] md:data-[state=closed]:w-[10%] [&:has(:focus-visible)]:ring-2"
      onclick={() => (value = item.id)}
    >
      <img
        src={item.image}
        alt={item.title}
        class="h-[400px] w-full object-cover"
      />
      <div
        class="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4"
      >
        <div
          class="transition-all duration-300 group-data-[state=closed]:translate-y-2 group-data-[state=open]:translate-y-0"
        >
          <Accordion.Header>
            <Accordion.Trigger
              class="focus-override text-left font-bold text-white transition-all duration-300 focus-visible:!outline-none data-[state=open]:mb-2 data-[state=closed]:text-sm data-[state=open]:text-base data-[state=closed]:opacity-0 data-[state=open]:opacity-100 md:data-[state=open]:text-xl"
            >
              {item.title}
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content
            forceMount
            class="max-h-0 overflow-hidden text-white/90 transition-all duration-700 data-[state=open]:max-h-[100px] data-[state=open]:text-xs data-[state=closed]:opacity-0 data-[state=open]:opacity-100 md:data-[state=open]:text-base"
          >
            {item.description}
          </Accordion.Content>
          <div
            class="absolute bottom-0 left-0 h-1 w-full transition-all duration-300 group-data-[state=closed]:opacity-0 group-data-[state=open]:opacity-100"
          ></div>
        </div>
      </div>
    </Accordion.Item>
  {/each}
</Accordion.Root>
```

### Checkout Steps

Use the Accordion component to create a multi-step checkout process.

Expand Code

```svelte
<script lang="ts">
  import cn from "clsx";
  import { Accordion, useId, Button } from "bits-ui";
  import CaretDown from "phosphor-svelte/lib/CaretDown";
  import { SvelteSet } from "svelte/reactivity";
  let activeStep = $state("");
  let completedSteps = new SvelteSet<string>();
</script>
{#snippet MyAccordionHeader({ value, title }: { value: string; title: string })}
  {@const isCompleted = completedSteps.has(value)}
  <Accordion.Header>
    <Accordion.Trigger
      class="flex w-full flex-1 select-none items-center justify-between gap-3 py-5 text-[15px] font-medium transition-all [&[data-state=open]>span>svg]:rotate-180"
    >
      <div
        class={cn(
          "border-foreground/30 flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium",
          isCompleted ? "text-foreground" : "text-muted-foreground"
        )}
      >
        {isCompleted ? "✓" : value}
      </div>
      <span class="w-full text-left">
        {title}
      </span>
      <span
        class="hover:bg-dark-10 inline-flex size-8 items-center justify-center rounded-[7px] bg-transparent"
      >
        <CaretDown class="size-[18px] transition-transform duration-200" />
      </span>
    </Accordion.Trigger>
  </Accordion.Header>
{/snippet}
{#snippet InputField({
  label,
  placeholder,
  type = "text"
}: {
  label: string;
  placeholder: string;
  type?: string;
})}
  {@const id = useId()}
  <div class="flex flex-col gap-1">
    <label class="select-none text-sm font-medium" for={id}>{label}</label>
    <input
      {type}
      {id}
      name={label}
      {placeholder}
      class="rounded-card-sm border-border-input bg-background placeholder:text-foreground-alt/50 hover:border-dark-40 focus-override inline-flex h-10 w-full items-center border px-4 text-base sm:text-sm"
    />
  </div>
{/snippet}
<Accordion.Root
  bind:value={activeStep}
  class="w-full sm:max-w-[70%]"
  type="single"
>
  <Accordion.Item value="1" class="border-dark-10 group border-b px-1.5">
    {@render MyAccordionHeader({ title: "Shipping Information", value: "1" })}
    <Accordion.Content
      class="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm tracking-[-0.01em]"
    >
      <div class="flex flex-col gap-4 pb-6 pt-2">
        <div class="grid grid-cols-2 gap-4">
          {@render InputField({ label: "First Name", placeholder: "John" })}
          {@render InputField({ label: "Last Name", placeholder: "Doe" })}
          <div class="col-span-2">
            {@render InputField({
              label: "Address",
              placeholder: "1234 Elm Street"
            })}
          </div>
          {@render InputField({ label: "City", placeholder: "Tampa" })}
          {@render InputField({ label: "ZIP", placeholder: "123456" })}
        </div>
        <div class="pt-2">
          <Button.Root
            class="rounded-input bg-dark text-background shadow-mini hover:bg-dark/95 inline-flex h-10 select-none items-center justify-center whitespace-nowrap px-[21px] text-sm font-medium transition-all hover:cursor-pointer active:scale-[0.98]"
            onclick={() => {
              completedSteps.add("1");
              activeStep = "2";
            }}
          >
            Continue to Payment
          </Button.Root>
        </div>
      </div>
    </Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="2" class="border-dark-10 group border-b px-1.5">
    {@render MyAccordionHeader({ title: "Payment Method", value: "2" })}
    <Accordion.Content
      class="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm tracking-[-0.01em]"
    >
      <div class="flex flex-col gap-4 pb-6 pt-2">
        <div class="grid grid-cols-3 gap-4">
          <div class="col-span-3">
            {@render InputField({
              label: "Card Number",
              placeholder: "4242 4242 4242 4242"
            })}
          </div>
          {@render InputField({ label: "Exp. Month", placeholder: "MM" })}
          {@render InputField({ label: "Exp. Year", placeholder: "YY" })}
          {@render InputField({ label: "CVC", placeholder: "123" })}
        </div>
        <div class="pt-2">
          <Button.Root
            class="rounded-input bg-dark text-background shadow-mini hover:bg-dark/95 inline-flex h-10 select-none items-center justify-center whitespace-nowrap px-[21px] text-sm font-medium transition-all hover:cursor-pointer active:scale-[0.98]"
            onclick={() => {
              completedSteps.add("2");
              activeStep = "3";
            }}
          >
            Continue to Review
          </Button.Root>
        </div>
      </div>
    </Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="3" class="border-dark-10 group border-b px-1.5">
    {@render MyAccordionHeader({ title: "Payment Method", value: "3" })}
    <Accordion.Content
      class="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden pb-6 text-sm tracking-[-0.01em]"
    >
      <div class="flex flex-col gap-4 pt-2">
        <div class="rounded-lg border p-4">
          <h4 class="mb-2 font-medium">Order Summary</h4>
          <div class="flex flex-col gap-2">
            <div class="flex justify-between text-sm">
              <span class="text-muted-foreground">Product 1</span>
              <span>$29.99</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-muted-foreground">Product 2</span>
              <span>$49.99</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-muted-foreground">Shipping</span>
              <span>$4.99</span>
            </div>
            <div class="mt-2 flex justify-between border-t pt-2 font-medium">
              <span>Total</span>
              <span>$84.97</span>
            </div>
          </div>
        </div>
        <div class="pt-2">
          <Button.Root
            class="rounded-input bg-dark text-background shadow-mini hover:bg-dark/95 inline-flex h-10 select-none items-center justify-center whitespace-nowrap px-[21px] text-sm font-medium transition-all hover:cursor-pointer active:scale-[0.98]"
            onclick={() => {
              completedSteps.add("3");
              activeStep = "";
            }}
          >
            Place Order
          </Button.Root>
        </div>
      </div>
    </Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
```

## API Reference

### Accordion.Root

The root accordion component used to set and manage the state of the accordion.

| Property          | Type                                                                  | Description                                                                                                                                                                                                                       | Details |
| ----------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `type` required   | `enum` - 'single' \| 'multiple'                                       | The type of accordion. If set to `'multiple'`, the accordion will allow multiple items to be open at the same time. If set to `single`, the accordion will only allow a single item to be open.`Default:  —— undefined`           |         |
| `value` $bindable | `union` - string\[] \| string                                         | The value of the currently active accordion item. If `type` is `'single'`, this should be a string. If `type` is `'multiple'`, this should be an array of strings.`Default:  —— undefined`                                        |         |
| `onValueChange`   | `function` - string \| string\[]                                      | A callback function called when the active accordion item value changes. If the `type` is `'single'`, the argument will be a string. If `type` is `'multiple'`, the argument will be an array of strings.`Default:  —— undefined` |         |
| `disabled`        | `boolean`                                                             | Whether or not the accordion is disabled. When disabled, the accordion cannot be interacted with.`Default: false`                                                                                                                 |         |
| `loop`            | `boolean`                                                             | Whether or not the accordion should loop through items when reaching the end.`Default: false`                                                                                                                                     |         |
| `orientation`     | `enum` - 'vertical' \| 'horizontal'                                   | The orientation of the accordion.`Default: 'vertical'`                                                                                                                                                                            |         |
| `ref` $bindable   | `HTMLDivElement`                                                      | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                                                                                                                 |         |
| `children`        | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                                                                                                           |         |
| `child`           | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined`                                                                                     |         |

| Data Attribute        | Value                               | Description                             | Details |
| --------------------- | ----------------------------------- | --------------------------------------- | ------- |
| `data-orientation`    | `enum` - 'vertical' \| 'horizontal' | The orientation of the component.       |         |
| `data-disabled`       | `''`                                | Present when the component is disabled. |         |
| `data-accordion-root` | `''`                                | Present on the root element.            |         |

### Accordion.Item

An accordion item.

| Property        | Type                                                                  | Description                                                                                                                                                                            | Details |
| --------------- | --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `disabled`      | `boolean`                                                             | Whether or not the accordion item is disabled.`Default: false`                                                                                                                         |         |
| `value`         | `string`                                                              | The value of the accordion item. This is used to identify when the item is open or closed. If not provided, a unique ID will be generated for this value.`Default: A random unique ID` |         |
| `ref` $bindable | `HTMLDivElement`                                                      | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                                                                      |         |
| `children`      | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                                                                |         |
| `child`         | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined`                                          |         |

| Data Attribute        | Value                               | Description                                   | Details |
| --------------------- | ----------------------------------- | --------------------------------------------- | ------- |
| `data-state`          | `enum` - 'open' \| 'closed'         | Whether the accordion item is open or closed. |         |
| `data-disabled`       | `''`                                | Present when the component is disabled.       |         |
| `data-orientation`    | `enum` - 'vertical' \| 'horizontal' | The orientation of the component.             |         |
| `data-accordion-item` | `''`                                | Present on the item element.                  |         |

### Accordion.Header

The header of the accordion item.

| Property        | Type                                                                  | Description                                                                                                                                   | Details |
| --------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `level`         | `union` - 1 \| 2 \| 3 \| 4 \| 5 \| 6                                  | The heading level of the header. This will be set as the `aria-level` attribute.`Default: 3`                                                  |         |
| `ref` $bindable | `HTMLDivElement`                                                      | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`      | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`         | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute          | Value                                           | Description                             | Details |
| ----------------------- | ----------------------------------------------- | --------------------------------------- | ------- |
| `data-orientation`      | `enum` - 'vertical' \| 'horizontal'             | The orientation of the component.       |         |
| `data-disabled`         | `''`                                            | Present when the component is disabled. |         |
| `data-heading-level`    | `enum` - '1' \| '2' \| '3' \| '4' \| '5' \| '6' | The heading level of the element.       |         |
| `data-accordion-header` | `''`                                            | Present on the header element.          |         |

### Accordion.Trigger

The button responsible for toggling the accordion item.

| Property        | Type                                                                  | Description                                                                                                                                   | Details |
| --------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `ref` $bindable | `HTMLButtonElement`                                                   | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`      | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`         | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute           | Value                               | Description                             | Details |
| ------------------------ | ----------------------------------- | --------------------------------------- | ------- |
| `data-orientation`       | `enum` - 'vertical' \| 'horizontal' | The orientation of the component.       |         |
| `data-disabled`          | `''`                                | Present when the component is disabled. |         |
| `data-accordion-trigger` | `''`                                | Present on the trigger element.         |         |

### Accordion.Content

The accordion item content, which is displayed when the item is open.

| Property           | Type                                                                                 | Description                                                                                                                                                                                                    | Details |
| ------------------ | ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `forceMount`       | `boolean`                                                                            | Whether or not to forcefully mount the content. This is useful if you want to use Svelte transitions or another animation library for the content.`Default: false`                                             |         |
| `hiddenUntilFound` | `boolean`                                                                            | Whether the content should use `hidden='until-found'` when closed. This allows browsers to search within collapsed content and automatically expand the accordion item when matches are found.`Default: false` |         |
| `ref` $bindable    | `HTMLDivElement`                                                                     | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                                                                                              |         |
| `children`         | `Snippet`                                                                            | The children content to render.`Default:  —— undefined`                                                                                                                                                        |         |
| `child`            | `Snippet` - type SnippetProps = { open: boolean; props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined`                                                                  |         |

| Data Attribute           | Value                               | Description                             | Details |
| ------------------------ | ----------------------------------- | --------------------------------------- | ------- |
| `data-orientation`       | `enum` - 'vertical' \| 'horizontal' | The orientation of the component.       |         |
| `data-disabled`          | `''`                                | Present when the component is disabled. |         |
| `data-accordion-content` | `''`                                | Present on the content element.         |         |

| CSS Variable                      | Description                                  | Details |
| --------------------------------- | -------------------------------------------- | ------- |
| `--bits-accordion-content-height` | The height of the accordion content element. |         |
| `--bits-accordion-content-width`  | The width of the accordion content element.  |         |

[Previous LLMs](/docs/llms) [Next Alert Dialog](/docs/components/alert-dialog)