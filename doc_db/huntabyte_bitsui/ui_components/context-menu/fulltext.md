# Context Menu Documentation

Displays contextual options and actions triggered by right-click.

This is a documentation section that potentially contains examples, demos, and other useful information related to a specific part of Bits UI. When helping users with this documentation, you can ignore the classnames applied to the demos unless they are relevant to the user's issue.

Copy Page

```svelte
<script lang="ts">
  import { ContextMenu } from "bits-ui";
  import CopySimple from "phosphor-svelte/lib/CopySimple";
  import MouseSimple from "phosphor-svelte/lib/MouseSimple";
  import PencilSimpleLine from "phosphor-svelte/lib/PencilSimpleLine";
  import PlusCircle from "phosphor-svelte/lib/PlusCircle";
  import Trash from "phosphor-svelte/lib/Trash";
</script>
<ContextMenu.Root>
  <ContextMenu.Trigger
    class="rounded-card border-border-input text-muted-foreground flex h-[188px] w-[279px] select-none items-center justify-center border-2 border-dashed bg-transparent font-semibold"
  >
    <div class="flex flex-col items-center justify-center gap-4 text-center">
      <MouseSimple class="size-8" />
      Right click me
    </div>
  </ContextMenu.Trigger>
  <ContextMenu.Portal>
    <ContextMenu.Content
      class="border-muted bg-background shadow-popover w-[229px] rounded-xl border px-1 py-1.5 outline-none focus-visible:outline-none"
    >
      <ContextMenu.Item
        class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
      >
        <div class="flex items-center">
          <PencilSimpleLine class="text-foreground-alt mr-2 size-5" />
          Edit
        </div>
        <div class="ml-auto flex items-center gap-px">
          <kbd
            class="rounded-button border-dark-10 bg-background-alt text-muted-foreground shadow-kbd inline-flex size-5 items-center justify-center border text-[13px]"
          >
            ⌘
          </kbd>
          <kbd
            class="rounded-button border-dark-10 bg-background-alt text-muted-foreground shadow-kbd inline-flex size-5 items-center justify-center border text-[11px]"
          >
            E
          </kbd>
        </div>
      </ContextMenu.Item>
      <ContextMenu.Sub>
        <ContextMenu.SubTrigger
          class="rounded-button data-highlighted:bg-muted data-[state=open]:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
        >
          <div class="flex items-center">
            <PlusCircle class="text-foreground-alt mr-2 size-5" />
            Add
          </div>
          <div class="ml-auto flex items-center gap-px">
            <kbd
              class="rounded-button border-dark-10 bg-background-alt text-muted-foreground shadow-kbd inline-flex size-5 items-center justify-center border text-[13px]"
            >
              ⌘
            </kbd>
            <kbd
              class="rounded-button border-dark-10 bg-background-alt text-muted-foreground shadow-kbd inline-flex size-5 items-center justify-center border text-[11px]"
            >
              N
            </kbd>
          </div>
        </ContextMenu.SubTrigger>
        <ContextMenu.SubContent
          class="border-muted bg-background shadow-popover z-100 ring-0! ring-transparent! w-[209px] rounded-xl border px-1 py-1.5"
          sideOffset={10}
        >
          <ContextMenu.Item
            class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-normal focus-visible:outline-none"
          >
            Header
          </ContextMenu.Item>
          <ContextMenu.Item
            class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-normal focus-visible:outline-none"
          >
            Paragraph
          </ContextMenu.Item>
          <ContextMenu.Item
            class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-normal focus-visible:outline-none"
          >
            Codeblock
          </ContextMenu.Item>
          <ContextMenu.Item
            class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-normal focus-visible:outline-none"
          >
            List
          </ContextMenu.Item>
          <ContextMenu.Item
            class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-normal focus-visible:outline-none"
          >
            Task
          </ContextMenu.Item>
        </ContextMenu.SubContent>
      </ContextMenu.Sub>
      <ContextMenu.Item
        class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
      >
        <div class="flex items-center">
          <CopySimple class="text-foreground-alt mr-2 size-5" />
          Duplicate
        </div>
        <div class="ml-auto flex items-center gap-px">
          <kbd
            class="rounded-button border-dark-10 bg-background-alt text-muted-foreground shadow-kbd inline-flex size-5 items-center justify-center border text-[13px]"
          >
            ⌘
          </kbd>
          <kbd
            class="rounded-button border-dark-10 bg-background-alt text-muted-foreground shadow-kbd inline-flex size-5 items-center justify-center border text-[11px]"
          >
            D
          </kbd>
        </div>
      </ContextMenu.Item>
      <ContextMenu.Separator class="bg-muted -mx-1 my-1 block h-px" />
      <ContextMenu.Item
        class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
      >
        <div class="flex items-center">
          <Trash class="text-foreground-alt mr-2 size-5" />
          Delete
        </div>
      </ContextMenu.Item>
    </ContextMenu.Content>
  </ContextMenu.Portal>
</ContextMenu.Root>
```

## Structure

```svelte
<script lang="ts">
  import { ContextMenu } from "bits-ui";
</script>
<ContextMenu.Root>
  <ContextMenu.Trigger />
  <ContextMenu.Portal>
    <ContextMenu.Content>
      <ContextMenu.Group>
        <ContextMenu.GroupHeading />
        <ContextMenu.Item />
      </ContextMenu.Group>
      <ContextMenu.Item />
      <ContextMenu.CheckboxItem>
        {#snippet children({ checked })}
          {checked ? "✅" : ""}
        {/snippet}
      </ContextMenu.CheckboxItem>
      <ContextMenu.RadioGroup>
        <ContextMenu.GroupHeading />
        <ContextMenu.RadioItem>
          {#snippet children({ checked })}
            {checked ? "✅" : ""}
          {/snippet}
        </ContextMenu.RadioItem>
      </ContextMenu.RadioGroup>
      <ContextMenu.Sub>
        <ContextMenu.SubTrigger />
        <ContextMenu.SubContent />
      </ContextMenu.Sub>
      <ContextMenu.Separator />
      <ContextMenu.Arrow />
    </ContextMenu.Content>
  </ContextMenu.Portal>
</ContextMenu.Root>
```

## Reusable Components

If you're planning to use Context Menu in multiple places, you can create a reusable component that wraps the Context Menu component.

This example shows you how to create a Context Menu component that accepts a few custom props that make it more capable.

CustomContextMenu.svelte

```svelte
<script lang="ts">
  import type { Snippet } from "svelte";
  import { ContextMenu, type WithoutChild } from "bits-ui";
  type Props = ContextMenu.Props & {
    trigger: Snippet;
    items: string[];
    contentProps?: WithoutChild<ContextMenu.Content.Props>;
    // other component props if needed
  };
  let {
    open = $bindable(false),
    children,
    trigger,
    items,
    contentProps,
    ...restProps
  }: Props = $props();
</script>
<ContextMenu.Root bind:open {...restProps}>
  <ContextMenu.Trigger>
    {@render trigger()}
  </ContextMenu.Trigger>
  <ContextMenu.Portal>
    <ContextMenu.Content {...contentProps}>
      <ContextMenu.Group>
        <ContextMenu.GroupHeading>Select an Office</ContextMenu.GroupHeading>
        {#each items as item}
          <ContextMenu.Item textValue={item}>
            {item}
          </ContextMenu.Item>
        {/each}
      </ContextMenu.Group>
    </ContextMenu.Content>
  </ContextMenu.Portal>
</ContextMenu.Root>
```

You can then use the `CustomContextMenu` component like this:

```svelte
<script lang="ts">
  import CustomContextMenu from "./CustomContextMenu.svelte";
</script>
<CustomContextMenu
  items={[
    "Dunder Mifflin",
    "Vance Refrigeration",
    "Michael Scott Paper Company",
  ]}
>
  {#snippet triggerArea()}
    <div
      class="grid size-20 place-items-center rounded-lg border border-dashed p-4"
    >
      Right-click me
    </div>
  {/snippet}
</CustomContextMenu>
```

Alternatively, you can define the snippet(s) separately and pass them as props to the component:

```svelte
<script lang="ts">
  import CustomContextMenu from "./CustomContextMenu.svelte";
</script>
{#snippet triggerArea()}
  <div
    class="grid size-20 place-items-center rounded-lg border border-dashed p-4"
  >
    Right-click me
  </div>
{/snippet}
<CustomContextMenu
  items={[
    "Dunder Mifflin",
    "Vance Refrigeration",
    "Michael Scott Paper Company",
  ]}
  {triggerArea}
/>
```

## Managing Open State

This section covers how to manage the `open` state of the menu.

### Two-Way Binding

Use `bind:open` for simple, automatic state synchronization:

```svelte
<script lang="ts">
  import { ContextMenu } from "bits-ui";
  let isOpen = $state(false);
</script>
<button onclick={() => (isOpen = true)}>Open Context Menu</button>
<ContextMenu.Root bind:open={isOpen}>
  <!-- ... -->
</ContextMenu.Root>
```

### Fully Controlled

Use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) for complete control over the state's reads and writes.

```svelte
<script lang="ts">
  import { ContextMenu } from "bits-ui";
  let myOpen = $state(false);
  function getOpen() {
    return myOpen;
  }
  function setOpen(newOpen: boolean) {
    myOpen = newopen;
  }
</script>
<ContextMenu.Root bind:open={getOpen, setOpen}>
  <!-- ... -->
</ContextMenu.Root>
```

## Radio Groups

You can combine the `ContextMenu.RadioGroup` and `ContextMenu.RadioItem` components to create a radio group within a menu.

```svelte
<script lang="ts">
  import { ContextMenu } from "bits-ui";
  const values = ["one", "two", "three"];
  let value = $state("one");
</script>
<ContextMenu.RadioGroup bind:value>
  {#each values as value}
    <ContextMenu.RadioItem {value}>
      {#snippet children({ checked })}
        {#if checked}
          ✅
        {/if}
        {value}
      {/snippet}
    </ContextMenu.RadioItem>
  {/each}
</ContextMenu.RadioGroup>
```

See the [RadioGroup](#radiogroup) and [RadioItem](#radioitem) APIs for more information.

## Checkbox Items

You can use the `ContextMenu.CheckboxItem` component to create a `menuitemcheckbox` element to add checkbox functionality to menu items.

```svelte
<script lang="ts">
  import { ContextMenu } from "bits-ui";
  let notifications = $state(true);
</script>
<ContextMenu.CheckboxItem bind:checked={notifications}>
  {#snippet children({ checked, indeterminate })}
    {#if indeterminate}
      -
    {:else if checked}
      ✅
    {/if}
    Notifications
  {/snippet}
</ContextMenu.CheckboxItem>
```

See the [CheckboxItem API](#checkboxitem) for more information.

## Checkbox Groups

You can use the `ContextMenu.CheckboxGroup` component around a set of `ContextMenu.CheckboxItem` components to create a checkbox group within a menu, where the `value` prop is an array of the selected values.

```svelte
<script lang="ts">
  import { ContextMenu } from "bits-ui";
  let colors = $state<string[]>([]);
</script>
<ContextMenu.CheckboxGroup bind:value={colors}>
  <ContextMenu.GroupHeading>Favorite color</ContextMenu.GroupHeading>
  <ContextMenu.CheckboxItem value="red">
    {#snippet children({ checked })}
      {#if checked}
        ✅
      {/if}
      Red
    {/snippet}
  </ContextMenu.CheckboxItem>
  <ContextMenu.CheckboxItem value="blue">
    {#snippet children({ checked })}
      {#if checked}
        ✅
      {/if}
      Blue
    {/snippet}
  </ContextMenu.CheckboxItem>
  <ContextMenu.CheckboxItem value="green">
    {#snippet children({ checked })}
      {#if checked}
        ✅
      {/if}
      Green
    {/snippet}
  </ContextMenu.CheckboxItem>
</ContextMenu.CheckboxGroup>
```

The `value` state does not persist between menu open/close cycles. To persist the state, you must store it in a `$state` variable and pass it to the `value` prop.

## Nested Menus

You can create nested menus using the `ContextMenu.Sub` component to create complex menu structures.

```svelte
<script lang="ts">
  import { ContextMenu } from "bits-ui";
</script>
<ContextMenu.Content>
  <ContextMenu.Item>Item 1</ContextMenu.Item>
  <ContextMenu.Item>Item 2</ContextMenu.Item>
  <ContextMenu.Sub>
    <ContextMenu.SubTrigger>Open Sub Menu</ContextMenu.SubTrigger>
    <ContextMenu.SubContent>
      <ContextMenu.Item>Sub Item 1</ContextMenu.Item>
      <ContextMenu.Item>Sub Item 2</ContextMenu.Item>
    </ContextMenu.SubContent>
  </ContextMenu.Sub>
</ContextMenu.Content>
```

## Svelte Transitions

You can use the `forceMount` prop along with the `child` snippet to forcefully mount the `ContextMenu.Content` component to use Svelte Transitions or another animation library that requires more control.

```svelte
<script lang="ts">
  import { ContextMenu } from "bits-ui";
  import { fly } from "svelte/transition";
</script>
<ContextMenu.Content forceMount>
  {#snippet child({ wrapperProps, props, open })}
    {#if open}
      <div {...wrapperProps}>
        <div {...props} transition:fly>
          <ContextMenu.Item>Item 1</ContextMenu.Item>
          <ContextMenu.Item>Item 2</ContextMenu.Item>
        </div>
      </div>
    {/if}
  {/snippet}
</ContextMenu.Content>
```

Of course, this isn't the prettiest syntax, so it's recommended to create your own reusable content component that handles this logic if you intend to use this approach. For more information on using transitions with Bits UI components, see the [Transitions](/docs/transitions) documentation.

Expand Code

```svelte
<script lang="ts">
  import { ContextMenu } from "bits-ui";
  import CopySimple from "phosphor-svelte/lib/CopySimple";
  import MouseSimple from "phosphor-svelte/lib/MouseSimple";
  import PencilSimpleLine from "phosphor-svelte/lib/PencilSimpleLine";
  import PlusCircle from "phosphor-svelte/lib/PlusCircle";
  import Trash from "phosphor-svelte/lib/Trash";
  import { fly } from "svelte/transition";
</script>
<ContextMenu.Root>
  <ContextMenu.Trigger
    class="rounded-card border-input text-muted-foreground flex h-[188px] w-[279px] select-none items-center justify-center border-2 border-dashed bg-transparent font-semibold"
  >
    <div class="flex flex-col items-center justify-center gap-4 text-center">
      <MouseSimple class="size-8" />
      Right click me
    </div>
  </ContextMenu.Trigger>
  <ContextMenu.Portal>
    <ContextMenu.Content
      class="focus-override border-muted bg-background shadow-popover w-[229px] rounded-xl border px-1 py-1.5 focus-visible:outline-none"
      forceMount
    >
      {#snippet child({ wrapperProps, props, open })}
        {#if open}
          <div {...wrapperProps}>
            <div {...props} transition:fly={{ duration: 300 }}>
              <ContextMenu.Item
                class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
              >
                <div class="flex items-center">
                  <PencilSimpleLine class="text-foreground-alt mr-2 size-5" />
                  Edit
                </div>
                <div class="ml-auto flex items-center gap-px">
                  <kbd
                    class="rounded-button border-dark-10 bg-background-alt text-muted-foreground shadow-kbd inline-flex size-5 items-center justify-center border text-[13px]"
                  >
                    ⌘
                  </kbd>
                  <kbd
                    class="rounded-button border-dark-10 bg-background-alt text-muted-foreground shadow-kbd inline-flex size-5 items-center justify-center border text-[11px]"
                  >
                    E
                  </kbd>
                </div>
              </ContextMenu.Item>
              <ContextMenu.Sub>
                <ContextMenu.SubTrigger
                  class="rounded-button data-highlighted:bg-muted data-[state=open]:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
                >
                  <div class="flex items-center">
                    <PlusCircle class="text-foreground-alt mr-2 size-5" />
                    Add
                  </div>
                  <div class="ml-auto flex items-center gap-px">
                    <kbd
                      class="rounded-button border-dark-10 bg-background-alt text-muted-foreground shadow-kbd inline-flex size-5 items-center justify-center border text-[13px]"
                    >
                      ⌘
                    </kbd>
                    <kbd
                      class="rounded-button border-dark-10 bg-background-alt text-muted-foreground shadow-kbd inline-flex size-5 items-center justify-center border text-[11px]"
                    >
                      N
                    </kbd>
                  </div>
                </ContextMenu.SubTrigger>
                <ContextMenu.SubContent
                  class="border-muted bg-background shadow-popover z-100 ring-0! ring-transparent! w-[209px] rounded-xl border px-1 py-1.5"
                  sideOffset={10}
                >
                  <ContextMenu.Item
                    class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-normal focus-visible:outline-none"
                  >
                    Header
                  </ContextMenu.Item>
                  <ContextMenu.Item
                    class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-normal focus-visible:outline-none"
                  >
                    Paragraph
                  </ContextMenu.Item>
                  <ContextMenu.Item
                    class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-normal focus-visible:outline-none"
                  >
                    Codeblock
                  </ContextMenu.Item>
                  <ContextMenu.Item
                    class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-normal focus-visible:outline-none"
                  >
                    List
                  </ContextMenu.Item>
                  <ContextMenu.Item
                    class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-normal focus-visible:outline-none"
                  >
                    Task
                  </ContextMenu.Item>
                </ContextMenu.SubContent>
              </ContextMenu.Sub>
              <ContextMenu.Item
                class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
              >
                <div class="flex items-center">
                  <CopySimple class="text-foreground-alt mr-2 size-5" />
                  Duplicate
                </div>
                <div class="ml-auto flex items-center gap-px">
                  <kbd
                    class="rounded-button border-dark-10 bg-background-alt text-muted-foreground shadow-kbd inline-flex size-5 items-center justify-center border text-[13px]"
                  >
                    ⌘
                  </kbd>
                  <kbd
                    class="rounded-button border-dark-10 bg-background-alt text-muted-foreground shadow-kbd inline-flex size-5 items-center justify-center border text-[11px]"
                  >
                    D
                  </kbd>
                </div>
              </ContextMenu.Item>
              <ContextMenu.Separator class="bg-muted -mx-1 my-1 block h-px" />
              <ContextMenu.Item
                class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
              >
                <div class="flex items-center">
                  <Trash class="text-foreground-alt mr-2 size-5" />
                  Delete
                </div>
              </ContextMenu.Item>
            </div>
          </div>
        {/if}
      {/snippet}
    </ContextMenu.Content>
  </ContextMenu.Portal>
</ContextMenu.Root>
```

## API Reference

### ContextMenu.Root

The root component which manages & scopes the state of the context menu.

| Property               | Type                                 | Description                                                                                                        | Details |
| ---------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------ | ------- |
| `open` $bindable       | `boolean`                            | The open state of the menu.`Default: false`                                                                        |         |
| `onOpenChange`         | `function` - (open: boolean) => void | A callback function called when the open state changes.`Default:  —— undefined`                                    |         |
| `onOpenChangeComplete` | `function` - (open: boolean) => void | A callback function called after the open state changes and all animations have completed.`Default:  —— undefined` |         |
| `dir`                  | `enum` - 'ltr' \| 'rtl'              | The reading direction of the app.`Default: 'ltr'`                                                                  |         |
| `children`             | `Snippet`                            | The children content to render.`Default:  —— undefined`                                                            |         |

### ContextMenu.Trigger

The element which when right-clicked, opens the context menu.

| Property        | Type                                                                  | Description                                                                                                                                   | Details |
| --------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `disabled`      | `boolean`                                                             | Whether or not the menu trigger is disabled.`Default: false`                                                                                  |         |
| `ref` $bindable | `HTMLDivElement`                                                      | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`      | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`         | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute              | Value                       | Description                                                               | Details |
| --------------------------- | --------------------------- | ------------------------------------------------------------------------- | ------- |
| `data-state`                | `enum` - 'open' \| 'closed' | The open state of the menu or submenu the element controls or belongs to. |         |
| `data-context-menu-trigger` | `''`                        | Present on the trigger element.                                           |         |

### ContextMenu.Portal

A component that portals the content of the dropdown menu to the body or a custom target (if provided).

| Property   | Type                        | Description                                                                                                                      | Details |
| ---------- | --------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `to`       | `union` - Element \| string | Where to render the content when it is open. Defaults to the body.`Default: document.body`                                       |         |
| `disabled` | `boolean`                   | Whether the portal is disabled or not. When disabled, the content will be rendered in its original DOM location.`Default: false` |         |
| `children` | `Snippet`                   | The children content to render.`Default:  —— undefined`                                                                          |         |

### ContextMenu.Content

The content displayed when the context menu is open.

| Property                       | Type                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Description                                                                                                                                                                                                                                                                                                                                                                                                                          | Details |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| `alignOffset`                  | `number`                                                                                                                                                                                                                                                                                                                                                                                                                                                | The distance in pixels from the anchor to the floating element.`Default: 0`                                                                                                                                                                                                                                                                                                                                                          |         |
| `arrowPadding`                 | `number`                                                                                                                                                                                                                                                                                                                                                                                                                                                | The amount in pixels of virtual padding around the viewport edges to check for overflow which will cause a collision.`Default: 0`                                                                                                                                                                                                                                                                                                    |         |
| `avoidCollisions`              | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                               | When `true`, overrides the `side` and `align` options to prevent collisions with the boundary edges.`Default: true`                                                                                                                                                                                                                                                                                                                  |         |
| `collisionBoundary`            | `union` - Element \| null                                                                                                                                                                                                                                                                                                                                                                                                                               | A boundary element or array of elements to check for collisions against.`Default:  —— undefined`                                                                                                                                                                                                                                                                                                                                     |         |
| `collisionPadding`             | `union` - number \| Partial\<Record\<Side, number>>                                                                                                                                                                                                                                                                                                                                                                                                     | The amount in pixels of virtual padding around the viewport edges to check for overflow which will cause a collision.`Default: 0`                                                                                                                                                                                                                                                                                                    |         |
| `sticky`                       | `enum` - 'partial' \| 'always'                                                                                                                                                                                                                                                                                                                                                                                                                          | The sticky behavior on the align axis. `'partial'` will keep the content in the boundary as long as the trigger is at least partially in the boundary whilst `'always'` will keep the content in the boundary regardless.`Default: 'partial'`                                                                                                                                                                                        |         |
| `hideWhenDetached`             | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                               | When `true`, hides the content when it is detached from the DOM. This is useful for when you want to hide the content when the user scrolls away.`Default: true`                                                                                                                                                                                                                                                                     |         |
| `updatePositionStrategy`       | `enum` - 'optimized' \| 'always'                                                                                                                                                                                                                                                                                                                                                                                                                        | The strategy to use when updating the position of the content. When `'optimized'` the content will only be repositioned when the trigger is in the viewport. When `'always'` the content will be repositioned whenever the position changes.`Default: 'optimized'`                                                                                                                                                                   |         |
| `strategy`                     | `enum` - 'fixed' \| 'absolute'                                                                                                                                                                                                                                                                                                                                                                                                                          | The positioning strategy to use for the floating element. When `'fixed'` the element will be positioned relative to the viewport. When `'absolute'` the element will be positioned relative to the nearest positioned ancestor.`Default: 'fixed'`                                                                                                                                                                                    |         |
| `preventScroll`                | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                               | When `true`, prevents the body from scrolling when the content is open. This is useful when you want to use the content as a modal.`Default: true`                                                                                                                                                                                                                                                                                   |         |
| `customAnchor`                 | `union` - string \| HTMLElement \| Measurable \| null                                                                                                                                                                                                                                                                                                                                                                                                   | Use an element other than the trigger to anchor the content to. If provided, the content will be anchored to the provided element instead of the trigger.`Default: null`                                                                                                                                                                                                                                                             |         |
| `onEscapeKeydown`              | `function` - (event: KeyboardEvent) => void                                                                                                                                                                                                                                                                                                                                                                                                             | Callback fired when an escape keydown event occurs in the floating content. You can call `event.preventDefault()` to prevent the default behavior of handling the escape keydown event.`Default:  —— undefined`                                                                                                                                                                                                                      |         |
| `escapeKeydownBehavior`        | `enum` - 'close' \| 'ignore' \| 'defer-otherwise-close' \| 'defer-otherwise-ignore'                                                                                                                                                                                                                                                                                                                                                                     | The behavior to use when an escape keydown event occurs in the floating content. `'close'` will close the content immediately. `'ignore'` will prevent the content from closing. `'defer-otherwise-close'` will defer to the parent element if it exists, otherwise it will close the content. `'defer-otherwise-ignore'` will defer to the parent element if it exists, otherwise it will ignore the interaction.`Default: 'close'` |         |
| `onInteractOutside`            | `function` - (event: PointerEvent) => void                                                                                                                                                                                                                                                                                                                                                                                                              | Callback fired when an outside interaction event occurs, which is a `pointerdown` event. You can call `event.preventDefault()` to prevent the default behavior of handling the outside interaction.`Default:  —— undefined`                                                                                                                                                                                                          |         |
| `onFocusOutside`               | `function` - (event: FocusEvent) => void                                                                                                                                                                                                                                                                                                                                                                                                                | Callback fired when focus leaves the dismissible layer. You can call `event.preventDefault()` to prevent the default behavior on focus leaving the layer.`Default:  —— undefined`                                                                                                                                                                                                                                                    |         |
| `interactOutsideBehavior`      | `enum` - 'close' \| 'ignore' \| 'defer-otherwise-close' \| 'defer-otherwise-ignore'                                                                                                                                                                                                                                                                                                                                                                     | The behavior to use when an interaction occurs outside of the floating content. `'close'` will close the content immediately. `'ignore'` will prevent the content from closing. `'defer-otherwise-close'` will defer to the parent element if it exists, otherwise it will close the content. `'defer-otherwise-ignore'` will defer to the parent element if it exists, otherwise it will ignore the interaction.`Default: 'close'`  |         |
| `onOpenAutoFocus`              | `function` - (event: Event) => void                                                                                                                                                                                                                                                                                                                                                                                                                     | Event handler called when auto-focusing the content as it is opened. Can be prevented.`Default:  —— undefined`                                                                                                                                                                                                                                                                                                                       |         |
| `onCloseAutoFocus`             | `function` - (event: Event) => void                                                                                                                                                                                                                                                                                                                                                                                                                     | Event handler called when auto-focusing the content as it is closed. Can be prevented.`Default:  —— undefined`                                                                                                                                                                                                                                                                                                                       |         |
| `trapFocus`                    | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                               | Whether or not to trap the focus within the content when open.`Default: true`                                                                                                                                                                                                                                                                                                                                                        |         |
| `preventOverflowTextSelection` | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                               | When `true`, prevents the text selection from overflowing the bounds of the element.`Default: true`                                                                                                                                                                                                                                                                                                                                  |         |
| `dir`                          | `enum` - 'ltr' \| 'rtl'                                                                                                                                                                                                                                                                                                                                                                                                                                 | The reading direction of the app.`Default: 'ltr'`                                                                                                                                                                                                                                                                                                                                                                                    |         |
| `forceMount`                   | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                               | Whether or not to forcefully mount the content. This is useful if you want to use Svelte transitions or another animation library for the content.`Default: false`                                                                                                                                                                                                                                                                   |         |
| `loop`                         | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                               | Whether or not the context menu should loop through items when reaching the end.`Default: false`                                                                                                                                                                                                                                                                                                                                     |         |
| `ref` $bindable                | `HTMLDivElement`                                                                                                                                                                                                                                                                                                                                                                                                                                        | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                                                                                                                                                                                                                                                                                                                    |         |
| `children`                     | `Snippet`                                                                                                                                                                                                                                                                                                                                                                                                                                               | The children content to render.`Default:  —— undefined`                                                                                                                                                                                                                                                                                                                                                                              |         |
| `child`                        | `Snippet` - type ChildSnippetProps = { /\*\* \* Props for the positioning wrapper \* Do not style this element - \* styling should be applied to the content element \*/ wrapperProps: Record\<string, unknown>; /\*\* \* Props for your content element \* Apply your custom styles here \*/ props: Record\<string, unknown>; /\*\* \* Content visibility state \* Use this for conditional rendering with \* Svelte transitions \*/ open: boolean; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined`                                                                                                                                                                                                                                                                                        |         |

| Data Attribute              | Value                       | Description                                                               | Details |
| --------------------------- | --------------------------- | ------------------------------------------------------------------------- | ------- |
| `data-state`                | `enum` - 'open' \| 'closed' | The open state of the menu or submenu the element controls or belongs to. |         |
| `data-context-menu-content` | `''`                        | Present on the content element.                                           |         |

| CSS Variable                                   | Description                                  | Details |
| ---------------------------------------------- | -------------------------------------------- | ------- |
| `--bits-context-menu-content-transform-origin` | The transform origin of the content element. |         |
| `--bits-context-menu-content-available-width`  | The available width of the content element.  |         |
| `--bits-context-menu-content-available-height` | The available height of the content element. |         |
| `--bits-context-menu-anchor-width`             | The width of the anchor element.             |         |
| `--bits-context-menu-anchor-height`            | The height of the anchor element.            |         |

### ContextMenu.ContentStatic

The content displayed when the context menu is open. (Static/No Floating UI)

| Property                       | Type                                                                                | Description                                                                                                                                                                                                                                                                                                                                                                                                                          | Details |
| ------------------------------ | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| `onEscapeKeydown`              | `function` - (event: KeyboardEvent) => void                                         | Callback fired when an escape keydown event occurs in the floating content. You can call `event.preventDefault()` to prevent the default behavior of handling the escape keydown event.`Default:  —— undefined`                                                                                                                                                                                                                      |         |
| `escapeKeydownBehavior`        | `enum` - 'close' \| 'ignore' \| 'defer-otherwise-close' \| 'defer-otherwise-ignore' | The behavior to use when an escape keydown event occurs in the floating content. `'close'` will close the content immediately. `'ignore'` will prevent the content from closing. `'defer-otherwise-close'` will defer to the parent element if it exists, otherwise it will close the content. `'defer-otherwise-ignore'` will defer to the parent element if it exists, otherwise it will ignore the interaction.`Default: 'close'` |         |
| `onInteractOutside`            | `function` - (event: PointerEvent) => void                                          | Callback fired when an outside interaction event occurs, which is a `pointerdown` event. You can call `event.preventDefault()` to prevent the default behavior of handling the outside interaction.`Default:  —— undefined`                                                                                                                                                                                                          |         |
| `onFocusOutside`               | `function` - (event: FocusEvent) => void                                            | Callback fired when focus leaves the dismissible layer. You can call `event.preventDefault()` to prevent the default behavior on focus leaving the layer.`Default:  —— undefined`                                                                                                                                                                                                                                                    |         |
| `interactOutsideBehavior`      | `enum` - 'close' \| 'ignore' \| 'defer-otherwise-close' \| 'defer-otherwise-ignore' | The behavior to use when an interaction occurs outside of the floating content. `'close'` will close the content immediately. `'ignore'` will prevent the content from closing. `'defer-otherwise-close'` will defer to the parent element if it exists, otherwise it will close the content. `'defer-otherwise-ignore'` will defer to the parent element if it exists, otherwise it will ignore the interaction.`Default: 'close'`  |         |
| `onOpenAutoFocus`              | `function` - (event: Event) => void                                                 | Event handler called when auto-focusing the content as it is opened. Can be prevented.`Default:  —— undefined`                                                                                                                                                                                                                                                                                                                       |         |
| `onCloseAutoFocus`             | `function` - (event: Event) => void                                                 | Event handler called when auto-focusing the content as it is closed. Can be prevented.`Default:  —— undefined`                                                                                                                                                                                                                                                                                                                       |         |
| `trapFocus`                    | `boolean`                                                                           | Whether or not to trap the focus within the content when open.`Default: true`                                                                                                                                                                                                                                                                                                                                                        |         |
| `preventScroll`                | `boolean`                                                                           | When `true`, prevents the body from scrolling when the content is open. This is useful when you want to use the content as a modal.`Default: true`                                                                                                                                                                                                                                                                                   |         |
| `preventOverflowTextSelection` | `boolean`                                                                           | When `true`, prevents the text selection from overflowing the bounds of the element.`Default: true`                                                                                                                                                                                                                                                                                                                                  |         |
| `dir`                          | `enum` - 'ltr' \| 'rtl'                                                             | The reading direction of the app.`Default: 'ltr'`                                                                                                                                                                                                                                                                                                                                                                                    |         |
| `forceMount`                   | `boolean`                                                                           | Whether or not to forcefully mount the content. This is useful if you want to use Svelte transitions or another animation library for the content.`Default: false`                                                                                                                                                                                                                                                                   |         |
| `loop`                         | `boolean`                                                                           | Whether or not the context menu should loop through items when reaching the end.`Default: false`                                                                                                                                                                                                                                                                                                                                     |         |
| `ref` $bindable                | `HTMLDivElement`                                                                    | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                                                                                                                                                                                                                                                                                                                    |         |
| `children`                     | `Snippet`                                                                           | The children content to render.`Default:  —— undefined`                                                                                                                                                                                                                                                                                                                                                                              |         |
| `child`                        | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; };               | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined`                                                                                                                                                                                                                                                                                        |         |

| Data Attribute              | Value                       | Description                                                               | Details |
| --------------------------- | --------------------------- | ------------------------------------------------------------------------- | ------- |
| `data-state`                | `enum` - 'open' \| 'closed' | The open state of the menu or submenu the element controls or belongs to. |         |
| `data-context-menu-content` | `''`                        | Present on the content element.                                           |         |

### ContextMenu.Item

A menu item within the context menu.

| Property        | Type                                                                  | Description                                                                                                                                   | Details |
| --------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `disabled`      | `boolean`                                                             | Whether or not the menu item is disabled.`Default: false`                                                                                     |         |
| `textValue`     | `string`                                                              | The text value of the checkbox menu item. This is used for typeahead.`Default:  —— undefined`                                                 |         |
| `onSelect`      | `function` - () => void                                               | A callback that is fired when the menu item is selected.`Default:  —— undefined`                                                              |         |
| `closeOnSelect` | `boolean`                                                             | Whether or not the menu item should close when selected.`Default: true`                                                                       |         |
| `ref` $bindable | `HTMLDivElement`                                                      | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`      | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`         | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute           | Value      | Description                                | Details |
| ------------------------ | ---------- | ------------------------------------------ | ------- |
| `data-orientation`       | `vertical` | The orientation of the menu.               |         |
| `data-highlighted`       | `''`       | Present when the menu item is highlighted. |         |
| `data-disabled`          | `''`       | Present when the menu item is disabled.    |         |
| `data-context-menu-item` | `''`       | Present on the item element.               |         |

### ContextMenu.CheckboxGroup

A group of checkbox menu items, where multiple can be checked at a time.

| Property          | Type                                                                  | Description                                                                                                                                   | Details |
| ----------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `value` $bindable | `string[]`                                                            | The value of the group. This is an array of the values of the checked checkboxes within the group.`Default: []`                               |         |
| `onValueChange`   | `function` - (value: string\[]) => void                               | A callback that is fired when the checkbox group's value state changes.`Default:  —— undefined`                                               |         |
| `ref` $bindable   | `HTMLDivElement`                                                      | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`        | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`           | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute                     | Value | Description                            | Details |
| ---------------------------------- | ----- | -------------------------------------- | ------- |
| `data-context-menu-checkbox-group` | `''`  | Present on the checkbox group element. |         |

### ContextMenu.CheckboxItem

A menu item that can be controlled and toggled like a checkbox.

| Property                  | Type                                                                                                                 | Description                                                                                                                                                    | Details |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `disabled`                | `boolean`                                                                                                            | Whether or not the checkbox menu item is disabled. Disabled items cannot be interacted with and are skipped when navigating with the keyboard.`Default: false` |         |
| `checked` $bindable       | `boolean`                                                                                                            | The checked state of the checkbox.`Default: false`                                                                                                             |         |
| `onCheckedChange`         | `function` - (checked: boolean) => void                                                                              | A callback that is fired when the checked state changes.`Default:  —— undefined`                                                                               |         |
| `indeterminate` $bindable | `boolean`                                                                                                            | The indeterminate state of the checkbox.`Default: false`                                                                                                       |         |
| `onIndeterminateChange`   | `function` - (indeterminate: boolean) => void                                                                        | A callback that is fired when the indeterminate state changes.`Default:  —— undefined`                                                                         |         |
| `value`                   | `string`                                                                                                             | The value of the checkbox item when used in a `*Menu.CheckboxGroup`.`Default:  —— undefined`                                                                   |         |
| `textValue`               | `string`                                                                                                             | The text value of the checkbox menu item. This is used for typeahead.`Default:  —— undefined`                                                                  |         |
| `onSelect`                | `function` - () => void                                                                                              | A callback that is fired when the menu item is selected.`Default:  —— undefined`                                                                               |         |
| `closeOnSelect`           | `boolean`                                                                                                            | Whether or not the menu item should close when selected.`Default: true`                                                                                        |         |
| `ref` $bindable           | `HTMLDivElement`                                                                                                     | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                                              |         |
| `children`                | `Snippet` - type ChildrenSnippetProps = { checked: boolean; indeterminate: boolean; };                               | The children content to render.`Default:  —— undefined`                                                                                                        |         |
| `child`                   | `Snippet` - type ChildSnippetProps = { props: Record\<string, unknown>; checked: boolean; indeterminate: boolean; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined`                  |         |

| Data Attribute                    | Value                                                | Description                                | Details |
| --------------------------------- | ---------------------------------------------------- | ------------------------------------------ | ------- |
| `data-orientation`                | `vertical`                                           | The orientation of the menu.               |         |
| `data-highlighted`                | `''`                                                 | Present when the menu item is highlighted. |         |
| `data-disabled`                   | `''`                                                 | Present when the menu item is disabled.    |         |
| `data-state`                      | `enum` - 'checked' \| 'unchecked' \| 'indeterminate' | The checkbox menu item's checked state.    |         |
| `data-context-menu-checkbox-item` | `''`                                                 | Present on the checkbox item element.      |         |

### ContextMenu.RadioGroup

A group of radio menu items, where only one can be checked at a time.

| Property          | Type                                                                  | Description                                                                                                                                   | Details |
| ----------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `value` $bindable | `string`                                                              | The value of the currently checked radio menu item.`Default:  —— undefined`                                                                   |         |
| `onValueChange`   | `function` - (value: string) => void                                  | A callback that is fired when the radio group's value changes.`Default:  —— undefined`                                                        |         |
| `ref` $bindable   | `HTMLDivElement`                                                      | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`        | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`           | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute                  | Value | Description                         | Details |
| ------------------------------- | ----- | ----------------------------------- | ------- |
| `data-context-menu-radio-group` | `''`  | Present on the radio group element. |         |

### ContextMenu.RadioItem

A menu item that can be controlled and toggled like a radio button. It must be a child of a `RadioGroup`.

| Property         | Type                                                                                         | Description                                                                                                                                                 | Details |
| ---------------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `value` required | `string`                                                                                     | The value of the radio item. When checked, the parent `RadioGroup`'s value will be set to this value.`Default:  —— undefined`                               |         |
| `disabled`       | `boolean`                                                                                    | Whether or not the radio menu item is disabled. Disabled items cannot be interacted with and are skipped when navigating with the keyboard.`Default: false` |         |
| `textValue`      | `string`                                                                                     | The text value of the checkbox menu item. This is used for typeahead.`Default:  —— undefined`                                                               |         |
| `onSelect`       | `function` - () => void                                                                      | A callback that is fired when the menu item is selected.`Default:  —— undefined`                                                                            |         |
| `closeOnSelect`  | `boolean`                                                                                    | Whether or not the menu item should close when selected.`Default: true`                                                                                     |         |
| `ref` $bindable  | `HTMLDivElement`                                                                             | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                                           |         |
| `children`       | `Snippet` - type ChildrenSnippetProps = { checked: boolean; };                               | The children content to render.`Default:  —— undefined`                                                                                                     |         |
| `child`          | `Snippet` - type ChildSnippetProps = { props: Record\<string, unknown>; checked: boolean; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined`               |         |

| Data Attribute                 | Value                             | Description                                | Details |
| ------------------------------ | --------------------------------- | ------------------------------------------ | ------- |
| `data-orientation`             | `vertical`                        | The orientation of the menu.               |         |
| `data-highlighted`             | `''`                              | Present when the menu item is highlighted. |         |
| `data-disabled`                | `''`                              | Present when the menu item is disabled.    |         |
| `data-state`                   | `enum` - 'checked' \| 'unchecked' | The radio menu item's checked state.       |         |
| `data-value`                   | `''`                              | The value of the radio item.               |         |
| `data-context-menu-radio-item` | `''`                              | Present on the radio item element.         |         |

### ContextMenu.Separator

A horizontal line to visually separate menu items.

| Property        | Type                                                                  | Description                                                                                                                                   | Details |
| --------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `ref` $bindable | `HTMLDivElement`                                                      | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`      | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`         | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute                | Value      | Description                       | Details |
| ----------------------------- | ---------- | --------------------------------- | ------- |
| `data-orientation`            | `vertical` | The orientation of the separator. |         |
| `data-menu-separator`         | `''`       | Present on the separator element. |         |
| `data-context-menu-separator` | `''`       | Present on the separator element. |         |

### ContextMenu.Arrow

An optional arrow which points to the context menu's anchor/trigger point.

| Property        | Type                                                                  | Description                                                                                                                                   | Details |
| --------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `width`         | `number`                                                              | The width of the arrow in pixels.`Default: 8`                                                                                                 |         |
| `height`        | `number`                                                              | The height of the arrow in pixels.`Default: 8`                                                                                                |         |
| `ref` $bindable | `HTMLDivElement`                                                      | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`      | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`         | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute            | Value                       | Description                                                               | Details |
| ------------------------- | --------------------------- | ------------------------------------------------------------------------- | ------- |
| `data-state`              | `enum` - 'open' \| 'closed' | The open state of the menu or submenu the element controls or belongs to. |         |
| `data-context-menu-arrow` | `''`                        | Present on the arrow element.                                             |         |

### ContextMenu.Group

A group of menu items. It should be passed an `aria-label` or have a child `ContextMenu.GroupHeading` component to provide a label for a group of menu items.

| Property        | Type                                                                  | Description                                                                                                                                   | Details |
| --------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `ref` $bindable | `HTMLDivElement`                                                      | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`      | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`         | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute            | Value | Description                   | Details |
| ------------------------- | ----- | ----------------------------- | ------- |
| `data-context-menu-group` | `''`  | Present on the group element. |         |

### ContextMenu.GroupHeading

A heading for a group which will be skipped when navigating with the keyboard. It is used to provide a visual label for a group of menu items and must be a child of either a `ContextMenu.Group` or `ContextMenu.RadioGroup` component.

| Property        | Type                                                                  | Description                                                                                                                                   | Details |
| --------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `ref` $bindable | `HTMLDivElement`                                                      | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`      | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`         | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute            | Value | Description                           | Details |
| ------------------------- | ----- | ------------------------------------- | ------- |
| `data-menu-group-heading` | `''`  | Present on the group heading element. |         |

### ContextMenu.Sub

A submenu belonging to the parent context menu. Responsible for managing the state of the submenu.

| Property               | Type                                 | Description                                                                                                        | Details |
| ---------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------ | ------- |
| `open` $bindable       | `boolean`                            | The open state of the submenu.`Default: false`                                                                     |         |
| `onOpenChange`         | `function` - (open: boolean) => void | A callback function called when the open state changes.`Default:  —— undefined`                                    |         |
| `onOpenChangeComplete` | `function` - (open: boolean) => void | A callback function called after the open state changes and all animations have completed.`Default:  —— undefined` |         |
| `children`             | `Snippet`                            | The children content to render.`Default:  —— undefined`                                                            |         |

### ContextMenu.SubTrigger

A menu item which when pressed or hovered, opens the submenu it is a child of.

| Property        | Type                                                                  | Description                                                                                                                                   | Details |
| --------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `disabled`      | `boolean`                                                             | Whether or not the submenu trigger is disabled.`Default: false`                                                                               |         |
| `openDelay`     | `number`                                                              | The amount of time in ms from when the mouse enters the subtrigger until the submenu opens.`Default: 100`                                     |         |
| `textValue`     | `string`                                                              | The text value of the checkbox menu item. This is used for typeahead.`Default:  —— undefined`                                                 |         |
| `onSelect`      | `function` - () => void                                               | A callback that is fired when the menu item is selected.`Default:  —— undefined`                                                              |         |
| `ref` $bindable | `HTMLDivElement`                                                      | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`      | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`         | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute                  | Value                       | Description                                                               | Details |
| ------------------------------- | --------------------------- | ------------------------------------------------------------------------- | ------- |
| `data-orientation`              | `vertical`                  | The orientation of the menu.                                              |         |
| `data-highlighted`              | `''`                        | Present when the menu item is highlighted.                                |         |
| `data-disabled`                 | `''`                        | Present when the menu item is disabled.                                   |         |
| `data-state`                    | `enum` - 'open' \| 'closed' | The open state of the menu or submenu the element controls or belongs to. |         |
| `data-context-menu-sub-trigger` | `''`                        | Present on the submenu trigger element.                                   |         |

### ContextMenu.SubContent

The submenu content displayed when the parent submenu is open.

| Property                       | Type                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Description                                                                                                                                                                                                                                                                                                                                                                                                                          | Details |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| `side`                         | `enum` - 'top' \| 'bottom' \| 'left' \| 'right'                                                                                                                                                                                                                                                                                                                                                                                                         | The preferred side of the anchor to render the floating element against when open. Will be reversed when collisions occur.`Default: 'bottom'`                                                                                                                                                                                                                                                                                        |         |
| `sideOffset`                   | `number`                                                                                                                                                                                                                                                                                                                                                                                                                                                | The distance in pixels from the anchor to the floating element.`Default: 0`                                                                                                                                                                                                                                                                                                                                                          |         |
| `align`                        | `enum` - 'start' \| 'center' \| 'end'                                                                                                                                                                                                                                                                                                                                                                                                                   | The preferred alignment of the anchor to render the floating element against when open. This may change when collisions occur.`Default: 'start'`                                                                                                                                                                                                                                                                                     |         |
| `alignOffset`                  | `number`                                                                                                                                                                                                                                                                                                                                                                                                                                                | The distance in pixels from the anchor to the floating element.`Default: 0`                                                                                                                                                                                                                                                                                                                                                          |         |
| `arrowPadding`                 | `number`                                                                                                                                                                                                                                                                                                                                                                                                                                                | The amount in pixels of virtual padding around the viewport edges to check for overflow which will cause a collision.`Default: 0`                                                                                                                                                                                                                                                                                                    |         |
| `avoidCollisions`              | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                               | When `true`, overrides the `side` and `align` options to prevent collisions with the boundary edges.`Default: true`                                                                                                                                                                                                                                                                                                                  |         |
| `collisionBoundary`            | `union` - Element \| null                                                                                                                                                                                                                                                                                                                                                                                                                               | A boundary element or array of elements to check for collisions against.`Default:  —— undefined`                                                                                                                                                                                                                                                                                                                                     |         |
| `collisionPadding`             | `union` - number \| Partial\<Record\<Side, number>>                                                                                                                                                                                                                                                                                                                                                                                                     | The amount in pixels of virtual padding around the viewport edges to check for overflow which will cause a collision.`Default: 0`                                                                                                                                                                                                                                                                                                    |         |
| `sticky`                       | `enum` - 'partial' \| 'always'                                                                                                                                                                                                                                                                                                                                                                                                                          | The sticky behavior on the align axis. `'partial'` will keep the content in the boundary as long as the trigger is at least partially in the boundary whilst `'always'` will keep the content in the boundary regardless.`Default: 'partial'`                                                                                                                                                                                        |         |
| `hideWhenDetached`             | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                               | When `true`, hides the content when it is detached from the DOM. This is useful for when you want to hide the content when the user scrolls away.`Default: true`                                                                                                                                                                                                                                                                     |         |
| `updatePositionStrategy`       | `enum` - 'optimized' \| 'always'                                                                                                                                                                                                                                                                                                                                                                                                                        | The strategy to use when updating the position of the content. When `'optimized'` the content will only be repositioned when the trigger is in the viewport. When `'always'` the content will be repositioned whenever the position changes.`Default: 'optimized'`                                                                                                                                                                   |         |
| `strategy`                     | `enum` - 'fixed' \| 'absolute'                                                                                                                                                                                                                                                                                                                                                                                                                          | The positioning strategy to use for the floating element. When `'fixed'` the element will be positioned relative to the viewport. When `'absolute'` the element will be positioned relative to the nearest positioned ancestor.`Default: 'fixed'`                                                                                                                                                                                    |         |
| `preventScroll`                | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                               | When `true`, prevents the body from scrolling when the content is open. This is useful when you want to use the content as a modal.`Default: true`                                                                                                                                                                                                                                                                                   |         |
| `customAnchor`                 | `union` - string \| HTMLElement \| Measurable \| null                                                                                                                                                                                                                                                                                                                                                                                                   | Use an element other than the trigger to anchor the content to. If provided, the content will be anchored to the provided element instead of the trigger.`Default: null`                                                                                                                                                                                                                                                             |         |
| `onEscapeKeydown`              | `function` - (event: KeyboardEvent) => void                                                                                                                                                                                                                                                                                                                                                                                                             | Callback fired when an escape keydown event occurs in the floating content. You can call `event.preventDefault()` to prevent the default behavior of handling the escape keydown event.`Default:  —— undefined`                                                                                                                                                                                                                      |         |
| `escapeKeydownBehavior`        | `enum` - 'close' \| 'ignore' \| 'defer-otherwise-close' \| 'defer-otherwise-ignore'                                                                                                                                                                                                                                                                                                                                                                     | The behavior to use when an escape keydown event occurs in the floating content. `'close'` will close the content immediately. `'ignore'` will prevent the content from closing. `'defer-otherwise-close'` will defer to the parent element if it exists, otherwise it will close the content. `'defer-otherwise-ignore'` will defer to the parent element if it exists, otherwise it will ignore the interaction.`Default: 'close'` |         |
| `onInteractOutside`            | `function` - (event: PointerEvent) => void                                                                                                                                                                                                                                                                                                                                                                                                              | Callback fired when an outside interaction event occurs, which is a `pointerdown` event. You can call `event.preventDefault()` to prevent the default behavior of handling the outside interaction.`Default:  —— undefined`                                                                                                                                                                                                          |         |
| `onFocusOutside`               | `function` - (event: FocusEvent) => void                                                                                                                                                                                                                                                                                                                                                                                                                | Callback fired when focus leaves the dismissible layer. You can call `event.preventDefault()` to prevent the default behavior on focus leaving the layer.`Default:  —— undefined`                                                                                                                                                                                                                                                    |         |
| `interactOutsideBehavior`      | `enum` - 'close' \| 'ignore' \| 'defer-otherwise-close' \| 'defer-otherwise-ignore'                                                                                                                                                                                                                                                                                                                                                                     | The behavior to use when an interaction occurs outside of the floating content. `'close'` will close the content immediately. `'ignore'` will prevent the content from closing. `'defer-otherwise-close'` will defer to the parent element if it exists, otherwise it will close the content. `'defer-otherwise-ignore'` will defer to the parent element if it exists, otherwise it will ignore the interaction.`Default: 'close'`  |         |
| `onOpenAutoFocus`              | `function` - (event: Event) => void                                                                                                                                                                                                                                                                                                                                                                                                                     | Event handler called when auto-focusing the content as it is opened. Can be prevented.`Default:  —— undefined`                                                                                                                                                                                                                                                                                                                       |         |
| `onCloseAutoFocus`             | `function` - (event: Event) => void                                                                                                                                                                                                                                                                                                                                                                                                                     | Event handler called when auto-focusing the content as it is closed. Can be prevented.`Default:  —— undefined`                                                                                                                                                                                                                                                                                                                       |         |
| `trapFocus`                    | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                               | Whether or not to trap the focus within the content when open.`Default: true`                                                                                                                                                                                                                                                                                                                                                        |         |
| `forceMount`                   | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                               | Whether or not to forcefully mount the content. This is useful if you want to use Svelte transitions or another animation library for the content.`Default: false`                                                                                                                                                                                                                                                                   |         |
| `preventOverflowTextSelection` | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                               | When `true`, prevents the text selection from overflowing the bounds of the element.`Default: true`                                                                                                                                                                                                                                                                                                                                  |         |
| `dir`                          | `enum` - 'ltr' \| 'rtl'                                                                                                                                                                                                                                                                                                                                                                                                                                 | The reading direction of the app.`Default: 'ltr'`                                                                                                                                                                                                                                                                                                                                                                                    |         |
| `loop`                         | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                               | Whether or not to loop through the menu items in when navigating with the keyboard.`Default: false`                                                                                                                                                                                                                                                                                                                                  |         |
| `ref` $bindable                | `HTMLDivElement`                                                                                                                                                                                                                                                                                                                                                                                                                                        | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                                                                                                                                                                                                                                                                                                                    |         |
| `children`                     | `Snippet`                                                                                                                                                                                                                                                                                                                                                                                                                                               | The children content to render.`Default:  —— undefined`                                                                                                                                                                                                                                                                                                                                                                              |         |
| `child`                        | `Snippet` - type ChildSnippetProps = { /\*\* \* Props for the positioning wrapper \* Do not style this element - \* styling should be applied to the content element \*/ wrapperProps: Record\<string, unknown>; /\*\* \* Props for your content element \* Apply your custom styles here \*/ props: Record\<string, unknown>; /\*\* \* Content visibility state \* Use this for conditional rendering with \* Svelte transitions \*/ open: boolean; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined`                                                                                                                                                                                                                                                                                        |         |

| Data Attribute                  | Value                       | Description                                                               | Details |
| ------------------------------- | --------------------------- | ------------------------------------------------------------------------- | ------- |
| `data-state`                    | `enum` - 'open' \| 'closed' | The open state of the menu or submenu the element controls or belongs to. |         |
| `data-context-menu-sub-content` | `''`                        | Present on the submenu content element.                                   |         |

### ContextMenu.SubContentStatic

The submenu content displayed when the parent submenu menu is open. (Static/No Floating UI)

| Property                       | Type                                                                                      | Description                                                                                                                                                                                                                                                                                                                                                                                                                          | Details |
| ------------------------------ | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| `onEscapeKeydown`              | `function` - (event: KeyboardEvent) => void                                               | Callback fired when an escape keydown event occurs in the floating content. You can call `event.preventDefault()` to prevent the default behavior of handling the escape keydown event.`Default:  —— undefined`                                                                                                                                                                                                                      |         |
| `escapeKeydownBehavior`        | `enum` - 'close' \| 'ignore' \| 'defer-otherwise-close' \| 'defer-otherwise-ignore'       | The behavior to use when an escape keydown event occurs in the floating content. `'close'` will close the content immediately. `'ignore'` will prevent the content from closing. `'defer-otherwise-close'` will defer to the parent element if it exists, otherwise it will close the content. `'defer-otherwise-ignore'` will defer to the parent element if it exists, otherwise it will ignore the interaction.`Default: 'close'` |         |
| `onInteractOutside`            | `function` - (event: PointerEvent) => void                                                | Callback fired when an outside interaction event occurs, which is a `pointerdown` event. You can call `event.preventDefault()` to prevent the default behavior of handling the outside interaction.`Default:  —— undefined`                                                                                                                                                                                                          |         |
| `onFocusOutside`               | `function` - (event: FocusEvent) => void                                                  | Callback fired when focus leaves the dismissible layer. You can call `event.preventDefault()` to prevent the default behavior on focus leaving the layer.`Default:  —— undefined`                                                                                                                                                                                                                                                    |         |
| `interactOutsideBehavior`      | `enum` - 'close' \| 'ignore' \| 'defer-otherwise-close' \| 'defer-otherwise-ignore'       | The behavior to use when an interaction occurs outside of the floating content. `'close'` will close the content immediately. `'ignore'` will prevent the content from closing. `'defer-otherwise-close'` will defer to the parent element if it exists, otherwise it will close the content. `'defer-otherwise-ignore'` will defer to the parent element if it exists, otherwise it will ignore the interaction.`Default: 'close'`  |         |
| `onOpenAutoFocus`              | `function` - (event: Event) => void                                                       | Event handler called when auto-focusing the content as it is opened. Can be prevented.`Default:  —— undefined`                                                                                                                                                                                                                                                                                                                       |         |
| `onCloseAutoFocus`             | `function` - (event: Event) => void                                                       | Event handler called when auto-focusing the content as it is closed. Can be prevented.`Default:  —— undefined`                                                                                                                                                                                                                                                                                                                       |         |
| `trapFocus`                    | `boolean`                                                                                 | Whether or not to trap the focus within the content when open.`Default: true`                                                                                                                                                                                                                                                                                                                                                        |         |
| `forceMount`                   | `boolean`                                                                                 | Whether or not to forcefully mount the content. This is useful if you want to use Svelte transitions or another animation library for the content.`Default: false`                                                                                                                                                                                                                                                                   |         |
| `preventOverflowTextSelection` | `boolean`                                                                                 | When `true`, prevents the text selection from overflowing the bounds of the element.`Default: true`                                                                                                                                                                                                                                                                                                                                  |         |
| `dir`                          | `enum` - 'ltr' \| 'rtl'                                                                   | The reading direction of the app.`Default: 'ltr'`                                                                                                                                                                                                                                                                                                                                                                                    |         |
| `loop`                         | `boolean`                                                                                 | Whether or not to loop through the menu items when reaching the end of the list when using the keyboard.`Default: true`                                                                                                                                                                                                                                                                                                              |         |
| `ref` $bindable                | `HTMLDivElement`                                                                          | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                                                                                                                                                                                                                                                                                                                    |         |
| `children`                     | `Snippet`                                                                                 | The children content to render.`Default:  —— undefined`                                                                                                                                                                                                                                                                                                                                                                              |         |
| `child`                        | `Snippet` - type ChildSnippetProps = { open: boolean; props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined`                                                                                                                                                                                                                                                                                        |         |

| Data Attribute                  | Value                       | Description                                                               | Details |
| ------------------------------- | --------------------------- | ------------------------------------------------------------------------- | ------- |
| `data-state`                    | `enum` - 'open' \| 'closed' | The open state of the menu or submenu the element controls or belongs to. |         |
| `data-context-menu-sub-content` | `''`                        | Present on the submenu content element.                                   |         |

[Previous Command](/docs/components/command) [Next Date Field](/docs/components/date-field)