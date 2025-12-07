# Menubar Documentation

A horizontal bar containing a collection of menus.

This is a documentation section that potentially contains examples, demos, and other useful information related to a specific part of Bits UI. When helping users with this documentation, you can ignore the classnames applied to the demos unless they are relevant to the user's issue.

Copy Page

```svelte
<script lang="ts">
  import { Menubar } from "bits-ui";
  import CaretRight from "phosphor-svelte/lib/CaretRight";
  import Cat from "phosphor-svelte/lib/Cat";
  import Check from "phosphor-svelte/lib/Check";
  let selectedView = $state("table");
  let selectedProfile = $state("pavel");
  let grids = $state([
    {
      checked: true,
      label: "Pixel"
    },
    {
      checked: false,
      label: "Layout"
    }
  ]);
  let showConfigs = $state([
    {
      checked: true,
      label: "Show Bookmarks"
    },
    {
      checked: false,
      label: "Show Full URLs"
    }
  ]);
  const profiles = [
    {
      value: "hunter",
      label: "Hunter"
    },
    {
      value: "pavel",
      label: "Pavel"
    },
    {
      value: "adrian",
      label: "Adrian"
    }
  ];
  const views = [
    {
      value: "table",
      label: "Table"
    },
    {
      value: "board",
      label: "Board"
    },
    {
      value: "gallery",
      label: "Gallery"
    }
  ];
</script>
<Menubar.Root
  class="rounded-10px border-dark-10 bg-background-alt shadow-mini flex h-12 items-center gap-1 border px-[3px]"
>
  <div class="px-2.5">
    <Cat class="size-6" />
  </div>
  <Menubar.Menu>
    <Menubar.Trigger
      class="rounded-9px data-highlighted:bg-muted data-[state=open]:bg-muted inline-flex h-10 cursor-default items-center justify-center px-3 text-sm font-medium focus-visible:outline-none"
    >
      File
    </Menubar.Trigger>
    <Menubar.Portal>
      <Menubar.Content
        class="focus-override border-muted bg-background  shadow-popover focus-visible:outline-hidden z-50 w-fit rounded-xl border px-1 py-1.5"
        align="start"
        sideOffset={3}
      >
        {#each grids as grid (grid.label)}
          <Menubar.CheckboxItem
            class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center gap-3 py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
            bind:checked={grid.checked}
          >
            {#snippet children({ checked })}
              {grid.label} grid
              <div class="ml-auto flex items-center">
                {#if checked}
                  {@render SwitchOn()}
                {:else}
                  {@render SwitchOff()}
                {/if}
              </div>
            {/snippet}
          </Menubar.CheckboxItem>
        {/each}
        <Menubar.Separator class="bg-muted my-1 -ml-1 -mr-1 block h-px" />
        <Menubar.RadioGroup bind:value={selectedView}>
          {#each views as view, i (view.label + i)}
            <Menubar.RadioItem
              value={view.value}
              class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center gap-2 py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
            >
              {#snippet children({ checked })}
                {view.label}
                <div class="ml-auto size-5">
                  {#if checked}
                    <Check class="size-5" />
                  {/if}
                </div>
              {/snippet}
            </Menubar.RadioItem>
          {/each}
        </Menubar.RadioGroup>
      </Menubar.Content>
    </Menubar.Portal>
  </Menubar.Menu>
  <Menubar.Menu>
    <Menubar.Trigger
      class="data-highlighted:bg-muted data-[state=open]:bg-muted inline-flex h-10 cursor-default items-center justify-center rounded-[9px] px-3 text-sm font-medium focus-visible:outline-none"
    >
      Edit
    </Menubar.Trigger>
    <Menubar.Portal>
      <Menubar.Content
        class="focus-override border-muted bg-background shadow-popover focus-visible:outline-hidden z-50 w-full rounded-xl border px-1 py-1.5"
        align="start"
        sideOffset={3}
      >
        <Menubar.Item
          class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
        >
          Undo
        </Menubar.Item>
        <Menubar.Item
          class="rounded-button data-highlighted:bg-muted flex h-10 min-w-[130px] select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
        >
          Redo
        </Menubar.Item>
        <Menubar.Separator />
        <Menubar.Sub>
          <Menubar.SubTrigger
            class="rounded-button data-highlighted:bg-muted data-[state=open]:bg-muted flex h-10 select-none items-center gap-3 py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
          >
            Find
            <div class="ml-auto flex items-center">
              <CaretRight class="text-foreground-alt h-4 w-4" />
            </div>
          </Menubar.SubTrigger>
          <Menubar.SubContent
            class="focus-override border-muted bg-background shadow-popover focus-visible:outline-hidden w-full max-w-[209px] rounded-xl border px-1 py-1.5"
          >
            <Menubar.Item
              class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
            >
              Search the web
            </Menubar.Item>
            <Menubar.Separator />
            <Menubar.Item
              class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
            >
              Find...
            </Menubar.Item>
            <Menubar.Item
              class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
            >
              Find Next
            </Menubar.Item>
            <Menubar.Item
              class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
            >
              Find Previous
            </Menubar.Item>
          </Menubar.SubContent>
        </Menubar.Sub>
        <Menubar.Separator />
        <Menubar.Item
          class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
        >
          Cut
        </Menubar.Item>
        <Menubar.Item
          class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
        >
          Copy
        </Menubar.Item>
        <Menubar.Item
          class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
        >
          Paste
        </Menubar.Item>
      </Menubar.Content>
    </Menubar.Portal>
  </Menubar.Menu>
  <Menubar.Menu>
    <Menubar.Trigger
      class="rounded-9px data-highlighted:bg-muted data-[state=open]:bg-muted inline-flex h-10 cursor-default items-center justify-center px-3 text-sm font-medium focus-visible:outline-none"
    >
      View
    </Menubar.Trigger>
    <Menubar.Portal>
      <Menubar.Content
        class="focus-override border-muted bg-background shadow-popover focus-visible:outline-hidden z-50 w-full max-w-[220px] rounded-xl border px-1 py-1.5"
        align="start"
        sideOffset={3}
      >
        {#each showConfigs as config, i (config.label + i)}
          <Menubar.CheckboxItem
            class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center gap-3 py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
            bind:checked={config.checked}
          >
            {#snippet children({ checked })}
              {config.label}
              <div class="ml-auto flex items-center">
                {#if checked}
                  {@render SwitchOn()}
                {:else}
                  {@render SwitchOff()}
                {/if}
              </div>
            {/snippet}
          </Menubar.CheckboxItem>
        {/each}
        <Menubar.Separator />
        <Menubar.Item
          class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
        >
          Reload
        </Menubar.Item>
        <Menubar.Item
          class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
        >
          Force Reload
        </Menubar.Item>
        <Menubar.Separator />
        <Menubar.Item
          class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
        >
          Toggle Fullscreen
        </Menubar.Item>
        <Menubar.Separator />
        <Menubar.Item
          class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
        >
          Hide Sidebar
        </Menubar.Item>
      </Menubar.Content>
    </Menubar.Portal>
  </Menubar.Menu>
  <Menubar.Menu>
    <Menubar.Trigger
      class="data-highlighted:bg-muted data-[state=open]:bg-muted mr-[20px] inline-flex h-10 cursor-default items-center justify-center rounded-[9px] px-3 text-sm font-medium focus-visible:outline-none"
    >
      Profiles
    </Menubar.Trigger>
    <Menubar.Portal>
      <Menubar.Content
        class="focus-override border-muted bg-background shadow-popover focus-visible:outline-hidden z-50 w-full max-w-[220px] rounded-xl border px-1 py-1.5"
        align="start"
        sideOffset={3}
      >
        <Menubar.RadioGroup bind:value={selectedProfile}>
          {#each profiles as profile, i (profile.label + i)}
            <Menubar.RadioItem
              class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
              value={profile.value}
            >
              {#snippet children({ checked })}
                {profile.label}
                <div class="ml-auto flex items-center">
                  {#if checked}
                    <Check class="size-5" />
                  {/if}
                </div>
              {/snippet}
            </Menubar.RadioItem>
          {/each}
        </Menubar.RadioGroup>
        <Menubar.Separator />
        <Menubar.Item
          class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
          >Edit...</Menubar.Item
        >
        <Menubar.Separator />
        <Menubar.Item
          class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
          >Add Profile...</Menubar.Item
        >
      </Menubar.Content>
    </Menubar.Portal>
  </Menubar.Menu>
</Menubar.Root>
{#snippet SwitchOn()}
  <div
    class="bg-dark-10 peer inline-flex h-[15.6px] min-h-[15.6px] w-[26px] shrink-0 items-center rounded-full px-[1.5px]"
  >
    <span
      class="bg-background dark:border-border-input dark:shadow-mini pointer-events-none block size-[13px] shrink-0 translate-x-[10px] rounded-full"
    ></span>
  </div>
{/snippet}
{#snippet SwitchOff()}
  <div
    class="bg-dark-10 shadow-mini-inset peer inline-flex h-[15.6px] w-[26px] shrink-0 items-center rounded-full px-[3px] transition-colors"
  >
    <span
      class="bg-background shadow-mini dark:border-border-input dark:shadow-mini pointer-events-none block size-[13px] shrink-0 translate-x-0 rounded-full transition-transform dark:border"
    ></span>
  </div>
{/snippet}
```

## Structure

```svelte
<script lang="ts">
  import { Menubar } from "bits-ui";
</script>
<Menubar.Root>
  <Menubar.Menu>
    <Menubar.Trigger />
    <Menubar.Portal>
      <Menubar.Content>
        <Menubar.Group>
          <Menubar.GroupHeading />
          <Menubar.Item />
        </Menubar.Group>
        <Menubar.Item />
        <Menubar.CheckboxItem>
          {#snippet children({ checked })}
            {checked ? "✅" : ""}
          {/snippet}
        </Menubar.CheckboxItem>
        <Menubar.RadioGroup>
          <Menubar.GroupHeading />
          <Menubar.RadioItem>
            {#snippet children({ checked })}
              {checked ? "✅" : ""}
            {/snippet}
          </Menubar.RadioItem>
        </Menubar.RadioGroup>
        <Menubar.Sub>
          <Menubar.SubTrigger />
          <Menubar.SubContent />
        </Menubar.Sub>
        <Menubar.Separator />
        <Menubar.Arrow />
      </Menubar.Content>
    </Menubar.Portal>
  </Menubar.Menu>
</Menubar.Root>
```

## Reusable Components

If you're planning to use Menubar in multiple places, you can create reusable components that wrap the different parts of the Menubar.

In the following example, we're creating a reusable `MyMenubarMenu` component that contains the trigger, content, and items of a menu.

MyMenubarMenu.svelte

```svelte
<script lang="ts">
  import { Menubar, type WithoutChildrenOrChild } from "bits-ui";
  type Props = WithoutChildrenOrChild<Menubar.MenuProps> & {
    triggerText: string;
    items: { label: string; value: string; onSelect?: () => void }[];
    contentProps?: WithoutChildrenOrChild<Menubar.ContentProps>;
    // other component props if needed
  };
  let { triggerText, items, contentProps, ...restProps }: Props = $props();
</script>
<Menubar.Menu {...restProps}>
  <Menubar.Trigger>
    {triggerText}
  </Menubar.Trigger>
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

Now, we can use the `MyMenubarMenu` component within a `Menubar.Root` component to render out the various menus.

```svelte
<script lang="ts">
  import { Menubar } from "bits-ui";
  import MyMenubarMenu from "./MyMenubarMenu.svelte";
  const sales = [
    { label: "Michael Scott", value: "michael" },
    { label: "Dwight Schrute", value: "dwight" },
    { label: "Jim Halpert", value: "jim" },
    { label: "Stanley Hudson", value: "stanley" },
    { label: "Phyllis Vance", value: "phyllis" },
    { label: "Pam Beesly", value: "pam" },
    { label: "Andy Bernard", value: "andy" },
  ];
  const hr = [
    { label: "Toby Flenderson", value: "toby" },
    { label: "Holly Flax", value: "holly" },
    { label: "Jan Levinson", value: "jan" },
  ];
  const accounting = [
    { label: "Angela Martin", value: "angela" },
    { label: "Kevin Malone", value: "kevin" },
    { label: "Oscar Martinez", value: "oscar" },
  ];
  const menubarMenus = [
    { title: "Sales", items: sales },
    { title: "HR", items: hr },
    { title: "Accounting", items: accounting },
  ];
</script>
<Menubar.Root>
  {#each menubarMenus as { title, items }}
    <CustomMenubar triggerText={title} {items} />
  {/each}
</Menubar.Root>
```

## Managing Value State

This section covers how to manage the `value` state of the menubar.

### Two-Way Binding

Use `bind:value` for simple, automatic state synchronization:

```svelte
<script lang="ts">
  import { Menubar } from "bits-ui";
  let activeValue = $state("");
</script>
<button onclick={() => (activeValue = "menu-1")}>Open Menubar Menu</button>
<Menubar.Root bind:value={activeValue}>
  <Menubar.Menu value="menu-1">
    <!-- ... -->
  </Menubar.Menu>
  <Menubar.Menu value="menu-2">
    <!-- ... -->
  </Menubar.Menu>
</Menubar.Root>
```

### Fully Controlled

Use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) for complete control over the state's reads and writes.

```svelte
<script lang="ts">
  import { Menubar } from "bits-ui";
  let activeValue = $state("");
  function getValue() {
    return activeValue;
  }
  function setValue(newValue: string) {
    activeValue = newValue;
  }
</script>
<Menubar.Root bind:value={getValue, setValue}>
  <Menubar.Menu value="menu-1">
    <!-- ... -->
  </Menubar.Menu>
  <Menubar.Menu value="menu-2">
    <!-- ... -->
  </Menubar.Menu>
</Menubar.Root>
```

## Radio Groups

You can combine the `Menubar.RadioGroup` and `Menubar.RadioItem` components to create a radio group within a menu.

```svelte
<script lang="ts">
  import { Menubar } from "bits-ui";
  const values = ["one", "two", "three"];
  let value = $state("one");
</script>
<Menubar.RadioGroup bind:value>
  {#each values as value}
    <Menubar.RadioItem {value}>
      {#snippet children({ checked })}
        {#if checked}
          ✅
        {/if}
        {value}
      {/snippet}
    </Menubar.RadioItem>
  {/each}
</Menubar.RadioGroup>
```

## Checkbox Items

You can use the `Menubar.CheckboxItem` component to create a `menuitemcheckbox` element to add checkbox functionality to menu items.

```svelte
<script lang="ts">
  import { Menubar } from "bits-ui";
  let notifications = $state(true);
</script>
<Menubar.CheckboxItem bind:checked={notifications}>
  {#snippet children({ checked, indeterminate })}
    {#if indeterminate}
      -
    {:else if checked}
      ✅
    {/if}
    Notifications
  {/snippet}
</Menubar.CheckboxItem>
```

## Checkbox Groups

You can use the `Menubar.CheckboxGroup` component around a set of `Menubar.CheckboxItem` components to create a checkbox group within a menu, where the `value` prop is an array of the selected values.

```svelte
<script lang="ts">
  import { Menubar } from "bits-ui";
  let colors = $state<string[]>([]);
</script>
<Menubar.CheckboxGroup bind:value={colors}>
  <Menubar.GroupHeading>Favorite color</Menubar.GroupHeading>
  <Menubar.CheckboxItem value="red">
    {#snippet children({ checked })}
      {#if checked}
        ✅
      {/if}
      Red
    {/snippet}
  </Menubar.CheckboxItem>
  <Menubar.CheckboxItem value="blue">
    {#snippet children({ checked })}
      {#if checked}
        ✅
      {/if}
      Blue
    {/snippet}
  </Menubar.CheckboxItem>
  <Menubar.CheckboxItem value="green">
    {#snippet children({ checked })}
      {#if checked}
        ✅
      {/if}
      Green
    {/snippet}
  </Menubar.CheckboxItem>
</Menubar.CheckboxGroup>
```

The `value` state does not persist between menu open/close cycles. To persist the state, you must store it in a `$state` variable and pass it to the `value` prop.

## Nested Menus

You can create nested menus using the `Menubar.Sub` component to create complex menu structures.

```svelte
<script lang="ts">
  import { Menubar } from "bits-ui";
</script>
<Menubar.Content>
  <Menubar.Item>Item 1</Menubar.Item>
  <Menubar.Item>Item 2</Menubar.Item>
  <Menubar.Sub>
    <Menubar.SubTrigger>Open Sub Menu</Menubar.SubTrigger>
    <Menubar.SubContent>
      <Menubar.Item>Sub Item 1</Menubar.Item>
      <Menubar.Item>Sub Item 2</Menubar.Item>
    </Menubar.SubContent>
  </Menubar.Sub>
</Menubar.Content>
```

## Svelte Transitions

You can use the `forceMount` prop along with the `child` snippet to forcefully mount the `Menubar.Content` component to use Svelte Transitions or another animation library that requires more control.

```svelte
<script lang="ts">
  import { Menubar } from "bits-ui";
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

Of course, this isn't the prettiest syntax, so it's recommended to create your own reusable content component that handles this logic if you intend to use this approach. For more information on using transitions with Bits UI components, see the [Transitions](/docs/transitions) documentation.

## API Reference

### Menubar.Root

The root menubar component which manages & scopes the state of the menubar.

| Property          | Type                                                                  | Description                                                                                                                                   | Details |
| ----------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `value` $bindable | `string`                                                              | The value of the currently active menu.`Default:  —— undefined`                                                                               |         |
| `onValueChange`   | `function` - (value: string) => void                                  | A callback function called when the active menu value changes.`Default:  —— undefined`                                                        |         |
| `dir`             | `enum` - 'ltr' \| 'rtl'                                               | The reading direction of the app.`Default: 'ltr'`                                                                                             |         |
| `loop`            | `boolean`                                                             | Whether or not to loop through the menubar menu triggers when navigating with the keyboard.`Default: true`                                    |         |
| `ref` $bindable   | `HTMLDivElement`                                                      | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`        | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`           | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

### Menubar.Menu

A menu within the menubar.

| Property       | Type                                 | Description                                                                                                                   | Details |
| -------------- | ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- | ------- |
| `value`        | `string`                             | The value of this menu within the menubar, used to identify it when determining which menu is active.`Default:  —— undefined` |         |
| `onOpenChange` | `function` - (open: boolean) => void | A callback function called when the open state changes.`Default:  —— undefined`                                               |         |
| `children`     | `Snippet`                            | The children content to render.`Default:  —— undefined`                                                                       |         |

### Menubar.Trigger

The button element which toggles the dropdown menu.

| Property        | Type                                                                  | Description                                                                                                                                   | Details |
| --------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `disabled`      | `boolean`                                                             | Whether or not the menu trigger is disabled.`Default: false`                                                                                  |         |
| `ref` $bindable | `HTMLButtonElement`                                                   | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`      | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`         | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute         | Value                       | Description                                                               | Details |
| ---------------------- | --------------------------- | ------------------------------------------------------------------------- | ------- |
| `data-state`           | `enum` - 'open' \| 'closed' | The open state of the menu or submenu the element controls or belongs to. |         |
| `data-menubar-trigger` | `''`                        | Present on the trigger element.                                           |         |

### Menubar.Portal

A component that portals the content of the dropdown menu to the body or a custom target (if provided).

| Property   | Type                        | Description                                                                                                                      | Details |
| ---------- | --------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `to`       | `union` - Element \| string | Where to render the content when it is open. Defaults to the body.`Default: document.body`                                       |         |
| `disabled` | `boolean`                   | Whether the portal is disabled or not. When disabled, the content will be rendered in its original DOM location.`Default: false` |         |
| `children` | `Snippet`                   | The children content to render.`Default:  —— undefined`                                                                          |         |

### Menubar.Content

The content displayed when the dropdown menu is open.

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

| Data Attribute         | Value                       | Description                                                               | Details |
| ---------------------- | --------------------------- | ------------------------------------------------------------------------- | ------- |
| `data-state`           | `enum` - 'open' \| 'closed' | The open state of the menu or submenu the element controls or belongs to. |         |
| `data-menubar-content` | `''`                        | Present on the content element.                                           |         |

| CSS Variable                                   | Description                                  | Details |
| ---------------------------------------------- | -------------------------------------------- | ------- |
| `--bits-menubar-menu-content-transform-origin` | The transform origin of the content element. |         |
| `--bits-menubar-menu-content-available-width`  | The available width of the content element.  |         |
| `--bits-menubar-menu-content-available-height` | The available height of the content element. |         |
| `--bits-menubar-menu-anchor-width`             | The width of the anchor element.             |         |
| `--bits-menubar-menu-anchor-height`            | The height of the anchor element.            |         |

### Menubar.Item

A menu item within the dropdown menu.

| Property        | Type                                                                  | Description                                                                                                                                   | Details |
| --------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `disabled`      | `boolean`                                                             | Whether or not the menu item is disabled.`Default: false`                                                                                     |         |
| `textValue`     | `string`                                                              | The text value of the checkbox menu item. This is used for typeahead.`Default:  —— undefined`                                                 |         |
| `onSelect`      | `function` - () => void                                               | A callback that is fired when the menu item is selected.`Default:  —— undefined`                                                              |         |
| `closeOnSelect` | `boolean`                                                             | Whether or not the menu item should close when selected.`Default: true`                                                                       |         |
| `ref` $bindable | `HTMLDivElement`                                                      | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`      | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`         | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute      | Value      | Description                                | Details |
| ------------------- | ---------- | ------------------------------------------ | ------- |
| `data-orientation`  | `vertical` | The orientation of the menu.               |         |
| `data-highlighted`  | `''`       | Present when the menu item is highlighted. |         |
| `data-disabled`     | `''`       | Present when the menu item is disabled.    |         |
| `data-menubar-item` | `''`       | Present on the item element.               |         |

### Menubar.CheckboxGroup

A group of checkbox menu items, where multiple can be checked at a time.

| Property          | Type                                                                  | Description                                                                                                                                   | Details |
| ----------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `value` $bindable | `string[]`                                                            | The value of the group. This is an array of the values of the checked checkboxes within the group.`Default: []`                               |         |
| `onValueChange`   | `function` - (value: string\[]) => void                               | A callback that is fired when the checkbox group's value state changes.`Default:  —— undefined`                                               |         |
| `ref` $bindable   | `HTMLDivElement`                                                      | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`        | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`           | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute                | Value | Description                            | Details |
| ----------------------------- | ----- | -------------------------------------- | ------- |
| `data-menubar-checkbox-group` | `''`  | Present on the checkbox group element. |         |

### Menubar.CheckboxItem

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

| Data Attribute               | Value                                                | Description                                | Details |
| ---------------------------- | ---------------------------------------------------- | ------------------------------------------ | ------- |
| `data-orientation`           | `vertical`                                           | The orientation of the menu.               |         |
| `data-highlighted`           | `''`                                                 | Present when the menu item is highlighted. |         |
| `data-disabled`              | `''`                                                 | Present when the menu item is disabled.    |         |
| `data-state`                 | `enum` - 'checked' \| 'unchecked' \| 'indeterminate' | The checkbox menu item's checked state.    |         |
| `data-menubar-checkbox-item` | `''`                                                 | Present on the checkbox item element.      |         |

### Menubar.RadioGroup

A group of radio menu items, where only one can be checked at a time.

| Property          | Type                                                                  | Description                                                                                                                                   | Details |
| ----------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `value` $bindable | `string`                                                              | The value of the currently checked radio menu item.`Default:  —— undefined`                                                                   |         |
| `onValueChange`   | `function` - (value: string) => void                                  | A callback that is fired when the radio group's value changes.`Default:  —— undefined`                                                        |         |
| `ref` $bindable   | `HTMLDivElement`                                                      | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`        | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`           | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute             | Value | Description                         | Details |
| -------------------------- | ----- | ----------------------------------- | ------- |
| `data-menubar-radio-group` | `''`  | Present on the radio group element. |         |

### Menubar.RadioItem

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

| Data Attribute            | Value                             | Description                                | Details |
| ------------------------- | --------------------------------- | ------------------------------------------ | ------- |
| `data-orientation`        | `vertical`                        | The orientation of the menu.               |         |
| `data-highlighted`        | `''`                              | Present when the menu item is highlighted. |         |
| `data-disabled`           | `''`                              | Present when the menu item is disabled.    |         |
| `data-state`              | `enum` - 'checked' \| 'unchecked' | The radio menu item's checked state.       |         |
| `data-value`              | `''`                              | The value of the radio item.               |         |
| `data-menubar-radio-item` | `''`                              | Present on the radio item element.         |         |

### Menubar.Separator

A horizontal line to visually separate menu items.

| Property        | Type                                                                  | Description                                                                                                                                   | Details |
| --------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `ref` $bindable | `HTMLDivElement`                                                      | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`      | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`         | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute           | Value      | Description                       | Details |
| ------------------------ | ---------- | --------------------------------- | ------- |
| `data-orientation`       | `vertical` | The orientation of the separator. |         |
| `data-menu-separator`    | `''`       | Present on the separator element. |         |
| `data-menubar-separator` | `''`       | Present on the separator element. |         |

### Menubar.Arrow

An optional arrow which points to the dropdown menu's anchor/trigger point.

| Property        | Type                                                                  | Description                                                                                                                                   | Details |
| --------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `width`         | `number`                                                              | The width of the arrow in pixels.`Default: 8`                                                                                                 |         |
| `height`        | `number`                                                              | The height of the arrow in pixels.`Default: 8`                                                                                                |         |
| `ref` $bindable | `HTMLDivElement`                                                      | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`      | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`         | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute       | Value                       | Description                                                               | Details |
| -------------------- | --------------------------- | ------------------------------------------------------------------------- | ------- |
| `data-state`         | `enum` - 'open' \| 'closed' | The open state of the menu or submenu the element controls or belongs to. |         |
| `data-menubar-arrow` | `''`                        | Present on the arrow element.                                             |         |

### Menubar.Group

A group of menu items. It should be passed an `aria-label` or have a child `Menu.GroupHeading` component to provide a label for a group of menu items.

| Property        | Type                                                                  | Description                                                                                                                                   | Details |
| --------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `ref` $bindable | `HTMLDivElement`                                                      | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`      | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`         | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute       | Value | Description                   | Details |
| -------------------- | ----- | ----------------------------- | ------- |
| `data-menubar-group` | `''`  | Present on the group element. |         |

### Menubar.GroupHeading

A heading for a group which will be skipped when navigating with the keyboard. It is used to provide a heading for a group of menu items and must be a child of either a `Menubar.Group` or `Menubar.RadioGroup` component.

| Property        | Type                                                                  | Description                                                                                                                                   | Details |
| --------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `ref` $bindable | `HTMLDivElement`                                                      | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`      | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`         | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute               | Value | Description                           | Details |
| ---------------------------- | ----- | ------------------------------------- | ------- |
| `data-menubar-group-heading` | `''`  | Present on the group heading element. |         |

### Menubar.Sub

A submenu belonging to the parent dropdown menu. Responsible for managing the state of the submenu.

| Property               | Type                                 | Description                                                                                                        | Details |
| ---------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------ | ------- |
| `open` $bindable       | `boolean`                            | The open state of the submenu.`Default: false`                                                                     |         |
| `onOpenChange`         | `function` - (open: boolean) => void | A callback function called when the open state changes.`Default:  —— undefined`                                    |         |
| `onOpenChangeComplete` | `function` - (open: boolean) => void | A callback function called after the open state changes and all animations have completed.`Default:  —— undefined` |         |
| `children`             | `Snippet`                            | The children content to render.`Default:  —— undefined`                                                            |         |

### Menubar.SubTrigger

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

| Data Attribute             | Value                       | Description                                                               | Details |
| -------------------------- | --------------------------- | ------------------------------------------------------------------------- | ------- |
| `data-orientation`         | `vertical`                  | The orientation of the menu.                                              |         |
| `data-highlighted`         | `''`                        | Present when the menu item is highlighted.                                |         |
| `data-disabled`            | `''`                        | Present when the menu item is disabled.                                   |         |
| `data-state`               | `enum` - 'open' \| 'closed' | The open state of the menu or submenu the element controls or belongs to. |         |
| `data-menubar-sub-trigger` | `''`                        | Present on the submenu trigger element.                                   |         |

### Menubar.SubContent

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

| Data Attribute             | Value                       | Description                                                               | Details |
| -------------------------- | --------------------------- | ------------------------------------------------------------------------- | ------- |
| `data-state`               | `enum` - 'open' \| 'closed' | The open state of the menu or submenu the element controls or belongs to. |         |
| `data-menubar-sub-content` | `''`                        | Present on the submenu content element.                                   |         |

### Menubar.SubContentStatic

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

| Data Attribute             | Value                       | Description                                                               | Details |
| -------------------------- | --------------------------- | ------------------------------------------------------------------------- | ------- |
| `data-state`               | `enum` - 'open' \| 'closed' | The open state of the menu or submenu the element controls or belongs to. |         |
| `data-menubar-sub-content` | `''`                        | Present on the submenu content element.                                   |         |

[Previous Link Preview](/docs/components/link-preview) [Next Meter](/docs/components/meter)