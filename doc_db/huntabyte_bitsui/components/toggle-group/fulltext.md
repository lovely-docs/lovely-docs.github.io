# Toggle Group Documentation

Groups multiple toggle controls, allowing users to enable one or multiple options.

This is a documentation section that potentially contains examples, demos, and other useful information related to a specific part of Bits UI. When helping users with this documentation, you can ignore the classnames applied to the demos unless they are relevant to the user's issue.

Copy Page

```svelte
<script lang="ts">
  import { ToggleGroup } from "bits-ui";
  import TextB from "phosphor-svelte/lib/TextB";
  import TextItalic from "phosphor-svelte/lib/TextItalic";
  import TextStrikethrough from "phosphor-svelte/lib/TextStrikethrough";
  let value: string[] = $state(["bold"]);
</script>
<ToggleGroup.Root
  bind:value
  type="multiple"
  class="h-input rounded-card-sm border-border bg-background-alt shadow-mini flex items-center gap-x-0.5 border px-[4px] py-1"
>
  <ToggleGroup.Item
    aria-label="toggle bold"
    value="bold"
    class="rounded-9px bg-background-alt hover:bg-muted active:bg-dark-10 data-[state=on]:bg-muted data-[state=off]:text-foreground-alt data-[state=on]:text-foreground active:data-[state=on]:bg-dark-10 inline-flex size-10 items-center justify-center transition-all active:scale-[0.98]"
  >
    <TextB class="size-6" />
  </ToggleGroup.Item>
  <ToggleGroup.Item
    aria-label="toggle italic"
    value="italic"
    class="rounded-9px bg-background-alt hover:bg-muted active:bg-dark-10 data-[state=on]:bg-muted data-[state=off]:text-foreground-alt data-[state=on]:text-foreground active:data-[state=on]:bg-dark-10 inline-flex size-10 items-center justify-center transition-all active:scale-[0.98]"
  >
    <TextItalic class="size-6" />
  </ToggleGroup.Item>
  <ToggleGroup.Item
    aria-label="toggle strikethrough"
    value="strikethrough"
    class="rounded-9px bg-background-alt hover:bg-muted active:bg-dark-10 data-[state=on]:bg-muted data-[state=off]:text-foreground-alt data-[state=on]:text-foreground active:data-[state=on]:bg-dark-10 inline-flex size-10 items-center justify-center transition-all active:scale-[0.98]"
  >
    <TextStrikethrough class="size-6" />
  </ToggleGroup.Item>
</ToggleGroup.Root>
```

## Structure

```svelte
<script lang="ts">
  import { ToggleGroup } from "bits-ui";
</script>
<ToggleGroup.Root>
  <ToggleGroup.Item value="bold">bold</ToggleGroup.Item>
  <ToggleGroup.Item value="italic">italic</ToggleGroup.Item>
</ToggleGroup.Root>
```

## Single & Multiple

The `ToggleGroup` component supports two `type` props, `'single'` and `'multiple'`. When the `type` is set to `'single'`, the `ToggleGroup` will only allow a single item to be selected at a time, and the type of the `value` prop will be a string.

When the `type` is set to `'multiple'`, the `ToggleGroup` will allow multiple items to be selected at a time, and the type of the `value` prop will be an array of strings.

## Managing Value State

This section covers how to manage the `value` state of the component.

### Two-Way Binding

Use `bind:value` for simple, automatic state synchronization:

```svelte
<script lang="ts">
  import { ToggleGroup } from "bits-ui";
  let myValue = $state("");
</script>
<button onclick={() => (myValue = "item-1")}> Press item 1 </button>
<ToggleGroup.Root type="single" bind:value={myValue}>
  <!-- -->
</ToggleGroup.Root>
```

### Fully Controlled

Use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) for complete control over the state's reads and writes.

```svelte
<script lang="ts">
  import { ToggleGroup } from "bits-ui";
  let myValue = $state("");
  function getValue() {
    return myValue;
  }
  function setValue(newValue: string) {
    myValue = newValue;
  }
</script>
<ToggleGroup.Root type="single" bind:value={getValue, setValue}>
  <!-- ... -->
</ToggleGroup.Root>
```

## API Reference

### ToggleGroup.Root

The root component which contains the toggle group items.

| Property          | Type                                                                  | Description                                                                                                                                                        | Details |
| ----------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| `type` required   | `enum` - 'single' \| 'multiple'                                       | The type of the component, used to determine the type of the value, when `'multiple'` the value will be an array.`Default:  —— undefined`                          |         |
| `value` $bindable | `union` - string \| string\[]                                         | The value of the toggle group. If the `type` is `'multiple'`, this will be an array of strings, otherwise it will be a string.`Default:  —— undefined`             |         |
| `onValueChange`   | `function` - (value: string) => void \| (value: string\[]) => void    | A callback function called when the value of the toggle group changes. The type of the value is dependent on the type of the toggle group.`Default:  —— undefined` |         |
| `disabled`        | `boolean`                                                             | Whether or not the switch is disabled.`Default: false`                                                                                                             |         |
| `loop`            | `boolean`                                                             | Whether or not the toggle group should loop when navigating.`Default: true`                                                                                        |         |
| `orientation`     | `enum` - 'horizontal' \| 'vertical'                                   | The orientation of the toggle group.`Default: 'horizontal'`                                                                                                        |         |
| `rovingFocus`     | `boolean`                                                             | Whether or not the toggle group should use roving focus when navigating.`Default: true`                                                                            |         |
| `ref` $bindable   | `HTMLDivElement`                                                      | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                                                  |         |
| `children`        | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                                            |         |
| `child`           | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined`                      |         |

| Data Attribute           | Value                               | Description                          | Details |
| ------------------------ | ----------------------------------- | ------------------------------------ | ------- |
| `data-orientation`       | `enum` - 'horizontal' \| 'vertical' | The orientation of the toggle group. |         |
| `data-toggle-group-root` | `''`                                | Present on the root element.         |         |

### ToggleGroup.Item

An individual toggle item within the group.

| Property        | Type                                                                  | Description                                                                                                                                   | Details |
| --------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `value`         | `string`                                                              | The value of the item.`Default:  —— undefined`                                                                                                |         |
| `disabled`      | `boolean`                                                             | Whether or not the switch is disabled.`Default: false`                                                                                        |         |
| `ref` $bindable | `HTMLButtonElement`                                                   | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`      | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`         | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute           | Value                               | Description                                        | Details |
| ------------------------ | ----------------------------------- | -------------------------------------------------- | ------- |
| `data-state`             | `enum` - 'on' \| 'off'              | Whether the toggle item is in the on or off state. |         |
| `data-value`             | `''`                                | The value of the toggle item.                      |         |
| `data-orientation`       | `enum` - 'horizontal' \| 'vertical' | The orientation of the toggle group.               |         |
| `data-disabled`          | `''`                                | Present when the toggle item is disabled.          |         |
| `data-toggle-group-item` | `''`                                | Present on the toggle group item.                  |         |

[Previous Toggle](/docs/components/toggle) [Next Toolbar](/docs/components/toolbar)