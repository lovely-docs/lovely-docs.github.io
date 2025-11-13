# Toolbar Documentation

Displays frequently used actions or tools in a compact and easily accessible bar.

This is a documentation section that potentially contains examples, demos, and other useful information related to a specific part of Bits UI. When helping users with this documentation, you can ignore the classnames applied to the demos unless they are relevant to the user's issue.

Copy Page

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
<Toolbar.Root
  class="rounded-10px border-border bg-background-alt shadow-mini flex h-12 min-w-max items-center justify-center border px-[4px] py-1"
>
  <Toolbar.Group
    bind:value={text}
    type="multiple"
    class="flex items-center gap-x-0.5"
  >
    <Toolbar.GroupItem
      aria-label="toggle bold"
      value="bold"
      class="rounded-9px bg-background-alt text-foreground/60 hover:bg-muted active:bg-dark-10 data-[state=on]:bg-muted data-[state=on]:text-foreground/80 active:data-[state=on]:bg-dark-10 inline-flex size-10 items-center justify-center transition-all active:scale-[0.98]"
    >
      <TextB class="size-6" />
    </Toolbar.GroupItem>
    <Toolbar.GroupItem
      aria-label="toggle italic"
      value="italic"
      class="rounded-9px bg-background-alt text-foreground/60 hover:bg-muted active:bg-dark-10 data-[state=on]:bg-muted data-[state=on]:text-foreground/80 active:data-[state=on]:bg-dark-10 inline-flex size-10 items-center justify-center transition-all active:scale-[0.98]"
    >
      <TextItalic class="size-6" />
    </Toolbar.GroupItem>
    <Toolbar.GroupItem
      aria-label="toggle strikethrough"
      value="strikethrough"
      class="rounded-9px bg-background-alt text-foreground/60 hover:bg-muted active:bg-dark-10 data-[state=on]:bg-muted data-[state=on]:text-foreground/80 active:data-[state=on]:bg-dark-10 inline-flex size-10 items-center justify-center transition-all active:scale-[0.98]"
    >
      <TextStrikethrough class="size-6" />
    </Toolbar.GroupItem>
  </Toolbar.Group>
  <Separator.Root class="bg-dark-10 -my-1 mx-1 w-[1px] self-stretch" />
  <Toolbar.Group
    bind:value={align}
    type="single"
    class="flex items-center gap-x-0.5"
  >
    <Toolbar.GroupItem
      aria-label="align left"
      value="left"
      class="rounded-9px bg-background-alt text-foreground/60 hover:bg-muted active:bg-dark-10 data-[state=on]:bg-muted data-[state=on]:text-foreground/80 active:data-[state=on]:bg-dark-10 inline-flex size-10 items-center justify-center transition-all active:scale-[0.98]"
    >
      <TextAlignLeft class="size-6" />
    </Toolbar.GroupItem>
    <Toolbar.GroupItem
      aria-label="align center"
      value="center"
      class="rounded-9px bg-background-alt text-foreground/60 hover:bg-muted active:bg-dark-10 data-[state=on]:bg-muted data-[state=on]:text-foreground/80 active:data-[state=on]:bg-dark-10 inline-flex size-10 items-center justify-center transition-all active:scale-[0.98]"
    >
      <TextAlignCenter class="size-6" />
    </Toolbar.GroupItem>
    <Toolbar.GroupItem
      aria-label="align right"
      value="right"
      class="rounded-9px bg-background-alt text-foreground/60 hover:bg-muted active:bg-dark-10 data-[state=on]:bg-muted data-[state=on]:text-foreground/80 active:data-[state=on]:bg-dark-10 inline-flex size-10 items-center justify-center transition-all active:scale-[0.98]"
    >
      <TextAlignRight class="size-6" />
    </Toolbar.GroupItem>
  </Toolbar.Group>
  <Separator.Root class="bg-dark-10 -my-1 mx-1 w-[1px] self-stretch" />
  <div class="flex items-center">
    <Toolbar.Button
      class="rounded-9px text-foreground/80 hover:bg-muted active:bg-dark-10 inline-flex items-center justify-center  px-3 py-2 text-sm font-medium transition-all active:scale-[0.98]"
    >
      <Sparkle class="mr-2 size-6" />
      <span> Ask AI </span>
    </Toolbar.Button>
  </div>
</Toolbar.Root>
```

## Structure

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

## Managing Value State

This section covers how to manage the `value` state of the component.

### Two-Way Binding

Use `bind:value` for simple, automatic state synchronization:

```svelte
<script lang="ts">
  import { Toolbar } from "bits-ui";
  let myValue = $state("");
</script>
<button onclick={() => (myValue = "item-1")}> Press item 1 </button>
<Toolbar.Root>
  <Toolbar.Group type="single" bind:value={myValue}>
    <!-- ... -->
  </Toolbar.Group>
</Toolbar.Root>
```

### Fully Controlled

Use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) for complete control over the state's reads and writes.

```svelte
<script lang="ts">
  import { Toolbar } from "bits-ui";
  let myValue = $state("");
  function getValue() {
    return myValue;
  }
  function setValue(newValue: string) {
    myValue = newValue;
  }
</script>
<Toolbar.Root>
  <Toolbar.Group type="single" bind:value={getValue, setValue}>
    <!-- ... -->
  </Toolbar.Group>
</Toolbar.Root>
```

## API Reference

### Toolbar.Root

The root component which contains the toolbar.

| Property        | Type                                                                  | Description                                                                                                                                   | Details |
| --------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `loop`          | `boolean`                                                             | Whether or not the toolbar should loop when navigating.`Default: true`                                                                        |         |
| `orientation`   | `enum` - 'horizontal' \| 'vertical'                                   | The orientation of the toolbar.`Default: 'horizontal'`                                                                                        |         |
| `ref` $bindable | `HTMLDivElement`                                                      | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`      | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`         | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute      | Value                               | Description                       | Details |
| ------------------- | ----------------------------------- | --------------------------------- | ------- |
| `data-orientation`  | `enum` - 'vertical' \| 'horizontal' | The orientation of the component. |         |
| `data-toolbar-root` | `''`                                | Present on the root element.      |         |

### Toolbar.Button

A button in the toolbar.

| Property        | Type                                                                  | Description                                                                                                                                   | Details |
| --------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `disabled`      | `boolean`                                                             | Whether or not the button is disabled.`Default: false`                                                                                        |         |
| `ref` $bindable | `HTMLButtonElement`                                                   | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`      | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`         | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute        | Value | Description                    | Details |
| --------------------- | ----- | ------------------------------ | ------- |
| `data-toolbar-button` | `''`  | Present on the button element. |         |

### Toolbar.Link

A link in the toolbar.

| Property        | Type                                                                  | Description                                                                                                                                   | Details |
| --------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `ref` $bindable | `HTMLAnchorElement`                                                   | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`      | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`         | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute      | Value | Description                  | Details |
| ------------------- | ----- | ---------------------------- | ------- |
| `data-toolbar-link` | `''`  | Present on the link element. |         |

### Toolbar.Group

A group of toggle items in the toolbar.

| Property          | Type                                                                  | Description                                                                                                                                      | Details |
| ----------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| `type` required   | `enum` - 'single' \| 'multiple'                                       | The type of the component, used to determine the type of the value, when `'multiple'` the value will be an array.`Default:  —— undefined`        |         |
| `value` $bindable | `union` - string \| string\[]                                         | The value of the toggle group. If the type is multiple, this will be an array of strings, otherwise it will be a string.`Default:  —— undefined` |         |
| `onValueChange`   | `function` - (value: string) => void \| (value: string\[]) => void    | A callback function called when the value changes.`Default:  —— undefined`                                                                       |         |
| `disabled`        | `boolean`                                                             | Whether or not the switch is disabled.`Default: false`                                                                                           |         |
| `ref` $bindable   | `HTMLDivElement`                                                      | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                                |         |
| `children`        | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                          |         |
| `child`           | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined`    |         |

| Data Attribute       | Value | Description                   | Details |
| -------------------- | ----- | ----------------------------- | ------- |
| `data-toolbar-group` | `''`  | Present on the group element. |         |

### Toolbar.GroupItem

A toggle item in the toolbar toggle group.

| Property         | Type                                                                  | Description                                                                                                                                                                                                                                                                           | Details |
| ---------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `value` required | `string`                                                              | The value of the toolbar toggle group item. When the toolbar toggle group item is selected, toolbar the toggle group's value will be set to this value if in single mode, or this value will be pushed to the toggle group's array value if in multiple mode.`Default:  —— undefined` |         |
| `disabled`       | `boolean`                                                             | Whether or not the item is disabled.`Default: false`                                                                                                                                                                                                                                  |         |
| `ref` $bindable  | `HTMLButtonElement`                                                   | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                                                                                                                                                                     |         |
| `children`       | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                                                                                                                                                               |         |
| `child`          | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined`                                                                                                                                         |         |

| Data Attribute      | Value                  | Description                                                | Details |
| ------------------- | ---------------------- | ---------------------------------------------------------- | ------- |
| `data-state`        | `enum` - 'on' \| 'off' | Whether the toolbar toggle item is in the on or off state. |         |
| `data-value`        | `''`                   | The value of the toolbar toggle item.                      |         |
| `data-disabled`     | `''`                   | Present when the toolbar toggle item is disabled.          |         |
| `data-toolbar-item` | `''`                   | Present on the toolbar toggle item.                        |         |

[Previous Toggle Group](/docs/components/toggle-group) [Next Tooltip](/docs/components/tooltip)