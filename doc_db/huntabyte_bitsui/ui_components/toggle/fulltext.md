# Toggle Documentation

A toggle control that allows users to switch between two states.

This is a documentation section that potentially contains examples, demos, and other useful information related to a specific part of Bits UI. When helping users with this documentation, you can ignore the classnames applied to the demos unless they are relevant to the user's issue.

Copy Page

```svelte
<script lang="ts">
  import { Toggle } from "bits-ui";
  import LockKeyOpen from "phosphor-svelte/lib/LockKeyOpen";
  let unlocked = $state(false);
  const code = $derived(unlocked ? "B1T5" : "••••");
</script>
<div
  class="min-h-input rounded-card-sm border-border bg-background-alt shadow-mini flex h-full w-[176px] items-center gap-2 border py-1 pl-[18px] pr-1.5"
>
  <div
    class="font-alt text-end text-[19px] tracking-[13.87px] {unlocked
      ? 'text-foreground'
      : 'text-muted-foreground'}"
  >
    {code}
  </div>
  <Toggle.Root
    aria-label="toggle code visibility"
    class="bg-background-alt hover:bg-muted active:bg-dark-10 data-[state=on]:bg-muted data-[state=off]:text-foreground-alt data-[state=on]:text-foreground active:data-[state=on]:bg-dark-10 inline-flex size-10 items-center justify-center rounded-[9px] transition-all active:scale-[0.98]"
    bind:pressed={unlocked}
  >
    <LockKeyOpen class="size-6" />
  </Toggle.Root>
</div>
```

## Structure

```svelte
<script lang="ts">
  import { Toggle } from "bits-ui";
</script>
<Toggle.Root />
```

## Managing Pressed State

This section covers how to manage the `pressed` state of the component.

### Two-Way Binding

Use `bind:pressed` for simple, automatic state synchronization:

```svelte
<script lang="ts">
  import { Toggle } from "bits-ui";
  let myPressed = $state(true);
</script>
<button onclick={() => (myPressed = false)}> un-press </button>
<Toggle.Root bind:pressed={myPressed} />
```

### Fully Controlled

Use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) for complete control over the state's reads and writes.

```svelte
<script lang="ts">
  import { Toggle } from "bits-ui";
  let myPressed = $state(false);
  function getPressed() {
    return myPressed;
  }
  function setPressed(newPressed: boolean) {
    myPressed = newPressed;
  }
</script>
<Toggle.Root bind:pressed={getPressed, setPressed}>
  <!-- ... -->
</Toggle.Root>
```

## API Reference

### Toggle.Root

The toggle button.

| Property            | Type                                                                  | Description                                                                                                                                   | Details |
| ------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `pressed` $bindable | `boolean`                                                             | Whether or not the toggle button is pressed.`Default: false`                                                                                  |         |
| `onPressedChange`   | `function` - (pressed: boolean) => void                               | A callback function called when the pressed state of the toggle changes.`Default:  —— undefined`                                              |         |
| `disabled`          | `boolean`                                                             | Whether or not the switch is disabled.`Default: false`                                                                                        |         |
| `ref` $bindable     | `HTMLButtonElement`                                                   | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`          | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`             | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute     | Value                  | Description                                   | Details |
| ------------------ | ---------------------- | --------------------------------------------- | ------- |
| `data-state`       | `enum` - 'on' \| 'off' | Whether the toggle is in the on or off state. |         |
| `data-disabled`    | `''`                   | Present when the toggle is disabled.          |         |
| `data-toggle-root` | `''`                   | Present on the root element.                  |         |

[Previous Time Range Field](/docs/components/time-range-field) [Next Toggle Group](/docs/components/toggle-group)